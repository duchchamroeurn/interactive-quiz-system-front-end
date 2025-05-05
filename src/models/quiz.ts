import type { QuestionWithOptions } from '@/models/question';

export interface Quiz {
  id: string;
  title: string;
  createdAt: string;
}

export interface QuizWithQuestionsOptions extends Quiz {
  questions: QuestionWithOptions[];
}
