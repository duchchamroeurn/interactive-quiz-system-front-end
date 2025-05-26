import type { SessionWithQuizQuestionsOptions } from '@/models/session';
import { sessionService } from '@/services/session';
import { dateUtils } from '@/utils/date';
import { simulateDelay } from '@/utils/delay';
import { reactive } from 'vue';

class SessionDetailViewModel {

  readonly model = reactive({
    loading: false,
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
        { label: 'Description', value: session.quiz.description },
        { label: 'Created At', value: dateUtils.formatDate(session.quiz.createdAt) }]
    }
    return []
  }

  async fetchSessionDetail (sessionId: string) {
    this.model.loading = true;
    try {
      await simulateDelay()
      const sessionDetail = await sessionService.detailSession(sessionId);
      this.model.session = sessionDetail;
      console.log('result ', sessionDetail)
    } catch(error) {
      console.log('error ', error)
    } finally {
      this.model.loading = false;
    }

  }
}

export const sessionDetailViewModel = new SessionDetailViewModel();
