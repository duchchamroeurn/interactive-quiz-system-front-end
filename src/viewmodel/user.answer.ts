import { localStorageService } from '@/composables/store';
import type { QuestionWithOptions } from '@/models/question';
import type { SubmittedAnswer } from '@/models/request/submit.answers';
import type { SessionWithQuizQuestionsOptions } from '@/models/session';
import router from '@/router';
import { answerService } from '@/services/answer';
import { sessionService } from '@/services/session';
import { computed, reactive } from 'vue';

export class UserAnswerController {
  private sessionId: string;

  constructor (sessionId: string) {
    this.sessionId = sessionId
  }

  private timerInterval: number | null = null;
  readonly model = reactive({
    quizEndMessage: '',
    quizEndedDialog: false,
    quizSession: null as SessionWithQuizQuestionsOptions | null,
    currentQuestionIndex: 0,
    userAnswers: {} as { [key: string]: string },
    totalQuizDurationSeconds: 0,
    totalQuizQuestions: 0,
    timeLeftSeconds: 0,
    quizStarted: false,
  });

  readonly currentQuestion = computed<QuestionWithOptions | undefined>(() => {
    return this.model.quizSession?.quiz.questions[this.model.currentQuestionIndex];
  });

  readonly formattedTimeLeft = computed(() => {
    const duration = this.model.timeLeftSeconds;
    return this.formattedTime(duration);
  });

  formattedTime (duration: number): string {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  readonly loadQuizSession = async () => {

    const dataResponse = await sessionService.detailSession(this.sessionId)
    this.model.quizSession = dataResponse

    // Calculate total quiz duration based on individual question times
    // If the backend `timeLimit` is per question, sum them up.
    // If `timeLimit` was a global property on `quiz`, use that instead.
    this.model.totalQuizDurationSeconds = this.model.quizSession.quiz.questions.reduce((sum, q) => sum + q.time, 0);
    this.model.totalQuizQuestions = this.model.quizSession.quiz.questions.length;
  };
  private readonly startTimer = () => {
    this.model.quizStarted = true;
    const startTime = new Date().getTime();
    const currentTime = new Date().getTime(); // Current client time
    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);

    this.model.timeLeftSeconds = Math.max(0, this.model.totalQuizDurationSeconds - elapsedSeconds);
    if (this.timerInterval) clearInterval(this.timerInterval); // Clear any existing timer

    this.timerInterval = window.setInterval(() => {
      if (this.model.timeLeftSeconds > 0) {
        this.model.timeLeftSeconds--
      } else {
        clearInterval(this.timerInterval!);
        this.timerInterval = null;
        this.model.quizEndMessage = 'Time is up! Your quiz has been automatically submitted.';
        this.model.quizEndedDialog = true;
        this.submitQuiz(true); // Automatically submit when time runs out
      }
    }, 1000); // Update every second
  };

  readonly prevQuestion = () => {
    if (this.model.currentQuestionIndex > 0) {
      this.model.currentQuestionIndex--;
    }
  };

  readonly nextQuestion = () => {
    if (this.model.currentQuestionIndex < this.model.quizSession!.quiz.questions.length - 1) {
      this.model.currentQuestionIndex++;
    }
  };

  readonly submitQuiz = async (timedOut: boolean = false) => {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    // Prepare the answers payload
    const answersPayload: SubmittedAnswer[] = [];
    for (const questionId in this.model.userAnswers) {
      const answer = this.model.userAnswers[questionId];
      answersPayload.push({
        questionId,
        submittedValue: answer,
      })
    }

    const userId = localStorageService.getUser()?.userId

    const result = await answerService.submitAnswers(this.sessionId, userId!, { answers: answersPayload });
    console.log('Subbmit result = ', timedOut)
    if (!timedOut) {
      console.log('Result = ', result)
      this.model.quizEndMessage = result
      this.model.quizEndedDialog = true;
    }
  };

  readonly closeQuizEndedDialog = () => {
    this.model.quizEndedDialog = false;
    // Redirect to results page or home, etc.
    router.back();
  };

  readonly onMounted = () => {
    this.loadQuizSession()
  }

  readonly onBeforeUnmount = () => {
    // Clear timer when component is unmounted to prevent memory leaks
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  readonly handleTryLater = () => {
    router.back();
  }

  readonly handleQuizStart = () => {
    this.startTimer()
  }
}
