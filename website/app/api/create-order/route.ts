import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

async function getBasePrice(supabase: any): Promise<number> {
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

  return Number.parseInt(setting.value, 10);
}

export async function POST(request: NextRequest) {
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
  const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 500 }
    );
  }
  if (!razorpayKeyId || !razorpayKeySecret) {
    return NextResponse.json(
      { error: 'Razorpay not configured' },
      { status: 500 }
    );
  }

  // Verify authentication
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7);

  try {
    const body = await request.json();
    const { couponCode } = body || {};

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the JWT token and get user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get user profile to check existing subscription
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, email, full_name')
      .eq('id', user.id)
      .single();

    // Check if user already has active subscription
    if (profile?.subscription_status === 'active') {
      return NextResponse.json(
        {
          error: 'Already subscribed',
          subscription: { status: profile.subscription_status },
        },
        { status: 400 }
      );
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
        return NextResponse.json(
          { error: 'Invalid coupon code' },
          { status: 400 }
        );
      }

      if (!coupon.is_active) {
        return NextResponse.json(
          { error: 'This coupon is no longer active' },
          { status: 400 }
        );
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
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });

    // Create order with final amount
    const shortUserId = user.id.slice(-8);
    const timestamp = Date.now().toString().slice(-10);
    const orderResponse = (await razorpay.orders.create({
      amount: finalAmount,
      currency: 'INR',
      receipt: `rcpt_${shortUserId}_${timestamp}`,
      notes: {
        supabase_user_id: user.id,
        user_email: user.email || '',
        plan: 'lifetime',
        ...(appliedCoupon && {
          coupon_code: appliedCoupon.code,
          coupon_discount: appliedCoupon.discountAmount,
          original_amount: basePrice,
        }),
      },
    })) as any;

    return NextResponse.json({
      orderId: orderResponse.id,
      amount: orderResponse.amount,
      originalAmount: basePrice,
      currency: orderResponse.currency,
      keyId: razorpayKeyId,
      user: {
        name: profile?.full_name || user.user_metadata?.full_name || '',
        email: user.email,
      },
      ...(appliedCoupon && { appliedCoupon }),
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      {
        error: 'Failed to create order',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
