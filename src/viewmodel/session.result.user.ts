import type { UserQuizResult } from '@/models/result';
import { sessionService } from '@/services/session';
import { dateUtils } from '@/utils/date';
import { reactive } from 'vue';

class SessionResultUserViewModel {

  readonly model = reactive({
    sesionResult: null as UserQuizResult | null,
  })

  async fetchSessionUserResult (sessionId: string, userId: string) {
    try {
      const userResult = await sessionService.getResultSessionUser(sessionId, userId);
      this.model.sesionResult = userResult
    }catch(error) {
      console.log('error', error)
    }finally {
      console.log('Edding.. ')
    }
  }

  get sectionSession () {
    const sessionResult = this.model.sesionResult;
    if (sessionResult) {
      return [
        { label: 'Session ID', value: sessionResult.session.sessionId },
        { label: 'Session Code', value: sessionResult.session.sessionCode },
        { label: 'Start Time', value: dateUtils.formatDate(sessionResult.session.startTime) },
        { label: 'End Time', value: sessionResult.session.endTime ? dateUtils.formatDate(sessionResult.session.endTime) : 'Ongoing' }]
    }
    return []
  }

  get sectionUser () {
    const sessionResult = this.model.sesionResult;
    if (sessionResult) {
      return [
        { label: 'User ID', value: sessionResult.user.userId },
        { label: 'Email', value: sessionResult.user.email },
        { label: 'Username', value: sessionResult.user.username },
      ]
    }
    return [];
  }

  get sectionQuiz () {
    const sessionResult = this.model.sesionResult;
    if (sessionResult) {
      return [
        { label: 'Quiz ID', value: sessionResult.quiz.id },
        { label: 'Quiz Title', value: sessionResult.quiz.title },
        { label: 'Created At', value: dateUtils.formatDate(sessionResult.quiz.createdAt) },
      ]
    }

    return []
  }

  readonly isUserAnswer = (questionId: string, optionId: string): boolean => {
    if(!this.model.sesionResult) return false;
    const answer = this.model.sesionResult?.answers.find(a => a.questionId === questionId);
    if (!answer) return false;

    const question = this.model.sesionResult.quiz.questions.find(q => q.id === questionId);
    if (!question) return false;

    if(question.type == 'MULTIPLE_CHOICE' || question.customize) {
      return answer.answerId === optionId;
    }

    const option = question.options.find(opt => opt.id === optionId)

    return String(option?.correct) == answer.answerId
  };

  readonly getUserAnswerText = (questionId: string): string => {
    if(!this.model.sesionResult) return 'Not answered';

    const question = this.model.sesionResult.quiz.questions.find(q => q.id === questionId);
    if (!question) return 'Question not found';

    const answer = this.model.sesionResult.answers.find(a => a.questionId === questionId);
    if (!answer) return 'Not answered';

    if(question.type == 'MULTIPLE_CHOICE' || question.customize) {
      const selectedOption = question.options.find(opt => opt.id === answer.answerId);
      return selectedOption ? selectedOption.optionText : 'Not answered';
    }

    const answerIndex = (answer.answerId as string).toLowerCase() === 'true' ? 0 : 1
    return question.options[answerIndex].optionText;
  };

}

export const sessionResultUserViewModel = new SessionResultUserViewModel();
