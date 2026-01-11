'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// @ts-expect-error - react-syntax-highlighter lacks proper TypeScript declarations
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-expect-error - react-syntax-highlighter lacks proper TypeScript declarations
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Crown, FileText, Bookmark, CheckCircle } from 'lucide-react';
import { useProgress } from '../../../src/context/ProgressContext';
import { useSubscription } from '../../../src/context/SubscriptionContext';
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

interface ResourceDetailClientProps {
  article: Article;
  previousArticle: Article | null;
  nextArticle: Article | null;
  relatedArticles: Article[];
}

export function ResourceDetailClient({
  article,
  previousArticle,
  nextArticle,
  relatedArticles,
}: ResourceDetailClientProps) {
  const router = useRouter();
  const { isRead, toggleRead } = useProgress();
  const { isPremium, fetchPremiumContent } = useSubscription();
  const [premiumContent, setPremiumContent] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [contentToDisplay, setContentToDisplay] = useState(article.content);

  const isReadArticle = isRead(article.id);
  const isPremiumArticle = article.premium;
  const canAccess = !isPremiumArticle || isPremium;

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
    if (canAccess && !isReadArticle) {
      toggleRead(article.id);
    }
  }, [article.id, canAccess, isReadArticle, toggleRead]);

  // Fetch premium content if needed
  useEffect(() => {
    if (isPremiumArticle && isPremium() && !premiumContent) {
      fetchPremiumContent(article.id).then((content) => {
        if (content) {
          setPremiumContent(content);
          setContentToDisplay(content);
        }
      });
    }
  }, [article.id, isPremiumArticle, isPremium, premiumContent, fetchPremiumContent]);

  const handleNavigate = useCallback(
    (articleId: string) => {
      router.push(`/resource/${articleId}`);
    },
    [router]
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Scroll progress bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-violet-600 to-purple-600 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-900 dark:to-purple-900 text-white sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </button>

          <h1 className="text-lg font-semibold text-center flex-1 px-4 line-clamp-1">
            {article.title}
          </h1>

          <button
            onClick={() => toggleRead(article.id)}
            className={`p-2 rounded transition-colors ${
              isReadArticle
                ? 'bg-white/20 text-white'
                : 'hover:bg-white/10 text-white/70'
            }`}
            title={isReadArticle ? 'Mark as unread' : 'Mark as read'}
          >
            {isReadArticle ? <CheckCircle size={20} /> : <Bookmark size={20} />}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumbs and metadata */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <a href="/" className="hover:text-violet-600 dark:hover:text-violet-400">Home</a>
            <span>/</span>
            <a href="/library" className="hover:text-violet-600 dark:hover:text-violet-400">Library</a>
            <span>/</span>
            <span>{CATEGORY_DISPLAY_NAMES[article.category] || article.category}</span>
            {article.subcategory && (
              <>
                <span>/</span>
                <span>{article.subcategory}</span>
              </>
            )}
          </div>

          {/* Title and metadata */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <span className="flex items-center gap-2">
              <FileText size={16} />
              {article.readTime || 5} min read
            </span>
            {article.date && (
              <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            )}
            <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 capitalize">
              {article.difficulty}
            </span>
            {article.premium && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                <Crown size={14} />
                Premium
              </span>
            )}
          </div>
        </div>

        {/* Paywall for premium content */}
        {!canAccess && (
          <Paywall />
        )}

        {/* Content */}
        {canAccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="prose prose-sm dark:prose-invert max-w-none mb-12"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({  node, inline, className, children, ...props }: any) {
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
              }}
            >
              {contentWithoutQuiz}
            </ReactMarkdown>
          </motion.div>
        )}

        {/* Quiz section */}
        {canAccess && quiz && quiz.length > 0 && (
          <QuizSection questions={quiz} />
        )}

        {/* Ad unit */}
        {canAccess && (
          <div className="my-12">
            <AdUnit />
          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          {previousArticle ? (
            <button
              onClick={() => handleNavigate(previousArticle.id)}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-violet-400 dark:hover:border-violet-600 transition-colors text-left"
            >
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                <ArrowLeft size={16} />
                <span className="text-sm">Previous</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                {previousArticle.title}
              </h3>
            </button>
          ) : (
            <div />
          )}

          {nextArticle ? (
            <button
              onClick={() => handleNavigate(nextArticle.id)}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-violet-400 dark:hover:border-violet-600 transition-colors text-right md:text-left md:col-start-2"
            >
              <div className="flex items-center justify-end md:justify-start gap-2 text-gray-600 dark:text-gray-400 mb-2">
                <span className="text-sm">Next</span>
                <ArrowRight size={16} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                {nextArticle.title}
              </h3>
            </button>
          ) : (
            <div />
          )}
        </div>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedArticles.map((relatedArticle) => (
                <button
                  key={relatedArticle.id}
                  onClick={() => handleNavigate(relatedArticle.id)}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-violet-400 dark:hover:border-violet-600 transition-colors text-left"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {relatedArticle.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {relatedArticle.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
