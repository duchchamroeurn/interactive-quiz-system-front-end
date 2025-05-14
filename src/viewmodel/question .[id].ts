import type { QuestionWithOptions } from '@/models/question';
import { questionService } from '@/services/question';
import { reactive } from 'vue';

class QuestionDetailViewModel {
  readonly model = reactive({
    questionDetail: null as QuestionWithOptions | null,
  })

  get sectionQuestion () {

    const question = this.model.questionDetail;
    if (question) {
      return [
        { label: 'Question ID', value: question.id },
        { label: 'Time Limit', value: `${question.time} seconds ` },
      ]
    }
    return []
  }

  async fetchQuestionDetail (questionId: string) {
    try {
      const questionDetail = await questionService.detailQuestion(questionId);
      this.model.questionDetail = questionDetail;
    } catch(error) {
      console.log('error', error)
    }
  }
}

export const questionDetailViewModel = new QuestionDetailViewModel();
