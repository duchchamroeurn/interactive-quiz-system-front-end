import { localStorageService } from '@/composables/store';
import { ResponseError } from '@/models/error';
import type { QuizSubmission } from '@/models/quiz.submission';
import type { TableOption } from '@/models/table';
import router from '@/router';
import { answerService } from '@/services/answer';
import { simulateDelay } from '@/utils/delay';
import { reactive } from 'vue';

export class UserSubmittedAnswerViewModel {
  readonly model = reactive({
    loading: true,
    error: null as string | null,
    submittedQuizzes: [] as QuizSubmission[],
    totalQuiz: 0,
    itemsPerPage: 10,
    tableOptions: {
      page: 1,
      itemsPerPage: 10,
    } as TableOption,
  });

  readonly headers = [
    { title: 'Quiz Title', key: 'quizTitle', sortable: false },
    { title: 'Submitted Date', key: 'submittedDate', sortable: false },
    { title: 'Total Questions', key: 'total', sortable: false },
    { title: 'Correct Answers', key: 'numberCorrectAnswer', sortable: false },
    { title: 'Score', key: 'score', sortable: false },
    { title: 'Actions', key: 'actions', sortable: false },
  ];

  readonly fetchSubmittedQuizzes = async () => {
    this.model.loading = true;
    this.model.error = null;
    const userId = localStorageService.getUser()?.userId
    try {
      await simulateDelay()
      const dataResponse = await answerService.getUserAnswers(userId!, this.model.tableOptions)
      this.model.submittedQuizzes = dataResponse.data
      this.model.totalQuiz = dataResponse.totalElements
    } catch (e: unknown) {
      if (e instanceof ResponseError) {
        this.model.error = e.message || 'Failed to load your submitted quizzes. Please try again later.';
      }

    } finally {
      this.model.loading = false;
    }
  };

  readonly calculateScore = (correct: number, total: number): string => {
    if (total === 0) return '0.00';
    return ((correct / total) * 100).toFixed(2);
  };

  readonly getScoreColor = (correct: number, total: number): string => {
    const score = parseFloat(this.calculateScore(correct, total));
    if (score >= 80) return 'success';
    if (score >= 50) return 'warning';
    return 'error';
  };

  /**
   * Handles the click event for the "View Result" button.
   * In a real app, this would trigger router navigation to a detailed result page.
   * @param {QuizSubmission} quiz - The quiz submission item clicked.
   */
  readonly viewQuizResult = (quiz: QuizSubmission) => {
    router.push('/user/answer/result/' + quiz.sessionId);
  };

}

export const userSubmittedAnswerViewModel = new UserSubmittedAnswerViewModel();
