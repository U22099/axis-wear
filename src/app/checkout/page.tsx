'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { db, Order } from '@/lib/database';
import { paystack } from '@/lib/paystack';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Loader2, CreditCard, Sparkles, UserCheck, Clipboard, FileText, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'framer-motion';

interface AddressData {
  fullName: string;
  addressLine1: string;
  city: string;
  state: string;
  zip: string;
}

export default function CheckoutPage() {
  const { user, isLoading: authLoading, updateUserAddress, updateProfileName } = useAuth();
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Address State
  const [shipping, setShipping] = useState<AddressData>({
    fullName: '',
    addressLine1: '',
    city: '',
    state: '',
    zip: '',
  });
  
  const [billing, setBilling] = useState<AddressData>({
    fullName: '',
    addressLine1: '',
    city: '',
    state: '',
    zip: '',
  });

  const [useSameAddress, setUseSameAddress] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Checkout Actions State
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Past Orders State
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Simulated Payment Mock Modal
  const [showMockModal, setShowMockModal] = useState(false);
  const [mockReference, setMockReference] = useState<string>('');

  // Handle Paystack redirect verification parameters
  const paystackRef = searchParams.get('paystack_verify_reference') || searchParams.get('reference');
  const mockRefParam = searchParams.get('mock_pay_reference');

  // Load profile addresses & order logs
  useEffect(() => {
    if (user) {
      if (user.shipping_address && Object.keys(user.shipping_address).length > 0) {
        setShipping(user.shipping_address as AddressData);
      } else if (user.name) {
        setShipping(prev => ({ ...prev, fullName: user.name || '' }));
      }
      
      if (user.billing_address && Object.keys(user.billing_address).length > 0) {
        setBilling(user.billing_address as AddressData);
        setUseSameAddress(false);
      }

      loadOrders(user.id);
    }
  }, [user]);

  // Handle Paystack callback parameter check
  useEffect(() => {
    if (paystackRef) {
      verifyPaystackPayment(paystackRef);
    } else if (mockRefParam) {
      setMockReference(mockRefParam);
      setShowMockModal(true);
    }
  }, [paystackRef, mockRefParam]);

  const loadOrders = async (userId: string) => {
    setOrdersLoading(true);
    try {
        const { data, error } = await db.getSupabase()
          .from('orders')
          .select('*, order_items(*, variant:product_variants(*, product:products(*)))')
          .eq('profile_id', userId)
          .order('created_at', { ascending: false });
        if (!error && data) {
          setPastOrders(data);
        }
    } catch (e) {
      console.error('Error fetching user orders', e);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleSaveAddresses = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSavingProfile(true);
    setSaveSuccess(false);

    try {
      await updateProfileName(shipping.fullName);
      await updateUserAddress('shipping', shipping);
      
      if (useSameAddress) {
        await updateUserAddress('billing', shipping);
      } else {
        await updateUserAddress('billing', billing);
      }
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const verifyPaystackPayment = async (reference: string) => {
    setCheckoutLoading(true);
    setErrorMessage(null);
    try {
      // Direct call to verification helper
      const res = await paystack.verifyTransaction(reference);
      if (res.success) {
        // Payment success! Let's update database order status
        const order = await db.getOrderByReference(reference);
        if (order && order.status !== 'paid') {
          await db.updateOrderStatus(reference, 'paid');
          
          // Decrement variant stock
          const orderWithItems = await db.getOrderByReference(order.paystack_reference);
          if (orderWithItems?.order_items) {
            for (const item of orderWithItems.order_items) {
              await db.updateVariantStock(item.variant_id, item.quantity);
            }
          }
          
          triggerCelebration();
          clearCart();
          if (user) loadOrders(user.id);
          router.replace('/checkout?status=success');
        }
      } else {
        setErrorMessage(res.error || 'Verification failed. Payment declined.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment verification failed.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleCheckoutSubmit = async () => {
    if (items.length === 0) return;
    setErrorMessage(null);
    setCheckoutLoading(true);

    try {
      // 1. Double check stock levels to prevent overselling
      //await refreshStore();
      const liveVariants = await db.getLiveVariants()
      for (const item of items) {
        const currentStock = liveVariants.find(x => x.product_id === item.variantId)?.stock ?? item.stock;
        if (item.quantity > currentStock) {
          throw new Error(`Insufficient stock for ${item.product.name} (Size ${item.size}). Only ${currentStock} units left.`);
        }
      }

      const emailAddress = user?.email || 'guest@axiswear.com';
      const userId = user?.id || null;

      // 2. Initialize Paystack Transaction via secure Server API request
      const origin = window.location.origin;
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: emailAddress,
          amount: total,
          items: items.map(item => ({
            variantId: item.variantId,
            qty: item.quantity,
            price: item.product.price
          })),
          origin,
          userId
        })
      });

      const res = await response.json();

      if (res.success && res.authorizationUrl) {
        // Redirect to payment authorization URL
        window.location.href = res.authorizationUrl;
      } else {
        throw new Error(res.error || 'Initialization rejected.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to establish checkout session.');
      setCheckoutLoading(false);
    }
  };

  // Mock checkout processor
  const handleSimulatePayment = async (success: boolean) => {
    setShowMockModal(false);
    if (!mockReference) return;

    if (success) {
      await verifyPaystackPayment(mockReference);
    } else {
      setErrorMessage('Mock transaction cancelled by user.');
    }
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffffff', '#1a1a1a', '#a1a1a1']
    });
  };

  const isSuccess = searchParams.get('status') === 'success';

  return (
    <>
      <Header />
      
      <main className="grow bg-black py-16 px-6 md:px-12 relative">
        <div className="absolute inset-0 blueprint-grid-bg opacity-15 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 pb-6 border-b border-border-blueprint">
            <div className="space-y-1">
              <span className="text-xs font-mono tracking-widest text-zinc-500">// SHIPPING & PROTOCOL</span>
              <h2 className="text-3xl font-display font-extrabold tracking-tight uppercase">SHIELD CHECKOUT</h2>
            </div>
            <div className="text-[10px] font-mono text-zinc-500 mt-4 md:mt-0 uppercase">
              SECTOR SECURITY CODE // ENCRYPTED_TLS_V1.3
            </div>
          </div>

          {/* Success Banner */}
          {isSuccess && (
            <div className="mb-12 p-8 border border-emerald-900 bg-emerald-950/10 flex flex-col md:flex-row items-center gap-6 blueprint-corner">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 shrink-0" />
              <div className="space-y-1 text-center md:text-left grow">
                <h4 className="font-display font-bold text-lg text-white uppercase">SHIELD ACQUISITION SUCCESSFUL</h4>
                <p className="text-xs font-mono text-zinc-400">
                  Payment validated successfully. Order status updated [PAID]. Inventory dispatched for sector delivery.
                </p>
              </div>
              <button
                onClick={() => router.replace('/')}
                className="px-6 py-2.5 bg-white text-black text-xs font-mono font-bold tracking-widest hover:bg-zinc-200 transition-colors uppercase border border-white shrink-0"
              >
                Return to Grid
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="mb-8 p-4 bg-red-950/20 border border-red-900/50 text-red-400 text-xs font-mono text-center">
              SYSTEM ERROR: {errorMessage}
            </div>
          )}

          {checkoutLoading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4 font-mono text-xs text-zinc-500">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
              <span>COMMUNICATING WITH GATEWAY SCHEDULER...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Left Side: Address form & Order logs */}
              <div className="lg:col-span-7 space-y-12">
                {/* 1. Address Profiles */}
                {user ? (
                  <div className="border border-border-blueprint bg-charcoal-900/40 p-8 relative blueprint-corner">
                    <div className="absolute top-2 right-2 text-[8px] font-mono text-zinc-700">PROFILE ADDRESS // DEPLOY_ v4.1</div>
                    
                    <form onSubmit={handleSaveAddresses} className="space-y-6">
                      <div className="flex items-center gap-2 border-b border-border-blueprint pb-4 mb-4">
                        <UserCheck className="w-4 h-4 text-zinc-400" />
                        <span className="text-xs font-mono tracking-widest text-white uppercase">SHIPPING DISPATCH DETAILS</span>
                      </div>

                      {/* Shipping input fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-zinc-500 uppercase">FULL DEPLOYMENT NAME</label>
                          <input
                            type="text"
                            required
                            value={shipping.fullName}
                            onChange={(e) => setShipping(prev => ({ ...prev, fullName: e.target.value }))}
                            placeholder="Stealth Operator"
                            className="w-full bg-black border border-border-blueprint text-zinc-300 px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-zinc-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-zinc-500 uppercase">SHIPPING ADDRESS LINE 1</label>
                          <input
                            type="text"
                            required
                            value={shipping.addressLine1}
                            onChange={(e) => setShipping(prev => ({ ...prev, addressLine1: e.target.value }))}
                            placeholder="12 Sector Gate Ave"
                            className="w-full bg-black border border-border-blueprint text-zinc-300 px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-zinc-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-zinc-500 uppercase">CITY</label>
                          <input
                            type="text"
                            required
                            value={shipping.city}
                            onChange={(e) => setShipping(prev => ({ ...prev, city: e.target.value }))}
                            placeholder="Sector Delta"
                            className="w-full bg-black border border-border-blueprint text-zinc-300 px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-zinc-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-zinc-500 uppercase">STATE</label>
                            <input
                              type="text"
                              required
                              value={shipping.state}
                              onChange={(e) => setShipping(prev => ({ ...prev, state: e.target.value }))}
                              placeholder="Lagos"
                              className="w-full bg-black border border-border-blueprint text-zinc-300 px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-zinc-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-zinc-500 uppercase">ZIP INDEX</label>
                            <input
                              type="text"
                              required
                              value={shipping.zip}
                              onChange={(e) => setShipping(prev => ({ ...prev, zip: e.target.value }))}
                              placeholder="100001"
                              className="w-full bg-black border border-border-blueprint text-zinc-300 px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-zinc-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Same Address Checkbox */}
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="sameAddr"
                          checked={useSameAddress}
                          onChange={(e) => setUseSameAddress(e.target.checked)}
                          className="w-3.5 h-3.5 bg-black border border-border-blueprint text-white focus:ring-0 focus:ring-offset-0 rounded-none cursor-pointer"
                        />
                        <label htmlFor="sameAddr" className="text-[10px] font-mono text-zinc-400 cursor-pointer uppercase">
                          BILLING ADAPTS TO SHIPPING DETAILS
                        </label>
                      </div>

                      {/* Billing forms when unchecked */}
                      {!useSameAddress && (
                        <div className="space-y-4 pt-4 border-t border-border-blueprint">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">// BILLING MATRIX</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-mono text-zinc-500 uppercase">BILLING NAME</label>
                              <input
                                type="text"
                                value={billing.fullName}
                                onChange={(e) => setBilling(prev => ({ ...prev, fullName: e.target.value }))}
                                placeholder="Stealth Operator"
                                className="w-full bg-black border border-border-blueprint text-zinc-300 px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-zinc-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-mono text-zinc-500 uppercase">BILLING ADDRESS LINE 1</label>
                              <input
                                type="text"
                                value={billing.addressLine1}
                                onChange={(e) => setBilling(prev => ({ ...prev, addressLine1: e.target.value }))}
                                placeholder="12 Sector Gate Ave"
                                className="w-full bg-black border border-border-blueprint text-zinc-300 px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-zinc-500"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="pt-2 flex items-center justify-between border-t border-border-blueprint/40">
                        {saveSuccess && (
                          <span className="text-[10px] font-mono text-emerald-400 uppercase">✓ DEPLOYMENT PROFILES AUTO-SAVED</span>
                        )}
                        <button
                          type="submit"
                          disabled={isSavingProfile}
                          className="ml-auto px-6 py-2.5 bg-zinc-900 border border-border-blueprint hover:border-zinc-500 text-xs font-mono text-zinc-300 hover:text-white transition-all disabled:opacity-50"
                        >
                          {isSavingProfile ? 'WRITING...' : 'SAVE DISPATCH PROFILE'}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="border border-border-blueprint p-8 bg-charcoal-900/30 text-center space-y-4 blueprint-corner">
                    <span className="text-xs font-mono text-zinc-500 block uppercase">// SECURE ACCESS MISSING</span>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                      Dispatch orders directly as a guest, or connect your session using the user button in the header for auto-saved profile shipping logs.
                    </p>
                  </div>
                )}

                {/* 2. User Order Logs (Past Orders) */}
                {user && (
                  <div className="border border-border-blueprint bg-black p-8 relative">
                    <div className="absolute top-2 right-2 text-[8px] font-mono text-zinc-700">USER LOGS // SECURE_ORDERS</div>
                    <div className="flex items-center gap-2 border-b border-border-blueprint pb-4 mb-6">
                      <Clipboard className="w-4 h-4 text-zinc-400" />
                      <span className="text-xs font-mono tracking-widest text-white uppercase">ORDER HISTORY LOGS</span>
                    </div>

                    {ordersLoading ? (
                      <div className="text-center font-mono text-[10px] text-zinc-500 py-8">
                        SYNCHRONIZING PROFILE RECORDS...
                      </div>
                    ) : pastOrders.length === 0 ? (
                      <div className="text-center font-mono text-[10px] text-zinc-600 py-8">
                        NO LOGGED TRANSACTIONS DETECTED IN THIS SECTOR.
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-87.5 overflow-y-auto pr-2">
                        {pastOrders.map((ord) => (
                          <div key={ord.id} className="border border-border-blueprint p-4 bg-charcoal-900/30 flex justify-between items-center text-xs font-mono">
                            <div className="space-y-1">
                              <div className="text-white font-bold">{ord.paystack_reference}</div>
                              <div className="text-[10px] text-zinc-500">DATE: {new Date(ord.created_at).toLocaleDateString()}</div>
                              <div className="text-[10px] text-zinc-500">VAL: ${ord.amount.toFixed(2)}</div>
                            </div>
                            <div>
                              <span className={`px-2 py-0.5 border text-[9px] uppercase font-bold tracking-wider ${
                                ord.status === 'paid'
                                  ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-400'
                                  : ord.status === 'pending'
                                  ? 'bg-amber-950/20 border-amber-900/50 text-amber-500'
                                  : 'bg-red-950/20 border-red-900/50 text-red-500'
                              }`}>
                                {ord.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Side: Cart Summary & Checkout */}
              <div className="lg:col-span-5 space-y-6">
                <div className="border border-border-blueprint bg-charcoal-900/50 p-6 space-y-6 blueprint-corner">
                  <div className="flex items-center gap-2 border-b border-border-blueprint pb-4">
                    <FileText className="w-4 h-4 text-zinc-400" />
                    <span className="text-xs font-mono tracking-widest text-white uppercase">SHIELD SUMMARY</span>
                  </div>

                  {items.length === 0 ? (
                    <div className="text-center font-mono text-[10px] text-zinc-500 py-12">
                      YOUR BAG IS EMPTY. RETRIEVE PRODUCTS FROM SYSTEM.
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-62.5 overflow-y-auto pr-2">
                      {items.map((item) => (
                        <div key={item.variantId} className="flex gap-4 items-center justify-between text-xs font-mono py-2 border-b border-zinc-950">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative w-10 h-12 border border-border-blueprint bg-black shrink-0 overflow-hidden">
                              <Image src={item.product.image_url} alt={item.product.name} fill className="object-cover" />
                            </div>
                            <div className="truncate">
                              <div className="text-white uppercase font-bold truncate">{item.product.name}</div>
                              <div className="text-[10px] text-zinc-500">SIZE: {item.size} // QTY: {item.quantity}</div>
                            </div>
                          </div>
                          <span className="text-white font-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Calculations */}
                  <div className="space-y-2 border-t border-border-blueprint/40 pt-4 font-mono text-xs">
                    <div className="flex justify-between text-zinc-500">
                      <span>SUBTOTAL</span>
                      <span className="text-zinc-300">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-500">
                      <span>SHIPPING SERVICE</span>
                      <span className="text-emerald-500 font-bold">COMPLIMENTARY</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-4 border-t border-dashed border-zinc-900 text-sm">
                      <span className="text-zinc-400 font-bold">// ORDER TOTAL</span>
                      <span className="text-lg font-bold text-white">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckoutSubmit}
                    disabled={items.length === 0 || checkoutLoading}
                    className="w-full py-4 bg-white text-black font-extrabold text-xs font-mono tracking-widest hover:bg-zinc-200 transition-colors uppercase border border-white disabled:opacity-50 disabled:bg-zinc-900 disabled:text-zinc-600 disabled:border-zinc-900 flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>INITIALIZE PAYSTACK SECURITY PAY</span>
                  </button>

                  <div className="text-[9px] font-mono text-zinc-600 text-center pt-2">
                    * Transacting currency will show converted equivalent in NGN ₦.
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

      {/* Simulated Sandbox Payment Modal */}
      <AnimatePresence>
        {showMockModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-8 bg-black border border-zinc-800 blueprint-corner text-center"
            >
              <div className="space-y-6">
                <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">// PAYSTACK SANDBOX SIMULATOR</span>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-display font-extrabold text-white uppercase">AUTHORIZE MOCK TRANSACTION</h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    REF: {mockReference}
                  </p>
                  <p className="text-xs text-zinc-400">
                    No API keys were detected in your configurations. Accept simulation to execute the status transitions and verify the system's pipeline.
                  </p>
                </div>

                <div className="border border-border-blueprint p-4 bg-charcoal-900/40 text-left font-mono text-[10px] text-zinc-500 space-y-1">
                  <div>AMOUNT: ${total.toFixed(2)} USD</div>
                  <div>CONVERTED: ₦{(total * 1600).toFixed(2)} NGN</div>
                  <div>GATEWAY: PAYSTACK_SANDBOX_MOCK</div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleSimulatePayment(false)}
                    className="w-1/2 py-3 border border-red-900 text-red-500 hover:bg-red-950/20 text-xs font-mono uppercase transition-colors"
                  >
                    DECLINE PAYMENT
                  </button>
                  <button
                    onClick={() => handleSimulatePayment(true)}
                    className="w-1/2 py-3 bg-white text-black font-bold text-xs font-mono hover:bg-zinc-200 transition-colors uppercase border border-white"
                  >
                    AUTHORIZE SUCCESS
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
