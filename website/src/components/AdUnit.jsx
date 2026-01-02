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
    // Don't show ads to premium users
    if (isPremium()) return;

    // Don't load in development
    if (window.location.hostname === 'localhost') return;

    // Prevent duplicate ad loading
    if (isLoaded.current) return;

    // Wait for visibility
    if (!isVisible) return;

    // Wait for container to have width
    const container = containerRef.current;
    if (!container || container.offsetWidth === 0) return;

    // Small delay to ensure layout is stable
    const timer = setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isLoaded.current = true;
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }, 100);

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
    <div
      ref={containerRef}
      className={`ad-container ${className}`}
      style={{ margin: '2rem 0', textAlign: 'center', minHeight: '100px', ...style }}
    >
      <ins
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
