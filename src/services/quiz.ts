import { apiRequest } from '@/composables/api';
import { type Quiz, quizSchema, quizWithQuestionOptionSchema, type QuizWithQuestionsOptions } from '@/models/quiz';
import { z } from 'zod';

interface QuizService {
  getQuizzes: () => Promise<Quiz[]>
  detailQuiz: (quizId: string) => Promise<QuizWithQuestionsOptions>
}

export const quizService: QuizService = {
  getQuizzes: async (): Promise<Quiz[]> => {
    const listUsers = await apiRequest<Quiz[], z.ZodType<Quiz[]>>('quiz', 'GET', z.array(quizSchema));
    return listUsers.data;
  },
  detailQuiz: async (quizId: string): Promise<QuizWithQuestionsOptions> => {
    const url = 'quiz/' + quizId;
    const quizDetail = await apiRequest<QuizWithQuestionsOptions, z.ZodType<QuizWithQuestionsOptions>>(url, 'GET', quizWithQuestionOptionSchema);
    return quizDetail.data;
  },
}
