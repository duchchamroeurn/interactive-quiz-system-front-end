import { useLocalStorage } from '@/composables/store';
import type { NavigationGuardWithThis } from 'vue-router';

const APP_NAME: string = import.meta.env.VITE_APP_NAME;
const homeAdmin = '/admin';
const homeUser = '/user'
const login = '/auth/login';

export const guard: NavigationGuardWithThis<undefined> = function (this: undefined, to, from, next) {
  document.title = to.meta.title + ' | ' + APP_NAME

  // Retrieve authentication and admin status
  const { isAuthenticated, isAdmin } = useLocalStorage();

  const requiredAuth = to.meta.requiresAuth === true;
  const requiredAdmin = to.meta.isAdmin === true;

  const adminAuthenticated = isAuthenticated && isAdmin;
  const routeRequiredAdmin = requiredAuth && requiredAdmin;

  //check if authentication
  if(requiredAuth && isAuthenticated) {
    if(routeRequiredAdmin && !adminAuthenticated) {
      next(homeUser);
    } else if (!routeRequiredAdmin && adminAuthenticated) {
      next(homeAdmin);
    }
  }

  if(requiredAuth && !isAuthenticated) {
    next(login);
  }

  if(!requiredAuth && isAuthenticated) {
    if(to.meta.requiresAuth === false) {
      if(adminAuthenticated) {
        next(homeAdmin);
      } else {
        next(homeUser);
      }
    }
  }
  next()
};
