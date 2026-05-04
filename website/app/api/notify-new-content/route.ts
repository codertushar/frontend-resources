import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webPush from 'web-push';

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
  const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@crackfrontend.dev';
  const webhookSecret = process.env.NOTIFICATION_WEBHOOK_SECRET;

  const body = await request.json();

  // Verify webhook secret
  const authToken = request.headers.get('x-webhook-secret') || body?.secret;
  if (!webhookSecret || authToken !== webhookSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  if (!vapidPublicKey || !vapidPrivateKey) {
    return NextResponse.json({ error: 'VAPID keys not configured' }, { status: 500 });
  }

  const { title, body: notifBody, url, articleCount } = body;

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
    const isExplicitNotification = title && notifBody;

    if (!hasNewArticles && !isExplicitNotification) {
      return NextResponse.json({
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
      return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No subscribers to notify',
        sent: 0,
        failed: 0
      });
    }

    // Build notification content
    const newArticleCount = currentCount - lastCount;
    const notificationTitle = title || 'New Articles Published!';
    const notificationBody = notifBody || (
      newArticleCount === 1
        ? 'A new article is waiting for you!'
        : `${newArticleCount} new articles are waiting for you!`
    );

    const payload = JSON.stringify({
      title: notificationTitle,
      body: notificationBody,
      url: url || '/library',
    });

    let sent = 0;
    let failed = 0;
    const failedEndpoints: string[] = [];

    // Send to all subscribers
    const results = await Promise.allSettled(
      subscriptions.map(async (sub: any) => {
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
        } catch (error: any) {
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

    return NextResponse.json({
      success: true,
      sent,
      failed,
      removedInvalid: failedEndpoints.length,
      previousCount: lastCount,
      currentCount,
    });
  } catch (error) {
    console.error('Error in notify-new-content:', error);
    return NextResponse.json({ error: 'Failed to process notification' }, { status: 500 });
  }
}
