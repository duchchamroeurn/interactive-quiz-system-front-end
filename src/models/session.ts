import { quizSchema, quizWithQuestionOptionSchema } from '@/models/quiz';
import { participantSchema } from './participant';
import { z } from 'zod';

export const sessionSchema = z.object({
  sessionId: z.string(),
  sessionCode: z.string(),
  startTime: z.string(),
  endTime: z.string().nullable(),
});

export const sessionWithQuizSchema = sessionSchema.pick({ sessionId: true }).extend({
  quiz: quizSchema,
})

export type SessionWithQuiz = z.infer<typeof sessionWithQuizSchema>

export type Session = z.infer<typeof sessionSchema>

export const sessionWithQuizQuestionsOptionsSchema = sessionSchema.extend({
  quiz: quizWithQuestionOptionSchema,
})

export type SessionWithQuizQuestionsOptions = z.infer<typeof sessionWithQuizQuestionsOptionsSchema>

export const sessionWithParticipantSchema = sessionSchema.extend({
  participants: z.array(participantSchema),
});

export type SessionWithParticipant = z.infer<typeof sessionWithParticipantSchema>;
