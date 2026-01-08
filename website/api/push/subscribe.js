import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Try both env var names (VITE_ prefix for local dev, non-prefixed for server)
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase config missing:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseServiceKey
    });
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  const { subscription, userId } = req.body;

  console.log('Received subscription request:', {
    hasEndpoint: !!subscription?.endpoint,
    hasKeys: !!subscription?.keys,
    userId
  });

  if (!subscription || !subscription.endpoint || !subscription.keys) {
    return res.status(400).json({ error: 'Invalid push subscription' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Upsert subscription (update if endpoint exists, insert if not)
    const { data, error } = await supabase
      .from('push_subscriptions')
      .upsert(
        {
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          user_id: userId || null,
          last_used: new Date().toISOString(),
        },
        {
          onConflict: 'endpoint',
          ignoreDuplicates: false,
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Error saving subscription:', error);
      return res.status(500).json({ error: 'Failed to save subscription' });
    }

    return res.status(200).json({ success: true, id: data.id });
  } catch (error) {
    console.error('Error in subscribe handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
