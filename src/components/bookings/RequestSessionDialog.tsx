'use client';

import { useEffect, useMemo, useState } from 'react';
import { format, addDays, parseISO } from 'date-fns';
import {
  Coins,
  AlertTriangle,
  Check,
  ChevronLeft,
  CalendarX,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { Modal, Textarea } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input as FormInput } from '@/components/ui/Input';
import { CreditCostBadge } from '@/components/credits/CreditCostBadge';
import { useCreateBooking } from '@/hooks/useBookings';
import { useMentorSlots } from '@/hooks/useAvailability';
import { useCreditBalance } from '@/hooks/useCredits';
import { useAuthStore } from '@/store/auth';
import { MentorProfile, Skill } from '@/types';
import { cn } from '@/lib/utils';

type Slot = { start: string; end: string };

const STEPS = ['Skill', 'Date & time', 'Confirm'];

function slotMinutes(slot: Slot): number {
  const diff = (new Date(slot.end).getTime() - new Date(slot.start).getTime()) / 60000;
  return Number.isFinite(diff) && diff > 0 ? Math.round(diff) : 60;
}

export function RequestSessionDialog({
  open,
  onClose,
  mentor,
  initialSkillId,
}: {
  open: boolean;
  onClose: () => void;
  mentor: MentorProfile;
  initialSkillId?: string;
}) {
  const booking = useCreateBooking();
  const { data: balanceData } = useCreditBalance();
  const authUser = useAuthStore((s) => s.user);
  const balance = balanceData ?? authUser?.creditBalance ?? 0;

  const [step, setStep] = useState(1);
  const [skillId, setSkillId] = useState(initialSkillId ?? '');
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState<Slot | null>(null);
  const [duration, setDuration] = useState(60);
  const [message, setMessage] = useState('');

  // Reset the wizard each time it opens.
  useEffect(() => {
    if (open) {
      setStep(1);
      setSkillId(initialSkillId ?? '');
      setDate('');
      setSlot(null);
      setDuration(60);
      setMessage('');
    }
  }, [open, initialSkillId]);

  const dateOptions = useMemo(
    () => Array.from({ length: 30 }, (_, i) => addDays(new Date(), i)),
    // Recompute when the dialog opens so "today" is fresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open],
  );

  const selectedSkill = mentor.skills.find((s) => s.id === skillId);
  const cost = selectedSkill?.creditCost ?? 0;
  const affordable = balance >= cost;
  const resultingBalance = balance - cost;

  const {
    data: slots,
    isFetching: slotsLoading,
    isError: slotsError,
    refetch: refetchSlots,
  } = useMentorSlots(mentor.id, date, open && step === 2 && !!date);

  const submit = async () => {
    if (!selectedSkill || !slot) return;
    await booking.mutateAsync({
      mentorId: mentor.id,
      skillId: selectedSkill.id,
      proposedAt: slot.start,
      duration,
      message: message.trim() || undefined,
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={`Request a session with ${mentor.name}`} size="md">
      {/* Stepper */}
      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const done = step > n;
          const active = step === n;
          return (
            <div key={label} className="flex items-center gap-2 flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors',
                    done && 'bg-accent-500 text-white',
                    active && 'bg-accent-500/20 text-accent-300 ring-1 ring-accent-500/40',
                    !done && !active && 'bg-ink-800 text-ink-500',
                  )}
                >
                  {done ? <Check size={13} /> : n}
                </span>
                <span
                  className={cn(
                    'text-xs font-medium hidden sm:block',
                    active ? 'text-ink-200' : 'text-ink-500',
                  )}
                >
                  {label}
                </span>
              </div>
              {n < STEPS.length && <div className="flex-1 h-px bg-ink-700/60 hidden sm:block" />}
            </div>
          );
        })}
      </div>

      {/* ── Step 1: skill ── */}
      {step === 1 && (
        <div className="space-y-4">
          {mentor.skills.length === 0 ? (
            <p className="text-sm text-ink-500 py-6 text-center">
              This mentor hasn&apos;t published any skills yet.
            </p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {mentor.skills.map((skill: Skill) => (
                <button
                  key={skill.id}
                  onClick={() => setSkillId(skill.id)}
                  className={cn(
                    'w-full flex items-center justify-between gap-3 rounded-xl border p-3.5 text-left transition-all',
                    skillId === skill.id
                      ? 'border-accent-500 bg-accent-500/10'
                      : 'border-ink-700/60 hover:border-ink-600',
                  )}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-200 truncate">{skill.title}</p>
                    <p className="text-xs text-ink-500">{skill.category} · {skill.level}</p>
                  </div>
                  <CreditCostBadge cost={skill.creditCost} />
                </button>
              ))}
            </div>
          )}
          <div className="flex justify-end pt-1">
            <Button disabled={!skillId} onClick={() => setStep(2)}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 2: date & slot ── */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-ink-300 mb-2">Pick a date</p>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              {dateOptions.map((d) => {
                const value = format(d, 'yyyy-MM-dd');
                const selected = value === date;
                return (
                  <button
                    key={value}
                    onClick={() => {
                      setDate(value);
                      setSlot(null);
                    }}
                    className={cn(
                      'shrink-0 w-14 rounded-xl border py-2 flex flex-col items-center gap-0.5 transition-all',
                      selected
                        ? 'border-accent-500 bg-accent-500/10 text-accent-300'
                        : 'border-ink-700/60 text-ink-400 hover:border-ink-600',
                    )}
                  >
                    <span className="text-[10px] uppercase tracking-wide">{format(d, 'EEE')}</span>
                    <span className="text-base font-bold">{format(d, 'd')}</span>
                    <span className="text-[10px] text-ink-600">{format(d, 'MMM')}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {date && (
            <div>
              <p className="text-sm font-medium text-ink-300 mb-2">Available times</p>
              {slotsLoading ? (
                <div className="flex items-center justify-center gap-2 py-8 text-sm text-ink-500">
                  <Loader2 size={16} className="animate-spin" />
                  Checking the mentor&apos;s calendar…
                </div>
              ) : slotsError ? (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <p className="text-sm text-rose-300">Couldn&apos;t load slots for this day.</p>
                  <Button variant="secondary" size="sm" onClick={() => refetchSlots()}>
                    <RefreshCw size={13} />
                    Try again
                  </Button>
                </div>
              ) : !slots || slots.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center text-ink-500">
                  <CalendarX size={22} />
                  <p className="text-sm">No open slots that day. Try another date.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map((s) => {
                    const selected = slot?.start === s.start;
                    return (
                      <button
                        key={s.start}
                        onClick={() => {
                          setSlot(s);
                          setDuration(slotMinutes(s));
                        }}
                        className={cn(
                          'rounded-lg border py-2 text-xs font-medium transition-all',
                          selected
                            ? 'border-accent-500 bg-accent-500/10 text-accent-300'
                            : 'border-ink-700/60 text-ink-300 hover:border-ink-600',
                        )}
                      >
                        {format(parseISO(s.start), 'h:mm a')}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between pt-1">
            <Button variant="ghost" onClick={() => setStep(1)}>
              <ChevronLeft size={15} />
              Back
            </Button>
            <Button disabled={!slot} onClick={() => setStep(3)}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 3: confirm ── */}
      {step === 3 && selectedSkill && slot && (
        <div className="space-y-4">
          <div className="rounded-xl border border-ink-700/60 bg-ink-800/40 p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-500">Skill</span>
              <span className="text-ink-200 font-medium">{selectedSkill.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-500">When</span>
              <span className="text-ink-200 font-medium">
                {format(parseISO(slot.start), 'EEE, MMM d · h:mm a')}
              </span>
            </div>
          </div>

          <FormInput
            label="Duration (minutes)"
            type="number"
            min="15"
            max="480"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />

          <Textarea
            label="Message (optional)"
            placeholder="Tell the mentor what you'd like to focus on..."
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div
            className={cn(
              'flex items-start gap-3 rounded-xl border p-3.5 text-sm',
              affordable
                ? 'border-amber-500/25 bg-amber-500/10 text-amber-200'
                : 'border-rose-500/25 bg-rose-500/10 text-rose-200',
            )}
          >
            {affordable ? (
              <Coins size={16} className="mt-0.5 shrink-0 text-amber-400" />
            ) : (
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rose-400" />
            )}
            <p className="leading-relaxed">
              Costs{' '}
              <strong>
                {cost} credit{cost === 1 ? '' : 's'}
              </strong>{' '}
              (held when the mentor accepts). Balance{' '}
              <strong>{balance}</strong>
              {' → '}
              <strong>{resultingBalance}</strong>.
              {!affordable && <> You need {cost - balance} more — teach a session to earn credits.</>}
            </p>
          </div>

          <div className="flex justify-between pt-1">
            <Button variant="ghost" onClick={() => setStep(2)}>
              <ChevronLeft size={15} />
              Back
            </Button>
            <Button onClick={submit} loading={booking.isPending} disabled={!affordable}>
              Send request
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
