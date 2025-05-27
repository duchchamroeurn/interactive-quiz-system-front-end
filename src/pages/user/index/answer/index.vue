<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card v-if="quizSession" class="pa-6 mb-8">
          <v-card-title class="text-h4 text-center mb-4">{{ quizSession.quiz.title }}</v-card-title>
          <v-card-subtitle class="text-center text-body-1 mb-4">{{ quizSession.quiz.description }}</v-card-subtitle>

          <v-divider class="my-4" />

          <div class="d-flex justify-center align-center mb-6">
            <v-icon class="mr-2" color="info">mdi-timer</v-icon>
            <span class="text-h5 text-info font-weight-bold">Time Left: {{ formattedTimeLeft }}</span>
          </div>

          <v-card class="pa-4 mb-6" flat>
            <v-card-title class="text-h5 primary--text">
              Question {{ currentQuestionIndex + 1 }} / {{ quizSession.quiz.questions.length }}
            </v-card-title>
            <v-card-subtitle class="text-body-1 mb-3">
              {{ currentQuestion?.questionText }}
            </v-card-subtitle>

            <v-card-text>
              <div v-if="currentQuestion?.type === 'MULTIPLE_CHOICE'">
                <v-checkbox
                  v-for="option in currentQuestion.options"
                  :key="option.id"
                  v-model="userAnswers[currentQuestion.id]"
                  color="primary"
                  hide-details
                  :label="option.optionText"
                  :value="option.id"
                />
              </div>

              <div v-else-if="currentQuestion?.type === 'TRUE_FALSE' || currentQuestion?.type === 'YES_NO'">
                <v-radio-group v-model="userAnswers[currentQuestion.id]" hide-details>
                  <v-radio
                    v-for="option in currentQuestion.options"
                    :key="option.id"
                    color="primary"
                    :label="option.optionText"
                    :value="option.id"
                  />
                </v-radio-group>
              </div>

              <div v-else-if="currentQuestion?.type === 'SHORT_ANSWER'">
                <v-textarea
                  v-model="userAnswers[currentQuestion.id]"
                  label="Your Answer"
                  outlined
                  rows="3"
                />
              </div>
            </v-card-text>
          </v-card>

          <v-card-actions class="d-flex justify-space-between mt-4">
            <v-btn
              color="secondary"
              :disabled="currentQuestionIndex === 0"
              prepend-icon="mdi-arrow-left"
              @click="prevQuestion"
            >
              Previous
            </v-btn>
            <v-btn
              v-if="currentQuestionIndex < quizSession.quiz.questions.length - 1"
              append-icon="mdi-arrow-right"
              color="primary"
              @click="nextQuestion"
            >
              Next
            </v-btn>
            <v-btn
              v-else
              color="success"
              prepend-icon="mdi-check-all"
              @click="submitQuiz"
            >
              Submit Quiz
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-card v-else class="pa-6 text-center">
          <v-progress-circular color="primary" indeterminate size="64" />
          <p class="mt-4 text-h6">Loading Quiz Session...</p>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="quizEndedDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="text-h5 text-center">Quiz Ended!</v-card-title>
        <v-card-text class="text-center">
          {{ quizEndMessage }}
          <br><br>
          Thank you for participating!
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="primary" @click="closeQuizEndedDialog">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

  interface Option {
    id: string;
    optionText: string;
    correct: boolean; // Note: In this answering view, 'correct' is not for displaying the answer, but for backend validation.
  }

  interface Question {
    id: string;
    questionText: string;
    time: number; // Time limit for this specific question in seconds (though we'll use a global timer for simplicity here)
    options: Option[];
    type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'YES_NO'; // Short Answer omitted based on provided data
  // isCustomize and correctAnswer are present in your payload, but not directly used for answering logic
  // so we'll omit them from this *answering view* interface for simplicity.
  // If your backend needs them for answer submission, they can be re-added.
  }

  interface Quiz {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    questions: Question[];
  }

  interface QuizSessionData {
    sessionId: string;
    sessionCode: string;
    startTime: string;
    endTime: string | null;
    quiz: Quiz;
  }

  // User's answers structure to submit
  interface UserAnswer {
    questionId: string;
    selectedOptionIds: string[]; // For MC (can be multiple)
  // For True/False, Yes/No, it will contain just one ID.
  }

  // --- Data ---
  const quizSession = ref<QuizSessionData | null>(null);
  const currentQuestionIndex = ref(0);
  // userAnswers will store answers as { [questionId]: selectedValue/array }
  const userAnswers = ref<{ [key: string]: string | string[] }>({});

  // Timer State
  const totalQuizDurationSeconds = ref(0); // Total duration of the quiz from questionnaire
  const timeLeftSeconds = ref(0); // Remaining time in seconds
  let timerInterval: number | null = null;

  // Dialog state
  const quizEndedDialog = ref(false);
  const quizEndMessage = ref('');

  // --- Computed Properties ---

  const currentQuestion = computed<Question | undefined>(() => {
    return quizSession.value?.quiz.questions[currentQuestionIndex.value];
  });

  const formattedTimeLeft = computed(() => {
    const minutes = Math.floor(timeLeftSeconds.value / 60);
    const seconds = timeLeftSeconds.value % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  const loadQuizSession = async () => {
    // Simulate fetching data from an API
    const mockApiData: QuizSessionData = {
      'sessionId': '8defbdc0-3083-4c96-8c53-e96233c6f58a',
      'sessionCode': 'JEI12ULRZ7',
      'startTime': '2025-05-23T13:47:05.725163', // Assuming this is client's start time for timer basis
      'endTime': null,
      'quiz': {
        'id': '3f705b7f-bb81-44c8-844e-48964c248ad4',
        'title': 'USA History Quiz',
        'description': 'A quiz covering key events and figures in United States history.',
        'createdAt': '2025-05-23T13:45:54.907741',
        'questions': [
          {
            'id': '716de252-8a7e-443d-b9c7-be0c981cb045',
            'questionText': 'Who was the primary author of the Declaration of Independence?',
            'time': 60, // Time limit for this specific question
            'options': [
              { 'id': 'f6343f60-def1-4219-9db9-53ace4f4d5af', 'optionText': 'Benjamin Franklin', 'correct': false },
              { 'id': 'f77492eb-d4dc-4be9-a94c-1c9a6e1af564', 'optionText': 'George Washington', 'correct': false },
              { 'id': '5dd4c5b0-2034-4461-b20a-2ebb7a39a691', 'optionText': 'Thomas Jefferson', 'correct': true },
              { 'id': '31a25818-e03f-4298-9edf-f574c0c7390a', 'optionText': 'John Adams', 'correct': false },
            ],
            type: 'MULTIPLE_CHOICE',
          },
          {
            'id': '2402ae5c-5bda-426f-8a24-7b5ae1a4399e',
            'questionText': 'The American Civil War began in 1861.',
            'time': 60,
            'options': [
              { 'id': '53516500-f2e1-426f-a563-3bb4803e34a2', 'optionText': 'True', 'correct': true },
              { 'id': '5fa21947-ffc3-4c14-9242-08b42ea5304c', 'optionText': 'False', 'correct': false },
            ],
            type: 'TRUE_FALSE',
          },
          {
            'id': 'b91ff252-d2cc-4402-905e-46802cb41284',
            'questionText': 'Was Abraham Lincoln assassinated before the Civil War ended?',
            'time': 60,
            'options': [
              { 'id': '2d9af80e-d2ce-495a-a49d-a0696a40f4ea', 'optionText': 'Yes, he was', 'correct': false },
              { 'id': 'a61438c5-9a4e-4aea-b9c1-f1e6f6251dd8', 'optionText': "No, he wasn't", 'correct': true },
            ],
            type: 'YES_NO',
          },
          {
            'id': 'a896730f-cc48-4cdb-8d32-507728e21d79',
            'questionText': 'The United States purchased Alaska from Russia.',
            'time': 60,
            'options': [
              { 'id': 'a5ead34e-1af3-488e-9951-7967d738527e', 'optionText': 'Factually Correct', 'correct': true },
              { 'id': '57126cd0-3d1b-4ec4-aa3f-38a74fd0c8dd', 'optionText': 'Absolutely False', 'correct': false },
            ],
            type: 'TRUE_FALSE',
          },
          {
            'id': 'f8480503-fed3-4a53-8fde-cd1e8492bacf',
            'questionText': 'Which landmark legislation ended segregation in public places and banned employment discrimination?',
            'time': 60,
            'options': [
              { 'id': '6df11f0d-84a5-46ed-b64b-213438af533e', 'optionText': 'The Voting Rights Act of 1965', 'correct': false },
              { 'id': '7294a43d-c9c7-43ab-ad2a-fb30eac48afe', 'optionText': 'The Civil Rights Act of 1964', 'correct': true },
              { 'id': '0217aec4-264b-41c7-8985-6f17d73e460c', 'optionText': 'The Emancipation Proclamation', 'correct': false },
              { 'id': 'd383cbf6-29d8-41e1-afe4-d313483b2248', 'optionText': 'The 19th Amendment', 'correct': false },
            ],
            type: 'MULTIPLE_CHOICE',
          },
        ],
      },
    };

    quizSession.value = mockApiData

    // Calculate total quiz duration based on individual question times
    // If the backend `timeLimit` is per question, sum them up.
    // If `timeLimit` was a global property on `quiz`, use that instead.
    totalQuizDurationSeconds.value = quizSession.value.quiz.questions.reduce((sum, q) => sum + q.time, 0);

    // Initialize timeLeftSeconds based on the actual start time and calculated duration
    const startTime = new Date().getTime();
    const currentTime = new Date().getTime(); // Current client time
    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);

    timeLeftSeconds.value = Math.max(0, totalQuizDurationSeconds.value - elapsedSeconds);

    startTimer();

    // Initialize userAnswers object for each question
    quizSession.value.quiz.questions.forEach(q => {
      if (q.type === 'MULTIPLE_CHOICE') {
        userAnswers.value[q.id] = []; // Array for multiple selections
      } else {
        userAnswers.value[q.id] = ''; // Single string for radio buttons / short answer
      }
    });
  };

  const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval); // Clear any existing timer

    timerInterval = window.setInterval(() => {
      if (timeLeftSeconds.value > 0) {
        timeLeftSeconds.value--;
      } else {
        clearInterval(timerInterval!);
        timerInterval = null;
        quizEndMessage.value = 'Time is up! Your quiz has been automatically submitted.';
        quizEndedDialog.value = true;
        submitQuiz(true); // Automatically submit when time runs out
      }
    }, 1000); // Update every second
  };

  const prevQuestion = () => {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--;
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex.value < quizSession.value!.quiz.questions.length - 1) {
      currentQuestionIndex.value++;
    }
  };

  const submitQuiz = (timedOut: boolean = false) => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    // Prepare the answers payload
    const answersPayload: UserAnswer[] = [];
    for (const questionId in userAnswers.value) {
      const answer = userAnswers.value[questionId];
      if (Array.isArray(answer)) {
        answersPayload.push({
          questionId,
          selectedOptionIds: answer,
        });
      } else if (typeof answer === 'string' && answer.trim() !== '') {
        answersPayload.push({
          questionId,
          selectedOptionIds: [answer],
        });
      }
    }

    console.log('Quiz Submitted! Answers:', answersPayload);
    // console.log('Session ID:', quizSession.value?.sessionId);

    // Here you would typically send `answersPayload` and `quizSession.value?.sessionId`
    // to your backend API to record the results.

    if (!timedOut) {
      quizEndMessage.value = 'Quiz submitted successfully!';
      quizEndedDialog.value = true;
    }
    // Prevent further interaction if quiz is submitted
    quizSession.value = null; // Or disable all inputs
  };

  const closeQuizEndedDialog = () => {
    quizEndedDialog.value = false;
    // Redirect to results page or home, etc.
    console.log('Quiz ended dialog closed. You might redirect now.');
  };

  // --- Lifecycle Hooks ---
  onMounted(() => {
    loadQuizSession();
  });

  onBeforeUnmount(() => {
    // Clear timer when component is unmounted to prevent memory leaks
    if (timerInterval) {
      clearInterval(timerInterval);
    }
  });
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
