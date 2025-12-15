import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight, LayoutGrid, List, X, CheckCircle, Circle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Fuse from 'fuse.js';
import contentData from '../data/content.json';
import { useProgress } from '../context/ProgressContext';

const CATEGORIES = [
  { id: 'all', label: 'All Resources' },
  { id: 'js', label: 'JavaScript' },
  { id: 'dsa', label: 'DSA' },
  { id: 'ai', label: 'AI Engineering' },
  { id: 'machine-coding', label: 'Machine Coding' },
  { id: 'system-design', label: 'System Design' },
  { id: 'general', label: 'General' },
];

const DIFFICULTIES = [
  { id: 'all', label: 'Difficulty' },
  { id: 'easy', label: 'Easy', color: '#22c55e' },
  { id: 'medium', label: 'Medium', color: '#f59e0b' },
  { id: 'hard', label: 'Hard', color: '#ef4444' },
];

const SORT_OPTIONS = [
  { id: 'default', label: 'Newest First' },
  { id: 'difficulty-asc', label: 'Difficulty (Easy → Hard)' },
  { id: 'difficulty-desc', label: 'Difficulty (Hard → Easy)' },
  { id: 'title-asc', label: 'Title (A → Z)' },
  { id: 'title-desc', label: 'Title (Z → A)' },
];

const DIFFICULTY_ORDER = { easy: 1, medium: 2, hard: 3 };

// Popular tags to show in the filter UI
const POPULAR_TAGS = [
  'polyfill',
  'array-methods',
  'promises',
  'async',
  'functional',
  'react',
  'closures',
  'design-patterns',
  'system-design',
  'dsa',
  'recursion',
  'caching',
];

const fuseOptions = {
  keys: ['title', 'category', 'subcategory', 'content', 'difficulty', 'tags'],
  threshold: 0.3,
};

const Library = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isRead, getStats } = useProgress();

  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';
  const initialDifficulty = searchParams.get('difficulty') || 'all';
  const initialSort = searchParams.get('sort') || 'default';
  const initialTag = searchParams.get('tag') || 'all';

  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeDifficulty, setActiveDifficulty] = useState(initialDifficulty);
  const [sortBy, setSortBy] = useState(initialSort);
  const [activeTag, setActiveTag] = useState(initialTag);
  const [viewMode, setViewMode] = useState('detailed'); // 'detailed' or 'compact'

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
    setSearchParams(params, { replace: true });
  }, [query, activeCategory, activeDifficulty, sortBy, activeTag, setSearchParams]);

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
  }, [query, activeCategory, activeDifficulty, activeTag, sortBy, fuse]);

  return (
    <div className="container page-container">
      <div className="header-section">
        <h1 className="heading-gradient">Resource Library</h1>
        <p className="subtitle">Explore {contentData.length} curated resources to boost your skills.</p>
      </div>

      <div className="controls-section glass-panel">
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

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'detailed' ? 'active' : ''}`}
              onClick={() => setViewMode('detailed')}
              title="Detailed view"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              className={`view-btn ${viewMode === 'compact' ? 'active' : ''}`}
              onClick={() => setViewMode('compact')}
              title="Compact view"
            >
              <List size={18} />
            </button>
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
              value={activeTag}
              onChange={(e) => setActiveTag(e.target.value)}
              className={`filter-select ${activeTag !== 'all' ? 'active' : ''}`}
            >
              <option value="all">Tags</option>
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
          </div>
        </div>

        <div className="categories">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory(cat.id);
                setActiveDifficulty('all');
                setActiveTag('all');
                setSortBy('default');
                setQuery('');
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`resources-grid ${viewMode === 'compact' ? 'compact-view' : ''}`}>
        {filteredContent.length > 0 ? (
          filteredContent.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link to={`/resource/${item.id}`} className="resource-card glass-panel">
                <div className="card-header">
                  {isRead(item.id) && (
                    <span className="read-indicator" title="Read">
                      <CheckCircle size={16} />
                    </span>
                  )}
                  <span className="badge">{item.category}</span>
                  {item.subcategory && <span className="badge sub">{item.subcategory}</span>}
                  {item.difficulty && (
                    <span className={`badge difficulty ${item.difficulty}`}>
                      {item.difficulty}
                    </span>
                  )}
                </div>
                <h3>{item.title}</h3>
                <p className="card-description">{item.description || item.content.substring(0, 120)}</p>
                <div className="card-footer">
                  <span>Read More</span>
                  <ChevronRight size={16} />
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="empty-state">
            <p>No resources found matching your criteria.</p>
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
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .search-row {
          display: flex;
          gap: 0.75rem;
          align-items: center;
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
          background: var(--input-bg, rgba(0,0,0,0.2));
          border: 1px solid var(--border-color);
          color: var(--text-muted);
          padding: 0.6rem 0.75rem;
          border-radius: 8px;
          font-size: 0.85rem;
          cursor: pointer;
          outline: none;
          transition: all 0.2s;
          min-width: 100px;
        }

        .filter-select:hover {
          border-color: var(--text-muted);
        }

        .filter-select:focus {
          border-color: var(--primary);
        }

        .filter-select.active {
          border-color: var(--primary);
          color: var(--text-main);
        }

        .filter-select option {
          background: var(--bg-primary, #1a1a2e);
          color: var(--text-main);
        }

        .categories {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .category-pill {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-muted);
          padding: 0.35rem 0.9rem;
          border-radius: 99px;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .category-pill:hover {
          color: var(--text-main);
          border-color: var(--text-muted);
        }

        .category-pill.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
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
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .resource-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 50% 0%, var(--primary-glow), transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .resource-card:hover {
          transform: translateY(-4px);
          background: var(--card-hover-bg);
          border-color: var(--primary);
          box-shadow: 0 16px 32px -8px rgba(139, 92, 246, 0.2);
        }

        .resource-card:hover::before {
          opacity: 1;
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

        .resource-card h3 {
          font-size: 1.2rem;
          margin-bottom: 0.75rem;
          color: var(--text-main);
          line-height: 1.4;
          position: relative;
          z-index: 1;
        }

        .card-description {
          color: var(--text-muted);
          font-size: 0.9rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
          line-height: 1.5;
        }

        /* Compact view - hide descriptions */
        .compact-view .card-description {
          display: none;
        }

        .compact-view .resource-card {
          padding: 1rem 1.25rem;
        }

        .compact-view .resource-card h3 {
          margin-bottom: 0.5rem;
        }

        .compact-view .card-header {
          margin-bottom: 0.5rem;
        }

        .card-footer {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--primary);
          font-size: 0.9rem;
          font-weight: 500;
          margin-top: auto;
          position: relative;
          z-index: 1;
          transition: gap 0.2s ease;
        }

        .resource-card:hover .card-footer {
          gap: 0.5rem;
        }

        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem;
          color: var(--text-muted);
        }

        /* Mobile Responsive Styles */
        @media (max-width: 640px) {
          .page-container {
            padding-top: 1rem;
          }

          .header-section h1 {
            font-size: 1.75rem;
          }

          .subtitle {
            font-size: 0.9rem;
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
            padding: 0.3rem 0.7rem;
            font-size: 0.8rem;
          }

          .search-row {
            flex-direction: column;
            gap: 0.75rem;
          }

          /* Hide view toggle on mobile - always use compact */
          .view-toggle {
            display: none;
          }

          /* Always hide description on mobile */
          .card-description {
            display: none;
          }

          .filter-dropdowns {
            width: 100%;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0.5rem;
          }

          .filter-select {
            min-width: unset;
            font-size: 0.8rem;
            padding: 0.5rem;
          }

          .resources-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .resource-card {
            padding: 1rem;
          }

          .resource-card h3 {
            font-size: 1.05rem;
            margin-bottom: 0.5rem;
          }

          .card-header {
            margin-bottom: 0.5rem;
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

          .resources-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default Library;
