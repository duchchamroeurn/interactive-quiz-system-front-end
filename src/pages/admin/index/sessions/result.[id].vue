<template>
  <v-container fluid>
    <v-card>
      <v-card-text v-if="sessionData">
        <v-card variant="text">
          <v-card-text>
            <v-container fluid>
              <v-row
                v-for="(item, index) in [
                  { label: 'Session ID', value: sessionData.sessionId },
                  { label: 'Session Code', value: sessionData.sessionCode },
                  { label: 'Start Time', value: formatDate(sessionData.startTime) },
                  { label: 'End Time', value: sessionData.endTime ? formatDate(sessionData.endTime) : 'Ongoing' }]"
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
              :headers="headers"
              :items="sessionData.participants"
              :loading="loading"
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
                    @click="viewQuizDetail(item)"
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
  import { useApi } from '@/composables/api';
  import type { Participant } from '@/models/participant';
  import type { SessionWithParticipant } from '@/models/session';
  import { useRoute, useRouter } from 'vue-router';

  const headers = [
    { title: 'User ID', value: 'userId' },
    { title: 'Email', value: 'email' },
    { title: 'Username', value: 'username' },
    { title: 'Exam Result', value: 'examResult' },
    { title: 'Total Point', value: 'totalPoint' },
    { title: 'Earned Point', value: 'totalEarnedPoint' },
    { title: 'Percentage', value: 'percentage' },
    { title: 'Actions', value: 'actions', sortable: false },
  ];

  const route = useRoute();
  const router = useRouter();
  const sessionId = (route.params as { id: string }).id;
  const fetchResultBySession = useApi<SessionWithParticipant>('http://localhost:9099/api/v1/answer/session/' + sessionId);
  const sessionData = fetchResultBySession.data;
  const loading = fetchResultBySession.loading

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      undefined,
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
      }
    );
  };

  const viewQuizDetail = (participant: Participant) => {
    router.push('/admin/sessions/'+ sessionId +'/user/' + participant.userId)
  };
</script>
<route lang="json">
  {
    "meta": {
      "title": "Sessions Results",
      "requiresAuth": true
    }
  }
</route>
