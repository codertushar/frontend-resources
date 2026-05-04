# Next.js Migration Plan: frontend-resources Website

> **Estimated Effort:** 2-3 weeks (with refactoring) | 1.5-2 weeks (minimal)
> **Risk Level:** Medium - Well-structured codebase, but large components need care
> **Goal:** Migrate from Vite + React Router to Next.js App Router without breaking functionality

---

## 📊 Current State Summary

| Metric | Value |
|--------|-------|
| Routes | 12 pages |
| API Routes | 10 endpoints |
| React Contexts | 4 providers |
| Lines of Code (Pages) | 10,164 |
| Lines of Code (API) | 1,278 |
| Third-party Services | Supabase, Razorpay, Web Push, Vercel Analytics |

---

## 🎯 Migration Strategy: Incremental Adoption

We'll use **Next.js App Router** with a phased approach:
1. Set up Next.js alongside existing code
2. Migrate routes one-by-one
3. Convert API routes
4. Update state management for SSR
5. Add PWA support
6. Test and deploy

---

## Phase 1: Project Setup (Day 1-2)

### 1.1 Initialize Next.js in Website Directory

```bash
cd website

# Install Next.js dependencies
npm install next@latest

# Install additional Next.js ecosystem packages
npm install @next/third-parties  # For Google Analytics
npm install next-pwa             # For PWA support (optional)
```

### 1.2 Create Next.js Configuration

**Create `next.config.js`:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Preserve existing static export behavior during transition
  output: 'standalone',

  // Image optimization domains
  images: {
    domains: ['your-supabase-project.supabase.co'],
    unoptimized: false,
  },

  // Environment variables (replace VITE_ prefix)
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  // Redirects for backward compatibility
  async redirects() {
    return [
      // Add any URL structure changes here
    ];
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ];
  },

  // Webpack customization (if needed for existing plugins)
  webpack: (config, { isServer }) => {
    // Keep any custom webpack config
    return config;
  },
};

module.exports = nextConfig;
```

### 1.3 Update Environment Variables

**Rename `.env` variables:**
```bash
# Before (Vite)
VITE_SUPABASE_URL=xxx
VITE_SUPABASE_ANON_KEY=xxx

# After (Next.js)
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# Server-only (no change needed)
SUPABASE_SERVICE_ROLE_KEY=xxx
RAZORPAY_KEY_ID=xxx
RAZORPAY_KEY_SECRET=xxx
RAZORPAY_WEBHOOK_SECRET=xxx
VAPID_PUBLIC_KEY=xxx
VAPID_PRIVATE_KEY=xxx
```

### 1.4 Update Package.json Scripts

```json
{
  "scripts": {
    "dev": "npm run generate && next dev",
    "build": "npm run generate && next build",
    "start": "next start",
    "lint": "next lint",
    "generate": "node scripts/generate-content.js && node scripts/generate-sitemap.js",
    "type-check": "tsc --noEmit"
  }
}
```

### 1.5 Create App Directory Structure

```
website/
├── app/                          # NEW: Next.js App Router
│   ├── layout.tsx                # Root layout (replaces App.tsx)
│   ├── page.tsx                  # Home page
│   ├── globals.css               # Global styles (from index.css)
│   ├── providers.tsx             # Client-side providers wrapper
│   ├── library/
│   │   └── page.tsx
│   ├── resource/
│   │   └── [...slug]/
│   │       └── page.tsx          # Dynamic catch-all route
│   ├── practice/
│   │   ├── page.tsx
│   │   └── [questionId]/
│   │       └── page.tsx
│   ├── pricing/
│   │   └── page.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── privacy/
│   │   └── page.tsx
│   ├── terms/
│   │   └── page.tsx
│   ├── admin/
│   │   └── page.tsx
│   └── api/                      # API routes
│       ├── create-order/
│       │   └── route.ts
│       ├── razorpay-webhook/
│       │   └── route.ts
│       ├── premium-content/
│       │   └── route.ts
│       ├── validate-coupon/
│       │   └── route.ts
│       ├── push/
│       │   ├── subscribe/
│       │   │   └── route.ts
│       │   ├── unsubscribe/
│       │   │   └── route.ts
│       │   └── vapid-public-key/
│       │       └── route.ts
│       └── admin/
│           ├── coupons/
│           │   └── route.ts
│           ├── settings/
│           │   └── route.ts
│           └── send-notification/
│               └── route.ts
├── src/                          # KEEP: Existing components, hooks, types
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   └── data/
├── public/                       # KEEP: Static assets
└── scripts/                      # KEEP: Build scripts
```

---

## Phase 2: Root Layout & Providers (Day 2-3)

### 2.1 Create Root Layout

**`app/layout.tsx`:**
```tsx
import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://crackfrontend.dev'),
  title: {
    default: 'Crack Frontend - Master Frontend Development',
    template: '%s | Crack Frontend',
  },
  description: 'Master frontend development with practical examples, interview prep, and real-world implementations.',
  keywords: ['frontend', 'javascript', 'react', 'interview prep', 'web development'],
  authors: [{ name: 'Crack Frontend' }],
  creator: 'Crack Frontend',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://crackfrontend.dev',
    siteName: 'Crack Frontend',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@crackfrontend',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#8b5cf6',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme detection script - runs before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.classList.add(theme);
              })();
            `,
          }}
        />
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6335516948550888"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### 2.2 Create Client Providers Wrapper

**`app/providers.tsx`:**
```tsx
'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { SubscriptionProvider } from '@/context/SubscriptionContext';
import { ProgressProvider } from '@/context/ProgressContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProgressProvider>
          <SubscriptionProvider>
            {children}
          </SubscriptionProvider>
        </ProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
```

### 2.3 Update Context Files for SSR Compatibility

**Key changes needed in each context:**

```tsx
// Example: ThemeContext.tsx updates
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// Add SSR-safe initial state
const getInitialTheme = (): 'dark' | 'light' => {
  if (typeof window === 'undefined') return 'dark'; // SSR default
  return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getInitialTheme());
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  // ... rest of provider logic
}
```

---

## Phase 3: Page Migration (Day 3-7)

### 3.1 Migration Order (by complexity)

| Order | Page | Complexity | Notes |
|-------|------|------------|-------|
| 1 | About | Low | Static content |
| 2 | Privacy | Low | Static content |
| 3 | Terms | Low | Static content |
| 4 | Contact | Low | Form with client interaction |
| 5 | Pricing | Medium | Payment integration |
| 6 | Home | Medium | Multiple sections |
| 7 | Practice List | Medium | Data fetching |
| 8 | Practice Detail | Medium | Dynamic route |
| 9 | Admin | High | Auth-protected, multiple features |
| 10 | Library | High | Complex filtering, large component |
| 11 | Resource Detail | High | Dynamic route, premium content |

### 3.2 Static Page Migration Example

**`app/about/page.tsx`:**
```tsx
import type { Metadata } from 'next';
import { AboutContent } from '@/components/AboutContent';
import { Layout } from '@/components/Layout';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Crack Frontend and our mission to help developers master frontend development.',
};

export default function AboutPage() {
  return (
    <Layout>
      <AboutContent />
    </Layout>
  );
}
```

### 3.3 Dynamic Route Migration (Resource Detail)

**`app/resource/[...slug]/page.tsx`:**
```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import contentData from '@/data/content.json';
import { ResourceDetailClient } from './ResourceDetailClient';
import { Article } from '@/types';

// Type the content data
const articles = contentData as Article[];

// Generate static params for all articles
export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.id.split('/'),
  }));
}

// Generate metadata for each article
export async function generateMetadata({
  params
}: {
  params: { slug: string[] }
}): Promise<Metadata> {
  const resourceId = params.slug.join('/');
  const article = articles.find((a) => a.id === resourceId);

  if (!article) {
    return { title: 'Article Not Found' };
  }

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
    },
  };
}

export default function ResourcePage({
  params
}: {
  params: { slug: string[] }
}) {
  const resourceId = params.slug.join('/');
  const article = articles.find((a) => a.id === resourceId);

  if (!article) {
    notFound();
  }

  // Pass article data to client component for interactive features
  return <ResourceDetailClient article={article} />;
}
```

**`app/resource/[...slug]/ResourceDetailClient.tsx`:**
```tsx
'use client';

import { useSubscription } from '@/context/SubscriptionContext';
import { useProgress } from '@/context/ProgressContext';
import { Article } from '@/types';
// Import existing ResourceDetail component logic

interface Props {
  article: Article;
}

export function ResourceDetailClient({ article }: Props) {
  const { isPremium } = useSubscription();
  const { markAsRead } = useProgress();

  // ... existing client-side logic (quiz, premium gating, etc.)

  return (
    // ... existing JSX with article content
  );
}
```

### 3.4 Library Page with Server-Side Filtering Option

**`app/library/page.tsx`:**
```tsx
import type { Metadata } from 'next';
import contentData from '@/data/content.json';
import { LibraryClient } from './LibraryClient';
import { Article } from '@/types';

export const metadata: Metadata = {
  title: 'Library - All Frontend Resources',
  description: 'Browse our complete collection of frontend development resources, tutorials, and interview prep materials.',
};

// Server Component - handles initial data
export default function LibraryPage() {
  const articles = contentData as Article[];

  // Pre-compute category counts on server
  const categoryStats = articles.reduce((acc, article) => {
    const category = article.category || 'uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <LibraryClient
      initialArticles={articles}
      categoryStats={categoryStats}
    />
  );
}
```

---

## Phase 4: API Routes Migration (Day 7-9)

### 4.1 API Route Conversion Pattern

**Before (Vercel Function):** `api/create-order.js`
**After (Next.js Route Handler):** `app/api/create-order/route.ts`

### 4.2 Example: Create Order Route

**`app/api/create-order/route.ts`:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Get auth token from header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    // Verify user with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { amount, couponCode } = body;

    // Validate coupon if provided
    let finalAmount = amount;
    if (couponCode) {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode)
        .eq('is_active', true)
        .single();

      if (coupon) {
        finalAmount = amount - (amount * coupon.discount_percent / 100);
      }
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(finalAmount * 100), // Convert to paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        user_id: user.id,
        user_email: user.email,
        coupon_code: couponCode || '',
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
```

### 4.3 API Routes Migration Checklist

| Endpoint | Priority | Notes |
|----------|----------|-------|
| `/api/create-order` | High | Payment flow |
| `/api/razorpay-webhook` | High | Payment confirmation |
| `/api/premium-content` | High | Content delivery |
| `/api/validate-coupon` | Medium | Checkout flow |
| `/api/push/subscribe` | Medium | Notifications |
| `/api/push/unsubscribe` | Medium | Notifications |
| `/api/push/vapid-public-key` | Low | One-time fetch |
| `/api/admin/coupons` | Low | Admin only |
| `/api/admin/settings` | Low | Admin only |
| `/api/admin/send-notification` | Low | Admin only |

---

## Phase 5: Middleware & Auth (Day 9-10)

### 5.1 Create Auth Middleware

**`middleware.ts`** (root of website directory):
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          response.cookies.delete({ name, ...options });
        },
      },
    }
  );

  // Refresh session if expired
  const { data: { session } } = await supabase.auth.getSession();

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/?auth=signin', request.url));
    }

    // Check if user is admin (add your admin check logic)
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
```

---

## Phase 6: PWA & Service Worker (Day 10-11)

### 6.1 Option A: Use next-pwa Package

```bash
npm install next-pwa
```

**Update `next.config.js`:**
```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  // ... existing config
});
```

### 6.2 Option B: Keep Existing Service Worker

Keep `public/service-worker.js` and register it manually:

**`app/ServiceWorkerRegistration.tsx`:**
```tsx
'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('SW registered:', registration.scope);
        })
        .catch((error) => {
          console.error('SW registration failed:', error);
        });
    }
  }, []);

  return null;
}
```

Add to `app/layout.tsx`:
```tsx
import { ServiceWorkerRegistration } from './ServiceWorkerRegistration';

// In the body:
<ServiceWorkerRegistration />
```

---

## Phase 7: Build & Deployment (Day 11-12)

### 7.1 Update Build Process

**`scripts/generate-content.js`** - No changes needed, runs before Next.js build

**Update `package.json`:**
```json
{
  "scripts": {
    "prebuild": "node scripts/generate-content.js && node scripts/generate-sitemap.js",
    "build": "next build",
    "postbuild": "node scripts/generate-sw-version.js"
  }
}
```

### 7.2 Vercel Configuration

**`vercel.json`:**
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "regions": ["bom1"],
  "headers": [
    {
      "source": "/service-worker.js",
      "headers": [
        { "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" }
      ]
    }
  ]
}
```

### 7.3 Environment Variables in Vercel

Ensure all environment variables are set in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT`

---

## Phase 8: Testing & QA (Day 12-14)

### 8.1 Critical Path Testing Checklist

| Flow | Test Cases |
|------|------------|
| **Authentication** | Sign up, sign in, sign out, session persistence |
| **Premium Content** | Free article access, premium paywall, payment flow |
| **Library** | Filtering, search, pagination, category navigation |
| **Article View** | Markdown rendering, quiz functionality, progress tracking |
| **Payment** | Order creation, Razorpay checkout, webhook processing |
| **Admin** | Login protection, coupon management, settings |
| **PWA** | Offline access, push notifications, install prompt |

### 8.2 Performance Validation

```bash
# Run Lighthouse
npx lighthouse https://your-staging-url.vercel.app --view

# Check bundle size
npm run build
npx @next/bundle-analyzer
```

### 8.3 SEO Validation

- [ ] Check all pages have proper meta tags
- [ ] Verify structured data with Google Rich Results Test
- [ ] Test sitemap.xml is accessible
- [ ] Verify robots.txt
- [ ] Check canonical URLs

---

## 🚨 Risk Mitigation

### High-Risk Areas

| Area | Risk | Mitigation |
|------|------|------------|
| **Premium Content** | Exposing content in static HTML | Use middleware + client-side gating |
| **Large Components** | Hydration errors | Split into Server + Client components |
| **Payment Flow** | Breaking checkout | Test thoroughly on staging |
| **Auth State** | SSR/CSR mismatch | Use mounted state check |
| **Service Worker** | Cache conflicts | Version cache, clear on deploy |

### Rollback Plan

1. Keep Vite setup in a separate branch
2. Use Vercel preview deployments for testing
3. Gradual rollout with feature flags if needed
4. Monitor error rates post-deployment

---

## 📅 Timeline Summary

| Week | Phase | Deliverables |
|------|-------|--------------|
| **Week 1** | Setup + Static Pages | Next.js config, layout, 6 simple pages migrated |
| **Week 2** | Complex Pages + APIs | Library, Resource Detail, all API routes |
| **Week 3** | Polish + Deploy | PWA, testing, staging validation, production deploy |

---

## 🔄 Post-Migration Improvements (Optional)

After successful migration, consider:

1. **Image Optimization** - Convert images to use `next/image`
2. **Font Optimization** - Use `next/font` for better performance
3. **Streaming SSR** - Add loading.tsx for better UX
4. **Parallel Routes** - For admin dashboard tabs
5. **Route Groups** - Organize routes by feature
6. **ISR** - Incremental Static Regeneration for articles

---

## ✅ Definition of Done

Migration is complete when:

- [ ] All 12 routes accessible and functional
- [ ] All 10 API routes working
- [ ] Authentication flow works (sign up, sign in, sign out)
- [ ] Premium content properly gated
- [ ] Payment flow completes successfully
- [ ] Library filtering/search works
- [ ] Article quiz functionality works
- [ ] Progress tracking syncs with Supabase
- [ ] PWA installs and works offline
- [ ] Push notifications work
- [ ] Admin panel accessible to admins only
- [ ] Lighthouse score ≥ 90 on all metrics
- [ ] No console errors in production
- [ ] SEO meta tags render in view-source

---

*Last Updated: January 9, 2026*
