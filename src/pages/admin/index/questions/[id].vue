<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card v-if="questionDetailViewModel.model.questionDetail" variant="text">
          <v-card-title> {{ questionDetailViewModel.model.questionDetail.questionText }}</v-card-title>
          <v-card-text>
            <v-container fluid>
              <v-row
                v-for="(item, index) in questionDetailViewModel.sectionQuestion"
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
                          v-for="(option, i) in questionDetailViewModel.model.questionDetail.options"
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
  import { questionDetailViewModel } from '@/viewmodel/question .[id]';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const questionId = (route.params as { id: string }).id;
  questionDetailViewModel.fetchQuestionDetail(questionId);

</script>
<route lang="json">
  {
    "meta": {
      "title": "Question Details",
      "requiresAuth": true
    }
  }
</route>
