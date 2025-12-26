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
        const { data: settings, error } = await supabase
          .from('settings')
          .select('*');

        if (error) throw error;

        // Convert to key-value object
        const settingsObj = {};
        (settings || []).forEach(s => {
          settingsObj[s.key] = s.value;
        });

        return res.status(200).json({ settings: settingsObj });
      }

      case 'PUT': {
        const { key, value } = req.body;

        if (!key) {
          return res.status(400).json({ error: 'Setting key is required' });
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
        return res.status(200).json({ setting });
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Admin settings error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
