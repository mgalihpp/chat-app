import api from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import { User } from '@/types/auth';
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type AuthState = {
  auth: User | null;
  isAuthenticating: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  onlineUsers: User[];
  socket: Socket | null;
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
          await get().connectSocket();
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

      async logout() {
        set({
          auth: null,
          isAuthenticating: true,
        });
      },

      async updateProfile() {},

      async connectSocket() {
        const { auth } = get();
        if (!auth || get().socket?.connected) return;

        const socket = io('http://localhost:5000', {
          query: {
            userId: auth.id,
          },
        });
        socket.connect();

        set({ socket: socket });

        socket.on('getOnlineUsers', (userIds) => {
          set({ onlineUsers: userIds });
        });
      },
      async disconnectSocket() {
        if (get().socket?.connected) get().socket?.disconnect();
      },
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) =>
        // Only save the auth and isAuthenticating state
        ({
          auth: state.auth,
          isAuthenticating: state.isAuthenticating,
          isSigningUp: state.isSigningUp,
          isLoggingIn: state.isLoggingIn,
          isUpdatingProfile: state.isUpdatingProfile,
          onlineUsers: state.onlineUsers,
        }),
    }
  )
);
