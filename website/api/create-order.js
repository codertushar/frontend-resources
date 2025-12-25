import Razorpay from 'razorpay';
import { clerkClient } from '@clerk/clerk-sdk-node';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify authentication
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.substring(7);

  try {
    // Verify the session token and get user
    const { sub: userId } = await clerkClient.verifyToken(token);

    if (!userId) {
      return res.status(401).json({ error: 'Invalid token' });
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
    return res.status(500).json({ error: 'Failed to create order' });
  }
}
