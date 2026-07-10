import ClientLayout from '../ClientLayout';

// Library loading skeleton. Uses the shared, theme-aware `.skeleton-block`
// styles from globals.css and mirrors the real library layout responsively.
export default function Loading() {
  return (
    <ClientLayout>
      <div className="container page-container">
        {/* Header */}
        <div className="library-skeleton__header">
          <div className="skeleton-block" style={{ height: '2.75rem', width: 'min(20rem, 90%)', marginBottom: '1rem', borderRadius: '10px' }} />
          <div className="skeleton-block skeleton-line" style={{ height: '1.1rem', width: 'min(26rem, 100%)' }} />
        </div>

        {/* Search + filters */}
        <div className="library-skeleton__controls glass-panel">
          <div className="skeleton-block" style={{ height: '2.75rem', flex: 1, borderRadius: '10px' }} />
          <div className="skeleton-block" style={{ height: '2.75rem', width: '9rem', borderRadius: '10px' }} />
        </div>

        {/* Filter pills */}
        <div className="library-skeleton__pills">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-block skeleton-pill" style={{ width: `${5 + (i % 3)}rem`, height: '2.25rem' }} />
          ))}
        </div>

        {/* Cards grid */}
        <div className="library-skeleton__grid">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="library-skeleton__card glass-panel">
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <div className="skeleton-block skeleton-pill" style={{ width: '6rem' }} />
                <div className="skeleton-block skeleton-pill" style={{ width: '4rem' }} />
              </div>
              <div className="skeleton-block" style={{ height: '1.4rem', width: '90%', marginBottom: '0.9rem', borderRadius: '8px' }} />
              <div className="skeleton-block skeleton-line" style={{ width: '100%', marginBottom: '0.5rem' }} />
              <div className="skeleton-block skeleton-line" style={{ width: '80%', marginBottom: '1.25rem' }} />
              <div className="skeleton-block skeleton-line" style={{ width: '40%' }} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .library-skeleton__header { margin: 2rem 0 1.5rem; }
        .library-skeleton__controls {
          display: flex;
          gap: 0.75rem;
          padding: 1rem;
          margin-bottom: 1.25rem;
        }
        .library-skeleton__pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          margin-bottom: 1.75rem;
        }
        .library-skeleton__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        .library-skeleton__card { padding: 1.5rem; }

        @media (max-width: 1024px) {
          .library-skeleton__grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .library-skeleton__grid { grid-template-columns: 1fr; }
          .library-skeleton__controls { flex-direction: column; }
        }
      `}</style>
    </ClientLayout>
  );
}
