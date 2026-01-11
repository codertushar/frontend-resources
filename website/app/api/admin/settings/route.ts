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
        const { data: settings, error } = await supabase
          .from('settings')
          .select('*');

        if (error) throw error;

        // Convert to key-value object
        const settingsObj: Record<string, any> = {};
        (settings || []).forEach((s: any) => {
          settingsObj[s.key] = s.value;
        });

        return NextResponse.json({ settings: settingsObj });
      }

      case 'PUT': {
        const body = await request.json();
        const { key, value } = body;

        if (!key) {
          return NextResponse.json(
            { error: 'Setting key is required' },
            { status: 400 }
          );
        }

        const { data: setting, error } = await supabase
          .from('settings')
          .upsert({
            key,
            value: String(value),
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'key',
          })
          .select()
          .single();

        if (error) throw error;
        return NextResponse.json({ setting });
      }

      default:
        return NextResponse.json(
          { error: 'Method not allowed' },
          { status: 405 }
        );
    }
  } catch (error) {
    console.error('Admin settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return handleRequest(request, 'GET');
}

export async function PUT(request: NextRequest) {
  return handleRequest(request, 'PUT');
}
