/**
 * Custom Hook for Library Filtering (Next.js App Router version)
 * Manages all filter state and applies filters to content
 */

'use client';

import { useMemo, useCallback, useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Fuse from 'fuse.js';
import { getAllFilters, getDefaultFilterState, countActiveFilters } from '../config/filters';

// Types
type FilterValue = string | string[] | [number, number];

interface FilterConfig {
  id: string;
  label: string;
  type: 'single' | 'multi' | 'range' | 'search';
  urlParam: string;
  defaultValue: FilterValue;
  values?: Array<{ id: string; label: string; color?: string }>;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  popularTags?: string[];
}

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
  [key: string]: FilterValue;
}

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
}

export interface AdditionalContext {
  getInterviewFrequency?: (item: ContentItem) => string | undefined;
  isRead?: (id: string) => boolean;
}

export interface UseLibraryFiltersReturn {
  filterState: FilterState;
  filteredData: ContentItem[];
  activeFilterCount: number;
  hasActiveFilters: boolean;
  updateFilter: (filterId: string, value: FilterValue) => void;
  updateFilters: (updates: Partial<FilterState>) => void;
  resetFilter: (filterId: string) => void;
  resetAllFilters: () => void;
}

const DIFFICULTY_ORDER: Record<string, number> = { easy: 1, medium: 2, hard: 3 };

/**
 * Parse URL params to filter state
 */
const parseUrlParams = (searchParams: URLSearchParams): FilterState => {
  const state = getDefaultFilterState() as FilterState;
  const allFilters = getAllFilters() as unknown as Record<string, FilterConfig>;

  Object.entries(allFilters).forEach(([key, config]) => {
    const value = searchParams.get(config.urlParam);
    if (value) {
      if (config.type === 'multi') {
        (state as Record<string, FilterValue>)[key] = value.split(',');
      } else if (config.type === 'range') {
        const [min, max] = value.split('-').map(Number);
        (state as Record<string, FilterValue>)[key] = [min, max];
      } else {
        (state as Record<string, FilterValue>)[key] = value;
      }
    }
  });

  return state;
};

/**
 * Build URL params from filter state
 */
const buildUrlParams = (filterState: FilterState): URLSearchParams => {
  const params = new URLSearchParams();
  const allFilters = getAllFilters() as unknown as Record<string, FilterConfig>;

  Object.entries(filterState).forEach(([key, value]) => {
    const config = allFilters[key];
    if (!config) return;

    // Skip default values
    const defaultValue = config.defaultValue;

    if (config.type === 'multi' && Array.isArray(value) && value.length > 0) {
      params.set(config.urlParam, (value as string[]).join(','));
    } else if (config.type === 'range') {
      const [min, max] = value as [number, number];
      const [defaultMin, defaultMax] = defaultValue as [number, number];
      if (min !== defaultMin || max !== defaultMax) {
        params.set(config.urlParam, `${min}-${max}`);
      }
    } else if (value && value !== defaultValue) {
      params.set(config.urlParam, value as string);
    }
  });

  return params;
};

/**
 * Apply all filters to content data
 */
const applyAllFilters = (
  contentData: ContentItem[],
  filterState: FilterState,
  fuse: Fuse<ContentItem>,
  additionalContext: AdditionalContext = {}
): ContentItem[] => {
  let result = [...contentData];

  // Search filter
  if (filterState.search) {
    result = fuse.search(filterState.search).map(r => r.item);
  }

  // Category filter
  if (filterState.category !== 'all') {
    result = result.filter(item => item.category === filterState.category);
  }

  // Subcategory filter
  if (filterState.subcategory) {
    result = result.filter(item => item.subcategory === filterState.subcategory);
  }

  // Difficulty filter
  if (filterState.difficulty !== 'all') {
    result = result.filter(item => item.difficulty === filterState.difficulty);
  }

  // Tag filter (multi-select)
  if (filterState.tag && filterState.tag.length > 0) {
    result = result.filter(item =>
      item.tags && filterState.tag.some(tag => item.tags!.includes(tag))
    );
  }

  // Interview frequency filter
  if (filterState.interviewFrequency !== 'all') {
    result = result.filter(item => {
      const freq = additionalContext.getInterviewFrequency?.(item) || item.interviewFrequency;
      return freq === filterState.interviewFrequency;
    });
  }

  // Read time filter
  if (filterState.readTime) {
    const [min, max] = filterState.readTime;
    // Only filter if not default values
    if (min !== 0 || max !== 60) {
      result = result.filter(item => {
        const readTime = item.readTime || 5;
        return readTime >= min && readTime <= max;
      });
    }
  }

  // Date added filter
  if (filterState.dateAdded !== 'all') {
    const now = new Date();
    const daysMap: Record<string, number> = { 'last-7': 7, 'last-30': 30, 'last-90': 90 };
    const days = daysMap[filterState.dateAdded];

    if (days) {
      const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      result = result.filter(item => {
        const itemDate = item.date ? new Date(item.date) : (item.createdAt ? new Date(item.createdAt) : null);
        return itemDate && itemDate >= cutoffDate;
      });
    }
  }

  // Read status filter
  if (filterState.readStatus !== 'all') {
    result = result.filter(item => {
      const isRead = additionalContext.isRead?.(item.id);
      return filterState.readStatus === 'read' ? isRead : !isRead;
    });
  }

  return result;
};

/**
 * Apply sorting
 */
const applySorting = (data: ContentItem[], sortBy: string): ContentItem[] => {
  if (sortBy === 'default') {
    return [...data].sort((a, b) => {
      const dateA = a.date ? new Date(a.date) : (a.createdAt ? new Date(a.createdAt) : new Date(0));
      const dateB = b.date ? new Date(b.date) : (b.createdAt ? new Date(b.createdAt) : new Date(0));
      return dateB.getTime() - dateA.getTime();
    });
  }

  return [...data].sort((a, b) => {
    switch (sortBy) {
      case 'difficulty-asc': {
        const levelDiff = (DIFFICULTY_ORDER[a.difficulty || 'medium'] || 2) - (DIFFICULTY_ORDER[b.difficulty || 'medium'] || 2);
        if (levelDiff !== 0) return levelDiff;
        return (a.difficultyScore || 50) - (b.difficultyScore || 50);
      }
      case 'difficulty-desc': {
        const levelDiff = (DIFFICULTY_ORDER[b.difficulty || 'medium'] || 2) - (DIFFICULTY_ORDER[a.difficulty || 'medium'] || 2);
        if (levelDiff !== 0) return levelDiff;
        return (b.difficultyScore || 50) - (a.difficultyScore || 50);
      }
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      case 'read-time-asc':
        return (a.readTime || 5) - (b.readTime || 5);
      case 'read-time-desc':
        return (b.readTime || 5) - (a.readTime || 5);
      default:
        return 0;
    }
  });
};

/**
 * Main hook - Next.js App Router version
 */
export const useLibraryFilters = (
  contentData: ContentItem[],
  additionalContext: AdditionalContext = {}
): UseLibraryFiltersReturn => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse filter state from URL
  const [filterState, setFilterStateInternal] = useState<FilterState>(() =>
    parseUrlParams(new URLSearchParams(searchParams.toString()))
  );

  // Sync with URL changes
  useEffect(() => {
    const newState = parseUrlParams(new URLSearchParams(searchParams.toString()));
    setFilterStateInternal(newState);
  }, [searchParams]);

  // Fuse.js for search
  const fuse = useMemo(() => {
    const fuseOptions = {
      keys: ['title', 'category', 'subcategory', 'content', 'difficulty', 'tags', 'description'],
      threshold: 0.3,
    };
    return new Fuse(contentData as unknown as ContentItem[], fuseOptions);
  }, [contentData]);

  // Helper to update URL
  const updateUrl = useCallback((newState: FilterState) => {
    const params = buildUrlParams(newState);
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [pathname, router]);

  // Update a single filter
  const updateFilter = useCallback((filterId: string, value: FilterValue) => {
    setFilterStateInternal(prev => {
      const newState = { ...prev, [filterId]: value };
      updateUrl(newState);
      return newState;
    });
  }, [updateUrl]);

  // Update multiple filters at once
  const updateFilters = useCallback((updates: Partial<FilterState>) => {
    setFilterStateInternal(prev => {
      const newState = { ...prev };
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          newState[key] = value;
        }
      });
      updateUrl(newState);
      return newState;
    });
  }, [updateUrl]);

  // Reset a single filter
  const resetFilter = useCallback((filterId: string) => {
    const allFilters = getAllFilters() as unknown as Record<string, FilterConfig>;
    const config = allFilters[filterId];
    if (config) {
      updateFilter(filterId, config.defaultValue);
    }
  }, [updateFilter]);

  // Reset all filters
  const resetAllFilters = useCallback(() => {
    const defaultState = getDefaultFilterState() as FilterState;
    setFilterStateInternal(defaultState);
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  // Apply filters and sorting
  const filteredData = useMemo(() => {
    let result = applyAllFilters(contentData, filterState, fuse, additionalContext);
    result = applySorting(result, filterState.sort);
    return result;
  }, [contentData, filterState, fuse, additionalContext]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return countActiveFilters(filterState);
  }, [filterState]);

  // Check if has active filters
  const hasActiveFilters = activeFilterCount > 0;

  return {
    filterState,
    filteredData,
    activeFilterCount,
    hasActiveFilters,
    updateFilter,
    updateFilters,
    resetFilter,
    resetAllFilters,
  };
};
