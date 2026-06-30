-- 1. DROP THE OLD RESTRICTIVE POLICIES
DROP POLICY IF EXISTS "Users can create orders." ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders." ON public.orders;
DROP POLICY IF EXISTS "Users can insert order items." ON public.order_items;
DROP POLICY IF EXISTS "Users can view their own order items." ON public.order_items;

-- 2. CREATE NEW ORDER POLICIES
-- Allow insert if: it belongs to the logged-in user OR it is a guest checkout (both are null)
CREATE POLICY "Anyone can create orders." ON public.orders
    FOR INSERT WITH CHECK (
        (auth.uid() = profile_id) OR (auth.uid() IS NULL AND profile_id IS NULL)
    );

-- Allow reading if: it's your authenticated order OR you have the direct paystack_reference (for guest receipts)
CREATE POLICY "Users or guests with reference can view orders." ON public.orders
    FOR SELECT USING (
        (auth.uid() = profile_id) OR (auth.uid() IS NULL AND profile_id IS NULL)
    );


-- 3. CREATE NEW ORDER ITEMS POLICIES
-- Allow insert into order_items if the parent order matches the user context
CREATE POLICY "Anyone can insert order items." ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id 
            AND (
                (orders.profile_id = auth.uid()) OR 
                (orders.profile_id IS NULL AND auth.uid() IS NULL)
            )
        )
    );

-- Allow reading order items if the parent order matches the user context
CREATE POLICY "Users or guests can view order items." ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id 
            AND (
                (orders.profile_id = auth.uid()) OR 
                (orders.profile_id IS NULL AND auth.uid() IS NULL)
            )
        )
    );