<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-6 mb-8">
          <v-card-title class="text-h5 text-center mb-4">
            Welcome to Interactive Quiz System, {{ homeUserController.userName }}!
          </v-card-title>
          <v-card-text class="text-body-1 text-center">
            Select a quiz from the list below, or join a specific session with a code.
          </v-card-text>
        </v-card>

        <v-card class="pa-6 mb-8">
          <v-card-title class="text-h6 mb-3">Join a Live Quiz Session</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="homeUserController.model.sessionCode"
              class="mb-4"
              clearable
              :error="homeUserController.model.errorJoinSession != null"
              :error-messages="homeUserController.model.errorJoinSession"
              label="Enter Session Code"
              outlined
              @keyup.enter="homeUserController.joinSession"
              @update:focused="homeUserController.onForcusSessionCode"
            />
            <v-btn
              block
              color="primary"
              :disabled="!homeUserController.model.sessionCode.trim()"
              large
              @click="homeUserController.joinSession"
            >
              <v-icon left>mdi-play-circle</v-icon>
              Join Session
            </v-btn>
          </v-card-text>
        </v-card>

        <v-card class="pa-6 mb-8">
          <v-card-title class="text-h6 mb-3">Quizzes Available For You</v-card-title>
          <v-card-text>
            <v-card v-if="homeUserController.model.availableQuizzes && homeUserController.model.availableQuizzes.length > 0" flat>
              <v-card-text>
                <v-card v-for="session in homeUserController.model.availableQuizzes" :key="session.sessionId" class="ma-2">
                  <v-card-title>
                    {{ session.quiz.title }}
                  </v-card-title>
                  <v-card-subtitle>
                    {{ session.quiz.description }}
                  </v-card-subtitle>
                  <v-card-actions>
                    <v-btn color="secondary" @click="homeUserController.startQuiz(session.sessionId)">
                      <v-icon right>mdi-pencil</v-icon>
                      Start Quiz
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-card-text>
            </v-card>
            <v-card v-else class="pa-4 text-center" variant="outlined">
              <v-card-subtitle>
                No direct access quizzes available for you at the moment.
              </v-card-subtitle>
            </v-card>
          </v-card-text>
        </v-card>

        <v-card class="pa-6 mb-8">
          <v-card-title class="text-h6 mb-3">My Previous Quizzes</v-card-title>
          <v-card-text>
            <p class="text-body-2 mb-4">View your completed quiz results and answer history.</p>
            <v-btn
              block
              color="info"
              prepend-icon="mdi-history"
              variant="flat"
              @click="homeUserController.goToMyAnswers"
            >
              View My Quiz History
            </v-btn>
          </v-card-text>
        </v-card>

        <v-card class="pa-6">
          <v-card-title class="text-h6 mb-3">Public Quizzes Available</v-card-title>
          <v-card-text>
            <div class="scrollable-container">
              <v-row class="flex-nowrap" no-gutters>
                <v-col
                  v-for="session in homeUserController.model.publicQuizzes"
                  :key="session.sessionId"
                  class="flex-grow-0 flex-shrink-0"
                >
                  <v-card class="ma-2 quiz-card d-flex flex-column">
                    <v-card-title class="text-wrap">
                      {{ session.quiz.title }}
                    </v-card-title>
                    <v-card-subtitle class="text-wrap flex-grow-1">
                      {{ session.quiz.description }}
                    </v-card-subtitle>
                    <v-card-actions>
                      <v-btn color="secondary" @click="homeUserController.startQuiz(session.sessionId)">
                        <v-icon right>mdi-pencil</v-icon>
                        Start Quiz
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
                <v-col
                  v-if="homeUserController.model.publicQuizzes.length === 0"
                  cols="12"
                >
                  <v-card class="pa-4 text-center" variant="outlined">
                    <v-card-subtitle>
                      No public quizzes available at the moment.
                    </v-card-subtitle>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { homeUserController } from '@/viewmodel/user.index';

  onMounted(() => {
    homeUserController.fetchQuizzesAvailable();
  });
</script>

<style scoped>
.scrollable-container {
  overflow-x: auto; /* Enable horizontal scrolling */
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  scroll-snap-type: x mandatory; /* Optional: Snap to card boundaries */
  padding-bottom: 12px; /* Add some space for scrollbar */
}

/* Ensure the row doesn't wrap its columns */
.scrollable-container .v-row {
  flex-wrap: nowrap;
}

/* Style for individual quiz cards in the horizontal scroll */
.quiz-card {
  min-width: 280px; /* Minimum width for each card */
  max-width: 320px; /* Maximum width for each card */
  height: 150px; /* Fixed height for consistent look */
  scroll-snap-align: start; /* Optional: Snap individual cards to start */
}

/* Ensure card content wraps properly */
.quiz-card .v-card-title,
.quiz-card .v-card-subtitle {
  white-space: normal; /* Allow text to wrap */
  word-break: break-word; /* Break long words */
}

.quiz-card .v-card-actions {
  margin-top: auto; /* Push actions to the bottom */
}
</style>
<route lang="json">{
  "meta": {
    "title": "Home",
    "requiresAuth": true,
    "isAdmin": false
  }
}</route>
