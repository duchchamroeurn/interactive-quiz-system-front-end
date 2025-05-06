import type { QuizWithQuestionsOptions } from '@/models/quiz';
import type { Participant } from './participant';

export interface Session {
  sessionId: string;
  sessionCode: string;
  startTime: string;
  endTime: string | null;
}

export interface SessionWithQuizQuestionsOptions extends Session {
  quiz: QuizWithQuestionsOptions
}

export interface SessionWithParticipant extends Session {
  participants: Participant[];
}
