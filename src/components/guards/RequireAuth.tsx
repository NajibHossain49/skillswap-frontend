'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

function GuardLoader() {
  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center">
      <Loader2 className="animate-spin text-accent-400" size={28} />
    </div>
  );
}

/**
 * Gates protected content behind authentication. Critically, it waits for the
 * session bootstrap (silent /auth/refresh on mount) to finish before deciding
 * to redirect, so a hard refresh does not bounce a logged-in user to /login.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const bootstrapped = useAuthStore((s) => s.bootstrapped);

  useEffect(() => {
    if (bootstrapped && !isAuthenticated) {
      router.replace('/login');
    }
  }, [bootstrapped, isAuthenticated, router]);

  if (!bootstrapped) return <GuardLoader />;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
