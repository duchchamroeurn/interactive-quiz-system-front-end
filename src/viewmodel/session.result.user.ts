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
    const answer = this.model.sesionResult?.answers.find(a => a.questionId === questionId);
    if (!answer) return false;

    if (Array.isArray(answer.answerId)) {
      return (answer.answerId as string[]).includes(optionId);
    }
    return answer.answerId === optionId;
  };

  readonly getUserAnswerText = (questionId: string): string => {
    if(!this.model.sesionResult) return 'Not answered';
    const answer = this.model.sesionResult.answers.find(a => a.questionId === questionId);
    if (!answer) return 'Not answered';

    const question = this.model.sesionResult.quiz.questions.find(q => q.id === questionId);
    if (!question) return 'Question not found';

    if (Array.isArray(answer.answerId)) {
      return question.options
        .filter(opt => (answer.answerId as string[]).includes(opt.id))
        .map(opt => opt.optionText)
        .join(', ');
    }

    const selectedOption = question.options.find(opt => opt.id === answer.answerId);
    return selectedOption ? selectedOption.optionText : 'Not answered';
  };

}

export const sessionResultUserViewModel = new SessionResultUserViewModel();
