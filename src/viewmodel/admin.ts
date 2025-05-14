import { localStorageService } from '@/composables/store';
import type { User } from '@/models/user';
import router from '@/router';

class AdminViewModel {

  readonly navigationItems = [
    { text: 'Dashboard', icon: 'mdi-view-dashboard', path: '/admin' },
    { text: 'Users', icon: 'mdi-account-multiple', path: '/admin/users' },
    { text: 'Sessions', icon: 'mdi-clock', path: '/admin/sessions' },
    { text: 'Quizzes', icon: 'mdi-clipboard-check', path: '/admin/quizzes' },
    { text: 'Questions', icon: 'mdi-help-circle', path: '/admin/questions' },
    { text: 'Options', icon: 'mdi-form-select', path: '/admin/options' },
  ];
  get user (): User | null {
    return localStorageService.getUser();

  }
  signOut () {
    localStorageService.signOut();
    router.go(0);
  }

}

export const adminViewModel = new AdminViewModel()
