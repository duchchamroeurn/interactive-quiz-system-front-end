import { z } from 'zod';

export const optionSchema = z.object({
  id: z.string().uuid().nullable(),
  optionText: z.string(),
  correct: z.boolean(),
});

export type Option = z.infer<typeof optionSchema>;
