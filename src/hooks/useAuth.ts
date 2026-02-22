'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { authApi } from '@/lib/api-services';
import { setAuth } from '@/lib/api';
import { toast } from 'sonner';

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, setAuth: storeSetAuth, logout: storeLogout } = useAuthStore();

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    const { user, accessToken, refreshToken } = res.data.data;
    storeSetAuth(user, accessToken, refreshToken);
    setAuth(accessToken, refreshToken, user);
    return user;
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    bio?: string;
    role?: 'MENTOR' | 'LEARNER';
  }) => {
    const res = await authApi.register(data);
    const { user, accessToken, refreshToken } = res.data.data;
    storeSetAuth(user, accessToken, refreshToken);
    setAuth(accessToken, refreshToken, user);
    return user;
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) await authApi.logout(refreshToken);
    } catch {
      // ignore
    } finally {
      storeLogout();
      router.push('/login');
      toast.success('Logged out successfully');
    }
  };

  return { user, isAuthenticated, login, register, logout };
}
