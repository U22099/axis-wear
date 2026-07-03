'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { db, Order } from '@/lib/database';
import { paystack } from '@/lib/paystack';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import ShippingForm, { AddressData } from '@/components/checkout/ShippingForm';
import BillingForm from '@/components/checkout/BillingForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import OrderHistory from '@/components/checkout/OrderHistory';
import MockPayModal from '@/components/checkout/MockPayModal';
import Button from '@/components/ui/Button';

const EMPTY_ADDRESS: AddressData = {
  fullName: '',
  addressLine1: '',
  city: '',
  state: '',
  zip: '',
};

export default function CheckoutContent() {
  const { user, updateUserAddress, updateProfileName } = useAuth();
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [shipping, setShipping] = useState<AddressData>(EMPTY_ADDRESS);
  const [billing, setBilling] = useState<AddressData>(EMPTY_ADDRESS);
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [showMockModal, setShowMockModal] = useState(false);
  const [mockReference, setMockReference] = useState('');

  const paystackRef =
    searchParams.get('paystack_verify_reference') || searchParams.get('reference');
  const mockRefParam = searchParams.get('mock_pay_reference');
  const isSuccess = searchParams.get('status') === 'success';

  useEffect(() => {
    if (!user) return;

    if (user.shipping_address && Object.keys(user.shipping_address).length > 0) {
      setShipping(user.shipping_address as AddressData);
    } else if (user.name) {
      setShipping((prev) => ({ ...prev, fullName: user.name || '' }));
    }

    if (user.billing_address && Object.keys(user.billing_address).length > 0) {
      setBilling(user.billing_address as AddressData);
      setUseSameAddress(false);
    }

    loadOrders(user.id);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (paystackRef) {
      verifyPaystackPayment(paystackRef);
    } else if (mockRefParam) {
      setMockReference(mockRefParam);
      setShowMockModal(true);
    }
  }, [paystackRef, mockRefParam]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadOrders = async (userId: string) => {
    setOrdersLoading(true);
    try {
      const { data, error } = await db
        .getSupabase()
        .from('orders')
        .select('*, order_items(*, variant:product_variants(*, product:products(*)))')
        .eq('profile_id', userId)
        .order('created_at', { ascending: false });
      if (!error && data) setPastOrders(data);
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
      await updateUserAddress('billing', useSameAddress ? shipping : billing);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffffff', '#1a1a1a', '#a1a1a1'],
    });
  };

  const verifyPaystackPayment = async (reference: string) => {
    setCheckoutLoading(true);
    setErrorMessage(null);
    try {
      const res = await paystack.verifyTransaction(reference);
      if (res.success) {
        const order = await db.getOrderByReference(reference);
        if (order && order.status !== 'paid') {
          await db.updateOrderStatus(reference, 'paid');
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Payment verification failed.';
      setErrorMessage(msg);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleCheckoutSubmit = async () => {
    if (items.length === 0) return;
    setErrorMessage(null);
    setCheckoutLoading(true);
    try {
      const liveVariants = await db.getLiveVariants();
      for (const item of items) {
        const currentStock =
          liveVariants.find((x) => x.product_id === item.variantId)?.stock ?? item.stock;
        if (item.quantity > currentStock) {
          throw new Error(
            `Insufficient stock for ${item.product.name} (Size ${item.size}). Only ${currentStock} units left.`,
          );
        }
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email || 'guest@axiswear.com',
          amount: total,
          items: items.map((item) => ({
            variantId: item.variantId,
            qty: item.quantity,
            price: item.product.price,
          })),
          origin: window.location.origin,
          userId: user?.id || null,
        }),
      });

      const res = await response.json();
      if (res.success && res.authorizationUrl) {
        window.location.href = res.authorizationUrl;
      } else {
        throw new Error(res.error || 'Initialization rejected.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to establish checkout session.';
      setErrorMessage(msg);
      setCheckoutLoading(false);
    }
  };

  const handleSimulatePayment = async (success: boolean) => {
    setShowMockModal(false);
    if (!mockReference) return;
    if (success) {
      await verifyPaystackPayment(mockReference);
    } else {
      setErrorMessage('Mock transaction cancelled by user.');
    }
  };
  
  return (
    <>
      <main className="grow bg-black py-16 px-6 md:px-12 relative">
        <div className="absolute inset-0 blueprint-grid-bg opacity-15 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 pb-6 border-b border-border-blueprint">
            <div className="space-y-1">
              <span className="text-xs font-mono tracking-widest text-zinc-500">

              </span>
              <h2 className="text-3xl font-display font-extrabold tracking-tight uppercase">
                SHIELD CHECKOUT
              </h2>
            </div>
            <div className="text-[10px] font-mono text-zinc-500 mt-4 md:mt-0 uppercase">
              SECTOR SECURITY CODE // ENCRYPTED_TLS_V1.3
            </div>
          </div>

          {isSuccess && (
            <div className="mb-12 p-8 border border-emerald-900 bg-emerald-950/10 flex flex-col md:flex-row items-center gap-6 blueprint-corner">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 shrink-0" />
              <div className="space-y-1 text-center md:text-left grow">
                <h4 className="font-display font-bold text-lg text-white uppercase">
                  SHIELD ACQUISITION SUCCESSFUL
                </h4>
                <p className="text-xs font-mono text-zinc-400">
                  Payment validated successfully. Order status updated [PAID]. Inventory
                  dispatched for sector delivery.
                </p>
              </div>
              <Button
                onClick={() => router.replace('/')}
                variant="primary"
                className="shrink-0"
              >
                Return to Grid
              </Button>
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

              <div className="lg:col-span-7 space-y-12">
                {user ? (
                  <>
                    <ShippingForm
                      shipping={shipping}
                      useSameAddress={useSameAddress}
                      isSaving={isSavingProfile}
                      saveSuccess={saveSuccess}
                      onShippingChange={(updates) =>
                        setShipping((prev) => ({ ...prev, ...updates }))
                      }
                      onToggleSameAddress={setUseSameAddress}
                      onSubmit={handleSaveAddresses}
                    />

                    {!useSameAddress && (
                      <BillingForm
                        billing={billing}
                        onBillingChange={(updates) =>
                          setBilling((prev) => ({ ...prev, ...updates }))
                        }
                      />
                    )}

                    <OrderHistory orders={pastOrders} isLoading={ordersLoading} />
                  </>
                ) : (
                  <div className="border border-border-blueprint p-8 bg-charcoal-900/30 text-center space-y-4 blueprint-corner">
                    <span className="text-xs font-mono text-zinc-500 block uppercase">

                    </span>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                      Dispatch orders directly as a guest, or connect your session
                      using the user button in the header for auto-saved profile
                      shipping logs.
                    </p>
                  </div>
                )}
              </div>

              <div className="lg:col-span-5">
                <OrderSummary
                  items={items}
                  total={total}
                  isLoading={checkoutLoading}
                  onCheckout={handleCheckoutSubmit}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <MockPayModal
        isOpen={showMockModal}
        reference={mockReference}
        total={total}
        onSimulate={handleSimulatePayment}
      />
    </>
  );
}
