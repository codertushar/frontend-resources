import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check environment variables
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Supabase not configured' });
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
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the JWT token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get user profile to check existing subscription
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, email, full_name')
      .eq('id', user.id)
      .single();

    // Check if user already has active subscription
    if (profile?.subscription_status === 'active') {
      return res.status(400).json({
        error: 'Already subscribed',
        subscription: { status: profile.subscription_status },
      });
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Create order for ₹2000 (amount in paise)
    const shortUserId = user.id.slice(-8);
    const timestamp = Date.now().toString().slice(-10);
    const order = await razorpay.orders.create({
      amount: 200000, // ₹2000 in paise
      currency: 'INR',
      receipt: `rcpt_${shortUserId}_${timestamp}`,
      notes: {
        supabase_user_id: user.id,
        user_email: user.email,
        plan: 'lifetime',
      },
    });

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      user: {
        name: profile?.full_name || user.user_metadata?.full_name || '',
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({
      error: 'Failed to create order',
      details: error.message,
    });
  }
}
