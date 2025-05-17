import { ResponseError } from '@/models/error';
import type { Session } from '@/models/session';
import type { TableOption } from '@/models/table';
import router from '@/router';
import { sessionService } from '@/services/session';
import { simulateDelay } from '@/utils/delay';
import { reactive, ref } from 'vue';
import type { VForm } from 'vuetify/components';

class SessionViewModel {
  readonly headers = [
    { title: 'Session ID', key: 'sessionId', width: '30%' },
    { title: 'Session Code', key: 'sessionCode', width: '20%' },
    { title: 'Start Time', key: 'startTime', width: '25%' },
    { title: 'End Time', key: 'endTime', width: '25%' },
    { title: 'Actions', key: 'actions', sortable: false, width: '10%' },
  ];

  readonly sessionListModel = reactive({
    loading: false,
    itemsPerPage: 10,
    totalSessions: 0,
    sessions: [] as Session[],
  })
  readonly deleteDialog = reactive({
    show: false,
    session: null as Session | null,
    loading: false,
  });
  readonly endSessionDialog = reactive({
    show: false,
    session: null as Session | null,
    loading: false,
  });
  readonly editDialog = reactive({
    show: false,
    session: {} as Session,
    loading: false,
  });

  readonly sessionCodeRules = [
    (v: string) => !!v || 'Session Code is required',
    (v: string) => /^[A-Z0-9]{10}$/.test(v) || 'Session Code must be 10 characters alphanumeric',
  ];

  editFormValid = ref(false);
  editForm = ref<VForm | null>(null);
  editMode = ref<'create' | 'edit'>('edit');

  readonly fetchListSession = async (option: TableOption) => {
    this.sessionListModel.loading = true;
    try{
      await simulateDelay()
      const listSession = await sessionService.getSessions(option);
      this.sessionListModel.sessions = listSession.data;
      this.sessionListModel.totalSessions = listSession.totalElements;
    } catch (error) {
      if (error instanceof ResponseError) {
        console.log('Errors ', error.errors);
      }
    } finally {
      this.sessionListModel.loading = false;
    }
  }
  readonly viewSessionDetail = (session: Session) => {
    router.push('/admin/sessions/' + session.sessionId);
  }

  readonly viewSessionResult = (session: Session) => {
    router.push('/admin/sessions/result/' + session.sessionId);
  };

  readonly openDeleteDialog = (session: Session) => {
    this.deleteDialog.show = true;
    this.deleteDialog.session = session;
    this.deleteDialog.loading = false;
  };

  readonly closeDeleteDialog = () => {
    this.deleteDialog.show = false;
    this.deleteDialog.session = null;
  };
  readonly confirmDeleteSession = () => {
    if (!this.deleteDialog.session) return;

    this.deleteDialog.loading = true;
    // Simulate delete API call
    setTimeout(() => {
      // In a real application, you would call your delete API here
      console.log('Deleting session:', this.deleteDialog.session);
      // Remove the session from the list
      this.sessionListModel.sessions = this.sessionListModel.sessions.filter(s => s.sessionId !== this.deleteDialog.session!.sessionId);
      this.deleteDialog.loading = false;
      this.closeDeleteDialog();
    }, 500);
  };

  readonly openEndSessionDialog = (session: Session) => {
    this.endSessionDialog.show = true;
    this.endSessionDialog.session = session;
    this.endSessionDialog.loading = false;
  };

  readonly closeEndSessionDialog = () => {
    this.endSessionDialog.show = false;
    this.endSessionDialog.session = null;
  };

  readonly confirmEndSession = () => {
    if (!this.endSessionDialog.session) return;

    this.endSessionDialog.loading = true;
    // Simulate end session API call
    setTimeout(() => {
      // In a real application, you would call your end session API here
      console.log('Ending session:', this.endSessionDialog.session);
      // Update the session in the list
      this.sessionListModel.sessions = this.sessionListModel.sessions.map(s =>
        s.sessionId === this.endSessionDialog.session!.sessionId ? { ...s, endTime: new Date().toISOString() } : s
      );
      this.endSessionDialog.loading = false;
      this.closeEndSessionDialog();
    }, 500);
  };

  readonly openCreateDialog = () => {
    this.editMode.value = 'create';
    this.editDialog.session = {
      sessionId: '',
      sessionCode: '',
      startTime: new Date().toISOString(),
      endTime: null,
    }
    this.editDialog.show = true;
    this.editDialog.loading = false;
  };

  readonly closeEditDialog = () => {
    this.editDialog.show = false;
    this.editDialog.session = {} as Session;
  };

  readonly saveEditSession = () => {
    if (!this.editForm.value?.validate()) return;

    this.editDialog.loading = true;
    // Simulate save API call
    setTimeout(() => {
      // In a real application, you would call your update API here
      console.log('Saving session:', this.editDialog.session);
      if (this.editMode.value === 'edit') {
        this.sessionListModel.sessions = this.sessionListModel.sessions.map(s =>
          s.sessionId === this.editDialog.session.sessionId ? { ...this.editDialog.session } : s
        );
      } else {
        const newSession = {
          ...this.editDialog.session,
          sessionId: crypto.randomUUID(),
          startTime: new Date().toISOString(),
          endTime: null,
        };
        this.sessionListModel.sessions.push(newSession);
      }

      this.editDialog.loading = false;
      this.closeEditDialog();
    }, 500);
  };

}

export const sessionViewModel = new SessionViewModel()
