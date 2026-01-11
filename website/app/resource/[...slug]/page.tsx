import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import contentData from '../../../src/data/content.json';
import { ResourceDetailClient } from './ResourceDetailClient';
import type { Article } from '../../../src/types/content';

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

  const baseUrl = 'https://crackfrontend.dev';
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

  // Get related articles (same category)
  const relatedArticles = articles.filter(
    (a) => a.category === article.category && a.id !== article.id
  ).slice(0, 3);

  // Get navigation (previous and next articles)
  const categoryArticles = articles.filter((a) => a.category === article.category);
  const currentIndex = categoryArticles.findIndex((a) => a.id === article.id);
  const previousArticle = currentIndex > 0 ? categoryArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < categoryArticles.length - 1 ? categoryArticles[currentIndex + 1] : null;

  return (
    <ResourceDetailClient
      article={article}
      previousArticle={previousArticle}
      nextArticle={nextArticle}
      relatedArticles={relatedArticles}
    />
  );
}
