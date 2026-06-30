-- Database Schema for AxisWear Men's Fashion E-Commerce Website
-- Target: Supabase PostgreSQL database

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES Table
-- Stores user-specific shipping, billing, and profile details.
-- Tied to Supabase Auth Users.
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    billing_address JSONB DEFAULT '{}'::jsonb,
    shipping_address JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can read own profile." ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile." ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);


-- 2. PRODUCTS Table
-- Stores the high-end editorial product catalog details.
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT,
    tags TEXT[] DEFAULT '{}'::text[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products Policies
CREATE POLICY "Anyone can read products." ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert products." ON public.products
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update products." ON public.products
    FOR UPDATE USING (true);


-- 3. PRODUCT_VARIANTS Table
-- Tracks sizes (e.g. S, M, L, XL) and stock counts.
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    size TEXT NOT NULL,
    stock INTEGER NOT NULL CHECK (stock >= 0),
    sku TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Product Variants
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Product Variants Policies
CREATE POLICY "Anyone can read product variants." ON public.product_variants
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert product variants." ON public.product_variants
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update product variants." ON public.product_variants
    FOR UPDATE USING (true);


-- 4. ORDERS Table
-- Tracks client purchases, totals, references and status.
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL,
    paystack_reference TEXT UNIQUE,
    status TEXT DEFAULT 'pending'::text CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Orders Policies
CREATE POLICY "Users can view their own orders." ON public.orders
    FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Users can create orders." ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "System/Webhooks can update orders." ON public.orders
    FOR UPDATE USING (true); -- Custom webhook or service role will handle updating orders


-- 5. ORDER_ITEMS Table
-- Map specific products / variants and counts to an order.
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL
);

-- Enable RLS on Order Items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Order Items Policies
CREATE POLICY "Users can view their own order items." ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id AND orders.profile_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert order items." ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id AND orders.profile_id = auth.uid()
        )
    );


-- 6. PROFILE TRIGGER ON SIGNUP
-- Automatically populate profiles table when a user registers.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name)
    VALUES (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 7. SEED DATA FOR CATALOG (Optional SQL reference)
/*
INSERT INTO public.products (id, name, slug, description, price, image_url, category, tags) VALUES
('b1076b00-349f-4318-971c-720c15981358', 'TECHNICAL SHELL // 01', 'technical-shell-01', 'High-performance urban technical jacket constructed with 3-layer laminated waterproof fabric, taped seams, and a modular strap suspension system.', 240.00, '/images/product-shell.webp', 'Outerwear', ARRAY['waterproof', 'modular', 'shell']),
('b1076b00-349f-4318-971c-720c15981359', 'MODULAR DOWN // 02', 'modular-down-02', 'Premium 800-fill down insulation parka. Features modular sleeves and adjustable hoods for high heat retention in sub-zero urban settings.', 310.00, '/images/product-down.webp', 'Outerwear', ARRAY['insulation', 'down', 'modular']),
('b1076b00-349f-4318-971c-720c15981360', 'TACTICAL ANORAK // 03', 'tactical-anorak-03', 'Packable lightweight ripstop nylon windbreaker with dynamic asymmetrical zipper styling, a utility kangaroo pouch, and an adjustable tactical hood.', 180.00, '/images/product-anorak.webp', 'Outerwear', ARRAY['ripstop', 'windbreaker', 'packable']),
('b1076b00-349f-4318-971c-720c15981361', 'STEALTH UTILITY VEST // 04', 'stealth-utility-vest-04', 'Industrial modular utility vest engineered with tactical webbing, multiple secure quick-access pockets, and high-tenacity canvas paneling.', 150.00, '/images/product-vest.webp', 'Core', ARRAY['vest', 'utility', 'tactical']);

INSERT INTO public.product_variants (product_id, size, stock, sku) VALUES
('b1076b00-349f-4318-971c-720c15981358', 'S', 5, 'AW-TS01-S'),
('b1076b00-349f-4318-971c-720c15981358', 'M', 10, 'AW-TS01-M'),
('b1076b00-349f-4318-971c-720c15981358', 'L', 8, 'AW-TS01-L'),
('b1076b00-349f-4318-971c-720c15981358', 'XL', 2, 'AW-TS01-XL'),
('b1076b00-349f-4318-971c-720c15981359', 'S', 3, 'AW-MD02-S'),
('b1076b00-349f-4318-971c-720c15981359', 'M', 6, 'AW-MD02-M'),
('b1076b00-349f-4318-971c-720c15981359', 'L', 4, 'AW-MD02-L'),
('b1076b00-349f-4318-971c-720c15981359', 'XL', 1, 'AW-MD02-XL'),
('b1076b00-349f-4318-971c-720c15981360', 'S', 12, 'AW-TA03-S'),
('b1076b00-349f-4318-971c-720c15981360', 'M', 15, 'AW-TA03-M'),
('b1076b00-349f-4318-971c-720c15981360', 'L', 10, 'AW-TA03-L'),
('b1076b00-349f-4318-971c-720c15981360', 'XL', 5, 'AW-TA03-XL'),
('b1076b00-349f-4318-971c-720c15981361', 'S', 8, 'AW-SV04-S'),
('b1076b00-349f-4318-971c-720c15981361', 'M', 12, 'AW-SV04-M'),
('b1076b00-349f-4318-971c-720c15981361', 'L', 8, 'AW-SV04-L'),
('b1076b00-349f-4318-971c-720c15981361', 'XL', 4, 'AW-SV04-XL');
*/
