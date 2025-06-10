import { z } from 'zod';

export const schemaQuizSubmission = z.object({
  sessionId: z.string().uuid(),
  sessionCode: z.string(),
  total: z.number(),
  numberCorrectAnswer: z.number(),
  quizTitle: z.string(),
  submittedDate: z.string(),
});

export type QuizSubmission = z.infer<typeof schemaQuizSubmission>;
