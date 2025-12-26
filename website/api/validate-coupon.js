import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  const { code } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ valid: false, error: 'Coupon code is required' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('id, code, discount_amount, is_active, description')
      .eq('code', code.toUpperCase().trim())
      .single();

    if (error || !coupon) {
      return res.status(200).json({ valid: false, error: 'Invalid coupon code' });
    }

    if (!coupon.is_active) {
      return res.status(200).json({ valid: false, error: 'This coupon is no longer active' });
    }

    return res.status(200).json({
      valid: true,
      code: coupon.code,
      discountAmount: coupon.discount_amount,
      description: coupon.description,
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return res.status(500).json({ valid: false, error: 'Failed to validate coupon' });
  }
}
