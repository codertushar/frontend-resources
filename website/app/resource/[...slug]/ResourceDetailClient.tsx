'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// @ts-expect-error - react-syntax-highlighter lacks proper TypeScript declarations
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-expect-error - react-syntax-highlighter lacks proper TypeScript declarations
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Crown, Home, Check, Circle, ChevronLeft, ArrowRight, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { useProgress } from '../../../src/context/ProgressContext';
import { useSubscription } from '../../../src/context/SubscriptionContext';
import { useAuth } from '../../../src/context/AuthContext';
import Paywall from '../../../src/components/Paywall';
import QuizSection, { parseQuizFromMarkdown, removeQuizFromContent } from '../../../src/components/QuizSection';
import AdUnit from '../../../src/components/AdUnit';
import type { Article } from '../../../src/types/content';

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  js: 'JavaScript',
  dsa: 'DSA',
  ai: 'AI Engineering',
  'machine-coding': 'Machine Coding',
  'system-design': 'System Design',
  general: 'Browser & Patterns',
};

const SUBCATEGORY_DISPLAY_NAMES: Record<string, string> = {
  'general-concepts': 'Core Concepts',
  'polyfills': 'Polyfills',
  'promises': 'Promises',
  'utils': 'Utilities',
  'design-patterns': 'Design Patterns',
  'arrays': 'Arrays',
  'general': 'General',
};

interface ResourceDetailClientProps {
  article: Article;
  previousArticle: Article | null;
  nextArticle: Article | null;
  relatedArticles: Article[];
  categoryArticles: Article[];
  subcategoryArticles: Article[];
  currentIndex: number;
  /** Access level determined by edge middleware: 'free' | 'premium' | 'paywall' */
  accessLevel?: string;
}

export function ResourceDetailClient({
  article,
  previousArticle,
  nextArticle,
  relatedArticles,
  categoryArticles,
  subcategoryArticles,
  currentIndex,
  accessLevel,
}: ResourceDetailClientProps) {
  const router = useRouter();
  const { isRead, toggleRead, isInitialized } = useProgress();
  const { isPremium, fetchPremiumContent } = useSubscription();
  const { isSignedIn } = useAuth();
  const [premiumContent, setPremiumContent] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [contentToDisplay, setContentToDisplay] = useState(
    article.fullContent || article.content
  );
  const [premiumContentLoading, setPremiumContentLoading] = useState(false);
  const [premiumContentError, setPremiumContentError] = useState<string | null>(null);
  const [showFullCategory, setShowFullCategory] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const activeItemRef = useRef<HTMLAnchorElement>(null);

  // Determine which articles to show in sidebar
  const sidebarArticles = showFullCategory ? categoryArticles : subcategoryArticles;

  const isReadArticle = isRead(article.id);
  const isPremiumArticle = article.premium;

  // Use edge-provided access level if available, otherwise fall back to client-side check
  // Edge middleware sets: 'free' (free article), 'premium' (user has access), 'paywall' (no access)
  const hasAccessFromEdge = accessLevel === 'free' || accessLevel === 'premium';
  const showPaywall = isPremiumArticle && !hasAccessFromEdge && !isPremium();

  // Parse quiz questions from markdown
  const quiz = parseQuizFromMarkdown(contentToDisplay);
  const contentWithoutQuiz = removeQuizFromContent(contentToDisplay);

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mark as read on mount
  useEffect(() => {
    if (!showPaywall && !isReadArticle) {
      toggleRead(article.id);
    }
  }, [article.id, showPaywall, isReadArticle, toggleRead]);

  // Fetch premium content if needed (only as fallback when edge auth didn't provide it)
  // With edge auth, content is already provided statically from the server
  useEffect(() => {
    // Skip if we already have full content from edge auth (hasFullContent means server provided it)
    if (article.hasFullContent) {
      return;
    }

    // Only fetch if user has premium access but content wasn't provided by edge
    // This is a fallback for cases where edge auth might have failed
    if (isPremiumArticle && isPremium() && !premiumContent && !hasAccessFromEdge) {
      setPremiumContentLoading(true);
      fetchPremiumContent(article.id)
        .then((content) => {
          if (content) {
            setPremiumContent(content);
            setContentToDisplay(content);
          }
        })
        .catch((error) => {
          console.error('Error loading premium content:', error);
          setPremiumContentError((error as Error).message);
        })
        .finally(() => {
          setPremiumContentLoading(false);
        });
    }
  }, [article.id, article.hasFullContent, isPremiumArticle, isPremium, premiumContent, fetchPremiumContent, hasAccessFromEdge]);

  const handleNavigate = useCallback(
    (articleId: string) => {
      router.push(`/resource/${articleId}`);
    },
    [router]
  );

  const handleToggleRead = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toggleRead(article.id);
  };

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="reading-progress-container">
        <div
          className="reading-progress-bar"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="container detail-container-wrapper">
        {/* Left Sidebar - Category Navigation */}
        <aside className="article-sidebar glass-panel" ref={sidebarRef}>
          <div className="sidebar-header">
            <div className="sidebar-title">
              <span className="sidebar-category">
                {CATEGORY_DISPLAY_NAMES[article.category] || article.category}
              </span>
              {article.subcategory && !showFullCategory && (
                <span className="sidebar-subcategory">
                  {SUBCATEGORY_DISPLAY_NAMES[article.subcategory] || article.subcategory}
                </span>
              )}
            </div>
            {article.subcategory && (
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
            {sidebarArticles.map((sidebarArticle) => {
              const isActive = sidebarArticle.id === article.id;
              const articleRead = isInitialized && isRead(sidebarArticle.id);
              return (
                <Link
                  key={sidebarArticle.id}
                  href={`/resource/${sidebarArticle.id}`}
                  className={`sidebar-item ${isActive ? 'active' : ''} ${articleRead ? 'read' : ''}`}
                  ref={isActive ? activeItemRef : null}
                >
                  <div className="sidebar-item-content">
                    <span className="sidebar-item-title">{sidebarArticle.title}</span>
                    <div className="sidebar-item-meta">
                      {sidebarArticle.premium && (
                        <Crown size={12} className="sidebar-premium-icon" />
                      )}
                      {sidebarArticle.difficulty && (
                        <span className={`sidebar-difficulty ${sidebarArticle.difficulty}`}>
                          {sidebarArticle.difficulty}
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
              {sidebarArticles.findIndex(a => a.id === article.id) + 1} of {sidebarArticles.length}
            </span>
          </div>
        </aside>

        {/* Main Content */}
        <div className="detail-main">
          {/* Breadcrumb Navigation */}
          <nav className="breadcrumb">
            <a href="/" className="breadcrumb-item breadcrumb-home">
              <Home size={14} />
            </a>
            <ChevronRight size={14} className="breadcrumb-chevron" />
            <a href="/library" className="breadcrumb-item">Library</a>
            <ChevronRight size={14} className="breadcrumb-chevron" />
            <a href={`/resource/${article.category}`} className="breadcrumb-item">
              {CATEGORY_DISPLAY_NAMES[article.category] || article.category}
            </a>
            {article.subcategory && (
              <>
                <ChevronRight size={14} className="breadcrumb-chevron" />
                <a href={`/resource/${article.category}/${article.subcategory}`} className="breadcrumb-item">
                  {SUBCATEGORY_DISPLAY_NAMES[article.subcategory] || article.subcategory}
                </a>
              </>
            )}
            <ChevronRight size={14} className="breadcrumb-chevron" />
            <span className="breadcrumb-item breadcrumb-current breadcrumb-position">
              {currentIndex + 1} of {categoryArticles.length}
            </span>
          </nav>

          <motion.div
            className="article-header"
            key={article.id}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <h1 className="article-title">
              {(() => {
                // Extract leading emojis from title so they render with native colors
                const emojiRegex = /^([\p{Emoji_Presentation}\p{Extended_Pictographic}\s]+)/u;
                const match = article.title.match(emojiRegex);
                if (match) {
                  const emojis = match[1];
                  const rest = article.title.slice(emojis.length);
                  return (
                    <>
                      <span className="title-emoji">{emojis}</span>
                      <span className="title-text">{rest}</span>
                    </>
                  );
                }
                return <span className="title-text">{article.title}</span>;
              })()}
            </h1>
            <div className="meta-tags">
              {article.premium && (
                <span className="meta-tag premium">
                  <Crown size={14} />
                  Premium
                </span>
              )}
              <a href={`/library?category=${article.category}`} className="meta-tag category">
                {article.category}
              </a>
              {article.subcategory && (
                <span className="meta-tag subcategory">{article.subcategory}</span>
              )}
              {article.difficulty && (
                <span className={`meta-tag difficulty ${article.difficulty}`}>
                  {article.difficulty}
                </span>
              )}
              {isInitialized && isSignedIn && !showPaywall && (
                <button
                  onClick={handleToggleRead}
                  className={`btn-mark-read ${isReadArticle ? 'read' : ''}`}
                  aria-label={isReadArticle ? 'Mark as unread' : 'Mark as read'}
                  title={isReadArticle ? 'Mark as unread' : 'Mark as read'}
                >
                  {isReadArticle ? (
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
            key={`content-${article.id}`}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1, ease: "easeOut" }}
          >
            {premiumContentLoading ? (
              <div className="loading">Loading content...</div>
            ) : (
              <>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
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
                      );
                    },
                    table({ node, children, ...props }: any) {
                      return (
                        <div className="table-wrapper">
                          <table {...props}>{children}</table>
                        </div>
                      );
                    },
                    img({ node, src, alt, ...props }: any) {
                      return (
                        <img
                          src={src}
                          alt={alt || 'Article image'}
                          loading="lazy"
                          {...props}
                        />
                      );
                    }
                  }}
                >
                  {contentWithoutQuiz}
                </ReactMarkdown>
                {showPaywall && <Paywall />}
                {premiumContentError && !showPaywall && (
                  <div className="premium-error">
                    Failed to load full content. Showing preview instead.
                  </div>
                )}
                {/* Quiz Section - only show if quiz exists and not behind paywall */}
                {!showPaywall && quiz && quiz.length > 0 && (
                  <QuizSection questions={quiz} />
                )}
              </>
            )}
          </motion.div>

          {/* Prev/Next Navigation */}
          {(previousArticle || nextArticle) && (
            <div className="article-nav">
              {previousArticle ? (
                <button
                  onClick={() => handleNavigate(previousArticle.id)}
                  className="nav-link prev glass-panel"
                >
                  <ChevronLeft size={20} />
                  <div className="nav-link-content">
                    <span className="nav-label">Previous</span>
                    <span className="nav-title">{previousArticle.title}</span>
                  </div>
                </button>
              ) : <div className="nav-spacer" />}

              {nextArticle ? (
                <button
                  onClick={() => handleNavigate(nextArticle.id)}
                  className="nav-link next glass-panel"
                >
                  <div className="nav-link-content">
                    <span className="nav-label">Next</span>
                    <span className="nav-title">{nextArticle.title}</span>
                  </div>
                  <ChevronRight size={20} />
                </button>
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
                {relatedArticles.map((relatedArticle) => (
                  <button
                    key={relatedArticle.id}
                    onClick={() => handleNavigate(relatedArticle.id)}
                    className="related-card glass-panel"
                  >
                    <div className="related-badge">{relatedArticle.category}</div>
                    <h3>{relatedArticle.title}</h3>
                    <p>{relatedArticle.content.substring(0, 80)}...</p>
                    <span className="related-link">
                      Read Article <ArrowRight size={14} />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

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
          gap: 2rem;
          padding-top: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          align-items: flex-start;
        }

        .detail-main {
          flex: 1;
          max-width: 900px;
          min-width: 0;
        }

        /* Article Header */
        .article-header {
          margin-bottom: 2.5rem;
        }

        .article-title {
          font-size: 2.75rem;
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 1.25rem;
          color: var(--text-main);
          letter-spacing: -0.02em;
        }

        .title-emoji {
          margin-right: 0.5rem;
          -webkit-text-fill-color: initial;
        }

        .title-text {
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

        .meta-tags {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .meta-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.9rem;
          background: var(--surface-color);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-muted);
          transition: all 0.2s ease;
          text-decoration: none;
          cursor: pointer;
        }

        .meta-tag:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: var(--surface-hover);
        }

        .meta-tag.premium {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.15));
          border-color: rgba(139, 92, 246, 0.3);
          color: #a78bfa;
        }

        .meta-tag.difficulty {
          text-transform: capitalize;
        }

        .meta-tag.difficulty.easy {
          background: rgba(34, 197, 94, 0.1);
          border-color: rgba(34, 197, 94, 0.3);
          color: #22c55e;
        }

        .meta-tag.difficulty.medium {
          background: rgba(245, 158, 11, 0.1);
          border-color: rgba(245, 158, 11, 0.3);
          color: #f59e0b;
        }

        .meta-tag.difficulty.hard {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }

        .btn-mark-read {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.9rem;
          background: var(--surface-color);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-mark-read:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: var(--surface-hover);
        }

        .btn-mark-read.read {
          background: rgba(34, 197, 94, 0.1);
          border-color: rgba(34, 197, 94, 0.3);
          color: #22c55e;
        }

        /* Mobile Ad */
        .mobile-ad {
          margin-bottom: 2rem;
        }

        /* Article Content - Technical article styling (like Dev.to, CSS-Tricks) */
        .article-content {
          padding: 2.5rem;
          margin-bottom: 2rem;
          position: relative;
          font-family: var(--font-sans);
          font-size: 1.0625rem;
          line-height: 1.75;
          font-weight: 400;
          color: var(--text-main);
          -webkit-font-smoothing: antialiased;
        }

        .article-content.has-paywall {
          padding-bottom: 0;
        }

        /* Blockquote / Info Box Styling */
        .article-content blockquote {
          margin: 1.5rem 0;
          padding: 1.5rem 2rem;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(236, 72, 153, 0.05));
          border-left: 4px solid var(--primary);
          border-radius: 0 12px 12px 0;
          font-style: italic;
        }

        .article-content blockquote p {
          margin: 0;
          color: var(--text-main);
        }

        .article-content blockquote strong {
          color: var(--primary);
          font-style: normal;
        }

        /* Headings in article content */
        .article-content h1,
        .article-content h2,
        .article-content h3,
        .article-content h4,
        .article-content h5,
        .article-content h6 {
          font-family: var(--font-sans);
          letter-spacing: -0.02em;
        }

        .article-content h2 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          color: var(--text-main);
          line-height: 1.3;
        }

        .article-content h3 {
          font-size: 1.35rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          color: var(--text-main);
          line-height: 1.4;
        }

        .article-content h4 {
          font-size: 1.15rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          color: var(--text-main);
        }

        .article-content p {
          margin-bottom: 1rem;
          line-height: 1.7;
        }

        .article-content strong {
          font-weight: 600;
          color: var(--text-main);
        }

        .article-content ul, .article-content ol {
          margin-bottom: 1rem;
          padding-left: 2rem;
        }

        .article-content ul {
          list-style-type: disc;
        }

        .article-content ol {
          list-style-type: decimal;
        }

        .article-content li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
          display: list-item;
        }

        .article-content li::marker {
          color: var(--primary);
          font-weight: 600;
        }

        /* Code - use monospace font */
        .article-content code,
        .article-content pre {
          font-family: var(--font-mono);
        }

        .article-content code:not(pre code) {
          background: var(--surface-hover);
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-size: 0.85em;
          color: #e879f9;
        }

        /* Table Styles */
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
          padding: 0.75rem 1rem;
          text-align: left;
        }

        .article-content th {
          background: var(--surface-hover);
          font-weight: 600;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .article-content td {
          background: var(--surface-color);
        }

        .article-content tr:hover td {
          background: var(--surface-hover);
        }

        .loading {
          text-align: center;
          padding: 3rem;
          color: var(--text-muted);
        }

        .premium-error {
          padding: 1rem;
          margin-top: 1rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          color: #ef4444;
          text-align: center;
        }

        .table-wrapper {
          overflow-x: auto;
          margin: 1.5rem 0;
        }

        /* Navigation Links */
        .article-nav {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
          text-align: left;
          width: 100%;
        }

        .nav-link:hover {
          transform: translateY(-3px);
          border-color: var(--primary);
          background: var(--card-hover-bg);
        }

        .nav-link.prev {
          justify-content: flex-start;
        }

        .nav-link.next {
          justify-content: flex-end;
        }

        .nav-link-content {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .nav-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .nav-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-main);
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .nav-spacer {
          min-width: 0;
        }

        /* Related Articles */
        .related-section {
          margin-bottom: 3rem;
        }

        .related-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: var(--text-main);
        }

        .related-title svg {
          color: var(--primary);
        }

        .related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.25rem;
        }

        .related-card {
          padding: 1.5rem;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          text-align: left;
          border: none;
          cursor: pointer;
          width: 100%;
        }

        .related-card:hover {
          transform: translateY(-4px);
          border-color: var(--primary);
          background: var(--card-hover-bg);
        }

        .related-badge {
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.25rem 0.6rem;
          background: rgba(139, 92, 246, 0.1);
          color: var(--primary);
          border-radius: 4px;
          align-self: flex-start;
          text-transform: capitalize;
        }

        .related-card h3 {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-main);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .related-card p {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.5;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .related-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--primary);
          font-size: 0.85rem;
          font-weight: 500;
        }

        /* Article Sidebar */
        .article-sidebar {
          position: sticky;
          top: 100px;
          width: 300px;
          max-height: calc(100vh - 120px);
          overflow-y: auto;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          align-self: start;
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
          font-weight: 600;
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
          padding: 0.1rem 0.4rem;
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
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .sidebar-count {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

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

        /* Responsive */
        @media (max-width: 1200px) {
          .article-sidebar {
            display: none;
          }

          .detail-main {
            margin-left: 0;
            max-width: 900px;
          }
        }

        @media (max-width: 768px) {
          .article-title {
            font-size: 2rem;
            line-height: 1.3;
          }

          .article-content {
            padding: 1.5rem;
            font-size: 1rem;
          }

          .article-content h2 {
            font-size: 1.5rem;
          }

          .article-content h3 {
            font-size: 1.25rem;
          }

          .article-content pre {
            margin-left: -1.5rem;
            margin-right: -1.5rem;
            border-radius: 0;
            max-width: calc(100% + 3rem);
            overflow-x: auto;
          }

          .article-content .table-wrapper {
            margin-left: 0;
            margin-right: 0;
            max-width: 100%;
            border-radius: 8px;
            max-height: 400px;
          }

          .article-nav {
            grid-template-columns: 1fr;
          }

          .nav-link {
            padding: 1rem;
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

          .meta-tags {
            gap: 0.5rem;
          }

          .meta-tag {
            padding: 0.35rem 0.75rem;
            font-size: 0.8rem;
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

          .article-content h2 {
            font-size: 1.375rem;
          }

          .article-content h3 {
            font-size: 1.125rem;
          }

          .article-content pre {
            margin-left: -1rem;
            margin-right: -1rem;
            max-width: calc(100% + 2rem);
          }

          .article-content .table-wrapper {
            max-height: 350px;
          }
        }
      `}</style>
    </>
  );
}
