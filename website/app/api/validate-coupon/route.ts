import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('id, code, discount_amount, is_active, description')
      .eq('code', code.toUpperCase().trim())
      .single();

    if (error || !coupon) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid coupon code'
      });
    }

    if (!coupon.is_active) {
      return NextResponse.json({
        valid: false,
        error: 'This coupon is no longer active'
      });
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discountAmount: coupon.discount_amount,
      description: coupon.description,
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { valid: false, error: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}
