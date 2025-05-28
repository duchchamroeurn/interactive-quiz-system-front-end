<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-6 mb-8">
          <v-card-title class="text-h5 text-center mb-4">Welcome to Iteractive Quiz System, {{ homeUserController.userName
          }}!</v-card-title>
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
              label="Enter Session Code"
              outlined
              :rules="[v => !!v || 'Session code is required']"
              @keyup.enter="homeUserController.joinSession"
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

        <v-card class="pa-6">
          <v-card-title class="text-h6 mb-3">Available Quizzes</v-card-title>
          <v-card-text>
            <v-card v-for="session in homeUserController.model.availableQuizzes" :key="session.sessionId" class="my-4">
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
            <v-card v-if="homeUserController.model.availableQuizzes.length === 0">
              <v-card-subtitle>
                No quizzes available at the moment.
              </v-card-subtitle>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
  import { homeUserController } from '@/viewmodel/user.index';
  import { onMounted } from 'vue';

  onMounted(() => {
    homeUserController.fetchQuizzesAvailable();
  });
</script>
<route lang="json">{
  "meta": {
    "title": "Home",
    "requiresAuth": true,
    "isAdmin": false
  }
}</route>
