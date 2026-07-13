'use client';

import {
  Users,
  BookOpen,
  CalendarCheck,
  Star,
  Flag,
  GraduationCap,
  Coins,
  TrendingUp,
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { format, parseISO } from 'date-fns';
import { Card, StatCard, SkeletonStatCard } from '@/components/ui';
import { ErrorState } from '@/components/ui/ErrorState';
import { useAdminDashboard, useAdminReports, useMentorApplications } from '@/hooks/useAdmin';

function SignupTrendChart({ data }: { data: { date: string; count: number }[] }) {
  const points = data.map((d) => ({
    label: format(parseISO(d.date), 'MMM d'),
    count: d.count,
  }));

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={16} className="text-accent-400" />
        <h2 className="font-display font-bold text-ink-100">New signups · last 7 days</h2>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3444" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={false} width={32} />
            <Tooltip
              cursor={{ stroke: '#3b82f6', strokeOpacity: 0.2 }}
              contentStyle={{ background: '#1f2430', border: '1px solid #2d3444', borderRadius: 12, fontSize: 12 }}
              labelStyle={{ color: '#e5e7eb' }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3, fill: '#3b82f6' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const { data: stats, isLoading, isError, refetch } = useAdminDashboard();
  // Reliable live counts regardless of what the dashboard payload includes.
  const { data: openReports } = useAdminReports({ status: 'OPEN', page: 1 });
  const { data: pendingApps } = useMentorApplications({ status: 'PENDING', page: 1 });

  if (isError) return <ErrorState onRetry={() => refetch()} />;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonStatCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonStatCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  const roleMap: Record<string, number> = {};
  stats?.users.byRole.forEach((r) => {
    roleMap[r.role] = r._count.role;
  });

  const openReportCount = stats?.reports?.open ?? openReports?.pagination.total ?? 0;
  const pendingAppCount =
    stats?.mentorApplications?.pending ?? pendingApps?.pagination.total ?? 0;
  const creditsInCirculation = stats?.credits?.inCirculation;

  return (
    <div className="space-y-8">
      {/* Core stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={stats?.users.total ?? 0}
          icon={<Users size={20} />}
          color="accent"
          change={`${roleMap['MENTOR'] || 0} mentors`}
        />
        <StatCard
          label="Total Skills"
          value={stats?.skills.total ?? 0}
          icon={<BookOpen size={20} />}
          color="sage"
        />
        <StatCard
          label="Total Sessions"
          value={stats?.sessions.total ?? 0}
          icon={<CalendarCheck size={20} />}
          color="amber"
        />
        <StatCard
          label="Reviews"
          value={stats?.feedback.totalReviews ?? 0}
          icon={<Star size={20} />}
          color="rose"
          change={`Avg: ${stats?.feedback.avgRating?.toFixed(1) ?? '—'}`}
        />
      </div>

      {/* Moderation / operational stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Open Reports"
          value={openReportCount}
          icon={<Flag size={20} />}
          color="rose"
          change="Needs review"
        />
        <StatCard
          label="Pending Applications"
          value={pendingAppCount}
          icon={<GraduationCap size={20} />}
          color="accent"
          change="Awaiting decision"
        />
        <StatCard
          label="Credits in Circulation"
          value={typeof creditsInCirculation === 'number' ? creditsInCirculation : '—'}
          icon={<Coins size={20} />}
          color="amber"
        />
      </div>

      {/* Signup trend */}
      {stats?.signupTrend && stats.signupTrend.length > 0 ? (
        <SignupTrendChart data={stats.signupTrend} />
      ) : (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-ink-500" />
            <h2 className="font-display font-bold text-ink-100">New signups · last 7 days</h2>
          </div>
          <p className="text-sm text-ink-500 py-8 text-center">
            No signup trend data available.
          </p>
        </Card>
      )}
    </div>
  );
}
