// Notification types

// Using native browser NotificationPermission type
export type NotificationPermissionType = NotificationPermission;

export interface NotificationState {
  permission: NotificationPermissionType;
  isSupported: boolean;
  isPushSubscribed: boolean;
  isPushSupported: boolean;
}

export interface PermissionResult {
  success: boolean;
  permission?: NotificationPermissionType;
  error?: string;
}

export interface PushResult {
  success: boolean;
  error?: string;
  message?: string;
  subscription?: PushSubscription;
}

export interface UseNotificationsReturn {
  permission: NotificationPermissionType;
  isSupported: boolean;
  isGranted: boolean;
  isDenied: boolean;
  isDefault: boolean;
  isPushSupported: boolean;
  isPushSubscribed: boolean;
  requestPermission: (userId?: string | null) => Promise<PermissionResult>;
  subscribePush: (userId?: string | null) => Promise<PushResult>;
  unsubscribePush: () => Promise<PushResult>;
  checkForNewContent: () => void;
}
