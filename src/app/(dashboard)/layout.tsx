'use client';

import { Sidebar, MobileTopBar } from '@/app/(dashboard)/layout/Sidebar';
import { RequireAuth } from '@/components/guards/RequireAuth';
import { VerifyEmailBanner } from '@/components/VerifyEmailBanner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <div className="flex min-h-screen bg-ink-900">
        {/* Desktop: fixed left sidebar */}
        <Sidebar />

        <div className="flex-1 min-w-0 flex flex-col overflow-auto">
          <MobileTopBar />
          <VerifyEmailBanner />

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </RequireAuth>
  );
}
