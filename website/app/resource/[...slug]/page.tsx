import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import Script from 'next/script';
import ClientLayout from '../../ClientLayout';
import contentData from '../../../src/data/content.json';
import { ResourceDetailClient } from './ResourceDetailClient';
import type { Article } from '../../../src/types/content';
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
  jsonLdScriptProps,
} from '../../../src/lib/structured-data';

const articles = contentData as Article[];

// Generate static params for all articles (static generation at build time)
export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.id.split('/'),
  }));
}

// Generate metadata for each article (improves SEO)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resourceId = slug.join('/');
  const article = articles.find((a) => a.id === resourceId);

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The article you are looking for does not exist.',
    };
  }

  const baseUrl = 'https://crackfrontend.in';
  const url = `${baseUrl}/resource/${article.id}`;

  return {
    title: article.title,
    description: article.description || 'Learn about ' + article.title,
    keywords: [...(article.tags || []), article.category, article.difficulty],
    authors: [{ name: 'CrackFrontend' }],
    openGraph: {
      title: article.title,
      description: article.description || undefined,
      type: 'article',
      url,
      publishedTime: article.date,
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description || undefined,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const resourceId = slug.join('/');
  const article = articles.find((a) => a.id === resourceId);

  if (!article) {
    notFound();
  }

  // Get the article access level from middleware headers
  // This is set by the edge middleware based on user's subscription status
  const headersList = await headers();
  const articleAccess = headersList.get('x-article-access') || 'paywall';

  // All content is now free, always serve full content
  const shouldServeFullContent = true;

  // Get the full content from the article object
  const fullContentForArticle = article.fullContent;

  // Create article with appropriate content
  const articleWithContent: Article = {
    ...article,
    fullContent: fullContentForArticle,
    hasFullContent: true,
  };

  // Get related articles (same category)
  const relatedArticles = articles.filter(
    (a) => a.category === article.category && a.id !== article.id
  ).slice(0, 3);

  // Get navigation (previous and next articles)
  const categoryArticles = articles.filter((a) => a.category === article.category);
  const currentIndex = categoryArticles.findIndex((a) => a.id === article.id);
  const previousArticle = currentIndex > 0 ? categoryArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < categoryArticles.length - 1 ? categoryArticles[currentIndex + 1] : null;

  // Get subcategory articles for sidebar
  const subcategoryArticles = article.subcategory
    ? articles.filter((a) => a.category === article.category && a.subcategory === article.subcategory)
    : categoryArticles;

  // Generate structured data for SEO
  const baseUrl = 'https://crackfrontend.in';
  const articleUrl = `${baseUrl}/resource/${article.id}`;

  // Breadcrumbs for navigation
  const breadcrumbs = [
    { name: 'Home', url: baseUrl },
    { name: 'Library', url: `${baseUrl}/library` },
    { name: article.category.toUpperCase(), url: `${baseUrl}/resource/${article.category}` },
  ];

  if (article.subcategory) {
    breadcrumbs.push({
      name: article.subcategory.replace(/-/g, ' '),
      url: `${baseUrl}/resource/${article.category}/${article.subcategory}`,
    });
  }

  breadcrumbs.push({ name: article.title, url: articleUrl });

  const articleSchema = generateArticleSchema(article, articleUrl);
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  return (
    <>
      {/* Structured data for Google rich snippets */}
      <Script
        id="article-schema"
        strategy="beforeInteractive"
        {...jsonLdScriptProps(articleSchema)}
      />
      <Script
        id="breadcrumb-schema"
        strategy="beforeInteractive"
        {...jsonLdScriptProps(breadcrumbSchema)}
      />
      <ClientLayout>
        <ResourceDetailClient
          article={articleWithContent}
          previousArticle={previousArticle}
          nextArticle={nextArticle}
          relatedArticles={relatedArticles}
          categoryArticles={categoryArticles}
          subcategoryArticles={subcategoryArticles}
          currentIndex={currentIndex}
          accessLevel={articleAccess}
        />
      </ClientLayout>
    </>
  );
}
