'use client';

import React from 'react';
import { Clipboard } from 'lucide-react';
import { Order } from '@/lib/types';
import Badge from '@/components/ui/Badge';

interface OrderHistoryProps {
  orders: Order[];
  isLoading: boolean;
}

type OrderStatus = Order['status'];

function statusVariant(status: OrderStatus) {
  const map: Record<OrderStatus, 'paid' | 'pending' | 'failed' | 'cancelled'> = {
    paid: 'paid',
    pending: 'pending',
    failed: 'failed',
    cancelled: 'cancelled',
  };
  return map[status];
}

export default function OrderHistory({ orders, isLoading }: OrderHistoryProps) {
  return (
    <div className="border border-border-blueprint bg-black p-8 relative">
      <div className="absolute top-2 right-2 text-[8px] font-mono text-zinc-700">
        USER LOGS // SECURE_ORDERS
      </div>

      <div className="flex items-center gap-2 border-b border-border-blueprint pb-4 mb-6">
        <Clipboard className="w-4 h-4 text-zinc-400" />
        <span className="text-xs font-mono tracking-widest text-white uppercase">
          ORDER HISTORY LOGS
        </span>
      </div>

      {isLoading ? (
        <div className="text-center font-mono text-[10px] text-zinc-500 py-8">
          SYNCHRONIZING PROFILE RECORDS...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center font-mono text-[10px] text-zinc-600 py-8">
          NO LOGGED TRANSACTIONS DETECTED IN THIS SECTOR.
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="border border-border-blueprint p-4 bg-charcoal-900/30 flex justify-between items-center text-xs font-mono"
            >
              <div className="space-y-1">
                <div className="text-white font-bold">{ord.paystack_reference}</div>
                <div className="text-[10px] text-zinc-500">
                  DATE: {new Date(ord.created_at).toLocaleDateString()}
                </div>
                <div className="text-[10px] text-zinc-500">
                  VAL: ${ord.amount.toFixed(2)}
                </div>
              </div>
              <Badge variant={statusVariant(ord.status)}>{ord.status}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
