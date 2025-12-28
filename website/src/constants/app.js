/**
 * Shared constants for the CrackFrontend PWA
 */

// Base path for the application (GitHub Pages subdirectory)
export const BASE_PATH = '/frontend-resources';

// Icon paths
export const ICON_192 = `${BASE_PATH}/android-launchericon-192-192.png`;
export const ICON_512 = `${BASE_PATH}/android-launchericon-512-512.png`;

// Notification configuration
export const NOTIFICATION_CONFIG = {
  // How often to check for new content (in milliseconds)
  checkInterval: 6 * 60 * 60 * 1000, // 6 hours
  
  // Minimum time between content checks (throttle)
  checkThrottle: 5 * 60 * 1000, // 5 minutes
  
  // Default notification icon
  icon: ICON_192,
  badge: ICON_192,
  
  // Notification behavior
  requireInteraction: false,
  renotify: false,
};

// Service Worker configuration
export const SW_CONFIG = {
  scope: BASE_PATH,
  updateInterval: 30 * 60 * 1000, // 30 minutes
};

// IndexedDB configuration
export const DB_CONFIG = {
  name: 'frontend-resources-db',
  version: 1,
  stores: {
    metadata: 'metadata',
  },
};
