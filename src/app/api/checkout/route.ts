import { NextResponse } from 'next/server';
import { db } from '@/lib/database.server';
import { paystack } from '@/lib/paystack';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, amount, items, origin, userId } = body;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    if (!email || !amount || !items || !Array.isArray(items)) {
      return NextResponse.json({ success: false, error: 'Malformed payload credentials' }, { status: 400 });
    }

    for (const item of items) {
      const variant = await db(supabase).getVariantById(item.variantId);
      if (!variant) {
        return NextResponse.json({ success: false, error: `Invalid size SKU variant identifier: ${item.variantId}` }, { status: 400 });
      }
      if (item.qty > variant.stock) {
        return NextResponse.json({
          success: false,
          error: `Overselling warning. Size variant ${variant.size} has only ${variant.stock} units remaining.`
        }, { status: 409 });
      }
    }

    const metadata = {
      orderId: `ord-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      items: items.map(it => ({
        variantId: it.variantId,
        qty: it.qty,
        price: it.price
      }))
    };

    const paystackResult = await paystack.initializeTransaction(email, amount, origin, metadata);

    if (!paystackResult.success || !paystackResult.reference) {
      console.error("Gateway Rejected initialization");
      return NextResponse.json({ success: false, error: paystackResult.error || 'Gateway Rejected initialization' }, { status: 502 });
    }

    const order = await db(supabase).createOrder({
      profile_id: userId,
      amount,
      paystack_reference: paystackResult.reference,
      items: items.map(it => ({
        variant_id: it.variantId,
        quantity: it.qty,
        unit_price: it.price
      }))
    });

    return NextResponse.json({
      success: true,
      authorizationUrl: paystackResult.authorizationUrl,
      reference: paystackResult.reference,
      orderId: order.id
    });
  } catch (err: any) {
    console.error('Server Checkout Error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal server error occurred' }, { status: 500 });
  }
}
