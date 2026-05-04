import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

async function verifyAdmin(supabase: any, token: string) {
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

async function handleRequest(request: NextRequest, method: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7);
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const adminCheck = await verifyAdmin(supabase, token);
  if (adminCheck.error) {
    return NextResponse.json(
      { error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    switch (method) {
      case 'GET': {
        const { data: coupons, error } = await supabase
          .from('coupons')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json({ coupons });
      }

      case 'POST': {
        const body = await request.json();
        const { code, discountAmount, description } = body;

        if (!code || !discountAmount) {
          return NextResponse.json(
            { error: 'Code and discount amount are required' },
            { status: 400 }
          );
        }

        if (discountAmount < 100 || discountAmount > 199900) {
          return NextResponse.json(
            { error: 'Discount must be between ₹1 and ₹1999' },
            { status: 400 }
          );
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
            return NextResponse.json(
              { error: 'Coupon code already exists' },
              { status: 400 }
            );
          }
          throw error;
        }

        return NextResponse.json({ coupon }, { status: 201 });
      }

      case 'PUT': {
        const body = await request.json();
        const { id, code, discountAmount, description, isActive } = body;

        if (!id) {
          return NextResponse.json(
            { error: 'Coupon ID is required' },
            { status: 400 }
          );
        }

        const updates: any = {};
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
        return NextResponse.json({ coupon });
      }

      case 'DELETE': {
        const body = await request.json();
        const { id } = body;

        if (!id) {
          return NextResponse.json(
            { error: 'Coupon ID is required' },
            { status: 400 }
          );
        }

        const { error } = await supabase
          .from('coupons')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json(
          { error: 'Method not allowed' },
          { status: 405 }
        );
    }
  } catch (error) {
    console.error('Admin coupons error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return handleRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
  return handleRequest(request, 'POST');
}

export async function PUT(request: NextRequest) {
  return handleRequest(request, 'PUT');
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request, 'DELETE');
}
