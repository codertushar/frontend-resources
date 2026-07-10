import ClientLayout from '../../ClientLayout';

// Article loading skeleton. Mirrors the real ResourceDetail layout (left nav,
// centered article, right rail) and collapses to a single column on tablet/
// mobile. Uses the shared, theme-aware `.skeleton-block` styles from globals.css.
export default function Loading() {
  return (
    <ClientLayout>
      <div className="article-skeleton">
        {/* Left sidebar — category navigation (hidden on smaller screens) */}
        <aside className="article-skeleton__rail article-skeleton__rail--left glass-panel">
          <div className="skeleton-block" style={{ height: '1.25rem', width: '60%', marginBottom: '1.25rem' }} />
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="skeleton-block skeleton-line"
              style={{ width: `${90 - (i % 3) * 12}%`, marginBottom: '0.9rem' }}
            />
          ))}
        </aside>

        {/* Main article column */}
        <main className="article-skeleton__main">
          {/* Breadcrumb */}
          <div className="article-skeleton__breadcrumb">
            <div className="skeleton-block skeleton-line" style={{ width: '3.5rem' }} />
            <div className="skeleton-block skeleton-line" style={{ width: '5rem' }} />
            <div className="skeleton-block skeleton-line" style={{ width: '7rem' }} />
          </div>

          {/* Meta pills */}
          <div className="article-skeleton__meta">
            <div className="skeleton-block skeleton-pill" />
            <div className="skeleton-block skeleton-pill" style={{ width: '4rem' }} />
            <div className="skeleton-block skeleton-pill" style={{ width: '6rem' }} />
          </div>

          {/* Title */}
          <div className="skeleton-block" style={{ height: '2.5rem', width: '85%', marginBottom: '0.75rem', borderRadius: '10px' }} />
          <div className="skeleton-block" style={{ height: '2.5rem', width: '55%', marginBottom: '2rem', borderRadius: '10px' }} />

          {/* Body paragraphs */}
          <div className="article-skeleton__body glass-panel">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="article-skeleton__para">
                <div className="skeleton-block skeleton-line" style={{ width: '100%' }} />
                <div className="skeleton-block skeleton-line" style={{ width: '96%' }} />
                <div className="skeleton-block skeleton-line" style={{ width: '88%' }} />
              </div>
            ))}
          </div>
        </main>

        {/* Right rail — related (hidden on smaller screens) */}
        <aside className="article-skeleton__rail article-skeleton__rail--right glass-panel">
          <div className="skeleton-block" style={{ height: '1.1rem', width: '50%', marginBottom: '1.25rem' }} />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ marginBottom: '1.1rem' }}>
              <div className="skeleton-block skeleton-line" style={{ width: '100%', marginBottom: '0.5rem' }} />
              <div className="skeleton-block skeleton-line" style={{ width: '75%' }} />
            </div>
          ))}
        </aside>
      </div>

      <style>{`
        .article-skeleton {
          display: grid;
          grid-template-columns: 240px minmax(0, 1fr) 260px;
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 1.25rem;
          align-items: flex-start;
        }
        .article-skeleton__rail {
          padding: 1.25rem;
          position: sticky;
          top: 90px;
        }
        .article-skeleton__main { min-width: 0; }
        .article-skeleton__breadcrumb {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .article-skeleton__meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }
        .article-skeleton__body {
          padding: 1.75rem;
        }
        .article-skeleton__para { margin-bottom: 1.5rem; }
        .article-skeleton__para .skeleton-line { margin-bottom: 0.6rem; }

        /* Tablet: drop the right rail */
        @media (max-width: 1100px) {
          .article-skeleton { grid-template-columns: 220px minmax(0, 1fr); }
          .article-skeleton__rail--right { display: none; }
        }
        /* Mobile: single column, no rails, tighter spacing */
        @media (max-width: 768px) {
          .article-skeleton {
            grid-template-columns: 1fr;
            gap: 1.25rem;
            padding: 1.25rem 1rem;
          }
          .article-skeleton__rail { display: none; }
          .article-skeleton__body { padding: 1.25rem; }
        }
      `}</style>
    </ClientLayout>
  );
}
