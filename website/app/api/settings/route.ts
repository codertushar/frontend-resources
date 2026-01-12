import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Supabase credentials missing!');
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 500 }
    );
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: settings, error } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', ['base_price', 'currency']);

    if (error) {
      console.error('❌ Supabase query error:', error.message);
      return NextResponse.json(
        { error: 'Failed to fetch settings' },
        { status: 500 }
      );
    }

    if (!settings || settings.length === 0) {
      return NextResponse.json(
        { error: 'Settings not configured' },
        { status: 500 }
      );
    }

    // Convert to object
    const settingsObj: Record<string, string> = {};
    settings.forEach((s) => {
      settingsObj[s.key] = s.value;
    });

    if (!settingsObj.base_price) {
      return NextResponse.json(
        { error: 'base_price not configured' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      basePrice: parseInt(settingsObj.base_price, 10),
      currency: settingsObj.currency || 'INR',
    });
  } catch (error) {
    console.error('❌ Settings API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
