import { z } from 'zod';

export const userRoleSchema = z.enum(['ADMIN', 'AUDIENCE', 'PRESENTER']);

export const userSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  username: z.string(),
  userRole: userRoleSchema,
});

export type User = z.infer<typeof userSchema>;
export type UserRole = z.infer<typeof userRoleSchema>;
