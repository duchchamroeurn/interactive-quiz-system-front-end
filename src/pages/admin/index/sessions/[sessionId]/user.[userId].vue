<template>
  <v-container fluid>
    <v-card>
      <v-card-text v-if="sessionResultUserViewModel.model.sesionResult">
        <v-container fluid>
          <v-card flat>
            <v-card-title>
              Session Information
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="(item, index) in sessionResultUserViewModel.sectionSession"
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
                  v-for="(item, index) in sessionResultUserViewModel.sectionUser"
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
                  v-for="(item, index) in sessionResultUserViewModel.sectionQuiz"
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
              <v-card v-for="(question, index) in sessionResultUserViewModel.model.sesionResult.quiz.questions" :key="question.id" flat>
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
                          :active="sessionResultUserViewModel.isUserAnswer(question.id, option.id)"
                          :color="option.correct ? 'success': 'error'"
                          rounded
                        >
                          <v-list-item-title>{{ i + 1 }}. {{ option.optionText }}<span v-if="option.correct" class="font-weight-bold"> (Correct) </span></v-list-item-title>
                          <template v-if="sessionResultUserViewModel.isUserAnswer(question.id, option.id)" #append>
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
                      {{ sessionResultUserViewModel.getUserAnswerText(question.id) }}
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
  import { sessionResultUserViewModel } from '@/viewmodel/session.result.user';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const sessionId = (route.params as { sessionId: string }).sessionId;
  const userId = (route.params as { userId: string }).userId;
  sessionResultUserViewModel.fetchSessionUserResult(sessionId, userId)

</script>

<route lang="json">
  {
    "meta": {
      "title": "User Session Details",
      "requiresAuth": true
    }
  }
  </route>
