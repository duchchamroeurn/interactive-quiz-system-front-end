import { useLocalStorage } from '@/composables/store';
import type { NavigationGuardWithThis } from 'vue-router';

const APP_NAME: string = import.meta.env.VITE_APP_NAME
const home = '/admin'
const login = '/auth/login'
const isAuthenticated = useLocalStorage().isAuthenticated

export const guard: NavigationGuardWithThis<undefined> = function (this: undefined, to, from, next) {
  document.title = to.meta.title + ' | ' + APP_NAME
  if (to.meta.requiresAuth && ! isAuthenticated) {
    next(login)
  } else if(to.meta.requiresAuth == false && isAuthenticated) {
    next(home)
  }
  else {
    next();
  }
};
