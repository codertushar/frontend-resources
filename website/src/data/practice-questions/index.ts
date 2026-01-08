// Central registry for all practice questions
// This file serves as the single source of truth for question metadata

import type {
  PracticeQuestionWithOrder,
  QuestionFilters,
  QuestionCountMap,
  Category,
  PracticeQuestionsAPI,
} from './types';

// Import all question definitions
import chainedCalculator from './javascript/chained-calculator';
import debounce from './javascript/debounce';
import breadcrumbNavigator from './react/breadcrumb-navigator';

// Question metadata registry
// Add new questions here with their import and metadata
const questionRegistry: PracticeQuestionWithOrder[] = [
  {
    ...chainedCalculator,
    order: 1,
  },
  {
    ...debounce,
    order: 2,
  },
  {
    ...breadcrumbNavigator,
    order: 3,
  },
  // Add more questions below as you create them
  // Example:
  // {
  //   ...yourNewQuestion,
  //   order: 4,
  // },
];

// Helper functions for filtering and searching

/**
 * Get all questions, optionally filtered by criteria
 * @param filters - Filter criteria
 * @returns Filtered questions
 */
export const getQuestions = (filters: QuestionFilters = {}): PracticeQuestionWithOrder[] => {
  let questions = [...questionRegistry];

  // Filter by category
  if (filters.category) {
    questions = questions.filter(q => q.category === filters.category);
  }

  // Filter by difficulty
  if (filters.difficulty) {
    questions = questions.filter(q => q.difficulty === filters.difficulty);
  }

  // Filter by type
  if (filters.type) {
    questions = questions.filter(q => q.type === filters.type);
  }

  // Filter by tags (match any tag)
  if (filters.tags && filters.tags.length > 0) {
    questions = questions.filter(q =>
      q.tags.some(tag => filters.tags!.includes(tag))
    );
  }

  // Search in title and description
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    questions = questions.filter(q =>
      q.title.toLowerCase().includes(searchLower) ||
      q.description.toLowerCase().includes(searchLower)
    );
  }

  // Sort by order
  return questions.sort((a, b) => a.order - b.order);
};

/**
 * Get a single question by ID
 * @param id - Question ID
 * @returns Question object or null if not found
 */
export const getQuestionById = (id: string): PracticeQuestionWithOrder | null => {
  return questionRegistry.find(q => q.id === id) || null;
};

/**
 * Get all unique categories
 * @returns Array of unique categories
 */
export const getCategories = (): Category[] => {
  return Array.from(new Set(questionRegistry.map(q => q.category)));
};

/**
 * Get all unique tags
 * @returns Array of unique tags
 */
export const getTags = (): string[] => {
  const allTags = questionRegistry.flatMap(q => q.tags || []);
  return Array.from(new Set(allTags));
};

/**
 * Get question count by category
 * @returns Object with category as key and count as value
 */
export const getQuestionCountByCategory = (): QuestionCountMap => {
  return questionRegistry.reduce<QuestionCountMap>((acc, q) => {
    acc[q.category] = (acc[q.category] || 0) + 1;
    return acc;
  }, {});
};

/**
 * Get question count by difficulty
 * @returns Object with difficulty as key and count as value
 */
export const getQuestionCountByDifficulty = (): QuestionCountMap => {
  return questionRegistry.reduce<QuestionCountMap>((acc, q) => {
    acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
    return acc;
  }, {});
};

// Export the full registry for backward compatibility
export const PRACTICE_QUESTIONS = questionRegistry;

// Export types for consumers
export type {
  PracticeQuestion,
  PracticeQuestionWithOrder,
  QuestionFilters,
  QuestionCountMap,
  Category,
  Difficulty,
  QuestionType,
  Language,
  StarterCode,
  Solution,
  TestCase,
  AutomatedTestCase,
  ManualTestCase,
} from './types';

// Default export
const practiceQuestionsAPI: PracticeQuestionsAPI = {
  getQuestions,
  getQuestionById,
  getCategories,
  getTags,
  getQuestionCountByCategory,
  getQuestionCountByDifficulty,
  PRACTICE_QUESTIONS,
};

export default practiceQuestionsAPI;
