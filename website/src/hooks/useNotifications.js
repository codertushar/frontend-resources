import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing push notifications
 * Handles permission requests, status tracking, and manual content checks
 */
const useNotifications = () => {
  const [state, setState] = useState(() => {
    const isSupported = 'Notification' in window;
    return {
      permission: isSupported ? Notification.permission : 'denied',
      isSupported,
    };
  });

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

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!state.isSupported) {
      return { success: false, error: 'Notifications not supported' };
    }

    try {
      const result = await Notification.requestPermission();
      setState(prev => ({ ...prev, permission: result }));

      if (result === 'granted') {
        // Try to register periodic sync if available
        if ('serviceWorker' in navigator && 'periodicSync' in navigator.serviceWorker) {
          try {
            const registration = await navigator.serviceWorker.ready;
            await registration.periodicSync.register('check-new-content', {
              minInterval: 6 * 60 * 60 * 1000, // 6 hours
            });
          } catch (err) {
            console.log('Periodic Sync not available, will use fallback');
          }
        }

        return { success: true, permission: result };
      }

      return { success: false, permission: result };
    } catch (err) {
      console.error('Error requesting permission:', err);
      return { success: false, error: err.message };
    }
  }, [state.isSupported]);

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
    requestPermission,
    checkForNewContent,
  };
};

export default useNotifications;
