
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import contentData from '../data/content.json';

const ResourceDetail = () => {
  const { id } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const resourceId = decodeURIComponent(id);

  const resource = contentData.find(r => r.id === resourceId);

  useEffect(() => {
    if (resource) {
      setContent(resource.fullContent);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [resource]);

  if (!resource) {
    return (
      <div className="container error-container">
        <h2>Resource not found</h2>
        <Link to="/library" className="btn-primary">Back to Library</Link>
      </div>
    );
  }

  return (
    <div className="container detail-container">
      <Link to="/library" className="back-link">
        <ArrowLeft size={16} />
        Back to Library
      </Link>

      <div className="article-header">
        <div className="meta-tags">
          <span className="badge">{resource.category}</span>
          {resource.subcategory && <span className="badge sub">{resource.subcategory}</span>}
        </div>
        <h1 className="article-title">{resource.title}</h1>
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
              }
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>

      <style>{`
        .detail-container {
          padding-top: 2rem;
          max-width: 900px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          margin-bottom: 2rem;
          transition: color 0.2s;
        }

        .back-link:hover {
          color: var(--primary);
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
          background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .article-content {
          padding: 3rem;
          color: #e2e8f0;
          font-size: 1.1rem;
          line-height: 1.8;
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
          background: rgba(0,0,0,0.3);
          padding: 0.2em 0.4em;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 0.9em;
          color: #e2e8f0;
        }
        
        .article-content pre code {
          background: transparent;
          padding: 0;
          color: inherit;
        }
        
        .article-content table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 2rem;
        }
        
        .article-content th, .article-content td {
          border: 1px solid var(--border-color);
          padding: 0.75rem;
          text-align: left;
        }
        
        .article-content th {
          background: rgba(255,255,255,0.05);
        }

        @media (max-width: 768px) {
          .article-title { font-size: 2rem; }
          .article-content { padding: 1.5rem; }
        }
      `}</style>
    </div>
  );
};

export default ResourceDetail;
