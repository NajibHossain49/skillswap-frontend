import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ─── In-memory access token ──────────────────────────────────────────────────
// The access token lives ONLY in this module-level variable (mirrored into
// Zustand state). It is deliberately never written to localStorage, so an XSS
// payload cannot read a long-lived credential off disk. It is lost on refresh
// and re-hydrated from the refresh token on app mount (see providers.tsx).
let accessTokenMemory: string | null = null;

export const getAccessToken = () => accessTokenMemory;

export const setAccessToken = (token: string | null) => {
  accessTokenMemory = token;
};

// Attach access token to every request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessTokenMemory) {
    config.headers.Authorization = `Bearer ${accessTokenMemory}`;
  }
  return config;
});

// ─── Typed API error ───────────────────────────────────────────────────────────

export interface ApiErrorShape {
  status?: number;
  code: 'RATE_LIMITED' | 'CONFLICT' | 'INSUFFICIENT_CREDITS' | 'SESSION_REVOKED' | 'UNKNOWN';
  message: string;
  retryAfter?: number;
}

export class ApiError extends Error implements ApiErrorShape {
  status?: number;
  code: ApiErrorShape['code'];
  retryAfter?: number;

  constructor(shape: ApiErrorShape) {
    super(shape.message);
    this.name = 'ApiError';
    this.status = shape.status;
    this.code = shape.code;
    this.retryAfter = shape.retryAfter;
  }
}

interface ServerErrorBody {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

const getServerMessage = (error: AxiosError): string | undefined => {
  const data = error.response?.data as ServerErrorBody | undefined;
  return data?.message;
};

// Token refresh on 401
let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: string) => void; reject: (e: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token!);
  });
  failedQueue = [];
};

const isRefreshRequest = (config?: InternalAxiosRequestConfig) =>
  !!config?.url && config.url.includes('/auth/refresh');

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;
    const serverMessage = getServerMessage(error);

    // ── Surface the new backend errors as clear toasts + typed re-throws ────────
    // This must run BEFORE the 401 → refresh logic below.

    // A revoked refresh token means the whole session is gone — sign out cleanly.
    if (
      isRefreshRequest(originalRequest) &&
      serverMessage === 'Session revoked for security reasons'
    ) {
      clearAuth();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      toast.error('You were signed out for security reasons.');
      return Promise.reject(
        new ApiError({ status, code: 'SESSION_REVOKED', message: serverMessage }),
      );
    }

    if (status === 429) {
      const retryAfterHeader = error.response?.headers?.['retry-after'];
      const retryAfter = retryAfterHeader ? Number(retryAfterHeader) : undefined;
      const message = 'Too many requests. Please wait a moment and try again.';
      toast.error(message);
      return Promise.reject(
        new ApiError({
          status,
          code: 'RATE_LIMITED',
          message,
          retryAfter: Number.isFinite(retryAfter) ? retryAfter : undefined,
        }),
      );
    }

    if (status === 409) {
      const message = serverMessage || 'This action conflicts with the current state.';
      toast.error(message);
      return Promise.reject(new ApiError({ status, code: 'CONFLICT', message }));
    }

    if (status === 400 && serverMessage?.includes('Insufficient credits')) {
      toast.error(serverMessage);
      return Promise.reject(
        new ApiError({ status, code: 'INSUFFICIENT_CREDITS', message: serverMessage }),
      );
    }

    // ── 401 → refresh → retry queue (must keep working) ─────────────────────────
    // Never try to refresh when the failing request IS the refresh call itself,
    // otherwise we risk an infinite refresh loop.
    if (status === 401 && !originalRequest._retry && !isRefreshRequest(originalRequest)) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        isRefreshing = false;
        clearAuth();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${BASE_URL}/api/auth/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefresh } = res.data.data;
        setAccessToken(accessToken);
        // TODO: migrate to httpOnly cookie — the refresh token still lives in
        // localStorage because the backend returns it in the JSON body.
        localStorage.setItem('refreshToken', newRefresh);
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuth();
        const refreshMessage = getServerMessage(refreshError as AxiosError);
        if (refreshMessage === 'Session revoked for security reasons') {
          toast.error('You were signed out for security reasons.');
        }
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export const clearAuth = () => {
  accessTokenMemory = null;
  localStorage.removeItem('refreshToken');
  // Clean up any legacy values from the previous localStorage-based scheme.
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
};

export const setAuth = (accessToken: string, refreshToken: string, _user?: unknown) => {
  // Access token stays in memory only — never localStorage.
  setAccessToken(accessToken);
  // TODO: migrate to httpOnly cookie — the refresh token still lives in
  // localStorage because the backend returns it in the JSON body.
  localStorage.setItem('refreshToken', refreshToken);
};

export default api;
