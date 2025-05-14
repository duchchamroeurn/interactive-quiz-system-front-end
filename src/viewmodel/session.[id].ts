import type { SessionWithQuizQuestionsOptions } from '@/models/session';
import { sessionService } from '@/services/session';
import { dateUtils } from '@/utils/date';
import { reactive } from 'vue';

class SessionDetailViewModel {

  readonly model = reactive({
    session: null as SessionWithQuizQuestionsOptions | null,
  })

  get sectionSession () {
    const session = this.model.session;
    if (session) {
      return [
        { label: 'Session ID', value: session.sessionId },
        { label: 'Session Code', value: session.sessionCode },
        { label: 'Start Time', value: dateUtils.formatDate(session.startTime) },
        { label: 'End Time', value: session.endTime ? dateUtils.formatDate(session.endTime) : 'Ongoing' },
      ]
    }
    return []
  }

  get sectionQuiz () {
    const session = this.model.session;
    if (session) {
      return [
        { label: 'Quiz ID', value: session.quiz.id },
        { label: 'Title', value: session.quiz.title },
        { label: 'Created At', value: dateUtils.formatDate(session.quiz.createdAt) }]
    }
    return []
  }

  async fetchSessionDetail (sessionId: string) {
    try {
      const sessionDetail = await sessionService.detailSession(sessionId);
      this.model.session = sessionDetail
      console.log('result ', sessionDetail)
    } catch(error) {
      console.log('error ', error)
    } finally {
      console.log('End..')
    }

  }
}

export const sessionDetailViewModel = new SessionDetailViewModel();
