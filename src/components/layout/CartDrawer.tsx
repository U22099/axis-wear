'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShieldAlert } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import type { CartItem as CartItemType } from '@/lib/types';

interface CartLineItemProps {
  item: CartItemType;
  onQtyChange: (variantId: string, qty: number) => void;
  onRemove: (variantId: string) => void;
}

function CartLineItem({ item, onQtyChange, onRemove }: CartLineItemProps) {
  return (
    <div className="flex gap-4 p-4 border border-border-blueprint bg-charcoal-900/50 hover:bg-charcoal-900 transition-all group">

      <div className="relative w-20 h-24 border border-border-blueprint bg-black shrink-0 overflow-hidden">
        <Image
          src={item.product.image_url}
          alt={item.product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div>
          <h3 className="text-sm font-bold tracking-tight truncate uppercase font-display text-white">
            {item.product.name}
          </h3>
          <p className="text-xs font-mono text-zinc-500 mt-1">
            Size: {item.size} · {item.stock} in stock
          </p>
        </div>

        <div className="flex items-center justify-between mt-3">

          <div className="flex items-center border border-border-blueprint bg-black">
            <button
              onClick={() => onQtyChange(item.variantId, item.quantity - 1)}
              className="p-1.5 text-zinc-400 hover:text-white transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 text-xs font-mono text-white">{item.quantity}</span>
            <button
              onClick={() => onQtyChange(item.variantId, item.quantity + 1)}
              className="p-1.5 text-zinc-400 hover:text-white transition-colors disabled:opacity-30"
              disabled={item.quantity >= item.stock}
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-mono font-bold text-white">
              ${(item.product.price * item.quantity).toFixed(2)}
            </span>
            <button
              onClick={() => onRemove(item.variantId)}
              aria-label="Remove item"
              className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQty, removeItem, total, count } = useCart();
  const { user } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleQtyChange = async (variantId: string, newQty: number) => {
    setErrorMsg(null);
    const res = await updateQty(variantId, newQty);
    if (!res.ok) {
      setErrorMsg(res.message);
      setTimeout(() => setErrorMsg(null), 4000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex flex-col w-full max-w-md bg-black border-l border-border-blueprint"
          >

            <div className="flex items-center justify-between p-6 border-b border-border-blueprint">
              <div className="space-y-1">
                <span className="text-xs font-mono tracking-widest text-zinc-500">// SHOPPING BAG</span>
                <h2 className="text-xl font-display font-bold tracking-tight">
                  BAG — {count.toString().padStart(2, '0')} ITEMS
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close bag"
                className="p-2 text-zinc-400 hover:text-white border border-transparent hover:border-border-blueprint transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-start gap-2 px-6 py-3 bg-red-950/30 border-b border-red-900/50 text-red-400 text-xs font-mono">
                <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-5">
                  <div className="w-20 h-20 border border-dashed border-zinc-800 flex items-center justify-center">
                    <span className="text-xs font-mono text-zinc-700">EMPTY</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-mono tracking-wider text-zinc-300">Your bag is empty</p>
                    <p className="text-xs text-zinc-600">Add items from the collection to get started.</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2.5 bg-white text-black text-xs font-mono font-bold tracking-widest hover:bg-zinc-200 transition-colors uppercase"
                  >
                    Browse Collection
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <CartLineItem
                    key={item.variantId}
                    item={item}
                    onQtyChange={handleQtyChange}
                    onRemove={removeItem}
                  />
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-border-blueprint space-y-4 bg-black">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono text-zinc-500">
                    <span>Shipping</span>
                    <span>Complimentary</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-zinc-900">
                    <span className="text-xs font-mono text-zinc-400">Subtotal (excl. tax)</span>
                    <span className="text-xl font-mono font-bold text-white">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <Link
                    href="/checkout"
                    onClick={() => setIsOpen(false)}
                    className="block w-full py-4 bg-white text-black text-center text-xs font-mono font-bold tracking-widest hover:bg-zinc-200 transition-colors uppercase border border-white"
                  >
                    {user ? 'Proceed to Checkout' : 'Checkout (Sign in or Guest)'}
                  </Link>
                  {!user && (
                    <p className="text-[10px] font-mono text-zinc-600 text-center">
                      Sign in to save shipping details and track orders.
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
