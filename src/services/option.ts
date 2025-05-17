import { apiRequest } from '@/composables/api'
import { type Option, optionSchema } from '@/models/option'
import { type SuccessPageResponse, successPageResponseSchema } from '@/models/success'
import type { TableOption } from '@/models/table'
import { z } from 'zod'

interface OptionService {
  getOptions: (option: TableOption) => Promise<SuccessPageResponse<Option>>
}
export const optionService: OptionService = {
  getOptions: async (option: TableOption): Promise<SuccessPageResponse<Option>> => {
    const validPage = option.page > 0 ? option.page - 1 : 0;
    const url = 'option?page='+ validPage + '&size=' + option.itemsPerPage;
    const options = await apiRequest<SuccessPageResponse<Option>, z.ZodType<SuccessPageResponse<Option>>>(url, 'GET', successPageResponseSchema(optionSchema));
    return options
  },
}
