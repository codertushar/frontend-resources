import crypto from 'crypto';
import { createClerkClient } from '@clerk/clerk-sdk-node';

export const config = {
  runtime: 'nodejs',
  api: {
    bodyParser: false, // We need raw body for signature verification
  },
};

// Initialize Clerk client
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

// Helper to get raw body
async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

// Verify Razorpay webhook signature
function verifyWebhookSignature(body, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('RAZORPAY_WEBHOOK_SECRET not configured');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers['x-razorpay-signature'];

    // Verify signature
    if (!verifyWebhookSignature(rawBody.toString(), signature, webhookSecret)) {
      console.error('Invalid webhook signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = JSON.parse(rawBody.toString());
    const { event: eventType, payload } = event;

    console.log(`Received Razorpay webhook: ${eventType}`);

    // Handle different event types
    switch (eventType) {
      case 'payment.captured': {
        // One-time payment successful
        const payment = payload.payment.entity;
        const { notes } = payment;

        if (!notes?.clerk_user_id) {
          console.error('No clerk_user_id in payment notes');
          return res.status(400).json({ error: 'Missing user ID' });
        }

        const clerkUserId = notes.clerk_user_id;

        // Update user's subscription status in Clerk
        await clerkClient.users.updateUserMetadata(clerkUserId, {
          publicMetadata: {
            subscription: {
              plan: 'lifetime',
              status: 'active',
              razorpayPaymentId: payment.id,
              razorpayOrderId: payment.order_id,
              amount: payment.amount, // Amount in paise
              currency: payment.currency,
              purchasedAt: new Date().toISOString(),
              // Lifetime access - no expiry
              expiresAt: null,
            },
          },
        });

        console.log(`Updated subscription for user ${clerkUserId}`);
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
        break;
      }

      case 'refund.created': {
        // Handle refunds - revoke access
        const refund = payload.refund.entity;
        const payment = payload.payment?.entity;

        if (payment?.notes?.clerk_user_id) {
          await clerkClient.users.updateUserMetadata(payment.notes.clerk_user_id, {
            publicMetadata: {
              subscription: {
                plan: 'free',
                status: 'refunded',
                refundedAt: new Date().toISOString(),
                razorpayRefundId: refund.id,
              },
            },
          });
          console.log(`Revoked access for refunded user ${payment.notes.clerk_user_id}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
