<template>
  <main-content-list :loading="optionViewModel.model.loading" @create="optionViewModel.openCreateDialog()">
    <template #title>
      Option List
    </template>
    <template #action>
      Create Option
    </template>
    <template #content>
      <v-data-table
        :headers="optionViewModel.headers"
        :items="optionViewModel.model.options"
        :loading="optionViewModel.model.loading"
        no-data-text="No options found."
        no-results-text="No matching options found."
      >
        <template #[`item.correct`]="{ item }">
          <v-icon :color="item.correct ? 'green' : 'red'">
            {{ item.correct ? 'mdi-check-circle' : 'mdi-close-circle' }}
          </v-icon>
        </template>
        <template #[`item.actions`]="{ item }">
          <div class="d-flex justify-end">
            <v-btn
              class="mr-2"
              color="primary"
              icon
              size="small"
              title="Edit Option"
              @click="optionViewModel.openEditDialog(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              color="error"
              icon
              size="small"
              title="Delete Option"
              @click="optionViewModel.openDeleteDialog(item)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </template>
    <template #dialogs>
      <v-dialog v-model="optionViewModel.model.deleteDialog.show" max-width="500">
        <v-card>
          <v-card-title>Confirm Deletion</v-card-title>
          <v-card-text>
            Are you sure you want to delete option: <strong>{{ optionViewModel.model.deleteDialog.option?.optionText }}</strong>?
            This action cannot be undone.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="grey" @click="optionViewModel.closeDeleteDialog">Cancel</v-btn>
            <v-btn color="red" :loading="optionViewModel.model.deleteDialog.loading" @click="optionViewModel.confirmDeleteOption">
              <span v-if="optionViewModel.model.deleteDialog.loading">Deleting...</span>
              <span v-else>Delete</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="optionViewModel.model.editDialog.show" max-width="500">
        <v-card>
          <v-card-title>
            {{ optionViewModel.model.editMode === 'create' ? 'Create Option' : 'Edit Option' }}
          </v-card-title>
          <v-card-text>
            <v-form :ref="optionViewModel.editForm" v-model="optionViewModel.model.editFormValid">
              <v-text-field
                v-model="optionViewModel.model.editDialog.option.optionText"
                label="Option Text"
                required
                :rules="optionViewModel.optionTextRules"
              />
              <v-checkbox
                v-model="optionViewModel.model.editDialog.option.correct"
                label="Correct"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="grey" @click="optionViewModel.closeEditDialog">Cancel</v-btn>
            <v-btn
              color="blue"
              :disabled="!optionViewModel.model.editFormValid"
              :loading="optionViewModel.model.editDialog.loading"
              @click="optionViewModel.saveEditOption"
            >
              <span v-if="optionViewModel.model.editDialog.loading">Saving...</span>
              <span v-else>Save</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </main-content-list>
</template>

<script lang="ts" setup>
  import { optionViewModel } from '@/viewmodel/option';

  optionViewModel.fetchOptions();

</script>
<route lang="json">
  {
    "meta": {
      "title": "Options",
      "requiresAuth": true
    }
  }
</route>
