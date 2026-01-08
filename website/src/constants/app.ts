/**
 * Shared constants for the CrackFrontend PWA
 */

// Base path for the application (empty for Vercel, '/frontend-resources' for GitHub Pages)
export const BASE_PATH: string = '';

// Icon paths
export const ICON_192: string = `${BASE_PATH}/android-launchericon-192-192.png`;
export const ICON_512: string = `${BASE_PATH}/android-launchericon-512-512.png`;

// Notification configuration
export interface NotificationConfigType {
  checkInterval: number;
  checkThrottle: number;
  icon: string;
  badge: string;
  requireInteraction: boolean;
  renotify: boolean;
}

export const NOTIFICATION_CONFIG: NotificationConfigType = {
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
export interface SwConfigType {
  scope: string;
  updateInterval: number;
}

export const SW_CONFIG: SwConfigType = {
  scope: BASE_PATH,
  updateInterval: 30 * 60 * 1000, // 30 minutes
};

// IndexedDB configuration
export interface DbStoresType {
  metadata: string;
}

export interface DbConfigType {
  name: string;
  version: number;
  stores: DbStoresType;
}

export const DB_CONFIG: DbConfigType = {
  name: 'frontend-resources-db',
  version: 1,
  stores: {
    metadata: 'metadata',
  },
};
