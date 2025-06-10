import { localStorageService } from '@/composables/store';
import { ResponseError } from '@/models/error';
import type { SessionWithQuiz } from '@/models/session';
import router from '@/router';
import { sessionService } from '@/services/session';
import { reactive } from 'vue';

class HomeUserController {
  readonly model = reactive({
    sessionCode: '',
    availableQuizzes: [] as SessionWithQuiz[],
  })

  get userName () {
    return localStorageService.getUser()?.username;
  }

  readonly joinSession = async () => {
    const sessionCode = this.model.sessionCode.trim();
    if (sessionCode) {
      try {
        const sessionResponse = await sessionService.getSessionByCode(sessionCode)
        this.startQuiz(sessionResponse.sessionId);
      } catch (error: unknown) {
        if (error instanceof ResponseError) {
          console.log(error);
        }
      } finally {
        this.model.sessionCode = ''
      }
    }
  };

  async fetchQuizzesAvailable () {
    try {
      const userId = localStorageService.getUser()?.userId
      const pageQuizzes = await sessionService.getAvailableQuizByUser(userId!)
      this.model.availableQuizzes = pageQuizzes.data
    } catch (error) {
      console.log(error)
    }
  }

  readonly startQuiz = (sessionId: string) => {
    router.push(`/user/session/${sessionId}/answer`);
  };
}

export const homeUserController = new HomeUserController();
