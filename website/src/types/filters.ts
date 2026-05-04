// Filter types for library and content filtering

export interface Subcategory {
  id: string;
  label: string;
}

export type CategoryValue = {
  id: string;
  label: string;
  subcategories?: Subcategory[];
};

// UI representation of filter value
export interface FilterValueUI {
  id: string;
  label: string;
  color?: string;
  icon?: string;
}

// Base filter configuration
export interface BaseFilter {
  id: string;
  label: string;
  icon?: string;
  description?: string;
}

export interface SingleFilter extends BaseFilter {
  type: 'single';
  values: FilterValueUI[];
  defaultValue?: string;
}

export interface MultiFilter extends BaseFilter {
  type: 'multi';
  values: FilterValueUI[];
  defaultValue?: string[];
}

export interface RangeFilter extends BaseFilter {
  type: 'range';
  min: number;
  max: number;
  step?: number;
  defaultValue?: [number, number];
}

export interface SearchFilter extends BaseFilter {
  type: 'search';
  placeholder?: string;
  defaultValue?: string;
}

export type Filter = SingleFilter | MultiFilter | RangeFilter | SearchFilter;

// Filter state represents current active filter values
export interface FilterState {
  category?: string;
  subcategory?: string;
  difficulty?: string[];
  readTime?: [number, number];
  search?: string;
  tags?: string[];
  interviewFrequency?: string[];
  [key: string]: string | string[] | [number, number] | undefined;
}

// Filter preset for quick filtering
export interface FilterPreset {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  filters: Partial<FilterState>;
}

// Interview frequency type
export type InterviewFrequency = 'very-high' | 'high' | 'medium' | 'low';

// View mode for library
export type ViewMode = 'grid' | 'list';
