import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'nodejs',
};

// Default settings values (base_price must come from database)
const DEFAULTS = {
  currency: 'INR',
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    // Supabase not configured - cannot fetch base_price
    return res.status(400).json({ error: 'Supabase not configured' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: settings, error } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', ['base_price', 'currency']);

    if (error) {
      console.error('Error fetching settings:', error);
      return res.status(500).json({ error: 'Failed to fetch settings from database' });
    }

    // Convert to object with defaults
    const settingsObj = { ...DEFAULTS };
    (settings || []).forEach(s => {
      settingsObj[s.key] = s.value;
    });

    return res.status(200).json({
      basePrice: parseInt(settingsObj.base_price, 10),
      currency: settingsObj.currency,
    });
  } catch (error) {
    console.error('Settings error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
