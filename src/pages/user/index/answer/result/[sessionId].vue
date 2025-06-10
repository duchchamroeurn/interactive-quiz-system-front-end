<template>
  <v-container>
    <v-card class="mt-8 pa-4">
      <v-card-title class="headline text-h5 text-primary d-flex justify-space-between align-center">
        <span>{{ userAnswerResultViewModel.model.quizResult?.quiz.title || 'Loading...' }}</span>
        <v-btn
          color="secondary"
          prepend-icon="mdi-arrow-left"
          variant="flat"
          @click="userAnswerResultViewModel.goBackToAnswers"
        >
          Back to My Answers
        </v-btn>
      </v-card-title>

      <v-card-subtitle v-if="userAnswerResultViewModel.model.quizResult">
        Session Code: **{{ userAnswerResultViewModel.model.quizResult.session.sessionCode }}** | Submitted by: **{{ userAnswerResultViewModel.model.quizResult.user.username }}**
      </v-card-subtitle>

      <v-divider class="my-4" />

      <v-card-text>
        <v-alert
          v-if="userAnswerResultViewModel.model.loading"
          class="mb-4"
          type="info"
          variant="tonal"
        >
          <v-progress-circular class="mr-2" color="primary" indeterminate />
          Loading quiz results...
        </v-alert>

        <v-alert
          v-if="userAnswerResultViewModel.model.error"
          class="mb-4"
          type="error"
          variant="tonal"
        >
          {{ userAnswerResultViewModel.model.error }}
        </v-alert>

        <div v-if="!userAnswerResultViewModel.model.loading && userAnswerResultViewModel.model.quizResult">
          <v-row class="mb-6">
            <v-col cols="12" md="6">
              <v-card variant="outlined">
                <v-card-title class="text-h6">Overall Performance</v-card-title>
                <v-card-text>
                  <v-row no-gutters>
                    <v-col class="text-subtitle-1" cols="6">Total Questions:</v-col>
                    <v-col class="text-h6 text-right" cols="6">{{ userAnswerResultViewModel.model.quizResult.quiz.questions.length }}</v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col class="text-subtitle-1" cols="6">Correct Answers:</v-col>
                    <v-col class="text-h6 text-success text-right" cols="6">{{ userAnswerResultViewModel.numberCorrectAnswers }}</v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col class="text-subtitle-1" cols="6">Your Score:</v-col>
                    <v-col class="text-h6 text-right" cols="6">
                      <v-chip :color="userAnswerResultViewModel.getScoreColor(userAnswerResultViewModel.numberCorrectAnswers.value, userAnswerResultViewModel.model.quizResult.quiz.questions.length)" label size="large">
                        {{ userAnswerResultViewModel.calculateScore(userAnswerResultViewModel.numberCorrectAnswers.value, userAnswerResultViewModel.model.quizResult.quiz.questions.length) }}%
                      </v-chip>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card variant="outlined">
                <v-card-title class="text-h6">Quiz Details</v-card-title>
                <v-card-text>
                  <p><strong>Description:</strong> {{ userAnswerResultViewModel.model.quizResult.quiz.description }}</p>
                  <p><strong>Started On:</strong> {{ dateUtils.formatDate(userAnswerResultViewModel.model.quizResult.session.startTime) }}</p>
                  <p v-if="userAnswerResultViewModel.model.quizResult.session.endTime"><strong>Ended On:</strong> {{ dateUtils.formatDate(userAnswerResultViewModel.model.quizResult.session.endTime) }}</p>
                  <p v-else><strong>Status:</strong> <v-chip color="info" label size="small">In Progress / Not Ended</v-chip></p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <h3 class="text-h6 mt-6 mb-4">Questions</h3>
          <v-expansion-panels class="mb-6" variant="popout">
            <v-expansion-panel
              v-for="(question, qIndex) in userAnswerResultViewModel.model.quizResult.quiz.questions"
              :key="question.id"
              :class="userAnswerResultViewModel.getQuestionPanelClass(question)"
              :title="`Question ${qIndex + 1}: ${question.questionText}`"
            >
              <v-expansion-panel-text>
                <p><strong>Question Type:</strong> {{ userAnswerResultViewModel.getQuestionTypeDisplayName(question.type) }}</p>
                <v-list density="compact" nav>
                  <v-list-item
                    v-for="option in question.options"
                    :key="option.id!"
                    class="my-1 py-1 px-2 rounded"
                    :class="{
                      'bg-success': userAnswerResultViewModel.isCorrectOption(option),
                      'bg-error': userAnswerResultViewModel.isUserAnswer(option, question) && !userAnswerResultViewModel.isCorrectOption(option),
                      'text-decoration-line-through text-medium-emphasis': !userAnswerResultViewModel.isUserAnswer(option, question) && !userAnswerResultViewModel.isCorrectOption(option),
                      'font-weight-bold': userAnswerResultViewModel.isUserAnswer(option, question) || userAnswerResultViewModel.isCorrectOption(option)
                    }"
                  >
                    <v-list-item-title>
                      <v-icon
                        class="mr-2"
                        :color="userAnswerResultViewModel.getOptionIconColor(option, question)"
                        :icon="userAnswerResultViewModel.getOptionIcon(option, question)"
                        size="x-small"
                      />
                      {{ option.optionText }}
                      <span v-if="userAnswerResultViewModel.isUserAnswer(option, question)" class="text-caption ml-2">(Your Answer)</span>
                      <span v-if="userAnswerResultViewModel.isCorrectOption(option)" class="text-caption ml-2">(Correct)</span>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
                <p v-if="question.type === 'TRUE_FALSE' || question.type === 'YES_NO'">
                  <strong>Correct Answer:</strong>
                  <v-chip
                    class="ml-2"
                    :color="question.correctAnswer ? 'success' : 'error'"
                    label
                    size="small"
                  >
                    {{ question.correctAnswer ? 'True' : 'False' }}
                  </v-chip>
                </p>
                <v-alert
                  v-if="!userAnswerResultViewModel.isQuestionAnsweredCorrectly(question)"
                  class="mt-3"
                  density="compact"
                  type="warning"
                  variant="tonal"
                >
                  You answered this question incorrectly.
                </v-alert>
                <v-alert
                  v-else
                  class="mt-3"
                  density="compact"
                  type="success"
                  variant="tonal"
                >
                  You answered this question correctly!
                </v-alert>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
  import { dateUtils } from '@/utils/date';
  import { UserAnswerResultViewModel } from '@/viewmodel/user.result';
  import { onMounted } from 'vue';
  import { useRoute } from 'vue-router';


  const route = useRoute();

  const sessionId = (route.params as { sessionId: string }).sessionId
  const userAnswerResultViewModel = new UserAnswerResultViewModel(sessionId);

  onMounted(userAnswerResultViewModel.onMounted);
</script>

<style scoped>
.border-s-lg {
  border-left: 8px solid; /* Thick left border */
}
.border-success {
  border-color: var(--v-theme-success) !important;
}
.border-error {
  border-color: var(--v-theme-error) !important;
}
</style>
  <route lang="json">
    {
    "meta": {
    "title": "Detail Quiz Result",
    "requiresAuth": true,
    "isAdmin": false
    }
    }
  </route>
