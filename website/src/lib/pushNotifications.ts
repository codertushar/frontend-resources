/**
 * Web Push Notifications Helper
 * Handles subscribing/unsubscribing to push notifications
 */

// Types
interface VapidKeyResponse {
  publicKey: string;
}

interface SubscribeResponse {
  success: boolean;
  subscription?: PushSubscription;
  error?: string;
}

interface UnsubscribeResponse {
  success: boolean;
  message?: string;
  error?: string;
}

interface SubscriptionPayload {
  subscription: PushSubscriptionJSON;
  userId: string | null;
}

interface UnsubscribePayload {
  endpoint: string;
}

interface ApiErrorResponse {
  error?: string;
}

// Helper to get env var (supports both Vite and Next.js)
const getEnvVar = (viteKey: string, nextKey: string): string | null => {
  // Check Next.js env first
  if (typeof process !== 'undefined' && process.env[nextKey]) {
    return process.env[nextKey] as string;
  }
  // Fall back to Vite env
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env?.[viteKey]) {
      return import.meta.env[viteKey] as string;
    }
  } catch {
    // import.meta.env not available
  }
  return null;
};

// Try to get VAPID key from build-time env, otherwise fetch from API
let VAPID_PUBLIC_KEY: string | null = getEnvVar('VITE_VAPID_PUBLIC_KEY', 'NEXT_PUBLIC_VAPID_PUBLIC_KEY');
let vapidKeyPromise: Promise<string | null> | null = null;

/**
 * Get the VAPID public key (from env or API)
 */
const getVapidPublicKey = async (): Promise<string | null> => {
  if (VAPID_PUBLIC_KEY) return VAPID_PUBLIC_KEY;

  // Only fetch once
  if (!vapidKeyPromise) {
    vapidKeyPromise = fetch('/api/push/vapid-public-key')
      .then((res) => res.json() as Promise<VapidKeyResponse>)
      .then((data) => {
        VAPID_PUBLIC_KEY = data.publicKey;
        return VAPID_PUBLIC_KEY;
      })
      .catch((err: Error) => {
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
const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
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
export const isPushSupported = (): boolean => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

/**
 * Get the current push subscription
 */
export const getExistingSubscription = async (): Promise<PushSubscription | null> => {
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
 * @param userId - Optional user ID to associate with subscription
 */
export const subscribeToPush = async (userId: string | null = null): Promise<SubscribeResponse> => {
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
    const payload: SubscriptionPayload = {
      subscription: subscription.toJSON(),
      userId,
    };

    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json() as ApiErrorResponse;
      throw new Error(errorData.error || 'Failed to save subscription');
    }

    return { success: true, subscription };
  } catch (error) {
    console.error('Error subscribing to push:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
};

/**
 * Unsubscribe from push notifications
 */
export const unsubscribeFromPush = async (): Promise<UnsubscribeResponse> => {
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
    const payload: UnsubscribePayload = { endpoint: subscription.endpoint };

    await fetch('/api/push/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    // Unsubscribe locally
    await subscription.unsubscribe();

    return { success: true };
  } catch (error) {
    console.error('Error unsubscribing from push:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
};

/**
 * Check if user is subscribed to push notifications
 */
export const isPushSubscribed = async (): Promise<boolean> => {
  const subscription = await getExistingSubscription();
  return !!subscription;
};
