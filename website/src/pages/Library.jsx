import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, ChevronDown, LayoutGrid, List, X, CheckCircle, Crown, BookOpen, Trophy, Shuffle, Target, Clock, SlidersHorizontal, Layers, Code2, Binary, Brain, Terminal, Server, Globe } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import contentData from '../data/content.json';
import { useProgress } from '../context/ProgressContext';
import { useSubscription } from '../context/SubscriptionContext';

const CATEGORIES = [
  { id: 'all', label: 'All Resources', icon: Layers, color: '#8b5cf6' },
  { id: 'js', label: 'JavaScript', icon: Code2, color: '#f59e0b' },
  { id: 'dsa', label: 'DSA', icon: Binary, color: '#22c55e' },
  { id: 'ai', label: 'AI Engineering', icon: Brain, color: '#ec4899' },
  { id: 'machine-coding', label: 'Machine Coding', icon: Terminal, color: '#06b6d4' },
  { id: 'system-design', label: 'System Design', icon: Server, color: '#f97316' },
  { id: 'general', label: 'Browser & Patterns', icon: Globe, color: '#6366f1' },
];

// Display name mappings for clearer UI labels
const CATEGORY_DISPLAY_NAMES = {
  'general': 'Browser & Patterns',
  'js': 'JavaScript',
  'dsa': 'DSA',
  'ai': 'AI',
  'machine-coding': 'Machine Coding',
  'system-design': 'System Design',
};

const SUBCATEGORY_DISPLAY_NAMES = {
  'general-concepts': 'Core Concepts',
  'polyfills': 'Polyfills',
  'promises': 'Promises',
  'utils': 'Utilities',
  'design-patterns': 'Design Patterns',
  'arrays': 'Arrays',
  'general': 'General',
};

const DIFFICULTIES = [
  { id: 'all', label: 'Difficulty' },
  { id: 'easy', label: 'Easy', color: '#22c55e' },
  { id: 'medium', label: 'Medium', color: '#f59e0b' },
  { id: 'hard', label: 'Hard', color: '#ef4444' },
];

const ACCESS_OPTIONS = [
  { id: 'all', label: 'Pricing' },
  { id: 'free', label: 'Free' },
  { id: 'premium', label: 'Premium' },
];


// Map articles to interview frequency based on topic patterns
// Now more selective - only truly common interview topics get 'critical'
const getInterviewFrequency = (item) => {
  // 1. Frontmatter override takes priority
  if (item.interviewFrequency) {
    return item.interviewFrequency;
  }

  // 2. More selective auto-detection
  // Only the absolute core JS interview topics (the "big 5" that appear in almost every interview)
  const criticalTopics = ['closures', 'event_loop', 'hoisting'];
  // Must be an exact match or the primary topic, not just mentioned
  const criticalExactIds = [
    'js/general-concepts/closures',
    'js/general-concepts/event_loop',
    'js/general-concepts/hoisting',
    'js/general-concepts/this',
    'js/promises/promises',
    'js/general-concepts/prototype',
  ];

  const idLower = item.id.toLowerCase();

  // Exact ID match for truly critical topics
  if (criticalExactIds.some(id => idLower === id.toLowerCase())) {
    return 'critical';
  }

  // Check if the article is primarily about a critical topic (not just mentions it)
  // The topic must be in the filename/id, not just in content
  const fileName = idLower.split('/').pop();
  if (criticalTopics.some(topic => fileName === topic || fileName.startsWith(topic + '_'))) {
    return 'critical';
  }

  // Everything else uses 'common' or 'occasional' - no more auto-critical
  // Hard difficulty polyfills are common
  if ((item.subcategory === 'polyfills' || item.tags?.includes('polyfill')) && item.difficulty === 'hard') {
    return 'common';
  }

  // DSA hard is common
  if (item.category === 'dsa' && item.difficulty === 'hard') {
    return 'common';
  }

  // Everything else is occasional (no badge shown)
  return 'occasional';
};

const SORT_OPTIONS = [
  { id: 'default', label: 'Newest First' },
  { id: 'difficulty-asc', label: 'Easy → Hard' },
  { id: 'difficulty-desc', label: 'Hard → Easy' },
  { id: 'title-asc', label: 'A → Z' },
  { id: 'title-desc', label: 'Z → A' },
];


const DIFFICULTY_ORDER = { easy: 1, medium: 2, hard: 3 };

// Popular tags - consolidated for clarity
const POPULAR_TAGS = [
  'polyfill',
  'async',        // combines promises + async
  'closures',
  'functional',
  'react',
  'design-patterns',
  'caching',
  'recursion',
  'dom',
  'api',
];

const fuseOptions = {
  keys: ['title', 'category', 'subcategory', 'content', 'difficulty', 'tags'],
  threshold: 0.3,
};

// Start here - beginner friendly FREE articles
const START_HERE_IDS = [
  'js/general-concepts/function_vs_arrow_function',  // Easy, foundational
  'js/polyfills/arrays/filter',                       // Easy, common
  'dsa/30_day_dsa_guide_senior_frontend',            // Guide/roadmap
  'general/design-patterns/general',                  // Overview
];


const Library = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isRead, getStats } = useProgress();
  const { isPremium } = useSubscription();

  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';
  const initialDifficulty = searchParams.get('difficulty') || 'all';
  const initialSort = searchParams.get('sort') || 'default';
  const initialTag = searchParams.get('tag') || 'all';
  const initialAccess = searchParams.get('access') || 'all';

  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeDifficulty, setActiveDifficulty] = useState(initialDifficulty);
  const [sortBy, setSortBy] = useState(initialSort);
  const [activeTag, setActiveTag] = useState(initialTag);
  const [activeAccess, setActiveAccess] = useState(initialAccess);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [isFilterSticky, setIsFilterSticky] = useState(false);
  const filterRef = useRef(null);

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

  // Get progress stats
  const stats = getStats(contentData.length);

  // Update URL when state changes (optional but good for sharing)
  useEffect(() => {
    const params = {};
    if (query) params.q = query;
    if (activeCategory !== 'all') params.category = activeCategory;
    if (activeDifficulty !== 'all') params.difficulty = activeDifficulty;
    if (sortBy !== 'default') params.sort = sortBy;
    if (activeTag !== 'all') params.tag = activeTag;
    if (activeAccess !== 'all') params.access = activeAccess;
    setSearchParams(params, { replace: true });
  }, [query, activeCategory, activeDifficulty, sortBy, activeTag, activeAccess, setSearchParams]);

  const fuse = useMemo(() => new Fuse(contentData, fuseOptions), []);

  const filteredContent = useMemo(() => {
    let result = contentData;

    if (query) {
      result = fuse.search(query).map(r => r.item);
    }

    if (activeCategory !== 'all') {
      result = result.filter(item => item.category === activeCategory);
    }

    if (activeDifficulty !== 'all') {
      result = result.filter(item => item.difficulty === activeDifficulty);
    }

    if (activeTag !== 'all') {
      result = result.filter(item => item.tags?.includes(activeTag));
    }

    if (activeAccess !== 'all') {
      result = result.filter(item =>
        activeAccess === 'free' ? !item.premium : item.premium
      );
    }

    // Apply sorting
    if (sortBy !== 'default') {
      result = [...result].sort((a, b) => {
        switch (sortBy) {
          case 'difficulty-asc': {
            // First sort by difficulty level, then by difficultyScore within same level
            const levelDiff = (DIFFICULTY_ORDER[a.difficulty] || 2) - (DIFFICULTY_ORDER[b.difficulty] || 2);
            if (levelDiff !== 0) return levelDiff;
            // Within same difficulty level, sort by score (lower = easier first)
            return (a.difficultyScore || 50) - (b.difficultyScore || 50);
          }
          case 'difficulty-desc': {
            // First sort by difficulty level (hard first), then by difficultyScore within same level
            const levelDiff = (DIFFICULTY_ORDER[b.difficulty] || 2) - (DIFFICULTY_ORDER[a.difficulty] || 2);
            if (levelDiff !== 0) return levelDiff;
            // Within same difficulty level, sort by score (higher = harder first)
            return (b.difficultyScore || 50) - (a.difficultyScore || 50);
          }
          case 'title-asc':
            return a.title.localeCompare(b.title);
          case 'title-desc':
            return b.title.localeCompare(a.title);
          default:
            return 0;
        }
      });
    } else {
      // Default sorting: newest first (by publish date, falling back to createdAt)
      result = [...result].sort((a, b) => {
        // Prefer frontmatter 'date' (original publish date), fallback to file createdAt
        const dateA = a.date ? new Date(a.date) : (a.createdAt ? new Date(a.createdAt) : new Date(0));
        const dateB = b.date ? new Date(b.date) : (b.createdAt ? new Date(b.createdAt) : new Date(0));
        return dateB - dateA; // Newest first
      });
    }

    return result;
  }, [query, activeCategory, activeDifficulty, activeTag, activeAccess, sortBy, fuse]);

  // Get "Start Here" beginner articles
  const startHereArticles = useMemo(() => {
    return START_HERE_IDS
      .map(id => contentData.find(item => item.id === id))
      .filter(Boolean);
  }, []);

  // Calculate category-wise progress
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

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeCategory !== 'all') count++;
    if (activeDifficulty !== 'all') count++;
    if (activeTag !== 'all') count++;
    if (activeAccess !== 'all') count++;
    if (sortBy !== 'default') count++;
    if (query) count++;
    return count;
  }, [activeCategory, activeDifficulty, activeTag, activeAccess, sortBy, query]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setQuery('');
    setActiveCategory('all');
    setActiveDifficulty('all');
    setActiveTag('all');
    setActiveAccess('all');
    setSortBy('default');
  }, []);

  // Random article picker
  const getRandomUnreadArticle = useCallback(() => {
    const unreadArticles = contentData.filter(item => !isRead(item.id) && !item.premium);
    if (unreadArticles.length === 0) return null;
    return unreadArticles[Math.floor(Math.random() * unreadArticles.length)];
  }, [isRead]);

  const navigate = useNavigate();

  const handleSurpriseMe = () => {
    const randomArticle = getRandomUnreadArticle();
    if (randomArticle) {
      navigate(`/resource/${randomArticle.id}`);
    }
  };

  // Check if any filters are active
  const hasActiveFilters = query || activeCategory !== 'all' || activeDifficulty !== 'all' || activeTag !== 'all' || activeAccess !== 'all';

  return (
    <div className="container page-container">
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

          {/* Start Here Section - for newcomers */}
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
                      onClick={() => setActiveCategory(cat.id)}
                    >
                      <div className="cat-progress-header">
                        <span className="cat-progress-label">{cat.label}</span>
                        <span className="cat-progress-count">{progress.read}/{progress.total}</span>
                      </div>
                      <div className="cat-progress-bar">
                        <div
                          className="cat-progress-fill"
                          style={{ width: `${progress.percentage}%` }}
                        ></div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      <div ref={filterRef} className={`controls-section glass-panel ${isFilterSticky ? 'is-sticky' : ''}`}>
        {/* Categories - moved to top for better UX */}
        <div className="categories">
          {CATEGORIES.map(cat => {
            const IconComponent = cat.icon;
            return (
              <button
                key={cat.id}
                className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
                style={{ '--cat-color': cat.color }}
              >
                <IconComponent size={16} className="category-icon" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className="search-row">
          <div className="search-bar">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search resources..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                className="clear-search-btn"
                onClick={() => setQuery('')}
                title="Clear search"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="filter-dropdowns">
            <select
              value={activeDifficulty}
              onChange={(e) => setActiveDifficulty(e.target.value)}
              className={`filter-select ${activeDifficulty !== 'all' ? 'active' : ''}`}
            >
              {DIFFICULTIES.map(diff => (
                <option key={diff.id} value={diff.id}>
                  {diff.label}
                </option>
              ))}
            </select>

            <select
              value={activeAccess}
              onChange={(e) => setActiveAccess(e.target.value)}
              className={`filter-select ${activeAccess !== 'all' ? 'active' : ''}`}
            >
              {ACCESS_OPTIONS.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              className={`filter-btn more-filters ${showMoreFilters ? 'active' : ''}`}
              onClick={() => setShowMoreFilters(!showMoreFilters)}
            >
              <SlidersHorizontal size={16} />
              <span>More</span>
              <ChevronDown size={14} className={`chevron ${showMoreFilters ? 'rotated' : ''}`} />
            </button>
          </div>

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Expandable filters */}
        <AnimatePresence>
          {showMoreFilters && (
            <motion.div
              className="expanded-filters"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <select
                value={activeTag}
                onChange={(e) => setActiveTag(e.target.value)}
                className={`filter-select ${activeTag !== 'all' ? 'active' : ''}`}
              >
                <option value="all">All Tags</option>
                {POPULAR_TAGS.map(tag => (
                  <option key={tag} value={tag}>
                    #{tag}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`filter-select ${sortBy !== 'default' ? 'active' : ''}`}
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count and Clear All */}
        <div className="results-bar">
          <span className="results-count">
            Showing <strong>{filteredContent.length}</strong> of {contentData.length} resources
          </span>
          {activeFilterCount > 0 && (
            <button className="clear-all-btn" onClick={clearAllFilters}>
              <X size={14} />
              Clear {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
            </button>
          )}
        </div>
      </div>

      <div className={`resources-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
        {filteredContent.length > 0 ? (
          filteredContent.map((item) => {
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
          })
        ) : (
          <div className="empty-state">
            <Search size={48} />
            <h3>No resources found</h3>
            <p>Try adjusting your filters or search terms</p>
            <button className="btn-reset" onClick={clearAllFilters}>
              Clear all filters
            </button>
          </div>
        )}
      </div>

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
          background: linear-gradient(135deg, #8b5cf6, #ec4899, #06b6d4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          color: white;
        }
        
        :root.light .start-here-number {
          background: linear-gradient(135deg, #7c3aed, #db2777, #0891b2);
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
          background: linear-gradient(90deg, #8b5cf6, #ec4899, #06b6d4);
          border-radius: 2px;
          transition: width 0.3s;
        }
        
        :root.light .cat-progress-fill {
          background: linear-gradient(90deg, #7c3aed, #db2777, #0891b2);
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

        /* List view */
        .list-view {
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }

        .list-view .resource-card {
          padding: 1rem 1.25rem;
          display: grid;
          grid-template-columns: 1fr auto;
          grid-template-rows: auto auto;
          gap: 0.25rem 1rem;
        }

        .list-view .card-header {
          grid-column: 1 / -1;
          margin-bottom: 0.25rem;
        }

        .list-view .resource-card h3 {
          margin-bottom: 0;
          grid-column: 1;
          grid-row: 2;
        }

        .list-view .card-meta {
          display: none;
        }

        .list-view .card-description {
          display: none;
        }

        .list-view .card-footer {
          grid-column: 2;
          grid-row: 2;
          margin-top: 0;
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
          background: linear-gradient(135deg, #8b5cf6, #ec4899, #06b6d4, #ec4899, #8b5cf6);
          background-size: 300% 300%;
          animation: btn-gradient-shift 4s ease infinite;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 0.5rem;
        }
        
        :root.light .btn-reset {
          background: linear-gradient(135deg, #7c3aed, #db2777, #0891b2, #db2777, #7c3aed);
          background-size: 300% 300%;
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
            flex: 1;
          }

          .filter-select {
            min-width: unset;
            font-size: 0.8rem;
            padding: 0.5rem 0.75rem;
            padding-right: 1.75rem;
            flex: 1;
            background-position: right 0.5rem center;
            background-size: 12px;
          }

          .filter-btn {
            padding: 0.5rem 0.75rem;
            font-size: 0.8rem;
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
