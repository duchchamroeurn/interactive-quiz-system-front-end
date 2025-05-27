import { apiRequest } from '@/composables/api';
import { type Dropdown, dropdownSchema } from '@/models/dropdown';
import { type SuccessResponse, successResponseSchema } from '@/models/success';
import { z } from 'zod';

interface DropdownService {
  getQuizzes(searchQuery: string) : Promise<Dropdown[]>;
  getAudiences(searchQuery: string) : Promise<Dropdown[]>;
}

export const dropdownService: DropdownService = {
  async getQuizzes (searchQuery: string = ''): Promise<Dropdown[]> {
    const url = 'dropdown/quizzes?query=' + searchQuery;
    const result = await apiRequest<SuccessResponse<Dropdown[]>, z.ZodType<SuccessResponse<Dropdown[]>>>(url, 'GET', successResponseSchema(z.array(dropdownSchema)));

    return result.data;
  },
  async getAudiences (searchQuery: string = ''): Promise<Dropdown[]> {
    const url = 'dropdown/audiences?query=' + searchQuery;
    const result = await apiRequest<SuccessResponse<Dropdown[]>, z.ZodType<SuccessResponse<Dropdown[]>>>(url, 'GET', successResponseSchema(z.array(dropdownSchema)));

    return result.data;
  },
}
