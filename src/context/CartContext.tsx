'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/database';
import { CartItem, Product, ProductVariant } from '@/lib/types';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  addToCart: (product: Product, variant: ProductVariant, qty?: number) => Promise<{ ok: boolean; message: string }>;
  updateQty: (variantId: string, qty: number) => Promise<{ ok: boolean; message: string }>;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  count: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const STORAGE_KEY = 'aw_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch { /* ignore parse errors */ }
  }, []);

  const persist = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
  };

  const getLiveStock = useCallback(async (variantId: string): Promise<number> => {
    const v = await db.getVariantById(variantId);
    return v?.stock ?? 0;
  }, []);

  const addToCart = async (product: Product, variant: ProductVariant, qty = 1) => {
    const liveStock = await getLiveStock(variant.id);
    if (liveStock <= 0) return { ok: false, message: 'This size is currently out of stock.' };

    const existing = items.find((i) => i.variantId === variant.id);
    const currentQty = existing?.quantity ?? 0;
    const targetQty = currentQty + qty;

    if (targetQty > liveStock) {
      return {
        ok: false,
        message: `Only ${liveStock} units available in size ${variant.size}. You already have ${currentQty} in your bag.`,
      };
    }

    const updated = existing
      ? items.map((i) => (i.variantId === variant.id ? { ...i, quantity: targetQty, stock: liveStock } : i))
      : [...items, { product, variantId: variant.id, size: variant.size, quantity: qty, stock: liveStock }];

    persist(updated);
    return { ok: true, message: `${product.name} (${variant.size}) added to bag.` };
  };

  const updateQty = async (variantId: string, qty: number) => {
    if (qty <= 0) {
      removeItem(variantId);
      return { ok: true, message: 'Item removed.' };
    }
    const liveStock = await getLiveStock(variantId);
    if (qty > liveStock) return { ok: false, message: `Only ${liveStock} units available.` };

    persist(items.map((i) => (i.variantId === variantId ? { ...i, quantity: qty, stock: liveStock } : i)));
    return { ok: true, message: 'Bag updated.' };
  };

  const removeItem = (variantId: string) => persist(items.filter((i) => i.variantId !== variantId));
  const clearCart = () => persist([]);

  const count = items.reduce((a, i) => a + i.quantity, 0);
  const total = items.reduce((a, i) => a + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, isOpen, setIsOpen, addToCart, updateQty, removeItem, clearCart, count, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
