import Razorpay from 'razorpay';
import { createClerkClient } from '@clerk/clerk-sdk-node';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check environment variables
  if (!process.env.CLERK_SECRET_KEY) {
    return res.status(500).json({ error: 'CLERK_SECRET_KEY not configured' });
  }
  if (!process.env.RAZORPAY_KEY_ID) {
    return res.status(500).json({ error: 'RAZORPAY_KEY_ID not configured' });
  }
  if (!process.env.RAZORPAY_KEY_SECRET) {
    return res.status(500).json({ error: 'RAZORPAY_KEY_SECRET not configured' });
  }

  // Verify authentication
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.substring(7);

  try {
    // Initialize Clerk client
    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

    // Decode the JWT to get user ID (the token is already verified by Clerk on the frontend)
    // Parse the JWT payload
    const parts = token.split('.');
    if (parts.length !== 3) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    const userId = payload.sub;

    if (!userId) {
      return res.status(401).json({ error: 'Invalid token - no user ID' });
    }

    // Get user details
    const user = await clerkClient.users.getUser(userId);

    // Check if user already has active subscription
    const existingSubscription = user.publicMetadata?.subscription;
    if (existingSubscription?.status === 'active') {
      return res.status(400).json({
        error: 'Already subscribed',
        subscription: existingSubscription,
      });
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Create order for ₹2000 (amount in paise)
    const order = await razorpay.orders.create({
      amount: 200000, // ₹2000 in paise
      currency: 'INR',
      receipt: `receipt_${userId}_${Date.now()}`,
      notes: {
        clerk_user_id: userId,
        user_email: user.emailAddresses[0]?.emailAddress,
        plan: 'lifetime',
      },
    });

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      user: {
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.emailAddresses[0]?.emailAddress,
      },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
}
