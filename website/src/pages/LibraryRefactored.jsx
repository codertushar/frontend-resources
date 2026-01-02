import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, ChevronDown, LayoutGrid, List, X, CheckCircle, Crown, BookOpen, Trophy, Shuffle, Target, Clock, SlidersHorizontal } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import contentData from '../data/content.json';
import { useProgress } from '../context/ProgressContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useLibraryFilters } from '../hooks/useLibraryFilters';
import { CATEGORIES, FILTERS, FILTER_PRESETS, extractTags, CATEGORY_DISPLAY_NAMES, SUBCATEGORY_DISPLAY_NAMES } from '../config/filters';
import AdUnit from '../components/AdUnit';

// Get interview frequency (keep existing logic)
const getInterviewFrequency = (item) => {
  if (item.interviewFrequency) return item.interviewFrequency;

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

  const fileName = idLower.split('/').pop();
  if (criticalTopics.some(topic => fileName === topic || fileName.startsWith(topic + '_'))) return 'critical';

  if ((item.subcategory === 'polyfills' || item.tags?.includes('polyfill')) && item.difficulty === 'hard') return 'common';
  if (item.category === 'dsa' && item.difficulty === 'hard') return 'common';

  return 'occasional';
};

// Start here article IDs
const START_HERE_IDS = [
  'js/general-concepts/function_vs_arrow_function',
  'js/polyfills/arrays/filter',
  'dsa/30_day_dsa_guide_senior_frontend',
  'general/design-patterns/general',
];

const Library = () => {
  const { isRead, getStats } = useProgress();
  const { isPremium } = useSubscription();
  const navigate = useNavigate();

  // 🎯 NEW: Single hook manages ALL filter state
  const {
    filterState,
    filteredData,
    activeFilterCount,
    hasActiveFilters,
    updateFilter,
    updateFilters,
    resetAllFilters,
  } = useLibraryFilters(contentData, { isRead, getInterviewFrequency });

  // UI state
  const [viewMode, setViewMode] = useState('list');
  const [isMobile, setIsMobile] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [isFilterSticky, setIsFilterSticky] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const filterRef = useRef(null);

  // Detect mobile/tablet and auto-switch to grid view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Always use grid view on mobile, regardless of viewMode state
  const effectiveViewMode = isMobile ? 'grid' : viewMode;

  // Handle sticky filter bar
  useEffect(() => {
    const handleScroll = () => {
      if (filterRef.current) {
        const rect = filterRef.current.getBoundingClientRect();
        setIsFilterSticky(rect.top <= 60);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.category-wrapper')) {
        setExpandedCategory(null);
      }
    };
    const handleScroll = () => {
      setExpandedCategory(null);
    };
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Get progress stats
  const stats = getStats(contentData.length);

  // Get "Start Here" articles
  const startHereArticles = useMemo(() => {
    return START_HERE_IDS
      .map(id => contentData.find(item => item.id === id))
      .filter(Boolean);
  }, []);

  // Calculate category progress
  const categoryProgress = useMemo(() => {
    const progress = {};
    CATEGORIES.forEach(cat => {
      if (cat.id === 'all') return;
      const categoryArticles = contentData.filter(item => item.category === cat.id);
      const readCount = categoryArticles.filter(item => isRead(item.id)).length;
      progress[cat.id] = {
        total: categoryArticles.length,
        read: readCount,
        percentage: categoryArticles.length > 0 ? Math.round((readCount / categoryArticles.length) * 100) : 0,
      };
    });
    return progress;
  }, [isRead]);

  // Random article picker
  const handleSurpriseMe = useCallback(() => {
    const unreadArticles = contentData.filter(item => !isRead(item.id) && !item.premium);
    if (unreadArticles.length > 0) {
      const randomArticle = unreadArticles[Math.floor(Math.random() * unreadArticles.length)];
      navigate(`/resource/${randomArticle.id}`);
    }
  }, [isRead, navigate]);

  // Apply preset filters
  const applyPreset = useCallback((preset) => {
    updateFilters(preset.filters);
  }, [updateFilters]);

  // Get all available tags
  const availableTags = useMemo(() => extractTags(contentData), []);

  // Apply subcategory filter on top of hook's filtered data
  const finalFilteredData = useMemo(() => {
    if (!selectedSubcategory) return filteredData;
    return filteredData.filter(item => item.subcategory === selectedSubcategory);
  }, [filteredData, selectedSubcategory]);

  return (
    <div className="container page-container">
      {/* Header Section */}
      <div className="header-section">
        <h1 className="heading-gradient">Resource Library</h1>
        <p className="subtitle">Explore {contentData.length} curated resources to boost your skills.</p>

        {stats.completed > 0 && (
          <div className="library-progress">
            <div className="library-progress-info">
              <Trophy size={18} />
              <span>{stats.completed} of {contentData.length} completed</span>
              <span className="library-progress-percentage">{stats.percentage}%</span>
            </div>
            <div className="library-progress-bar-container">
              <div className="library-progress-bar" style={{ width: `${stats.percentage}%` }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Discovery Section - only show when no filters active */}
      {!hasActiveFilters && (
        <>
          {/* Quick Actions Bar */}
          <div className="quick-actions glass-panel">
            <button className="quick-action-btn surprise-btn" onClick={handleSurpriseMe}>
              <Shuffle size={18} />
              <span>Surprise Me</span>
            </button>
            <div className="quick-stats">
              <span className="stat-chip">
                <BookOpen size={14} />
                {contentData.filter(i => !i.premium).length} Free
              </span>
              <span className="stat-chip premium-chip">
                <Crown size={14} />
                {contentData.filter(i => i.premium).length} Premium
              </span>
            </div>
          </div>

          {/* Start Here Section */}
          {stats.completed < 5 && startHereArticles.length > 0 && (
            <div className="start-here-section">
              <div className="section-header">
                <Target size={20} />
                <h2>Start Here</h2>
                <span className="section-badge free-badge">All Free</span>
              </div>
              <p className="section-subtitle">New to frontend interviews? Begin with these foundational topics.</p>
              <div className="start-here-grid">
                {startHereArticles.map((item, index) => (
                  <Link
                    key={item.id}
                    to={`/resource/${item.id}`}
                    className={`start-here-card glass-panel ${isRead(item.id) ? 'is-read' : ''}`}
                  >
                    <span className="start-here-number">{index + 1}</span>
                    {isRead(item.id) && (
                      <span className="card-read-badge">
                        <CheckCircle size={14} />
                      </span>
                    )}
                    <h3>{item.title.replace(/^[^\s]+\s/, '')}</h3>
                    <span className={`start-here-difficulty ${item.difficulty}`}>{item.difficulty}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Category Progress */}
          {stats.completed > 0 && (
            <div className="category-progress-section">
              <div className="section-header">
                <Trophy size={20} />
                <h2>Your Progress</h2>
              </div>
              <div className="category-progress-grid">
                {CATEGORIES.filter(cat => cat.id !== 'all').map(cat => {
                  const progress = categoryProgress[cat.id];
                  if (!progress || progress.total === 0) return null;
                  return (
                    <button
                      key={cat.id}
                      className={`category-progress-card ${progress.percentage === 100 ? 'completed' : ''}`}
                      onClick={() => updateFilter('category', cat.id)}
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
            </div>
          )}
        </>
      )}

      {/* TIER 1: PRIMARY FILTERS - Categories (Always Visible) */}
      <div ref={filterRef} className={`controls-section glass-panel ${isFilterSticky ? 'is-sticky' : ''}`}>
        <div className="categories">
          {CATEGORIES.map(cat => {
            const IconComponent = cat.icon;
            const isActive = filterState.category === cat.id;
            const hasSubcategories = cat.hasSubcategories;
            const isExpanded = expandedCategory === cat.id;

            return (
              <div key={cat.id} className="category-wrapper">
                <button
                  className={`category-pill ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    updateFilter('category', cat.id);
                    if (hasSubcategories) {
                      setExpandedCategory(isExpanded ? null : cat.id);
                      // Don't reset subcategory when reopening dropdown
                    } else {
                      setExpandedCategory(null);
                      setSelectedSubcategory(null);
                    }
                  }}
                  style={{ '--cat-color': cat.color }}
                >
                  <IconComponent size={16} className="category-icon" />
                  <span>{cat.label}</span>
                  {hasSubcategories && (
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={14} />
                    </motion.div>
                  )}
                </button>

                {/* Floating Dropdown for Subcategories */}
                <AnimatePresence>
                  {hasSubcategories && isExpanded && isActive && (
                    <motion.div
                      className="subcategories-dropdown"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="dropdown-header">
                        {cat.label} Sections
                      </div>
                      <button
                        className={`dropdown-item ${!selectedSubcategory ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSubcategory(null);
                          setExpandedCategory(null);
                        }}
                      >
                        <span>All {cat.label}</span>
                        <span className="item-count">{cat.subcategories.reduce((sum, s) => sum + s.count, 0)}</span>
                      </button>
                      {cat.subcategories.map(subcat => (
                        <button
                          key={subcat.id}
                          className={`dropdown-item ${selectedSubcategory === subcat.id ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSubcategory(subcat.id);
                            setExpandedCategory(null);
                          }}
                        >
                          <span>{subcat.label}</span>
                          <span className="item-count">{subcat.count}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* TIER 2: SECONDARY FILTERS - Quick Refinement */}
        <div className="search-row">
          {/* Search */}
          <div className="search-bar">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder={FILTERS.primary.search.placeholder}
              value={filterState.search}
              onChange={(e) => updateFilter('search', e.target.value)}
            />
            {filterState.search && (
              <button
                className="clear-search-btn"
                onClick={() => updateFilter('search', '')}
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
              onChange={(e) => updateFilter('difficulty', e.target.value)}
              className={`filter-select ${filterState.difficulty !== 'all' ? 'active' : ''}`}
            >
              {FILTERS.secondary.difficulty.values.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>

            {/* Access/Pricing */}
            <select
              value={filterState.access}
              onChange={(e) => updateFilter('access', e.target.value)}
              className={`filter-select ${filterState.access !== 'all' ? 'active' : ''}`}
            >
              {FILTERS.secondary.access.values.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>

            {/* More Filters Button */}
            <button
              className={`filter-btn more-filters ${showMoreFilters ? 'active' : ''}`}
              onClick={() => setShowMoreFilters(!showMoreFilters)}
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
                onChange={(e) => updateFilter('sort', e.target.value)}
                className={`filter-select ${filterState.sort !== 'default' ? 'active' : ''}`}
              >
                {FILTERS.secondary.sort.values.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>

              {/* Interview Frequency */}
              <select
                value={filterState.interviewFrequency}
                onChange={(e) => updateFilter('interviewFrequency', e.target.value)}
                className={`filter-select ${filterState.interviewFrequency !== 'all' ? 'active' : ''}`}
              >
                {FILTERS.advanced.interviewFrequency.values.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>

              {/* Read Status */}
              <select
                value={filterState.readStatus}
                onChange={(e) => updateFilter('readStatus', e.target.value)}
                className={`filter-select ${filterState.readStatus !== 'all' ? 'active' : ''}`}
              >
                {FILTERS.advanced.readStatus.values.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>

              {/* Date Added */}
              <select
                value={filterState.dateAdded}
                onChange={(e) => updateFilter('dateAdded', e.target.value)}
                className={`filter-select ${filterState.dateAdded !== 'all' ? 'active' : ''}`}
              >
                {FILTERS.advanced.dateAdded.values.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Bar */}
        <div className="results-bar">
          <span className="results-count">
            Showing <strong>{finalFilteredData.length}</strong> of {contentData.length} resources
          </span>
          {(activeFilterCount > 0 || selectedSubcategory) && (
            <button className="clear-all-btn" onClick={() => {
              resetAllFilters();
              setSelectedSubcategory(null);
            }}>
              <X size={14} />
              Clear {activeFilterCount + (selectedSubcategory ? 1 : 0)} filter{(activeFilterCount + (selectedSubcategory ? 1 : 0)) > 1 ? 's' : ''}
            </button>
          )}
        </div>
      </div>

      {/* TIER 3: FILTER PRESETS - Quick Access */}
      {!hasActiveFilters && FILTER_PRESETS.length > 0 && (
        <div className="filter-presets">
          <div className="preset-chips">
            {FILTER_PRESETS.map(preset => (
              <button
                key={preset.id}
                className="preset-chip"
                onClick={() => applyPreset(preset)}
                title={preset.description}
                style={{ '--preset-color': preset.color }}
              >
                <span className="emoji">{preset.emoji}</span>
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* List Header (Sticky) */}
      {effectiveViewMode === 'list' && finalFilteredData.length > 0 && (
        <div className="list-header glass-panel" style={{ marginBottom: 0, borderRadius: '12px 12px 0 0' }}>
          <div style={{ flex: 1, minWidth: 0, paddingLeft: '0.5rem' }}>QUESTION</div>
          <div style={{ width: '200px', flexShrink: 0 }}>CATEGORY</div>
          <div style={{ width: '100px', flexShrink: 0, textAlign: 'center' }}>DIFFICULTY</div>
          <div style={{ width: '200px', flexShrink: 0, textAlign: 'right' }}>TYPE</div>
        </div>
      )}

      {/* Results */}
      <div className={`resources-grid ${effectiveViewMode === 'list' ? 'list-view' : ''}`}>
        {effectiveViewMode === 'list' && finalFilteredData.length > 0 && (
          <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', borderRadius: '0 0 12px 12px' }}>
            {finalFilteredData.map((item, index) => {
              const interviewFreq = getInterviewFrequency(item);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <Link
                    to={`/resource/${item.id}`}
                    className={`resource-card ${item.premium && !isPremium() ? 'is-premium-locked' : ''} ${isRead(item.id) ? 'is-read' : ''}`}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
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
                      <span className="meta-category">{CATEGORY_DISPLAY_NAMES[item.category] || item.category}</span>
                      {item.subcategory && (
                        <>
                          <span className="meta-separator">•</span>
                          <span className="meta-subcategory">{SUBCATEGORY_DISPLAY_NAMES[item.subcategory] || item.subcategory}</span>
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
                      {item.premium && (
                        <span className={`badge premium ${isPremium() ? 'unlocked' : ''}`}>
                          Premium
                        </span>
                      )}
                      {interviewFreq === 'critical' && (
                        <span className="badge interview-favorite" title="Frequently asked in interviews">
                          Interview Favorite
                        </span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {effectiveViewMode === 'grid' && finalFilteredData.length > 0 && finalFilteredData.map((item) => {
          const interviewFreq = getInterviewFrequency(item);
          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to={`/resource/${item.id}`}
                className={`resource-card glass-panel animated-card subtle ${item.premium && !isPremium() ? 'is-premium-locked' : ''} ${isRead(item.id) ? 'is-read' : ''}`}
              >
                <div className="card-header">
                  {isRead(item.id) && (
                    <span className="read-indicator" title="Completed">
                      <CheckCircle size={16} />
                    </span>
                  )}
                  {item.premium && (
                    <span className={`badge premium ${isPremium() ? 'unlocked' : ''}`}>
                      Premium
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
                  <span className="meta-category">{CATEGORY_DISPLAY_NAMES[item.category] || item.category}</span>
                  {item.subcategory && (
                    <>
                      <span className="meta-separator">•</span>
                      <span className="meta-subcategory">{SUBCATEGORY_DISPLAY_NAMES[item.subcategory] || item.subcategory}</span>
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

        {finalFilteredData.length === 0 && (
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
      {finalFilteredData.length > 0 && <AdUnit />}

      {/* Import all styles from original Library.jsx */}
      <style>{`
        .page-container {
          padding-top: 2rem;
        }

        .header-section {
          margin-bottom: 2rem;
          text-align: center;
        }

        .header-section h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: var(--text-muted);
        }

        .library-progress {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1rem;
          padding: 0.75rem 1.25rem;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.05));
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 12px;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        .library-progress-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .library-progress-info svg {
          color: #fbbf24;
        }

        .library-progress-percentage {
          font-weight: 700;
          color: var(--primary);
          margin-left: auto;
        }

        .library-progress-bar-container {
          height: 6px;
          background: var(--surface-hover);
          border-radius: 3px;
          overflow: hidden;
        }

        .library-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--primary), #ec4899);
          border-radius: 3px;
          transition: width 0.5s ease;
        }

        /* Quick Actions Bar */
        .quick-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.25rem;
          margin-bottom: 1.5rem;
          gap: 1rem;
        }

        .quick-action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, var(--primary), #ec4899);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .quick-action-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
        }

        .quick-stats {
          display: flex;
          gap: 0.75rem;
        }

        .stat-chip {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.75rem;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 20px;
          font-size: 0.8rem;
          color: #22c55e;
        }

        .stat-chip.premium-chip {
          background: rgba(139, 92, 246, 0.1);
          border-color: rgba(139, 92, 246, 0.2);
          color: #a78bfa;
        }

        /* Section Headers */
        .section-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          color: var(--primary);
        }

        .section-header h2 {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-main);
          margin: 0;
        }

        .section-badge {
          font-size: 0.7rem;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-weight: 600;
          margin-left: 0.5rem;
        }

        .section-badge.free-badge {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
        }

        .section-subtitle {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 1rem;
          margin-top: -0.5rem;
        }

        /* Start Here Section */
        .start-here-section {
          margin-bottom: 2rem;
        }

        .start-here-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .start-here-card {
          padding: 1rem;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          transition: all 0.2s;
          border-left: 3px solid var(--primary);
        }

        .start-here-card:hover {
          transform: translateY(-4px);
          border-color: var(--primary);
          background: var(--card-hover-bg);
        }

        .start-here-card.is-read {
          border-left-color: #22c55e;
          opacity: 0.8;
        }

        .start-here-number {
          position: absolute;
          top: -8px;
          left: -8px;
          width: 24px;
          height: 24px;
          background: var(--primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          color: white;
        }

        .start-here-card.is-read .start-here-number {
          background: #22c55e;
        }

        .card-read-badge {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          color: #22c55e;
        }

        .start-here-card h3 {
          font-size: 0.9rem;
          color: var(--text-main);
          margin: 0;
          line-height: 1.3;
        }

        .start-here-difficulty {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          align-self: flex-start;
        }

        .start-here-difficulty.easy {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
        }

        .start-here-difficulty.medium {
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
        }

        /* Learning Paths Section */
        .learning-paths-section {
          margin-bottom: 2rem;
        }

        .paths-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .path-card {
          padding: 1.25rem;
          transition: all 0.2s;
        }

        .path-card:hover {
          transform: translateY(-2px);
          border-color: var(--primary);
        }

        .path-card.completed {
          border-color: rgba(34, 197, 94, 0.3);
          background: rgba(34, 197, 94, 0.05);
        }

        .path-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .path-icon {
          color: var(--primary);
        }

        .path-card.completed .path-icon {
          color: #22c55e;
        }

        .path-header h3 {
          font-size: 0.95rem;
          margin: 0;
          flex: 1;
        }

        .path-complete-icon {
          color: #fbbf24;
        }

        .path-progress {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .path-progress-bar {
          flex: 1;
          height: 6px;
          background: var(--surface-hover);
          border-radius: 3px;
          overflow: hidden;
        }

        .path-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary), #ec4899);
          border-radius: 3px;
          transition: width 0.3s;
        }

        .path-card.completed .path-progress-fill {
          background: #22c55e;
        }

        .path-progress-text {
          font-size: 0.8rem;
          color: var(--text-muted);
          min-width: 30px;
        }

        .path-articles {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .path-article {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          padding: 0.25rem 0;
          transition: color 0.2s;
        }

        .path-article:hover {
          color: var(--primary);
        }

        .path-article.read {
          color: #22c55e;
        }

        .path-article.read:hover {
          color: #16a34a;
        }

        /* Category Progress Section */
        .category-progress-section {
          margin-bottom: 2rem;
        }

        .category-progress-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 0.75rem;
        }

        .category-progress-card {
          background: var(--surface-hover);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .category-progress-card:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
        }

        .category-progress-card.completed {
          border-color: rgba(34, 197, 94, 0.3);
          background: rgba(34, 197, 94, 0.05);
        }

        .cat-progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .cat-progress-label {
          font-size: 0.85rem;
          font-weight: 500;
        }

        .cat-progress-count {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .cat-progress-bar {
          height: 4px;
          background: var(--border-color);
          border-radius: 2px;
          overflow: hidden;
        }

        .cat-progress-fill {
          height: 100%;
          background: var(--primary);
          border-radius: 2px;
          transition: width 0.3s;
        }

        .category-progress-card.completed .cat-progress-fill {
          background: #22c55e;
        }

        .featured-section {
          margin-bottom: 2rem;
        }

        .featured-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          color: var(--primary);
        }

        .featured-header h2 {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-main);
          margin: 0;
        }

        .featured-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }

        .featured-card {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          transition: all 0.2s ease;
          position: relative;
        }

        .featured-card:hover {
          transform: translateY(-4px);
          border-color: var(--primary);
          background: var(--card-hover-bg);
        }

        .featured-card.is-read {
          border-color: rgba(34, 197, 94, 0.3);
        }

        .featured-read-badge {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          color: #22c55e;
        }

        .featured-difficulty {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          align-self: flex-start;
        }

        .featured-difficulty.easy {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
        }

        .featured-difficulty.medium {
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
        }

        .featured-difficulty.hard {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
        }

        .featured-card h3 {
          font-size: 0.95rem;
          color: var(--text-main);
          line-height: 1.3;
          margin: 0;
        }

        .featured-category {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .progress-stats {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 1rem;
          padding: 0.75rem 1rem;
          background: var(--surface-hover);
          border-radius: 8px;
          border: 1px solid var(--border-color);
          justify-content: center;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .stat-item svg {
          color: var(--primary);
        }

        .stat-separator {
          color: var(--text-muted);
          opacity: 0.5;
        }

        .stat-percentage {
          font-weight: 600;
          color: var(--primary);
        }

        .controls-section {
          padding: 1.25rem;
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          transition: all 0.3s ease;
          position: relative;
          z-index: 10;
        }

        .controls-section.is-sticky {
          position: sticky;
          top: 70px;
          background: var(--sticky-bg, rgba(17, 24, 39, 0.95));
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          border-color: var(--primary);
          z-index: 50;
        }

        :root.light .controls-section.is-sticky {
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .search-row {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        /* More Filters Button */
        .filter-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 1rem;
          background: var(--surface-hover, rgba(255,255,255,0.08));
          border: 1.5px solid var(--border-color);
          border-radius: 10px;
          color: var(--text-main);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .filter-btn:hover {
          border-color: var(--primary);
          background-color: var(--surface-color, rgba(255,255,255,0.12));
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.15);
        }

        .filter-btn.active {
          border-color: var(--primary);
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.1));
          color: var(--primary);
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.2);
        }

        .filter-btn .chevron {
          transition: transform 0.2s;
        }

        .filter-btn .chevron.rotated {
          transform: rotate(180deg);
        }

        /* Expanded Filters */
        .expanded-filters {
          display: flex;
          gap: 0.5rem;
          padding-top: 0.5rem;
          overflow: hidden;
        }

        /* Filter Presets */
        .filter-presets {
          padding: 1rem 0;
          margin-bottom: 1rem;
        }

        .preset-chips {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .preset-chip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;

          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 20px;

          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-main);

          cursor: pointer;
          transition: all 0.2s;
        }

        .preset-chip:hover {
          background: rgba(139, 92, 246, 0.2);
          border-color: var(--preset-color, rgba(139, 92, 246, 0.5));
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
        }

        .preset-chip .emoji {
          font-size: 1rem;
          line-height: 1;
        }

        /* Results Bar */
        .results-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.5rem;
          border-top: 1px solid var(--border-color);
        }

        .results-count {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .results-count strong {
          color: var(--text-main);
          font-weight: 600;
        }

        .clear-all-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.75rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 6px;
          color: #ef4444;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .clear-all-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.4);
        }

        .search-bar {
          position: relative;
          flex: 1;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .clear-search-btn {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.25rem;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .clear-search-btn:hover {
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.1);
        }

        .search-bar input {
          width: 100%;
          background: var(--input-bg, rgba(0,0,0,0.2));
          border: 1px solid var(--border-color);
          padding: 0.6rem 2.5rem 0.6rem 2.8rem;
          border-radius: 8px;
          color: var(--text-main);
          font-size: 0.95rem;
          outline: none;
          transition: all 0.2s;
        }

        .search-bar input::placeholder {
          color: var(--text-muted);
        }

        .search-bar input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px var(--primary-glow);
        }

        .view-toggle {
          display: flex;
          gap: 0.25rem;
          background: var(--input-bg, rgba(0,0,0,0.2));
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 0.25rem;
        }

        .view-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.4rem;
          border: none;
          background: transparent;
          color: var(--text-muted);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-btn:hover {
          color: var(--text-main);
          background: rgba(255,255,255,0.05);
        }

        .view-btn.active {
          color: var(--primary);
          background: rgba(139, 92, 246, 0.15);
        }

        .filter-dropdowns {
          display: flex;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .filter-select {
          background: var(--surface-hover, rgba(255,255,255,0.08));
          border: 1.5px solid var(--border-color);
          color: var(--text-main);
          padding: 0.6rem 1rem;
          padding-right: 2rem;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          outline: none;
          transition: all 0.2s;
          min-width: 110px;
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.6rem center;
          background-size: 14px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .filter-select:hover {
          border-color: var(--primary);
          background-color: var(--surface-color, rgba(255,255,255,0.12));
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.15);
        }

        .filter-select:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--primary-glow, rgba(139, 92, 246, 0.2));
        }

        .filter-select.active {
          border-color: var(--primary);
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.1));
          color: var(--text-main);
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.2);
        }

        .filter-select option {
          background: var(--bg-primary, #1a1a2e);
          color: var(--text-main);
          padding: 0.5rem;
        }

        .categories {
          display: flex;
          gap: 0.8rem;
          flex-wrap: wrap;
        }

        .category-pill {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(236, 72, 153, 0.05));
          border: 1.5px solid var(--border-color);
          color: var(--text-muted);
          padding: 0.7rem 1.4rem;
          border-radius: 16px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          white-space: nowrap;
          position: relative;
          overflow: hidden;
        }

        .category-pill .category-icon {
          color: var(--cat-color, var(--text-muted));
          transition: all 0.3s ease;
          flex-shrink: 0;
          width: 20px;
          height: 20px;
        }

        .category-pill::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, color-mix(in srgb, var(--cat-color) 15%, transparent), color-mix(in srgb, var(--cat-color) 5%, transparent));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .category-pill:hover {
          color: var(--text-main);
          border-color: var(--cat-color, var(--primary));
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 8px 24px color-mix(in srgb, var(--cat-color) 30%, transparent);
        }

        .category-pill:hover::before {
          opacity: 1;
        }

        .category-pill:hover .category-icon {
          transform: scale(1.2) rotate(5deg);
          color: var(--cat-color);
        }

        .category-pill.active {
          background: linear-gradient(135deg, var(--cat-color), color-mix(in srgb, var(--cat-color) 70%, #fff));
          border-color: transparent;
          color: white;
          font-weight: 600;
          box-shadow: 0 8px 28px color-mix(in srgb, var(--cat-color) 50%, transparent);
          transform: translateY(-4px) scale(1.08);
        }

        .category-pill.active .category-icon {
          color: white;
          transform: scale(1.25);
        }

        .category-pill.active::before {
          opacity: 0;
        }

        /* Category Wrapper for Dropdown */
        .category-wrapper {
          position: relative;
        }

        /* Floating Dropdown for Subcategories */
        .subcategories-dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          left: 0;
          z-index: 101;
          min-width: 220px;
          background: var(--bg-primary, #1a1a2e);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 0.5rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        :root.light .subcategories-dropdown {
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        }

        .dropdown-header {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--text-muted);
          padding: 0.5rem 0.75rem;
          letter-spacing: 0.05em;
        }

        .dropdown-item {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.65rem 0.75rem;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: var(--text-main);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .dropdown-item:hover {
          background: var(--surface-hover);
        }

        .dropdown-item.active {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.1));
          color: var(--primary);
          font-weight: 600;
        }

        .item-count {
          font-size: 0.75rem;
          padding: 0.2rem 0.5rem;
          background: var(--surface-hover);
          border-radius: 10px;
          color: var(--text-muted);
          font-weight: 600;
          min-width: 28px;
          text-align: center;
        }

        .dropdown-item.active .item-count {
          background: rgba(139, 92, 246, 0.2);
          color: var(--primary);
        }

        .resources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .resource-card {
          display: block;
          padding: 1.5rem;
          height: 100%;
        }

        /* Hover background handled by animated-card, just add card-hover-bg */
        .resource-card:hover {
          background: var(--card-hover-bg);
        }

        .card-header {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          position: relative;
          z-index: 1;
          flex-wrap: wrap;
          align-items: center;
        }

        .read-indicator {
          display: flex;
          align-items: center;
          color: #22c55e;
          margin-right: auto;
        }

        .badge {
          background: rgba(139, 92, 246, 0.1);
          color: var(--primary);
          font-size: 0.75rem;
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          text-transform: uppercase;
          font-weight: 600;
        }

        .badge.sub {
          background: rgba(148, 163, 184, 0.1);
          color: var(--text-muted);
        }

        .badge.difficulty {
          text-transform: capitalize;
        }

        .badge.difficulty.easy {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
        }

        .badge.difficulty.medium {
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
        }

        .badge.difficulty.hard {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
        }

        .badge.premium {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2));
          color: #a78bfa;
          border: 1px solid rgba(139, 92, 246, 0.3);
          padding: 0.2rem 0.4rem;
        }

        .badge.premium.unlocked {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
          border-color: rgba(34, 197, 94, 0.3);
        }

        .badge.interview-favorite {
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(249, 115, 22, 0.15));
          color: #fbbf24;
          border: 1px solid rgba(251, 191, 36, 0.25);
          font-size: 0.65rem;
          padding: 0.15rem 0.5rem;
        }

        .resource-card.is-premium-locked {
          border-color: rgba(139, 92, 246, 0.2);
        }

        .resource-card.is-premium-locked:hover {
          border-color: rgba(139, 92, 246, 0.5);
        }

        .resource-card.is-read {
          border-color: rgba(34, 197, 94, 0.2);
        }

        .resource-card h3 {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
          color: var(--text-main);
          line-height: 1.4;
          position: relative;
          z-index: 1;
        }

        /* Card Meta Info */
        .card-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
          position: relative;
          z-index: 1;
        }

        .meta-separator {
          opacity: 0.5;
        }

        .meta-time {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .card-description {
          color: var(--text-muted);
          font-size: 0.85rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 1rem;
          position: relative;
          z-index: 1;
          line-height: 1.5;
        }

        /* Category Selection Empty State */
        .select-category-state {
          padding: 4rem 2rem;
          text-align: center;
        }

        .select-category-content {
          max-width: 1000px;
          margin: 0 auto;
        }

        .select-category-icon {
          color: var(--primary);
          opacity: 0.5;
          margin-bottom: 1.5rem;
        }

        .select-category-content h2 {
          font-size: 1.75rem;
          color: var(--text-main);
          margin-bottom: 0.5rem;
        }

        .select-category-content p {
          color: var(--text-muted);
          font-size: 1rem;
          margin-bottom: 2.5rem;
        }

        .category-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.25rem;
        }

        .category-selection-card {
          padding: 2rem 1.5rem;
          text-align: center;
          border: 2px solid var(--border-color);
          background: var(--surface-color);
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .category-selection-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--cat-color), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .category-selection-card:hover::before {
          opacity: 0.1;
        }

        .category-selection-card:hover {
          border-color: var(--cat-color);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
        }

        .cat-card-icon {
          color: var(--cat-color);
          margin-bottom: 1rem;
        }

        .category-selection-card h3 {
          font-size: 1.125rem;
          color: var(--text-main);
          margin-bottom: 0.5rem;
        }

        .cat-card-count {
          color: var(--text-muted);
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .cat-card-progress {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .cat-card-progress-bar {
          height: 4px;
          background: var(--surface-hover);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .cat-card-progress-fill {
          height: 100%;
          background: var(--cat-color);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .cat-card-progress-text {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        /* List view - Compact table style */
        .list-view {
          display: block;
          gap: 0;
        }

        /* Table Header - Sticky below filters */
        .list-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 0.875rem 1.25rem;
          background: rgba(17, 24, 39, 0.95);
          border-bottom: 1px solid var(--border-color);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: sticky;
          top: 220px;
          z-index: 0;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        :root.light .list-header {
          background: rgba(255, 255, 255, 0.95);
        }

        /* Category Section */
        .category-section {
          border-bottom: 1px solid var(--border-color);
        }

        .category-section:last-child {
          border-bottom: none;
        }

        .category-section-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: rgba(139, 92, 246, 0.05);
          border-bottom: 1px solid var(--border-color);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .category-section-icon {
          display: flex;
          align-items: center;
          color: var(--primary);
        }

        .category-section-title {
          color: var(--text-main);
        }

        .category-section-count {
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 500;
        }

        .list-view .resource-card {
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          border-radius: 0;
          border: none;
          border-bottom: 1px solid var(--border-color);
          transition: background 0.2s ease;
          cursor: pointer;
        }

        .list-view .resource-card:last-child {
          border-bottom: none;
        }

        .list-view .card-header {
          margin-bottom: 0;
          flex-shrink: 0;
          min-width: fit-content;
        }

        .list-view .resource-card h3 {
          margin-bottom: 0;
          flex: 1;
          font-size: 0.95rem;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .list-view .card-meta {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          margin-bottom: 0;
          flex-shrink: 0;
          font-size: 0.8rem;
        }

        .list-view .card-description {
          display: none;
        }

        .list-view .card-footer {
          display: none;
        }

        .list-view .read-indicator {
          flex-shrink: 0;
        }

        .card-footer {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--primary);
          font-size: 0.85rem;
          font-weight: 500;
          margin-top: auto;
          position: relative;
          z-index: 1;
          transition: gap 0.2s ease;
        }

        .resource-card:hover .card-footer {
          gap: 0.5rem;
        }

        /* Empty State */
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .empty-state svg {
          color: var(--text-muted);
          opacity: 0.5;
        }

        .empty-state h3 {
          font-size: 1.25rem;
          color: var(--text-main);
          margin: 0;
        }

        .empty-state p {
          color: var(--text-muted);
          margin: 0;
        }

        .btn-reset {
          padding: 0.6rem 1.25rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 0.5rem;
        }

        .btn-reset:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
        }

        /* Mobile Responsive Styles */
        @media (max-width: 640px) {
          .page-container {
            padding-top: 1rem;
          }

          /* Make glass panels more opaque on mobile */
          .controls-section.glass-panel {
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
          }

          .controls-section.is-sticky {
            top: 65px;
            background: rgba(17, 24, 39, 0.98);
            backdrop-filter: blur(28px);
            -webkit-backdrop-filter: blur(28px);
          }

          :root.light .controls-section.is-sticky {
            background: rgba(255, 255, 255, 0.98);
          }

          .header-section h1 {
            font-size: 1.75rem;
          }

          .subtitle {
            font-size: 0.9rem;
          }

          .library-progress {
            padding: 0.6rem 1rem;
          }

          .library-progress-info {
            font-size: 0.8rem;
          }

          /* Quick Actions Mobile */
          .quick-actions {
            flex-direction: column;
            gap: 0.75rem;
            padding: 0.75rem;
          }

          .quick-action-btn {
            width: 100%;
            justify-content: center;
          }

          .quick-stats {
            width: 100%;
            justify-content: center;
          }

          /* Start Here Mobile */
          .start-here-section {
            margin-bottom: 1.5rem;
          }

          .start-here-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }

          .start-here-card h3 {
            font-size: 0.8rem;
          }

          .section-subtitle {
            font-size: 0.8rem;
          }

          /* Learning Paths Mobile */
          .learning-paths-section {
            margin-bottom: 1.5rem;
          }

          .paths-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }

          .path-card {
            padding: 1rem;
          }

          .path-header h3 {
            font-size: 0.9rem;
          }

          .path-article span {
            font-size: 0.75rem;
          }

          /* Category Progress Mobile */
          .category-progress-section {
            margin-bottom: 1.5rem;
          }

          .category-progress-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
          }

          .category-progress-card {
            padding: 0.6rem 0.75rem;
          }

          .cat-progress-label {
            font-size: 0.75rem;
          }

          .cat-progress-count {
            font-size: 0.7rem;
          }

          .featured-section {
            margin-bottom: 1.5rem;
          }

          .featured-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }

          .featured-card {
            padding: 0.75rem;
          }

          .featured-card h3 {
            font-size: 0.85rem;
          }

          .featured-difficulty {
            font-size: 0.65rem;
          }

          .controls-section {
            padding: 1rem;
            margin-bottom: 1.5rem;
            gap: 1rem;
          }

          .categories {
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 0.5rem;
            margin: 0 -1rem;
            padding-left: 1rem;
            padding-right: 1rem;
            -webkit-overflow-scrolling: touch;
            touch-action: pan-x;
            scrollbar-width: none;
          }

          .categories::-webkit-scrollbar {
            display: none;
          }

          .category-pill {
            flex-shrink: 0;
            padding: 0.4rem 0.85rem;
            font-size: 0.8rem;
            gap: 0.4rem;
          }

          .category-pill .category-icon {
            width: 14px;
            height: 14px;
          }

          .search-row {
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .search-bar {
            width: 100%;
            order: 1;
          }

          .filter-dropdowns {
            display: flex;
            gap: 0.5rem;
            order: 2;
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            padding-bottom: 2px;
          }

          .filter-dropdowns::-webkit-scrollbar {
            display: none;
          }

          .filter-select {
            min-width: 90px;
            font-size: 0.75rem;
            padding: 0.5rem 0.6rem;
            padding-right: 1.5rem;
            flex-shrink: 0;
            background-position: right 0.4rem center;
            background-size: 11px;
          }

          .filter-btn {
            padding: 0.5rem 0.65rem;
            font-size: 0.75rem;
            flex-shrink: 0;
            min-width: auto;
          }

          .filter-btn span {
            display: none;
          }

          /* Hide view toggle on mobile */
          .view-toggle {
            display: none;
          }

          .expanded-filters {
            flex-wrap: wrap;
          }

          .expanded-filters .filter-select {
            flex: 1;
            min-width: 120px;
          }

          .results-bar {
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .results-count {
            font-size: 0.8rem;
          }

          .clear-all-btn {
            font-size: 0.75rem;
          }

          /* Always hide description on mobile */
          .card-description {
            display: none;
          }

          .card-meta {
            display: none;
          }

          .resources-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }

          .resource-card {
            padding: 1rem;
          }

          .resource-card h3 {
            font-size: 1rem;
            margin-bottom: 0.35rem;
          }

          .card-header {
            margin-bottom: 0.35rem;
          }

          .card-footer {
            font-size: 0.8rem;
          }

          .empty-state {
            padding: 2rem 1rem;
          }

          .empty-state svg {
            width: 36px;
            height: 36px;
          }

          .empty-state h3 {
            font-size: 1.1rem;
          }

          .empty-state {
            padding: 2rem 1rem;
          }
        }

        /* Tablet Styles */
        @media (min-width: 641px) and (max-width: 900px) {
          .header-section h1 {
            font-size: 2rem;
          }

          .start-here-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .paths-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .resources-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default Library;
