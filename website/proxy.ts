import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import contentData from './src/data/content.json';

interface Article {
  id: string;
  premium: boolean;
}

const articles = contentData as Article[];
const premiumArticleIds = new Set(
  articles.filter((a) => a.premium).map((a) => a.id)
);

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables not configured');
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  const { data: { session } } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // Handle article routes - set access level header for static content serving
  if (pathname.startsWith('/resource/')) {
    const articleId = pathname.replace('/resource/', '');

    // Check if this is a premium article
    if (!premiumArticleIds.has(articleId)) {
      // Free article - set header indicating free content
      supabaseResponse.headers.set('x-article-access', 'free');
      return supabaseResponse;
    }

    // Premium article - check user's subscription
    if (!session) {
      // No session - show paywall
      supabaseResponse.headers.set('x-article-access', 'paywall');
      return supabaseResponse;
    }

    // User is authenticated - check subscription status
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, subscription_expires_at')
      .eq('id', session.user.id)
      .single();

    const subscription = profile || {
      subscription_status: 'free',
      subscription_expires_at: null,
    };

    // Check if user has active premium subscription
    const isActive = subscription.subscription_status === 'active';
    const isExpired = subscription.subscription_expires_at &&
      new Date(subscription.subscription_expires_at) < new Date();

    if (isActive && !isExpired) {
      // User has premium access
      supabaseResponse.headers.set('x-article-access', 'premium');
      supabaseResponse.headers.set('x-user-id', session.user.id);
    } else {
      // User is authenticated but not premium
      supabaseResponse.headers.set('x-article-access', 'paywall');
      supabaseResponse.headers.set('x-user-id', session.user.id);
    }

    return supabaseResponse;
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!session) {
      // Redirect to home with auth modal open
      const url = new URL('/', request.url);
      url.searchParams.set('auth', 'signin');
      return NextResponse.redirect(url);
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single();

    if (!profile?.is_admin) {
      // Not an admin, redirect to home
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/resource/:path*',
  ],
};
