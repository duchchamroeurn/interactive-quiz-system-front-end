<template>
  <v-container fluid>
    <v-card>
      <v-card-text v-if="sessionResultViewModel.model.sessionResult">
        <v-card variant="text">
          <v-card-text>
            <v-container fluid>
              <v-row
                v-for="(item, index) in sessionResultViewModel.sectionSessionResult"
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
          </v-card-text>
        </v-card>

        <v-card flat>
          <v-card-title>
            Participants
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="sessionResultViewModel.headers"
              :items="sessionResultViewModel.model.sessionResult.participants"
              :loading="sessionResultViewModel.model.loading"
              no-data-text="No participants found."
              no-results-text="No matching participants found."
            >
              <template #[`item.examResult`]="{ item }">
                <v-chip :color="item.examResult ? 'green' : 'red'" text-color="white">
                  {{ item.examResult ? 'Passed' : 'Failed' }}
                </v-chip>
              </template>
              <template #[`item.actions`]="{ item }">
                <div class="d-flex justify-end">
                  <v-btn
                    color="info"
                    icon
                    size="small"
                    title="View Quiz Detail"
                    @click="sessionResultViewModel.viewQuizDetail(item)"
                  >
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-card-text>
      <v-card-text v-else>
        <p>Loading session results detail...</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
  import { sessionResultViewModel } from '@/viewmodel/session.result';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const sessionId = (route.params as { id: string }).id;
  sessionResultViewModel.fetchResultBySession(sessionId)

</script>
<route lang="json">
  {
    "meta": {
      "title": "Sessions Results",
      "requiresAuth": true
    }
  }
</route>
