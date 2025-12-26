import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'nodejs',
};

async function verifyAdmin(supabase, token) {
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return { error: 'Invalid token', status: 401 };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    return { error: 'Admin access required', status: 403 };
  }

  return { user };
}

export default async function handler(req, res) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.substring(7);
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const adminCheck = await verifyAdmin(supabase, token);
  if (adminCheck.error) {
    return res.status(adminCheck.status).json({ error: adminCheck.error });
  }

  try {
    switch (req.method) {
      case 'GET': {
        const { data: coupons, error } = await supabase
          .from('coupons')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return res.status(200).json({ coupons });
      }

      case 'POST': {
        const { code, discountAmount, description } = req.body;

        if (!code || !discountAmount) {
          return res.status(400).json({ error: 'Code and discount amount are required' });
        }

        if (discountAmount < 100 || discountAmount > 199900) {
          return res.status(400).json({ error: 'Discount must be between ₹1 and ₹1999' });
        }

        const { data: coupon, error } = await supabase
          .from('coupons')
          .insert({
            code: code.toUpperCase().trim(),
            discount_amount: discountAmount,
            description: description || null,
            is_active: true,
          })
          .select()
          .single();

        if (error) {
          if (error.code === '23505') {
            return res.status(400).json({ error: 'Coupon code already exists' });
          }
          throw error;
        }

        return res.status(201).json({ coupon });
      }

      case 'PUT': {
        const { id, code, discountAmount, description, isActive } = req.body;

        if (!id) {
          return res.status(400).json({ error: 'Coupon ID is required' });
        }

        const updates = {};
        if (code !== undefined) updates.code = code.toUpperCase().trim();
        if (discountAmount !== undefined) updates.discount_amount = discountAmount;
        if (description !== undefined) updates.description = description;
        if (isActive !== undefined) updates.is_active = isActive;
        updates.updated_at = new Date().toISOString();

        const { data: coupon, error } = await supabase
          .from('coupons')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return res.status(200).json({ coupon });
      }

      case 'DELETE': {
        const { id } = req.body;

        if (!id) {
          return res.status(400).json({ error: 'Coupon ID is required' });
        }

        const { error } = await supabase
          .from('coupons')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return res.status(200).json({ success: true });
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Admin coupons error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
