import { MetadataRoute } from 'next';
import contentData from '../src/data/content.json';
import type { Article } from '../src/types/content';

const articles = contentData as Article[];

/**
 * Dynamic sitemap generation for Next.js
 * This automatically generates the sitemap from content.json at build time
 * ensuring Google always has up-to-date URLs for indexing
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://crackfrontend.in';

  // Static pages with high priority
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/library`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/practice`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/donate`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Generate category pages from articles
  const categories = new Set<string>();
  const subcategories = new Set<string>();

  articles.forEach((article) => {
    categories.add(article.category);
    if (article.subcategory) {
      subcategories.add(`${article.category}/${article.subcategory}`);
    }
  });

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = Array.from(categories).map((category) => ({
    url: `${baseUrl}/resource/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  // Subcategory pages
  const subcategoryPages: MetadataRoute.Sitemap = Array.from(subcategories).map((path) => ({
    url: `${baseUrl}/resource/${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Article pages - use createdAt if available, otherwise current date
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/resource/${article.id}`,
    lastModified: article.createdAt ? new Date(article.createdAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }));

  return [...staticPages, ...categoryPages, ...subcategoryPages, ...articlePages];
}
