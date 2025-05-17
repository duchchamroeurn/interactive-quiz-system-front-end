import { apiRequest } from '@/composables/api';
import { type Quiz, quizSchema, quizWithQuestionOptionSchema, type QuizWithQuestionsOptions } from '@/models/quiz';
import type { QuizRequest } from '@/models/request/quiz';
import { type SuccessPageResponse, successPageResponseSchema, type SuccessResponse, successResponseSchema } from '@/models/success';
import type { TableOption } from '@/models/table';
import { z } from 'zod';

interface QuizService {
  getQuizzes: (option: TableOption) => Promise<SuccessPageResponse<Quiz>>
  detailQuiz: (quizId: string) => Promise<QuizWithQuestionsOptions>
  createQuizWithQuestions: (requestBody: QuizRequest) => Promise<Quiz>
}

export const quizService: QuizService = {
  getQuizzes: async (option: TableOption): Promise<SuccessPageResponse<Quiz>> => {
    const validPage = option.page > 0 ? option.page - 1 : 0;
    const url = 'quiz?page='+ validPage + '&size=' + option.itemsPerPage;
    const listUsers = await apiRequest<SuccessPageResponse<Quiz>, z.ZodType<SuccessPageResponse<Quiz>>>(url, 'GET', successPageResponseSchema(quizSchema));
    return listUsers;
  },
  detailQuiz: async (quizId: string): Promise<QuizWithQuestionsOptions> => {
    const url = 'quiz/' + quizId;
    const quizDetail = await apiRequest<SuccessResponse<QuizWithQuestionsOptions>, z.ZodType<SuccessResponse<QuizWithQuestionsOptions>>>(url, 'GET', successResponseSchema(quizWithQuestionOptionSchema));
    return quizDetail.data;
  },
  createQuizWithQuestions: async (requestBody: QuizRequest): Promise<Quiz> => {
    const url = 'quiz/create-with-questions';
    const quizCreate = await apiRequest<SuccessResponse<Quiz>, z.ZodType<SuccessResponse<Quiz>>>(url, 'POST', successResponseSchema(quizSchema), requestBody);
    return quizCreate.data;
  },
}
