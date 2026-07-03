import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/database';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    if (PAYSTACK_SECRET_KEY) {
      if (!signature) {
        return new Response('Signature header missing', { status: 401 });
      }

      const hash = crypto
        .createHmac('sha512', PAYSTACK_SECRET_KEY)
        .update(rawBody)
        .digest('hex');

      if (hash !== signature) {
        return new Response('Signature verification failed', { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);

    if (payload.event === 'charge.success') {
      const transactionData = payload.data;
      const reference = transactionData.reference;

      const order = await db.getOrderByReference(reference);
      
      if (!order) {
        return NextResponse.json({ success: false, error: 'Order reference not found' }, { status: 404 });
      }

      if (order.status !== 'paid') {

        await db.updateOrderStatus(reference, 'paid');

        const orderWithItems = await db.getOrderByReference(order.paystack_reference);
        if (orderWithItems && orderWithItems.order_items) {
          for (const item of orderWithItems.order_items) {
            await db.updateVariantStock(item.variant_id, item.quantity);
          }
        }
        
        console.log(`[PAYSTACK WEBHOOK] Order Reference ${reference} paid & stock updated.`);
      }
    }

    return new Response('Webhook processed successfully', { status: 200 });
  } catch (err: any) {
    console.error('Webhook processing failure:', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal failure' }, { status: 500 });
  }
}
