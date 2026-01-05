import { useNavigate } from 'react-router-dom';
import {
  Code2, Binary, Brain, Terminal, Server, Globe,
  BookOpen, Sparkles, Clock, Zap, ChevronRight, Layers
} from 'lucide-react';
import contentData from '../data/content.json';

// Calculate counts from actual data
const getCounts = () => {
  const categoryCounts = contentData.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const jsSubcategories = contentData
    .filter(i => i.category === 'js')
    .reduce((acc, item) => {
      if (item.subcategory) {
        acc[item.subcategory] = (acc[item.subcategory] || 0) + 1;
      }
      return acc;
    }, {});

  return { categoryCounts, jsSubcategories, total: contentData.length };
};

const { categoryCounts, jsSubcategories, total } = getCounts();

// Menu structure
const MENU_COLUMNS = [
  {
    title: 'JavaScript',
    icon: Code2,
    color: '#f59e0b',
    items: [
      { label: 'All JavaScript', href: '/library?category=js', count: categoryCounts['js'] || 0, isMain: true },
      { label: 'Polyfills', href: '/library?category=js&subcategory=polyfills', count: jsSubcategories['polyfills'] || 0 },
      { label: 'Core Concepts', href: '/library?category=js&subcategory=general-concepts', count: jsSubcategories['general-concepts'] || 0 },
      { label: 'Utilities', href: '/library?category=js&subcategory=utils', count: jsSubcategories['utils'] || 0 },
      { label: 'Promises', href: '/library?category=js&subcategory=promises', count: jsSubcategories['promises'] || 0 },
    ]
  },
  {
    title: 'Interview Prep',
    icon: Zap,
    color: '#22c55e',
    items: [
      { label: 'DSA', href: '/library?category=dsa', count: categoryCounts['dsa'] || 0, icon: Binary },
      { label: 'Machine Coding', href: '/library?category=machine-coding', count: categoryCounts['machine-coding'] || 0, icon: Terminal },
      { label: 'System Design', href: '/library?category=system-design', count: categoryCounts['system-design'] || 0, icon: Server },
    ]
  },
  {
    title: 'Advanced',
    icon: Brain,
    color: '#ec4899',
    items: [
      { label: 'Browser & Patterns', href: '/library?category=general', count: categoryCounts['general'] || 0, icon: Globe },
      { label: 'AI Engineering', href: '/library?category=ai', count: categoryCounts['ai'] || 0, icon: Brain },
    ]
  }
];

const QUICK_LINKS = [
  { label: 'All Resources', href: '/library', icon: Layers },
  { label: 'New Articles', href: '/library?date=last-30', icon: Sparkles },
  { label: 'Quick Reads', href: '/library?sort=read-time-asc', icon: Clock },
];

const MegaMenu = ({ isOpen, onClose, onMouseEnter, onMouseLeave }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    onClose();
    navigate(href);
    window.scrollTo(0, 0);
  };

  return (
    <div
      className="mega-menu"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="mega-menu-container">
        {/* Main columns */}
        <div className="mega-menu-columns">
          {MENU_COLUMNS.map((column) => (
            <div key={column.title} className="mega-menu-column">
              <div className="column-header">
                <column.icon size={16} style={{ color: column.color }} />
                <span>{column.title}</span>
              </div>
              <ul className="column-items">
                {column.items.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className={`menu-item ${item.isMain ? 'main-item' : ''}`}
                      onClick={(e) => handleLinkClick(e, item.href)}
                    >
                      {item.icon && <item.icon size={14} className="item-icon" />}
                      <span className="item-label">{item.label}</span>
                      <span className="item-count">{item.count}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Quick links sidebar */}
        <div className="mega-menu-sidebar">
          <div className="sidebar-header">
            <BookOpen size={14} />
            <span>Quick Access</span>
          </div>
          <ul className="sidebar-links">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="sidebar-link"
                  onClick={(e) => handleLinkClick(e, link.href)}
                >
                  <link.icon size={14} />
                  <span>{link.label}</span>
                  <ChevronRight size={14} className="chevron" />
                </a>
              </li>
            ))}
          </ul>
          <div className="sidebar-stats">
            <span className="stat-total">{total} resources</span>
            <span className="stat-divider">•</span>
            <span className="stat-categories">6 categories</span>
          </div>
        </div>
      </div>

      <style>{`
        .mega-menu {
          position: absolute;
          top: calc(100% + 4px);
          left: 50%;
          transform: translateX(-50%);
          min-width: 760px;
          background: var(--surface-color);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          box-shadow:
            0 20px 40px rgba(0, 0, 0, 0.15),
            0 0 60px rgba(139, 92, 246, 0.1);
          z-index: 1000;
          animation: menuFadeIn 0.2s ease-out forwards;
          overflow: hidden;
          will-change: transform, opacity;
        }

        @keyframes menuFadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .mega-menu::before {
          content: '';
          position: absolute;
          top: -20px;
          left: 0;
          right: 0;
          height: 20px;
          background: transparent;
        }

        .mega-menu-container {
          display: flex;
          padding: 1.25rem;
          gap: 1rem;
        }

        .mega-menu-columns {
          display: flex;
          gap: 1.5rem;
          flex: 1;
        }

        .mega-menu-column {
          min-width: 160px;
        }

        .column-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          padding-bottom: 0.75rem;
          margin-bottom: 0.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .column-items {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          color: var(--text-main);
          font-size: 0.875rem;
          transition: all 0.15s ease;
          text-decoration: none;
        }

        .menu-item:hover {
          background: var(--surface-hover);
          color: var(--primary);
        }

        .menu-item.main-item {
          font-weight: 600;
          background: rgba(139, 92, 246, 0.08);
          border: 1px solid rgba(139, 92, 246, 0.15);
        }

        .menu-item.main-item:hover {
          background: rgba(139, 92, 246, 0.15);
          border-color: rgba(139, 92, 246, 0.3);
        }

        .item-icon {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .menu-item:hover .item-icon {
          color: var(--primary);
        }

        .item-label {
          flex: 1;
          white-space: nowrap;
        }

        .item-count {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-muted);
          background: var(--surface-hover);
          padding: 0.125rem 0.4rem;
          border-radius: 4px;
        }

        .menu-item:hover .item-count {
          background: var(--primary);
          color: white;
        }

        .mega-menu-sidebar {
          width: 160px;
          padding-left: 1rem;
          border-left: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          padding-bottom: 0.75rem;
          margin-bottom: 0.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .sidebar-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.625rem;
          border-radius: 8px;
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 500;
          transition: all 0.15s ease;
          text-decoration: none;
        }

        .sidebar-link:hover {
          background: var(--surface-hover);
          color: var(--primary);
        }

        .sidebar-link .chevron {
          margin-left: auto;
          opacity: 0;
          transform: translateX(-4px);
          transition: all 0.15s ease;
        }

        .sidebar-link:hover .chevron {
          opacity: 1;
          transform: translateX(0);
        }

        .sidebar-stats {
          font-size: 0.7rem;
          color: var(--text-muted);
          padding-top: 0.75rem;
          margin-top: auto;
          border-top: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .stat-divider {
          opacity: 0.5;
        }

        /* Light mode adjustments */
        :root.light .mega-menu {
          box-shadow:
            0 20px 40px rgba(0, 0, 0, 0.08),
            0 0 60px rgba(139, 92, 246, 0.05);
        }

        /* Mobile - make mega menu full width and scrollable */
        @media (max-width: 768px) {
          .mega-menu {
            position: fixed;
            top: 70px;
            left: 16px;
            right: 16px;
            transform: translateZ(0);
            min-width: unset;
            max-height: calc(100vh - 90px);
            overflow-y: auto;
            border-radius: 12px;
            animation: mobileMenuFadeIn 0.25s cubic-bezier(0.32, 0.72, 0, 1) forwards;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
          }

          @keyframes mobileMenuFadeIn {
            from {
              opacity: 0;
              transform: translateY(-12px) translateZ(0) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) translateZ(0) scale(1);
            }
          }

          .mega-menu::before {
            display: none;
          }

          .mega-menu-container {
            flex-direction: column;
            padding: 1rem;
            gap: 0.75rem;
          }

          .mega-menu-columns {
            flex-direction: column;
            gap: 1rem;
          }

          .mega-menu-column {
            min-width: unset;
          }

          .mega-menu-sidebar {
            width: 100%;
            padding-left: 0;
            padding-top: 0.75rem;
            border-left: none;
            border-top: 1px solid var(--border-color);
          }

          .sidebar-stats {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default MegaMenu;
