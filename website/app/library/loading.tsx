export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header skeleton */}
        <div className="mb-8 space-y-4">
          <div className="h-12 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-6 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>

        {/* Search and filters skeleton */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>

        {/* Filter tabs skeleton */}
        <div className="mb-6 flex gap-2 overflow-x-auto">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          ))}
        </div>

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-2">
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-8 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Article cards skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4 shadow-md">
              <div className="flex items-start justify-between">
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-6 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Loading text centered */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <div className="h-5 w-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Loading library...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
