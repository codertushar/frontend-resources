/**
 * Custom Hook for Library Filtering
 * Manages all filter state and applies filters to content
 */

import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Fuse from 'fuse.js';
import { getAllFilters, getDefaultFilterState, countActiveFilters } from '../config/filters';

const DIFFICULTY_ORDER = { easy: 1, medium: 2, hard: 3 };

/**
 * Parse URL params to filter state
 */
const parseUrlParams = (searchParams) => {
  const state = getDefaultFilterState();
  const allFilters = getAllFilters();

  Object.entries(allFilters).forEach(([key, config]) => {
    const value = searchParams.get(config.urlParam);
    if (value) {
      if (config.type === 'multi') {
        state[key] = value.split(',');
      } else if (config.type === 'range') {
        const [min, max] = value.split('-').map(Number);
        state[key] = [min, max];
      } else {
        state[key] = value;
      }
    }
  });

  return state;
};

/**
 * Build URL params from filter state
 */
const buildUrlParams = (filterState) => {
  const params = {};
  const allFilters = getAllFilters();

  Object.entries(filterState).forEach(([key, value]) => {
    const config = allFilters[key];
    if (!config) return;

    // Skip default values
    if (value === config.defaultValue) return;

    if (config.type === 'multi' && Array.isArray(value) && value.length > 0) {
      params[config.urlParam] = value.join(',');
    } else if (config.type === 'range') {
      const [min, max] = value;
      if (min !== config.defaultValue[0] || max !== config.defaultValue[1]) {
        params[config.urlParam] = `${min}-${max}`;
      }
    } else if (value) {
      params[config.urlParam] = value;
    }
  });

  return params;
};

/**
 * Apply all filters to content data
 */
const applyAllFilters = (contentData, filterState, fuse, additionalContext = {}) => {
  let result = [...contentData];

  // Search filter
  if (filterState.search) {
    result = fuse.search(filterState.search).map(r => r.item);
  }

  // Category filter
  if (filterState.category !== 'all') {
    result = result.filter(item => item.category === filterState.category);
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
      item.tags && filterState.tag.some(tag => item.tags.includes(tag))
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
    const daysMap = { 'last-7': 7, 'last-30': 30, 'last-90': 90 };
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
const applySorting = (data, sortBy) => {
  if (sortBy === 'default') {
    return [...data].sort((a, b) => {
      const dateA = a.date ? new Date(a.date) : (a.createdAt ? new Date(a.createdAt) : new Date(0));
      const dateB = b.date ? new Date(b.date) : (b.createdAt ? new Date(b.createdAt) : new Date(0));
      return dateB - dateA;
    });
  }

  return [...data].sort((a, b) => {
    switch (sortBy) {
      case 'difficulty-asc': {
        const levelDiff = (DIFFICULTY_ORDER[a.difficulty] || 2) - (DIFFICULTY_ORDER[b.difficulty] || 2);
        if (levelDiff !== 0) return levelDiff;
        return (a.difficultyScore || 50) - (b.difficultyScore || 50);
      }
      case 'difficulty-desc': {
        const levelDiff = (DIFFICULTY_ORDER[b.difficulty] || 2) - (DIFFICULTY_ORDER[a.difficulty] || 2);
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
export const useLibraryFilters = (contentData, additionalContext = {}) => {
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
  const setFilterState = useCallback((updater) => {
    const newState = typeof updater === 'function' ? updater(filterState) : updater;
    const params = buildUrlParams(newState);
    setSearchParams(params, { replace: true });
  }, [filterState, setSearchParams]);

  // Update a single filter
  const updateFilter = useCallback((filterId, value) => {
    setFilterState(prev => ({
      ...prev,
      [filterId]: value
    }));
  }, []);

  // Update multiple filters at once
  const updateFilters = useCallback((updates) => {
    setFilterState(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  // Reset a single filter
  const resetFilter = useCallback((filterId) => {
    const allFilters = getAllFilters();
    const config = allFilters[filterId];
    if (config) {
      updateFilter(filterId, config.defaultValue);
    }
  }, [updateFilter]);

  // Reset all filters
  const resetAllFilters = useCallback(() => {
    setFilterState(getDefaultFilterState());
  }, []);

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
