<template>
  <v-container fluid>
    <v-card>
      <v-card-title>Session</v-card-title>
      <div v-if="session">
        <v-card-subtitle>
          <v-container>
            <v-row
              v-for="(item, index) in [
                { label: 'Session ID', value: session.sessionId },
                { label: 'Session Code', value: session.sessionCode },
                { label: 'Start Time', value: formatDate(session.startTime) },
                { label: 'End Time', value: session.endTime ? formatDate(session.endTime) : 'Ongoing' }]"
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
          </v-container>
        </v-card-subtitle>
        <v-card-text>
          <v-card variant="text">
            <v-card-title>
              Quiz
            </v-card-title>
            <v-card-subtitle>
              <v-container>
                <v-row
                  v-for="(item, index) in [
                    { label: 'Quiz ID', value: session.quiz.id },
                    { label: 'Title', value: session.quiz.title },
                    { label: 'Created At', value: formatDate(session.quiz.createdAt) }]"
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
              </v-container>
            </v-card-subtitle>
          </v-card>
          <v-card-text>
            <v-container>
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
  import { onMounted, ref } from 'vue';
  import { SessionWithQuizQuestionsOptions } from '@/models/session';

  const session = ref<SessionWithQuizQuestionsOptions | null>(null);
  const loading = ref(true);

  onMounted(() => {
    // Replace this with your actual API call to fetch session details by ID
    const mockResponse = {
      success: true,
      data: {
        sessionId: '18299c25-f7de-4bc0-a65c-e0a6207ab78e',
        sessionCode: '90MDL25MGQ',
        startTime: '2025-05-01T21:20:12.52856',
        endTime: null,
        quiz: {
          id: '15f8db0f-84f7-4cc4-9bbd-2701cce57006',
          title: 'History Quiz 101',
          createdAt: '2025-04-30T16:01:46.355996',
          questions: [
            {
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
            {
              id: '651df2db-cc25-4133-972c-c3b093bed06d',
              questionText: 'What year did World War II begin?',
              time: 60,
              options: [
                { id: '4cdf6c92-8eea-4bb5-9857-b75404a23958', optionText: '1935', correct: false },
                { id: 'bb6224cc-9d2d-4e93-a210-f5947aa29524', optionText: '1939', correct: true },
                { id: '5d281984-b38e-4484-924d-1bb97880c284', optionText: '1941', correct: false },
                { id: 'bec0f8cc-a1d5-4f96-b633-058062b358ee', optionText: '1945', correct: false },
              ],
            },
          ],
        },
      },
      message: 'We found the session you were looking for.',
      timestamp: '2025-05-03T22:41:05.505435',
    };

    setTimeout(() => {
      if (mockResponse.success) {
        session.value = mockResponse.data as SessionWithQuizQuestionsOptions;
      } else {
        console.error('Failed to fetch session details:', mockResponse);
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
</script>
<route lang="json">
  {
    "meta": {
      "title": "Sessions Details",
      "requiresAuth": true
    }
  }
  </route>
