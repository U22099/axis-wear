'use client';

import { createClient as createBrowserClient } from '@/utils/supabase/client';
import { Profile, Product, ProductVariant, Order, OrderItem } from './types';

export type { Profile, Product, ProductVariant, Order, OrderItem };

const supabase = createBrowserClient();

export const db = {
  // Auth
  getSupabase: () => supabase,

  // Products
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  async getProductVariants(productId: string): Promise<ProductVariant[]> {
    const { data, error } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', productId);
    if (error) throw error;
    return data || [];
  },

  async getLiveVariants(): Promise<ProductVariant[]> {
    const { data, error } = await supabase.from('product_variants').select('*');
    if (error) throw error;
    return data || [];
  },

  async getVariantById(variantId: string): Promise<ProductVariant | null> {
    const { data, error } = await supabase
      .from('product_variants')
      .select('*')
      .eq('id', variantId)
      .single();
    if (error) return null;
    return data;
  },

  async updateVariantStock(variantId: string, decrementBy: number): Promise<void> {
    const { data: variant, error: getErr } = await supabase
      .from('product_variants')
      .select('stock')
      .eq('id', variantId)
      .single();
    if (getErr || !variant) throw new Error(`Variant not found: ${variantId}`);
    const newStock = Math.max(0, variant.stock - decrementBy);
    const { error } = await supabase
      .from('product_variants')
      .update({ stock: newStock })
      .eq('id', variantId);
    if (error) throw error;
  },

  // Profiles
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) return null;
    return data;
  },

  async upsertProfile(profile: Partial<Profile> & { id: string }): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ ...profile, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Orders
  async createOrder(orderData: {
    profile_id: string | null;
    amount: number;
    paystack_reference: string;
    items: { variant_id: string; quantity: number; unit_price: number }[];
  }): Promise<Order> {
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        profile_id: orderData.profile_id,
        amount: orderData.amount,
        paystack_reference: orderData.paystack_reference,
        status: 'pending',
      })
      .select()
      .single();
    if (orderErr) throw orderErr;

    const { error: itemsErr } = await supabase.from('order_items').insert(
      orderData.items.map((item) => ({
        order_id: order.id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }))
    );
    if (itemsErr) throw itemsErr;
    return order;
  },

  async getOrdersByUser(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, variant:product_variants(*, product:products(*)))')
      .eq('profile_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getOrderByReference(reference: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('paystack_reference', reference)
      .single();
    if (error) return null;
    return data;
  },

  async updateOrderStatus(reference: string, status: Order['status']): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('paystack_reference', reference);
    if (error) throw error;
  },
};
