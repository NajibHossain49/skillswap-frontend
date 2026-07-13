'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Lock, Eye, EyeOff, Check, X, ShieldCheck, Monitor, Smartphone,
  Loader2, LogOut, Trash2, MapPin, Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authApi } from '@/lib/api-services';
import { useAuthStore } from '@/store/auth';
import { passwordRequirements, passwordSchema } from '@/lib/password';
import { formatDateTime, timeAgo, cn } from '@/lib/utils';

// ─── Types ──────────────────────────────────────────────────────────────────

interface DeviceSession {
  id: string;
  userAgent?: string | null;
  ip?: string | null;
  current: boolean;
  createdAt: string;
  expiresAt: string;
}

// ─── User-agent → friendly device name ────────────────────────────────────────

function parseUserAgent(ua?: string | null): { name: string; mobile: boolean } {
  if (!ua) return { name: 'Unknown device', mobile: false };

  const browser =
    /edg/i.test(ua) ? 'Edge'
    : /opr|opera/i.test(ua) ? 'Opera'
    : /chrome|crios/i.test(ua) ? 'Chrome'
    : /firefox|fxios/i.test(ua) ? 'Firefox'
    : /safari/i.test(ua) ? 'Safari'
    : 'Browser';

  const os =
    /windows/i.test(ua) ? 'Windows'
    : /iphone|ipad|ipod/i.test(ua) ? 'iOS'
    : /mac os x|macintosh/i.test(ua) ? 'macOS'
    : /android/i.test(ua) ? 'Android'
    : /linux/i.test(ua) ? 'Linux'
    : 'Unknown OS';

  const mobile = /iphone|ipad|ipod|android|mobile/i.test(ua);
  return { name: `${browser} on ${os}`, mobile };
}

// ─── Change password form ─────────────────────────────────────────────────────

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordForm = z.infer<typeof passwordFormSchema>;

function ChangePasswordCard() {
  const setTokens = useAuthStore((s) => s.setTokens);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordFormSchema), mode: 'onChange' });

  const pw = watch('newPassword') ?? '';

  const onSubmit = async (data: PasswordForm) => {
    setLoading(true);
    try {
      const res = await authApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      // Store the rotated token pair so the user stays signed in.
      const tokens = res.data.data;
      if (tokens?.accessToken && tokens?.refreshToken) {
        setTokens(tokens.accessToken, tokens.refreshToken);
      }
      toast.success('Password changed successfully');
      reset();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Could not change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-ink-900 border border-ink-800/60 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-1">
        <Lock size={16} className="text-accent-400" />
        <h3 className="text-sm font-semibold text-ink-200">Change password</h3>
      </div>
      <p className="text-xs text-ink-500 mb-5">
        Use a strong password you don&apos;t reuse anywhere else.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Current password"
          type={show ? 'text' : 'password'}
          placeholder="••••••••"
          icon={<Lock size={15} />}
          error={errors.currentPassword?.message}
          suffix={
            <button type="button" onClick={() => setShow(!show)}>
              {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
          {...register('currentPassword')}
        />
        <Input
          label="New password"
          type={show ? 'text' : 'password'}
          placeholder="••••••••"
          icon={<Lock size={15} />}
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 rounded-xl border border-ink-800 bg-ink-800/40 p-3.5">
          {passwordRequirements.map((req) => {
            const ok = req.test(pw);
            return (
              <li
                key={req.label}
                className={cn(
                  'flex items-center gap-2 text-xs transition-colors',
                  ok ? 'text-sage-400' : 'text-ink-500',
                )}
              >
                <span
                  className={cn(
                    'flex h-4 w-4 items-center justify-center rounded-full',
                    ok ? 'bg-sage-500/20' : 'bg-ink-700',
                  )}
                >
                  {ok ? <Check size={11} /> : <X size={11} className="text-ink-600" />}
                </span>
                {req.label}
              </li>
            );
          })}
        </ul>

        <Input
          label="Confirm new password"
          type={show ? 'text' : 'password'}
          placeholder="••••••••"
          icon={<Lock size={15} />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" loading={loading} className="w-full sm:w-auto">
          Update password
        </Button>
      </form>
    </div>
  );
}

// ─── Active devices ───────────────────────────────────────────────────────────

function ActiveDevicesCard() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const [sessions, setSessions] = useState<DeviceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [signingOutAll, setSigningOutAll] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await authApi.listSessions();
      setSessions(res.data.data ?? []);
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Could not load your devices');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRevoke = async (id: string) => {
    setRevoking(id);
    try {
      await authApi.revokeSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      toast.success('Device signed out');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Could not revoke device');
    } finally {
      setRevoking(null);
    }
  };

  const handleSignOutAll = async () => {
    setSigningOutAll(true);
    try {
      await authApi.logoutAll();
      logout();
      toast.success('Signed out of all devices');
      router.push('/login');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Could not sign out of all devices');
      setSigningOutAll(false);
    }
  };

  return (
    <div className="bg-ink-900 border border-ink-800/60 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-1 gap-3">
        <div className="flex items-center gap-2">
          <Monitor size={16} className="text-accent-400" />
          <h3 className="text-sm font-semibold text-ink-200">Active devices</h3>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleSignOutAll}
          loading={signingOutAll}
        >
          <LogOut size={13} />
          Sign out all
        </Button>
      </div>
      <p className="text-xs text-ink-500 mb-5">
        These are the devices currently signed in to your account.
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-10 text-ink-500">
          <Loader2 size={20} className="animate-spin" />
        </div>
      ) : sessions.length === 0 ? (
        <p className="text-sm text-ink-500 py-6 text-center">No active sessions found.</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {sessions.map((s) => {
            const { name, mobile } = parseUserAgent(s.userAgent);
            const DeviceIcon = mobile ? Smartphone : Monitor;
            return (
              <div
                key={s.id}
                className="flex items-center gap-3 p-3.5 bg-ink-800/40 rounded-xl border border-ink-800/60"
              >
                <div className="w-9 h-9 rounded-lg bg-ink-800 border border-ink-700/60 flex items-center justify-center text-ink-400 shrink-0">
                  <DeviceIcon size={16} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-ink-200 truncate">{name}</p>
                    {s.current && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sage-500/15 text-sage-400 border border-sage-500/25">
                        <ShieldCheck size={10} /> This device
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-ink-500">
                    {s.ip && (
                      <span className="flex items-center gap-1">
                        <MapPin size={10} /> {s.ip}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock size={10} /> Signed in {timeAgo(s.createdAt)}
                    </span>
                    <span title={`Expires ${formatDateTime(s.expiresAt)}`}>
                      Expires {formatDateTime(s.expiresAt)}
                    </span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-ink-400 hover:text-rose-400"
                  loading={revoking === s.id}
                  onClick={() => handleRevoke(s.id)}
                >
                  {revoking === s.id ? null : <Trash2 size={13} />}
                  Revoke
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

export function SecuritySection() {
  return (
    <div className="mb-16">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck size={18} className="text-accent-400" />
        <h2 className="text-sm font-semibold text-ink-400 uppercase tracking-wider">Security</h2>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <ChangePasswordCard />
        <ActiveDevicesCard />
      </div>
    </div>
  );
}
