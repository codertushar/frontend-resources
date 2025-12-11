import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Hash, FileText, ChevronRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Fuse from 'fuse.js';
import contentData from '../data/content.json';

const CATEGORIES = [
  { id: 'all', label: 'All Resources' },
  { id: 'js', label: 'JavaScript' },
  { id: 'dsa', label: 'DSA' },
  { id: 'ai', label: 'AI Engineering' },
  { id: 'machine-coding', label: 'Machine Coding' },
  { id: 'system-design', label: 'System Design' },
  { id: 'general', label: 'General' },
];

const fuseOptions = {
  keys: ['title', 'category', 'subcategory', 'content'],
  threshold: 0.3,
};

const Library = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  // Update URL when state changes (optional but good for sharing)
  useEffect(() => {
    const params = {};
    if (query) params.q = query;
    if (activeCategory !== 'all') params.category = activeCategory;
    setSearchParams(params, { replace: true });
  }, [query, activeCategory, setSearchParams]);

  const fuse = useMemo(() => new Fuse(contentData, fuseOptions), []);

  const filteredContent = useMemo(() => {
    let result = contentData;

    if (query) {
      result = fuse.search(query).map(r => r.item);
    }

    if (activeCategory !== 'all') {
      result = result.filter(item => item.category === activeCategory);
    }

    return result;
  }, [query, activeCategory, fuse]);

  return (
    <div className="container page-container">
      <div className="header-section">
        <h1 className="heading-gradient">Resource Library</h1>
        <p className="subtitle">Explore {contentData.length} curated resources to boost your skills.</p>
      </div>

      <div className="controls-section glass-panel">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search resources..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="categories">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="resources-grid">
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
              <Link to={`/resource/${encodeURIComponent(item.id)}`} className="resource-card glass-panel">
                <div className="card-header">
                  <span className="badge">{item.category}</span>
                  {item.subcategory && <span className="badge sub">{item.subcategory}</span>}
                </div>
                <h3>{item.title}</h3>
                <p>{item.content.substring(0, 100)}...</p>
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

        .controls-section {
          padding: 1.5rem;
          margin-bottom: 3rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .search-bar {
          position: relative;
          width: 100%;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-bar input {
          width: 100%;
          background: var(--input-bg, rgba(0,0,0,0.2));
          border: 1px solid var(--border-color);
          padding: 0.75rem 1rem 0.75rem 2.8rem;
          border-radius: 8px;
          color: var(--text-main);
          font-size: 1rem;
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

        .categories {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .category-pill {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-muted);
          padding: 0.4rem 1rem;
          border-radius: 99px;
          cursor: pointer;
          font-size: 0.9rem;
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

        .resource-card h3 {
          font-size: 1.2rem;
          margin-bottom: 0.75rem;
          color: var(--text-main);
          line-height: 1.4;
          position: relative;
          z-index: 1;
        }

        .resource-card p {
          color: var(--text-muted);
          font-size: 0.9rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
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
            scrollbar-width: none;
          }

          .categories::-webkit-scrollbar {
            display: none;
          }

          .category-pill {
            flex-shrink: 0;
            padding: 0.35rem 0.75rem;
            font-size: 0.8rem;
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
          }

          .resource-card p {
            font-size: 0.85rem;
            margin-bottom: 1rem;
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
