<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card flat>
          <v-card-title>Quiz</v-card-title>
          <v-card-text>
            <v-card variant="text">
              <v-card-text>
                <v-container v-if="quiz" fluid>
                  <v-row
                    v-for="(item, index) in [
                      { label: 'Quiz ID', value: quiz.id },
                      { label: 'Title', value: quiz.title },
                      { label: 'Created At', value: formatDate(quiz.createdAt) },
                    ]"
                    :key="index"
                  >
                    <v-col>
                      <v-list-item-title class="font-weight-medium">
                        {{ item.label }}:
                      </v-list-item-title>
                    </v-col>
                    <v-col>
                      <v-list-item-subtitle>
                        {{ item.value }}
                      </v-list-item-subtitle>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-card variant="text">
                        <v-card-title>
                          Questions ({{ quiz.questions.length }})
                        </v-card-title>
                        <v-card-text>
                          <v-container fluid>
                            <v-row v-for="(question, index) in quiz.questions" :key="index">
                              <v-col>
                                <v-card>
                                  <v-card-title>
                                    {{ index + 1 }}. {{ question.questionText }}
                                  </v-card-title>
                                  <v-card-subtitle>
                                    Time Limit: {{ question.time }} seconds
                                  </v-card-subtitle>
                                  <v-card-text>
                                    <v-list>
                                      <v-list-item
                                        v-for="(option, i) in question.options"
                                        :key="option.id"
                                        :active="option.correct"
                                        color="success"
                                        :title="`${i + 1}. `+ option.optionText"
                                      />
                                    </v-list>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
                <v-container v-else>
                  <p>Loading quiz details...</p>
                </v-container></v-card-text>
            </v-card></v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import { useApi } from '@/composables/api';
  import type { QuizWithQuestionsOptions } from '@/models/quiz';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const quizId = (route.params as { id: string }).id;
  const fetchQuizDetail = useApi<QuizWithQuestionsOptions>('http://localhost:9099/api/v1/quiz/' + quizId)
  const quiz = fetchQuizDetail.data;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      undefined,
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    );
  };
</script>
<route lang="json">
  {
    "meta": {
      "title": "Quiz Details",
      "requiresAuth": true
    }
  }
</route>
