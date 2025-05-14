import type { User } from '@/models/user'

export const useLocalStorage = () => {
  const KEY_USER = 'user'
  const saveUser = (user: User) => {
    localStorage.setItem(KEY_USER, JSON.stringify(user))
  }

  const getUser = (): User | null => {
    const stringJson = localStorage.getItem(KEY_USER)
    if(stringJson) {
      const data = JSON.parse(stringJson) as User
      return data
    }
    return null
  }

  const signOut = () => {
    localStorage.removeItem(KEY_USER)
  }

  const isAuthenticated = !!getUser()

  return {
    saveUser,
    getUser,
    signOut,
    isAuthenticated,
  }
}

export interface LocalStorageService {
  isAuthenticated: boolean
  saveUser(user: User): void;
  getUser(): User | null;
  signOut(): void;
}

export const localStorageService: LocalStorageService = {
  isAuthenticated: !!useLocalStorage().getUser(),
  saveUser: useLocalStorage().saveUser,
  getUser: useLocalStorage().getUser,
  signOut: useLocalStorage().signOut,
}
