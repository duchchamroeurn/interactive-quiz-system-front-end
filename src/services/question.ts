import { apiRequest } from '@/composables/api';
import { type Question, questionSchema, type QuestionWithOptions, questionWithOptionSchema } from '@/models/question'
import { z } from 'zod';

interface QuestionService {
  getQuestions: () => Promise<Question[]>
  detailQuestion: (questionId: string) => Promise<QuestionWithOptions>
}

export const questionService: QuestionService = {
  getQuestions: async (): Promise<Question[]> => {
    const url = 'question';
    const listQuestions = await apiRequest<Question[], z.ZodType<Question[]>>(url, 'GET', z.array(questionSchema));
    return listQuestions.data;
  },
  detailQuestion: async (questionId: string): Promise<QuestionWithOptions> => {
    const url = 'question/' + questionId;
    const questionDetail = await apiRequest<QuestionWithOptions, z.ZodType<QuestionWithOptions>>(url, 'GET', questionWithOptionSchema);
    return questionDetail.data;
  },
}
