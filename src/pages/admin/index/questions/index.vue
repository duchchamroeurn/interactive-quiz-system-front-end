<template>
  <main-content-list :loading="questionViewModel.model.loading" @create="questionViewModel.openCreateDialog()">
    <template #title>
      Question List
    </template>
    <template #action>
      Create Question
    </template>
    <template #content>
      <v-data-table
        :headers="questionViewModel.headers"
        :items="questionViewModel.model.questions"
        :loading="questionViewModel.model.loading"
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
              @click="questionViewModel.viewQuestionDetail(item)"
            >
              <v-icon>mdi-eye</v-icon>
            </v-btn>
            <v-btn
              class="mr-2"
              color="primary"
              icon
              size="small"
              title="Edit Question"
              @click="questionViewModel.openEditDialog(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              color="error"
              icon
              size="small"
              title="Delete Question"
              @click="questionViewModel.openDeleteDialog(item)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </template>
    <template #dialogs>
      <v-dialog v-model="questionViewModel.model.deleteDialog.show" max-width="500">
        <v-card>
          <v-card-title>Confirm Deletion</v-card-title>
          <v-card-text>
            Are you sure you want to delete question: <strong>{{ questionViewModel.model.deleteDialog.question?.questionText }}</strong>?
            This action cannot be undone.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="grey" @click="questionViewModel.closeDeleteDialog">Cancel</v-btn>
            <v-btn color="red" :loading="questionViewModel.model.deleteDialog.loading" @click="questionViewModel.confirmDeleteQuestion">
              <span v-if="questionViewModel.model.deleteDialog.loading">Deleting...</span>
              <span v-else>Delete</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="questionViewModel.model.editDialog.show" max-width="500">
        <v-card>
          <v-card-title>
            {{ questionViewModel.model.editMode === 'create' ? 'Create Question' : 'Edit Question' }}
          </v-card-title>
          <v-card-text>
            <v-form :ref="questionViewModel.editForm" v-model="questionViewModel.model.editFormValid">
              <v-text-field
                v-model="questionViewModel.model.editDialog.question.questionText"
                label="Question Text"
                required
                :rules="questionViewModel.questionTextRules"
              />
              <v-text-field
                v-model="questionViewModel.model.editDialog.question.time"
                label="Time Limit (seconds)"
                min="1"
                required
                :rules="questionViewModel.timeRules"
                type="number"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="grey" @click="questionViewModel.closeEditDialog">Cancel</v-btn>
            <v-btn
              color="blue"
              :disabled="!questionViewModel.model.editFormValid"
              :loading="questionViewModel.model.editDialog.loading"
              @click="questionViewModel.saveEditQuestion"
            >
              <span v-if="questionViewModel.model.editDialog.loading">Saving...</span>
              <span v-else>Save</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </main-content-list>
</template>

<script lang="ts" setup>
  import { questionViewModel } from '@/viewmodel/question';

  questionViewModel.fetchQuestions();

</script>
<route lang="json">
  {
    "meta": {
      "title": "Questions",
      "requiresAuth": true
    }
  }
</route>
