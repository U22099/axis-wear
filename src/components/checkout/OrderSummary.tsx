'use client';

import React from 'react';
import Image from 'next/image';
import { FileText, CreditCard } from 'lucide-react';
import { CartItem } from '@/lib/types';
import Button from '@/components/ui/Button';

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
  isLoading: boolean;
  onCheckout: () => void;
}

export default function OrderSummary({
  items,
  total,
  isLoading,
  onCheckout,
}: OrderSummaryProps) {
  return (
    <div className="border border-border-blueprint bg-charcoal-900/50 p-6 space-y-6 blueprint-corner">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border-blueprint pb-4">
        <FileText className="w-4 h-4 text-zinc-400" />
        <span className="text-xs font-mono tracking-widest text-white uppercase">
          SHIELD SUMMARY
        </span>
      </div>

      {/* Line items */}
      {items.length === 0 ? (
        <div className="text-center font-mono text-[10px] text-zinc-500 py-12">
          YOUR BAG IS EMPTY. RETRIEVE PRODUCTS FROM SYSTEM.
        </div>
      ) : (
        <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
          {items.map((item) => (
            <div
              key={item.variantId}
              className="flex gap-4 items-center justify-between text-xs font-mono py-2 border-b border-zinc-950"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-10 h-12 border border-border-blueprint bg-black shrink-0 overflow-hidden">
                  <Image
                    src={item.product.image_url}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="truncate">
                  <div className="text-white uppercase font-bold truncate">
                    {item.product.name}
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    SIZE: {item.size} // QTY: {item.quantity}
                  </div>
                </div>
              </div>
              <span className="text-white font-bold shrink-0">
                ${(item.product.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Totals */}
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

      {/* CTA */}
      <Button
        onClick={onCheckout}
        disabled={items.length === 0}
        isLoading={isLoading}
        fullWidth
        size="lg"
        leftIcon={<CreditCard className="w-4 h-4" />}
      >
        INITIALIZE PAYSTACK SECURITY PAY
      </Button>

      <div className="text-[9px] font-mono text-zinc-600 text-center pt-2">
        * Transacting currency will show converted equivalent in NGN ₦.
      </div>
    </div>
  );
}
