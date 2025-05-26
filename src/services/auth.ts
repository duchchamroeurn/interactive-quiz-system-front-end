import { apiRequest } from '@/composables/api';
import { type SuccessResponse, successResponseSchema } from '@/models/success';
import { type User, userSchema } from '@/models/user';
import type { z } from 'zod';
export interface AuthService {
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  getUser: () => User | null;
}
export const authService: AuthService = {
  signIn: async (email: string, pwd: string): Promise<User> => {
    const auth = await apiRequest<SuccessResponse<User>, z.ZodType<SuccessResponse<User>>>('auth/sign-in', 'POST', successResponseSchema(userSchema), {
      username: email,
      password: pwd,
    })

    return auth.data
  },
  signOut (): Promise<void> {
    throw new Error('Function not implemented.');
  },
  getUser (): User | null {
    throw new Error('Function not implemented.');
  },
}
