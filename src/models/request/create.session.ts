import { z } from 'zod';

export const createSessionSchema = z.object({
  quizId: z.string().uuid(),
  users: z.array(z.string().uuid()),
});

export type CreateSessionRequest = z.infer<typeof createSessionSchema>;
