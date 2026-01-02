import { useEffect, useRef } from 'react';
import { useSubscription } from '../context/SubscriptionContext';

const AdUnit = ({
  slot = "1909064105",
  format = "auto",
  responsive = true,
  className = "",
  style = {}
}) => {
  const adRef = useRef(null);
  const isLoaded = useRef(false);
  const { isPremium } = useSubscription();

  useEffect(() => {
    // Don't show ads to premium users
    if (isPremium()) return;

    // Don't load in development
    if (window.location.hostname === 'localhost') return;

    // Prevent duplicate ad loading
    if (isLoaded.current) return;

    try {
      // Push the ad
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      isLoaded.current = true;
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, [isPremium]);

  // Don't render for premium users
  if (isPremium()) {
    return null;
  }

  // Don't render in development (optional - can show placeholder)
  if (window.location.hostname === 'localhost') {
    return (
      <div className={`ad-placeholder ${className}`} style={{
        background: 'var(--surface-color)',
        border: '1px dashed var(--border-color)',
        borderRadius: '8px',
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.875rem',
        margin: '2rem 0',
        ...style
      }}>
        Ad Placeholder (not shown in development)
      </div>
    );
  }

  return (
    <div className={`ad-container ${className}`} style={{ margin: '2rem 0', textAlign: 'center', ...style }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6335516948550888"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
};

export default AdUnit;
