import { apiRequest } from '@/composables/api';
import { type User, userSchema } from '@/models/user';
import type { z } from 'zod';

interface BaseService {
  simulateDelay: (ms: number) => Promise<void>;
}
export interface AuthService extends BaseService {
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  getUser: () => User | null;
}

export const authService: AuthService = {
  simulateDelay (ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  signIn: async (email: string, pwd: string): Promise<User> => {
    const auth = await apiRequest<User, z.ZodType<User>>('auth/sign-in', 'POST', userSchema, {
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
