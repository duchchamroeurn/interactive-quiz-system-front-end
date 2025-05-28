import { apiRequest } from '@/composables/api';
import type { UserSubmittedAnswers } from '@/models/request/submit.answers';
import { type SuccessResponse, successResponseSchema } from '@/models/success';
import { z } from 'zod';

interface AnswerService {
  submitAnswers: (sessionId: string, userId: string, body: UserSubmittedAnswers) => Promise<string>
}

export const answerService: AnswerService = {
  submitAnswers: async (sessionId: string, userId: string, body: UserSubmittedAnswers): Promise<string> => {
    const url = 'answer/session/' + sessionId + '/user/' + userId;
    const result = await apiRequest<SuccessResponse<string>, z.ZodType<SuccessResponse<string>>>(url, 'POST', successResponseSchema(z.string()), body);
    return result.data;
  },
}
