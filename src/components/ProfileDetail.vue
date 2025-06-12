<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="mt-8 pa-4">
          <v-card-title class="headline text-h5 text-primary">
            User Details
          </v-card-title>

          <v-divider class="my-4" />

          <v-card-text>
            <v-list density="comfortable" nav>
              <v-list-item>
                <v-list-item-title class="font-weight-medium">User ID:</v-list-item-title>
                <v-list-item-subtitle class="text-body-1">{{ user?.userId }}</v-list-item-subtitle>
              </v-list-item>

              <v-divider />

              <v-list-item>
                <v-list-item-title class="font-weight-medium">Username:</v-list-item-title>
                <v-list-item-subtitle class="text-body-1">{{ user?.username }}</v-list-item-subtitle>
              </v-list-item>

              <v-divider />

              <v-list-item>
                <v-list-item-title class="font-weight-medium">Email:</v-list-item-title>
                <v-list-item-subtitle class="text-body-1">{{ user?.email }}</v-list-item-subtitle>
              </v-list-item>

              <v-divider />

              <v-list-item>
                <v-list-item-title class="font-weight-medium">Role:</v-list-item-title>
                <v-list-item-subtitle class="text-body-1">
                  <v-chip color="success" label size="small">
                    {{ user?.userRole }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script lang="ts" setup>
  import { localStorageService } from '@/composables/store';
  const user = localStorageService.getUser()
</script>
