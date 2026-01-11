
import { useEffect, useState, useMemo, useRef, MouseEvent, RefObject } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// @ts-expect-error - react-syntax-highlighter lacks proper TypeScript declarations
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-expect-error - react-syntax-highlighter lacks proper TypeScript declarations
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ArrowRight, ChevronLeft, ChevronRight, BookOpen, Check, Circle, Crown, ChevronDown, ChevronUp, Folder, FileText, Home } from 'lucide-react';
import contentData from '../data/content.json';
import { useProgress } from '../context/ProgressContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';
import Paywall from '../components/Paywall';
import QuizSection, { parseQuizFromMarkdown, removeQuizFromContent } from '../components/QuizSection';
import SEO from '../components/SEO';
import AdUnit from '../components/AdUnit';
import { ArticleStructuredData, BreadcrumbStructuredData } from '../components/StructuredData';
import type { Article, CategoryInfo, BreadcrumbItem, QuizQuestion } from '../types';

const SUBCATEGORY_DISPLAY_NAMES: Record<string, string> = {
  'general-concepts': 'Core Concepts',
  'polyfills': 'Polyfills',
  'promises': 'Promises',
  'utils': 'Utilities',
  'design-patterns': 'Design Patterns',
  'arrays': 'Arrays',
  'general': 'General',
};

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  'js': 'JavaScript',
  'dsa': 'DSA',
  'ai': 'AI Engineering',
  'machine-coding': 'Machine Coding',
  'system-design': 'System Design',
  'general': 'Browser & Patterns',
};

const ResourceDetail = () => {
  const location = useLocation();
  const [premiumContent, setPremiumContent] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [premiumContentLoading, setPremiumContentLoading] = useState<boolean>(false);
  const [premiumContentError, setPremiumContentError] = useState<string | null>(null);
  const [showFullCategory, setShowFullCategory] = useState<boolean>(false);
  const sidebarRef: RefObject<HTMLElement | null> = useRef<HTMLElement>(null);
  const activeItemRef: RefObject<HTMLAnchorElement | null> = useRef<HTMLAnchorElement>(null);
  const { isRead, toggleRead, isInitialized } = useProgress();
  const { isPremium, fetchPremiumContent, isInitialized: subInitialized } = useSubscription();
  const { isSignedIn } = useAuth();

  // Extract and decode the resource ID from the pathname
  // Remove /resource/ prefix and trailing slash
  const resourceId: string = decodeURIComponent(
    location.pathname
      .replace('/resource/', '')
      .replace(/^\//, '')
      .replace(/\/$/, '')
  );

  // Get resource from content data
  const resource: Article | null = useMemo(() => {
    return (contentData as Article[]).find(r => r.id === resourceId) || null;
  }, [resourceId]);

  // Check if this is a category/folder path (not an individual article)
  const categoryInfo: CategoryInfo | null = useMemo(() => {
    if (resource) return null; // It's an article, not a category

    // Find all articles that start with this path
    const matchingArticles = (contentData as Article[]).filter(r =>
      r.id.startsWith(resourceId + '/') || r.id === resourceId
    );

    if (matchingArticles.length === 0) return null;

    // Get unique subcategories/subfolders at this level
    const subfolders = new Set<string>();
    const directArticles: Article[] = [];

    matchingArticles.forEach(article => {
      const remainingPath = article.id.slice(resourceId.length + 1);
      if (!remainingPath) {
        directArticles.push(article);
      } else {
        const nextPart = remainingPath.split('/')[0];
        if (remainingPath.includes('/')) {
          subfolders.add(nextPart);
        } else {
          directArticles.push(article);
        }
      }
    });

    // Determine category display name
    const pathParts = resourceId.split('/');
    const categoryName = pathParts[pathParts.length - 1];
    const displayName = CATEGORY_DISPLAY_NAMES[categoryName] ||
                       SUBCATEGORY_DISPLAY_NAMES[categoryName] ||
                       categoryName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    return {
      path: resourceId,
      displayName,
      subfolders: Array.from(subfolders).sort(),
      articles: directArticles,
      totalArticles: matchingArticles.length,
      pathParts
    };
  }, [resourceId, resource]);

  // Determine if we should show paywall
  const showPaywall: boolean = !!(resource?.premium && !isPremium());

  // Derive content directly - no loading state needed for initial content
  // Free articles: full content from JSON
  // Premium articles: preview from JSON, or fetched premium content if available
  const { content, quizQuestions } = useMemo((): { content: string; quizQuestions: QuizQuestion[] | null } => {
    if (!resource) return { content: '', quizQuestions: null };

    let rawContent: string;
    if (premiumContent) {
      rawContent = premiumContent;
    } else if (showPaywall) {
      // Generate preview - first ~300 words
      const fullContent = resource.fullContent || '';
      const lines = fullContent.split('\n');
      let wordCount = 0;
      const previewLines: string[] = [];
      for (const line of lines) {
        previewLines.push(line);
        wordCount += line.split(/\s+/).filter(w => w.length > 0).length;
        if (wordCount >= 300) break;
      }
      rawContent = previewLines.join('\n');
    } else {
      rawContent = resource.fullContent || '';
    }

    // Parse quiz from content and remove quiz block for markdown rendering
    const quiz = parseQuizFromMarkdown(rawContent) as QuizQuestion[] | null;
    const cleanContent = removeQuizFromContent(rawContent);

    return { content: cleanContent, quizQuestions: quiz };
  }, [resource, premiumContent, showPaywall]);

  // Derive loading state - only true when we have no content to show
  const loading: boolean = !resource;

  // Find current index and prev/next articles in the same category
  const categoryArticles: Article[] = useMemo(() => {
    if (!resource) return [];
    return (contentData as Article[]).filter(r => r.category === resource.category);
  }, [resource]);

  const currentIndex: number = categoryArticles.findIndex(r => r.id === resourceId);
  const prevArticle: Article | null = currentIndex > 0 ? categoryArticles[currentIndex - 1] : null;
  const nextArticle: Article | null = currentIndex < categoryArticles.length - 1 ? categoryArticles[currentIndex + 1] : null;

  // Get subcategory articles for sidebar
  const subcategoryArticles: Article[] = useMemo(() => {
    if (!resource || !resource.subcategory) return categoryArticles;
    return (contentData as Article[]).filter(r =>
      r.category === resource.category && r.subcategory === resource.subcategory
    );
  }, [resource, categoryArticles]);

  // Determine which articles to show in sidebar
  const sidebarArticles: Article[] = showFullCategory ? categoryArticles : subcategoryArticles;

  // Get related articles (same category or subcategory, excluding current)
  const relatedArticles: Article[] = useMemo(() => {
    if (!resource) return [];
    return (contentData as Article[])
      .filter(r =>
        r.id !== resourceId &&
        (r.category === resource.category ||
         (resource.subcategory && r.subcategory === resource.subcategory))
      )
      .slice(0, 3);
  }, [resource, resourceId]);

  // Reset premium content and sidebar state when resource changes
  useEffect(() => {
    setPremiumContent(null);
    setPremiumContentError(null);
    setShowFullCategory(false);
  }, [resourceId]);

  // Scroll to active article in sidebar
  useEffect(() => {
    if (activeItemRef.current && sidebarRef.current) {
      const sidebar = sidebarRef.current;
      const activeItem = activeItemRef.current;
      const sidebarRect = sidebar.getBoundingClientRect();
      const activeRect = activeItem.getBoundingClientRect();

      // Check if active item is outside visible area
      if (activeRect.top < sidebarRect.top || activeRect.bottom > sidebarRect.bottom) {
        activeItem.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }, [resourceId, sidebarArticles]);

  // For premium users, fetch full content after auth is ready
  useEffect(() => {
    if (!resource || !resource.premium || !subInitialized || !isPremium()) return;

    let cancelled = false;

    const loadPremiumContent = async (): Promise<void> => {
      try {
        const fullContent = await fetchPremiumContent(resource.id);
        if (!cancelled) {
          setPremiumContent(fullContent);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Error loading premium content:', error);
          setPremiumContentError((error as Error).message);
        }
      } finally {
        if (!cancelled) {
          setPremiumContentLoading(false);
        }
      }
    };

    setPremiumContentLoading(true);
    loadPremiumContent();

    return () => {
      cancelled = true;
    };
  }, [resource, subInitialized, isPremium, fetchPremiumContent]);

  useEffect(() => {
    if (resource) {
      // Update document title and meta tags for SEO during client-side navigation
      document.title = `${resource.title} | CrackFrontend`;

      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        const description = (resource.fullContent || '')
          .replace(/```[\s\S]*?```/g, '')
          .replace(/`([^`]+)`/g, '$1')
          .replace(/[#*_~]/g, '')
          .replace(/\n+/g, ' ')
          .trim()
          .substring(0, 160) + '...';
        metaDescription.setAttribute('content', description);
      }

      // Update Open Graph and Twitter tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      const ogUrl = document.querySelector('meta[property="og:url"]');
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      const canonical = document.querySelector('link[rel="canonical"]');

      const url = `https://crackfrontend.in/resource/${resource.id}`;
      const title = `${resource.title} | CrackFrontend`;
      const desc = (resource.fullContent || '')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/[#*_~]/g, '')
        .replace(/\n+/g, ' ')
        .trim()
        .substring(0, 160) + '...';

      if (ogTitle) ogTitle.setAttribute('content', title);
      if (ogDescription) ogDescription.setAttribute('content', desc);
      if (ogUrl) ogUrl.setAttribute('content', url);
      if (twitterTitle) twitterTitle.setAttribute('content', title);
      if (twitterDescription) twitterDescription.setAttribute('content', desc);
      if (canonical) canonical.setAttribute('href', url);
    }
  }, [resource]);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = (): void => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // If it's a category page, render the category view
  if (!resource && categoryInfo) {
    const categoryBreadcrumbs: BreadcrumbItem[] = [
      { name: 'Home', url: '/' },
      { name: 'Library', url: '/library' }
    ];

    // Build breadcrumb path
    let currentPath = '';
    categoryInfo.pathParts.forEach((part, index) => {
      currentPath += (index === 0 ? '' : '/') + part;
      const isLast = index === categoryInfo.pathParts.length - 1;
      categoryBreadcrumbs.push({
        name: CATEGORY_DISPLAY_NAMES[part] || SUBCATEGORY_DISPLAY_NAMES[part] || part,
        url: isLast ? null : `/resource/${currentPath}`
      });
    });

    return (
      <>
        <SEO
          title={`${categoryInfo.displayName} Resources`}
          description={`Browse ${categoryInfo.totalArticles} articles in ${categoryInfo.displayName}. Frontend interview preparation resources and tutorials.`}
          url={location.pathname}
          type="website"
        />
        <BreadcrumbStructuredData items={categoryBreadcrumbs} />

        <div className="container category-container">
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-item breadcrumb-home">
              <Home size={14} />
            </Link>
            <ChevronRight size={14} className="breadcrumb-chevron" />
            <Link to="/library" className="breadcrumb-item">Library</Link>
            {categoryInfo.pathParts.map((part, index) => {
              const pathUpTo = categoryInfo.pathParts.slice(0, index + 1).join('/');
              const isLast = index === categoryInfo.pathParts.length - 1;
              const displayName = CATEGORY_DISPLAY_NAMES[part] || SUBCATEGORY_DISPLAY_NAMES[part] || part;
              return (
                <span key={pathUpTo} className="breadcrumb-segment">
                  <ChevronRight size={14} className="breadcrumb-chevron" />
                  {isLast ? (
                    <span className="breadcrumb-item breadcrumb-current">
                      {displayName}
                    </span>
                  ) : (
                    <Link to={`/resource/${pathUpTo}`} className="breadcrumb-item">
                      {displayName}
                    </Link>
                  )}
                </span>
              );
            })}
          </nav>

          {/* Category Header */}
          <div className="category-header">
            <h1 className="category-title">
              <span className="title-text">{categoryInfo.displayName}</span>
            </h1>
            <p className="category-description">
              {categoryInfo.totalArticles} article{categoryInfo.totalArticles !== 1 ? 's' : ''} available
            </p>
          </div>

          {/* Subfolders */}
          {categoryInfo.subfolders.length > 0 && (
            <div className="category-section">
              <h2 className="section-title">
                <Folder size={20} />
                Subcategories
              </h2>
              <div className="subfolder-grid">
                {categoryInfo.subfolders.map(subfolder => {
                  const subfolderPath = `${resourceId}/${subfolder}`;
                  const articleCount = (contentData as Article[]).filter(r => r.id.startsWith(subfolderPath)).length;
                  const displayName = SUBCATEGORY_DISPLAY_NAMES[subfolder] ||
                                     CATEGORY_DISPLAY_NAMES[subfolder] ||
                                     subfolder.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                  return (
                    <Link
                      key={subfolder}
                      to={`/resource/${subfolderPath}`}
                      className="subfolder-card glass-panel"
                    >
                      <Folder size={24} className="subfolder-icon" />
                      <div className="subfolder-info">
                        <h3>{displayName}</h3>
                        <span className="subfolder-count">{articleCount} article{articleCount !== 1 ? 's' : ''}</span>
                      </div>
                      <ArrowRight size={16} className="subfolder-arrow" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Direct Articles */}
          {categoryInfo.articles.length > 0 && (
            <div className="category-section">
              <h2 className="section-title">
                <FileText size={20} />
                Articles
              </h2>
              <div className="articles-grid">
                {categoryInfo.articles.map(article => (
                  <Link
                    key={article.id}
                    to={`/resource/${article.id}`}
                    className="article-card glass-panel"
                  >
                    <div className="article-card-header">
                      {article.premium && (
                        <span className="article-premium">
                          <Crown size={12} />
                          Premium
                        </span>
                      )}
                      {article.difficulty && (
                        <span className={`article-difficulty ${article.difficulty}`}>
                          {article.difficulty}
                        </span>
                      )}
                    </div>
                    <h3 className="article-card-title">{article.title}</h3>
                    <p className="article-card-description">
                      {article.description || article.content?.substring(0, 100) + '...'}
                    </p>
                    <div className="article-card-footer">
                      <span className="read-time">{article.readTime} min read</span>
                      <span className="read-more">
                        Read Article <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <style>{`
          .category-container {
            max-width: 1000px;
            padding-top: 2rem;
            padding-bottom: 4rem;
          }

          .category-header {
            margin-bottom: 3rem;
            text-align: center;
          }

          .category-title {
            font-size: 3rem;
            font-weight: 800;
            margin-bottom: 1rem;
          }

          .category-title .title-text {
            background: linear-gradient(
              90deg,
              #06b6d4 0%,
              #3b82f6 20%,
              #8b5cf6 40%,
              #c084fc 50%,
              #8b5cf6 60%,
              #3b82f6 80%,
              #06b6d4 100%
            );
            background-size: 200% auto;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .category-description {
            color: var(--text-muted);
            font-size: 1.1rem;
          }

          .category-section {
            margin-bottom: 3rem;
          }

          .section-title {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            color: var(--text-main);
          }

          .section-title svg {
            color: var(--primary);
          }

          .subfolder-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1rem;
          }

          .subfolder-card {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1.25rem;
            transition: all 0.3s ease;
          }

          .subfolder-card:hover {
            transform: translateY(-3px);
            border-color: var(--primary);
            background: var(--card-hover-bg);
          }

          .subfolder-icon {
            color: var(--primary);
            flex-shrink: 0;
          }

          .subfolder-info {
            flex: 1;
          }

          .subfolder-info h3 {
            font-size: 1rem;
            font-weight: 600;
            color: var(--text-main);
            margin-bottom: 0.25rem;
          }

          .subfolder-count {
            font-size: 0.85rem;
            color: var(--text-muted);
          }

          .subfolder-arrow {
            color: var(--text-muted);
            transition: transform 0.2s;
          }

          .subfolder-card:hover .subfolder-arrow {
            transform: translateX(4px);
            color: var(--primary);
          }

          .articles-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
          }

          .article-card {
            display: flex;
            flex-direction: column;
            padding: 1.5rem;
            transition: all 0.3s ease;
          }

          .article-card:hover {
            transform: translateY(-4px);
            border-color: var(--primary);
            background: var(--card-hover-bg);
          }

          .article-card-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
          }

          .article-premium {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            font-size: 0.7rem;
            font-weight: 600;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2));
            color: #a78bfa;
          }

          .article-difficulty {
            font-size: 0.7rem;
            font-weight: 600;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            text-transform: capitalize;
          }

          .article-difficulty.easy {
            background: rgba(34, 197, 94, 0.15);
            color: #22c55e;
          }

          .article-difficulty.medium {
            background: rgba(245, 158, 11, 0.15);
            color: #f59e0b;
          }

          .article-difficulty.hard {
            background: rgba(239, 68, 68, 0.15);
            color: #ef4444;
          }

          .article-card-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--text-main);
            margin-bottom: 0.75rem;
            line-height: 1.4;
          }

          .article-card-description {
            font-size: 0.9rem;
            color: var(--text-muted);
            line-height: 1.5;
            flex: 1;
            margin-bottom: 1rem;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .article-card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 1rem;
            border-top: 1px solid var(--border-color);
          }

          .read-time {
            font-size: 0.8rem;
            color: var(--text-muted);
          }

          .read-more {
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
            color: var(--primary);
            font-size: 0.85rem;
            font-weight: 500;
          }

          @media (max-width: 768px) {
            .category-title {
              font-size: 2rem;
            }

            .subfolder-grid,
            .articles-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </>
    );
  }

  if (!resource) {
    return (
      <div className="container error-container">
        <h2>Resource not found</h2>
        <Link to="/library" className="btn-primary">Back to Library</Link>
      </div>
    );
  }

  // Generate breadcrumbs for structured data
  const breadcrumbItems: BreadcrumbItem[] = [
    { name: 'Home', url: '/' },
    { name: CATEGORY_DISPLAY_NAMES[resource.category] || resource.category, url: `/resource/${resource.category}` }
  ];

  if (resource.subcategory) {
    breadcrumbItems.push({
      name: SUBCATEGORY_DISPLAY_NAMES[resource.subcategory] || resource.subcategory,
      url: `/resource/${resource.category}/${resource.subcategory}`
    });
  }

  breadcrumbItems.push({
    name: resource.title,
    url: location.pathname
  });

  // Handle mark as read button click
  const handleToggleRead = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    toggleRead(resourceId);
  };

  return (
    <>
      <SEO
        title={resource.title}
        description={resource.description || `Learn about ${resource.title} in our comprehensive guide. ${resource.premium ? 'Premium content' : 'Free resource'} for frontend developers.`}
        url={location.pathname}
        type="article"
        keywords={`${resource.title}, ${resource.category}, frontend interview, ${resource.difficulty} level, ${resource.premium ? 'premium tutorial' : 'free tutorial'}`}
        article={{
          publishedTime: resource.date,
          modifiedTime: resource.date,
          tags: [resource.category, resource.subcategory, resource.difficulty].filter(Boolean)
        } as { publishedTime: string; modifiedTime: string; tags: string[] }}
      />

      <ArticleStructuredData
        title={resource.title}
        description={resource.description || `Comprehensive guide on ${resource.title}`}
        url={location.pathname}
        publishedDate={resource.date}
        modifiedDate={resource.date}
        category={CATEGORY_DISPLAY_NAMES[resource.category] || resource.category}
        difficulty={resource.difficulty}
        isPremium={resource.premium}
      />

      <BreadcrumbStructuredData items={breadcrumbItems} />

      {/* Reading Progress Bar */}
      <div className="reading-progress-container">
        <div
          className="reading-progress-bar"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="container detail-container-wrapper">
        {/* Sidebar Navigation */}
        <aside className="article-sidebar glass-panel" ref={sidebarRef}>
          <div className="sidebar-header">
            <div className="sidebar-title">
              <span className="sidebar-category">
                {CATEGORY_DISPLAY_NAMES[resource.category] || resource.category}
              </span>
              {resource.subcategory && !showFullCategory && (
                <span className="sidebar-subcategory">
                  {SUBCATEGORY_DISPLAY_NAMES[resource.subcategory] || resource.subcategory}
                </span>
              )}
            </div>
            {resource.subcategory && (
              <button
                className="sidebar-toggle"
                onClick={() => setShowFullCategory(!showFullCategory)}
                aria-label={showFullCategory ? 'Show subcategory only' : 'Show all in category'}
              >
                {showFullCategory ? (
                  <>
                    <ChevronUp size={14} />
                    <span>Less</span>
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} />
                    <span>All {categoryArticles.length}</span>
                  </>
                )}
              </button>
            )}
          </div>
          <div className="sidebar-list">
            {sidebarArticles.map((article) => {
              const isActive = article.id === resourceId;
              const articleRead = isInitialized && isRead(article.id);
              return (
                <Link
                  key={article.id}
                  to={`/resource/${article.id}`}
                  className={`sidebar-item ${isActive ? 'active' : ''} ${articleRead ? 'read' : ''}`}
                  ref={isActive ? activeItemRef : null}
                >
                  <div className="sidebar-item-content">
                    <span className="sidebar-item-title">{article.title}</span>
                    <div className="sidebar-item-meta">
                      {article.premium && (
                        <Crown size={12} className="sidebar-premium-icon" />
                      )}
                      {article.difficulty && (
                        <span className={`sidebar-difficulty ${article.difficulty}`}>
                          {article.difficulty}
                        </span>
                      )}
                      {articleRead && (
                        <Check size={12} className="sidebar-read-icon" />
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="sidebar-footer">
            <span className="sidebar-count">
              {sidebarArticles.findIndex(a => a.id === resourceId) + 1} of {sidebarArticles.length}
            </span>
          </div>
        </aside>

        {/* Main Content */}
        <div className="detail-main">
          {/* Breadcrumb Navigation */}
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-item breadcrumb-home">
              <Home size={14} />
            </Link>
            <ChevronRight size={14} className="breadcrumb-chevron" />
            <Link to="/library" className="breadcrumb-item">Library</Link>
            <ChevronRight size={14} className="breadcrumb-chevron" />
            <Link to={`/resource/${resource.category}`} className="breadcrumb-item">
              {CATEGORY_DISPLAY_NAMES[resource.category] || resource.category}
            </Link>
            {resource.subcategory && (
              <>
                <ChevronRight size={14} className="breadcrumb-chevron" />
                <Link to={`/resource/${resource.category}/${resource.subcategory}`} className="breadcrumb-item">
                  {SUBCATEGORY_DISPLAY_NAMES[resource.subcategory] || resource.subcategory}
                </Link>
              </>
            )}
            <ChevronRight size={14} className="breadcrumb-chevron" />
            <span className="breadcrumb-item breadcrumb-current breadcrumb-position">
              {currentIndex + 1} of {categoryArticles.length}
            </span>
          </nav>

      <motion.div
        className="article-header"
        key={resourceId}
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <h1 className="article-title">
          {(() => {
            // Extract leading emojis from title so they render with native colors
            const emojiRegex = /^([\p{Emoji_Presentation}\p{Extended_Pictographic}\s]+)/u;
            const match = resource.title.match(emojiRegex);
            if (match) {
              const emojis = match[1];
              const rest = resource.title.slice(emojis.length);
              return (
                <>
                  <span className="title-emoji">{emojis}</span>
                  <span className="title-text">{rest}</span>
                </>
              );
            }
            return <span className="title-text">{resource.title}</span>;
          })()}
        </h1>
        <div className="meta-tags">
          {resource.premium && (
            <span className="meta-tag premium">
              <Crown size={14} />
              Premium
            </span>
          )}
          <Link to={`/library?category=${resource.category}`} className="meta-tag category">
            {resource.category}
          </Link>
          {resource.subcategory && (
            <span className="meta-tag subcategory">{resource.subcategory}</span>
          )}
          {resource.difficulty && (
            <span className={`meta-tag difficulty ${resource.difficulty}`}>
              {resource.difficulty}
            </span>
          )}
          {isInitialized && isSignedIn && !showPaywall && (
            <button
              onClick={handleToggleRead}
              className={`btn-mark-read ${isRead(resourceId) ? 'read' : ''}`}
              aria-label={isRead(resourceId) ? 'Mark as unread' : 'Mark as read'}
              title={isRead(resourceId) ? 'Mark as unread' : 'Mark as read'}
            >
              {isRead(resourceId) ? (
                <>
                  <Check size={16} />
                  <span>Read</span>
                </>
              ) : (
                <>
                  <Circle size={16} />
                  <span>Mark as Read</span>
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>

      {/* Mobile Ad - shown for all users (AdUnit handles premium check internally) */}
      <div className="mobile-ad">
        <AdUnit slot="1909064105" responsive={true} />
      </div>

      <motion.div
        className={`article-content glass-panel ${showPaywall ? 'has-paywall' : ''}`}
        key={`content-${resourceId}`}
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1, ease: "easeOut" }}
      >
                {loading || premiumContentLoading ? (
          <div className="loading">Loading content...</div>
        ) : (
          <>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }: { node?: unknown; inline?: boolean; className?: string; children?: React.ReactNode }) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                },
                table({ node, children, ...props }: { node?: unknown; children?: React.ReactNode }) {
                  return (
                    <div className="table-wrapper">
                      <table {...props}>{children}</table>
                    </div>
                  )
                },
                img({ node, src, alt, ...props }: { node?: unknown; src?: string; alt?: string }) {
                  return (
                    <img
                      src={src}
                      alt={alt || 'Article image'}
                      loading="lazy"
                      {...props}
                    />
                  )
                }
              }}
            >
              {content}
            </ReactMarkdown>
            {showPaywall && <Paywall />}
            {premiumContentError && !showPaywall && (
              <div className="premium-error">
                Failed to load full content. Showing preview instead.
              </div>
            )}
            {/* Quiz Section - only show if quiz exists and not behind paywall */}
            {!showPaywall && quizQuestions && (
              <QuizSection questions={quizQuestions} />
            )}
          </>
        )}
      </motion.div>

      {/* Prev/Next Navigation */}
      {(prevArticle || nextArticle) && (
        <div className="article-nav">
          {prevArticle ? (
            <Link to={`/resource/${prevArticle.id}`} className="nav-link prev glass-panel">
              <ChevronLeft size={20} />
              <div className="nav-link-content">
                <span className="nav-label">Previous</span>
                <span className="nav-title">{prevArticle.title}</span>
              </div>
            </Link>
          ) : <div className="nav-spacer" />}

          {nextArticle ? (
            <Link to={`/resource/${nextArticle.id}`} className="nav-link next glass-panel">
              <div className="nav-link-content">
                <span className="nav-label">Next</span>
                <span className="nav-title">{nextArticle.title}</span>
              </div>
              <ChevronRight size={20} />
            </Link>
          ) : <div className="nav-spacer" />}
        </div>
      )}

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="related-section">
          <h2 className="related-title">
            <BookOpen size={20} />
            Continue Reading
          </h2>
          <div className="related-grid">
            {relatedArticles.map((article) => (
              <Link
                key={article.id}
                to={`/resource/${article.id}`}
                className="related-card glass-panel"
              >
                <div className="related-badge">{article.category}</div>
                <h3>{article.title}</h3>
                <p>{article.content.substring(0, 80)}...</p>
                <span className="related-link">
                  Read Article <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
        </div>{/* End detail-main */}

        {/* Left Rail Ad */}
        <aside className="rail-ad rail-ad-left">
          <AdUnit slot="1909064105" responsive={false} />
        </aside>

        {/* Right Rail Ad */}
        <aside className="rail-ad rail-ad-right">
          <AdUnit slot="1909064105" responsive={false} />
        </aside>

      <style>{`
        /* Reading Progress Bar */
        .reading-progress-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--surface-color);
          z-index: 1000;
          display: flex;
          align-items: center;
        }

        .reading-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--primary), #a78bfa);
          transition: width 0.1s ease-out;
          box-shadow: 0 0 10px var(--primary-glow);
        }

        /* Grid Layout Wrapper */
        .detail-container-wrapper {
          display: flex;
          gap: 1rem;
          padding-top: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          justify-content: center;
        }

        .detail-main {
          flex: 1;
          max-width: 850px;
          min-width: 0;
          margin-left: 280px;
        }

        /* Sidebar Styles */
        .article-sidebar {
          position: fixed;
          top: 100px;
          left: max(calc((100vw - 1200px) / 2), 1.5rem);
          width: 300px;
          height: calc(100vh - 120px);
          overflow-y: auto;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          z-index: 50;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
          gap: 0.5rem;
        }

        .sidebar-title {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .sidebar-category {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-main);
        }

        .sidebar-subcategory {
          font-size: 0.8rem;
          color: var(--primary);
        }

        .sidebar-toggle {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          background: var(--surface-color);
          border: 1px solid var(--border-color);
          padding: 0.35rem 0.6rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .sidebar-toggle:hover {
          color: var(--primary);
          border-color: var(--primary);
          background: rgba(139, 92, 246, 0.1);
        }

        .sidebar-list {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          flex: 1 1 auto;
          overflow-y: auto;
          margin: 0 -0.5rem;
          padding: 0 0.5rem;
          min-height: 100px;
        }

        .sidebar-item {
          display: block;
          padding: 0.65rem 0.75rem;
          border-radius: 8px;
          transition: all 0.2s;
          border-left: 3px solid transparent;
          text-decoration: none;
        }

        .sidebar-item:hover {
          background: var(--surface-hover);
        }

        .sidebar-item.active {
          background: rgba(139, 92, 246, 0.15);
          border-left-color: var(--primary);
        }

        .sidebar-item.read .sidebar-item-title {
          color: var(--text-muted);
        }

        .sidebar-item-content {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .sidebar-item-title {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-main);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .sidebar-item.active .sidebar-item-title {
          color: var(--primary);
        }

        .sidebar-item-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .sidebar-premium-icon {
          color: #a78bfa;
        }

        .sidebar-difficulty {
          font-size: 0.65rem;
          font-weight: 600;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          text-transform: capitalize;
        }

        .sidebar-difficulty.easy {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
        }

        .sidebar-difficulty.medium {
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
        }

        .sidebar-difficulty.hard {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
        }

        .sidebar-read-icon {
          color: #22c55e;
        }

        .sidebar-footer {
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
          flex-shrink: 0;
        }

        .sidebar-count {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        /* Custom scrollbar for sidebar */
        .article-sidebar::-webkit-scrollbar,
        .sidebar-list::-webkit-scrollbar {
          width: 4px;
        }

        .article-sidebar::-webkit-scrollbar-track,
        .sidebar-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .article-sidebar::-webkit-scrollbar-thumb,
        .sidebar-list::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 4px;
        }

        .article-sidebar::-webkit-scrollbar-thumb:hover,
        .sidebar-list::-webkit-scrollbar-thumb:hover {
          background: var(--text-muted);
        }

        .detail-container {
          padding-top: 2rem;
          max-width: 900px;
        }

        .article-header {
          margin-bottom: 3rem;
        }

        .article-title {
          font-size: 3rem;
          line-height: 1.2;
          font-weight: 800;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .article-title .title-text {
          background: linear-gradient(
            90deg,
            #06b6d4 0%,
            #3b82f6 20%,
            #8b5cf6 40%,
            #c084fc 50%,
            #8b5cf6 60%,
            #3b82f6 80%,
            #06b6d4 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: aurora-shimmer-article 5s ease-in-out infinite;
        }

        @keyframes aurora-shimmer-article {
          0%, 100% {
            background-position: 0% center;
            filter: brightness(1);
          }
          50% {
            background-position: 100% center;
            filter: brightness(1.2);
          }
        }

        .article-title .title-emoji {
          -webkit-text-fill-color: initial;
        }

        .meta-tags {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }

        .meta-tag {
          display: inline-flex;
          align-items: center;
          padding: 0.4rem 1rem;
          border-radius: 99px;
          font-size: 0.85rem;
          font-weight: 500;
          text-transform: capitalize;
          transition: all 0.2s;
        }

        .meta-tag.category {
          background: rgba(139, 92, 246, 0.15);
          color: var(--primary);
          border: 1px solid rgba(139, 92, 246, 0.3);
        }

        .meta-tag.category:hover {
          background: rgba(139, 92, 246, 0.25);
          border-color: var(--primary);
        }

        .meta-tag.subcategory {
          background: var(--surface-color);
          color: var(--text-muted);
          border: 1px solid var(--border-color);
        }

        .meta-tag.difficulty {
          font-weight: 600;
          text-transform: capitalize;
        }

        .meta-tag.difficulty.easy {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .meta-tag.difficulty.medium {
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .meta-tag.difficulty.hard {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .meta-tag.premium {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2));
          color: #a78bfa;
          border: 1px solid rgba(139, 92, 246, 0.4);
          font-weight: 600;
        }

        .btn-mark-read {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--surface-card);
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
          margin-left: auto;
        }

        .btn-mark-read:hover {
          background: var(--surface-hover);
          border-color: var(--primary);
          color: var(--text-main);
          transform: translateY(-1px);
        }

        .btn-mark-read.read {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
          border-color: rgba(34, 197, 94, 0.3);
        }

        .btn-mark-read.read:hover {
          background: rgba(34, 197, 94, 0.25);
          border-color: rgba(34, 197, 94, 0.5);
          transform: translateY(-1px);
        }

        .article-content {
          padding: 3rem;
          color: var(--text-main);
          font-size: 1.1rem;
          line-height: 1.8;
          overflow: visible;
          max-width: 100%;
          position: relative;
          isolation: isolate;
        }


        .article-content.has-paywall {
          padding-bottom: 1rem;
        }

        .premium-error {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin-top: 1rem;
          font-size: 0.9rem;
        }

        .article-content * {
          max-width: 100%;
        }

        .article-content pre {
          overflow-x: auto;
          overflow-y: hidden;
          max-width: 100%;
          -webkit-overflow-scrolling: touch;
          touch-action: manipulation;
          overscroll-behavior-x: contain;
        }

        .article-content pre > div {
          touch-action: manipulation;
        }

        .article-content code {
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        /* Markdown Styles */
        .article-content h1,
        .article-content h2,
        .article-content h3 {
          color: var(--text-main);
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .article-content h2 { font-size: 1.8rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; }
        .article-content h3 { font-size: 1.4rem; }

        .article-content p {
          margin-bottom: 1.5rem;
        }

        .article-content ul, .article-content ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }

        .article-content li {
          margin-bottom: 0.5rem;
        }

        .article-content a {
          color: var(--primary);
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        .article-content blockquote {
          border-left: 4px solid var(--primary);
          padding-left: 1.5rem;
          margin-left: 0;
          margin-bottom: 1.5rem;
          font-style: italic;
          color: var(--text-muted);
        }

        .article-content code {
          background: var(--code-bg);
          padding: 0.2em 0.4em;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 0.9em;
          color: var(--code-text);
        }

        .article-content pre code {
          background: transparent;
          padding: 0;
          color: inherit;
        }

        .article-content .table-wrapper {
          width: 100%;
          max-height: 600px;
          overflow: auto;
          margin-bottom: 2rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          -webkit-overflow-scrolling: touch;
          touch-action: auto;
          overscroll-behavior: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--border-color) transparent;
        }

        .article-content .table-wrapper::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .article-content .table-wrapper::-webkit-scrollbar-track {
          background: transparent;
        }

        .article-content .table-wrapper::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 4px;
        }

        .article-content .table-wrapper::-webkit-scrollbar-thumb:hover {
          background: var(--text-muted);
        }

        .article-content table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 0;
        }

        .article-content th, .article-content td {
          border: 1px solid var(--border-color);
          padding: 0.75rem;
          text-align: left;
          white-space: nowrap;
        }

        .article-content th {
          background: var(--surface-hover);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        /* Prev/Next Navigation */
        .article-nav {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-top: 3rem;
          width: 100%;
          max-width: 100%;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          transition: all 0.3s ease;
          min-width: 0;
        }

        .nav-link:hover {
          transform: translateY(-3px);
          background: var(--card-hover-bg);
          border-color: var(--primary);
        }

        .nav-link.prev {
          text-align: left;
          grid-column: 1;
        }

        .nav-link.next {
          text-align: right;
          justify-content: flex-end;
          grid-column: 2;
        }

        .nav-link svg {
          color: var(--primary);
          flex-shrink: 0;
        }

        .nav-link-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          overflow: hidden;
          min-width: 0;
          flex: 1;
        }

        .nav-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .nav-title {
          font-weight: 600;
          color: var(--text-main);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: normal;
          line-height: 1.4;
        }

        .nav-spacer {
          display: none;
        }

        /* Related Articles */
        .related-section {
          margin-top: 4rem;
          padding-top: 3rem;
          border-top: 1px solid var(--border-color);
        }

        .related-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.5rem;
          margin-bottom: 2rem;
          color: var(--text-main);
        }

        .related-title svg {
          color: var(--primary);
        }

        .related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .related-card {
          padding: 1.5rem;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .related-card:hover {
          transform: translateY(-4px);
          background: var(--card-hover-bg);
          border-color: var(--primary);
        }

        .related-badge {
          display: inline-block;
          background: rgba(139, 92, 246, 0.1);
          color: var(--primary);
          font-size: 0.7rem;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 0.75rem;
          width: fit-content;
        }

        .related-card h3 {
          font-size: 1rem;
          margin-bottom: 0.5rem;
          color: var(--text-main);
          line-height: 1.4;
        }

        .related-card p {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
          flex-grow: 1;
        }

        .related-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--primary);
          font-size: 0.85rem;
          font-weight: 500;
        }

        /* Rail Ads - Extreme left and right */
        .rail-ad {
          position: fixed;
          top: 120px;
          width: 160px;
          z-index: 40;
        }

        .rail-ad-left {
          left: 20px;
        }

        .rail-ad-right {
          right: 20px;
        }

        /* Mobile Ad - shown by default */
        .mobile-ad {
          display: block;
          margin: 2rem 0;
          padding: 1rem 0;
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
        }

        /* On large screens, hide mobile ad and show rail ads */
        @media (min-width: 1601px) {
          .mobile-ad {
            display: none;
          }
        }

        /* Hide rail ads on smaller screens */
        @media (max-width: 1600px) {
          .rail-ad {
            display: none;
          }
        }

        /* Hide left sidebar on smaller screens */
        @media (max-width: 1024px) {
          .article-sidebar {
            display: none;
          }

          .detail-main {
            margin-left: 0;
            max-width: 900px;
          }
        }

        @media (max-width: 768px) {
          .detail-container-wrapper {
            padding-top: 1rem;
            overflow-x: hidden;
          }

          .detail-container {
            padding-top: 1rem;
            overflow-x: hidden;
          }

          .article-title {
            font-size: 2rem;
            line-height: 1.3;
          }

          .article-content {
            padding: 1.5rem;
            font-size: 1rem;
          }

          .article-content h2 { font-size: 1.5rem; }
          .article-content h3 { font-size: 1.25rem; }

          .article-content pre {
            margin-left: -1.5rem;
            margin-right: -1.5rem;
            border-radius: 0;
            max-width: calc(100% + 3rem);
            overflow-x: auto;
            overflow-y: hidden;
            -webkit-overflow-scrolling: touch;
            touch-action: manipulation;
          }

          .article-content .table-wrapper {
            margin-left: 0;
            margin-right: 0;
            max-width: 100%;
            border-radius: 8px;
            max-height: 400px;
          }

          .article-content img {
            max-width: 100%;
            height: auto;
          }

          .article-nav {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .nav-link {
            max-width: 100%;
          }

          .nav-link.prev,
          .nav-link.next {
            grid-column: 1;
            text-align: left;
            justify-content: flex-start;
          }

          .related-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .article-title {
            font-size: 1.75rem;
          }

          .article-content {
            padding: 1rem;
            font-size: 0.9375rem;
          }

          .article-content h2 { font-size: 1.375rem; }
          .article-content h3 { font-size: 1.125rem; }

          .article-content pre {
            margin-left: -1rem;
            margin-right: -1rem;
            max-width: calc(100% + 2rem);
            -webkit-overflow-scrolling: touch;
            touch-action: manipulation;
          }

          .article-content .table-wrapper {
            margin-left: 0;
            margin-right: 0;
            max-width: 100%;
            max-height: 350px;
          }

          .related-section {
            margin-top: 3rem;
            padding-top: 2rem;
          }

          .related-title {
            font-size: 1.25rem;
          }
        }
      `}</style>
      </div>
    </>
  );
};

export default ResourceDetail;
