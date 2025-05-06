<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card v-if="question" variant="text">
          <v-card-title> {{ question.questionText }}</v-card-title>
          <v-card-text>
            <v-container fluid>
              <v-row
                v-for="(item, index) in [
                  { label: 'Question ID', value: question.id },
                  { label: 'Time Limit', value: `${question.time} seconds `},
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
                  <v-card>
                    <v-card-title>Options</v-card-title>
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
        <div v-else>
          <p>Loading question details...</p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import { useApi } from '@/composables/api';
  import type { QuestionWithOptions } from '@/models/question';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const questionId = (route.params as { id: string }).id;
  const fetchQuestionDetail = useApi<QuestionWithOptions>('http://localhost:9099/api/v1/question/' + questionId);
  const question = fetchQuestionDetail.data;
</script>
<route lang="json">
  {
    "meta": {
      "title": "Question Details",
      "requiresAuth": true
    }
  }
</route>
