'use client';

import { useState, useCallback, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LayoutGrid, List, CheckCircle, Crown, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProgress } from '../../src/context/ProgressContext';
import { useSubscription } from '../../src/context/SubscriptionContext';
import AdUnit from '../../src/components/AdUnit';
import type { Article } from '../../src/types/content';

type ViewMode = 'grid' | 'list';

interface LibraryClientProps {
  initialArticles: Article[];
}

export function LibraryClient({
  initialArticles,
}: LibraryClientProps) {
  const { isRead } = useProgress();
  const { isPremium } = useSubscription();
  const router = useRouter();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  // Filter articles based on search and difficulty
  const filteredArticles = initialArticles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = !selectedDifficulty || article.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const handleArticleClick = useCallback(
    (article: Article) => {
      router.push(`/resource/${article.id}`);
    },
    [router]
  );

  const getInterviewFrequency = (article: Article): string => {
    const criticalIds = [
      'js/general-concepts/closures',
      'js/general-concepts/event_loop',
      'js/general-concepts/this',
      'js/general-concepts/prototype',
    ];
    if (criticalIds.includes(article.id)) return 'critical';
    if (article.category === 'dsa' && article.difficulty === 'hard') return 'common';
    return 'occasional';
  };

  const renderArticleCard = (article: Article) => {
    const isReadArticle = isRead(article.id);
    const interviewFreq = getInterviewFrequency(article);
    const isPremiumArticle = article.premium;
    const canAccess = !isPremiumArticle || isPremium;

    return (
      <motion.div
        key={article.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        onClick={() => canAccess && handleArticleClick(article)}
        className={`
          group relative p-4 rounded-lg border transition-all duration-300 cursor-pointer
          ${
            viewMode === 'grid'
              ? 'border-gray-200 dark:border-gray-800 hover:border-violet-400 dark:hover:border-violet-600 hover:shadow-lg'
              : 'border-gray-100 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-900/50'
          }
          ${canAccess ? '' : 'opacity-75'}
        `}
      >
        {/* Status indicators */}
        <div className="absolute top-2 right-2 flex gap-2">
          {isReadArticle && <CheckCircle size={18} className="text-green-500" />}
          {isPremiumArticle && !canAccess && <Crown size={18} className="text-amber-500" />}
        </div>

        {/* Interview frequency badge */}
        <div className="mb-2">
          {interviewFreq === 'critical' && (
            <span className="inline-block px-2 py-1 text-xs rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
              🔴 Critical
            </span>
          )}
          {interviewFreq === 'common' && (
            <span className="inline-block px-2 py-1 text-xs rounded bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
              🟡 Common
            </span>
          )}
          {interviewFreq === 'occasional' && (
            <span className="inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              🟢 Occasional
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400">
          {article.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {article.description || 'No description available'}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 capitalize">
            {article.difficulty}
          </span>
          {article.date && (
            <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}</span>
          )}
        </div>

        {/* Premium overlay */}
        {!canAccess && (
          <div className="absolute inset-0 rounded-lg bg-black/40 flex items-center justify-center">
            <div className="text-center">
              <Crown size={32} className="text-white mx-auto mb-1" />
              <p className="text-white text-xs font-medium">Premium Content</p>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-900 dark:to-purple-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">📚 Resource Library</h1>
          <p className="text-violet-100">Explore our collection of {initialArticles.length} frontend resources</p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Controls */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={20} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-900 dark:text-white"
            />
          </div>

          {/* Filters and view toggle */}
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedDifficulty(null)}
                className={`px-3 py-1 text-sm rounded-full border transition-all ${
                  selectedDifficulty === null
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-600'
                    : 'border-gray-300 dark:border-gray-700 hover:border-violet-500'
                }`}
              >
                All
              </button>
              {['easy', 'medium', 'hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1 text-sm rounded-full border transition-all capitalize ${
                    selectedDifficulty === diff
                      ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-600'
                      : 'border-gray-300 dark:border-gray-700 hover:border-violet-500'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <List size={20} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <LayoutGrid size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Showing {filteredArticles.length} of {initialArticles.length} articles
          </p>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No articles found matching your criteria.
              </p>
            </div>
          ) : (
            <div
              className={`grid gap-4 ${
                viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
              }`}
            >
              <AnimatePresence mode="popLayout">
                {filteredArticles.map((article) => renderArticleCard(article))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Ad unit */}
        <div className="mt-12">
          <AdUnit />
        </div>
      </div>
    </div>
  );
}
