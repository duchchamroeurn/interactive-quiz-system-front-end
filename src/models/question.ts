import { optionSchema } from '@/models/option';
import { z } from 'zod';

export const questionSchema = z.object({
  id: z.string().uuid(),
  questionText: z.string(),
  time: z.number(),
  type: z.string(),
  customize: z.boolean(),
  correctAnswer: z.boolean().nullable(),
})

export type Question = z.infer<typeof questionSchema>

export const questionWithOptionSchema = questionSchema.extend({
  options: z.array(optionSchema),
})

export type QuestionWithOptions = z.infer<typeof questionWithOptionSchema>

export type QuestionType = z.infer<typeof questionTypeSchema>;

// And in your discriminated union (or object mapping):
export const trueFalseSchema = z.object({
  type: z.literal('TRUE_FALSE'),
  title: z.literal('True/False'),
  description: z.string().optional(),
  options: z.array(optionSchema).length(2),
});

export const yesNoSchema = z.object({
  type: z.literal('YES_NO'),
  title: z.literal('Yes/No'),
  description: z.string().optional(),
  options: z.array(optionSchema).length(2),
});

export const multipleChoiceSchema = z.object({
  type: z.literal('MULTIPLE_CHOICE'),
  title: z.literal('Multiple Choice'),
  description: z.string().optional(),
  options: z.array(optionSchema).min(3).max(4),
});

export const questionTypeSchema = z.discriminatedUnion('type', [
  multipleChoiceSchema,
  trueFalseSchema,
  yesNoSchema,
]);
