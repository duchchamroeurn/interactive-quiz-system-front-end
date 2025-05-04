<template>
  <v-main class="d-flex align-center justify-center" height="100vh">
    <v-container class="text-center" max-width="1000" width="100%">
      <div class="mb-15">
        <h1 class="text-h3 mb-5 font-weight-bold">
          Welcome to the Quiz Management System
        </h1>
        <p class="description">
          Create, manage, and take quizzes with ease.
        </p>
        <v-btn
          class="start-button"
          color="primary"
          size="large"
          @click="goToQuizList"
        >
          Get Started
        </v-btn>
      </div>
      <div class="features-section">
        <div class="feature-card">
          <h2 class="feature-title">Create Quizzes</h2>
          <p class="feature-description">
            Design your own quizzes with various question types.
          </p>
        </div>
        <div class="feature-card">
          <h2 class="feature-title">Take Quizzes</h2>
          <p class="feature-description">
            Participate in quizzes and test your knowledge.
          </p>
        </div>
        <div class="feature-card">
          <h2 class="feature-title">Manage Results</h2>
          <p class="feature-description">
            View and analyze quiz results.
          </p>
        </div>
      </div>
    </v-container>
  </v-main>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useRouter } from 'vue-router';

  export default defineComponent({
    name: 'WelcomePage',
    setup () {
      const router = useRouter();

      const goToQuizList = () => {
        router.push('/auth/login');
      };

      return {
        goToQuizList,
      };
    },
  });
</script>

<style scoped>


.description {
  font-size: 1.2rem;
  color: #667885;
  /* Grayish description */
  margin-bottom: 30px;
  line-height: 1.7;
}

.start-button {
  padding: 12px 30px;
  font-size: 1.1rem;
  font-weight: 500;
  color: white;
  background-color: #4caf50;
  /* Green button */
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #45a049;
    /* Darker green on hover */
  }
}

.features-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
}

.feature-card {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  }
}

.feature-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 15px;
}

.feature-description {
  font-size: 1.1rem;
  color: #667885;
  line-height: 1.6;
}
</style>
