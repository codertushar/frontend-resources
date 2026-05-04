'use client';

import { useState, useMemo, useEffect, useCallback, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  List,
  X,
  CheckCircle,
  Crown,
  BookOpen,
  Trophy,
  Shuffle,
  Clock,
  SlidersHorizontal
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProgress } from '../../src/context/ProgressContext';
import { useLibraryFilters } from '../../src/hooks/useLibraryFilters';
import {
  CATEGORIES,
  FILTERS,
  FILTER_PRESETS,
  CATEGORY_DISPLAY_NAMES,
  SUBCATEGORY_DISPLAY_NAMES
} from '../../src/config/filters';
import AdUnit from '../../src/components/AdUnit';
import type { Article } from '../../src/types/content';
import type { FilterState, FilterPreset, CategoryValue } from '../../src/config/filters';

// Type for interview frequency
type InterviewFrequency = 'critical' | 'common' | 'occasional';

// Type for view mode
type ViewMode = 'grid' | 'list';

// Type for category progress
interface CategoryProgress {
  total: number;
  read: number;
  percentage: number;
}

interface LibraryClientProps {
  initialArticles: Article[];
}

// Get interview frequency
const getInterviewFrequency = (item: Article): InterviewFrequency => {
  if ((item as Article & { interviewFrequency?: InterviewFrequency }).interviewFrequency) {
    return (item as Article & { interviewFrequency?: InterviewFrequency }).interviewFrequency!;
  }

  const criticalTopics = ['closures', 'event_loop', 'hoisting'];
  const criticalExactIds = [
    'js/general-concepts/closures',
    'js/general-concepts/event_loop',
    'js/general-concepts/hoisting',
    'js/general-concepts/this',
    'js/promises/promises',
    'js/general-concepts/prototype',
  ];

  const idLower = item.id.toLowerCase();
  if (criticalExactIds.some(id => idLower === id.toLowerCase())) return 'critical';

  const fileName = idLower.split('/').pop() || '';
  if (criticalTopics.some(topic => fileName === topic || fileName.startsWith(topic + '_'))) return 'critical';

  if ((item.subcategory === 'polyfills' || item.tags?.includes('polyfill')) && item.difficulty === 'hard') return 'common';
  if (item.category === 'dsa' && item.difficulty === 'hard') return 'common';

  return 'occasional';
};

export function LibraryClient({ initialArticles }: LibraryClientProps) {
  const { isRead, getStats } = useProgress();
  const router = useRouter();

  // Use the library filters hook
  const {
    filterState,
    filteredData: filteredDataRaw,
    activeFilterCount,
    hasActiveFilters,
    updateFilter,
    updateFilters,
    resetAllFilters,
  } = useLibraryFilters(initialArticles as unknown as import('../../src/hooks/useLibraryFilters').ContentItem[], {
    isRead,
    getInterviewFrequency: getInterviewFrequency as (item: import('../../src/hooks/useLibraryFilters').ContentItem) => string | undefined
  });

  // Cast filtered data back to Article[]
  const filteredData = filteredDataRaw as unknown as Article[];

  // UI state
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showMoreFilters, setShowMoreFilters] = useState<boolean>(false);
  const [isFilterSticky, setIsFilterSticky] = useState<boolean>(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Detect mobile/tablet and auto-switch to grid view
  useEffect(() => {
    const checkMobile = (): void => {
      setIsMobile(window.innerWidth <= 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Always use grid view on mobile
  const effectiveViewMode: ViewMode = isMobile ? 'grid' : viewMode;

  // Handle sticky filter bar
  useEffect(() => {
    const handleScroll = (): void => {
      if (filterRef.current) {
        const rect = filterRef.current.getBoundingClientRect();
        setIsFilterSticky(rect.top <= 60);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get progress stats
  const stats = useMemo(() => {
    const baseStats = getStats(initialArticles.length);
    return {
      ...baseStats,
      completed: baseStats.readCount,
    };
  }, [getStats, initialArticles.length]);

  // Calculate category progress
  const categoryProgress = useMemo((): Record<string, CategoryProgress> => {
    const progress: Record<string, CategoryProgress> = {};
    (CATEGORIES as CategoryValue[]).forEach(cat => {
      if (cat.id === 'all') return;
      const categoryArticles = initialArticles.filter(item => item.category === cat.id);
      const readCount = categoryArticles.filter(item => isRead(item.id)).length;
      progress[cat.id] = {
        total: categoryArticles.length,
        read: readCount,
        percentage: categoryArticles.length > 0 ? Math.round((readCount / categoryArticles.length) * 100) : 0,
      };
    });
    return progress;
  }, [isRead, initialArticles]);

  // Random article picker
  const handleSurpriseMe = useCallback((): void => {
    const unreadArticles = initialArticles.filter(item => !isRead(item.id));
    if (unreadArticles.length > 0) {
      const randomArticle = unreadArticles[Math.floor(Math.random() * unreadArticles.length)];
      router.push(`/resource/${randomArticle.id}`);
    }
  }, [isRead, router, initialArticles]);

  // Apply preset filters
  const applyPreset = useCallback((preset: FilterPreset): void => {
    updateFilters(preset.filters as Partial<FilterState>);
  }, [updateFilters]);

  // Event handlers
  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    updateFilter('search', e.target.value);
  }, [updateFilter]);

  const handleClearSearch = useCallback((): void => {
    updateFilter('search', '');
  }, [updateFilter]);

  const handleDifficultyChange = useCallback((e: ChangeEvent<HTMLSelectElement>): void => {
    updateFilter('difficulty', e.target.value);
  }, [updateFilter]);

  const handleAccessChange = useCallback((e: ChangeEvent<HTMLSelectElement>): void => {
    updateFilter('access', e.target.value);
  }, [updateFilter]);

  const handleSortChange = useCallback((e: ChangeEvent<HTMLSelectElement>): void => {
    updateFilter('sort', e.target.value);
  }, [updateFilter]);

  const handleInterviewFrequencyChange = useCallback((e: ChangeEvent<HTMLSelectElement>): void => {
    updateFilter('interviewFrequency', e.target.value);
  }, [updateFilter]);

  const handleReadStatusChange = useCallback((e: ChangeEvent<HTMLSelectElement>): void => {
    updateFilter('readStatus', e.target.value);
  }, [updateFilter]);

  const handleDateAddedChange = useCallback((e: ChangeEvent<HTMLSelectElement>): void => {
    updateFilter('dateAdded', e.target.value);
  }, [updateFilter]);

  const handleCategoryClick = useCallback((categoryId: string): void => {
    updateFilter('category', categoryId);
  }, [updateFilter]);

  const toggleMoreFilters = useCallback((): void => {
    setShowMoreFilters(prev => !prev);
  }, []);

  return (
    <div className="container page-container">
      {/* Header Section */}
      <motion.div
        className="header-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="heading-gradient">
          {filterState.subcategory
            ? SUBCATEGORY_DISPLAY_NAMES[filterState.subcategory as keyof typeof SUBCATEGORY_DISPLAY_NAMES] || filterState.subcategory
            : filterState.category !== 'all'
              ? CATEGORY_DISPLAY_NAMES[filterState.category as keyof typeof CATEGORY_DISPLAY_NAMES] || filterState.category
              : 'Resource Library'}
        </h1>
        <p className="subtitle">
          {filterState.subcategory
            ? `Explore ${filteredData.length} ${SUBCATEGORY_DISPLAY_NAMES[filterState.subcategory as keyof typeof SUBCATEGORY_DISPLAY_NAMES] || filterState.subcategory} resources.`
            : filterState.category !== 'all'
              ? `Explore ${filteredData.length} ${CATEGORY_DISPLAY_NAMES[filterState.category as keyof typeof CATEGORY_DISPLAY_NAMES] || filterState.category} resources.`
              : `Explore ${initialArticles.length} curated resources to boost your skills.`}
        </p>

        {stats.completed > 0 && (
          <div className="library-progress">
            <div className="library-progress-info">
              <Trophy size={18} />
              <span>{stats.completed} of {initialArticles.length} completed</span>
              <span className="library-progress-percentage">{stats.percentage}%</span>
            </div>
            <div className="library-progress-bar-container">
              <div className="library-progress-bar" style={{ width: `${stats.percentage}%` }}></div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Discovery Section - only show when no filters active */}
      {!hasActiveFilters && (
        <>
          {/* Quick Actions Bar */}
          <motion.div
            className="quick-actions glass-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <button className="quick-action-btn surprise-btn" onClick={handleSurpriseMe}>
              <Shuffle size={18} />
              <span>Surprise Me</span>
            </button>
            <div className="quick-stats">
              <span className="stat-chip">
                <BookOpen size={14} />
                {initialArticles.length} Resources
              </span>
            </div>
          </motion.div>

          {/* Category Progress */}
          {stats.completed > 0 && (
            <motion.div
              className="category-progress-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="section-header">
                <Trophy size={20} />
                <h2>Your Progress</h2>
              </div>
              <div className="category-progress-grid">
                {(CATEGORIES as CategoryValue[]).filter(cat => cat.id !== 'all').map((cat) => {
                  const progress = categoryProgress[cat.id];
                  if (!progress || progress.total === 0) return null;
                  return (
                    <button
                      key={cat.id}
                      className={`category-progress-card ${progress.percentage === 100 ? 'completed' : ''}`}
                      onClick={() => handleCategoryClick(cat.id)}
                    >
                      <div className="cat-progress-header">
                        <span className="cat-progress-label">{cat.label}</span>
                        <span className="cat-progress-count">{progress.read}/{progress.total}</span>
                      </div>
                      <div className="cat-progress-bar">
                        <div className="cat-progress-fill" style={{ width: `${progress.percentage}%` }}></div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* TIER 1: PRIMARY FILTERS */}
      <motion.div
        ref={filterRef}
        className={`controls-section glass-panel ${isFilterSticky ? 'is-sticky' : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* TIER 2: SECONDARY FILTERS - Quick Refinement */}
        <div className="search-row">
          {/* Search */}
          <div className="search-bar">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder={FILTERS.primary.search.placeholder}
              value={filterState.search}
              onChange={handleSearchChange}
            />
            {filterState.search && (
              <button
                className="clear-search-btn"
                onClick={handleClearSearch}
                title="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="filter-dropdowns">
            {/* Difficulty */}
            <select
              value={filterState.difficulty}
              onChange={handleDifficultyChange}
              className={`filter-select ${filterState.difficulty !== 'all' ? 'active' : ''}`}
            >
              {FILTERS.secondary.difficulty.values?.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>

            {/* Access/Pricing */}
            <select
              value={filterState.access}
              onChange={handleAccessChange}
              className={`filter-select ${filterState.access !== 'all' ? 'active' : ''}`}
            >
              {FILTERS.secondary.access.values?.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>

            {/* More Filters Button */}
            <button
              className={`filter-btn more-filters ${showMoreFilters ? 'active' : ''}`}
              onClick={toggleMoreFilters}
            >
              <SlidersHorizontal size={16} />
              <span>More</span>
              <ChevronDown size={14} className={`chevron ${showMoreFilters ? 'rotated' : ''}`} />
            </button>
          </div>

          {/* View Toggle - hidden on mobile since we force grid view */}
          {!isMobile && (
            <div className="view-toggle">
              <button
                className={`view-btn ${effectiveViewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid view"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                className={`view-btn ${effectiveViewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List view"
              >
                <List size={18} />
              </button>
            </div>
          )}
        </div>

        {/* TIER 4: ADVANCED FILTERS - Expandable Panel */}
        <AnimatePresence>
          {showMoreFilters && (
            <motion.div
              className="expanded-filters"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Sort */}
              <select
                value={filterState.sort}
                onChange={handleSortChange}
                className={`filter-select ${filterState.sort !== 'default' ? 'active' : ''}`}
              >
                {FILTERS.secondary.sort.values?.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>

              {/* Interview Frequency */}
              <select
                value={filterState.interviewFrequency}
                onChange={handleInterviewFrequencyChange}
                className={`filter-select ${filterState.interviewFrequency !== 'all' ? 'active' : ''}`}
              >
                {FILTERS.advanced.interviewFrequency.values?.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>

              {/* Read Status */}
              <select
                value={filterState.readStatus}
                onChange={handleReadStatusChange}
                className={`filter-select ${filterState.readStatus !== 'all' ? 'active' : ''}`}
              >
                {FILTERS.advanced.readStatus.values?.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>

              {/* Date Added */}
              <select
                value={filterState.dateAdded}
                onChange={handleDateAddedChange}
                className={`filter-select ${filterState.dateAdded !== 'all' ? 'active' : ''}`}
              >
                {FILTERS.advanced.dateAdded.values?.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Bar */}
        <div className="results-bar">
          <span className="results-count">
            Showing <strong>{filteredData.length}</strong> of {initialArticles.length} resources
          </span>
          {activeFilterCount > 0 && (
            <button className="clear-all-btn" onClick={resetAllFilters}>
              <X size={14} />
              Clear {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
            </button>
          )}
        </div>
      </motion.div>

      {/* TIER 3: FILTER PRESETS - Quick Access */}
      {!hasActiveFilters && FILTER_PRESETS.length > 0 && (
        <motion.div
          className="filter-presets"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="preset-chips">
            {(FILTER_PRESETS as FilterPreset[]).map((preset) => (
              <button
                key={preset.id}
                className="preset-chip"
                onClick={() => applyPreset(preset)}
                title={preset.description}
                style={{ '--preset-color': preset.color } as React.CSSProperties}
              >
                <span className="emoji">{preset.emoji}</span>
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* List Header (Sticky) */}
      {effectiveViewMode === 'list' && filteredData.length > 0 && (
        <motion.div
          className="list-header glass-panel"
          style={{ marginBottom: 0, borderRadius: '12px 12px 0 0' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div style={{ flex: 1, minWidth: 0, paddingLeft: '0.5rem' }}>QUESTION</div>
          <div style={{ width: '200px', flexShrink: 0 }}>CATEGORY</div>
          <div style={{ width: '100px', flexShrink: 0, textAlign: 'center' }}>DIFFICULTY</div>
          <div style={{ width: '200px', flexShrink: 0, textAlign: 'right' }}>TYPE</div>
        </motion.div>
      )}

      {/* Results */}
      <div className={`resources-grid ${effectiveViewMode === 'list' ? 'list-view' : ''}`}>
        {effectiveViewMode === 'list' && filteredData.length > 0 && (
          <motion.div
            className="glass-panel"
            style={{ padding: 0, overflow: 'hidden', borderRadius: '0 0 12px 12px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {filteredData.map((item) => {
              const interviewFreq = getInterviewFrequency(item);
              return (
                <div key={item.id}>
                  <Link
                    href={`/resource/${item.id}`}
                    className={`resource-card ${isRead(item.id) ? 'is-read' : ''}`}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                      {isRead(item.id) ? (
                        <span className="read-indicator" title="Completed" style={{ width: '16px', flexShrink: 0 }}>
                          <CheckCircle size={16} />
                        </span>
                      ) : (
                        <span style={{ width: '16px', flexShrink: 0 }}></span>
                      )}
                      <h3 style={{ margin: 0, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</h3>
                    </div>

                    <div className="card-meta" style={{ width: '200px', flexShrink: 0 }}>
                      <span className="meta-category">{CATEGORY_DISPLAY_NAMES[item.category as keyof typeof CATEGORY_DISPLAY_NAMES] || item.category}</span>
                      {item.subcategory && (
                        <>
                          <span className="meta-separator">•</span>
                          <span className="meta-subcategory">{SUBCATEGORY_DISPLAY_NAMES[item.subcategory as keyof typeof SUBCATEGORY_DISPLAY_NAMES] || item.subcategory}</span>
                        </>
                      )}
                    </div>

                    <div style={{ width: '100px', flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                      {item.difficulty && (
                        <span className={`badge difficulty ${item.difficulty}`}>
                          {item.difficulty}
                        </span>
                      )}
                    </div>

                    <div className="card-header" style={{ width: '200px', flexShrink: 0, margin: 0, gap: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                      {interviewFreq === 'critical' && (
                        <span className="badge interview-favorite" title="Frequently asked in interviews">
                          Interview Favorite
                        </span>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}
          </motion.div>
        )}

        {effectiveViewMode === 'grid' && filteredData.length > 0 && filteredData.map((item, index) => {
          const interviewFreq = getInterviewFrequency(item);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.02 }}
            >
              <Link
                href={`/resource/${item.id}`}
                className={`resource-card glass-panel animated-card subtle ${isRead(item.id) ? 'is-read' : ''}`}
              >
                <div className="card-header">
                  {isRead(item.id) && (
                    <span className="read-indicator" title="Completed">
                      <CheckCircle size={16} />
                    </span>
                  )}
                  {interviewFreq === 'critical' && (
                    <span className="badge interview-favorite" title="Frequently asked in interviews">
                      Interview Favorite
                    </span>
                  )}
                  {item.difficulty && (
                    <span className={`badge difficulty ${item.difficulty}`}>
                      {item.difficulty}
                    </span>
                  )}
                </div>
                <h3>{item.title}</h3>
                <div className="card-meta">
                  <span className="meta-category">{CATEGORY_DISPLAY_NAMES[item.category as keyof typeof CATEGORY_DISPLAY_NAMES] || item.category}</span>
                  {item.subcategory && (
                    <>
                      <span className="meta-separator">•</span>
                      <span className="meta-subcategory">{SUBCATEGORY_DISPLAY_NAMES[item.subcategory as keyof typeof SUBCATEGORY_DISPLAY_NAMES] || item.subcategory}</span>
                    </>
                  )}
                  <span className="meta-separator">•</span>
                  <span className="meta-time">
                    <Clock size={12} />
                    {item.readTime || 5} min
                  </span>
                </div>
                <p className="card-description">{item.description || item.content.substring(0, 120)}</p>
                <div className="card-footer">
                  <span>{isRead(item.id) ? 'Review' : 'Read Article'}</span>
                  <ChevronRight size={16} />
                </div>
              </Link>
            </motion.div>
          );
        })}

        {filteredData.length === 0 && (
          <div className="empty-state">
            <Search size={48} />
            <h3>No resources found</h3>
            <p>Try adjusting your filters or search terms</p>
            <button className="btn-reset" onClick={resetAllFilters}>
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Ad Unit - shown below results */}
      {filteredData.length > 0 && <AdUnit />}
    </div>
  );
}
