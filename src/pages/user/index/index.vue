<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-6 mb-8">
          <v-card-title class="text-h5 text-center mb-4">Welcome to Iteractive Quiz System, {{ userName
          }}!</v-card-title>
          <v-card-text class="text-body-1 text-center">
            Select a quiz from the list below, or join a specific session with a code.
          </v-card-text>
        </v-card>

        <v-card class="pa-6 mb-8">
          <v-card-title class="text-h6 mb-3">Join a Live Quiz Session</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="sessionCode"
              class="mb-4"
              clearable
              label="Enter Session Code"
              outlined
              :rules="[v => !!v || 'Session code is required']"
              @keyup.enter="joinSession"
            />
            <v-btn
              block
              color="primary"
              :disabled="!sessionCode.trim()"
              large
              @click="joinSession"
            >
              <v-icon left>mdi-play-circle</v-icon>
              Join Session
            </v-btn>
          </v-card-text>
        </v-card>

        <v-card class="pa-6">
          <v-card-title class="text-h6 mb-3">Available Quizzes</v-card-title>
          <v-card-text>
            <v-card v-for="quiz in availableQuizzes" :key="quiz.id" class="my-4">
              <v-card-title>
                {{ quiz.title }}
              </v-card-title>
              <v-card-subtitle>
                {{ quiz.description }}
              </v-card-subtitle>
              <v-card-actions>
                <v-btn color="secondary" @click="startQuiz(quiz.id)">
                  <v-icon right>mdi-pencil</v-icon>
                  Start Quiz
                </v-btn>
              </v-card-actions>
            </v-card>
            <v-card v-if="availableQuizzes.length === 0">
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
  import { useLocalStorage } from '@/composables/store';
  import { ref } from 'vue';

  // --- Data ---
  const userName = useLocalStorage().getUser()?.username
  const sessionCode = ref('');

  interface QuizPreview {
    id: string;
    title: string;
    description: string;
  }

  // Mock data for available quizzes (replace with API call)
  const availableQuizzes = ref<QuizPreview[]>([
    { id: 'quiz1', title: 'USA History Quiz', description: 'Test your knowledge of American history.' },
    { id: 'quiz2', title: 'Science Trivia', description: 'A fun quiz about general science facts.' },
    { id: 'quiz3', title: 'World Geography', description: 'Explore countries and capitals.' },
  ]);

  const joinSession = () => {
    if (sessionCode.value.trim()) {
      console.log(`Joining session with code: ${sessionCode.value.trim()}`);
      // Implement API call to join session
      // On success, navigate to the quiz session page, passing the session ID
      // Example: router.push(`/quiz-session/${sessionCode.value.trim()}`);
      alert(`Attempting to join session: ${sessionCode.value.trim()}`);
    }
  };

  const startQuiz = (quizId: string) => {
    console.log(`Starting quiz with ID: ${quizId}`);
    // Implement API call to start a new session for this quiz
    // On success, navigate to the quiz session page, passing the newly created session ID
    // Example: router.push(`/quiz-session/new-session-id-from-api`);
    alert(`Attempting to start quiz: ${quizId}`);
  };
</script>
<route lang="json">{
  "meta": {
    "title": "Home",
    "requiresAuth": true,
    "isAdmin": false
  }
}</route>
