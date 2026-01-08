import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import useNotifications from '../hooks/useNotifications';
import { useAuth } from '../context/AuthContext';
import { ICON_192 } from '../constants/app';

const NotificationPrompt = () => {
  const { isSupported, isDefault, requestPermission } = useNotifications();
  const { user } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Show prompt if permission is default and not previously dismissed
    const wasDismissed = localStorage.getItem('notification-prompt-dismissed');
    if (isDefault && !wasDismissed && isSupported) {
      // Show after 5 seconds to not be intrusive
      const timer = setTimeout(() => setShowPrompt(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [isDefault, isSupported]);

  const handleEnable = async () => {
    // Pass user ID if logged in for associating push subscription with user
    const result = await requestPermission(user?.id || null);
    
    if (result.success) {
      setShowPrompt(false);
      
      // Show a welcome notification
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        registration.showNotification('Notifications Enabled! 🎉', {
          body: "You'll be notified when new articles are published.",
          icon: ICON_192,
          tag: 'welcome',
        });
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('notification-prompt-dismissed', 'true');
  };

  // Don't show if not supported or not in default state
  if (!isSupported || !showPrompt || !isDefault) {
    return null;
  }

  return (
    <div className="notification-prompt">
      <div className="notification-prompt-content">
        <Bell className="notification-icon" />
        <div className="notification-text">
          <h3>Stay Updated!</h3>
          <p>Get notified when new articles are published</p>
        </div>
        <div className="notification-actions">
          <button onClick={handleEnable} className="btn-enable">
            Enable
          </button>
          <button onClick={handleDismiss} className="btn-dismiss">
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPrompt;
