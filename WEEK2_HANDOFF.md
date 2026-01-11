# Week 2 Next.js Migration - Handoff Document

**Date**: January 9, 2026  
**Week**: Week 2 of 3  
**Status**: 60% Complete ✅  
**Ready for**: Week 3 - API Routes & Middleware  

---

## 📋 What Was Accomplished

### Core Page Migrations ✅
- **Library Page**: `app/library/page.tsx` + `LibraryClient.tsx`
- **Resource Detail**: `app/resource/[...slug]/page.tsx` + `ResourceDetailClient.tsx`
- **API Route**: `app/api/create-order/route.ts`

### Infrastructure ✅
- TypeScript path aliases configured
- All context providers set up for Next.js (SSR-safe)
- Layout and providers properly wired

---

## 🎯 What Needs to Be Done (Week 3 Priority Order)

### IMMEDIATE (This should be your focus right now):

#### 1. Complete Remaining API Routes
Create these Next.js route handlers from existing Vercel Functions:

```bash
# High Priority (Payment flow)
app/api/razorpay-webhook/route.ts
app/api/premium-content/route.ts
app/api/validate-coupon/route.ts

# Medium Priority (Admin & Notifications)
app/api/push/subscribe/route.ts
app/api/push/unsubscribe/route.ts
app/api/push/vapid-public-key/route.ts
app/api/admin/coupons/route.ts
app/api/admin/settings/route.ts
app/api/admin/send-notification/route.ts
```

**Reference**: Look at `/api/create-order/route.ts` for the pattern and `/api/create-order.js` in the old api folder for the logic.

#### 2. Create Middleware for Admin Protection
**File**: `website/middleware.ts` (at root of website directory)

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

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.redirect(new URL('/?auth=signin', request.url));
    }

    // Check admin status
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
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
```

#### 3. Test Everything
```bash
npm run build              # Make sure it compiles
npm run dev               # Start dev server
# Test in browser:
# - Library page (search, filters)
# - Resource detail (navigation)
# - Auth flow (if admin routes ready)
```

---

## 📁 File Structure Reference

### New Files Created
```
website/
app/
├── library/
│   ├── page.tsx              ✅ DONE
│   └── LibraryClient.tsx     ✅ DONE
├── resource/
│   └── [...slug]/
│       ├── page.tsx          ✅ DONE
│       └── ResourceDetailClient.tsx ✅ DONE
└── api/
    ├── create-order/
    │   └── route.ts          ✅ DONE
    ├── razorpay-webhook/     ⏳ TODO
    ├── premium-content/      ⏳ TODO
    ├── validate-coupon/      ⏳ TODO
    ├── push/                 ⏳ TODO
    └── admin/                ⏳ TODO

middleware.ts                ⏳ TODO (root of website)

tsconfig.json               ✅ UPDATED (path aliases)
```

---

## 🔄 Migration Pattern for API Routes

All routes follow this pattern:

**OLD** (`api/example.js`):
```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json(...);
  // logic...
  return res.status(200).json(...);
}
```

**NEW** (`app/api/example/route.ts`):
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // logic...
  return NextResponse.json(...);
}

export async function GET(request: NextRequest) {
  // logic...
  return NextResponse.json(...);
}
```

Key changes:
- Use named exports (POST, GET, PUT, DELETE) instead of default export
- Use `NextRequest` and `NextResponse` instead of `req, res`
- No `req.method` check needed (Next.js routes by HTTP method)
- Return `NextResponse.json()` instead of `res.json()`

---

## 🧪 Testing Checklist

Before Week 3 ends, verify:
- [ ] `npm run build` completes without errors
- [ ] `npm run dev` starts successfully
- [ ] Library page loads and filters work
- [ ] Resource detail page loads with correct markdown
- [ ] Search functionality works
- [ ] View toggle (grid/list) works
- [ ] Mobile responsiveness is good
- [ ] Quiz section renders correctly
- [ ] Premium content shows paywall
- [ ] Next/Previous navigation works
- [ ] Related articles display correctly

---

## 📊 Environment Variables Needed

Verify these are set in `.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key

# Razorpay (for payments)
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_key
RAZORPAY_WEBHOOK_SECRET=your_key

# Web Push (for notifications)
VAPID_PUBLIC_KEY=your_key
VAPID_PRIVATE_KEY=your_key
VAPID_SUBJECT=mailto:your@email.com
```

---

## 🚀 Commands You'll Need

```bash
# Development
cd website
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Start production server
npm start

# Linting
npm run lint

# Content generation (required before build)
npm run generate
```

---

## 📝 Notes & Known Issues

### Minor TypeScript Warnings (Non-blocking)
- Some linting warnings in ResourceDetailClient about `@ts-expect-error` directives
- These are cosmetic and don't affect functionality
- Can be cleaned up in a follow-up refactor

### Old Vite Code Still Present
- `src/views/` folder still has React Router components (LibraryRefactored.tsx, ResourceDetail.tsx)
- These aren't being used - our new Next.js pages are active
- Can be deleted after full migration confirmation
- App routing currently uses old Router for non-migrated pages

### Import Pattern Note
- Some imports use `../../../src/...` relative paths
- Could be simplified with TypeScript alias paths (though already configured)
- Works fine as-is, improvement is optional

---

## 🎓 Key Architecture Decisions Made

1. **Server Components First**: Load data on server (page.tsx)
2. **Client Components for Interactivity**: Filters, animations (LibraryClient.tsx)
3. **Static Generation**: Using generateStaticParams for better performance
4. **Dynamic Metadata**: SEO-optimized with generateMetadata
5. **Progressive Migration**: Old code coexists with new Next.js pages
6. **TypeScript Throughout**: Type-safe API routes and components

---

## ✨ Success Criteria for Week 3

- [ ] All 9 remaining API routes converted to TypeScript Route Handlers
- [ ] Middleware.ts protecting admin routes
- [ ] Full test coverage of critical flows
- [ ] Build completes without new errors
- [ ] Staging deployment successful
- [ ] All payment flows verified with Razorpay
- [ ] Push notification routes functional
- [ ] Admin panel access control working

---

## 🔗 Key Files Reference

**Server Components** (do data fetching):
- `app/library/page.tsx`
- `app/resource/[...slug]/page.tsx`

**Client Components** (handle interactivity):
- `app/library/LibraryClient.tsx`
- `app/resource/[...slug]/ResourceDetailClient.tsx`

**Root Layout** (shared across all pages):
- `app/layout.tsx`
- `app/providers.tsx`

**API Routes** (backend endpoints):
- `app/api/create-order/route.ts` ✅
- `app/api/*/route.ts` ⏳

**Configuration**:
- `tsconfig.json` (TypeScript config)
- `next.config.js` (Next.js config)
- `package.json` (Dependencies)

---

## 💡 Pro Tips for Week 3

1. **Test as you go**: After each API route, test it with a simple curl or fetch
2. **Use Vercel Functions as reference**: The old JS files have the exact logic you need
3. **Keep types strict**: Add proper TypeScript types to all API handlers
4. **Test payment flow**: Razorpay webhook is critical - test thoroughly
5. **Check error handling**: Ensure all API routes return proper error responses
6. **Verify auth**: Test protected routes with and without valid tokens
7. **Database queries**: Double-check Supabase queries match the old implementation

---

## ❓ Quick Reference - Where Things Are

| Feature | Location | Status |
|---------|----------|--------|
| Homepage | `app/page.tsx` | Old code still there |
| Library | `app/library/page.tsx` | ✅ Migrated |
| Article | `app/resource/[...slug]/page.tsx` | ✅ Migrated |
| Admin | `app/admin/page.tsx` | Old code, needs middleware |
| Pricing | `app/pricing/page.tsx` | Old code |
| About/Privacy/Terms | `app/*/page.tsx` | Old code |
| Create Order API | `app/api/create-order/route.ts` | ✅ Migrated |
| Other APIs | `app/api/*/route.ts` | ⏳ TODO |
| Auth | `src/context/AuthContext.tsx` | ✅ Verified SSR-safe |

---

**Status**: Ready for Week 3 handoff ✅  
**Next Review**: January 16, 2026  
**Estimated Completion**: January 20, 2026 (Week 3 end)
