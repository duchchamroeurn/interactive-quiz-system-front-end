import type { Dropdown } from '@/models/dropdown';
import { ResponseError } from '@/models/error';
import type { CreateSessionRequest } from '@/models/request/create.session';
import type { Session } from '@/models/session';
import type { TableOption } from '@/models/table';
import router from '@/router';
import { dropdownService } from '@/services/dropdown';
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

  private defaultListQuizzes: Dropdown[] = []
  private defaultListUsers: Dropdown[] = []

  readonly model = reactive({
    loading: false,
    itemsPerPage: 10,
    totalSessions: 0,
    tableOptions: {
      page: 1,
      itemsPerPage: 10,
    } as TableOption,
    sessions: [] as Session[],
    createSessionDialog: {
      show: false,
      loading: false,
      selectedQuizId: null as string | null,
      availableQuizzes: [] as Dropdown[],
      searchTimeout: undefined as undefined | number,
      isPrivateSession: false,
      selectedUsersIds: [] as string[],
      availableUsers: [] as Dropdown[],
    },
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
    this.model.tableOptions = option
    this.model.loading = true;
    try{
      await simulateDelay()
      const listSession = await sessionService.getSessions(option);
      this.model.sessions = listSession.data;
      this.model.totalSessions = listSession.totalElements;
    } catch (error) {
      if (error instanceof ResponseError) {
        console.log('Errors ', error.errors);
      }
    } finally {
      this.model.loading = false;
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
  readonly confirmDeleteSession = async () => {
    if (!this.deleteDialog.session) return;

    this.deleteDialog.loading = true;
    const sessionId = this.deleteDialog.session.sessionId;
    await simulateDelay();
    await sessionService.deleteSession(sessionId);
    this.model.sessions = this.model.sessions.filter(s => s.sessionId !== sessionId);
    this.deleteDialog.loading = false;
    this.closeDeleteDialog();
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

  readonly filterQuizzes = (queryText: string) => {
    clearTimeout(this.model.createSessionDialog.searchTimeout)
    this.model.createSessionDialog.searchTimeout = setTimeout( async () => {
      if(queryText.length >= 2) {
        try {
          const searchResult = await dropdownService.getQuizzes(queryText);
          this.model.createSessionDialog.availableQuizzes = searchResult;
        } catch (error) {
          console.log('error search quizzes ', error);
          this.model.createSessionDialog.availableQuizzes = [];
        }
      } else {
        this.model.createSessionDialog.availableQuizzes = this.defaultListQuizzes;
      }
    }, 300);
  };

  readonly filterUsers = (queryText: string) => {
    clearTimeout(this.model.createSessionDialog.searchTimeout)
    this.model.createSessionDialog.searchTimeout = setTimeout( async () => {
      if(queryText.length >= 2) {
        try {
          const searchResult = await dropdownService.getAudiences(queryText);
          this.model.createSessionDialog.availableUsers = searchResult;
        } catch (error) {
          console.log('error search users ', error);
          this.model.createSessionDialog.availableUsers = [];
        }
      } else {
        this.model.createSessionDialog.availableUsers = this.defaultListUsers;
      }
    }, 300);
  };

  readonly confirmEndSession = async () => {
    if (!this.endSessionDialog.session) return;

    this.endSessionDialog.loading = true;
    const sessionId = this.endSessionDialog.session.sessionId;
    await simulateDelay();
    const sessionEnded = await sessionService.endSession(sessionId)
    this.model.sessions = this.model.sessions.map(s => s.sessionId === sessionEnded.sessionId ? { ...s, endTime: sessionEnded.endTime } : s)
    this.endSessionDialog.loading = false;
    this.closeEndSessionDialog();
    this.refreshData()
  };

  readonly loadAvailableQuizzes = async () => {
    dropdownService.getQuizzes('').then(result => {
      this.defaultListQuizzes = result;
      this.model.createSessionDialog.availableQuizzes = result
    })
  };

  readonly loadAvailableUsers = async () => {
    dropdownService.getAudiences('').then(result => {
      this.defaultListUsers = result;
      this.model.createSessionDialog.availableUsers = result
    })
  };

  private refreshData = () => {
    this.fetchListSession(this.model.tableOptions)
  }

  readonly showCreateSessionDialog = () => {
    this.model.createSessionDialog.show = true;
    // In a real application, fetch the list of quizzes here if not already loaded
    this.loadAvailableQuizzes();
  }
  readonly closeCreateSessionDialog = () => {
    this.model.createSessionDialog.show = false;
    this.model.createSessionDialog.selectedQuizId = null;
    this.model.createSessionDialog.isPrivateSession = false;
    this.model.createSessionDialog.selectedUsersIds = [];
  }
  readonly startNewSession = async () => {
    if (this.model.createSessionDialog.selectedQuizId) {
      this.model.createSessionDialog.loading = true;
      // Simulate starting a session logic
      const requestBody: CreateSessionRequest = {
        quizId: this.model.createSessionDialog.selectedQuizId,
        users: this.model.createSessionDialog.selectedUsersIds,
      };
      await simulateDelay();
      await sessionService.startSession(requestBody);
      const data = {
        quizId: this.model.createSessionDialog.selectedQuizId,
        quizAccess: this.model.createSessionDialog.isPrivateSession,
        users: this.model.createSessionDialog.selectedUsersIds,
      }
      console.log('session data: ', data);
      this.model.createSessionDialog.loading = false;
      this.closeCreateSessionDialog();
      this.refreshData()
    }
  }
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

  readonly handleSessionAccessChange = (value: boolean) => {
    if(value && this.defaultListUsers.length == 0) {
      this.loadAvailableUsers()
    } else {
      this.model.createSessionDialog.selectedUsersIds = [];
    }
  }

  readonly saveEditSession = () => {
    if (!this.editForm.value?.validate()) return;

    this.editDialog.loading = true;
    // Simulate save API call
    setTimeout(() => {
      // In a real application, you would call your update API here
      console.log('Saving session:', this.editDialog.session);
      if (this.editMode.value === 'edit') {
        this.model.sessions = this.model.sessions.map(s =>
          s.sessionId === this.editDialog.session.sessionId ? { ...this.editDialog.session } : s
        );
      } else {
        const newSession = {
          ...this.editDialog.session,
          sessionId: crypto.randomUUID(),
          startTime: new Date().toISOString(),
          endTime: null,
        };
        this.model.sessions.push(newSession);
      }

      this.editDialog.loading = false;
      this.closeEditDialog();
    }, 500);
  };

}

export const sessionViewModel = new SessionViewModel()
