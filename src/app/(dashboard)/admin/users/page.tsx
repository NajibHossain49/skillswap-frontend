'use client';

import { useState } from 'react';
import {
  Users,
  Shield,
  UserCheck,
  UserX,
  Trash2,
  Coins,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Card, Badge, Avatar, Modal, Select, EmptyState, SkeletonTable } from '@/components/ui';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import {
  useAdminUsers,
  useUpdateUserRole,
  useDeactivateUser,
  useActivateUser,
  useDeleteUser,
  useAdjustCredits,
} from '@/hooks/useAdmin';
import { User, Role } from '@/types';
import { cn, timeAgo } from '@/lib/utils';

function RoleModal({ user, onClose }: { user: User | null; onClose: () => void }) {
  const updateRole = useUpdateUserRole();
  const [role, setRole] = useState<Role>('LEARNER');
  const [lastId, setLastId] = useState<string | null>(null);
  if (user && user.id !== lastId) {
    setLastId(user.id);
    setRole(user.role);
  }

  return (
    <Modal open={!!user} onClose={onClose} title="Change role" size="sm">
      {user && (
        <div className="space-y-4">
          <p className="text-sm text-ink-400">
            Changing role for <strong className="text-ink-200">{user.name}</strong>
          </p>
          <Select
            label="New role"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            options={[
              { label: 'Admin', value: 'ADMIN' },
              { label: 'Mentor', value: 'MENTOR' },
              { label: 'Learner', value: 'LEARNER' },
            ]}
          />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={async () => {
                await updateRole.mutateAsync({ id: user.id, role });
                onClose();
              }}
              loading={updateRole.isPending}
              className="flex-1"
            >
              Update
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

function AdjustCreditsModal({ user, onClose }: { user: User | null; onClose: () => void }) {
  const adjust = useAdjustCredits();
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [lastId, setLastId] = useState<string | null>(null);
  if (user && user.id !== lastId) {
    setLastId(user.id);
    setAmount('');
    setReason('');
  }

  const parsed = Number(amount);
  const valid = amount.trim() !== '' && !Number.isNaN(parsed) && parsed !== 0 && reason.trim().length > 0;

  return (
    <Modal open={!!user} onClose={onClose} title="Adjust credits" size="sm">
      {user && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-ink-700 bg-ink-900/60 p-3.5">
            <Avatar name={user.name} size="sm" />
            <div>
              <p className="text-sm font-medium text-ink-200">{user.name}</p>
              <p className="text-xs text-ink-500 flex items-center gap-1">
                <Coins size={11} className="text-amber-400" />
                {user.creditBalance} credits
              </p>
            </div>
          </div>
          <Input
            type="number"
            label="Amount"
            placeholder="e.g. 10 or -5"
            hint="Use a negative number to deduct credits."
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Input
            label="Reason"
            placeholder="Why are you adjusting this balance?"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              disabled={!valid}
              loading={adjust.isPending}
              onClick={async () => {
                await adjust.mutateAsync({ userId: user.id, amount: parsed, reason: reason.trim() });
                onClose();
              }}
              className="flex-1"
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | ''>('');
  const [page, setPage] = useState(1);
  const [roleUser, setRoleUser] = useState<User | null>(null);
  const [creditUser, setCreditUser] = useState<User | null>(null);
  const [deleteUserTarget, setDeleteUserTarget] = useState<User | null>(null);

  const { data, isLoading, isError, isFetching, refetch } = useAdminUsers({
    search,
    role: roleFilter || undefined,
    page,
  });
  const deactivate = useDeactivateUser();
  const activate = useActivateUser();
  const deleteUser = useDeleteUser();

  const users = data?.users ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-5">
      <div className="flex gap-3 flex-wrap">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-xs"
          aria-label="Search users"
        />
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value as Role | '');
            setPage(1);
          }}
          aria-label="Filter by role"
          className="bg-ink-800 border border-ink-600 rounded-xl px-4 py-2.5 text-sm text-ink-200 focus:outline-none focus:border-accent-500"
        >
          <option value="">All roles</option>
          <option value="ADMIN">Admin</option>
          <option value="MENTOR">Mentor</option>
          <option value="LEARNER">Learner</option>
        </select>
      </div>

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <SkeletonTable rows={8} cols={5} />
      ) : users.length === 0 ? (
        <EmptyState
          icon={<Users size={28} />}
          title="No users found"
          description="Try adjusting your search or role filter."
        />
      ) : (
        <>
          <Card className={cn('overflow-hidden', isFetching && 'opacity-70 transition-opacity')}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-ink-700/60 text-left">
                    <th className="px-6 py-4 text-xs font-semibold text-ink-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-xs font-semibold text-ink-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-xs font-semibold text-ink-500 uppercase tracking-wider">Credits</th>
                    <th className="px-6 py-4 text-xs font-semibold text-ink-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-ink-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-ink-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-700/40">
                  {users.map((u) => (
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
                      <td className="px-6 py-4 text-sm text-ink-300 tabular-nums">
                        <span className="inline-flex items-center gap-1">
                          <Coins size={12} className="text-amber-400" />
                          {u.creditBalance}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 text-xs font-medium',
                            u.isActive ? 'text-sage-400' : 'text-rose-400',
                          )}
                        >
                          <span className={cn('w-1.5 h-1.5 rounded-full', u.isActive ? 'bg-sage-400' : 'bg-rose-400')} />
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-ink-500">{timeAgo(u.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Adjust credits for ${u.name}`}
                            onClick={() => setCreditUser(u)}
                          >
                            <Coins size={14} className="text-amber-400" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Change role for ${u.name}`}
                            onClick={() => setRoleUser(u)}
                          >
                            <Shield size={14} />
                          </Button>
                          {u.isActive ? (
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Deactivate ${u.name}`}
                              onClick={() => deactivate.mutate(u.id)}
                            >
                              <UserX size={14} className="text-amber-400" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Activate ${u.name}`}
                              onClick={() => activate.mutate(u.id)}
                            >
                              <UserCheck size={14} className="text-sage-400" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Delete ${u.name}`}
                            onClick={() => setDeleteUserTarget(u)}
                          >
                            <Trash2 size={14} className="text-rose-400" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft size={14} />
                Previous
              </Button>
              <span className="text-sm text-ink-500">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button variant="secondary" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
                <ChevronRight size={14} />
              </Button>
            </div>
          )}
        </>
      )}

      <RoleModal user={roleUser} onClose={() => setRoleUser(null)} />
      <AdjustCreditsModal user={creditUser} onClose={() => setCreditUser(null)} />

      <Modal
        open={!!deleteUserTarget}
        onClose={() => setDeleteUserTarget(null)}
        title="Delete user"
        size="sm"
      >
        {deleteUserTarget && (
          <div className="space-y-5">
            <p className="text-sm text-ink-400">
              Permanently delete <strong className="text-ink-200">{deleteUserTarget.name}</strong>? This
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setDeleteUserTarget(null)} className="flex-1">
                Cancel
              </Button>
              <Button
                variant="destructive"
                loading={deleteUser.isPending}
                onClick={async () => {
                  await deleteUser.mutateAsync(deleteUserTarget.id);
                  setDeleteUserTarget(null);
                }}
                className="flex-1"
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
