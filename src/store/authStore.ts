import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  userId: number | null;
  nickname: string | null;
  email: string | null;
  isLoggedIn: boolean;
  token: string | null;
  login: (
    userId: number | string,
    nickname: string,
    email: string,
    token: string
  ) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      nickname: null,
      email: null,
      token: null,
      isLoggedIn: false,
      login: (
        userId: number | string,
        nickname: string,
        email: string,
        token: string
      ) =>
        set({
          userId: typeof userId === 'string' ? parseInt(userId, 10) : userId,
          nickname,
          email,
          token,
          isLoggedIn: true,
        }),
      logout: () =>
        set({
          userId: null,
          nickname: null,
          email: null,
          token: null,
          isLoggedIn: false,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
