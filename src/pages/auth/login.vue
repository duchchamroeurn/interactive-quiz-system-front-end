<template>
  <v-container
    class="d-flex align-center justify-center bg-grey-lighten-5"
    fluid
    height="100vh"
  >
    <v-card class="pa-6">
      <v-card-title>
        <h1 class="text-h5 font-weight-bold">
          Login to Quiz System
        </h1>
      </v-card-title>
      <v-card-subtitle>
        <p class="text-body-1">
          Please enter your credentials to access the quiz system.
        </p>
      </v-card-subtitle>
      <v-card-text>
        <v-form @submit.prevent="authViewModel.login">
          <v-text-field
            v-model="authViewModel.model.email"
            label="Email"
            prepend-inner-icon="mdi-email"
            type="email"
            variant="outlined"
          />
          <v-text-field
            v-model="authViewModel.model.password"
            :append-inner-icon="authViewModel.model.show ? 'mdi-eye' : 'mdi-eye-off'"
            label="Password"
            prepend-inner-icon="mdi-lock"
            :type="authViewModel.model.show ? 'text' : 'password'"
            variant="outlined"
            @click:append-inner="authViewModel.model.show = !authViewModel.model.show"
          />
          <v-btn
            block
            color="primary"
            :loading="authViewModel.model.loading"
            size="large"
            type="submit"
          >Login</v-btn>
          <v-alert
            v-if="authViewModel.model.error"
            class="mt-6"
            color="red"
            icon="$error"
            :text="authViewModel.model.error"
          />
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
  import { authViewModel } from '@/viewmodel/auth';
</script>
<route lang="json">
  {
    "meta": {
      "title": "Login",
      "requiresAuth": false
    }
  }
  </route>
