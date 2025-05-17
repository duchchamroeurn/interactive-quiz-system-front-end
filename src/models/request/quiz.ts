export interface OptionRequest {
  id: string;
  text: string;
  isCorrect: boolean;
}
export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE';

export interface QuestionRequest {
  id: string;
  type: QuestionType;
  text: string;
  timeLimit: number;
  options?: OptionRequest[];
  correctAnswer?: number | null; // For true/false
}

export interface QuizRequest {
  id: string | null;
  userId: string;
  title: string;
  description: string;
  questions: QuestionRequest[];
}
