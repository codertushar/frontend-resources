import ClientLayout from '../ClientLayout';

export default function Loading() {
  return (
    <ClientLayout>
      <style dangerouslySetInnerHTML={{
        __html: `
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
        `
      }} />

      <div className="library-page">
        {/* Hero Header Skeleton */}
        <section className="hero-section">
          <div className="container">
            <div className="skeleton" style={{ height: '3rem', width: '16rem', marginBottom: '1rem' }}></div>
            <div className="skeleton" style={{ height: '1.5rem', width: 'min(24rem, 100%)', marginBottom: '1rem' }}></div>
          </div>
        </section>

        <div className="container">
          {/* Search and Filters Skeleton */}
          <div className="search-filter-section">
            <div className="search-filter-wrapper">
              <div className="search-container">
                <div className="skeleton" style={{ height: '3rem', flex: 1 }}></div>
              </div>
              <div className="filter-dropdown">
                <div className="skeleton" style={{ height: '3rem', width: '10rem' }}></div>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="filter-pills">
              {['All', 'JavaScript', 'DSA', 'System Design', 'Patterns', 'AI'].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '2.5rem', width: '6rem', borderRadius: '9999px' }}></div>
              ))}
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="stats-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="stat-card glass-panel">
                <div className="skeleton" style={{ height: '1.25rem', width: '5rem', marginBottom: '0.75rem' }}></div>
                <div className="skeleton" style={{ height: '2rem', width: '4rem' }}></div>
              </div>
            ))}
          </div>

          {/* Articles Grid Skeleton */}
          <div className="articles-grid">
            {[...Array(9)].map((_, i) => (
              <article key={i} className="article-card glass-panel">
                <div className="article-card-header">
                  <div className="skeleton" style={{ height: '1.5rem', width: '8rem', borderRadius: '9999px' }}></div>
                  <div className="skeleton" style={{ height: '1.5rem', width: '5rem', borderRadius: '9999px' }}></div>
                </div>

                <div className="article-card-content">
                  <div className="skeleton" style={{ height: '1.75rem', width: '100%', marginBottom: '0.75rem' }}></div>
                  <div className="skeleton" style={{ height: '1.75rem', width: '85%', marginBottom: '1rem' }}></div>

                  <div style={{ marginBottom: '1rem' }}>
                    <div className="skeleton" style={{ height: '1rem', width: '100%', marginBottom: '0.5rem' }}></div>
                    <div className="skeleton" style={{ height: '1rem', width: '80%', marginBottom: '0.5rem' }}></div>
                  </div>

                  <div className="article-tags">
                    <div className="skeleton" style={{ height: '1.5rem', width: '4rem', borderRadius: '9999px' }}></div>
                    <div className="skeleton" style={{ height: '1.5rem', width: '5rem', borderRadius: '9999px' }}></div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Loading indicator */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', padding: '3rem 0', color: '#9ca3af' }}>
            <div className="loading-spinner"></div>
            <span style={{ fontSize: '1rem', fontWeight: '500' }}>Loading library...</span>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
