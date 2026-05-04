import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

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
    const { amount } = body || {};

    // Validate amount for donations
    if (!amount || typeof amount !== 'number' || amount < 100) {
      return NextResponse.json(
        { error: 'Invalid donation amount (minimum ₹1)' },
        { status: 400 }
      );
    }

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

    // Get user profile for user details
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', user.id)
      .single();

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });

    // Create order for donation
    const shortUserId = user.id.slice(-8);
    const timestamp = Date.now().toString().slice(-10);
    const orderResponse = (await razorpay.orders.create({
      amount: amount,
      currency: 'INR',
      receipt: `donation_${shortUserId}_${timestamp}`,
      notes: {
        supabase_user_id: user.id,
        user_email: user.email || '',
        type: 'donation',
      },
    })) as any;

    return NextResponse.json({
      orderId: orderResponse.id,
      amount: orderResponse.amount,
      currency: orderResponse.currency,
      keyId: razorpayKeyId,
      user: {
        name: profile?.full_name || user.user_metadata?.full_name || '',
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error creating donation order:', error);
    return NextResponse.json(
      {
        error: 'Failed to create donation order',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
