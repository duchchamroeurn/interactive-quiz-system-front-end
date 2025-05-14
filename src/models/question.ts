import { optionSchema } from '@/models/option';
import { z } from 'zod';

export const questionSchema = z.object({
  id: z.string().uuid(),
  questionText: z.string(),
  time: z.number(),
})

export type Question = z.infer<typeof questionSchema>

export const questionWithOptionSchema = questionSchema.extend({
  options: z.array(optionSchema),
})

export type QuestionWithOptions = z.infer<typeof questionWithOptionSchema>
