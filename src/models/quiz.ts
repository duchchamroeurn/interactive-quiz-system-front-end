import { questionWithOptionSchema } from '@/models/question';
import { z } from 'zod';

export const quizSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  createdAt: z.string(),
})

export type Quiz = z.infer<typeof quizSchema>

export const quizWithQuestionOptionSchema = quizSchema.extend({
  questions: z.array(questionWithOptionSchema),
})

export type QuizWithQuestionsOptions = z.infer<typeof quizWithQuestionOptionSchema>
