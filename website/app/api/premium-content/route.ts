import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Module-level cache for premium content (persists across requests in serverless warm instances)
let cachedPremiumContent: Record<string, string> | null = null;
let cacheLoadedAt: number | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes TTL for cache refresh

// Load premium content with caching
function getPremiumContent(): Record<string, string> {
  // Return cached content if still valid
  if (cachedPremiumContent && cacheLoadedAt && (Date.now() - cacheLoadedAt < CACHE_TTL)) {
    return cachedPremiumContent;
  }

  try {
    const possiblePaths = [
      join(process.cwd(), 'src', 'data', 'premium-content.json'),
      join(process.cwd(), 'website', 'src', 'data', 'premium-content.json'),
    ];

    for (const filePath of possiblePaths) {
      try {
        const content = readFileSync(filePath, 'utf-8');
        cachedPremiumContent = JSON.parse(content) as Record<string, string>;
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawArticleId = searchParams.get('articleId');

  if (!rawArticleId) {
    return NextResponse.json(
      { error: 'Article ID is required' },
      { status: 400 }
    );
  }

  const articleId = decodeURIComponent(rawArticleId);

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 500 }
    );
  }

  const premiumContent = getPremiumContent();

  if (!premiumContent[articleId]) {
    return NextResponse.json(
      { error: 'Article not found or is not premium' },
      { status: 404 }
    );
  }

  // Get auth token from header
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7);

  try {
    // Create Supabase client with service role for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get user's subscription from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_status, subscription_plan, subscription_expires_at')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json(
        { error: 'Failed to verify subscription' },
        { status: 500 }
      );
    }

    // Check if user has active premium subscription
    const subscription = profile || { subscription_status: 'free', subscription_plan: null, subscription_expires_at: null };

    if (subscription.subscription_status !== 'active') {
      return NextResponse.json(
        {
          error: 'Premium subscription required',
          subscriptionStatus: subscription.subscription_status || 'none',
        },
        { status: 403 }
      );
    }

    // Check if subscription is expired
    if (subscription.subscription_expires_at &&
        new Date(subscription.subscription_expires_at) < new Date()) {
      return NextResponse.json(
        {
          error: 'Subscription expired',
          expiresAt: subscription.subscription_expires_at,
        },
        { status: 403 }
      );
    }

    // User is authorized, return full content
    return NextResponse.json({
      content: premiumContent[articleId],
      articleId,
    });
  } catch (error) {
    console.error('Error fetching premium content:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch content',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
