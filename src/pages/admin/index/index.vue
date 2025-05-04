<template>
  <v-container>
    <v-card flat>
      <v-card-title class="mb-4 text-h5 font-weight-bold pb-2">
        Overview
      </v-card-title>
      <v-card-text>
        <v-row class="mb-5">
          <v-col v-for="(item, index) in overviewData" :key="index">
            <v-card class="metric-card">
              <v-card-title>{{ item.title }}</v-card-title>
              <v-card-text class="metric-value">{{ item.value }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card flat>
      <v-card-title class="mb-4 text-h5 font-weight-bold pb-2">
        Recent Activity
      </v-card-title>
      <v-card-text>
        <v-card>
          <v-card-text>
            <v-list>
              <v-list-item v-for="activity in recentActivities" :key="activity.id">
                <template #prepend>
                  <span class="activity-type">{{ activity.type }}:</span>
                  <span class="activity-details">{{ activity.details }}</span>
                  <span class="activity-time">({{ activity.time }})</span>
                </template>

              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>

    <v-card flat>
      <v-card-title class="mb-4 text-h5 font-weight-bold pb-2">
        Quick Actions
      </v-card-title>
      <v-card-text>
        <v-row class="mb-5 d-flex flex-wrap gap-4">
          <v-col v-for="(action, index) in quickActions" :key="index" class="flex-grow-0">
            <v-card flat>
              <v-card-text>
                <v-btn
                  :color="action.color"
                  size="x-large"
                  @click="action.handler"
                >
                  <v-icon class="mr-2">{{ action.icon }}</v-icon>
                  {{ action.text }}
                </v-btn>
              </v-card-text>
            </v-card>

          </v-col>

        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';

  interface Activity {
    id: string;
    type: string;
    details: string;
    time: string;
  }

  export default defineComponent({
    name: 'DashboardPage',
    components: {
    },
    setup () {
      const router = useRouter();

      // Mock data for key metrics
      const totalUsers = ref(125);
      const activeSessions = ref(15);
      const totalQuizzes = ref(30);
      const totalQuestions = ref(150);
      const totalResults = ref(1200);
      const overviewData = ref([
        { title: 'Total Users', value: totalUsers },
        { title: 'Active Sessions', value: activeSessions },
        { title: 'Total Quizzes', value: totalQuizzes },
        { title: 'Total Questions', value: totalQuestions },
        { title: 'Total Results', value: totalResults },
      ]);


      // Mock data for recent activity
      const recentActivities = ref<Activity[]>([
        { id: '1', type: 'User', details: 'John Doe registered', time: '2 mins ago' },
        { id: '2', type: 'Quiz', details: 'Quiz "Math 101" created', time: '10 mins ago' },
        { id: '3', type: 'Session', details: 'Session "History Quiz" started', time: '30 mins ago' },
        { id: '4', type: 'Question', details: 'Question "What is the capital of France?" created', time: '1 hour ago' },
        { id: '5', type: 'Result', details: '10 new results submitted', time: '2 hours ago' },
      ]);

      // Function to simulate navigation
      const createQuiz = () => {
        router.push('admin/quizzes');
      };

      const startSession = () => {
        router.push('admin/sessions');
      };

      const manageUsers = () => {
        router.push('admin/users');
      };

      const viewResults = () => {
        router.push('/admin/sessions/result/19309a83-fdb2-48eb-a934-df23542c80d8');
      };

      const quickActions = ref([
        { text: 'Create New Quiz', icon: 'mdi-plus-circle', color: 'primary', handler: createQuiz },
        { text: 'Start a New Session', icon: 'mdi-play-circle', color: 'success', handler: startSession },
        { text: 'Manage Users', icon: 'mdi-account-multiple', color: 'info', handler: manageUsers },
        { text: 'View Recent Results', icon: 'mdi-chart-bar', color: 'warning', handler: viewResults },
      ]);

      onMounted(() => {
      // In a real application, you would fetch this data from your backend
      // Example:
      // fetch('/api/dashboard')
      //   .then(response => response.json())
      //   .then(data => {
      //     totalUsers.value = data.totalUsers;
      //     activeSessions.value = data.activeSessions;
      //     ...
      //   });
      });

      return {
        quickActions,
        overviewData,
        recentActivities,
        createQuiz,
        startSession,
        manageUsers,
        viewResults,
      };
    },
  });
</script>

<style scoped>

.metrics-overview {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
}

.metric-card {
  flex: 1 1 200px;
  min-width: 250px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }
}

.metric-value {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  margin-top: 10px;
}

.recent-activity {
  margin-bottom: 30px;
}

.section-title {
  margin-bottom: 20px;
  color: #333;
  font-size: 1.5rem;
  font-weight: bold;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
}

.activity-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.activity-list li {
  margin-bottom: 15px;
  font-size: 1rem;
  color: #555;
  line-height: 1.6;
}

.activity-type {
  font-weight: bold;
  color: #2c3e50;
}

.activity-details {
  color: #667885;
}

.activity-time {
  color: #999;
  font-size: 0.9rem;
  margin-left: 10px;
}

.quick-actions {
  margin-bottom: 30px;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.action-button {
  padding: 12px 25px;
  font-size: 1.1rem;
  font-weight: 500;
  border-radius: 8px;
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
  &:hover {
    background-color: #388e3c;
    transform: translateY(-2px);
    box-shadow: 0 3px 7px rgba(0, 0, 0, 0.1);
  }
}

/* Responsive Styles */
@media (max-width: 768px) {
  .metrics-overview {
    flex-direction: column;
  }
  .metric-card {
    flex: 1 1 auto;
  }
  .action-buttons {
    flex-direction: column;
  }
  .action-button {
    width: 100%;
  }
}
</style>
