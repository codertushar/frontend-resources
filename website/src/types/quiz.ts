// Quiz types

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface QuizSectionProps {
  questions: QuizQuestion[];
}

export interface AnswersState {
  [questionIndex: number]: number;
}
