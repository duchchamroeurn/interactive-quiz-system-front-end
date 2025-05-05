<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card flat>
          <v-card-title>
            <v-row>
              <v-col>
                <p>
                  Quiz List
                </p>
              </v-col>
              <v-col class="text-right">
                <v-btn
                  class="ml-4"
                  color="primary"
                  @click="openCreateDialog"
                >
                  <v-icon class="mr-2">mdi-plus</v-icon>
                  Create Quiz
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="quizzes"
              :loading="loading"
              no-data-text="No quizzes found."
              no-results-text="No matching quizzes found."
            >
              <template #[`item.createdAt`]="{ item }">
                {{ formatDate(item.createdAt) }}
              </template>
              <template #[`item.actions`]="{ item }">
                <div class="d-flex justify-end">
                  <v-btn
                    class="mr-2"
                    color="info"
                    icon
                    size="small"
                    title="View Quiz Details"
                    @click="viewQuizDetail(item)"
                  >
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                  <v-btn
                    class="mr-2"
                    color="primary"
                    icon
                    size="small"
                    title="Edit Quiz"
                    @click="openEditDialog(item)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    color="error"
                    icon
                    size="small"
                    title="Delete Quiz"
                    @click="openDeleteDialog(item)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="deleteDialog.show" max-width="500">
      <v-card>
        <v-card-title>Confirm Deletion</v-card-title>
        <v-card-text>
          Are you sure you want to delete quiz: <strong>{{ deleteDialog.quiz?.title }}</strong>?
          This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" @click="closeDeleteDialog">Cancel</v-btn>
          <v-btn color="red" :loading="deleteDialog.loading" @click="confirmDeleteQuiz">
            <span v-if="deleteDialog.loading">Deleting...</span>
            <span v-else>Delete</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editDialog.show" max-width="500">
      <v-card>
        <v-card-title>
          {{ editMode === 'create' ? 'Create Quiz' : 'Edit Quiz' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="editForm" v-model="editFormValid">
            <v-text-field
              v-model="editDialog.quiz.title"
              label="Title"
              required
              :rules="titleRules"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" @click="closeEditDialog">Cancel</v-btn>
          <v-btn
            color="blue"
            :disabled="!editFormValid"
            :loading="editDialog.loading"
            @click="saveEditQuiz"
          >
            <span v-if="editDialog.loading">Saving...</span>
            <span v-else>Save</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container></template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import type { VForm } from 'vuetify/components';
  import type { Quiz } from '@/models/quiz';

  const headers = [
    { title: 'Quiz ID', value: 'id', width: '35%' },
    { title: 'Title', value: 'title', width: '35%' },
    { title: 'Created At', value: 'createdAt', width: '15%' },
    { title: 'Actions', value: 'actions', sortable: false, width: '15%' },
  ];
  const route = useRouter();
  const quizzes = ref<Quiz[]>([]);
  const loading = ref(true);
  const deleteDialog = ref({
    show: false,
    quiz: null as Quiz | null,
    loading: false,
  });

  const editDialog = ref({
    show: false,
    quiz: {} as Quiz,
    loading: false,
  });
  const editFormValid = ref(false);
  const editForm = ref<VForm | null>(null);
  const editMode = ref<'create' | 'edit'>('edit');

  const titleRules = [
    (v: string) => !!v || 'Title is required',
    (v: string) => v.length >= 3 || 'Title must be at least 3 characters',
  ];

  onMounted(() => {
    const mockResponse = {
      success: true,
      data: [
        {
          id: '15f8db0f-84f7-4cc4-9bbd-2701cce57006',
          title: 'History Quiz 101',
          createdAt: '2025-04-30T16:01:46.355996',
        },
      ],
      page: 0,
      size: 10,
      totalElements: 1,
      totalPages: 1,
      timestamp: '2025-05-03T21:36:25.173631',
    };

    setTimeout(() => {
      if (mockResponse.success) {
        quizzes.value = mockResponse.data as Quiz[];
      } else {
        console.error('Failed to fetch quizzes:', mockResponse);
      }
      loading.value = false;
    }, 500);
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      undefined,
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    );
  };

  const openDeleteDialog = (quiz: Quiz) => {
    deleteDialog.value = {
      show: true,
      quiz,
      loading: false,
    };
  };

  const closeDeleteDialog = () => {
    deleteDialog.value.show = false;
    deleteDialog.value.quiz = null;
  };

  const confirmDeleteQuiz = () => {
    if (!deleteDialog.value.quiz) return;

    deleteDialog.value.loading = true;
    // Simulate delete API call
    setTimeout(() => {
      // In a real application, you would call your delete API here
      console.log('Deleting quiz:', deleteDialog.value.quiz);
      // Remove the quiz from the list
      quizzes.value = quizzes.value.filter(q => q.id !== deleteDialog.value.quiz!.id);
      deleteDialog.value.loading = false;
      closeDeleteDialog();
    }, 500);
  };

  const openEditDialog = (quiz: Quiz) => {
    editMode.value = 'edit';
    editDialog.value = {
      show: true,
      quiz: { ...quiz },
      loading: false,
    };
  };

  const openCreateDialog = () => {
    editMode.value = 'create';
    editDialog.value = {
      show: true,
      quiz: {
        id: '',
        title: '',
        createdAt: '',
      },
      loading: false,
    };
  };

  const closeEditDialog = () => {
    editDialog.value.show = false;
    editDialog.value.quiz = {} as Quiz;
  };

  const saveEditQuiz = () => {
    if (!editForm.value?.validate()) return;

    editDialog.value.loading = true;
    // Simulate save API call
    setTimeout(() => {
      // In a real application, you would call your update API here
      console.log('Saving quiz:', editDialog.value.quiz);
      if (editMode.value === 'edit') {
        quizzes.value = quizzes.value.map(q =>
          q.id === editDialog.value.quiz.id ? { ...editDialog.value.quiz } : q
        );
      } else {
        const newQuiz = {
          ...editDialog.value.quiz,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        quizzes.value.push(newQuiz);
      }

      editDialog.value.loading = false;
      closeEditDialog();
    }, 500);
  };

  const viewQuizDetail = (quiz: Quiz) => {
    route.push('/admin/quizzes/' + quiz.id);
  };
</script>
