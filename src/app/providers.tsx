'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { authApi } from '@/lib/api-services';
import { getAccessToken, setAccessToken, clearAuth } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

function BootstrapLoader() {
  return (
    <div className="min-h-screen bg-ink-900 flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-accent-400" size={32} />
      <p className="text-sm text-ink-500">Restoring your session…</p>
    </div>
  );
}

/**
 * Silently re-hydrates the in-memory access token on app mount.
 *
 * The access token is memory-only, so it is gone after a hard refresh. If a
 * refresh token is still present we exchange it for a fresh access token once,
 * before rendering any protected content, so guards never bounce a logged-in
 * user to /login on reload.
 */
function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const setTokens = useAuthStore((s) => s.setTokens);
  const setBootstrapped = useAuthStore((s) => s.setBootstrapped);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      const refreshToken =
        typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;

      if (refreshToken && !getAccessToken()) {
        try {
          const res = await authApi.refresh(refreshToken);
          const { accessToken, refreshToken: newRefresh } = res.data.data;
          setAccessToken(accessToken);
          setTokens(accessToken, newRefresh);
        } catch {
          // Refresh token is invalid/expired/revoked — drop the stale session.
          clearAuth();
          logout();
        }
      }

      if (active) {
        setBootstrapped(true);
        setReady(true);
      }
    };

    bootstrap();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready) return <BootstrapLoader />;
  return <>{children}</>;
}

/** Pulls an HTTP status off either our ApiError (`status`) or a raw AxiosError. */
function getErrorStatus(error: unknown): number | undefined {
  if (error && typeof error === 'object') {
    const anyErr = error as { status?: number; response?: { status?: number } };
    return anyErr.status ?? anyErr.response?.status;
  }
  return undefined;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            // Retry once for transient/network/5xx errors, but never for 4xx.
            // This keeps a failed-to-refresh 401 (or a 403/409) from triggering
            // a retry storm.
            retry: (failureCount, error) => {
              const status = getErrorStatus(error);
              if (status && status >= 400 && status < 500) return false;
              return failureCount < 1;
            },
            // Off by default; the unread-count query opts back in locally.
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap>{children}</AuthBootstrap>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
