<template>
  <v-app id="inspire">
    <v-navigation-drawer permanent>
      <v-divider />
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :active="$route.path === item.path"
          color="primary"
          :to="item.path"
          :value="item"
        >
          <template #prepend>
            <v-icon :icon="item.icon" />
          </template>

          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar class="elevation-1">

      <v-app-bar-title>{{ $route.meta.title }}</v-app-bar-title>
      <v-menu
        v-model="menu"
        offset-y
      >
        <template #activator="{ props }">
          <v-list v-bind="props">
            <v-list-item
              prepend-avatar="https://cdn.vuetifyjs.com/images/john.png"
              subtitle="john@google.com"
              title="John Leider"
            >
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
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import { useAuthStore } from '@/composables/auth';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  const items = [
    { text: 'Dashboard', icon: 'mdi-view-dashboard', path: '/admin' },
    { text: 'Users', icon: 'mdi-account-multiple', path: '/admin/users' },
    { text: 'Sessions', icon: 'mdi-clock', path: '/admin/sessions' },
    { text: 'Quizzes', icon: 'mdi-clipboard-check', path: '/admin/quizzes' },
    { text: 'Questions', icon: 'mdi-help-circle', path: '/admin/questions' },
    { text: 'Options', icon: 'mdi-form-select', path: '/admin/options' },
  ];
  const menu = ref(false);
  const router = useRouter();
  const authStore = useAuthStore();

  const logout = async () => {
    await authStore.signOut();
    router.go(0);
  };
</script>
