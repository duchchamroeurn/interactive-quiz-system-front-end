import type { QuizWithQuestionsOptions } from '@/models/quiz';
import type { Session } from '@/models/session';
import type { User } from '@/models/user';

export interface Result {
  answerId: string;
  sessionCode: string;
  username: string;
  question: string;
  answerSubmit: string;
  answerTime: string;
}

export interface UserQuizResult {
  session: Session;
  user: User;
  quiz: QuizWithQuestionsOptions;
  answers: {
    questionId: string;
    answerId: string | string [] | null
  }[];
}
