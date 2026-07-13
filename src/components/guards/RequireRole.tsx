'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { Role } from '@/types';

function GuardLoader() {
  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center">
      <Loader2 className="animate-spin text-accent-400" size={28} />
    </div>
  );
}

/**
 * Restricts content to users whose role is in `roles`. Waits for the session
 * bootstrap before redirecting. Assumes it is rendered inside <RequireAuth>,
 * but falls back to /login for unauthenticated users and /dashboard for
 * authenticated users lacking the required role.
 */
export function RequireRole({
  roles,
  children,
  redirectTo = '/dashboard',
}: {
  roles: Role[];
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const bootstrapped = useAuthStore((s) => s.bootstrapped);

  const allowed = !!user && roles.includes(user.role);

  useEffect(() => {
    if (!bootstrapped) return;
    if (!isAuthenticated) {
      router.replace('/login');
    } else if (!allowed) {
      router.replace(redirectTo);
    }
  }, [bootstrapped, isAuthenticated, allowed, redirectTo, router]);

  if (!bootstrapped) return <GuardLoader />;
  if (!isAuthenticated || !allowed) return null;

  return <>{children}</>;
}
