import { apiRequest } from '@/composables/api';
import { type Question, questionSchema, type QuestionWithOptions, questionWithOptionSchema } from '@/models/question'
import { type SuccessPageResponse, successPageResponseSchema, type SuccessResponse, successResponseSchema } from '@/models/success';
import type { TableOption } from '@/models/table';
import { z } from 'zod';

interface QuestionService {
  getQuestions: (option: TableOption) => Promise<SuccessPageResponse<Question>>
  detailQuestion: (questionId: string) => Promise<QuestionWithOptions>
}

export const questionService: QuestionService = {
  getQuestions: async (option: TableOption): Promise<SuccessPageResponse<Question>> => {
    const validPage = option.page > 0 ? option.page - 1 : 0;
    const url = 'question?page='+ validPage + '&size=' + option.itemsPerPage;
    const listQuestions = await apiRequest<SuccessPageResponse<Question>, z.ZodType<SuccessPageResponse<Question>>>(url, 'GET', successPageResponseSchema(questionSchema));
    return listQuestions
  },
  detailQuestion: async (questionId: string): Promise<QuestionWithOptions> => {
    const url = 'question/' + questionId;
    const questionDetail = await apiRequest<SuccessResponse<QuestionWithOptions>, z.ZodType<SuccessResponse<QuestionWithOptions>>>(url, 'GET', successResponseSchema(questionWithOptionSchema));
    return questionDetail.data;
  },
}
