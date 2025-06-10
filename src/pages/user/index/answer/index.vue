<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="9">
        <v-card class="mb-8" flat>
          <v-card-title class="text-h5 text-center mb-4">Your Submitted Quiz Answers</v-card-title>
          <v-card-text>
            <v-alert
              v-if="userSubmittedAnswerViewModel.model.error"
              class="mb-4"
              type="error"
              variant="tonal"
            >
              {{ userSubmittedAnswerViewModel.model.error }}
            </v-alert>

            <v-data-table-server
              v-model:items-per-page="userSubmittedAnswerViewModel.model.itemsPerPage"
              :headers="userSubmittedAnswerViewModel.headers"
              item-key="sessionId"
              :items="userSubmittedAnswerViewModel.model.submittedQuizzes"
              :items-length="userSubmittedAnswerViewModel.model.totalQuiz"
              :loading="userSubmittedAnswerViewModel.model.loading"
              no-data-text="You haven't submitted any quizzes yet."
              @update:options="userSubmittedAnswerViewModel.fetchSubmittedQuizzes"
            >
              <template #loading>
                <v-skeleton-loader type="table-row@5" />
              </template>

              <template #item.submittedDate="{ item }">
                {{ dateUtils.formatDate(item.submittedDate) }}
              </template>

              <template #item.score="{ item }">
                <v-chip
                  :color="userSubmittedAnswerViewModel.getScoreColor(item.numberCorrectAnswer, item.total)"
                  label
                  size="small"
                >
                  {{ userSubmittedAnswerViewModel.calculateScore(item.numberCorrectAnswer, item.total) }}%
                </v-chip>
              </template>

              <template #item.actions="{ item }">
                <v-btn
                  class="mr-2"
                  color="info"
                  icon
                  size="small"
                  title="View Quiz Details"
                  @click="userSubmittedAnswerViewModel.viewQuizResult(item)"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </template>
            </v-data-table-server>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import { dateUtils } from '@/utils/date';
  import { userSubmittedAnswerViewModel } from '@/viewmodel/user.answer.index';
</script>
  <route lang="json">
    {
    "meta": {
    "title": "Submitted Quizzess",
    "requiresAuth": true,
    "isAdmin": false
    }
    }
  </route>
