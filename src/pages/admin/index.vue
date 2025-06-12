<template>
  <v-app id="inspire">
    <v-navigation-drawer permanent>
      <v-divider />
      <v-list>
        <v-list-item
          v-for="(item, i) in adminViewModel.navigationItems"
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
        offset-y
      >
        <template #activator="{ props }">
          <v-list v-bind="props">
            <v-list-item
              :subtitle="adminViewModel.user?.email"
              :title="adminViewModel.user?.username"
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
          <v-list-item link to="/admin/profile">
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>
          <v-divider />
          <v-list-item @click="adminViewModel.signOut()">
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
  import { adminViewModel } from '@/viewmodel/admin';
</script>
