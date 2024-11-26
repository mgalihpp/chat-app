import { User } from '@/types/auth';
import { Message } from '@/types/chat';
import { create } from 'zustand';
import { useAuth } from './useAuth';

type ChatState = {
  messages: Message[];
  users: User[];
  selectedUser: User | null;

  setMessage: (messages: Message) => void;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  setSelectedUser: (selectedUser: User | null) => void;
};

export const useChat = create<ChatState>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,

  setMessage: (message: Message) => {
    set({ messages: [...get().messages, message] });
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuth.getState().socket;

    socket?.on('newMessage', (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser.id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuth.getState().socket;
    socket?.off('newMessage');
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
