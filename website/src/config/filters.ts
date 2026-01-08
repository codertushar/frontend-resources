/**
 * Scalable Filter Configuration
 * Single source of truth for all filters
 */

import {
  Layers, Code2, Binary, Brain, Terminal, Server, Globe,
  Target, Zap, Crown, Calendar, Clock, Tag as TagIcon, BookOpen,
  LucideIcon
} from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Subcategory {
  id: string;
  label: string;
  count: number;
}

export interface CategoryValue {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  hasSubcategories?: boolean;
  subcategories?: Subcategory[];
}

export interface FilterValue {
  id: string;
  label: string;
  color?: string;
  icon?: LucideIcon;
}

export interface BaseFilter {
  id: string;
  label: string;
  urlParam: string;
  icon?: LucideIcon;
}

export interface SingleFilter extends BaseFilter {
  type: 'single';
  defaultValue: string;
  values?: FilterValue[] | CategoryValue[];
}

export interface MultiFilter extends BaseFilter {
  type: 'multi';
  defaultValue: string[];
  popularTags?: string[];
}

export interface RangeFilter extends BaseFilter {
  type: 'range';
  defaultValue: [number, number];
  min: number;
  max: number;
  step: number;
  unit: string;
}

export interface SearchFilter extends BaseFilter {
  type: 'search';
  defaultValue: string;
  placeholder: string;
}

export type Filter = SingleFilter | MultiFilter | RangeFilter | SearchFilter;

export interface FilterState {
  category: string;
  subcategory: string;
  search: string;
  difficulty: string;
  access: string;
  sort: string;
  tag: string[];
  interviewFrequency: string;
  readTime: [number, number];
  dateAdded: string;
  readStatus: string;
}

export interface FilterPreset {
  id: string;
  label: string;
  emoji: string;
  description: string;
  filters: Partial<FilterState>;
  color: string;
}

export interface ContentItem {
  tags?: string[];
  [key: string]: unknown;
}

// ============================================================================
// CATEGORIES (Primary Filter - Hierarchical with Subcategories)
// ============================================================================
export const CATEGORIES: CategoryValue[] = [
  { id: 'all', label: 'All Resources', icon: Layers, color: '#8b5cf6' },
  {
    id: 'js',
    label: 'JavaScript',
    icon: Code2,
    color: '#f59e0b',
    hasSubcategories: true,
    subcategories: [
      { id: 'polyfills', label: 'Polyfills', count: 24 },
      { id: 'general-concepts', label: 'Core Concepts', count: 15 },
      { id: 'utils', label: 'Utilities', count: 14 },
      { id: 'promises', label: 'Promises', count: 8 },
    ]
  },
  { id: 'dsa', label: 'DSA', icon: Binary, color: '#22c55e' },
  { id: 'ai', label: 'AI Engineering', icon: Brain, color: '#ec4899' },
  { id: 'machine-coding', label: 'Machine Coding', icon: Terminal, color: '#06b6d4' },
  { id: 'system-design', label: 'System Design', icon: Server, color: '#f97316' },
  { id: 'general', label: 'Browser & Patterns', icon: Globe, color: '#6366f1' },
];

// ============================================================================
// FILTER DEFINITIONS
// ============================================================================

interface PrimaryFilters {
  category: SingleFilter;
  subcategory: SingleFilter;
  search: SearchFilter;
}

interface SecondaryFilters {
  difficulty: SingleFilter;
  access: SingleFilter;
  sort: SingleFilter;
}

interface AdvancedFilters {
  tag: MultiFilter;
  interviewFrequency: SingleFilter;
  readTime: RangeFilter;
  dateAdded: SingleFilter;
  readStatus: SingleFilter;
}

interface FiltersConfig {
  primary: PrimaryFilters;
  secondary: SecondaryFilters;
  advanced: AdvancedFilters;
}

export const FILTERS: FiltersConfig = {
  // PRIMARY SECTION (Always visible - top of page)
  primary: {
    category: {
      id: 'category',
      label: 'Category',
      type: 'single',
      urlParam: 'category',
      defaultValue: 'all',
      values: CATEGORIES,
    },
    subcategory: {
      id: 'subcategory',
      label: 'Subcategory',
      type: 'single',
      urlParam: 'subcategory',
      defaultValue: '',
    },
    search: {
      id: 'search',
      label: 'Search',
      type: 'search',
      urlParam: 'q',
      defaultValue: '',
      placeholder: 'Search resources...',
    }
  },

  // SECONDARY SECTION (Sticky bar - quick filters)
  secondary: {
    difficulty: {
      id: 'difficulty',
      label: 'Difficulty',
      type: 'single',
      urlParam: 'difficulty',
      defaultValue: 'all',
      icon: Zap,
      values: [
        { id: 'all', label: 'All Levels' },
        { id: 'easy', label: 'Easy', color: '#22c55e' },
        { id: 'medium', label: 'Medium', color: '#f59e0b' },
        { id: 'hard', label: 'Hard', color: '#ef4444' },
      ]
    },
    access: {
      id: 'access',
      label: 'Pricing',
      type: 'single',
      urlParam: 'access',
      defaultValue: 'all',
      icon: Crown,
      values: [
        { id: 'all', label: 'All Content' },
        { id: 'free', label: 'Free' },
        { id: 'premium', label: 'Premium' },
      ]
    },
    sort: {
      id: 'sort',
      label: 'Sort By',
      type: 'single',
      urlParam: 'sort',
      defaultValue: 'default',
      values: [
        { id: 'default', label: 'Newest First', icon: Calendar },
        { id: 'difficulty-asc', label: 'Easy → Hard', icon: Zap },
        { id: 'difficulty-desc', label: 'Hard → Easy', icon: Zap },
        { id: 'title-asc', label: 'A → Z', icon: BookOpen },
        { id: 'title-desc', label: 'Z → A', icon: BookOpen },
        { id: 'read-time-asc', label: 'Quick Reads First', icon: Clock },
        { id: 'read-time-desc', label: 'Long Reads First', icon: Clock },
      ]
    }
  },

  // ADVANCED SECTION (Hidden behind "More Filters")
  advanced: {
    tag: {
      id: 'tag',
      label: 'Tags',
      type: 'multi',
      urlParam: 'tags',
      defaultValue: [],
      icon: TagIcon,
      // Will be populated dynamically from content
      popularTags: ['polyfill', 'async', 'closures', 'functional', 'react', 'design-patterns', 'caching', 'recursion', 'dom', 'api'],
    },
    interviewFrequency: {
      id: 'interviewFrequency',
      label: 'Interview Importance',
      type: 'single',
      urlParam: 'interview',
      defaultValue: 'all',
      icon: Target,
      values: [
        { id: 'all', label: 'All Topics' },
        { id: 'critical', label: 'Interview Favorites' },
        { id: 'common', label: 'Common Questions' },
      ]
    },
    readTime: {
      id: 'readTime',
      label: 'Read Time',
      type: 'range',
      urlParam: 'readTime',
      defaultValue: [0, 60],
      icon: Clock,
      min: 0,
      max: 60,
      step: 5,
      unit: 'min'
    },
    dateAdded: {
      id: 'dateAdded',
      label: 'Date Added',
      type: 'single',
      urlParam: 'date',
      defaultValue: 'all',
      icon: Calendar,
      values: [
        { id: 'all', label: 'All Time' },
        { id: 'last-7', label: 'Last 7 Days' },
        { id: 'last-30', label: 'Last 30 Days' },
        { id: 'last-90', label: 'Last 90 Days' },
      ]
    },
    readStatus: {
      id: 'readStatus',
      label: 'Your Progress',
      type: 'single',
      urlParam: 'status',
      defaultValue: 'all',
      icon: BookOpen,
      values: [
        { id: 'all', label: 'All Articles' },
        { id: 'unread', label: 'Not Started' },
        { id: 'read', label: 'Completed' },
      ]
    }
  }
};

// ============================================================================
// FILTER PRESETS (One-click shortcuts)
// ============================================================================
export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'beginner',
    label: 'Beginner Friendly',
    emoji: '🎯',
    description: 'Easy, free resources',
    filters: { difficulty: 'easy', access: 'free' },
    color: '#22c55e'
  },
  {
    id: 'interview',
    label: 'Interview Prep',
    emoji: '⭐',
    description: 'Critical interview topics',
    filters: { interviewFrequency: 'critical' },
    color: '#fbbf24'
  },
  {
    id: 'quick',
    label: 'Quick Reads',
    emoji: '⚡',
    description: 'Under 10 minutes',
    filters: { readTime: [0, 10], sort: 'read-time-asc' },
    color: '#06b6d4'
  },
  {
    id: 'new',
    label: 'Recently Added',
    emoji: '🆕',
    description: 'Last 30 days',
    filters: { dateAdded: 'last-30', sort: 'default' },
    color: '#8b5cf6'
  },
  {
    id: 'free',
    label: 'Free Only',
    emoji: '🆓',
    description: 'All free content',
    filters: { access: 'free' },
    color: '#10b981'
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

type AllFilters = PrimaryFilters & SecondaryFilters & AdvancedFilters;

/**
 * Get all filters as flat object
 */
export const getAllFilters = (): AllFilters => {
  return {
    ...FILTERS.primary,
    ...FILTERS.secondary,
    ...FILTERS.advanced
  };
};

/**
 * Get default filter state
 */
export const getDefaultFilterState = (): FilterState => {
  const allFilters = getAllFilters();
  const state = {} as FilterState;
  (Object.entries(allFilters) as [keyof AllFilters, Filter][]).forEach(([key, config]) => {
    (state as Record<string, unknown>)[key] = config.defaultValue;
  });
  return state;
};

/**
 * Count active filters
 */
export const countActiveFilters = (filterState: Partial<FilterState>): number => {
  const allFilters = getAllFilters();
  let count = 0;

  (Object.entries(filterState) as [keyof FilterState, unknown][]).forEach(([key, value]) => {
    const config = allFilters[key as keyof AllFilters];
    if (!config) return;

    if (config.type === 'multi') {
      if (Array.isArray(value) && value.length > 0) count++;
    } else if (config.type === 'range') {
      const [min, max] = value as [number, number];
      const defaultRange = config.defaultValue as [number, number];
      if (min !== defaultRange[0] || max !== defaultRange[1]) count++;
    } else if (value !== config.defaultValue) {
      count++;
    }
  });

  return count;
};

/**
 * Get all unique tags from content
 */
export const extractTags = (contentData: ContentItem[]): string[] => {
  const allTags = new Set<string>();
  contentData.forEach(item => {
    if (item.tags) {
      item.tags.forEach(tag => allTags.add(tag));
    }
  });

  const popularTags = FILTERS.advanced.tag.popularTags || [];

  // Sort popular tags first
  return Array.from(allTags).sort((a, b) => {
    const aPopular = popularTags.includes(a);
    const bPopular = popularTags.includes(b);
    if (aPopular && !bPopular) return -1;
    if (!aPopular && bPopular) return 1;
    return a.localeCompare(b);
  });
};

// Display name mappings
export const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  'general': 'Browser & Patterns',
  'js': 'JavaScript',
  'dsa': 'DSA',
  'ai': 'AI',
  'machine-coding': 'Machine Coding',
  'system-design': 'System Design',
};

export const SUBCATEGORY_DISPLAY_NAMES: Record<string, string> = {
  'general-concepts': 'Core Concepts',
  'polyfills': 'Polyfills',
  'promises': 'Promises',
  'utils': 'Utilities',
  'design-patterns': 'Design Patterns',
  'arrays': 'Arrays',
  'general': 'General',
};
