# 🔔 PWA Push Notification System

## Overview

The Frontend Resources website now includes a Progressive Web App (PWA) notification system that alerts users when new articles are published. This feature leverages modern web APIs to provide a native app-like experience.

## Features

### ✅ Implemented Features

1. **Automatic Content Detection**
   - Service worker checks for new articles on every page load
   - Compares current article count with stored count in IndexedDB
   - Only shows notifications for genuinely new content

2. **Permission Management**
   - Non-intrusive permission prompt appears 5 seconds after page load
   - Users can enable, dismiss, or ignore the prompt
   - Dismissed prompts are remembered via localStorage
   - Welcome notification shown upon enabling

3. **Background Sync (where supported)**
   - Periodic background sync every 6 hours (on supported browsers)
   - Fallback to page-load checking on browsers without periodic sync
   - Manual content check available via service worker messages

4. **Notification Interactions**
   - Clicking notifications opens the Library page
   - Focuses existing tab if already open
   - Opens new tab if no instance is running

5. **Responsive Design**
   - Mobile-optimized notification prompt
   - Glassmorphism design matching site aesthetics
   - Smooth animations and transitions

## Architecture

### Components

#### 1. Service Worker (`public/service-worker.js`)

**Key Functions:**

- `checkForNewContent()` - Fetches content.json and compares article count
- `showNewArticleNotification()` - Displays notification with article details
- `getStoredContentData()` - Retrieves stored metadata from IndexedDB
- `storeContentData()` - Stores article count and timestamp in IndexedDB

**Event Listeners:**

- `fetch` - Checks for new content on navigation requests
- `notificationclick` - Handles notification click events
- `periodicsync` - Background content checking (where supported)
- `message` - Handles manual content check requests

#### 2. NotificationPrompt Component (`src/components/NotificationPrompt.jsx`)

React component that displays a permission request prompt:

- Shows 5 seconds after page load (if permission is default)
- Dismissible with localStorage persistence
- Uses `useNotifications` hook for logic
- Triggers welcome notification on enable

#### 3. useNotifications Hook (`src/hooks/useNotifications.js`)

Custom React hook for notification management:

```javascript
const {
  permission,      // Current permission status
  isSupported,     // Browser support check
  isGranted,       // true if granted
  isDenied,        // true if denied
  isDefault,       // true if not yet requested
  requestPermission, // Function to request permission
  checkForNewContent // Function to manually check for updates
} = useNotifications();
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│  1. User Visits Site                                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Service Worker Fetches content.json                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Compare with Stored Count (IndexedDB)                   │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────┐         ┌──────────────────┐
│  No Change   │         │  New Articles!   │
└──────────────┘         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  Show Notification│
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  User Clicks     │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  Open Library    │
                         └──────────────────┘
```

## Browser Support

| Feature              | Chrome/Edge | Firefox | Safari | Support |
| -------------------- | ----------- | ------- | ------ | ------- |
| Notifications API    | ✅          | ✅      | ✅     | Full    |
| Service Workers      | ✅          | ✅      | ✅     | Full    |
| IndexedDB            | ✅          | ✅      | ✅     | Full    |
| Periodic Sync        | ✅          | ❌      | ❌     | Partial |
| Permission API       | ✅          | ✅      | ⚠️     | Partial |

**Fallbacks:**
- Browsers without Periodic Sync: Check on page navigation
- Browsers without Permission API: Direct permission check
- Non-supporting browsers: Feature gracefully degrades

## Usage for Developers

### Triggering Manual Content Check

You can manually trigger a content check from the browser console:

```javascript
// Method 1: Via global function (set in index.html)
window.checkForNewArticles();

// Method 2: Via service worker message
navigator.serviceWorker.ready.then(registration => {
  registration.active.postMessage({ type: 'CHECK_NEW_CONTENT' });
});
```

### Testing Notifications Locally

1. **Enable notifications in browser settings**
2. **Use DevTools to simulate new content:**

```javascript
// In browser console, clear stored count to simulate new articles
indexedDB.deleteDatabase('frontend-resources-db');
```

3. **Reload the page** - Service worker will detect all articles as "new"
4. **Check notification** appears with article count

### Adding to Other Pages

The `NotificationPrompt` is already integrated in `Layout.jsx`, so it appears site-wide. To add the hook to other components:

```javascript
import useNotifications from '../hooks/useNotifications';

const MyComponent = () => {
  const { isGranted, requestPermission } = useNotifications();

  return (
    <div>
      {!isGranted && (
        <button onClick={requestPermission}>
          Enable Notifications
        </button>
      )}
    </div>
  );
};
```

## Configuration

### Build Process

The notification system requires `content.json` to be accessible at runtime:

**During Build (`npm run build`):**
1. `generate-content.js` runs and creates:
   - `src/data/content.json` → imported by React components
   - `public/content.json` → copied to build output for service worker
2. Vite build copies `public/*` to `dist/*`
3. Result: `dist/content.json` available for service worker to fetch

**In Development (`npm run dev`):**
- Both files are generated and accessible
- Service worker can fetch from `http://localhost:5173/content.json`

**Important**: If you modify the build process, ensure `public/content.json` is created and copied to the output directory.

### Notification Timing

Edit `public/service-worker.js` to adjust check intervals:

```javascript
// Current: 6 hours for periodic sync
const CONTENT_CHECK_INTERVAL = 6 * 60 * 60 * 1000;

// For more frequent checks, reduce the interval:
const CONTENT_CHECK_INTERVAL = 1 * 60 * 60 * 1000; // 1 hour

// Throttle for fetch-based checks (5 minutes)
const CONTENT_CHECK_THROTTLE = 5 * 60 * 1000;
```

### Prompt Timing

Edit `src/components/NotificationPrompt.jsx` to adjust when prompt appears:

```javascript
// Current: 5 seconds
setTimeout(() => setShowPrompt(true), 5000);

// For immediate prompt:
setTimeout(() => setShowPrompt(true), 0);
```

## Privacy & User Experience

### Privacy Considerations

- ✅ No data sent to external servers
- ✅ All checks happen client-side
- ✅ IndexedDB data stays on user's device
- ✅ User can revoke permission anytime via browser settings

### UX Best Practices Followed

- ⏰ Delayed prompt (5s) to avoid interruption
- 🚫 Dismissible with persistent preference
- 📱 Mobile-responsive design
- 🎨 Matches site design language
- ⚡ Non-blocking implementation
- 🔕 Respects user's notification settings

## Troubleshooting

### Notifications Not Appearing

1. **Check browser permission**: Settings → Site Settings → Notifications
2. **Verify service worker**: DevTools → Application → Service Workers
3. **Check console for `[SW]` logs**: Look for service worker logs in browser console
   - Should see: `[SW] Checking for new content...`
   - Should see: `[SW] Current article count: X`
   - If you see: `[SW] Failed to fetch content.json` - the file is missing (build issue)
4. **Verify content.json exists**: Navigate to `/frontend-resources/content.json` in browser
5. **Test manually**: Open console and run:
   ```javascript
   // Check if service worker is active
   navigator.serviceWorker.ready.then(reg => {
     console.log('SW ready:', reg.active);
     // Manually trigger content check
     reg.active.postMessage({ type: 'CHECK_NEW_CONTENT' });
   });
   ```

### Prompt Not Showing

1. **Check localStorage**: May have been dismissed
   ```javascript
   localStorage.removeItem('notification-prompt-dismissed');
   ```
2. **Check permission**: Already granted or denied
3. **Wait 5 seconds**: Prompt has intentional delay

### Content Check Not Working

1. **Verify content.json exists**: Navigate to `/frontend-resources/content.json`
   - If 404: Build process may have failed
   - Check that `node scripts/generate-content.js` was run during build
2. **Check service worker**: Should be active in DevTools
3. **Inspect IndexedDB**: Application tab → IndexedDB → frontend-resources-db
   - Should have `metadata` object store with `contentData` key
4. **Check service worker logs**: Open console and filter for `[SW]`
   - Look for errors or warnings about content.json fetch

### Common Issues

**Issue**: Notifications never appear even with permission granted
- **Cause**: `content.json` missing from build output
- **Solution**: Ensure `generate-content.js` writes to `public/content.json` during build
- **Verify**: Check that `dist/content.json` exists after running `npm run build`

**Issue**: First visit doesn't show notification
- **Expected behavior**: Service worker stores baseline count on first visit
- **Notifications appear**: Only on subsequent visits when new articles are detected

## Server-Side Push Notifications (NEW)

The system now supports **true push notifications** via Web Push API. Users will receive notifications even when they're not on the site.

### How It Works

```
User Subscribes → Subscription saved to Supabase → Admin sends notification
                                                         ↓
                                            web-push library sends to all subscribers
                                                         ↓
                                            Service Worker receives 'push' event
                                                         ↓
                                            Notification shown to user
```

### Setup Steps

1. **Generate VAPID Keys** (one-time):
   ```bash
   cd website && node scripts/generate-vapid-keys.js
   ```

2. **Add Environment Variables** (Vercel dashboard):
   ```
   VAPID_PUBLIC_KEY=<from step 1>
   VAPID_PRIVATE_KEY=<from step 1>
   VAPID_SUBJECT=mailto:admin@crackfrontend.dev
   NOTIFICATION_WEBHOOK_SECRET=<random-secret>
   ```

3. **Add to `.env`** (for frontend):
   ```
   VITE_VAPID_PUBLIC_KEY=<public key from step 1>
   ```

4. **Create Supabase Tables**:
   Run the SQL in `website/supabase/push_subscriptions.sql` in your Supabase SQL editor.

### Triggering Notifications

#### Option 1: Admin Panel (Manual)
1. Go to `/admin` → Notifications tab
2. Select an article or write a custom message
3. Click "Send Notification"

#### Option 2: Deploy Webhook (Automatic)
Call the webhook after deployments:
```bash
curl -X POST https://your-site.com/api/notify-new-content \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: YOUR_SECRET" \
  -d '{"articleCount": 95}'
```

Or with a custom message:
```bash
curl -X POST https://your-site.com/api/notify-new-content \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: YOUR_SECRET" \
  -d '{
    "title": "New Article!",
    "body": "Check out our latest article",
    "url": "/frontend-resources/resource/my-article"
  }'
```

### API Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/push/subscribe` | POST | None | Save push subscription |
| `/api/push/unsubscribe` | POST | None | Remove subscription |
| `/api/admin/send-notification` | POST | Admin | Send to all subscribers |
| `/api/notify-new-content` | POST | Webhook Secret | Auto-trigger on deploy |

### Files Added/Modified

**New Files:**
- `website/api/push/subscribe.js` - Save subscription endpoint
- `website/api/push/unsubscribe.js` - Remove subscription endpoint
- `website/api/admin/send-notification.js` - Admin send endpoint
- `website/api/notify-new-content.js` - Deploy webhook endpoint
- `website/src/lib/pushNotifications.js` - Client-side helper
- `website/scripts/generate-vapid-keys.js` - VAPID key generator
- `website/supabase/push_subscriptions.sql` - Database schema

**Modified Files:**
- `website/public/service-worker.js` - Added push event listener
- `website/src/hooks/useNotifications.js` - Added push subscription support
- `website/src/components/NotificationPrompt.jsx` - Auto-subscribes on permission grant
- `website/src/pages/Admin.jsx` - Added Notifications tab

## Future Enhancements

Potential improvements for future versions:

- [x] ~~Implement server-sent push notifications (requires backend)~~ DONE
- [ ] Allow users to choose notification frequency
- [ ] Add notification preferences (categories, tags)
- [ ] Add notification history panel in admin
- [ ] Support for notification grouping
- [ ] Rich notification content with images
- [ ] Badge counter on app icon

## Related Files

- `website/scripts/generate-content.js` - Generates content.json in both src/data and public directories
- `website/public/service-worker.js` - Service worker with notification logic
- `website/public/content.json` - Runtime content index for service worker (auto-generated)
- `website/src/data/content.json` - Content index for React imports (auto-generated)
- `website/public/manifest.json` - PWA manifest with notification permission
- `website/src/components/NotificationPrompt.jsx` - Permission prompt UI
- `website/src/hooks/useNotifications.js` - Notification management hook
- `website/src/components/Layout.jsx` - Integration point
- `website/index.html` - Service worker registration
- `website/src/index.css` - Notification prompt styles

## Resources

- [Notifications API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
- [Service Worker API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Periodic Background Sync - web.dev](https://web.dev/periodic-background-sync/)
- [IndexedDB API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
