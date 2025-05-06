<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card flat>
          <v-card-title>
            <v-row>
              <v-col>
                <p>
                  Question List
                </p>
              </v-col>
              <v-col class="text-right">
                <v-btn
                  class="ml-4"
                  color="primary"
                  @click="openCreateDialog"
                >
                  <v-icon class="mr-2">mdi-plus</v-icon>
                  Create Question
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
              :items="questions ?? []"
              :loading="loading"
              no-data-text="No questions found."
              no-results-text="No matching questions found."
            >
              <template #[`item.actions`]="{ item }">
                <div class="d-flex justify-end">
                  <v-btn
                    class="mr-2"
                    color="info"
                    icon
                    size="small"
                    title="View Question Details"
                    @click="viewQuestionDetail(item)"
                  >
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                  <v-btn
                    class="mr-2"
                    color="primary"
                    icon
                    size="small"
                    title="Edit Question"
                    @click="openEditDialog(item)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    color="error"
                    icon
                    size="small"
                    title="Delete Question"
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
          Are you sure you want to delete question: <strong>{{ deleteDialog.question?.questionText }}</strong>?
          This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" @click="closeDeleteDialog">Cancel</v-btn>
          <v-btn color="red" :loading="deleteDialog.loading" @click="confirmDeleteQuestion">
            <span v-if="deleteDialog.loading">Deleting...</span>
            <span v-else>Delete</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editDialog.show" max-width="500">
      <v-card>
        <v-card-title>
          {{ editMode === 'create' ? 'Create Question' : 'Edit Question' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="editForm" v-model="editFormValid">
            <v-text-field
              v-model="editDialog.question.questionText"
              label="Question Text"
              required
              :rules="questionTextRules"
            />
            <v-text-field
              v-model="editDialog.question.time"
              label="Time Limit (seconds)"
              min="1"
              required
              :rules="timeRules"
              type="number"
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
            @click="saveEditQuestion"
          >
            <span v-if="editDialog.loading">Saving...</span>
            <span v-else>Save</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import type { VForm } from 'vuetify/components';
  import type { Question } from '@/models/question';
  import { useApi } from '@/composables/api';

  const headers = [
    { title: 'Question ID', value: 'id', width: '40%' },
    { title: 'Question Text', value: 'questionText', width: '40%' },
    { title: 'Time Limit (s)', value: 'time', width: '10%' },
    { title: 'Actions', value: 'actions', sortable: false, width: '10%' },
  ];

  const fetchQuestion = useApi<Question[]>('http://localhost:9099/api/v1/question')
  const questions = fetchQuestion.data;
  const loading = fetchQuestion.loading;
  const route = useRouter();
  const deleteDialog = ref({
    show: false,
    question: null as Question | null,
    loading: false,
  });

  const editDialog = ref({
    show: false,
    question: {} as Question,
    loading: false,
  });
  const editFormValid = ref(false);
  const editForm = ref<VForm | null>(null);
  const editMode = ref<'create' | 'edit'>('edit');

  const questionTextRules = [
    (v: string) => !!v || 'Question Text is required',
    (v: string) => v.length >= 5 || 'Question Text must be at least 5 characters',
  ];
  const timeRules = [
    (v: number) => !!v || 'Time Limit is required',
    (v: number) => v > 0 || 'Time Limit must be greater than 0',
  ];
  const openDeleteDialog = (question: Question) => {
    deleteDialog.value = {
      show: true,
      question,
      loading: false,
    };
  };

  const closeDeleteDialog = () => {
    deleteDialog.value.show = false;
    deleteDialog.value.question = null;
  };

  const confirmDeleteQuestion = () => {
    if (!deleteDialog.value.question) return;

    deleteDialog.value.loading = true;
    // Simulate delete API call
    setTimeout(() => {
      // In a real application, you would call your delete API here
      console.log('Deleting question:', deleteDialog.value.question);
      // Remove the question from the list
      questions.value = questions.value!.filter(q => q.id !== deleteDialog.value.question!.id);
      deleteDialog.value.loading = false;
      closeDeleteDialog();
    }, 500);
  };

  const openEditDialog = (question: Question) => {
    editMode.value = 'edit';
    editDialog.value = {
      show: true,
      question: { ...question },
      loading: false,
    };
  };

  const openCreateDialog = () => {
    editMode.value = 'create';
    editDialog.value = {
      show: true,
      question: {
        id: '',
        questionText: '',
        time: 60, // Default time
      },
      loading: false,
    };
  };

  const closeEditDialog = () => {
    editDialog.value.show = false;
    editDialog.value.question = {} as Question;
  };

  const saveEditQuestion = () => {
    if (!editForm.value?.validate()) return;

    editDialog.value.loading = true;
    // Simulate save API call
    setTimeout(() => {
      // In a real application, you would call your update API here
      console.log('Saving question:', editDialog.value.question);
      if (editMode.value === 'edit') {
        questions.value = questions.value!.map(q =>
          q.id === editDialog.value.question.id ? { ...editDialog.value.question } : q
        );
      } else {
        const newQuestion = {
          ...editDialog.value.question,
          id: crypto.randomUUID(),
        };
        questions.value!.push(newQuestion);
      }

      editDialog.value.loading = false;
      closeEditDialog();
    }, 500);
  };

  const viewQuestionDetail = (question: Question) => {
    route.push('/admin/questions/' + question.id);
  };
</script>
<route lang="json">
  {
    "meta": {
      "title": "Questions",
      "requiresAuth": true
    }
  }
</route>
