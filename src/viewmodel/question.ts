import type { Question } from '@/models/question';
import router from '@/router';
import { questionService } from '@/services/question';
import { simulateDelay } from '@/utils/delay';
import { reactive, ref } from 'vue';
import type { VForm } from 'vuetify/components';

class QuestionViewModel {

  readonly headers = [
    { title: 'Question ID', value: 'id', width: '40%' },
    { title: 'Question Text', value: 'questionText', width: '40%' },
    { title: 'Time Limit (s)', value: 'time', width: '10%' },
    { title: 'Actions', value: 'actions', sortable: false, width: '10%' },
  ];

  readonly questionTextRules = [
    (v: string) => !!v || 'Question Text is required',
    (v: string) => v.length >= 5 || 'Question Text must be at least 5 characters',
  ];
  readonly timeRules = [
    (v: number) => !!v || 'Time Limit is required',
    (v: number) => v > 0 || 'Time Limit must be greater than 0',
  ];

  editForm = ref<VForm | null>(null);

  readonly model = reactive({
    loading: false,
    questions: [] as Question[],
    editFormValid: false,
    editMode: 'edit' as 'edit' | 'create',
    editDialog: {
      show: false,
      question: {} as Question,
      loading: false,
    },
    deleteDialog: {
      show: false,
      question: null as Question | null,
      loading: false,
    },
  })

  async fetchQuestions () {
    this.model.loading = true;
    try {
      await simulateDelay()
      const questions = await questionService.getQuestions();
      this.model.questions = questions
    }catch(error) {
      console.log('error', error);
    } finally {
      this.model.loading = false;
    }
  }

  readonly openDeleteDialog = (question: Question) => {
    this.model.deleteDialog = {
      show: true,
      question,
      loading: false,
    };
  };

  readonly closeDeleteDialog = () => {
    this.model.deleteDialog.show = false;
    this.model.deleteDialog.question = null;
  };

  readonly confirmDeleteQuestion = () => {
    if (!this.model.deleteDialog.question) return;

    this.model.deleteDialog.loading = true;
    // Simulate delete API call
    setTimeout(() => {
      // In a real application, you would call your delete API here
      console.log('Deleting question:', this.model.deleteDialog.question);
      // Remove the question from the list
      this.model.questions = this.model.questions.filter(q => q.id !== this.model.deleteDialog.question!.id);
      this.model.deleteDialog.loading = false;
      this.closeDeleteDialog();
    }, 500);
  };

  readonly openEditDialog = (question: Question) => {
    this.model.editMode = 'edit';
    this.model.editDialog = {
      show: true,
      question: { ...question },
      loading: false,
    };
  };

  readonly openCreateDialog = () => {
    this.model.editMode = 'create';
    this.model.editDialog = {
      show: true,
      question: {
        id: '',
        questionText: '',
        time: 60, // Default time
      },
      loading: false,
    };
  };

  readonly closeEditDialog = () => {
    this.model.editDialog.show = false;
    this.model.editDialog.question = {} as Question;
  };

  readonly saveEditQuestion = () => {
    if (!this.editForm.value?.validate()) return;

    this.model.editDialog.loading = true;
    // Simulate save API call
    setTimeout(() => {
      // In a real application, you would call your update API here
      console.log('Saving question:', this.model.editDialog.question);
      if (this.model.editMode === 'edit') {
        this.model.questions = this.model.questions.map(q =>
          q.id === this.model.editDialog.question.id ? { ...this.model.editDialog.question } : q
        );
      } else {
        const newQuestion = {
          ...this.model.editDialog.question,
          id: crypto.randomUUID(),
        };
        this.model.questions.push(newQuestion);
      }

      this.model.editDialog.loading = false;
      this.closeEditDialog();
    }, 500);
  };

  readonly viewQuestionDetail = (question: Question) => {
    router.push('/admin/questions/' + question.id);
  };
}

export const questionViewModel = new QuestionViewModel();
