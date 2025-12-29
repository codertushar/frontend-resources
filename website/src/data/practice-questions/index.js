// Central registry for all practice questions
// This file serves as the single source of truth for question metadata

// Import all question definitions
import chainedCalculator from './javascript/chained-calculator.js';
import debounce from './javascript/debounce.js';
import breadcrumbNavigator from './react/breadcrumb-navigator.js';

// Question metadata registry
// Add new questions here with their import and metadata
const questionRegistry = [
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
 * @param {Object} filters - Filter criteria
 * @param {string} filters.category - Filter by category (e.g., 'JavaScript', 'React')
 * @param {string} filters.difficulty - Filter by difficulty (e.g., 'easy', 'medium', 'hard')
 * @param {string} filters.type - Filter by type (e.g., 'output', 'preview')
 * @param {string[]} filters.tags - Filter by tags (must match at least one tag)
 * @param {string} filters.search - Search in title and description
 * @returns {Array} Filtered questions
 */
export const getQuestions = (filters = {}) => {
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
      q.tags.some(tag => filters.tags.includes(tag))
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
 * @param {string} id - Question ID
 * @returns {Object|null} Question object or null if not found
 */
export const getQuestionById = (id) => {
  return questionRegistry.find(q => q.id === id) || null;
};

/**
 * Get all unique categories
 * @returns {Array<string>} Array of unique categories
 */
export const getCategories = () => {
  return [...new Set(questionRegistry.map(q => q.category))];
};

/**
 * Get all unique tags
 * @returns {Array<string>} Array of unique tags
 */
export const getTags = () => {
  const allTags = questionRegistry.flatMap(q => q.tags || []);
  return [...new Set(allTags)];
};

/**
 * Get question count by category
 * @returns {Object} Object with category as key and count as value
 */
export const getQuestionCountByCategory = () => {
  return questionRegistry.reduce((acc, q) => {
    acc[q.category] = (acc[q.category] || 0) + 1;
    return acc;
  }, {});
};

/**
 * Get question count by difficulty
 * @returns {Object} Object with difficulty as key and count as value
 */
export const getQuestionCountByDifficulty = () => {
  return questionRegistry.reduce((acc, q) => {
    acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
    return acc;
  }, {});
};

// Export the full registry for backward compatibility
export const PRACTICE_QUESTIONS = questionRegistry;

// Default export
export default {
  getQuestions,
  getQuestionById,
  getCategories,
  getTags,
  getQuestionCountByCategory,
  getQuestionCountByDifficulty,
  PRACTICE_QUESTIONS,
};
