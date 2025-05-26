import type { QuizWithQuestionsOptions } from '@/models/quiz';
import { quizService } from '@/services/quiz';
import { dateUtils } from '@/utils/date';
import { reactive } from 'vue';

class QuizDetailViewModel {

  readonly model = reactive({
    quizDetail: null as QuizWithQuestionsOptions | null,
  })

  get sectionQuiz () {
    const quizDetail = this.model.quizDetail;
    if(quizDetail) {
      return [
        { label: 'Quiz ID', value: quizDetail.id },
        { label: 'Title', value: quizDetail.title },
        { label: 'Description', value: quizDetail.description },
        { label: 'Created At', value: dateUtils.formatDate(quizDetail.createdAt) },
      ]
    }

    return []
  }

  async fetchQuizDetail (quizId: string) {
    try {
      const quizDetail = await quizService.detailQuiz(quizId)
      this.model.quizDetail = quizDetail;
    } catch(error) {
      console.log('error', error)
    } finally {
      console.log('Ending ...')
    }
  }


}

export const quizDetailViewModel = new QuizDetailViewModel();
