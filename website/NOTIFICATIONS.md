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

### Notification Timing

Edit `public/service-worker.js` to adjust check intervals:

```javascript
// Current: 6 hours
const CONTENT_CHECK_INTERVAL = 6 * 60 * 60 * 1000;

// For more frequent checks, reduce the interval:
const CONTENT_CHECK_INTERVAL = 1 * 60 * 60 * 1000; // 1 hour
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
3. **Check console**: Look for errors in browser console
4. **Test manually**: `window.checkForNewArticles()` in console

### Prompt Not Showing

1. **Check localStorage**: May have been dismissed
   ```javascript
   localStorage.removeItem('notification-prompt-dismissed');
   ```
2. **Check permission**: Already granted or denied
3. **Wait 5 seconds**: Prompt has intentional delay

### Content Check Not Working

1. **Verify content.json exists**: Navigate to `/frontend-resources/content.json`
2. **Check service worker**: Should be active in DevTools
3. **Inspect IndexedDB**: Application tab → IndexedDB → frontend-resources-db

## Future Enhancements

Potential improvements for future versions:

- [ ] Allow users to choose notification frequency
- [ ] Add notification preferences (categories, tags)
- [ ] Implement server-sent push notifications (requires backend)
- [ ] Add notification history panel
- [ ] Support for notification grouping
- [ ] Rich notification content with images
- [ ] Badge counter on app icon

## Related Files

- `website/public/service-worker.js` - Service worker with notification logic
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
