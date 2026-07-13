'use client';

import { useEffect, useState } from 'react';
import { ScrollText, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { Card, EmptyState, SkeletonTable } from '@/components/ui';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { useAuditLogs } from '@/hooks/useAdmin';
import { AuditLog } from '@/types';
import { cn, formatDateTime } from '@/lib/utils';

function JsonBlock({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-ink-500 uppercase tracking-wider mb-1.5">{label}</p>
      <pre className="text-xs text-ink-300 bg-ink-900/60 border border-ink-700 rounded-xl p-3 overflow-x-auto max-h-64">
        {value == null ? '—' : JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
}

function LogRow({ log }: { log: AuditLog }) {
  const [open, setOpen] = useState(false);
  const before = log.before ?? (log.metadata?.before as unknown) ?? null;
  const after = log.after ?? (log.metadata?.after as unknown) ?? null;
  const hasDetail = before != null || after != null || (log.metadata && Object.keys(log.metadata).length > 0);

  return (
    <>
      <tr className="hover:bg-ink-700/20 transition-colors">
        <td className="px-4 py-3">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Collapse details' : 'Expand details'}
            disabled={!hasDetail}
            className="w-6 h-6 rounded-md flex items-center justify-center text-ink-400 hover:bg-ink-700 disabled:opacity-30"
          >
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        </td>
        <td className="px-4 py-3">
          <p className="text-sm text-ink-200">{log.actor?.name ?? 'System'}</p>
          <p className="text-xs text-ink-600 truncate max-w-[10rem]">{log.actorId}</p>
        </td>
        <td className="px-4 py-3">
          <span className="text-xs font-mono text-accent-300 bg-accent-500/10 px-2 py-0.5 rounded-md">
            {log.action}
          </span>
        </td>
        <td className="px-4 py-3 text-sm text-ink-300">{log.entityType}</td>
        <td className="px-4 py-3 text-xs text-ink-500 font-mono truncate max-w-[8rem]">
          {log.entityId ?? '—'}
        </td>
        <td className="px-4 py-3 text-xs text-ink-500 font-mono">{log.ip ?? '—'}</td>
        <td className="px-4 py-3 text-xs text-ink-500 whitespace-nowrap">
          {formatDateTime(log.createdAt)}
        </td>
      </tr>
      {open && hasDetail && (
        <tr>
          <td colSpan={7} className="px-4 pb-4 bg-ink-900/40">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <JsonBlock label="Before" value={before} />
              <JsonBlock label="After" value={after} />
              {before == null && after == null && log.metadata && (
                <div className="md:col-span-2">
                  <JsonBlock label="Metadata" value={log.metadata} />
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function AuditLogsPage() {
  const [actorInput, setActorInput] = useState('');
  const [entityInput, setEntityInput] = useState('');
  const [filters, setFilters] = useState<{ actorId: string; entityType: string }>({
    actorId: '',
    entityType: '',
  });
  const [page, setPage] = useState(1);

  // Debounce the free-text filters into the committed query state.
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters({ actorId: actorInput.trim(), entityType: entityInput.trim() });
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [actorInput, entityInput]);

  const { data, isLoading, isError, isFetching, refetch } = useAuditLogs({
    actorId: filters.actorId || undefined,
    entityType: filters.entityType || undefined,
    page,
  });

  const logs = data?.logs ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-5">
      <div className="flex gap-3 flex-wrap">
        <Input
          placeholder="Filter by actor ID..."
          value={actorInput}
          onChange={(e) => setActorInput(e.target.value)}
          className="max-w-xs"
          aria-label="Filter by actor ID"
        />
        <Input
          placeholder="Filter by entity (e.g. User, Session)..."
          value={entityInput}
          onChange={(e) => setEntityInput(e.target.value)}
          className="max-w-xs"
          aria-label="Filter by entity type"
        />
      </div>

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <SkeletonTable rows={8} cols={6} />
      ) : logs.length === 0 ? (
        <EmptyState
          icon={<ScrollText size={28} />}
          title="No audit entries"
          description="Administrative actions and system events will be recorded here."
        />
      ) : (
        <>
          <Card className={cn('overflow-hidden', isFetching && 'opacity-70 transition-opacity')}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-ink-700/60 text-left">
                    <th className="px-4 py-3 w-10" />
                    <th className="px-4 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wider">Actor</th>
                    <th className="px-4 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wider">Action</th>
                    <th className="px-4 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wider">Entity</th>
                    <th className="px-4 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wider">Entity ID</th>
                    <th className="px-4 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wider">IP</th>
                    <th className="px-4 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wider">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-700/40">
                  {logs.map((log) => (
                    <LogRow key={log.id} log={log} />
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
    </div>
  );
}
