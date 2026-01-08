// Content types - Article and related content structures

export interface Article {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  difficulty: 'easy' | 'medium' | 'hard';
  difficultyScore: number;
  premium: boolean;
  readTime: number;
  createdAt: string;
  filePath: string;
  content: string;
  fullContent?: string;
  hasFullContent: boolean;
  tags: string[];
  date: string;
  description: string;
}

// Generic content item used across components
export interface ContentItem {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  content?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  difficultyScore?: number;
  premium?: boolean;
  tags?: string[];
  interviewFrequency?: string;
  readTime?: number;
  date?: string;
  createdAt?: string;
  [key: string]: unknown;
}

// Category information for folder views
export interface CategoryInfo {
  path: string;
  displayName: string;
  subfolders: string[];
  articles: Article[];
  totalArticles: number;
  pathParts: string[];
}

// Breadcrumb navigation item
export interface BreadcrumbItem {
  name: string;
  url: string | null;
}

// Category display name mappings
export type CategoryKey = 'js' | 'dsa' | 'ai' | 'machine-coding' | 'system-design' | 'general';
export type SubcategoryKey = 'general-concepts' | 'polyfills' | 'promises' | 'utils' | 'design-patterns' | 'arrays' | 'general';
