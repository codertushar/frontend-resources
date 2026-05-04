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
  const { amount } = req.body || {};

  // Validate amount for donations
  if (!amount || typeof amount !== 'number' || amount < 100) {
    return res.status(400).json({ error: 'Invalid donation amount (minimum ₹1)' });
  }

  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the JWT token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get user profile for user details
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', user.id)
      .single();

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Create order for donation
    const shortUserId = user.id.slice(-8);
    const timestamp = Date.now().toString().slice(-10);
    const order = await razorpay.orders.create({
      amount: amount,
      currency: 'INR',
      receipt: `donation_${shortUserId}_${timestamp}`,
      notes: {
        supabase_user_id: user.id,
        user_email: user.email,
        type: 'donation',
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
    console.error('Error creating donation order:', error);
    return res.status(500).json({
      error: 'Failed to create donation order',
      details: error.message,
    });
  }
}
