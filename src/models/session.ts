import type { QuizWithQuestionsOptions } from '@/models/quiz';

export interface Session {
  sessionId: string;
  sessionCode: string;
  startTime: string;
  endTime: string | null;
}

export interface SessionWithQuizQuestionsOptions extends Session {
  quiz: QuizWithQuestionsOptions
}
