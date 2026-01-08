import { useEffect, useRef, useState, CSSProperties } from 'react';
import { useSubscription } from '../context/SubscriptionContext';

// Extend Window interface for AdSense
declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdUnitProps {
  slot?: string;
  responsive?: boolean;
  className?: string;
  style?: CSSProperties;
}

const AdUnit = ({
  slot = "1909064105",
  responsive = true,
  className = "",
  style = {}
}: AdUnitProps): JSX.Element | null => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isLoaded = useRef<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { isPremium } = useSubscription();

  // Check if container is visible
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Load ad only when visible and container has width
  useEffect(() => {
    if (isPremium() || window.location.hostname === 'localhost' || !isVisible) {
      return;
    }

    if (isLoaded.current) return;

    const container = containerRef.current;
    if (!container) return;

    // Use a timeout to wait for the container to be painted
    const timer = setTimeout(() => {
      if (container.offsetWidth > 0) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          isLoaded.current = true;
        } catch (error) {
          console.error('AdSense error:', error);
        }
      }
    }, 100); // A small delay to ensure layout is stable

    return () => clearTimeout(timer);
  }, [isPremium, isVisible]);

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
    <div style={{ display: 'block', width: '100%', ...style }}>
      <div
        ref={containerRef}
        className={`ad-container ${className}`}
        style={{
          margin: '2rem auto',
          textAlign: 'center',
          minHeight: '100px',
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden',
        }}
      >
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            minHeight: '100px',
            width: '100%',
            maxWidth: '100%'
          }}
          data-ad-client="ca-pub-6335516948550888"
          data-ad-slot={slot}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      </div>
    </div>
  );
};

export default AdUnit;
