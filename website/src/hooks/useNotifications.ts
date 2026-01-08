import { useState, useEffect, useCallback } from 'react';
import {
  isPushSupported,
  subscribeToPush,
  unsubscribeFromPush,
  isPushSubscribed,
} from '../lib/pushNotifications';
import type {
  NotificationState,
  PermissionResult,
  PushResult,
  UseNotificationsReturn,
} from '../types/notifications';

// Re-export types for backward compatibility
export type { UseNotificationsReturn, PermissionResult, PushResult } from '../types/notifications';

/**
 * Custom hook for managing push notifications
 * Handles permission requests, push subscriptions, and status tracking
 */
const useNotifications = (): UseNotificationsReturn => {
  const [state, setState] = useState<NotificationState>(() => {
    const isSupported = 'Notification' in window;
    return {
      permission: isSupported ? (Notification.permission as NotificationPermission) : 'denied',
      isSupported,
      isPushSubscribed: false,
      isPushSupported: false,
    };
  });

  // Check push subscription status on mount and auto-subscribe if permission granted
  useEffect(() => {
    const checkPushStatus = async () => {
      const pushSupported = isPushSupported();
      let subscribed = pushSupported ? await isPushSubscribed() : false;

      // Auto-subscribe if permission already granted but not yet subscribed
      if (pushSupported && !subscribed && Notification.permission === 'granted') {
        console.log('Permission granted but not subscribed, auto-subscribing...');
        const result = await subscribeToPush(null);
        if (result.success) {
          subscribed = true;
          console.log('Auto-subscription successful');
        } else {
          console.warn('Auto-subscription failed:', result.error);
        }
      }

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
        setState(prev => ({ ...prev, permission: Notification.permission as NotificationPermission }));
      }
    };

    // Some browsers support permission change event
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'notifications' as PermissionName }).then((permissionStatus) => {
        permissionStatus.onchange = handlePermissionChange;
      });
    }
  }, [state.isSupported]);

  // Request notification permission and subscribe to push
  const requestPermission = useCallback(async (userId: string | null = null): Promise<PermissionResult> => {
    if (!state.isSupported) {
      return { success: false, error: 'Notifications not supported' };
    }

    try {
      const result = await Notification.requestPermission();
      setState(prev => ({ ...prev, permission: result as NotificationPermission }));

      if (result === 'granted') {
        // Subscribe to push notifications for server-sent notifications
        // Always try to subscribe - subscribeToPush handles its own checks
        if (isPushSupported()) {
          const pushResult = await subscribeToPush(userId);
          if (pushResult.success) {
            setState(prev => ({ ...prev, isPushSubscribed: true, isPushSupported: true }));
          } else {
            console.warn('Push subscription failed:', pushResult.error);
          }
        }

        return { success: true, permission: result as NotificationPermission };
      }

      return { success: false, permission: result as NotificationPermission };
    } catch (err) {
      console.error('Error requesting permission:', err);
      return { success: false, error: (err as Error).message };
    }
  }, [state.isSupported]);

  // Subscribe to push notifications (if permission already granted)
  const subscribePush = useCallback(async (userId: string | null = null): Promise<PushResult> => {
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
  const unsubscribePush = useCallback(async (): Promise<PushResult> => {
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
