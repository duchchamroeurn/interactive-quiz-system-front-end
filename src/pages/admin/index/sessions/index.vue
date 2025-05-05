<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card flat>
          <v-card-title>
            <v-row>
              <v-col>
                <p>
                  Session List
                </p>
              </v-col>
              <v-col class="text-right">
                <v-btn
                  class="ml-4"
                  color="primary"
                  @click="openCreateDialog"
                >
                  <v-icon class="mr-2">mdi-plus</v-icon>
                  Create Session
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
              :items="sessions"
              :loading="loading"
              no-data-text="No sessions found."
              no-results-text="No matching sessions found."
            >
              <template #[`item.startTime`]="{ item }">
                {{ formatDate(item.startTime) }}
              </template>
              <template #[`item.endTime`]="{ item }">
                {{ item.endTime ? formatDate(item.endTime) : 'Ongoing' }}
              </template>
              <template #[`item.actions`]="{ item }">
                <div class="d-flex justify-end">
                  <v-btn
                    class="mr-2"
                    color="info"
                    icon
                    size="small"
                    title="View Session Details"
                    @click="viewSessionDetail(item)"
                  >
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                  <v-btn
                    class="mr-2"
                    color="success"
                    icon
                    size="small"
                    title="View Session Results"
                    @click="viewSessionResult(item)"
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
                    @click="openEndSessionDialog(item)"
                  >
                    <v-icon>mdi-stop-circle</v-icon>
                  </v-btn>
                  <v-btn
                    color="error"
                    icon
                    size="small"
                    title="Delete Session"
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
  </v-container>

  <v-dialog v-model="deleteDialog.show" max-width="500">
    <v-card>
      <v-card-title>Confirm Deletion</v-card-title>
      <v-card-text>
        Are you sure you want to delete session: <strong>{{ deleteDialog.session?.sessionCode }}</strong>?
        This action cannot be undone.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="grey" @click="closeDeleteDialog">Cancel</v-btn>
        <v-btn color="red" :loading="deleteDialog.loading" @click="confirmDeleteSession">
          <span v-if="deleteDialog.loading">Deleting...</span>
          <span v-else>Delete</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="endSessionDialog.show" max-width="500">
    <v-card>
      <v-card-title>End Session</v-card-title>
      <v-card-text>
        Are you sure you want to end session: <strong>{{ endSessionDialog.session?.sessionCode }}</strong>?
        This action will prevent further participation.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="grey" @click="closeEndSessionDialog">Cancel</v-btn>
        <v-btn color="warning" :loading="endSessionDialog.loading" @click="confirmEndSession">
          <span v-if="endSessionDialog.loading">Ending...</span>
          <span v-else>End Session</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="editDialog.show" max-width="500">
    <v-card>
      <v-card-title>
        {{ editMode === 'create' ? 'Create Session' : 'Edit Session' }}
      </v-card-title>
      <v-card-text>
        <v-form ref="editForm" v-model="editFormValid">
          <v-text-field
            v-model="editDialog.session.sessionCode"
            :disabled="editMode === 'edit'"
            label="Session Code"
            required
            :rules="sessionCodeRules"
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
          @click="saveEditSession"
        >
          <span v-if="editDialog.loading">Saving...</span>
          <span v-else>Save</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import type { VForm } from 'vuetify/components';
  import { Session } from '@/models/session';

  const headers = [
    { title: 'Session ID', value: 'sessionId', width: '30%' },
    { title: 'Session Code', value: 'sessionCode', width: '20%' },
    { title: 'Start Time', value: 'startTime', width: '25%' },
    { title: 'End Time', value: 'endTime', width: '25%' },
    { title: 'Actions', value: 'actions', sortable: false, width: '10%' },
  ];

  const sessions = ref<Session[]>([]);
  const loading = ref(true);
  const route = useRouter();
  const deleteDialog = ref({
    show: false,
    session: null as Session | null,
    loading: false,
  });
  const endSessionDialog = ref({
    show: false,
    session: null as Session | null,
    loading: false,
  });

  const editDialog = ref({
    show: false,
    session: {} as Session,
    loading: false,
  });
  const editFormValid = ref(false);
  const editForm = ref<VForm | null>(null);
  const editMode = ref<'create' | 'edit'>('edit');

  const sessionCodeRules = [
    (v: string) => !!v || 'Session Code is required',
    (v: string) => /^[A-Z0-9]{10}$/.test(v) || 'Session Code must be 10 characters alphanumeric',
  ];

  onMounted(() => {
    const mockResponse = {
      success: true,
      data: [
        {
          sessionId: '19309a83-fdb2-48eb-a934-df23542c80d8',
          sessionCode: 'OUG8DDRWZY',
          startTime: '2025-05-01T20:04:24.404122',
          endTime: '2025-05-01T20:37:53.514039',
        },
        {
          sessionId: '18299c25-f7de-4bc0-a65c-e0a6207ab78e',
          sessionCode: '90MDL25MGQ',
          startTime: '2025-05-01T21:20:12.52856',
          endTime: null,
        },
      ],
      page: 0,
      size: 10,
      totalElements: 2,
      totalPages: 1,
      timestamp: '2025-05-03T22:34:17.398455',
    };

    setTimeout(() => {
      if (mockResponse.success) {
        sessions.value = mockResponse.data as Session[];
      } else {
        console.error('Failed to fetch sessions:', mockResponse);
      }
      loading.value = false;
    }, 500);
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      undefined,
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    );
  };

  const openDeleteDialog = (session: Session) => {
    deleteDialog.value = {
      show: true,
      session,
      loading: false,
    };
  };

  const closeDeleteDialog = () => {
    deleteDialog.value.show = false;
    deleteDialog.value.session = null;
  };

  const confirmDeleteSession = () => {
    if (!deleteDialog.value.session) return;

    deleteDialog.value.loading = true;
    // Simulate delete API call
    setTimeout(() => {
      // In a real application, you would call your delete API here
      console.log('Deleting session:', deleteDialog.value.session);
      // Remove the session from the list
      sessions.value = sessions.value.filter(s => s.sessionId !== deleteDialog.value.session!.sessionId);
      deleteDialog.value.loading = false;
      closeDeleteDialog();
    }, 500);
  };

  const openEndSessionDialog = (session: Session) => {
    endSessionDialog.value = {
      show: true,
      session,
      loading: false,
    };
  };

  const closeEndSessionDialog = () => {
    endSessionDialog.value.show = false;
    endSessionDialog.value.session = null;
  };

  const confirmEndSession = () => {
    if (!endSessionDialog.value.session) return;

    endSessionDialog.value.loading = true;
    // Simulate end session API call
    setTimeout(() => {
      // In a real application, you would call your end session API here
      console.log('Ending session:', endSessionDialog.value.session);
      // Update the session in the list
      sessions.value = sessions.value.map(s =>
        s.sessionId === endSessionDialog.value.session!.sessionId ? { ...s, endTime: new Date().toISOString() } : s
      );
      endSessionDialog.value.loading = false;
      closeEndSessionDialog();
    }, 500);
  };

  const openCreateDialog = () => {
    editMode.value = 'create';
    editDialog.value = {
      show: true,
      session: {
        sessionId: '',
        sessionCode: '',
        startTime: new Date().toISOString(),
        endTime: null,
      },
      loading: false,
    };
  };

  const closeEditDialog = () => {
    editDialog.value.show = false;
    editDialog.value.session = {} as Session;
  };

  const saveEditSession = () => {
    if (!editForm.value?.validate()) return;

    editDialog.value.loading = true;
    // Simulate save API call
    setTimeout(() => {
      // In a real application, you would call your update API here
      console.log('Saving session:', editDialog.value.session);
      if (editMode.value === 'edit') {
        sessions.value = sessions.value.map(s =>
          s.sessionId === editDialog.value.session.sessionId ? { ...editDialog.value.session } : s
        );
      } else {
        const newSession = {
          ...editDialog.value.session,
          sessionId: crypto.randomUUID(),
          startTime: new Date().toISOString(),
          endTime: null,
        };
        sessions.value.push(newSession);
      }

      editDialog.value.loading = false;
      closeEditDialog();
    }, 500);
  };

  const viewSessionDetail = (session: Session) => {
    route.push('/admin/sessions/' + session.sessionId);
  };

  const viewSessionResult = (session: Session) => {
    route.push('/admin/sessions/result/' + session.sessionId);
  };
</script>
