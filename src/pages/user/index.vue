<template>
  <v-app id="inspire">
    <v-app-bar class="px-3" density="compact" flat>
      <v-toolbar-title>IQS</v-toolbar-title>
      <v-spacer />
      <v-btn text>
        <v-icon left>mdi-account-circle</v-icon>
        {{ userName }}
      </v-btn>
      <v-btn text @click="logout">
        <v-icon left>mdi-logout</v-icon>
        Logout
      </v-btn>
    </v-app-bar>

    <v-main class="bg-grey-lighten-3">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import { localStorageService } from '@/composables/store';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const userName = localStorageService.getUser()?.username

  const logout = () => {
    localStorageService.signOut()
    router.go(0);
  };


</script>
