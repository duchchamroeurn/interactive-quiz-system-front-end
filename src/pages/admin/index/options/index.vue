<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card flat>
          <v-card-title>
            <v-row>
              <v-col>
                <p>
                  Option List
                </p>
              </v-col>
              <v-col class="text-right">
                <v-btn
                  class="ml-4"
                  color="primary"
                  @click="openCreateDialog"
                >
                  <v-icon class="mr-2">mdi-plus</v-icon>
                  Create Option
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="options ?? []"
              :loading="loading"
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
                    @click="openEditDialog(item)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    color="error"
                    icon
                    size="small"
                    title="Delete Option"
                    @click="openDeleteDialog(item)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="deleteDialog.show" max-width="500">
      <v-card>
        <v-card-title>Confirm Deletion</v-card-title>
        <v-card-text>
          Are you sure you want to delete option: <strong>{{ deleteDialog.option?.optionText }}</strong>?
          This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" @click="closeDeleteDialog">Cancel</v-btn>
          <v-btn color="red" :loading="deleteDialog.loading" @click="confirmDeleteOption">
            <span v-if="deleteDialog.loading">Deleting...</span>
            <span v-else>Delete</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editDialog.show" max-width="500">
      <v-card>
        <v-card-title>
          {{ editMode === 'create' ? 'Create Option' : 'Edit Option' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="editForm" v-model="editFormValid">
            <v-text-field
              v-model="editDialog.option.optionText"
              label="Option Text"
              required
              :rules="optionTextRules"
            />
            <v-checkbox
              v-model="editDialog.option.correct"
              label="Correct"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" @click="closeEditDialog">Cancel</v-btn>
          <v-btn
            color="blue"
            :disabled="!editFormValid"
            :loading="editDialog.loading"
            @click="saveEditOption"
          >
            <span v-if="editDialog.loading">Saving...</span>
            <span v-else>Save</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
  import { useApi } from '@/composables/api';
  import type { Option } from '@/models/option';
  import { ref } from 'vue';
  import type { VForm } from 'vuetify/components';

  const headers = [
    { title: 'Option ID', value: 'id', width: '40%' },
    { title: 'Option Text', value: 'optionText', width: '40%' },
    { title: 'Correct', value: 'correct', width: '10%' },
    { title: 'Actions', value: 'actions', sortable: false, width: '10%' },
  ];

  const fetchOptions = useApi<Option[]>('http://localhost:9099/api/v1/option')
  const options = fetchOptions.data
  const loading = fetchOptions.loading
  const deleteDialog = ref({
    show: false,
    option: null as Option | null,
    loading: false,
  });

  const editDialog = ref({
    show: false,
    option: {} as Option,
    loading: false,
  });
  const editFormValid = ref(false);
  const editForm = ref<VForm | null>(null);
  const editMode = ref<'create' | 'edit'>('edit');

  const optionTextRules = [
    (v: string) => !!v || 'Option Text is required',
    (v: string) => v.length >= 1 || 'Option Text must be at least 1 character',
  ];

  const openDeleteDialog = (option: Option) => {
    deleteDialog.value = {
      show: true,
      option,
      loading: false,
    };
  };

  const closeDeleteDialog = () => {
    deleteDialog.value.show = false;
    deleteDialog.value.option = null;
  };

  const confirmDeleteOption = () => {
    if (!deleteDialog.value.option) return;

    deleteDialog.value.loading = true;
    // Simulate delete API call
    setTimeout(() => {
      // In a real application, you would call your delete API here
      console.log('Deleting option:', deleteDialog.value.option);
      // Remove the option from the list
      options.value = options.value!.filter(o => o.id !== deleteDialog.value.option!.id);
      deleteDialog.value.loading = false;
      closeDeleteDialog();
    }, 500);
  };

  const openEditDialog = (option: Option) => {
    editMode.value = 'edit';
    editDialog.value = {
      show: true,
      option: { ...option },
      loading: false,
    };
  };

  const openCreateDialog = () => {
    editMode.value = 'create';
    editDialog.value = {
      show: true,
      option: {
        id: '',
        optionText: '',
        correct: false,
      },
      loading: false,
    };
  };

  const closeEditDialog = () => {
    editDialog.value.show = false;
    editDialog.value.option = {} as Option;
  };

  const saveEditOption = () => {
    if (!editForm.value?.validate()) return;

    editDialog.value.loading = true;
    // Simulate save API call
    setTimeout(() => {
      // In a real application, you would call your update API here
      console.log('Saving option:', editDialog.value.option);
      if (editMode.value === 'edit') {
        options.value = options.value!.map(o =>
          o.id === editDialog.value.option.id ? { ...editDialog.value.option } : o
        );
      } else {
        const newOption = {
          ...editDialog.value.option,
          id: crypto.randomUUID(),
        };
        options.value!.push(newOption);
      }

      editDialog.value.loading = false;
      closeEditDialog();
    }, 500);
  };
</script>
<route lang="json">
  {
    "meta": {
      "title": "Options",
      "requiresAuth": true
    }
  }
</route>
