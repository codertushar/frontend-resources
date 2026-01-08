import { createClient } from '@supabase/supabase-js';
import webPush from 'web-push';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
  const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@crackfrontend.dev';
  const webhookSecret = process.env.NOTIFICATION_WEBHOOK_SECRET;

  // Verify webhook secret
  const authToken = req.headers['x-webhook-secret'] || req.body?.secret;
  if (!webhookSecret || authToken !== webhookSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  if (!vapidPublicKey || !vapidPrivateKey) {
    return res.status(500).json({ error: 'VAPID keys not configured' });
  }

  const { title, body, url, articleCount } = req.body;

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the last known article count from settings
    const { data: lastCountData } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'last_article_count')
      .single();

    const lastCount = lastCountData?.value ? parseInt(lastCountData.value, 10) : 0;
    const currentCount = articleCount || 0;

    // Update stored count
    if (currentCount > 0) {
      await supabase
        .from('settings')
        .upsert(
          { key: 'last_article_count', value: String(currentCount) },
          { onConflict: 'key' }
        );
    }

    // Only send notification if there are genuinely new articles
    // or if title/body are explicitly provided (manual trigger from deploy)
    const hasNewArticles = currentCount > lastCount && lastCount > 0;
    const isExplicitNotification = title && body;

    if (!hasNewArticles && !isExplicitNotification) {
      return res.status(200).json({
        success: true,
        message: 'No new content to notify about',
        previousCount: lastCount,
        currentCount,
        sent: 0
      });
    }

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

    // Build notification content
    const newArticleCount = currentCount - lastCount;
    const notificationTitle = title || 'New Articles Published!';
    const notificationBody = body || (
      newArticleCount === 1
        ? 'A new article is waiting for you!'
        : `${newArticleCount} new articles are waiting for you!`
    );

    const payload = JSON.stringify({
      title: notificationTitle,
      body: notificationBody,
      url: url || '/frontend-resources/library',
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
          await supabase
            .from('push_subscriptions')
            .update({ last_used: new Date().toISOString() })
            .eq('id', sub.id);
          return { success: true, id: sub.id };
        } catch (error) {
          if (error.statusCode === 410 || error.statusCode === 404) {
            failedEndpoints.push(sub.endpoint);
          }
          throw error;
        }
      })
    );

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
        title: notificationTitle,
        body: notificationBody,
        url: url || null,
        sent_by: null, // System triggered
        total_sent: sent,
        total_failed: failed,
        trigger_type: 'deploy',
      });

    return res.status(200).json({
      success: true,
      sent,
      failed,
      removedInvalid: failedEndpoints.length,
      previousCount: lastCount,
      currentCount,
    });
  } catch (error) {
    console.error('Error in notify-new-content:', error);
    return res.status(500).json({ error: 'Failed to process notification' });
  }
}
