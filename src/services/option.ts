import { apiRequest } from '@/composables/api'
import { type Option, optionSchema } from '@/models/option'
import { z } from 'zod'

interface OptionService {
  getOptions: () => Promise<Option[]>
}
export const optionService: OptionService = {
  getOptions: async (): Promise<Option[]> => {
    const url = 'option'
    const options = await apiRequest<Option[], z.ZodType<Option[]>>(url, 'GET', z.array(optionSchema));
    return options.data
  },
}
