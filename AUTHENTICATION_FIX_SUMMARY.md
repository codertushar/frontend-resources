# Authentication Bug Fixes - Summary

## Issues Fixed

### 1. Persistent Login After Sign-Out
**Problem:** User signs out and then signs in with a different Google account, but the previous account remains logged in.

**Root Cause:** The OAuth flow was using `prompt: 'consent'` which forces the consent screen but doesn't necessarily show the account picker. Google OAuth can cache the previously used account.

**Solution:** Changed to `prompt: 'select_account'` which explicitly forces Google to show the account picker, allowing users to choose a different account.

### 2. Missing Sign-In Button
**Problem:** Sometimes the sign-in button doesn't appear at all.

**Root Cause:** The sign-in button only renders when `isLoaded && !isSignedIn`. The `isLoaded` state depends on `isLoading` becoming `false`. If the authentication initialization fails or hangs, `isLoading` never resolves and the button never appears.

**Solutions Implemented:**
- Added a 10-second timeout that forces `isLoading` to `false` if initialization hasn't completed
- Added `.catch()` error handler to the `getUser()` promise to handle unexpected errors
- Set `isInitialized` flag in all code paths to prevent race conditions
- Enhanced sign-out with try-catch error handling

## Changes Made

### File: `website/src/context/AuthContext.jsx`

#### Change 0: Storage Cleanup Constant (Lines 36-37)
```javascript
// NEW CODE ADDED:
// Storage cleanup delay to ensure all storage operations complete
const STORAGE_CLEANUP_DELAY_MS = 100;
```

#### Change 1: OAuth Prompt Parameter (Line 167)
```javascript
// BEFORE:
prompt: 'consent',  // Force consent screen (stronger than select_account)

// AFTER:
prompt: 'select_account',  // Force account picker - allows selecting different account
```

#### Change 2: Loading State Timeout (Lines 71-78)
```javascript
// NEW CODE ADDED:
// Safety timeout: ensure loading state resolves within 10 seconds
const loadingTimeout = setTimeout(() => {
  if (!isInitialized) {
    console.warn('[Auth] Loading timeout - forcing isLoading to false');
    setIsLoading(false);
    isInitialized = true; // Prevent duplicate state updates
  }
}, 10000);
```

#### Change 3: Error Handling for getUser() (Lines 132-142)
```javascript
// NEW CODE ADDED:
.catch((err) => {
  // Ensure loading state resolves even on unexpected errors
  console.error('[Auth] Unexpected error during getUser:', err);
  if (!isInitialized) {
    clearSupabaseStorage();
    setSession(null);
    setUser(null);
    setIsLoading(false);
    isInitialized = true;
  }
});
```

#### Change 4: Enhanced Sign-Out Error Handling (Lines 186-194)
```javascript
// BEFORE:
const { error } = await supabase.auth.signOut({ scope: 'global' });
console.log('[Auth] signOut result:', { error });

// AFTER:
try {
  const { error } = await supabase.auth.signOut({ scope: 'global' });
  if (error) {
    console.error('[Auth] signOut error:', error);
  }
} catch (err) {
  console.error('[Auth] signOut exception:', err);
}
```

#### Change 5: Cleanup Delay After Sign-Out (Lines 203-204)
```javascript
// NEW CODE ADDED:
// Step 4: Small delay to ensure storage is fully cleared before next sign-in
await new Promise(resolve => setTimeout(resolve, STORAGE_CLEANUP_DELAY_MS));
```

#### Change 6: Cleanup Timeout on Unmount (Lines 144-147)
```javascript
// BEFORE:
return () => subscription.unsubscribe();

// AFTER:
return () => {
  clearTimeout(loadingTimeout);
  subscription.unsubscribe();
};
```

## How to Test

### Test Case 1: Sign-Out and Sign-In with Different Account
1. Navigate to the website
2. Click "Sign In" button
3. Sign in with Google account A (e.g., userA@gmail.com)
4. Verify you're logged in (avatar/email appears in navbar)
5. Click your avatar and select "Sign Out"
6. Wait for sign-out to complete (avatar disappears, "Sign In" button reappears)
7. Click "Sign In" button again
8. **Expected:** Google account picker should appear showing all available accounts
9. Select a different Google account B (e.g., userB@gmail.com)
10. **Expected:** Should be logged in with account B, not account A
11. Verify the email shown is for account B

### Test Case 2: Sign-In Button Always Appears
1. Open the website in an incognito/private window
2. **Expected:** "Sign In" button should appear within 10 seconds maximum
3. Try various scenarios:
   - Slow network (use Chrome DevTools throttling)
   - Offline mode (disconnect internet briefly)
   - Clear browser cache and reload
4. In all cases, "Sign In" button should eventually appear even if there are network issues

### Test Case 3: Verify Clean Sign-Out
1. Sign in with any Google account
2. Open browser DevTools → Application → Storage
3. Check localStorage and sessionStorage for keys starting with "sb-"
4. Click "Sign Out"
5. **Expected:** All "sb-" prefixed storage items should be removed
6. **Expected:** No user session should remain cached
7. Reload the page
8. **Expected:** Should still be signed out

### Test Case 4: Loading State Resolution
1. Open browser DevTools → Console
2. Reload the page
3. Watch for auth-related console logs:
   - `[Auth] Verifying session with server...`
   - `[Auth] getUser result: ...`
   - Should see `isLoading` set to false within a few seconds
4. **Expected:** No timeout warning should appear under normal conditions
5. To test timeout: Simulate slow network, should see warning after 10 seconds:
   - `[Auth] Loading timeout - forcing isLoading to false`

## Technical Details

### Why `select_account` Instead of `consent`?
- `consent`: Forces Google to show the consent/permissions screen but may still use the cached account
- `select_account`: Forces Google to show the account picker, allowing explicit account selection
- For our use case (switching between accounts), `select_account` is more appropriate

### Why the 10-Second Timeout?
- Network issues or API failures could cause `getUser()` to hang indefinitely
- Without a timeout, users would never see the sign-in button
- 10 seconds is a reasonable balance between allowing legitimate slow networks and ensuring good UX

### Why the 100ms Delay After Sign-Out?
- Ensures all storage operations complete before the next sign-in
- Prevents race conditions where old session data might still be in memory/cache
- Small enough to not impact UX, large enough to ensure cleanup

## Verification

Build completed successfully with no errors:
```bash
✓ built in 794ms
✅ Created 103 pre-rendered index.html files for SEO
```

Linting shows no new errors related to these changes.

## Browser Compatibility

These changes use standard Web APIs and should work in all modern browsers:
- `localStorage` / `sessionStorage` (ES5+)
- `setTimeout` / `clearTimeout` (ES5+)
- `Promise` / `async`/`await` (ES2017+)
- Supported by all browsers used in 2023+ (Chrome, Firefox, Safari, Edge)
