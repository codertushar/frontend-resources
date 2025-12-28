import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Supabase credentials missing!');
    console.error('   VITE_SUPABASE_URL:', supabaseUrl ? '✅ set' : '❌ missing');
    console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ set' : '❌ missing');
    return res.status(400).json({
      error: 'Supabase not configured',
      details: 'Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
    });
  }

  try {
    console.log('📡 Fetching settings from Supabase...');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: settings, error } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', ['base_price', 'currency']);

    if (error) {
      console.error('❌ Supabase query error:', error.message);
      console.error('   Code:', error.code);
      console.error('   Details:', error.details);
      return res.status(500).json({
        error: 'Failed to fetch settings',
        details: error.message,
        code: error.code
      });
    }

    if (!settings || settings.length === 0) {
      console.error('❌ Settings table exists but is empty!');
      console.error('   Please add rows with keys: "base_price" and "currency"');
      return res.status(500).json({
        error: 'Settings table is empty',
        details: 'Please add settings rows to the database',
        requiredKeys: ['base_price', 'currency']
      });
    }

    // Convert to object
    const settingsObj = {};
    (settings || []).forEach(s => {
      settingsObj[s.key] = s.value;
    });

    console.log('✅ Settings fetched successfully:', settingsObj);

    if (!settingsObj.base_price) {
      console.warn('⚠️  base_price not found in settings');
      return res.status(500).json({
        error: 'base_price not configured',
        details: 'Add a setting with key="base_price"'
      });
    }

    return res.status(200).json({
      basePrice: Number.parseInt(settingsObj.base_price, 10),
      currency: settingsObj.currency || 'INR',
    });
  } catch (error) {
    console.error('❌ Settings API error:', error.message);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}
