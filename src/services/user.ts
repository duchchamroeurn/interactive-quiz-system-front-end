import { apiRequest } from '@/composables/api';
import { type SuccessPageResponse, successPageResponseSchema } from '@/models/success';
import type { TableOption } from '@/models/table';
import { type User, userSchema } from '@/models/user';
import { z } from 'zod';

interface UserService {
  getUsers: (option: TableOption) => Promise<SuccessPageResponse<User>>
}

export const userService: UserService = {
  getUsers: async (option: TableOption): Promise<SuccessPageResponse<User>> => {
    const validPage = option.page > 0 ? option.page - 1 : 0;
    const url = 'user?page='+ validPage + '&size=' + option.itemsPerPage;
    const listUsers = await apiRequest<SuccessPageResponse<User>, z.ZodType<SuccessPageResponse<User>> >(url, 'GET', successPageResponseSchema(userSchema));
    return listUsers
  },
}
