import type { Metadata } from 'next';
import { Suspense } from 'react';
import contentData from '@/data/content.json';
import ClientLayout from '../ClientLayout';
import { LibraryClient } from './LibraryClient';
import type { Article } from '@/types/content';

export const metadata: Metadata = {
  title: 'Library - All Frontend Resources',
  description: 'Browse our complete collection of frontend development resources, tutorials, and interview prep materials. Search and filter by difficulty, category, and topic.',
  openGraph: {
    title: 'Library - All Frontend Resources',
    description: 'Browse our complete collection of frontend development resources, tutorials, and interview prep materials.',
    type: 'website',
    url: 'https://crackfrontend.in/library',
  },
  alternates: {
    canonical: 'https://crackfrontend.in/library',
  },
};

// Loading fallback for LibraryClient
function LibraryLoading() {
  return (
    <div className="container page-container">
      <div className="header-section">
        <h1 className="heading-gradient">Resource Library</h1>
        <p className="subtitle">Loading resources...</p>
      </div>
    </div>
  );
}

// Server Component - handles initial data setup
export default function LibraryPage() {
  const articles = contentData as Article[];

  return (
    <ClientLayout>
      {/* Server-rendered article list for SEO - visible to crawlers without JavaScript */}
      <div className="sr-only-seo" inert>
        <h1>Frontend Interview Resources Library</h1>
        <p>Browse {articles.length}+ free, in-depth frontend interview preparation resources.</p>
        <ul>
          {articles.slice(0, 100).map((article) => (
            <li key={article.id}>
              <a href={`/resource/${article.id}`}>
                {article.title}
              </a>
              {article.description && <span> - {article.description}</span>}
            </li>
          ))}
        </ul>
      </div>
      <Suspense fallback={<LibraryLoading />}>
        <LibraryClient
          initialArticles={articles}
        />
      </Suspense>
    </ClientLayout>
  );
}
