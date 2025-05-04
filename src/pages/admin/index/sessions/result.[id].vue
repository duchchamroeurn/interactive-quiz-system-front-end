<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Session Results</v-card-title>
          <v-card-text v-if="results && results.length > 0">
            <v-data-table
              :headers="headers"
              :items="results"
              :loading="loading"
              no-data-text="No results found for this session."
              no-results-text="No matching results found."
            >
              <template #[`item.answerTime`]="{ item }">
                {{ formatDate(item.answerTime) }}
              </template>
            </v-data-table>
          </v-card-text>
          <v-card-text v-else-if="loading">
            <p>Loading results...</p>
          </v-card-text>
          <v-card-text v-else>
            <p>No results found for this session.</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

  </v-container>

</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';

  interface Result {
    answerId: string;
    sessionCode: string;
    username: string;
    question: string;
    answerSubmit: string;
    answerTime: string;
  }

  export default defineComponent({
    name: 'SessionResultsPage',
    components: {
    },
    setup () {
      const headers = [
        { title: 'Answer ID', value: 'answerId', width: '30%' },
        { title: 'Session Code', value: 'sessionCode', width: '15%' },
        { title: 'Username', value: 'username', width: '15%' },
        { title: 'Question', value: 'question', width: '20%' },
        { title: 'Answer Submitted', value: 'answerSubmit', width: '10%' },
        { title: 'Answer Time', value: 'answerTime', width: '10%' },
      ];

      const results = ref<Result[]>([]);
      const loading = ref(true);

      onMounted(() => {
        // Replace this with your actual API call to fetch session results
        const mockResponse = {
          success: true,
          data: [
            {
              answerId: 'ea92bb4a-bd54-4329-ac59-3cacbc7f16b4',
              sessionCode: '90MDL25MGQ',
              username: 'audience',
              question: 'Who was the first president of the USA?',
              answerSubmit: 'George Washington',
              answerTime: '2025-05-02T11:19:26.037707',
            },
            {
              answerId: 'fcdbc5a9-3b6b-4a72-904b-adbb56c60353',
              sessionCode: '90MDL25MGQ',
              username: 'audience',
              question: 'What year did World War II begin?',
              answerSubmit: '1939',
              answerTime: '2025-05-02T11:24:10.047659',
            },
            {
              answerId: '009ceced-4c72-4951-b54b-ce3d2caee4e5',
              sessionCode: '90MDL25MGQ',
              username: 'audience001',
              question: 'Who was the first president of the USA?',
              answerSubmit: 'James Madison',
              answerTime: '2025-05-02T11:30:03.92116',
            },
            {
              answerId: 'eea07a3e-890a-43c6-afec-f2a78cfc0882',
              sessionCode: '90MDL25MGQ',
              username: 'audience001',
              question: 'What year did World War II begin?',
              answerSubmit: '1939',
              answerTime: '2025-05-02T11:30:42.943901',
            },
            {
              answerId: '77213632-3e40-4a96-8dc3-024e72cd2c80',
              sessionCode: '90MDL25MGQ',
              username: 'audience002',
              question: 'Who was the first president of the USA?',
              answerSubmit: 'George Washington',
              answerTime: '2025-05-02T14:12:36.893418',
            },
            {
              answerId: '0cd65c0a-8758-4a5a-b5a6-19d2e4a660b4',
              sessionCode: '90MDL25MGQ',
              username: 'audience002',
              question: 'What year did World War II begin?',
              answerSubmit: '1941',
              answerTime: '2025-05-02T14:13:15.211477',
            },
            {
              answerId: '7724b60d-f3f2-4dae-a30a-ab70a0e0dcbb',
              sessionCode: '90MDL25MGQ',
              username: 'audience003',
              question: 'What year did World War II begin?',
              answerSubmit: '1939',
              answerTime: '2025-05-02T14:13:50.930356',
            },
            {
              answerId: '8f5a4964-4bc3-42f3-8c63-100e238bd2e7',
              sessionCode: '90MDL25MGQ',
              username: 'audience003',
              question: 'Who was the first president of the USA?',
              answerSubmit: 'John Adams',
              answerTime: '2025-05-02T14:14:22.590616',
            },
            {
              answerId: 'ef35e97c-b48b-434d-bdb7-1d42f5deacde',
              sessionCode: '90MDL25MGQ',
              username: 'audience004',
              question: 'Who was the first president of the USA?',
              answerSubmit: 'James Madison',
              answerTime: '2025-05-02T14:15:04.095371',
            },
            {
              answerId: '7b12e4aa-beb5-4850-afa7-ba0ef962a909',
              sessionCode: '90MDL25MGQ',
              username: 'audience004',
              question: 'What year did World War II begin?',
              answerSubmit: '1939',
              answerTime: '2025-05-02T14:15:30.295496',
            },
            {
              answerId: '6788d3c5-4551-4708-a8a8-ff0c7f57859c',
              sessionCode: '90MDL25MGQ',
              username: 'audience005',
              question: 'What year did World War II begin?',
              answerSubmit: '1935',
              answerTime: '2025-05-02T14:16:14.210503',
            },
            {
              answerId: '56fa1fb6-457e-486f-971e-109bf44966a5',
              sessionCode: '90MDL25MGQ',
              username: 'audience005',
              question: 'Who was the first president of the USA?',
              answerSubmit: 'Thomas Jefferson',
              answerTime: '2025-05-02T14:16:39.12679',
            },
          ],
          message: 'Successful list answers by session',
          timestamp: '2025-05-03T22:46:06.217211',
        };

        setTimeout(() => {
          if (mockResponse.success) {
            results.value = mockResponse.data as Result[];
          } else {
            console.error('Failed to fetch session results:', mockResponse);
          //  Handle error (e.g., show a message to the user)
          }
          loading.value = false;
        }, 500);
      });

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

      return {
        headers,
        results,
        loading,
        formatDate,
      };
    },
  });
</script>
