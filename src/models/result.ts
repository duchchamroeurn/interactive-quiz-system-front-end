import { quizWithQuestionOptionSchema } from '@/models/quiz';
import { sessionSchema } from '@/models/session';
import { userSchema } from '@/models/user';
import { z } from 'zod';

export const resultSchema = z.object({
  answerId: z.string().uuid(),
  sessionCode: z.string(),
  username: z.string(),
  question: z.string(),
  answerSubmit: z.string(),
  answerTime: z.string(),
});

export type Result = z.infer<typeof resultSchema>;

export const userQuizResultSchema = z.object({
  session: sessionSchema,
  user: userSchema,
  quiz: quizWithQuestionOptionSchema,
  answers: z.array(z.object({
    questionId: z.string().uuid(),
    answerId: z.any(),
  })),
});

export type UserQuizResult = z.infer<typeof userQuizResultSchema>;
