'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CalendarClock, Plus, Pencil, Trash2, Clock, AlertTriangle, Lock } from 'lucide-react';
import { Header } from '@/app/(dashboard)/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card, Modal, Select, Skeleton, EmptyState } from '@/components/ui';
import {
  useMyAvailability,
  useCreateAvailability,
  useUpdateAvailability,
  useDeleteAvailability,
} from '@/hooks/useAvailability';
import { useAuthStore } from '@/store/auth';
import { Availability } from '@/types';
import { cn } from '@/lib/utils';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DEFAULT_TZ = 'Asia/Dhaka';

function useTimezones(): string[] {
  return useMemo(() => {
    const fallback = [
      'Asia/Dhaka',
      'Asia/Kolkata',
      'Asia/Karachi',
      'Asia/Dubai',
      'Asia/Singapore',
      'Europe/London',
      'Europe/Berlin',
      'America/New_York',
      'America/Los_Angeles',
      'UTC',
    ];
    try {
      // Modern browsers expose the full IANA list.
      const supported = (Intl as any).supportedValuesOf?.('timeZone') as string[] | undefined;
      if (supported?.length) {
        return supported.includes(DEFAULT_TZ) ? supported : [DEFAULT_TZ, ...supported];
      }
    } catch {
      /* fall through */
    }
    return fallback;
  }, []);
}

function to12h(time: string): string {
  const [hRaw, m] = time.split(':');
  const h = Number(hRaw);
  if (Number.isNaN(h)) return time;
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m ?? '00'} ${period}`;
}

// ─── Add / edit slot dialog ────────────────────────────────────────────────────

function SlotDialog({
  open,
  onClose,
  slot,
  defaultDay,
}: {
  open: boolean;
  onClose: () => void;
  slot?: Availability | null;
  defaultDay?: number;
}) {
  const create = useCreateAvailability();
  const update = useUpdateAvailability();
  const timezones = useTimezones();
  const editing = !!slot;

  const [dayOfWeek, setDayOfWeek] = useState<number>(slot?.dayOfWeek ?? defaultDay ?? 1);
  const [startTime, setStartTime] = useState(slot?.startTime ?? '09:00');
  const [endTime, setEndTime] = useState(slot?.endTime ?? '10:00');
  const [timezone, setTimezone] = useState(slot?.timezone ?? DEFAULT_TZ);
  const [error, setError] = useState<string | null>(null);

  // Reset local state whenever the dialog is (re)opened for a different slot.
  const dialogKey = `${open}-${slot?.id ?? 'new'}-${defaultDay ?? ''}`;
  const [seenKey, setSeenKey] = useState(dialogKey);
  if (dialogKey !== seenKey) {
    setSeenKey(dialogKey);
    setDayOfWeek(slot?.dayOfWeek ?? defaultDay ?? 1);
    setStartTime(slot?.startTime ?? '09:00');
    setEndTime(slot?.endTime ?? '10:00');
    setTimezone(slot?.timezone ?? DEFAULT_TZ);
    setError(null);
  }

  const pending = create.isPending || update.isPending;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (endTime <= startTime) {
      setError('End time must be after the start time.');
      return;
    }

    try {
      if (editing && slot) {
        await update.mutateAsync({ id: slot.id, data: { dayOfWeek, startTime, endTime, timezone } });
      } else {
        await create.mutateAsync({ dayOfWeek, startTime, endTime, timezone });
      }
      onClose();
    } catch (err: any) {
      // Surface the backend's overlap / validation message inline.
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'That slot overlaps an existing one. Pick a different time.',
      );
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit slot' : 'Add availability slot'} size="sm">
      <form onSubmit={onSubmit} className="space-y-4">
        <Select
          label="Day of week"
          value={String(dayOfWeek)}
          onChange={(e) => setDayOfWeek(Number(e.target.value))}
          options={DAY_NAMES.map((d, i) => ({ label: d, value: String(i) }))}
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="start-time" className="text-sm font-medium text-ink-300">
              Start time
            </label>
            <input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-2.5 text-sm text-ink-100 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30 transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="end-time" className="text-sm font-medium text-ink-300">
              End time
            </label>
            <input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-2.5 text-sm text-ink-100 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30 transition-all"
            />
          </div>
        </div>

        <Select
          label="Timezone"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          options={timezones.map((tz) => ({ label: tz.replace(/_/g, ' '), value: tz }))}
        />

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/25 bg-rose-500/10 p-3 text-sm text-rose-200">
            <AlertTriangle size={15} className="mt-0.5 shrink-0 text-rose-400" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <Button variant="secondary" type="button" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={pending} className="flex-1">
            {editing ? 'Save changes' : 'Add slot'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Delete confirm ─────────────────────────────────────────────────────────────

function DeleteSlotDialog({
  slot,
  onClose,
}: {
  slot: Availability | null;
  onClose: () => void;
}) {
  const del = useDeleteAvailability();
  if (!slot) return null;

  return (
    <Modal open={!!slot} onClose={onClose} title="Remove slot" size="sm">
      <div className="space-y-5">
        <p className="text-sm text-ink-400">
          Remove your{' '}
          <strong className="text-ink-200">
            {DAY_NAMES[slot.dayOfWeek]} {to12h(slot.startTime)}–{to12h(slot.endTime)}
          </strong>{' '}
          availability? Learners won&apos;t be able to request this time anymore.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Keep it
          </Button>
          <Button
            variant="destructive"
            loading={del.isPending}
            onClick={async () => {
              await del.mutateAsync(slot.id);
              onClose();
            }}
            className="flex-1"
          >
            Remove slot
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AvailabilityPage() {
  const user = useAuthStore((s) => s.user);
  const isApprovedMentor = user?.mentorStatus === 'APPROVED';

  const { data: slots, isLoading } = useMyAvailability();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editSlot, setEditSlot] = useState<Availability | null>(null);
  const [addDay, setAddDay] = useState<number | undefined>(undefined);
  const [deleteSlot, setDeleteSlot] = useState<Availability | null>(null);

  const byDay = useMemo(() => {
    const map: Record<number, Availability[]> = {};
    for (const s of slots ?? []) (map[s.dayOfWeek] ??= []).push(s);
    for (const day of Object.keys(map)) {
      map[Number(day)].sort((a, b) => a.startTime.localeCompare(b.startTime));
    }
    return map;
  }, [slots]);

  const openAdd = (day?: number) => {
    setEditSlot(null);
    setAddDay(day);
    setDialogOpen(true);
  };
  const openEdit = (slot: Availability) => {
    setEditSlot(slot);
    setAddDay(undefined);
    setDialogOpen(true);
  };

  if (!isApprovedMentor) {
    return (
      <div className="min-h-screen">
        <Header title="Availability" />
        <div className="p-8 max-w-3xl mx-auto">
          <EmptyState
            icon={<Lock size={26} />}
            title="Mentors only"
            description="Availability management is available once your mentor application is approved."
            action={
              <Link href="/profile">
                <Button variant="secondary">Go to profile</Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const totalSlots = slots?.length ?? 0;

  return (
    <div className="min-h-screen">
      <Header
        title="Availability"
        subtitle="Set the weekly times learners can request sessions"
      />
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-ink-500">
            {isLoading
              ? 'Loading your schedule…'
              : `${totalSlots} recurring slot${totalSlots === 1 ? '' : 's'} across the week`}
          </p>
          <Button onClick={() => openAdd()}>
            <Plus size={15} />
            Add slot
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-2xl" />
            ))}
          </div>
        ) : totalSlots === 0 ? (
          <Card className="p-2">
            <EmptyState
              icon={<CalendarClock size={26} />}
              title="No availability yet"
              description="Learners can't send you session requests until you add at least one weekly slot. Add your first block of time to open up your calendar."
              action={<Button onClick={() => openAdd()}>Add your first slot</Button>}
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {[0, 1, 2, 3, 4, 5, 6].map((day) => {
              const daySlots = byDay[day] ?? [];
              return (
                <Card key={day} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-24 shrink-0 pt-1">
                      <p className="text-sm font-semibold text-ink-200">{DAY_NAMES[day]}</p>
                      <p className="text-xs text-ink-600">{daySlots.length} slot{daySlots.length === 1 ? '' : 's'}</p>
                    </div>

                    <div className="flex-1 min-w-0">
                      {daySlots.length === 0 ? (
                        <button
                          onClick={() => openAdd(day)}
                          className="text-sm text-ink-500 hover:text-accent-400 transition-colors"
                        >
                          + Add a slot
                        </button>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {daySlots.map((slot) => (
                            <div
                              key={slot.id}
                              className="group flex items-center gap-2 rounded-xl border border-ink-700/60 bg-ink-800/50 pl-3 pr-1.5 py-1.5"
                            >
                              <Clock size={12} className="text-accent-400 shrink-0" />
                              <span className="text-xs font-medium text-ink-200">
                                {to12h(slot.startTime)} – {to12h(slot.endTime)}
                              </span>
                              {slot.timezone && (
                                <span className="text-[10px] text-ink-500 hidden sm:inline">
                                  {slot.timezone.replace(/_/g, ' ')}
                                </span>
                              )}
                              <button
                                onClick={() => openEdit(slot)}
                                aria-label="Edit slot"
                                className="w-6 h-6 rounded-lg flex items-center justify-center text-ink-500 hover:text-ink-200 hover:bg-ink-700 transition-colors"
                              >
                                <Pencil size={12} />
                              </button>
                              <button
                                onClick={() => setDeleteSlot(slot)}
                                aria-label="Delete slot"
                                className="w-6 h-6 rounded-lg flex items-center justify-center text-ink-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <SlotDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        slot={editSlot}
        defaultDay={addDay}
      />
      <DeleteSlotDialog slot={deleteSlot} onClose={() => setDeleteSlot(null)} />
    </div>
  );
}
