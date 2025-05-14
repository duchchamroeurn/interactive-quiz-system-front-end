import type { Participant } from '@/models/participant';
import type { SessionWithParticipant } from '@/models/session';
import router from '@/router';
import { sessionService } from '@/services/session';
import { dateUtils } from '@/utils/date';
import { reactive } from 'vue';

class SessionResultViewModel {
  readonly headers = [
    { title: 'User ID', value: 'userId' },
    { title: 'Email', value: 'email' },
    { title: 'Username', value: 'username' },
    { title: 'Exam Result', value: 'examResult' },
    { title: 'Total Point', value: 'totalPoint' },
    { title: 'Earned Point', value: 'totalEarnedPoint' },
    { title: 'Percentage', value: 'percentage' },
    { title: 'Actions', value: 'actions', sortable: false },
  ];

  get sectionSessionResult () {
    const sessionResult = this.model.sessionResult
    if (sessionResult) {
      return [
        { label: 'Session ID', value: sessionResult.sessionId },
        { label: 'Session Code', value: sessionResult.sessionCode },
        { label: 'Start Time', value: dateUtils.formatDate(sessionResult.startTime) },
        { label: 'End Time', value: sessionResult.endTime ? dateUtils.formatDate(sessionResult.endTime) : 'Ongoing' }]
    }

    return []
  }

  readonly model = reactive({
    sessionResult: null as SessionWithParticipant | null,
    loading: false,
  })

  async fetchResultBySession (sessionId: string) {
    this.model.loading = true
    try {
      const result = await sessionService.getResultSessionBy(sessionId);
      this.model.sessionResult = result;
    } catch (error) {
      console.log('error', error);
    } finally {
      this.model.loading = false
    }
  }

  readonly viewQuizDetail = (participant: Participant) => {
    const sessionId = this.model.sessionResult?.sessionId;
    if (sessionId) {
      router.push('/admin/sessions/'+ sessionId +'/user/' + participant.userId)
    }
  };
}

export const sessionResultViewModel = new SessionResultViewModel();
