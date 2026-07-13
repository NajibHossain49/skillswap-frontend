import type { Metadata } from 'next';
import { RequireRole } from '@/components/guards/RequireRole';
import { AdminNav } from './AdminNav';

export const metadata: Metadata = { title: 'Admin' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireRole roles={['ADMIN']}>
      <div className="min-h-screen">
        <AdminNav />
        <div className="p-8">{children}</div>
      </div>
    </RequireRole>
  );
}
