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

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            retry: 1,
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
