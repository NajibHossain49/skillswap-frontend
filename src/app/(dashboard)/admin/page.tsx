'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Shield, UserCheck, UserX, Trash2, RefreshCw } from 'lucide-react';
import { Header } from '@/app/(dashboard)/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card, Badge, Avatar, StatCard, SkeletonCard, Modal, Select, EmptyState } from '@/components/ui';
import { Input } from '@/components/ui/Input';
import { adminApi, usersApi } from '@/lib/api-services';
import { User, Role } from '@/types';
import { timeAgo } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function UsersTable() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | ''>('');
  const [page, setPage] = useState(1);
  const [roleModalUser, setRoleModalUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<Role>('LEARNER');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', search, roleFilter, page],
    queryFn: async () => (await usersApi.getAll({ search, role: roleFilter || undefined, page, limit: 10 })).data.data,
  });

  const updateRole = useMutation({
    mutationFn: ({ id, role }: { id: string; role: Role }) => usersApi.updateRole(id, role),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('Role updated'); setRoleModalUser(null); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const deactivate = useMutation({
    mutationFn: usersApi.deactivate,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('User deactivated'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const activate = useMutation({
    mutationFn: usersApi.activate,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('User activated'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const deleteUser = useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('User deleted'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="max-w-xs"
        />
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value as Role | ''); setPage(1); }}
          className="bg-ink-800 border border-ink-600 rounded-xl px-4 py-2.5 text-sm text-ink-200 focus:outline-none focus:border-accent-500"
        >
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="MENTOR">Mentor</option>
          <option value="LEARNER">Learner</option>
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : data?.users.length === 0 ? (
        <EmptyState icon={<Users size={28} />} title="No users found" />
      ) : (
        <>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-ink-700/60">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-ink-500 uppercase tracking-wider">User</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-ink-500 uppercase tracking-wider">Role</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-ink-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-ink-500 uppercase tracking-wider">Joined</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-ink-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-700/40">
                  {data?.users.map((u) => (
                    <tr key={u.id} className="hover:bg-ink-700/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={u.name} size="sm" />
                          <div>
                            <p className="text-sm font-medium text-ink-200">{u.name}</p>
                            <p className="text-xs text-ink-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge role={u.role}>{u.role}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${u.isActive ? 'text-sage-400' : 'text-rose-400'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-sage-400' : 'bg-rose-400'}`} />
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-ink-500">{timeAgo(u.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => { setRoleModalUser(u); setNewRole(u.role); }}>
                            <Shield size={13} />
                          </Button>
                          {u.isActive ? (
                            <Button variant="ghost" size="sm" onClick={() => deactivate.mutate(u.id)}>
                              <UserX size={13} className="text-amber-400" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" onClick={() => activate.mutate(u.id)}>
                              <UserCheck size={13} className="text-sage-400" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => { if (confirm('Delete this user?')) deleteUser.mutate(u.id); }}>
                            <Trash2 size={13} className="text-rose-400" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {data && data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
              <span className="text-sm text-ink-500">Page {page} of {data.pagination.totalPages}</span>
              <Button variant="secondary" size="sm" disabled={page >= data.pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          )}
        </>
      )}

      <Modal open={!!roleModalUser} onClose={() => setRoleModalUser(null)} title="Change Role" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-ink-400">Changing role for <strong className="text-ink-200">{roleModalUser?.name}</strong></p>
          <Select
            label="New Role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value as Role)}
            options={[{ label: 'Admin', value: 'ADMIN' }, { label: 'Mentor', value: 'MENTOR' }, { label: 'Learner', value: 'LEARNER' }]}
          />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setRoleModalUser(null)} className="flex-1">Cancel</Button>
            <Button onClick={() => roleModalUser && updateRole.mutate({ id: roleModalUser.id, role: newRole })} className="flex-1">Update</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function AdminPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== 'ADMIN') router.push('/dashboard');
  }, [user, router]);

  const { data: stats } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => (await adminApi.getDashboard()).data.data,
  });

  const { data: activity, refetch } = useQuery({
    queryKey: ['admin-activity'],
    queryFn: async () => (await adminApi.getActivity(30)).data.data,
  });

  if (user?.role !== 'ADMIN') return null;

  const roleMap: Record<string, number> = {};
  stats?.users.byRole.forEach((r) => { roleMap[r.role] = r._count.role; });

  return (
    <div className="min-h-screen">
      <Header title="Admin Panel" subtitle="System management and analytics" />
      <div className="p-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Users" value={stats?.users.total || 0} icon={<Users size={20} />} color="accent" change={`${roleMap['MENTOR'] || 0} mentors`} />
          <StatCard label="Total Skills" value={stats?.skills.total || 0} icon={<Shield size={20} />} color="sage" />
          <StatCard label="Total Sessions" value={stats?.sessions.total || 0} icon={<RefreshCw size={20} />} color="amber" />
          <StatCard label="Reviews" value={stats?.feedback.totalReviews || 0} icon={<Users size={20} />} color="rose" change={`Avg: ${stats?.feedback.avgRating?.toFixed(1) || '—'}`} />
        </div>

        {/* Activity */}
        {activity && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'New Users (30d)', value: activity.newUsers, color: 'text-accent-400' },
              { label: 'New Sessions (30d)', value: activity.newSessions, color: 'text-sage-400' },
              { label: 'Completed (30d)', value: activity.completedSessions, color: 'text-amber-400' },
            ].map((item) => (
              <Card key={item.label} className="p-4 text-center">
                <p className={`font-display font-black text-3xl ${item.color}`}>{item.value}</p>
                <p className="text-xs text-ink-500 mt-1">{item.label}</p>
              </Card>
            ))}
          </div>
        )}

        {/* Users Table */}
        <div>
          <h2 className="font-display font-bold text-xl text-ink-100 mb-4">User Management</h2>
          <UsersTable />
        </div>
      </div>
    </div>
  );
}
