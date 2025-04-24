import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// store userId, nickname, email
interface AuthState {
  userId: number | null;
  nickname: string | null;
  email: string | null;
  isLoggedIn: boolean;
  login: (userId: number, nickname: string, email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      nickname: null,
      email: null,
      isLoggedIn: false,
      login: (userId: number, nickname: string, email: string) => set({ userId, nickname, email, isLoggedIn: true }),
      logout: () => set({ userId: null, nickname: null, email: null, isLoggedIn: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
