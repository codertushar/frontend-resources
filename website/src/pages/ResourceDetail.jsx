
import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ArrowRight, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import contentData from '../data/content.json';

const ResourceDetail = () => {
  const location = useLocation();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Extract and decode the resource ID from the pathname
  // Remove basename (/frontend-resources), /resource/ prefix, and trailing slash
  const resourceId = decodeURIComponent(
    location.pathname
      .replace('/frontend-resources', '')
      .replace('/resource/', '')
      .replace(/^\//, '')
      .replace(/\/$/, '')
  );

  const resource = contentData.find(r => r.id === resourceId);

  // Find current index and prev/next articles in the same category
  const categoryArticles = useMemo(() => {
    if (!resource) return [];
    return contentData.filter(r => r.category === resource.category);
  }, [resource]);

  const currentIndex = categoryArticles.findIndex(r => r.id === resourceId);
  const prevArticle = currentIndex > 0 ? categoryArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < categoryArticles.length - 1 ? categoryArticles[currentIndex + 1] : null;

  // Get related articles (same category or subcategory, excluding current)
  const relatedArticles = useMemo(() => {
    if (!resource) return [];
    return contentData
      .filter(r =>
        r.id !== resourceId &&
        (r.category === resource.category ||
         (resource.subcategory && r.subcategory === resource.subcategory))
      )
      .slice(0, 3);
  }, [resource, resourceId]);

  useEffect(() => {
    if (resource) {
      setContent(resource.fullContent);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [resource]);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!resource) {
    return (
      <div className="container error-container">
        <h2>Resource not found</h2>
        <Link to="/library" className="btn-primary">Back to Library</Link>
      </div>
    );
  }

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="reading-progress-container">
        <div
          className="reading-progress-bar"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="container detail-container">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumb">
        <Link to="/library" className="breadcrumb-link">Library</Link>
        <span className="breadcrumb-sep">/</span>
        <Link to={`/library?category=${resource.category}`} className="breadcrumb-link">{resource.category}</Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{currentIndex + 1} of {categoryArticles.length}</span>
      </nav>

      <div className="article-header">
        <div className="meta-tags">
          <span className="badge">{resource.category}</span>
          {resource.subcategory && <span className="badge sub">{resource.subcategory}</span>}
        </div>
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
      </div>

      <div className="article-content glass-panel">
        {loading ? (
          <div className="loading">Loading content...</div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
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
              table({ node, children, ...props }) {
                return (
                  <div className="table-wrapper">
                    <table {...props}>{children}</table>
                  </div>
                )
              }
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>

      {/* Prev/Next Navigation */}
      {(prevArticle || nextArticle) && (
        <div className="article-nav">
          {prevArticle ? (
            <Link to={`/resource/${encodeURIComponent(prevArticle.id)}`} className="nav-link prev glass-panel">
              <ChevronLeft size={20} />
              <div className="nav-link-content">
                <span className="nav-label">Previous</span>
                <span className="nav-title">{prevArticle.title}</span>
              </div>
            </Link>
          ) : <div className="nav-spacer" />}

          {nextArticle ? (
            <Link to={`/resource/${encodeURIComponent(nextArticle.id)}`} className="nav-link next glass-panel">
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
                to={`/resource/${encodeURIComponent(article.id)}`}
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

        .detail-container {
          padding-top: 2rem;
          max-width: 900px;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
          font-size: 0.9rem;
        }

        .breadcrumb-link {
          color: var(--text-muted);
          transition: color 0.2s;
          text-transform: capitalize;
        }

        .breadcrumb-link:hover {
          color: var(--primary);
        }

        .breadcrumb-sep {
          color: var(--border-color);
        }

        .breadcrumb-current {
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        .article-header {
          margin-bottom: 3rem;
        }

        .meta-tags {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .article-title {
          font-size: 3rem;
          line-height: 1.2;
          font-weight: 800;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .article-title .title-text {
          background: var(--heading-gradient);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .article-title .title-emoji {
          -webkit-text-fill-color: initial;
        }

        .article-content {
          padding: 3rem;
          color: var(--text-main);
          font-size: 1.1rem;
          line-height: 1.8;
          overflow-x: hidden;
          max-width: 100%;
        }

        .article-content * {
          max-width: 100%;
        }

        .article-content pre {
          overflow-x: auto;
          max-width: 100%;
          -webkit-overflow-scrolling: touch;
          touch-action: pan-x;
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
          touch-action: pan-x pan-y;
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
          display: flex;
          gap: 1.5rem;
          margin-top: 3rem;
        }

        .nav-link {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          transition: all 0.3s ease;
        }

        .nav-link:hover {
          transform: translateY(-3px);
          background: var(--card-hover-bg);
          border-color: var(--primary);
        }

        .nav-link.prev {
          text-align: left;
        }

        .nav-link.next {
          text-align: right;
          justify-content: flex-end;
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
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .nav-spacer {
          flex: 1;
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

        @media (max-width: 768px) {
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
            -webkit-overflow-scrolling: touch;
            touch-action: pan-x;
          }

          .article-content .table-wrapper {
            margin-left: -1.5rem;
            margin-right: -1.5rem;
            max-width: calc(100% + 3rem);
            border-radius: 0;
            border-left: none;
            border-right: none;
            max-height: 400px;
          }

          .article-content img {
            max-width: 100%;
            height: auto;
          }

          .article-nav {
            flex-direction: column;
            gap: 1rem;
          }

          .nav-link.next {
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
            touch-action: pan-x;
          }

          .article-content .table-wrapper {
            margin-left: -1rem;
            margin-right: -1rem;
            max-width: calc(100% + 2rem);
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
