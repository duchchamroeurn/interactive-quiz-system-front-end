<template>
  <v-container fluid>
    <v-card>
      <v-card-text v-if="resultData">
        <v-container fluid>
          <v-card flat>
            <v-card-title>
              Session Information
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="(item, index) in [
                    { label: 'Session ID', value: resultData.session. sessionId },
                    { label: 'Session Code', value: resultData. session.sessionCode },
                    { label: 'Start Time', value: formatDate(resultData. session.startTime) },
                    { label: 'End Time', value: resultData.session.endTime ? formatDate(resultData.session.endTime) : 'Ongoing' }]"
                  :key="index"
                  :subtitle="item.value"
                  :title="item.label"
                />
              </v-list>
            </v-card-text>
          </v-card>
        </v-container>
        <v-divider />
        <v-container fluid>
          <v-card flat>
            <v-card-title>
              User Information
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="(item, index) in [
                    { label: 'User ID', value: resultData.user.userId },
                    { label: 'Email', value: resultData.user.email },
                    { label: 'Username', value: resultData.user.username },
                  ]"
                  :key="index"
                  :subtitle="item.value"
                  :title="item.label"
                />
              </v-list>
            </v-card-text>
          </v-card>
        </v-container>
        <v-divider />
        <v-container fluid>
          <v-card flat>
            <v-card-title>
              Quiz Information
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="(item, index) in [
                    { label: 'Quiz ID', value: resultData.quiz.id },
                    { label: 'Quiz Title', value: resultData.quiz.title },
                    { label: 'Created At', value: formatDate(resultData.quiz.createdAt) },
                  ]"
                  :key="index"
                  :subtitle="item.value"
                  :title="item.label"
                />
              </v-list>
            </v-card-text>
          </v-card>
        </v-container>
        <v-divider />
        <v-container fluid>
          <v-card flat>
            <v-card-title>
              Questions and Your Answers
            </v-card-title>
            <v-card-text>
              <v-card v-for="(question, index) in resultData.quiz.questions" :key="question.id" flat>
                <v-card-title>
                  {{ index + 1 }}. {{ question.questionText }}
                </v-card-title>
                <v-card-subtitle>
                  <p><span class="font-weight-bold">Time Limit:</span> <span>{{ question.time }} seconds</span></p>
                </v-card-subtitle>
                <v-card-text>
                  <v-row>
                    <v-col cols="4">
                      <v-list variant="text">
                        <v-list-item-title class="font-weight-bold">
                          Options:
                        </v-list-item-title>
                        <v-list-item
                          v-for="(option, i) in question.options"
                          :key="option.id"
                          :active="isUserAnswer(question.id, option.id)"
                          :color="option.correct ? 'success': 'error'"
                          rounded
                        >
                          <v-list-item-title>{{ i + 1 }}. {{ option.optionText }}<span v-if="option.correct" class="font-weight-bold"> (Correct) </span></v-list-item-title>
                          <template v-if="isUserAnswer(question.id, option.id)" #append>
                            <v-icon :color="option.correct ? 'success' : 'error'">
                              {{ option.correct ? 'mdi-check-circle' : 'mdi-close-circle' }}
                            </v-icon>
                          </template>

                        </v-list-item>
                      </v-list>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-divider />
                <v-card-actions>
                  <p>
                    <span class="font-weight-bold">Your Answer: </span>
                    <span>
                      {{ getUserAnswerText(question.id) }}
                    </span>
                  </p>
                </v-card-actions>
              </v-card>
            </v-card-text>
          </v-card>
        </v-container>
      </v-card-text>
      <v-card-text v-else>
        <p>Loading quiz result details...</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
  import { useApi } from '@/composables/api';
  import type { UserQuizResult } from '@/models/result';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const sessionId = (route.params as { sessionId: string }).sessionId;
  const userId = (route.params as { userId: string }).userId;

  const fetchUserQuizSessionResult = useApi<UserQuizResult>('http://localhost:9099/api/v1/answer/session/' + sessionId +'/user/' + userId)
  const resultData = fetchUserQuizSessionResult.data

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

  const isUserAnswer = (questionId: string, optionId: string): boolean => {
    const answer = resultData.value?.answers.find(a => a.questionId === questionId);
    if (!answer) return false;

    if (Array.isArray(answer.answerId)) {
      return (answer.answerId as string[]).includes(optionId);
    }
    return answer.answerId === optionId;
  };

  const getUserAnswerText = (questionId: string): string => {
    if(!resultData.value) return 'Not answered';
    const answer = resultData.value.answers.find(a => a.questionId === questionId);
    if (!answer) return 'Not answered';

    const question = resultData.value.quiz.questions.find(q => q.id === questionId);
    if (!question) return 'Question not found';

    if (Array.isArray(answer.answerId)) {
      return question.options
        .filter(opt => (answer.answerId as string[]).includes(opt.id))
        .map(opt => opt.optionText)
        .join(', ');
    }

    const selectedOption = question.options.find(opt => opt.id === answer.answerId);
    return selectedOption ? selectedOption.optionText : 'Not answered';
  };
</script>

<route lang="json">
  {
    "meta": {
      "title": "User Session Details",
      "requiresAuth": true
    }
  }
  </route>
