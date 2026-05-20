import type { Article } from '../types/content';

/**
 * Generate JSON-LD structured data for better Google indexing
 * This helps Google understand our content and show rich snippets in search results
 */

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generate Article schema for individual article pages
 * Helps Google show article cards in search results
 */
export function generateArticleSchema(article: Article, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description || `Learn about ${article.title}`,
    author: {
      '@type': 'Person',
      name: article.author || 'CrackFrontend Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CrackFrontend',
      logo: {
        '@type': 'ImageObject',
        url: 'https://crackfrontend.in/android-launchericon-512-512.png',
      },
    },
    datePublished: article.createdAt || article.date,
    dateModified: article.createdAt || article.date || new Date().toISOString(),
    url,
    image: 'https://crackfrontend.in/og-image.png',
    keywords: article.tags?.join(', '),
    articleSection: article.category,
    educationalLevel: article.difficulty,
    learningResourceType: 'Tutorial',
    isAccessibleForFree: true,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

/**
 * Generate BreadcrumbList schema for navigation
 * Helps Google show breadcrumbs in search results
 */
export function generateBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * Generate FAQPage schema for quiz sections
 * Helps Google show FAQ rich snippets
 */
export function generateFAQSchema(questions: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

/**
 * Generate ItemList schema for library/category pages
 * Helps Google understand content collections
 */
export function generateItemListSchema(
  items: Article[],
  listName: string,
  url: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    url,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://crackfrontend.in/resource/${item.id}`,
      name: item.title,
    })),
  };
}

/**
 * Generate WebSite schema for homepage
 * Enables Google search box in results
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CrackFrontend',
    alternateName: 'Crack Frontend Interviews',
    url: 'https://crackfrontend.in',
    description:
      'Master frontend interviews with curated JavaScript, React, DSA, and System Design resources. Free interview preparation for developers.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://crackfrontend.in/library?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate Course/LearningResource schema for educational content
 */
export function generateCourseSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Frontend Interview Preparation',
    description:
      'Comprehensive frontend interview preparation covering JavaScript, React, DSA, System Design, and more. Free resources with practical examples.',
    provider: {
      '@type': 'Organization',
      name: 'CrackFrontend',
      url: 'https://crackfrontend.in',
    },
    educationalLevel: 'Intermediate to Advanced',
    coursePrerequisites: 'Basic JavaScript and web development knowledge',
    isAccessibleForFree: true,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT50H', // 50 hours estimated
    },
    teaches: [
      'JavaScript fundamentals',
      'React patterns',
      'Data Structures and Algorithms',
      'System Design',
      'Interview techniques',
    ],
  };
}

/**
 * Utility to inject JSON-LD script into page
 */
export function jsonLdScriptProps(data: object) {
  return {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(data),
    },
  };
}
