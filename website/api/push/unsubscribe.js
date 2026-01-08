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

  const { endpoint } = req.body;

  if (!endpoint) {
    return res.status(400).json({ error: 'Endpoint is required' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('endpoint', endpoint);

    if (error) {
      console.error('Error removing subscription:', error);
      return res.status(500).json({ error: 'Failed to remove subscription' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in unsubscribe handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
