<template>
  <main-content-list :loading="false" @create="optionViewModel.openCreateDialog()">
    <template #title>
      Option List
    </template>
    <template #content>
      <v-data-table-server
        v-model:items-per-page="optionViewModel.model.itemsPerPage"
        :headers="optionViewModel.headers"
        :items="optionViewModel.model.options"
        :items-length="optionViewModel.model.totalOptions"
        :loading="optionViewModel.model.loading"
        no-data-text="No options found."
        no-results-text="No matching options found."
        @update:options="optionViewModel.fetchOptions"
      >
        <template #[`item.correct`]="{ item }">
          <v-icon :color="item.correct ? 'green' : 'red'">
            {{ item.correct ? 'mdi-check-circle' : 'mdi-close-circle' }}
          </v-icon>
        </template>
      </v-data-table-server>
    </template>
  </main-content-list>
</template>

<script lang="ts" setup>
  import { optionViewModel } from '@/viewmodel/option';

</script>
<route lang="json">
  {
    "meta": {
      "title": "Options",
      "requiresAuth": true,
      "isAdmin": true
    }
  }
</route>
