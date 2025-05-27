<template>
  <main-content-list :loading="false" @create="sessionViewModel.showCreateSessionDialog">
    <template #title>
      Session List
    </template>
    <template #action>
      Create Session
    </template>
    <template #content>
      <v-data-table-server
        v-model:options="sessionViewModel.model.tableOptions"
        :headers="sessionViewModel.headers"
        :items="sessionViewModel.model.sessions"
        :items-length="sessionViewModel.model.totalSessions"
        :loading="sessionViewModel.model.loading"
        no-data-text="No sessions found."
        no-results-text="No matching sessions found."
        @update:options="sessionViewModel.fetchListSession"
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
      </v-data-table-server>
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

      <!-- <v-dialog v-model="sessionViewModel.model.createSessionDialog.show" max-width="500" persistent>
        <v-card>
          <v-card-title>
            Start New Session
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-autocomplete
                v-model="sessionViewModel.model.createSessionDialog.selectedQuizId"
                item-text="title"
                item-value="value"
                :items="sessionViewModel.model.createSessionDialog.availableQuizzes"
                label="Select Quiz"
                required
                :rules="[v => !!v || 'Quiz is required']"
                @update:search="sessionViewModel.filterQuizzes"
              >
                <template #no-data>
                  <v-list-item>
                    <v-list-item-title>
                      No matching quizzes found.
                    </v-list-item-title>
                  </v-list-item>
                </template>
              </v-autocomplete>

            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="grey" @click="sessionViewModel.closeCreateSessionDialog">Cancel</v-btn>
            <v-btn
              color="primary"
              :disabled="!sessionViewModel.model.createSessionDialog.selectedQuizId"
              :loading="sessionViewModel.model.createSessionDialog.loading"
              @click="sessionViewModel.startNewSession"
            >
              <span v-if="sessionViewModel.model.createSessionDialog.loading">Starting...</span>
              <span v-else>Start Session</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog> -->
      <v-dialog v-model="sessionViewModel.model.createSessionDialog.show" max-width="500" persistent>
        <v-card>
          <v-card-title>
            Start New Session
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-autocomplete
                v-model="sessionViewModel.model.createSessionDialog.selectedQuizId"
                item-text="title"
                item-value="value"
                :items="sessionViewModel.model.createSessionDialog.availableQuizzes"
                label="Select Quiz"
                required
                :rules="[v => !!v || 'Quiz is required']"
                @update:search="sessionViewModel.filterQuizzes"
              >
                <template #no-data>
                  <v-list-item>
                    <v-list-item-title>
                      No matching quizzes found.
                    </v-list-item-title>
                  </v-list-item>
                </template>
              </v-autocomplete>

              <v-switch
                v-model="sessionViewModel.model.createSessionDialog.isPrivateSession"
                class="mt-4"
                color="primary"
                inset
                label="Private Session"
                @update:model-value="sessionViewModel.handleSessionAccessChange"
              />

              <v-autocomplete
                v-if="sessionViewModel.model.createSessionDialog.isPrivateSession"
                v-model="sessionViewModel.model.createSessionDialog.selectedUsersIds"
                chips
                deletable-chips
                item-text="title"
                item-value="value"
                :items="sessionViewModel.model.createSessionDialog.availableUsers"
                label="Select Users"
                multiple
                :rules="[v => (v && v.length > 0) || 'At least one user is required for private sessions']"
                small-chips
                @update:search="sessionViewModel.filterUsers"
              >
                <template #no-data>
                  <v-list-item>
                    <v-list-item-title>
                      No matching users found.
                    </v-list-item-title>
                  </v-list-item>
                </template>
              </v-autocomplete>

            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="grey" @click="sessionViewModel.closeCreateSessionDialog">Cancel</v-btn>
            <v-btn
              color="primary"
              :disabled="!sessionViewModel.model.createSessionDialog.selectedQuizId || (sessionViewModel.model.createSessionDialog.isPrivateSession && (!sessionViewModel.model.createSessionDialog.selectedUsersIds || sessionViewModel.model.createSessionDialog.selectedUsersIds.length === 0))"
              :loading="sessionViewModel.model.createSessionDialog.loading"
              @click="sessionViewModel.startNewSession"
            >
              <span v-if="sessionViewModel.model.createSessionDialog.loading">Starting...</span>
              <span v-else>Start Session</span>
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

</script>
<route lang="json">
  {
    "meta": {
      "title": "Sessions",
      "requiresAuth": true,
      "isAdmin": true
    }
  }
</route>
