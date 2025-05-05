<template>
  <div class="login-page">
    <div class="container">
      <div class="login-card">
        <h1 class="login-title">
          Login to Quiz System
        </h1>
        <p class="login-description">
          Please enter your credentials to access the quiz system.
        </p>
        <form class="login-form" @submit.prevent="handleLogin">
          <div class="form-group">
            <label class="form-label" for="email">Email</label>
            <input
              id="email"
              v-model="email"
              class="form-input"
              placeholder="Enter your email"
              type="email"
            >
          </div>
          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <input
              id="password"
              v-model="password"
              class="form-input"
              placeholder="Enter your password"
              type="password"
            >
          </div>
          <button class="login-button" :disabled="loading" type="submit">
            <span v-if="loading" class="spinner" />
            <span v-else>Login</span>
          </button>
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </form>
        <div class="signup-link">
          Don't have an account?
          <router-link class="signup-button-link" to="/signup">
            Sign up
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  const email = ref('');
  const password = ref('');
  const loading = ref(false);
  const error = ref('');
  const route = useRouter();

  const handleLogin = async () => {
    loading.value = true;
    error.value = '';
    // Simulate login process (replace with your actual authentication logic)
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      route.push('/admin');
      // if (email.value === 'test@example.com' && password.value === 'password') {
      //   // Simulate successful login
      //   // In a real app, you would get user data from the API
      //   // and store it (e.g., in Vuex or a cookie)
      //   localStorage.setItem('user', JSON.stringify({ email: email.value, token: 'fake-token' })); //store a fake token
      //   router.push('/admin/dashboard'); // Redirect to quiz list
      // } else {
      //   error.value = 'Invalid credentials. Please try again.';
      // }
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = 'An error occurred during login.';
      }
    } finally {
      loading.value = false;
    }
  };
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f4f8;
  padding: 20px;
}

.container {
  max-width: 500px;
  width: 100%;
  text-align: center;
}

.login-card {
  background-color: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.login-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 20px;
}

.login-description {
  font-size: 1.1rem;
  color: #667885;
  margin-bottom: 30px;
  line-height: 1.7;
}

.login-form {
  width: 100%;
  text-align: left;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 1rem;
  color: #2c3e50;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 12px;
  font-size: 1.1rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.3s ease;
  &:focus {
    border-color: #4caf50;
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
  }
}

.login-button {
  width: 100%;
  padding: 12px;
  font-size: 1.1rem;
  font-weight: 500;
  color: white;
  background-color: #4caf50;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease, opacity 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: #45a049;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.spinner {
  width: 24px;
  height: 24px;
  border: 5px solid;
  border-color: #fff transparent #fff transparent;
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}


.error-message {
  color: #e53935;
  font-size: 0.9rem;
  margin-top: 10px;
  padding: 10px;
  background-color: #ffe0e0;
  border-radius: 6px;
  border: 1px solid #e53935;
  text-align: center;
}

.signup-link {
  font-size: 1rem;
  color: #667885;
  margin-top: 20px;
}

.signup-button-link {
  color: #4caf50;
  text-decoration: none;
  font-weight: 500;
  margin-left: 5px;
  &:hover {
    text-decoration: underline;
  }
}
</style>
