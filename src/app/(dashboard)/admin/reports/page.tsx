'use client';

import { useState } from 'react';
import { Flag, ChevronLeft, ChevronRight, User as UserIcon, CalendarClock } from 'lucide-react';
import { Card, Badge, EmptyState, Modal, Select, Textarea, SkeletonTable } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { useAdminReports, useResolveReport } from '@/hooks/useAdmin';
import { Report, ReportReason, ReportStatus } from '@/types';
import { cn, timeAgo, formatDateTime } from '@/lib/utils';

const STATUS_TABS: { label: string; value: ReportStatus | '' }[] = [
  { label: 'Open', value: 'OPEN' },
  { label: 'Under review', value: 'UNDER_REVIEW' },
  { label: 'Resolved', value: 'RESOLVED' },
  { label: 'Dismissed', value: 'DISMISSED' },
  { label: 'All', value: '' },
];

const REASON_LABELS: Record<ReportReason, string> = {
  SPAM: 'Spam',
  HARASSMENT: 'Harassment',
  INAPPROPRIATE_CONTENT: 'Inappropriate content',
  NO_SHOW: 'No-show',
  FRAUD: 'Fraud',
  OTHER: 'Other',
};

const STATUS_STYLES: Record<ReportStatus, string> = {
  OPEN: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  UNDER_REVIEW: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  RESOLVED: 'bg-sage-500/10 text-sage-400 border-sage-500/20',
  DISMISSED: 'bg-ink-700/60 text-ink-400 border-ink-600/60',
};

function StatusPill({ status }: { status: ReportStatus }) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium border', STATUS_STYLES[status])}>
      {status.replace('_', ' ')}
    </span>
  );
}

function ResolveDrawer({ report, onClose }: { report: Report | null; onClose: () => void }) {
  const resolve = useResolveReport();
  const [status, setStatus] = useState<ReportStatus>('UNDER_REVIEW');
  const [adminNote, setAdminNote] = useState('');

  // Sync form when a new report is opened.
  const [lastId, setLastId] = useState<string | null>(null);
  if (report && report.id !== lastId) {
    setLastId(report.id);
    setStatus(report.status === 'OPEN' ? 'UNDER_REVIEW' : report.status);
    setAdminNote(report.adminNote ?? '');
  }

  const submit = async () => {
    if (!report) return;
    await resolve.mutateAsync({ id: report.id, status, adminNote: adminNote.trim() || undefined });
    onClose();
  };

  return (
    <Modal open={!!report} onClose={onClose} title="Report detail" size="md">
      {report && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-ink-200">
              <Flag size={15} className="text-rose-400" />
              {REASON_LABELS[report.reason]}
            </span>
            <StatusPill status={report.status} />
          </div>

          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-xs text-ink-500 uppercase tracking-wider mb-1">Reporter</dt>
              <dd className="text-ink-300 flex items-center gap-1.5">
                <UserIcon size={13} />
                {report.reporter?.name ?? 'Unknown'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-500 uppercase tracking-wider mb-1">Reported</dt>
              <dd className="text-ink-300">
                {report.reportedUser?.name ?? (report.sessionId ? 'Session' : '—')}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs text-ink-500 uppercase tracking-wider mb-1">Filed</dt>
              <dd className="text-ink-400 flex items-center gap-1.5">
                <CalendarClock size={13} />
                {formatDateTime(report.createdAt)}
              </dd>
            </div>
          </dl>

          {report.description && (
            <div>
              <p className="text-xs text-ink-500 uppercase tracking-wider mb-1.5">Details</p>
              <p className="text-sm text-ink-300 leading-relaxed rounded-xl border border-ink-700 bg-ink-900/60 p-3.5 whitespace-pre-wrap">
                {report.description}
              </p>
            </div>
          )}

          <div className="border-t border-ink-700 pt-5 space-y-4">
            <Select
              label="Resolution status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ReportStatus)}
              options={[
                { label: 'Under review', value: 'UNDER_REVIEW' },
                { label: 'Resolved', value: 'RESOLVED' },
                { label: 'Dismissed', value: 'DISMISSED' },
                { label: 'Reopen', value: 'OPEN' },
              ]}
            />
            <Textarea
              label="Admin note (optional)"
              rows={3}
              placeholder="Record the action taken or the reasoning..."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
            />
            <div className="flex gap-3">
              <Button variant="secondary" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={submit} loading={resolve.isPending} className="flex-1">
                Save resolution
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default function AdminReportsPage() {
  const [status, setStatus] = useState<ReportStatus | ''>('OPEN');
  const [page, setPage] = useState(1);
  const [active, setActive] = useState<Report | null>(null);

  const { data, isLoading, isError, isFetching, refetch } = useAdminReports({
    status: status || undefined,
    page,
  });

  const reports = data?.reports ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-5">
      <div className="flex gap-1 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => {
              setStatus(tab.value);
              setPage(1);
            }}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors',
              status === tab.value
                ? 'bg-accent-500/15 text-accent-300'
                : 'text-ink-500 hover:text-ink-300 hover:bg-ink-800',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <SkeletonTable rows={6} cols={4} />
      ) : reports.length === 0 ? (
        <EmptyState
          icon={<Flag size={28} />}
          title="No reports here"
          description="When users file reports in this category, they'll appear here for review."
        />
      ) : (
        <>
          <Card className={cn('overflow-hidden', isFetching && 'opacity-70 transition-opacity')}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-ink-700/60 text-left">
                    <th className="px-6 py-4 text-xs font-semibold text-ink-500 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-4 text-xs font-semibold text-ink-500 uppercase tracking-wider">Reported</th>
                    <th className="px-6 py-4 text-xs font-semibold text-ink-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-ink-500 uppercase tracking-wider">Filed</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-ink-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-700/40">
                  {reports.map((r) => (
                    <tr key={r.id} className="hover:bg-ink-700/20 transition-colors">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 text-sm text-ink-200">
                          <Flag size={13} className="text-rose-400" />
                          {REASON_LABELS[r.reason]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-ink-400">
                        {r.reportedUser?.name ?? (r.sessionId ? 'Session' : '—')}
                      </td>
                      <td className="px-6 py-4">
                        <StatusPill status={r.status} />
                      </td>
                      <td className="px-6 py-4 text-xs text-ink-500">{timeAgo(r.createdAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="secondary" size="sm" onClick={() => setActive(r)}>
                          Review
                        </Button>
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

      <ResolveDrawer report={active} onClose={() => setActive(null)} />
    </div>
  );
}
