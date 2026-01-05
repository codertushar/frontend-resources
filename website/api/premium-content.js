import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

export const config = {
  runtime: 'nodejs',
};

// Module-level cache for premium content (persists across requests in serverless warm instances)
let cachedPremiumContent = null;
let cacheLoadedAt = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes TTL for cache refresh

// Load premium content with caching
function getPremiumContent() {
  // Return cached content if still valid
  if (cachedPremiumContent && cacheLoadedAt && (Date.now() - cacheLoadedAt < CACHE_TTL)) {
    return cachedPremiumContent;
  }

  try {
    const possiblePaths = [
      join(process.cwd(), 'src', 'data', 'premium-content.json'),
      join(process.cwd(), 'website', 'src', 'data', 'premium-content.json'),
      join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'premium-content.json'),
    ];

    for (const filePath of possiblePaths) {
      try {
        const content = readFileSync(filePath, 'utf-8');
        cachedPremiumContent = JSON.parse(content);
        cacheLoadedAt = Date.now();
        return cachedPremiumContent;
      } catch (e) {
        // Try next path
      }
    }

    console.error('Could not find premium-content.json');
    return {};
  } catch (error) {
    console.error('Error loading premium content:', error);
    return {};
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { articleId: rawArticleId } = req.query;

  if (!rawArticleId) {
    return res.status(400).json({ error: 'Article ID is required' });
  }

  const articleId = decodeURIComponent(rawArticleId);

  // Check environment variables
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  const premiumContent = getPremiumContent();

  if (!premiumContent[articleId]) {
    return res.status(404).json({ error: 'Article not found or is not premium' });
  }

  // Get auth token from header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.substring(7);

  try {
    // Create Supabase client with service role for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get user's subscription from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_status, subscription_plan, subscription_expires_at')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching profile:', profileError);
      return res.status(500).json({ error: 'Failed to verify subscription' });
    }

    // Check if user has active premium subscription
    const subscription = profile || { subscription_status: 'free' };

    if (subscription.subscription_status !== 'active') {
      return res.status(403).json({
        error: 'Premium subscription required',
        subscriptionStatus: subscription.subscription_status || 'none',
      });
    }

    // Check if subscription is expired
    if (subscription.subscription_expires_at &&
        new Date(subscription.subscription_expires_at) < new Date()) {
      return res.status(403).json({
        error: 'Subscription expired',
        expiresAt: subscription.subscription_expires_at,
      });
    }

    // User is authorized, return full content
    return res.status(200).json({
      content: premiumContent[articleId],
      articleId,
    });
  } catch (error) {
    console.error('Error fetching premium content:', error);
    return res.status(500).json({
      error: 'Failed to fetch content',
      details: error.message
    });
  }
}
