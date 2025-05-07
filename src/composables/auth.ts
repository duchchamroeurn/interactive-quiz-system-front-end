import { defineStore } from 'pinia';
import { type User, UserRole } from '@/models/user';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  token: string | null;
}

// Mock authentication service (replace with your actual auth logic)
const mockAuthService = {
  simulateDelay: (ms = 500) => new Promise(resolve => setTimeout(resolve, ms)),

  signUp: async (email: string, password: string): Promise<User> => {
    await mockAuthService.simulateDelay();
    if (email === 'test@example.com') {
      throw new Error('Email already taken');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    const newUser: User = {
      userId: crypto.randomUUID(),
      email,
      username: email.split('@')[0], //  simplified
      userRole: UserRole.AUDIENCE, //  default
    };
    // Simulate storing the user and token
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('token', 'mock-auth-token'); // Store a mock token
    return newUser;
  },

  signIn: async (email: string, password: string): Promise<User> => {
    await mockAuthService.simulateDelay();
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      throw new Error('User not found. Please sign up.');
    }
    const user: User = JSON.parse(storedUser);
    if (user.email !== email) {
      throw new Error('Invalid credentials');
    }
    // Simulate successful login
    localStorage.setItem('token', 'mock-auth-token');
    return user;
  },

  signOut: async (): Promise<void> => {
    await mockAuthService.simulateDelay();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  getUser: (): User | null => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  },
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
};

export const useAuthStore = defineStore('auth', {
  state: () => {
    const authState: AuthState = {
      user: mockAuthService.getUser(),
      loading: false,
      error: null,
      token: mockAuthService.getToken(),
    };
    return authState
  },
  getters: {
    isAuthenticated: () => !!mockAuthService.getUser(),
  },
  actions: {
    async signUp (email: string, password: string) {
      this.loading = true
      this.error = null;
      try {
        const user = await mockAuthService.signUp(email, password);
        this.user = user
        this.token = 'mock-auth-token'; //  Replace with actual token
      } catch (error: unknown) {
        if(error instanceof Error) {
          this.error = error.message;
        } else {
          this.error = String(error);
        }
        this.user = null;
        this.token = null;
      } finally {
        this.loading = false;
      }
    },

    async signIn (email: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        const user = await mockAuthService.signIn(email, password);
        this.user = user;
        this.token = 'mock-auth-token';
      } catch (error: unknown) {
        if(error instanceof Error) {
          this.error = error.message;
        } else {
          this.error = String(error);
        }
        this.user = null;
        this.token = null;
      } finally {
        this.loading = false;
      }
    },

    async signOut () {
      this.loading = true;
      this.error = null;
      try {
        await mockAuthService.signOut();
        this.user = null;
        this.token = null;
      } catch (error: unknown) {
        if(error instanceof Error) {
          this.error = error.message;
        } else {
          this.error = String(error);
        }
      } finally {
        this.loading = false;
      }
    },
  },
});
