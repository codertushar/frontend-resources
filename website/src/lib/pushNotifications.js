/**
 * Web Push Notifications Helper
 * Handles subscribing/unsubscribing to push notifications
 */

// Try to get VAPID key from build-time env, otherwise fetch from API
let VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || null;
let vapidKeyPromise = null;

/**
 * Get the VAPID public key (from env or API)
 */
const getVapidPublicKey = async () => {
  if (VAPID_PUBLIC_KEY) return VAPID_PUBLIC_KEY;

  // Only fetch once
  if (!vapidKeyPromise) {
    vapidKeyPromise = fetch('/api/push/vapid-public-key')
      .then((res) => res.json())
      .then((data) => {
        VAPID_PUBLIC_KEY = data.publicKey;
        return VAPID_PUBLIC_KEY;
      })
      .catch((err) => {
        console.error('Failed to fetch VAPID key:', err);
        vapidKeyPromise = null;
        return null;
      });
  }

  return vapidKeyPromise;
};

/**
 * Convert a base64 string to a Uint8Array for the applicationServerKey
 */
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

/**
 * Check if push notifications are supported
 */
export const isPushSupported = () => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

/**
 * Get the current push subscription
 */
export const getExistingSubscription = async () => {
  if (!isPushSupported()) return null;

  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
  } catch (error) {
    console.error('Error getting subscription:', error);
    return null;
  }
};

/**
 * Subscribe to push notifications
 * @param {string|null} userId - Optional user ID to associate with subscription
 */
export const subscribeToPush = async (userId = null) => {
  if (!isPushSupported()) {
    return { success: false, error: 'Push notifications not supported' };
  }

  const vapidKey = await getVapidPublicKey();
  if (!vapidKey) {
    return { success: false, error: 'VAPID key not configured' };
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    // Check if already subscribed
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      // Create new subscription
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });
    }

    // Send subscription to server
    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
        userId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save subscription');
    }

    return { success: true, subscription };
  } catch (error) {
    console.error('Error subscribing to push:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Unsubscribe from push notifications
 */
export const unsubscribeFromPush = async () => {
  if (!isPushSupported()) {
    return { success: false, error: 'Push notifications not supported' };
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      return { success: true, message: 'No subscription to remove' };
    }

    // Remove from server
    await fetch('/api/push/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    });

    // Unsubscribe locally
    await subscription.unsubscribe();

    return { success: true };
  } catch (error) {
    console.error('Error unsubscribing from push:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if user is subscribed to push notifications
 */
export const isPushSubscribed = async () => {
  const subscription = await getExistingSubscription();
  return !!subscription;
};
