import { createClient } from '@supabase/supabase-js';
import webPush from 'web-push';

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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
  const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@crackfrontend.dev';

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  if (!vapidPublicKey || !vapidPrivateKey) {
    return res.status(500).json({ error: 'VAPID keys not configured' });
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

  const { title, body, url } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    // Configure web-push
    webPush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

    // Fetch all subscriptions
    const { data: subscriptions, error: fetchError } = await supabase
      .from('push_subscriptions')
      .select('*');

    if (fetchError) {
      console.error('Error fetching subscriptions:', fetchError);
      return res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No subscribers to notify',
        sent: 0,
        failed: 0
      });
    }

    const payload = JSON.stringify({
      title,
      body: body || '',
      url: url || '/library',
    });

    let sent = 0;
    let failed = 0;
    const failedEndpoints = [];

    // Send to all subscribers
    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };

        try {
          await webPush.sendNotification(pushSubscription, payload);
          // Update last_used timestamp
          await supabase
            .from('push_subscriptions')
            .update({ last_used: new Date().toISOString() })
            .eq('id', sub.id);
          return { success: true, id: sub.id };
        } catch (error) {
          // If subscription is invalid (410 Gone or 404), remove it
          if (error.statusCode === 410 || error.statusCode === 404) {
            failedEndpoints.push(sub.endpoint);
          }
          throw error;
        }
      })
    );

    // Count successes and failures
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        sent++;
      } else {
        failed++;
      }
    });

    // Remove invalid subscriptions
    if (failedEndpoints.length > 0) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .in('endpoint', failedEndpoints);
    }

    // Log notification history
    await supabase
      .from('notification_history')
      .insert({
        title,
        body: body || null,
        url: url || null,
        sent_by: adminCheck.user.id,
        total_sent: sent,
        total_failed: failed,
        trigger_type: 'manual',
      });

    return res.status(200).json({
      success: true,
      sent,
      failed,
      removedInvalid: failedEndpoints.length,
    });
  } catch (error) {
    console.error('Error sending notifications:', error);
    return res.status(500).json({ error: 'Failed to send notifications' });
  }
}
