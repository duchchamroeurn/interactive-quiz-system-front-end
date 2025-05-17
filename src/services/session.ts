import { apiRequest } from '@/composables/api';
import { type UserQuizResult, userQuizResultSchema } from '@/models/result';
import { type Session, sessionSchema, type SessionWithParticipant, sessionWithParticipantSchema, type SessionWithQuizQuestionsOptions, sessionWithQuizQuestionsOptionsSchema } from '@/models/session';
import { type SuccessPageResponse, successPageResponseSchema, type SuccessResponse, successResponseSchema } from '@/models/success';
import type { TableOption } from '@/models/table';
import { z } from 'zod';

interface SessionService {
  getSessions: (option: TableOption) => Promise<SuccessPageResponse<Session>>
  detailSession: (sessionId: string) => Promise<SessionWithQuizQuestionsOptions>
  getResultSessionBy: (sessionId: string) => Promise<SessionWithParticipant>
  getResultSessionUser: (sessionId: string, userId: string) => Promise<UserQuizResult>
}

export const sessionService: SessionService = {
  getSessions: async (option: TableOption): Promise<SuccessPageResponse<Session>> => {
    const validPage = option.page > 0 ? option.page - 1 : 0;
    const url = 'session?page='+ validPage + '&size=' + option.itemsPerPage;
    const listUsers = await apiRequest<SuccessPageResponse<Session>, z.ZodType<SuccessPageResponse<Session>>>(url, 'GET', successPageResponseSchema(sessionSchema));
    return listUsers;
  },
  detailSession: async (sessionId: string): Promise<SessionWithQuizQuestionsOptions> => {
    const url = 'session/' + sessionId;
    const sessionDetail = await apiRequest<SuccessResponse<SessionWithQuizQuestionsOptions>, z.ZodType<SuccessResponse<SessionWithQuizQuestionsOptions>>>(url, 'GET', successResponseSchema(sessionWithQuizQuestionsOptionsSchema));
    return sessionDetail.data;
  },
  getResultSessionBy: async (sessionId: string): Promise<SessionWithParticipant> => {
    const url = 'answer/session/' + sessionId;
    const resultSession = await apiRequest<SuccessResponse<SessionWithParticipant>, z.ZodType<SuccessResponse<SessionWithParticipant>>>(url, 'GET', successResponseSchema(sessionWithParticipantSchema));
    return resultSession.data;
  },
  getResultSessionUser: async (sessionId: string, userId: string): Promise<UserQuizResult> => {
    const url = 'answer/session/' + sessionId +'/user/' + userId;
    const userResult = await apiRequest<SuccessResponse<UserQuizResult>, z.ZodType<SuccessResponse<UserQuizResult>>>(url, 'GET', successResponseSchema(userQuizResultSchema));
    return userResult.data;
  },
}
