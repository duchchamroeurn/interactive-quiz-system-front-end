<template>
  <main-content-list :loading="sessionViewModel.sessionListModel.loading" @create="sessionViewModel.openCreateDialog()">
    <template #title>
      Session List
    </template>
    <template #action>
      Create Session
    </template>
    <template #content>
      <v-data-table
        :headers="sessionViewModel.headers"
        :items="sessionViewModel.sessionListModel.sessions"
        :loading="sessionViewModel.sessionListModel.loading"
        no-data-text="No sessions found."
        no-results-text="No matching sessions found."
      >
        <template #[`item.startTime`]="{ item }">
          {{ dateUtils.formatDate(item.startTime) }}
        </template>
        <template #[`item.endTime`]="{ item }">
          {{ item.endTime ? dateUtils.formatDate(item.endTime) : 'Ongoing' }}
        </template>
        <template #[`item.actions`]="{ item }">
          <div class="d-flex justify-end">
            <v-btn
              class="mr-2"
              color="info"
              icon
              size="small"
              title="View Session Details"
              @click="sessionViewModel.viewSessionDetail(item)"
            >
              <v-icon>mdi-eye</v-icon>
            </v-btn>
            <v-btn
              class="mr-2"
              color="success"
              icon
              size="small"
              title="View Session Results"
              @click="sessionViewModel.viewSessionResult(item)"
            >
              <v-icon>mdi-chart-bar</v-icon>
            </v-btn>
            <v-btn
              class="mr-2"
              color="warning"
              :disabled="!!item.endTime"
              icon
              size="small"
              title="End Session"
              @click="sessionViewModel.openEndSessionDialog(item)"
            >
              <v-icon>mdi-stop-circle</v-icon>
            </v-btn>
            <v-btn
              color="error"
              icon
              size="small"
              title="Delete Session"
              @click="sessionViewModel.openDeleteDialog(item)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </template>
    <template #dialogs>

      <v-dialog v-model="sessionViewModel.deleteDialog.show" max-width="500">
        <v-card>
          <v-card-title>Confirm Deletion</v-card-title>
          <v-card-text>
            Are you sure you want to delete session: <strong>{{ sessionViewModel.deleteDialog.session?.sessionCode }}</strong>?
            This action cannot be undone.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="grey" @click="sessionViewModel.closeDeleteDialog">Cancel</v-btn>
            <v-btn color="red" :loading="sessionViewModel.deleteDialog.loading" @click="sessionViewModel.confirmDeleteSession">
              <span v-if="sessionViewModel.deleteDialog.loading">Deleting...</span>
              <span v-else>Delete</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="sessionViewModel.endSessionDialog.show" max-width="500">
        <v-card>
          <v-card-title>End Session</v-card-title>
          <v-card-text>
            Are you sure you want to end session: <strong>{{ sessionViewModel.endSessionDialog.session?.sessionCode }}</strong>?
            This action will prevent further participation.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="grey" @click="sessionViewModel.closeEndSessionDialog">Cancel</v-btn>
            <v-btn color="warning" :loading="sessionViewModel.endSessionDialog.loading" @click="sessionViewModel.confirmEndSession">
              <span v-if="sessionViewModel.endSessionDialog.loading">Ending...</span>
              <span v-else>End Session</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="sessionViewModel.editDialog.show" max-width="500">
        <v-card>
          <v-card-title>
            {{ sessionViewModel.editMode.value === 'create' ? 'Create Session' : 'Edit Session' }}
          </v-card-title>
          <v-card-text>
            <v-form :ref="sessionViewModel.editForm" v-model="sessionViewModel.editFormValid.value">
              <v-text-field
                v-model="sessionViewModel.editDialog.session.sessionCode"
                :disabled="sessionViewModel.editMode.value === 'edit'"
                label="Session Code"
                required
                :rules="sessionViewModel.sessionCodeRules"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="grey" @click="sessionViewModel.closeEditDialog">Cancel</v-btn>
            <v-btn
              color="blue"
              :disabled="!sessionViewModel.editFormValid.value"
              :loading="sessionViewModel.editDialog.loading"
              @click="sessionViewModel.saveEditSession"
            >
              <span v-if="sessionViewModel.editDialog.loading">Saving...</span>
              <span v-else>Save</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </main-content-list>

</template>

<script lang="ts" setup>
  import { dateUtils } from '@/utils/date';
  import { sessionViewModel } from '@/viewmodel/session';
  sessionViewModel.fetchListSession()
</script>
<route lang="json">
  {
    "meta": {
      "title": "Sessions",
      "requiresAuth": true
    }
  }
</route>
