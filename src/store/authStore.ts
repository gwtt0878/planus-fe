import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  userId: string | null;
  isLoggedIn: boolean;
  login: (userId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      isLoggedIn: false,
      login: (userId: string) => set({ userId, isLoggedIn: true }),
      logout: () => set({ userId: null, isLoggedIn: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
); 