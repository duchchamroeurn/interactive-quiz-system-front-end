import { apiRequest } from '@/composables/api';
import { type User, userSchema } from '@/models/user';
import { z } from 'zod';

interface UserService {
  getUsers: () => Promise<User[]>
}

export const userService: UserService = {
  getUsers: async (): Promise<User[]> => {
    const listUsers = await apiRequest<User[], z.ZodType<User[]> >('user', 'GET', z.array(userSchema));
    return listUsers.data
  },
}
