<template>
  <main-content-list :loading="false" @create="quizViewModel.openCreateDialog()">
    <template #title>
      Quiz List
    </template>
    <template #action>
      Create Quiz
    </template>
    <template #content>
      <v-data-table-server
        v-model:items-per-page="quizViewModel.model.itemsPerPage"
        :headers="quizViewModel.headers"
        :items="quizViewModel.model.quizzes"
        :items-length="quizViewModel.model.totalQuiz"
        :loading="quizViewModel.model.loading"
        no-data-text="No quizzes found."
        no-results-text="No matching quizzes found."
        @update:options="quizViewModel.fetchQuizzes"
      >
        <template #[`item.createdAt`]="{ item }">
          {{ dateUtils.formatDate(item.createdAt) }}
        </template>
        <template #[`item.actions`]="{ item }">
          <div class="d-flex justify-end">
            <v-btn
              class="mr-2"
              color="info"
              icon
              size="small"
              title="View Quiz Details"
              @click="quizViewModel.viewQuizDetail(item)"
            >
              <v-icon>mdi-eye</v-icon>
            </v-btn>
            <v-btn
              class="mr-2"
              color="primary"
              icon
              size="small"
              title="Edit Quiz"
              @click="quizViewModel.openEditDialog(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              color="error"
              icon
              size="small"
              title="Delete Quiz"
              @click="quizViewModel.openDeleteDialog(item)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table-server>
    </template>
    <template #dialogs>

      <v-dialog v-model="quizViewModel.model.deleteDialog.show" max-width="500">
        <v-card>
          <v-card-title>Confirm Deletion</v-card-title>
          <v-card-text>
            Are you sure you want to delete quiz: <strong>{{ quizViewModel.model.deleteDialog.quiz?.title }}</strong>?
            This action cannot be undone.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="grey" @click="quizViewModel.closeDeleteDialog">Cancel</v-btn>
            <v-btn color="red" :loading="quizViewModel.model.deleteDialog.loading" @click="quizViewModel.confirmDeleteQuiz">
              <span v-if="quizViewModel.model.deleteDialog.loading">Deleting...</span>
              <span v-else>Delete</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="quizViewModel.model.editDialog.show" max-width="500">
        <v-card>
          <v-card-title>
            {{ quizViewModel.model.editMode === 'create' ? 'Create Quiz' : 'Edit Quiz' }}
          </v-card-title>
          <v-card-text>
            <v-form :ref="quizViewModel.editForm" v-model="quizViewModel.model.editFormValid">
              <v-text-field
                v-model="quizViewModel.model.editDialog.quiz.title"
                label="Title"
                required
                :rules="quizViewModel.titleRules"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="grey" @click="quizViewModel.closeEditDialog">Cancel</v-btn>
            <v-btn
              color="blue"
              :disabled="!quizViewModel.model.editFormValid"
              :loading="quizViewModel.model.editDialog.loading"
              @click="quizViewModel.saveEditQuiz"
            >
              <span v-if="quizViewModel.model.editDialog.loading">Saving...</span>
              <span v-else>Save</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </main-content-list>

</template>
  <script lang="ts" setup>
  import { dateUtils } from '@/utils/date';
  import { quizViewModel } from '@/viewmodel/quiz';

  </script>
  <route lang="json">
    {
    "meta": {
    "title": "Quizzes",
    "requiresAuth": true,
    "isAdmin": true
    }
    }
  </route>
