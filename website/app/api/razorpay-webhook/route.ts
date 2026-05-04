import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Verify Razorpay webhook signature
function verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!webhookSecret) {
    console.error('RAZORPAY_WEBHOOK_SECRET not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase not configured');
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 500 }
    );
  }

  try {
    // Get raw body for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      console.error('Missing webhook signature');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify signature
    if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(rawBody);
    const { event: eventType, payload } = event;

    console.log(`Received Razorpay webhook: ${eventType}`);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle different event types
    switch (eventType) {
      case 'payment.captured': {
        // One-time payment successful
        const payment = payload.payment.entity;
        const { notes } = payment;

        if (!notes?.supabase_user_id) {
          console.error('No supabase_user_id in payment notes');
          return NextResponse.json(
            { error: 'Missing user ID' },
            { status: 400 }
          );
        }

        const userId = notes.supabase_user_id;

        // Update user's subscription status in profiles table
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            subscription_status: 'active',
            subscription_plan: 'lifetime',
            subscription_expires_at: null, // Lifetime access - no expiry
            razorpay_payment_id: payment.id,
            razorpay_order_id: payment.order_id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);

        if (updateError) {
          console.error('Failed to update subscription:', updateError);
          return NextResponse.json(
            { error: 'Failed to update subscription' },
            { status: 500 }
          );
        }

        // Record payment in payments table (if exists)
        await supabase.from('payments').insert({
          user_id: userId,
          razorpay_payment_id: payment.id,
          razorpay_order_id: payment.order_id,
          amount: payment.amount, // Amount in paise
          currency: payment.currency,
          status: 'captured',
          coupon_code: notes.coupon_code || null,
          created_at: new Date().toISOString(),
        });

        console.log(`Updated subscription for user ${userId}`);
        break;
      }

      case 'payment.failed': {
        // Payment failed - log for monitoring
        const payment = payload.payment.entity;
        console.error('Payment failed:', {
          paymentId: payment.id,
          reason: payment.error_reason,
          description: payment.error_description,
        });

        // Optionally record failed payment
        if (payment.notes?.supabase_user_id) {
          await supabase.from('payments').insert({
            user_id: payment.notes.supabase_user_id,
            razorpay_payment_id: payment.id,
            razorpay_order_id: payment.order_id,
            amount: payment.amount,
            currency: payment.currency,
            status: 'failed',
            error_reason: payment.error_reason,
            error_description: payment.error_description,
            created_at: new Date().toISOString(),
          });
        }
        break;
      }

      case 'refund.created': {
        // Handle refunds - revoke access
        const refund = payload.refund.entity;
        const payment = payload.payment?.entity;

        if (payment?.notes?.supabase_user_id) {
          const userId = payment.notes.supabase_user_id;

          // Revoke premium access
          await supabase
            .from('profiles')
            .update({
              subscription_status: 'refunded',
              subscription_plan: 'free',
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);

          // Record refund
          await supabase.from('payments').insert({
            user_id: userId,
            razorpay_payment_id: payment.id,
            razorpay_order_id: payment.order_id,
            amount: -refund.amount, // Negative amount for refund
            currency: payment.currency,
            status: 'refunded',
            created_at: new Date().toISOString(),
          });

          console.log(`Revoked access for refunded user ${userId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
