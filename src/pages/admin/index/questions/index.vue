<template>
  <main-content-list :loading="false" @create="questionViewModel.openCreateDialog()">
    <template #title>
      Question List
    </template>
    <template #content>
      <v-data-table-server
        key="tblquestionlist"
        v-model:items-per-page="questionViewModel.model.itemsPerPage"
        :headers="questionViewModel.headers"
        :items="questionViewModel.model.questions"
        :items-length="questionViewModel.model.totalQuestions"
        :loading="questionViewModel.model.loading"
        no-data-text="No questions found."
        no-results-text="No matching questions found."
        @update:options="questionViewModel.fetchQuestions"
      >
        <template #[`item.actions`]="{ item }">
          <div class="d-flex justify-end">
            <v-btn
              class="mr-2"
              color="info"
              icon
              size="small"
              title="View Question Details"
              @click="questionViewModel.viewQuestionDetail(item)"
            >
              <v-icon>mdi-eye</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table-server>
    </template>
  </main-content-list>
</template>

<script lang="ts" setup>
  import { questionViewModel } from '@/viewmodel/question';

</script>
<route lang="json">
  {
    "meta": {
      "title": "Questions",
      "requiresAuth": true,
      "isAdmin": true
    }
  }
</route>
