export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb skeleton */}
        <div className="mb-8 flex items-center gap-2 text-sm animate-pulse">
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>

        {/* Header skeleton */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-2 animate-pulse">
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-5 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>

        {/* Content skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
          {/* Paragraphs */}
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-11/12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-10/12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          ))}

          {/* Code block skeleton */}
          <div className="h-48 w-full bg-gray-100 dark:bg-gray-900 rounded-lg animate-pulse" />

          {/* More paragraphs */}
          {[...Array(4)].map((_, i) => (
            <div key={`p2-${i}`} className="space-y-2">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-11/12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Loading text centered */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <div className="h-5 w-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Loading article...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
