// Type definitions for practice questions

export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'output' | 'preview';
export type Category = 'JavaScript' | 'React' | 'CSS' | 'HTML' | 'TypeScript';
export type Language = 'vanilla' | 'react' | 'typescript';

export interface StarterCode {
  vanilla?: string;
  react?: string;
  typescript?: string;
}

export interface Solution {
  vanilla?: string;
  react?: string;
  typescript?: string;
}

export interface AutomatedTestCase {
  name: string;
  code: string;
  expected: unknown;
  description?: string;
  manual?: never;
}

export interface ManualTestCase {
  name: string;
  description: string;
  manual: true;
  code?: never;
  expected?: never;
}

export type TestCase = AutomatedTestCase | ManualTestCase;

export interface PracticeQuestion {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  type: QuestionType;
  category: Category;
  tags: string[];
  defaultLanguage: Language;
  starterCode: StarterCode;
  solution: Solution;
  testCases: TestCase[];
}

export interface PracticeQuestionWithOrder extends PracticeQuestion {
  order: number;
}

export interface QuestionFilters {
  category?: Category;
  difficulty?: Difficulty;
  type?: QuestionType;
  tags?: string[];
  search?: string;
}

export interface QuestionCountMap {
  [key: string]: number;
}

export interface PracticeQuestionsAPI {
  getQuestions: (filters?: QuestionFilters) => PracticeQuestionWithOrder[];
  getQuestionById: (id: string) => PracticeQuestionWithOrder | null;
  getCategories: () => Category[];
  getTags: () => string[];
  getQuestionCountByCategory: () => QuestionCountMap;
  getQuestionCountByDifficulty: () => QuestionCountMap;
  PRACTICE_QUESTIONS: PracticeQuestionWithOrder[];
}
