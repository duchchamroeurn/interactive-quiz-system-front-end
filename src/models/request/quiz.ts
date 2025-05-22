import type { QuestionType } from '@/models/question';
import type { Option } from '../option';

export interface QuestionRequest {
  id: string;
  type: QuestionType;
  text: string;
  timeLimit: number;
  options?: Option[];
  correctAnswer?: number | null; // For true/false
  isCustomize: boolean | null;
}

export interface QuizRequest {
  id: string | null;
  userId: string;
  title: string;
  description: string;
  questions: QuestionRequest[];
}
