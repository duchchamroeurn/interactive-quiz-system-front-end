import { localStorageService } from '@/composables/store';
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

  readonly joinSession = () => {
    if (this.model.sessionCode.trim()) {
      console.log(`Joining session with code: ${this.model.sessionCode.trim()}`);
      // Implement API call to join session
      // On success, navigate to the quiz session page, passing the session ID
      // Example: router.push(`/quiz-session/${sessionCode.value.trim()}`);
      alert(`Attempting to join session: ${this.model.sessionCode.trim()}`);
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
