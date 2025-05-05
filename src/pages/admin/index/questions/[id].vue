<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card v-if="question" variant="text">
          <v-card-title> {{ question.questionText }}</v-card-title>
          <v-card-text>
            <v-container>
              <v-row
                v-for="(item, index) in [
                  { label: 'Question ID', value: question.id },
                  { label: 'Time Limit', value: `${question.time} seconds `},
                ]"
                :key="index"
              >
                <v-col>
                  <v-list-item-title>
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
  import { onMounted, ref } from 'vue';
  import type { QuestionWithOptions } from '@/models/QuestionWithOptions';

  const question = ref< QuestionWithOptions | null>(null);
  const loading = ref(true);

  onMounted(() => {
    // Replace this with your actual API call to fetch question details by ID
    const mockResponse = {
      success: true,
      data: {
        id: '28fcbc1e-e87e-4ac9-b692-98deadd61e2e',
        questionText: 'Who was the first president of the USA?',
        time: 60,
        options: [
          { id: 'e33c4a87-0784-4573-b4df-236c8de41d0e', optionText: 'James Madison', correct: false },
          { id: '7e7f88ab-0641-41e0-8e8d-5114b50bac38', optionText: 'Thomas Jefferson', correct: false },
          { id: 'b5cb0f25-c272-46ed-ba31-6607306d225a', optionText: 'John Adams', correct: false },
          { id: '7ce5cd88-52b9-4e78-9624-d67909bd5f4a', optionText: 'George Washington', correct: true },
        ],
      },
      message: 'We found the question you were looking for.',
      timestamp: '2025-05-03T22:10:25.998017',
    };

    setTimeout(() => {
      if (mockResponse.success) {
        question.value = mockResponse.data as QuestionWithOptions;
      } else {
        console.error('Failed to fetch question details:', mockResponse);
        //  Handle error (e.g., show a message to the user)
      }
      loading.value = false;
    }, 500);
  });
</script>
<route lang="json">
  {
    "meta": {
      "title": "Question Details",
      "requiresAuth": true
    }
  }
</route>
