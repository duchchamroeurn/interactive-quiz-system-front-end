<template>
  <v-app id="inspire">
    <v-app-bar class="px-3" density="compact" flat>
      <v-toolbar-title>IQS</v-toolbar-title>
      <v-spacer />
      <v-menu
        offset-y
      >
        <template #activator="{ props }">
          <v-list v-bind="props">
            <v-list-item
              :title="userName"
            >
              <template #prepend>
                <v-btn
                  icon="mdi-account-circle"
                  variant="text"
                />
              </template>
              <template #append>
                <v-btn
                  icon="mdi-menu-down"
                  size="small"
                  variant="text"
                />
              </template>
            </v-list-item>
          </v-list>
        </template>
        <v-list>
          <v-list-item link to="/profile">
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>
          <v-divider />
          <v-list-item link to="/user/answer">
            <v-list-item-title>Answers</v-list-item-title>
          </v-list-item>
          <v-divider />
          <v-list-item @click="logout">
            <template #prepend>
              <v-icon color="red" icon="mdi-logout" />
            </template>
            <template #title>
              <h4 class="text-red">Logout</h4>
            </template>
          </v-list-item>
        </v-list>
      </v-menu>
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
