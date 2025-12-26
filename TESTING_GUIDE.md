# Quick Testing Guide

## Testing the Authentication Fixes

### Prerequisites
- Have at least 2 different Google accounts available for testing
- Use a modern browser (Chrome, Firefox, Safari, or Edge)
- Clear browser cache before testing

---

## Test 1: Different Account After Sign-Out (PRIMARY FIX) 🎯

**This tests the main issue: logging in with different account**

### Steps:
1. Open the website in normal browser window
2. Click "Sign In" button
3. Select Google account A (e.g., userA@gmail.com)
4. After login, verify your email appears in the dropdown (click avatar)
5. Click "Sign Out" from the dropdown
6. Wait 2 seconds for complete sign-out
7. Click "Sign In" button again

### Expected Results:
✅ **Google account picker MUST appear** showing all your Google accounts  
✅ You can select a different account (e.g., userB@gmail.com)  
✅ After selecting different account, you're logged in with that account  
✅ The email shown matches the newly selected account (not the old one)

### Failure Indicators:
❌ Automatically logs you in with previous account without showing picker  
❌ Shows email of old account after selecting new account  
❌ Gets stuck in loading state

---

## Test 2: Sign-In Button Always Appears (SECONDARY FIX) 🔘

**This tests that the button always appears even with issues**

### Test 2a: Normal Conditions
1. Open website in **incognito/private window**
2. Wait up to 10 seconds

**Expected:** Sign-in button appears within 2-3 seconds

### Test 2b: Slow Network
1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Set throttling to "Slow 3G"
4. Open website in new incognito window
5. Wait up to 10 seconds

**Expected:** Sign-in button still appears (may take longer but max 10 seconds)

### Test 2c: After Cache Clear
1. Open browser settings
2. Clear all browsing data (cache, cookies, etc.)
3. Reload the website
4. Wait up to 10 seconds

**Expected:** Sign-in button appears

---

## Test 3: Complete Sign-Out Cleanup 🧹

**This verifies all session data is cleared**

### Steps:
1. Sign in with any Google account
2. Open DevTools (F12) → Application tab → Storage
3. Expand "Local Storage" and "Session Storage"
4. Look for items starting with "sb-" (Supabase items)
5. Click "Sign Out"
6. Check storage again

**Expected:**
✅ All "sb-" prefixed items are removed  
✅ No authentication data remains in storage  

### Extra Verification:
7. Close and reopen the browser
8. Navigate to the website

**Expected:** You are still signed out (not auto-logged back in)

---

## Test 4: Console Log Verification 🔍

**For developers: Check the authentication flow in console**

### Steps:
1. Open DevTools (F12) → Console tab
2. Reload the website
3. Watch for authentication logs

### Expected Logs (Normal Flow):
```
[Auth] Verifying session with server...
[Auth] getUser result: { hasUser: false, email: undefined }
```

### If There's a Timeout (Slow Network):
```
[Auth] Loading timeout - forcing isLoading to false
```

### After Sign-In:
```
[Auth] signInWithGoogle called
[Auth] onAuthStateChange: { event: 'SIGNED_IN', email: 'user@gmail.com' }
```

### After Sign-Out:
```
[Auth] signOut called
[Auth] signOut error: null (or error message if any)
[Auth] Complete sign out finished
[Auth] onAuthStateChange: { event: 'SIGNED_OUT', email: undefined }
```

---

## Common Issues & Solutions

### Issue: Account picker doesn't appear
**Solution:** Clear Google cookies for the site:
1. DevTools → Application → Cookies
2. Delete all cookies
3. Try signing in again

### Issue: Button takes too long to appear
**Check:**
- Is network very slow? (Check Network tab)
- Are there JavaScript errors? (Check Console tab)
- Wait full 10 seconds before reporting issue

### Issue: Old account still appears
**Verify:**
1. Did you wait 2+ seconds after sign-out before signing in again?
2. Did the Google account picker actually appear?
3. Did you select a different account?

---

## Quick Success Checklist

Use this to quickly verify everything works:

- [ ] Sign-in button appears on page load
- [ ] Can sign in with Google account A
- [ ] Email in dropdown matches account A
- [ ] Can sign out successfully
- [ ] Sign-in button reappears after sign-out
- [ ] Clicking sign-in shows Google account picker
- [ ] Can select different account B from picker
- [ ] Email in dropdown now matches account B
- [ ] Storage cleared after sign-out (DevTools check)
- [ ] No errors in browser console

---

## Reporting Issues

If you find issues, please provide:

1. **Which test failed?** (Test 1, 2, 3, or 4)
2. **Browser and version** (e.g., Chrome 120, Firefox 121)
3. **Console logs** (screenshot of DevTools Console)
4. **Network conditions** (normal, slow, offline)
5. **Steps to reproduce**

---

## Summary

The two main fixes ensure:

1. 🎯 **`prompt: 'select_account'`** forces Google to show account picker, allowing you to select a different account after sign-out

2. 🔘 **Loading timeout + error handling** ensures the sign-in button always appears within 10 seconds, even if there are network issues or authentication errors

Both fixes work together to provide a reliable authentication experience.
