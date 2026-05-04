import ClientLayout from '../../ClientLayout';

export default function Loading() {
  return (
    <ClientLayout>
      <div className="container detail-container-wrapper">
        {/* Left Sidebar Skeleton */}
        <aside className="article-sidebar glass-panel">
          <div className="sidebar-header">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <nav className="sidebar-nav">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="sidebar-item">
                <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="article-content-wrapper">
          {/* Breadcrumb skeleton */}
          <nav className="breadcrumb">
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <span className="breadcrumb-separator">/</span>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <span className="breadcrumb-separator">/</span>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </nav>

          {/* Article Header Skeleton */}
          <div className="article-header">
            <div className="article-meta">
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            </div>
            <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
            <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
            <div className="h-5 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>

          {/* Main Content Skeleton */}
          <article className="markdown-content glass-panel">
            <div className="space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 w-11/12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 w-10/12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              ))}

              {/* Code block skeleton */}
              <div className="h-48 w-full bg-gray-800 dark:bg-gray-950 rounded-lg animate-pulse" />

              {[...Array(4)].map((_, i) => (
                <div key={`p2-${i}`} className="space-y-3">
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 w-11/12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              ))}
            </div>

            {/* Loading indicator */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <div className="h-6 w-6 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-base font-medium">Loading article...</span>
              </div>
            </div>
          </article>
        </main>

        {/* Right Sidebar Skeleton */}
        <aside className="related-sidebar glass-panel">
          <div className="sidebar-section">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="related-article mb-4">
                <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </aside>
      </div>
    </ClientLayout>
  );
}
