'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { clearAuth, setAccessToken } from '@/lib/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  /**
   * Whether the one-time session bootstrap (silent /auth/refresh on app mount)
   * has completed. Guards must wait for this before redirecting, otherwise a
   * hard refresh bounces a logged-in user to /login.
   */
  bootstrapped: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setBootstrapped: (value: boolean) => void;
  updateUser: (user: Partial<User>) => void;
  setCreditBalance: (n: number) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      bootstrapped: false,

      setAuth: (user, accessToken, refreshToken) => {
        // Access token in memory only.
        setAccessToken(accessToken);
        // TODO: migrate to httpOnly cookie — the refresh token still lives in
        // localStorage because the backend returns it in the JSON body.
        localStorage.setItem('refreshToken', refreshToken);
        set({ user, accessToken, refreshToken, isAuthenticated: true });
      },

      setTokens: (accessToken, refreshToken) => {
        setAccessToken(accessToken);
        // TODO: migrate to httpOnly cookie.
        localStorage.setItem('refreshToken', refreshToken);
        set({ accessToken, refreshToken, isAuthenticated: true });
      },

      setBootstrapped: (value) => set({ bootstrapped: value }),

      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),

      setCreditBalance: (n) =>
        set((state) => ({
          user: state.user ? { ...state.user, creditBalance: n } : null,
        })),

      logout: () => {
        clearAuth();
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },
    }),
    {
      name: 'skillswap-auth',
      // Only the user + auth flag are persisted. Tokens are intentionally kept
      // out of persisted state: the access token is memory-only and the refresh
      // token is managed directly in localStorage (see lib/api.ts).
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
