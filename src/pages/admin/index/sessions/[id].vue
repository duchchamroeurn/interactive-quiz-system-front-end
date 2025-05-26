<template>
  <v-container fluid>
    <v-skeleton-loader
      v-if="sessionDetailViewModel.model.loading"
      class="mx-auto"
      :loading="sessionDetailViewModel.model.loading"
      type="card, subtitle, article, list-item"
    />
    <v-card v-else>
      <v-card-title>Session</v-card-title>
      <div v-if="sessionDetailViewModel.model.session">
        <v-card-subtitle>
          <v-container fluid>
            <v-row
              v-for="(item, index) in sessionDetailViewModel.sectionSession"
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
                  v-for="(item, index) in sessionDetailViewModel.sectionQuiz"
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
                  Questions ({{ sessionDetailViewModel.model.session.quiz.questions.length }})
                </v-card-title>
                <v-card-text>
                  <v-list>
                    <v-list-group v-for="(question, index) in sessionDetailViewModel.model.session.quiz.questions" :key="question.id" :value="question.questionText">
                      <template #activator="{ props }">
                        <v-list-item
                          v-bind="props"
                          :subtitle="`Time Limit: ${question.time} seconds`"
                          :title=" `${index + 1}.`+ question.questionText"
                        />
                      </template>
                      <v-list-item
                        v-for="(option, i) in question.options"
                        :key="option.id!"
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
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
  import { sessionDetailViewModel } from '@/viewmodel/session.[id]';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const sessionCode = (route.params as { id: string }).id;
  sessionDetailViewModel.fetchSessionDetail(sessionCode)

</script>
<route lang="json">
  {
    "meta": {
      "title": "Sessions Details",
      "requiresAuth": true,
      "isAdmin": true
    }
  }
  </route>
