<template>
  <v-container
    class="d-flex align-center justify-center bg-grey-lighten-5"
    fluid
    height="100vh"
  >
    <v-row justify="center">
      <v-col cols="12" lg="5" md="6" sm="8">
        <v-card class="rounded-lg text-center pa-5">
          <v-card-title class="justify-center text-h1 font-weight-bold primary--text">
            404
          </v-card-title>
          <v-card-subtitle class="text-h5 grey--text text--darken-1 mb-4">
            Page Not Found
          </v-card-subtitle>

          <v-img
            alt="Quiz Management System Logo"
            class="mb-6"
            contain
            max-height="150"
            src="/src/assets/logo.svg"
          />
          <v-card-text class="text-body-1">
            Oops! It looks like the page you are looking for does not exist.
            It might have been moved or deleted.
          </v-card-text>

          <v-divider class="my-4" />

          <v-card-actions class="justify-center">
            <v-btn
              class="mx-2"
              color="primary"
              size="large"
              variant="flat"
              @click="goToHome"
            >
              <v-icon start>mdi-home</v-icon>
              Go to Home
            </v-btn>
            <v-btn
              class="mx-2"
              color="secondary"
              size="large"
              variant="outlined"
              @click="goBack"
            >
              <v-icon start>mdi-arrow-left</v-icon>
              Go Back
            </v-btn>
          </v-card-actions>

          <div class="mt-4 text-caption grey--text">
            If you believe this is an error, please contact support.
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'; // or `vue-router/auto` if that's what you're importing for router instance

  const router = useRouter();

  const goToHome = () => {
    router.push('/');
  };

  const goBack = () => {
    router.go(-1);
  };
</script>
<route lang="json">
  {
    "meta": {
      "title": "404 Page Not Found"
    }
  }
  </route>
