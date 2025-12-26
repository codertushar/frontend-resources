import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'nodejs',
};

// Default settings values
const DEFAULTS = {
  base_price: '200000', // ₹2000 in paise
  currency: 'INR',
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    // Return defaults if Supabase not configured
    return res.status(200).json({
      basePrice: parseInt(DEFAULTS.base_price, 10),
      currency: DEFAULTS.currency,
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: settings, error } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', ['base_price', 'currency']);

    if (error) {
      console.error('Error fetching settings:', error);
      // Return defaults on error
      return res.status(200).json({
        basePrice: parseInt(DEFAULTS.base_price, 10),
        currency: DEFAULTS.currency,
      });
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
    return res.status(200).json({
      basePrice: parseInt(DEFAULTS.base_price, 10),
      currency: DEFAULTS.currency,
    });
  }
}
