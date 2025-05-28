import { z } from 'zod';

export const submittedAnswerSchema = z.object({
  questionId: z.string().uuid(),
  submittedValue: z.string(),
});

export const userSubmittedAnswersSchema = z.object({
  answers: z.array(submittedAnswerSchema),
});

export type SubmittedAnswer = z.infer<typeof submittedAnswerSchema>;
export type UserSubmittedAnswers = z.infer<typeof userSubmittedAnswersSchema>;
