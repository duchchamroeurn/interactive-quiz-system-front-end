<template>
  <v-container fluid>
    <v-card>
      <v-card-title>Session</v-card-title>
      <div v-if="session">
        <v-card-subtitle>
          <v-container fluid>
            <v-row
              v-for="(item, index) in [
                { label: 'Session ID', value: session.sessionId },
                { label: 'Session Code', value: session.sessionCode },
                { label: 'Start Time', value: formatDate(session.startTime) },
                { label: 'End Time', value: session.endTime ? formatDate(session.endTime) : 'Ongoing' }]"
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
          </v-container>
        </v-card-subtitle>
        <v-card-text>
          <v-card variant="text">
            <v-card-title>
              Quiz
            </v-card-title>
            <v-card-subtitle>
              <v-container fluid>
                <v-row
                  v-for="(item, index) in [
                    { label: 'Quiz ID', value: session.quiz.id },
                    { label: 'Title', value: session.quiz.title },
                    { label: 'Created At', value: formatDate(session.quiz.createdAt) }]"
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
              </v-container>
            </v-card-subtitle>
          </v-card>
          <v-card-text>
            <v-container fluid>
              <v-card variant="text">
                <v-card-title>
                  Questions ({{ session.quiz.questions.length }})
                </v-card-title>
                <v-card-text>
                  <v-list>
                    <v-list-group v-for="(question, index) in session.quiz.questions" :key="question.id" :value="question.questionText">
                      <template #activator="{ props }">
                        <v-list-item
                          v-bind="props"
                          :subtitle="`Time Limit: ${question.time} seconds`"
                          :title=" `${index + 1}.`+ question.questionText"
                        />
                      </template>
                      <v-list-item
                        v-for="(option, i) in question.options"
                        :key="option.id"
                        :active="option.correct"
                        color="success"
                        :title="`${i + 1}. `+ option.optionText"
                      />
                    </v-list-group>
                  </v-list>
                </v-card-text></v-card>
            </v-container>
          </v-card-text>
        </v-card-text>
      </div>
      <v-card-text v-else>
        <p>Loading session details...</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
  import type { SessionWithQuizQuestionsOptions } from '@/models/session';
  import { useApi } from '@/composables/api';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const sessionCode = (route.params as { id: string }).id;
  const response = useApi<SessionWithQuizQuestionsOptions>('http://localhost:9099/api/v1/session/'+ sessionCode)
  const session = response.data

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
      "title": "Sessions Details",
      "requiresAuth": true
    }
  }
  </route>
