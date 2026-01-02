import { useEffect, useRef, useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';

const AdUnit = ({
  slot = "1909064105",
  format = "auto",
  responsive = true,
  className = "",
  style = {}
}) => {
  const containerRef = useRef(null);
  const isLoaded = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const { isPremium } = useSubscription();

  // Check if container is visible and has width
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
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
    if (isPremium() || window.location.hostname === 'localhost' || !isVisible || !containerRef.current) {
      return;
    }

    const container = containerRef.current;

    const loadAd = () => {
      if (isLoaded.current) return;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isLoaded.current = true;
      } catch (error) {
        console.error('AdSense error:', error);
      }
    };

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        // We only care about the container width.
        if (entry.contentRect.width > 0) {
          loadAd();
          // Once the ad is loaded, we don't need to observe anymore.
          resizeObserver.disconnect();
        }
      }
    });

    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
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
    <div
      ref={containerRef}
      className={`ad-container ${className}`}
      style={{
        margin: '2rem 0',
        textAlign: 'center',
        minHeight: '100px',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        ...style
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
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
};

export default AdUnit;
