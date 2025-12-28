import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'nodejs',
};

async function getBasePrice(supabase) {
  const { data: setting, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'base_price')
    .single();

  if (error) {
    throw new Error('Failed to fetch base_price from database');
  }

  if (!setting?.value) {
    throw new Error('base_price not found in database');
  }

  return parseInt(setting.value, 10);
}

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
  const { couponCode } = req.body || {};

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

    // Get base price from settings
    const basePrice = await getBasePrice(supabase);

    // Validate and apply coupon if provided
    let finalAmount = basePrice;
    let appliedCoupon = null;

    if (couponCode) {
      const { data: coupon, error: couponError } = await supabase
        .from('coupons')
        .select('id, code, discount_amount, is_active')
        .eq('code', couponCode.toUpperCase().trim())
        .single();

      if (couponError || !coupon) {
        return res.status(400).json({ error: 'Invalid coupon code' });
      }

      if (!coupon.is_active) {
        return res.status(400).json({ error: 'This coupon is no longer active' });
      }

      // Apply discount (ensure amount doesn't go below minimum)
      const discountedAmount = basePrice - coupon.discount_amount;
      finalAmount = Math.max(discountedAmount, 100); // Minimum ₹1 (100 paise)
      appliedCoupon = {
        code: coupon.code,
        discountAmount: coupon.discount_amount,
      };
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Create order with final amount
    const shortUserId = user.id.slice(-8);
    const timestamp = Date.now().toString().slice(-10);
    const order = await razorpay.orders.create({
      amount: finalAmount,
      currency: 'INR',
      receipt: `rcpt_${shortUserId}_${timestamp}`,
      notes: {
        supabase_user_id: user.id,
        user_email: user.email,
        plan: 'lifetime',
        ...(appliedCoupon && {
          coupon_code: appliedCoupon.code,
          coupon_discount: appliedCoupon.discountAmount,
          original_amount: basePrice,
        }),
      },
    });

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      originalAmount: basePrice,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      user: {
        name: profile?.full_name || user.user_metadata?.full_name || '',
        email: user.email,
      },
      ...(appliedCoupon && { appliedCoupon }),
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({
      error: 'Failed to create order',
      details: error.message,
    });
  }
}
