import ClientLayout from '../../ClientLayout';

export default function Loading() {
  return (
    <ClientLayout>
      <style jsx>{`
        .skeleton {
          background: linear-gradient(
            90deg,
            rgba(156, 163, 175, 0.2) 25%,
            rgba(156, 163, 175, 0.3) 50%,
            rgba(156, 163, 175, 0.2) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 0.375rem;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .skeleton-text {
          height: 1rem;
          margin-bottom: 0.5rem;
        }

        .skeleton-title {
          height: 2rem;
          margin-bottom: 1rem;
        }

        .skeleton-header {
          height: 1.5rem;
          width: 60%;
          margin-bottom: 1.5rem;
        }

        .loading-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid #e5e7eb;
          border-top-color: #8b5cf6;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="container detail-container-wrapper">
        {/* Left Sidebar Skeleton */}
        <aside className="article-sidebar glass-panel">
          <div className="sidebar-header">
            <div className="skeleton" style={{ height: '1.5rem', width: '8rem' }}></div>
          </div>
          <nav className="sidebar-nav">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="sidebar-item">
                <div className="skeleton skeleton-text" style={{ width: '100%' }}></div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="article-content-wrapper">
          {/* Breadcrumb skeleton */}
          <nav className="breadcrumb" style={{ marginBottom: '1.5rem' }}>
            <div className="skeleton" style={{ height: '1rem', width: '4rem', display: 'inline-block' }}></div>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <div className="skeleton" style={{ height: '1rem', width: '6rem', display: 'inline-block' }}></div>
            <span style={{ margin: '0 0.5rem' }}>/</span>
            <div className="skeleton" style={{ height: '1rem', width: '8rem', display: 'inline-block' }}></div>
          </nav>

          {/* Article Header Skeleton */}
          <div className="article-header" style={{ marginBottom: '2rem' }}>
            <div className="article-meta" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <div className="skeleton" style={{ height: '1.5rem', width: '6rem', borderRadius: '9999px' }}></div>
              <div className="skeleton" style={{ height: '1.5rem', width: '5rem', borderRadius: '9999px' }}></div>
            </div>
            <div className="skeleton skeleton-title" style={{ width: '80%' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '100%' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '70%' }}></div>
          </div>

          {/* Main Content Skeleton */}
          <article className="markdown-content glass-panel">
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ marginBottom: '1.5rem' }}>
                <div className="skeleton skeleton-text" style={{ width: '100%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '95%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '90%' }}></div>
              </div>
            ))}

            {/* Code block skeleton */}
            <div className="skeleton" style={{ height: '12rem', marginBottom: '2rem', background: 'rgba(55, 65, 81, 0.3)' }}></div>

            {[...Array(4)].map((_, i) => (
              <div key={`p-${i}`} style={{ marginBottom: '1.5rem' }}>
                <div className="skeleton skeleton-text" style={{ width: '100%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '92%' }}></div>
              </div>
            ))}

            {/* Loading indicator */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '3rem', color: '#9ca3af' }}>
              <div className="loading-spinner"></div>
              <span style={{ fontSize: '1rem', fontWeight: '500' }}>Loading article...</span>
            </div>
          </article>
        </main>

        {/* Right Sidebar Skeleton */}
        <aside className="related-sidebar glass-panel">
          <div className="sidebar-section">
            <div className="skeleton skeleton-header"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ marginBottom: '1rem' }}>
                <div className="skeleton skeleton-text" style={{ width: '100%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </ClientLayout>
  );
}
