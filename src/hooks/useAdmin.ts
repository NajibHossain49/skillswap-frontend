'use client';

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { adminApi, reportsApi, usersApi } from '@/lib/api-services';
import { MentorStatus, ReportStatus, Role } from '@/types';
import { toast } from 'sonner';

export const adminKeys = {
  all: ['admin'] as const,
  dashboard: () => [...adminKeys.all, 'dashboard'] as const,
  activity: (days: number) => [...adminKeys.all, 'activity', days] as const,
  reports: (filters: { status?: ReportStatus; page: number }) =>
    [...adminKeys.all, 'reports', filters] as const,
  applications: (filters: { status?: MentorStatus; page: number }) =>
    [...adminKeys.all, 'applications', filters] as const,
  users: (filters: { search: string; role?: Role; page: number }) =>
    [...adminKeys.all, 'users', filters] as const,
  auditLogs: (filters: { actorId?: string; entityType?: string; page: number }) =>
    [...adminKeys.all, 'audit-logs', filters] as const,
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

export function useAdminDashboard() {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: async () => (await adminApi.getDashboard()).data.data,
  });
}

// ─── Reports ────────────────────────────────────────────────────────────────

export function useAdminReports(query: { status?: ReportStatus; page?: number } = {}) {
  const { status, page = 1 } = query;
  return useQuery({
    queryKey: adminKeys.reports({ status, page }),
    queryFn: async () => (await reportsApi.getAll({ status, page, limit: 10 })).data.data,
    placeholderData: keepPreviousData,
  });
}

export function useResolveReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      adminNote,
    }: {
      id: string;
      status: ReportStatus;
      adminNote?: string;
    }) => reportsApi.resolve(id, { status, adminNote }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [...adminKeys.all, 'reports'] });
      qc.invalidateQueries({ queryKey: adminKeys.dashboard() });
      toast.success('Report updated');
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to update report'),
  });
}

// ─── Mentor applications ────────────────────────────────────────────────────

export function useMentorApplications(query: { status?: MentorStatus; page?: number } = {}) {
  const { status, page = 1 } = query;
  return useQuery({
    queryKey: adminKeys.applications({ status, page }),
    queryFn: async () =>
      (await adminApi.getMentorApplications({ status, page, limit: 10 })).data.data,
    placeholderData: keepPreviousData,
  });
}

export function useReviewApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      status,
      note,
    }: {
      userId: string;
      status: 'APPROVED' | 'REJECTED';
      note?: string;
    }) => adminApi.reviewMentorApplication(userId, { status, note }),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: [...adminKeys.all, 'applications'] });
      qc.invalidateQueries({ queryKey: adminKeys.dashboard() });
      // Approving flips the user's role to MENTOR server-side.
      qc.invalidateQueries({ queryKey: [...adminKeys.all, 'users'] });
      toast.success(
        vars.status === 'APPROVED' ? 'Application approved' : 'Application rejected',
      );
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to review application'),
  });
}

// ─── Users ────────────────────────────────────────────────────────────────

export function useAdminUsers(query: { search?: string; role?: Role; page?: number } = {}) {
  const { search = '', role, page = 1 } = query;
  return useQuery({
    queryKey: adminKeys.users({ search, role, page }),
    queryFn: async () =>
      (await usersApi.getAll({ search: search || undefined, role, page, limit: 10 })).data.data,
    placeholderData: keepPreviousData,
  });
}

function useUsersMutation<TVars>(
  fn: (vars: TVars) => Promise<unknown>,
  successMessage: string,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [...adminKeys.all, 'users'] });
      toast.success(successMessage);
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Action failed'),
  });
}

export function useUpdateUserRole() {
  return useUsersMutation<{ id: string; role: Role }>(
    ({ id, role }) => usersApi.updateRole(id, role),
    'Role updated',
  );
}

export function useDeactivateUser() {
  return useUsersMutation<string>((id) => usersApi.deactivate(id), 'User deactivated');
}

export function useActivateUser() {
  return useUsersMutation<string>((id) => usersApi.activate(id), 'User activated');
}

export function useDeleteUser() {
  return useUsersMutation<string>((id) => usersApi.delete(id), 'User deleted');
}

export function useAdjustCredits() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { userId: string; amount: number; reason: string }) =>
      adminApi.adjustCredits(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [...adminKeys.all, 'users'] });
      qc.invalidateQueries({ queryKey: adminKeys.dashboard() });
      toast.success('Credits adjusted');
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to adjust credits'),
  });
}

// ─── Audit logs ────────────────────────────────────────────────────────────

export function useAuditLogs(
  query: { actorId?: string; entityType?: string; page?: number } = {},
) {
  const { actorId, entityType, page = 1 } = query;
  return useQuery({
    queryKey: adminKeys.auditLogs({ actorId, entityType, page }),
    queryFn: async () =>
      (
        await adminApi.getAuditLogs({
          actorId: actorId || undefined,
          entityType: entityType || undefined,
          page,
          limit: 15,
        })
      ).data.data,
    placeholderData: keepPreviousData,
  });
}
