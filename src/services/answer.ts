import { apiRequest } from '@/composables/api';
import { type QuizSubmission, schemaQuizSubmission } from '@/models/quiz.submission';
import type { UserSubmittedAnswers } from '@/models/request/submit.answers';
import { type SuccessPageResponse, successPageResponseSchema, type SuccessResponse, successResponseSchema } from '@/models/success';
import type { TableOption } from '@/models/table';
import { z } from 'zod';

interface AnswerService {
  submitAnswers: (sessionId: string, userId: string, body: UserSubmittedAnswers) => Promise<string>
  getUserAnswers: (userId: string, option: TableOption) => Promise<SuccessPageResponse<QuizSubmission>>
}

export const answerService: AnswerService = {
  submitAnswers: async (sessionId: string, userId: string, body: UserSubmittedAnswers): Promise<string> => {
    const url = 'answer/session/' + sessionId + '/user/' + userId;
    const result = await apiRequest<SuccessResponse<string>, z.ZodType<SuccessResponse<string>>>(url, 'POST', successResponseSchema(z.string()), body);
    return result.data;
  },
  getUserAnswers: async (userId: string, option: TableOption): Promise<SuccessPageResponse<QuizSubmission>> => {
    const validPage = option.page > 0 ? option.page - 1 : 0;
    const url = 'answer/user/' + userId + '?page=' + validPage + '&size=' + option.itemsPerPage;
    const listUsers = await apiRequest<SuccessPageResponse<QuizSubmission>, z.ZodType<SuccessPageResponse<QuizSubmission>>>(url, 'GET', successPageResponseSchema(schemaQuizSubmission));
    return listUsers;
  },
}
