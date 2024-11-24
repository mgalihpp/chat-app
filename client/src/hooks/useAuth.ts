import api from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import { User } from '@/types/auth';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type AuthState = {
  auth: User | null;
  isAuthenticating: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  onlineUsers: never[];
  socket: string | null;
  me: () => Promise<void>;
  signUp: () => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: () => Promise<void>;
  connectSocket: () => Promise<void>;
  disconnectSocket: () => Promise<void>;
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      auth: null,
      isAuthenticating: true,
      isSigningUp: false,
      isLoggingIn: false,
      isUpdatingProfile: false,
      onlineUsers: [],
      socket: null,

      async me() {
        try {
          const res = await api
            .get<ApiResponse<User>>('/auth/me')
            .then((response) => response.data);

          set({ auth: res.data });
          get().connectSocket();
        } catch (error) {
          console.log(error);
          set({
            auth: null,
          });
        } finally {
          set({ isAuthenticating: false });
        }
      },

      async signUp() {},

      async login() {
        set({
          auth: null,
          isAuthenticating: true,
        });
      },

      async logout() {},

      async updateProfile() {},

      async connectSocket() {},

      async disconnectSocket() {},
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
