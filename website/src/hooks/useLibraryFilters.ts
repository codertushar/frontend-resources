/**
 * Custom Hook for Library Filtering
 * Manages all filter state and applies filters to content
 */

import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  icon?: React.ComponentType;
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
  [key: string]: unknown;
}

export interface AdditionalContext<T extends ContentItem = ContentItem> {
  getInterviewFrequency?: (item: T) => string | undefined;
  isRead?: (id: string) => boolean;
}

type FilterUpdater = FilterState | ((prev: FilterState) => FilterState);

export interface UseLibraryFiltersReturn<T extends ContentItem = ContentItem> {
  filterState: FilterState;
  filteredData: T[];
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
const buildUrlParams = (filterState: FilterState): Record<string, string> => {
  const params: Record<string, string> = {};
  const allFilters = getAllFilters() as unknown as Record<string, FilterConfig>;

  Object.entries(filterState).forEach(([key, value]) => {
    const config = allFilters[key];
    if (!config) return;

    // Skip default values
    if (value === config.defaultValue) return;

    if (config.type === 'multi' && Array.isArray(value) && value.length > 0) {
      params[config.urlParam] = (value as string[]).join(',');
    } else if (config.type === 'range') {
      const [min, max] = value as [number, number];
      const [defaultMin, defaultMax] = config.defaultValue as [number, number];
      if (min !== defaultMin || max !== defaultMax) {
        params[config.urlParam] = `${min}-${max}`;
      }
    } else if (value) {
      params[config.urlParam] = value as string;
    }
  });

  return params;
};

/**
 * Apply all filters to content data
 */
const applyAllFilters = <T extends ContentItem>(
  contentData: T[],
  filterState: FilterState,
  fuse: Fuse<T>,
  additionalContext: AdditionalContext<T> = {}
): T[] => {
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

  // Access filter
  if (filterState.access !== 'all') {
    result = result.filter(item =>
      filterState.access === 'free' ? !item.premium : item.premium
    );
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
    result = result.filter(item => {
      const readTime = item.readTime || 5;
      return readTime >= min && readTime <= max;
    });
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
const applySorting = <T extends ContentItem>(data: T[], sortBy: string): T[] => {
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
 * Main hook
 */
export const useLibraryFilters = <T extends ContentItem = ContentItem>(
  contentData: T[],
  additionalContext: AdditionalContext<T> = {}
): UseLibraryFiltersReturn<T> => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Derive filter state directly from URL - single source of truth
  const filterState = useMemo(() => parseUrlParams(searchParams), [searchParams]);

  // Fuse.js for search
  const fuse = useMemo(() => {
    const fuseOptions = {
      keys: ['title', 'category', 'subcategory', 'content', 'difficulty', 'tags'],
      threshold: 0.3,
    };
    return new Fuse(contentData, fuseOptions);
  }, [contentData]);

  // Helper to update URL (which will update filterState via useMemo)
  const setFilterState = useCallback((updater: FilterUpdater) => {
    const newState = typeof updater === 'function' ? updater(filterState) : updater;
    const params = buildUrlParams(newState);
    setSearchParams(params, { replace: true });
  }, [filterState, setSearchParams]);

  // Update a single filter
  const updateFilter = useCallback((filterId: string, value: FilterValue) => {
    setFilterState((prev: FilterState): FilterState => ({
      ...prev,
      [filterId]: value
    }));
  }, [setFilterState]);

  // Update multiple filters at once
  const updateFilters = useCallback((updates: Partial<FilterState>) => {
    setFilterState((prev: FilterState): FilterState => {
      const merged = { ...prev };
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          merged[key] = value;
        }
      });
      return merged;
    });
  }, [setFilterState]);

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
    setFilterState(getDefaultFilterState() as FilterState);
  }, [setFilterState]);

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
    // State
    filterState,
    filteredData,
    activeFilterCount,
    hasActiveFilters,

    // Actions
    updateFilter,
    updateFilters,
    resetFilter,
    resetAllFilters,
  };
};
