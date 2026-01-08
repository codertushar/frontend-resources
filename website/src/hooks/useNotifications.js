import { useState, useEffect, useCallback } from 'react';
import {
  isPushSupported,
  subscribeToPush,
  unsubscribeFromPush,
  isPushSubscribed,
} from '../lib/pushNotifications';

/**
 * Custom hook for managing push notifications
 * Handles permission requests, push subscriptions, and status tracking
 */
const useNotifications = () => {
  const [state, setState] = useState(() => {
    const isSupported = 'Notification' in window;
    return {
      permission: isSupported ? Notification.permission : 'denied',
      isSupported,
      isPushSubscribed: false,
      isPushSupported: false,
    };
  });

  // Check push subscription status on mount
  useEffect(() => {
    const checkPushStatus = async () => {
      const pushSupported = isPushSupported();
      const subscribed = pushSupported ? await isPushSubscribed() : false;
      setState(prev => ({
        ...prev,
        isPushSupported: pushSupported,
        isPushSubscribed: subscribed,
      }));
    };
    checkPushStatus();
  }, []);

  useEffect(() => {
    // Update permission status if it changes
    const handlePermissionChange = () => {
      if (state.isSupported) {
        setState(prev => ({ ...prev, permission: Notification.permission }));
      }
    };

    // Some browsers support permission change event
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'notifications' }).then((permissionStatus) => {
        permissionStatus.onchange = handlePermissionChange;
      });
    }
  }, [state.isSupported]);

  // Request notification permission and subscribe to push
  const requestPermission = useCallback(async (userId = null) => {
    if (!state.isSupported) {
      return { success: false, error: 'Notifications not supported' };
    }

    try {
      const result = await Notification.requestPermission();
      setState(prev => ({ ...prev, permission: result }));

      if (result === 'granted') {
        // Subscribe to push notifications for server-sent notifications
        if (state.isPushSupported) {
          const pushResult = await subscribeToPush(userId);
          if (pushResult.success) {
            setState(prev => ({ ...prev, isPushSubscribed: true }));
          } else {
            console.warn('Push subscription failed:', pushResult.error);
          }
        }

        return { success: true, permission: result };
      }

      return { success: false, permission: result };
    } catch (err) {
      console.error('Error requesting permission:', err);
      return { success: false, error: err.message };
    }
  }, [state.isSupported, state.isPushSupported]);

  // Subscribe to push notifications (if permission already granted)
  const subscribePush = useCallback(async (userId = null) => {
    if (!state.isPushSupported) {
      return { success: false, error: 'Push not supported' };
    }

    if (state.permission !== 'granted') {
      return { success: false, error: 'Notification permission not granted' };
    }

    const result = await subscribeToPush(userId);
    if (result.success) {
      setState(prev => ({ ...prev, isPushSubscribed: true }));
    }
    return result;
  }, [state.isPushSupported, state.permission]);

  // Unsubscribe from push notifications
  const unsubscribePush = useCallback(async () => {
    const result = await unsubscribeFromPush();
    if (result.success) {
      setState(prev => ({ ...prev, isPushSubscribed: false }));
    }
    return result;
  }, []);

  // Manually trigger content check
  const checkForNewContent = useCallback(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.active) {
          registration.active.postMessage({ type: 'CHECK_NEW_CONTENT' });
        }
      });
    }
  }, []);

  return {
    permission: state.permission,
    isSupported: state.isSupported,
    isGranted: state.permission === 'granted',
    isDenied: state.permission === 'denied',
    isDefault: state.permission === 'default',
    isPushSupported: state.isPushSupported,
    isPushSubscribed: state.isPushSubscribed,
    requestPermission,
    subscribePush,
    unsubscribePush,
    checkForNewContent,
  };
};

export default useNotifications;
