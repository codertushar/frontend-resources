/**
 * Navigation Strategy: Progressive Disclosure
 *
 * GOAL: Let users navigate broadly OR selectively without overwhelming them
 *
 * PRINCIPLES:
 * 1. Primary filters always visible (Categories - the broad navigation)
 * 2. Secondary filters visible but compact (Quick filters - Difficulty, Pricing)
 * 3. Advanced filters hidden by default (Deep filtering - 10-50+ options)
 * 4. Smart defaults and suggestions (Guide users)
 * 5. Visual hierarchy (Most important = most prominent)
 */

import {
  Layers, Code2, Binary, Brain, Terminal, Server, Globe,
  Target, Zap, BookOpen, Tag, Crown, Calendar, Clock,
  Filter, TrendingUp, Star, Bookmark,
  LucideIcon
} from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface FilterValueBase {
  id: string;
  label: string;
  color?: string;
  emoji?: string;
  icon?: LucideIcon;
  description?: string;
}

export interface PrimaryFilterValue extends FilterValueBase {
  icon: LucideIcon;
  color: string;
  description: string;
}

export interface BaseFilterConfig {
  id: string;
  label: string;
  section: 'primary' | 'secondary' | 'advanced';
  urlParam: string;
  displayStyle?: string;
  icon?: LucideIcon;
}

export interface SingleFilterConfig extends BaseFilterConfig {
  type: 'single';
  defaultValue: string;
  values: FilterValueBase[];
  showCount?: boolean;
}

export interface MultiFilterConfig extends BaseFilterConfig {
  type: 'multi';
  defaultValue: string[];
  values: FilterValueBase[] | 'dynamic';
  maxSelected?: number;
  popularTags?: string[];
  placeholder?: string;
  showSearch?: boolean;
  dependsOn?: string[];
  helpText?: string;
}

export interface RangeFilterConfig extends BaseFilterConfig {
  type: 'range';
  defaultValue: [number, number];
  min: number;
  max: number;
  step: number;
  unit?: string;
  showHistogram?: boolean;
  helpText?: string;
}

export interface SearchFilterConfig extends BaseFilterConfig {
  type: 'search';
  defaultValue: string;
  placeholder: string;
  showInHeader?: boolean;
  searchableFields?: string[];
}

export type FilterConfig = SingleFilterConfig | MultiFilterConfig | RangeFilterConfig | SearchFilterConfig;

export interface FilterGroup {
  label: string;
  icon: LucideIcon;
  collapsed?: boolean;
  filters: Record<string, FilterConfig>;
}

export interface FilterPresetConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  emoji: string;
  description: string;
  filters: Record<string, string | string[] | [number, number]>;
  color: string;
}

export interface LayoutPosition {
  position: string;
  style: string;
  layout: string;
  sticky?: boolean;
  stickyOffset?: number;
  trigger?: string;
  animation?: string;
  showByDefault?: boolean;
}

export interface LayoutConfig {
  primaryFilters: LayoutPosition;
  secondaryFilters: LayoutPosition;
  advancedFilters: LayoutPosition;
  presets: LayoutPosition;
}

export interface DisclosureRules {
  contextual: {
    showSubcategoriesWhen: string[];
    suggestPresetsWhen: string[];
    showAdvancedHintWhen: string[];
  };
  autoExpand: {
    advancedFiltersIf: string[];
    dropdownAutoExpand: string[];
  };
  userGuidance: {
    firstVisit: string;
    noResults: string;
    manyFilters: string;
    categorySelected: string;
  };
}

// ============================================================================
// TIER 1: PRIMARY NAVIGATION (Always Visible - Top of Page)
// ============================================================================
/**
 * Purpose: Broad categorization - "What topic do you want?"
 * UX: Large pills/buttons with icons and colors
 * Position: Hero section, always visible
 */

interface PrimaryCategoryFilter extends Omit<SingleFilterConfig, 'values'> {
  showInHeader: boolean;
  values: PrimaryFilterValue[];
}

interface PrimarySearchFilter extends SearchFilterConfig {
  showInHeader: boolean;
}

interface PrimaryFiltersType {
  category: PrimaryCategoryFilter;
  search: PrimarySearchFilter;
}

export const PRIMARY_FILTERS: PrimaryFiltersType = {
  category: {
    id: 'category',
    label: 'Browse by Topic',
    type: 'single',
    section: 'primary',
    urlParam: 'category',
    defaultValue: 'all',
    displayStyle: 'pills', // Large, colorful pills with icons
    showInHeader: true,
    values: [
      { id: 'all', label: 'All Resources', icon: Layers, color: '#8b5cf6', description: 'Browse everything' },
      { id: 'js', label: 'JavaScript', icon: Code2, color: '#f59e0b', description: '60+ JS concepts & patterns' },
      { id: 'dsa', label: 'Data Structures', icon: Binary, color: '#22c55e', description: 'Algorithms & DS fundamentals' },
      { id: 'ai', label: 'AI Engineering', icon: Brain, color: '#ec4899', description: 'LLMs, prompts, AI tools' },
      { id: 'machine-coding', label: 'Machine Coding', icon: Terminal, color: '#06b6d4', description: 'Real-world implementations' },
      { id: 'system-design', label: 'System Design', icon: Server, color: '#f97316', description: 'Architecture & scalability' },
      { id: 'general', label: 'Browser & Patterns', icon: Globe, color: '#6366f1', description: 'Design patterns & rendering' },
    ]
  },

  search: {
    id: 'search',
    label: 'Quick Search',
    type: 'search',
    section: 'primary',
    urlParam: 'q',
    defaultValue: '',
    placeholder: 'Search articles, topics, tags...',
    showInHeader: true,
    searchableFields: ['title', 'category', 'subcategory', 'content', 'tags', 'description']
  }
};

// ============================================================================
// TIER 2: SECONDARY FILTERS (Visible - Filter Bar)
// ============================================================================
/**
 * Purpose: Quick refinement - "Show me easy ones" or "Only free content"
 * UX: Compact dropdowns in a sticky filter bar
 * Position: Below categories, sticky on scroll
 */

interface SecondaryFiltersType {
  difficulty: SingleFilterConfig;
  access: SingleFilterConfig;
  sort: SingleFilterConfig;
}

export const SECONDARY_FILTERS: SecondaryFiltersType = {
  difficulty: {
    id: 'difficulty',
    label: 'Difficulty',
    type: 'single',
    section: 'secondary',
    urlParam: 'difficulty',
    defaultValue: 'all',
    displayStyle: 'dropdown',
    icon: Zap,
    showCount: true, // Show (45) next to each option
    values: [
      { id: 'all', label: 'All Levels' },
      { id: 'easy', label: 'Easy', color: '#22c55e', emoji: '🟢' },
      { id: 'medium', label: 'Medium', color: '#f59e0b', emoji: '🟡' },
      { id: 'hard', label: 'Hard', color: '#ef4444', emoji: '🔴' },
    ]
  },

  access: {
    id: 'access',
    label: 'Pricing',
    type: 'single',
    section: 'secondary',
    urlParam: 'access',
    defaultValue: 'all',
    displayStyle: 'dropdown',
    icon: Crown,
    showCount: true,
    values: [
      { id: 'all', label: 'All Content' },
      { id: 'free', label: 'Free Only', emoji: '🆓' },
      { id: 'premium', label: 'Premium', emoji: '👑' },
    ]
  },

  sort: {
    id: 'sort',
    label: 'Sort By',
    type: 'single',
    section: 'secondary',
    urlParam: 'sort',
    defaultValue: 'default',
    displayStyle: 'dropdown',
    icon: TrendingUp,
    values: [
      { id: 'default', label: 'Newest First', icon: Calendar },
      { id: 'difficulty-asc', label: 'Easy → Hard', icon: Zap },
      { id: 'difficulty-desc', label: 'Hard → Easy', icon: Zap },
      { id: 'title-asc', label: 'A → Z', icon: BookOpen },
      { id: 'title-desc', label: 'Z → A', icon: BookOpen },
      { id: 'read-time-asc', label: 'Quick Reads First', icon: Clock },
      { id: 'read-time-desc', label: 'Long Reads First', icon: Clock },
      { id: 'popular', label: 'Most Popular', icon: TrendingUp },
    ]
  }
};

// ============================================================================
// TIER 3: ADVANCED FILTERS (Hidden Behind "More Filters" Button)
// ============================================================================
/**
 * Purpose: Deep, selective filtering - "Show me async JS polyfills under 10min"
 * UX: Modal/dropdown panel with organized sections
 * Position: Expandable panel, appears below filter bar
 */

interface AdvancedFiltersType {
  contentFilters: FilterGroup;
  learningFilters: FilterGroup;
  dateFilters: FilterGroup;
  advancedOptions: FilterGroup;
}

export const ADVANCED_FILTERS: AdvancedFiltersType = {
  // GROUP 1: Content Filters
  contentFilters: {
    label: 'Content Type',
    icon: BookOpen,
    filters: {
      tag: {
        id: 'tag',
        label: 'Tags',
        type: 'multi',
        section: 'advanced',
        urlParam: 'tags',
        defaultValue: [],
        displayStyle: 'multi-select',
        values: 'dynamic',
        maxSelected: 5,
        popularTags: ['polyfill', 'async', 'closures', 'functional', 'react', 'design-patterns'],
        placeholder: 'Select up to 5 tags',
        showSearch: true // Searchable for 50+ tags
      },

      subcategory: {
        id: 'subcategory',
        label: 'Specific Topics',
        type: 'multi',
        section: 'advanced',
        urlParam: 'topics',
        defaultValue: [],
        displayStyle: 'multi-select',
        values: 'dynamic',
        dependsOn: ['category'],
        placeholder: 'Filter by specific topics',
        helpText: 'Changes based on selected category'
      },

      readTime: {
        id: 'readTime',
        label: 'Read Time',
        type: 'range',
        section: 'advanced',
        urlParam: 'readTime',
        defaultValue: [0, 60],
        displayStyle: 'slider',
        min: 0,
        max: 60,
        step: 5,
        unit: 'min',
        showHistogram: true // Show distribution of articles
      }
    }
  },

  // GROUP 2: Interview & Learning
  learningFilters: {
    label: 'Interview & Learning',
    icon: Target,
    filters: {
      interviewFrequency: {
        id: 'interviewFrequency',
        label: 'Interview Importance',
        type: 'single',
        section: 'advanced',
        urlParam: 'interview',
        defaultValue: 'all',
        displayStyle: 'dropdown',
        icon: Target,
        values: [
          { id: 'all', label: 'All Topics' },
          { id: 'critical', label: '🔥 Interview Favorites', description: 'Asked in 90% of interviews' },
          { id: 'common', label: '⭐ Common Questions', description: 'Frequently asked' },
        ]
      },

      readStatus: {
        id: 'readStatus',
        label: 'Your Progress',
        type: 'single',
        section: 'advanced',
        urlParam: 'status',
        defaultValue: 'all',
        displayStyle: 'dropdown',
        icon: Bookmark,
        values: [
          { id: 'all', label: 'All Articles' },
          { id: 'unread', label: '📖 Not Started' },
          { id: 'read', label: '✅ Completed' },
        ]
      },

      complexity: {
        id: 'complexity',
        label: 'Complexity Score',
        type: 'range',
        section: 'advanced',
        urlParam: 'complexity',
        defaultValue: [0, 100],
        displayStyle: 'slider',
        min: 0,
        max: 100,
        step: 10,
        helpText: 'Granular difficulty within each level'
      }
    }
  },

  // GROUP 3: Date & Freshness
  dateFilters: {
    label: 'Date & Freshness',
    icon: Calendar,
    filters: {
      dateAdded: {
        id: 'dateAdded',
        label: 'Date Added',
        type: 'single',
        section: 'advanced',
        urlParam: 'date',
        defaultValue: 'all',
        displayStyle: 'dropdown',
        icon: Calendar,
        values: [
          { id: 'all', label: 'All Time' },
          { id: 'last-7', label: 'Last 7 Days', emoji: '🆕' },
          { id: 'last-30', label: 'Last 30 Days', emoji: '📅' },
          { id: 'last-90', label: 'Last 90 Days' },
          { id: 'last-year', label: 'Last Year' },
        ]
      },

      contentAge: {
        id: 'contentAge',
        label: 'Content Relevance',
        type: 'single',
        section: 'advanced',
        urlParam: 'age',
        defaultValue: 'all',
        displayStyle: 'dropdown',
        values: [
          { id: 'all', label: 'All Content' },
          { id: 'updated-recently', label: 'Recently Updated', description: 'Updated in last 3 months' },
          { id: 'evergreen', label: 'Timeless Classics', description: 'Core concepts that never change' },
        ]
      }
    }
  },

  // GROUP 4: Advanced Options (Future expansion)
  advancedOptions: {
    label: 'Advanced Options',
    icon: Filter,
    collapsed: true, // Hidden by default even within advanced filters
    filters: {
      hasQuiz: {
        id: 'hasQuiz',
        label: 'Has Quiz',
        type: 'single',
        section: 'advanced',
        urlParam: 'quiz',
        defaultValue: 'all',
        displayStyle: 'toggle',
        values: [
          { id: 'all', label: 'All Articles' },
          { id: 'with-quiz', label: 'With Quiz Only' },
        ]
      },

      hasCode: {
        id: 'hasCode',
        label: 'Code Examples',
        type: 'single',
        section: 'advanced',
        urlParam: 'code',
        defaultValue: 'all',
        displayStyle: 'toggle',
        values: [
          { id: 'all', label: 'All' },
          { id: 'with-code', label: 'With Code Examples' },
        ]
      },

      language: {
        id: 'language',
        label: 'Programming Language',
        type: 'multi',
        section: 'advanced',
        urlParam: 'lang',
        defaultValue: [],
        displayStyle: 'checkbox-group',
        values: [
          { id: 'javascript', label: 'JavaScript' },
          { id: 'typescript', label: 'TypeScript' },
          { id: 'python', label: 'Python' },
          { id: 'java', label: 'Java' },
        ]
      }
    }
  }
};

// ============================================================================
// TIER 4: QUICK ACCESS (Smart Shortcuts)
// ============================================================================
/**
 * Purpose: Common patterns users want - "Get me started" or "Interview prep"
 * UX: Preset buttons/chips above results
 * Position: Between filters and results
 */

interface FilterPresetsType {
  beginner: FilterPresetConfig;
  interviewPrep: FilterPresetConfig;
  quickWins: FilterPresetConfig;
  deepDive: FilterPresetConfig;
  newContent: FilterPresetConfig;
  freeOnly: FilterPresetConfig;
}

export const FILTER_PRESETS: FilterPresetsType = {
  beginner: {
    id: 'beginner',
    label: 'Beginner Friendly',
    icon: Target,
    emoji: '🎯',
    description: 'Easy, free resources to get started',
    filters: {
      difficulty: 'easy',
      access: 'free',
    },
    color: '#22c55e'
  },

  interviewPrep: {
    id: 'interviewPrep',
    label: 'Interview Prep',
    icon: Star,
    emoji: '⭐',
    description: 'Critical topics for interviews',
    filters: {
      interviewFrequency: 'critical',
      readStatus: 'unread', // Things you haven't read yet
    },
    color: '#fbbf24'
  },

  quickWins: {
    id: 'quickWins',
    label: 'Quick Reads',
    icon: Clock,
    emoji: '⚡',
    description: 'Under 10 minutes',
    filters: {
      readTime: [0, 10],
      sort: 'read-time-asc',
    },
    color: '#06b6d4'
  },

  deepDive: {
    id: 'deepDive',
    label: 'Deep Dives',
    icon: Brain,
    emoji: '🧠',
    description: 'Comprehensive guides (15+ min)',
    filters: {
      readTime: [15, 60],
      difficulty: 'hard',
      sort: 'read-time-desc',
    },
    color: '#ec4899'
  },

  newContent: {
    id: 'newContent',
    label: 'Recently Added',
    icon: Calendar,
    emoji: '🆕',
    description: 'Latest additions (last 30 days)',
    filters: {
      dateAdded: 'last-30',
      sort: 'default',
    },
    color: '#8b5cf6'
  },

  freeOnly: {
    id: 'freeOnly',
    label: 'Free Resources',
    icon: BookOpen,
    emoji: '🆓',
    description: 'All free content',
    filters: {
      access: 'free',
    },
    color: '#10b981'
  }
};

// ============================================================================
// UI LAYOUT STRATEGY
// ============================================================================

interface LayoutConfigType {
  desktop: LayoutConfig;
  mobile: LayoutConfig;
}

export const LAYOUT_CONFIG: LayoutConfigType = {
  // Desktop Layout
  desktop: {
    primaryFilters: {
      position: 'top',
      style: 'pills', // Large colorful pills
      layout: 'horizontal-wrap',
      sticky: false,
    },
    secondaryFilters: {
      position: 'below-primary',
      style: 'compact-dropdowns',
      layout: 'horizontal-row',
      sticky: true, // Sticks when scrolling
      stickyOffset: 60, // Below header
    },
    advancedFilters: {
      position: 'expandable-panel',
      trigger: 'button', // "More Filters" button
      style: 'grouped-sections',
      layout: 'grid-2-columns',
      animation: 'slide-down',
    },
    presets: {
      position: 'above-results',
      style: 'chips',
      layout: 'horizontal-scroll',
      showByDefault: true,
    }
  },

  // Mobile Layout
  mobile: {
    primaryFilters: {
      position: 'top',
      style: 'horizontal-scroll', // Swipeable pills
      layout: 'single-row',
      sticky: false,
    },
    secondaryFilters: {
      position: 'below-primary',
      style: 'compact-dropdowns',
      layout: 'horizontal-scroll',
      sticky: true,
    },
    advancedFilters: {
      position: 'full-screen-modal', // Better on mobile
      trigger: 'button',
      style: 'accordion-sections',
      layout: 'single-column',
      animation: 'slide-up',
    },
    presets: {
      position: 'above-results',
      style: 'compact-chips',
      layout: 'horizontal-scroll',
      showByDefault: true,
    }
  }
};

// ============================================================================
// PROGRESSIVE DISCLOSURE RULES
// ============================================================================

export const DISCLOSURE_RULES: DisclosureRules = {
  // Show filters based on context
  contextual: {
    // When a category is selected, show relevant subcategories
    showSubcategoriesWhen: ['category !== "all"'],

    // When multiple filters active, suggest presets
    suggestPresetsWhen: ['activeFilterCount > 2'],

    // Show advanced filters hint when no results
    showAdvancedHintWhen: ['filteredCount === 0'],
  },

  // Auto-expand rules
  autoExpand: {
    // Expand advanced filters if user has used them before
    advancedFiltersIf: ['userHasUsedAdvanced === true'],

    // Show all options in dropdown if < 5 items
    dropdownAutoExpand: ['options.length < 5'],
  },

  // Hints and guidance
  userGuidance: {
    firstVisit: 'Show preset chips with tooltips',
    noResults: 'Suggest removing filters or show "Clear all"',
    manyFilters: 'Show active filter count badge',
    categorySelected: 'Highlight relevant subcategories',
  }
};

export interface NavigationStrategyExport {
  PRIMARY_FILTERS: PrimaryFiltersType;
  SECONDARY_FILTERS: SecondaryFiltersType;
  ADVANCED_FILTERS: AdvancedFiltersType;
  FILTER_PRESETS: FilterPresetsType;
  LAYOUT_CONFIG: LayoutConfigType;
  DISCLOSURE_RULES: DisclosureRules;
}

const navigationStrategy: NavigationStrategyExport = {
  PRIMARY_FILTERS,
  SECONDARY_FILTERS,
  ADVANCED_FILTERS,
  FILTER_PRESETS,
  LAYOUT_CONFIG,
  DISCLOSURE_RULES
};

export default navigationStrategy;
