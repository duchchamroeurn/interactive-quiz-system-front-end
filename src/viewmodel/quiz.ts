import type { Quiz } from '@/models/quiz';
import type { TableOption } from '@/models/table';
import router from '@/router';
import { quizService } from '@/services/quiz';
import { simulateDelay } from '@/utils/delay';
import { reactive, ref } from 'vue';
import type { VForm } from 'vuetify/components';

class QuizViewModel {

  readonly model = reactive({
    quizzes: [] as Quiz[],
    loading: false,
    totalQuiz: 0,
    itemsPerPage: 10,
    tableOptions: {
      page: 1,
      itemsPerPage: 10,
    } as TableOption,
    deleteDialog: {
      show: false,
      quiz: null as Quiz | null,
      loading: false,
    },
    editDialog: {
      show: false,
      quiz: {} as Quiz,
      loading: false,
    },
    editFormValid: false,
    editMode: 'edit' as 'create' | 'edit',
  })
  readonly headers = [
    { title: 'Title', key: 'title', sortable: false },
    { title: 'Created At', key: 'createdAt', sortable: false },
    { title: 'Actions', key: 'actions', sortable: false },
  ];

  editForm = ref<VForm | null>(null);

  readonly fetchQuizzes = async (option: TableOption) => {
    this.model.tableOptions = option;
    this.model.loading = true;
    try {
      await simulateDelay();
      const quizzes = await quizService.getQuizzes(option);
      this.model.quizzes = quizzes.data;
      this.model.totalQuiz = quizzes.totalElements;
    } catch(error) {
      console.log('error', error)
    } finally {
      this.model.loading = false;
    }
  }

  readonly openDeleteDialog = (quiz: Quiz) => {
    this.model.deleteDialog = {
      show: true,
      quiz,
      loading: false,
    };
  };

  readonly closeDeleteDialog = () => {
    this.model.deleteDialog.show = false;
    this.model.deleteDialog.quiz = null;
  };

  readonly titleRules = [
    (v: string) => !!v || 'Title is required',
    (v: string) => v.length >= 3 || 'Title must be at least 3 characters',
  ];

  readonly confirmDeleteQuiz = async () => {
    if (!this.model.deleteDialog.quiz) return;

    this.model.deleteDialog.loading = true;
    const quizId = this.model.deleteDialog.quiz.id;
    await simulateDelay();
    await quizService.deleteQuiz(quizId);

    this.model.deleteDialog.loading = false;
    this.closeDeleteDialog();
    this.refreshData()
  };

  readonly openEditDialog = (quiz: Quiz) => {
    this.model.editMode = 'edit';
    this.model.editDialog = {
      show: true,
      quiz: { ...quiz },
      loading: false,
    };
  };

  readonly openCreateDialog = () => {
    router.push('/admin/quizzes/create')
  };

  private refreshData = () => {
    this.fetchQuizzes(this.model.tableOptions)
  }

  readonly closeEditDialog = () => {
    this.model.editDialog.show = false;
    this.model.editDialog.quiz = {} as Quiz;
  };

  readonly saveEditQuiz = () => {
    if (!this.editForm.value?.validate()) return;

    this.model.editDialog.loading = true;
    // Simulate save API call
    setTimeout(() => {
      // In a real application, you would call your update API here
      console.log('Saving quiz:', this.model.editDialog.quiz);
      if (this.model.editMode === 'edit') {
        this.model.quizzes = this.model.quizzes.map(q =>
          q.id === this.model.editDialog.quiz.id ? { ...this.model.editDialog.quiz } : q
        );
      } else {
        const newQuiz = {
          ...this.model.editDialog.quiz,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        this.model.quizzes.push(newQuiz);
      }

      this.model.editDialog.loading = false;
      this.closeEditDialog();
    }, 500);
  };

  readonly viewQuizDetail = (quiz: Quiz) => {
    router.push('/admin/quizzes/' + quiz.id);
  };
}

export const quizViewModel = new QuizViewModel();
