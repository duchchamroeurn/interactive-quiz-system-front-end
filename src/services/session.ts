import { apiRequest } from '@/composables/api';
import { type UserQuizResult, userQuizResultSchema } from '@/models/result';
import { type Session, sessionSchema, type SessionWithParticipant, sessionWithParticipantSchema, type SessionWithQuizQuestionsOptions, sessionWithQuizQuestionsOptionsSchema } from '@/models/session';
import { z } from 'zod';

interface SessionService {
  getSessions: () => Promise<Session[]>
  detailSession: (sessionId: string) => Promise<SessionWithQuizQuestionsOptions>
  getResultSessionBy: (sessionId: string) => Promise<SessionWithParticipant>
  getResultSessionUser: (sessionId: string, userId: string) => Promise<UserQuizResult>
}

export const sessionService: SessionService = {
  getSessions: async (): Promise<Session[]> => {
    const listUsers = await apiRequest<Session[], z.ZodType<Session[]>>('session', 'GET', z.array(sessionSchema));
    return listUsers.data;
  },
  detailSession: async (sessionId: string): Promise<SessionWithQuizQuestionsOptions> => {
    const url = 'session/' + sessionId;
    const sessionDetail = await apiRequest<SessionWithQuizQuestionsOptions, z.ZodType<SessionWithQuizQuestionsOptions>>(url, 'GET', sessionWithQuizQuestionsOptionsSchema);
    return sessionDetail.data;
  },
  getResultSessionBy: async (sessionId: string): Promise<SessionWithParticipant> => {
    const url = 'answer/session/' + sessionId;
    const resultSession = await apiRequest<SessionWithParticipant, z.ZodType<SessionWithParticipant>>(url, 'GET', sessionWithParticipantSchema);
    return resultSession.data;
  },
  getResultSessionUser: async (sessionId: string, userId: string): Promise<UserQuizResult> => {
    const url = 'answer/session/' + sessionId +'/user/' + userId;
    const userResult = await apiRequest<UserQuizResult, z.ZodType<UserQuizResult>>(url, 'GET', userQuizResultSchema);
    return userResult.data;
  },
}
