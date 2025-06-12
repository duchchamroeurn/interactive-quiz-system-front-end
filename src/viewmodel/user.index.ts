import { localStorageService } from '@/composables/store';
import { ResponseError } from '@/models/error';
import type { SessionWithQuiz } from '@/models/session';
import router from '@/router';
import { sessionService } from '@/services/session';
import { reactive } from 'vue';

class HomeUserController {
  readonly model = reactive({
    sessionCode: '',
    errorJoinSession: null as string | null,
    availableQuizzes: [] as SessionWithQuiz[],
    publicQuizzes: [] as SessionWithQuiz[],
  })

  get userName () {
    return localStorageService.getUser()?.username;
  }

  readonly onForcusSessionCode = () => {
    this.model.errorJoinSession = null
  }

  readonly joinSession = async () => {
    const sessionCode = this.model.sessionCode.trim();
    const userId = localStorageService.getUser()?.userId
    if (sessionCode && userId) {
      try {
        const sessionResponse = await sessionService.joinSessionByCode(sessionCode, userId)
        this.startQuiz(sessionResponse.sessionId);
      } catch (error: unknown) {
        if (error instanceof ResponseError) {
          this.model.errorJoinSession = 'The content you are trying to access does not exist.'
        }
      } finally {
        this.model.sessionCode = ''
      }
    }
  };

  async fetchQuizzesAvailable () {
    try {
      const userId = localStorageService.getUser()?.userId
      const avabileQuizzes = await sessionService.getAvailableQuizByUser(userId!, null)
      const publicAvabileQuizzes = await sessionService.getAvailableQuizByUser(userId!, 'PUBLIC')
      this.model.availableQuizzes = avabileQuizzes.data
      this.model.publicQuizzes = publicAvabileQuizzes.data
    } catch (error) {
      console.log(error)
    }
  }

  readonly startQuiz = (sessionId: string) => {
    router.push(`/user/session/${sessionId}/answer`);
  };

  readonly goToMyAnswers = () => {
    router.push('/user/answer');
  };
}

export const homeUserController = new HomeUserController();
