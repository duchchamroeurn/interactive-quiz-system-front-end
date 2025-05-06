<template>
  <v-app id="inspire">
    <v-navigation-drawer permanent>
      <v-list>
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
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  const items = [
    { text: 'Dashboard', icon: 'mdi-view-dashboard', path: '/admin' },
    { text: 'Users', icon: 'mdi-account-multiple', path: '/admin/users' },
    { text: 'Sessions', icon: 'mdi-clock', path: '/admin/sessions' },
    { text: 'Quizzes', icon: 'mdi-clipboard-check', path: '/admin/quizzes' },
    { text: 'Questions', icon: 'mdi-help-circle', path: '/admin/questions' },
    { text: 'Options', icon: 'mdi-form-select', path: '/admin/options' },
  ];
</script>
