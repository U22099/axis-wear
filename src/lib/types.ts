

export interface Profile {
  id: string;
  name: string | null;
  email: string;
  billing_address: AddressData | null;
  shipping_address: AddressData | null;
  updated_at?: string;
}

export interface AddressData {
  fullName: string;
  addressLine1: string;
  city: string;
  state: string;
  zip: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  tags: string[];
  created_at?: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  stock: number;
  sku: string;
}

export interface Order {
  id: string;
  profile_id: string | null;
  amount: number;
  paystack_reference: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  created_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id: string;
  quantity: number;
  unit_price: number;
  variant?: ProductVariant & { product?: Product };
}

export interface CartItem {
  product: Product;
  variantId: string;
  size: string;
  quantity: number;
  stock: number;
}
