import { z } from 'zod';

export const participantSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  username: z.string(),
  examResult: z.boolean(),
  totalPoint: z.number(),
  totalEarnedPoint: z.number(),
  percentage: z.number(),
});

export type Participant = z.infer<typeof participantSchema>;
