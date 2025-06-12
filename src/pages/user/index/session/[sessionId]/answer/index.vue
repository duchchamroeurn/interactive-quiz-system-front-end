<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card v-if="userAnswerController.model.quizSession" class="pa-6 mb-8">
          <v-card-title class="text-h4 text-center mb-4">{{ userAnswerController.model.quizSession!.quiz.title }}</v-card-title>
          <v-card-subtitle class="text-center text-body-1 mb-4">{{ userAnswerController.model.quizSession!.quiz.description }}</v-card-subtitle>

          <v-divider class="my-4" />
          <div v-if="!userAnswerController.model.quizStarted">
            <v-card flat>
              <v-card-title>
                <div class="text-h6 mb-3">Quiz Overview:</div>
              </v-card-title>
              <v-card-text>
                <v-row class="mb-6" justify="center">
                  <v-col cols="12" sm="6">
                    <v-card class="pa-4 text-center quiz-detail-card" flat>
                      <v-icon class="mb-2" color="primary" size="48">mdi-help-box</v-icon>
                      <div class="text-h5 font-weight-bold">{{ userAnswerController.model.totalQuizQuestions }}</div>
                      <div class="text-subtitle-1 text-medium-emphasis">Questions</div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-card class="pa-4 text-center quiz-detail-card" flat>
                      <v-icon class="mb-2" color="info" size="48">mdi-timer-outline</v-icon>
                      <div class="text-h5 font-weight-bold">{{ userAnswerController.formattedTime(userAnswerController.model.totalQuizDurationSeconds) }}</div>
                      <div class="text-subtitle-1 text-medium-emphasis">Minutes Duration</div>
                    </v-card>
                  </v-col>
                </v-row>
                <v-divider class="my-4" />

                <div class="text-h6 mb-3">Important Instructions:</div>
                <v-alert
                  class="text-left mb-6"
                  density="compact"
                  icon="mdi-information-outline"
                  type="info"
                  variant="tonal"
                >
                  <template #text>
                    <ul class="instruction-list">
                      <li>This quiz contains **{{ userAnswerController.model.totalQuizQuestions }} questions**.</li>
                      <li>You have **{{ userAnswerController.formattedTime(userAnswerController.model.totalQuizDurationSeconds) }} minutes** to complete the quiz.</li>
                      <li>The quiz will **automatically submit** once the time limit expires.</li>
                      <li>**DO NOT refresh the page** or close your browser tab after starting the quiz. Doing so may result in your answers being lost and the quiz marked as incomplete.</li>
                      <li>This quiz can be attempted **only once** per user.</li>
                      <li>Make sure you have a stable internet connection.</li>
                    </ul>
                  </template>
                </v-alert>
              </v-card-text>
              <v-card-actions class="d-flex justify-space-between mt-4">
                <v-btn
                  class="mx-2"
                  color="secondary"
                  @click="userAnswerController.handleTryLater"
                >
                  <v-icon start>mdi-clock-time-four-outline</v-icon>
                  Try Later
                </v-btn>
                <v-btn
                  class="mx-2"
                  color="primary"
                  @click="userAnswerController.handleQuizStart"
                >
                  <v-icon start>mdi-play-circle</v-icon>
                  Let's Get Started!
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
          <div v-else>
            <div class="d-flex justify-center align-center mb-6">
              <v-icon class="mr-2" color="info">mdi-timer</v-icon>
              <span class="text-h5 text-info font-weight-bold">Time Left: {{ userAnswerController.formattedTimeLeft.value }}</span>
            </div>

            <v-card class="pa-4 mb-6" flat>
              <v-card-title class="text-h5 primary--text">
                Question {{ userAnswerController.model.currentQuestionIndex + 1 }} / {{ userAnswerController.model.quizSession!.quiz.questions.length }}
              </v-card-title>
              <v-card-subtitle class="text-body-1 mb-3 text-wrap">
                {{ userAnswerController.currentQuestion.value?.questionText }}
              </v-card-subtitle>

              <v-card-text>
                <v-radio-group v-model="userAnswerController.model.userAnswers[userAnswerController.currentQuestion.value!.id]" hide-details>
                  <v-radio
                    v-for="option in userAnswerController.currentQuestion.value!.options"
                    :key="option.id!"
                    color="primary"
                    :label="option.optionText"
                    :value="option.id"
                  />
                </v-radio-group>
              </v-card-text>
            </v-card>

            <v-card-actions class="d-flex justify-space-between mt-4">
              <v-btn
                color="secondary"
                :disabled="userAnswerController.model.currentQuestionIndex === 0"
                prepend-icon="mdi-arrow-left"
                @click="userAnswerController.prevQuestion"
              >
                Previous
              </v-btn>
              <v-btn
                v-if="userAnswerController.model.currentQuestionIndex < userAnswerController.model.quizSession!.quiz.questions.length - 1"
                append-icon="mdi-arrow-right"
                color="primary"
                @click="userAnswerController.nextQuestion"
              >
                Next
              </v-btn>
              <v-btn
                v-else
                color="success"
                prepend-icon="mdi-check-all"
                @click="userAnswerController.submitQuiz()"
              >
                Submit Quiz
              </v-btn>
            </v-card-actions>
          </div>

        </v-card>

        <v-card v-else class="pa-6 text-center">
          <v-progress-circular color="primary" indeterminate size="64" />
          <p class="mt-4 text-h6">Loading Quiz Session...</p>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="userAnswerController.model.quizEndedDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="text-h5 text-center">Quiz Ended!</v-card-title>
        <v-card-text class="text-center">
          {{ userAnswerController.model.quizEndMessage }}
          <br><br>
          Thank you for participating!
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="primary" @click="userAnswerController.closeQuizEndedDialog">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
  import { UserAnswerController } from '@/viewmodel/user.answer';
  import { onBeforeUnmount, onMounted } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const sessionId = (route.params as { sessionId: string }).sessionId;

  const userAnswerController = new UserAnswerController(sessionId);

  onMounted(userAnswerController.onMounted);
  onBeforeUnmount(userAnswerController.onBeforeUnmount);
</script>

<route lang="json">
{
  "meta": {
    "title": "Submit Answers",
    "requiresAuth": true,
    "isAdmin": false
  }
}
</route>
<style scoped>
.instruction-list {
  list-style: none; /* Remove default bullet */
  padding-left: 0;
  text-align: left;
}

.instruction-list li {
  margin-bottom: 8px;
  position: relative;
  padding-left: 20px; /* Space for custom bullet */
}

.instruction-list li::before {
  content: "•"; /* Custom bullet point */
  color: #1976D2; /* Primary color */
  font-weight: bold;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
