import { ResponseError } from '@/models/error';
import type { Question } from '@/models/question';
import type { TableOption } from '@/models/table';
import router from '@/router';
import { questionService } from '@/services/question';
import { simulateDelay } from '@/utils/delay';
import { reactive } from 'vue';

class QuestionViewModel {

  readonly headers = [
    { title: 'Question ID', key: 'id', width: '40%' },
    { title: 'Question Text', key: 'questionText', width: '40%' },
    { title: 'Time Limit (s)', key: 'time', width: '10%' },
    { title: 'Actions', key: 'actions', sortable: false, width: '10%' },
  ];

  readonly model = reactive({
    loading: false,
    questions: [] as Question[],
    totalQuestions: 0,
    itemsPerPage: 10,
  })

  readonly fetchQuestions = async (option: TableOption) => {
    this.model.loading = true;
    await simulateDelay();
    try {
      const quesitons = await questionService.getQuestions(option);
      this.model.loading = false;
      this.model.questions = quesitons.data;
      this.model.totalQuestions = quesitons.totalElements;
    } catch(error) {
      if(error instanceof ResponseError) {
        console.log(error.stack);
      }
    }
  }

  readonly viewQuestionDetail = (question: Question) => {
    router.push('/admin/questions/' + question.id);
  };
}

export const questionViewModel = new QuestionViewModel();
