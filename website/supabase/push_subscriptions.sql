-- Push Subscriptions Table for Web Push Notifications
-- Run this in your Supabase SQL Editor

-- Create the push_subscriptions table
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL UNIQUE,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);

-- Enable Row Level Security
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own subscriptions (or anonymous)
CREATE POLICY "Anyone can subscribe to push notifications"
ON push_subscriptions FOR INSERT
WITH CHECK (true);

-- Policy: Users can delete their own subscriptions
CREATE POLICY "Users can delete their own subscriptions"
ON push_subscriptions FOR DELETE
USING (user_id IS NULL OR auth.uid() = user_id);

-- Policy: Service role can read all subscriptions (for sending notifications)
CREATE POLICY "Service role can read all subscriptions"
ON push_subscriptions FOR SELECT
USING (auth.role() = 'service_role');

-- Policy: Service role can delete invalid subscriptions
CREATE POLICY "Service role can delete subscriptions"
ON push_subscriptions FOR DELETE
USING (auth.role() = 'service_role');

-- Table for tracking notification history (optional but useful)
CREATE TABLE IF NOT EXISTS notification_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT,
    url TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_by UUID REFERENCES auth.users(id),
    total_sent INTEGER DEFAULT 0,
    total_failed INTEGER DEFAULT 0,
    trigger_type TEXT DEFAULT 'manual' -- 'manual', 'deploy', 'scheduled'
);

-- Enable RLS for notification_history
ALTER TABLE notification_history ENABLE ROW LEVEL SECURITY;

-- Only admins can view notification history
CREATE POLICY "Admins can view notification history"
ON notification_history FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
);

-- Service role can insert notification history
CREATE POLICY "Service role can insert notification history"
ON notification_history FOR INSERT
WITH CHECK (auth.role() = 'service_role');
