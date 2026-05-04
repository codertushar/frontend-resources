import ClientLayout from '../ClientLayout';

export default function Loading() {
  return (
    <ClientLayout>
      <div className="library-page">
        {/* Hero Header Skeleton */}
        <section className="hero-section">
          <div className="container">
            <div className="h-12 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
            <div className="h-6 w-96 max-w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </section>

        <div className="container">
          {/* Search and Filters Skeleton */}
          <div className="search-filter-section">
            <div className="search-filter-wrapper">
              <div className="search-container">
                <div className="h-12 flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              </div>
              <div className="filter-dropdown">
                <div className="h-12 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="filter-pills">
              {['All', 'JavaScript', 'DSA', 'System Design', 'Patterns', 'AI'].map((label, i) => (
                <div key={i} className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              ))}
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="stats-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="stat-card glass-panel">
                <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3" />
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Articles Grid Skeleton */}
          <div className="articles-grid">
            {[...Array(9)].map((_, i) => (
              <article key={i} className="article-card glass-panel">
                <div className="article-card-header">
                  <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                </div>

                <div className="article-card-content">
                  <div className="h-7 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3" />
                  <div className="h-7 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />

                  <div className="space-y-2 mb-4">
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>

                  <div className="article-tags">
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                    <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Loading indicator */}
          <div className="flex justify-center py-12">
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
              <div className="h-6 w-6 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-base font-medium">Loading library...</span>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
