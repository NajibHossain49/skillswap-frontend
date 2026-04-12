'use client';

import { useQuery } from '@tanstack/react-query';
import { Users, BookOpen, Calendar, Star, TrendingUp, Clock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { StatCard, Card, SkeletonCard, Badge, Avatar } from '@/components/ui';
import { adminApi, sessionsApi } from '@/lib/api-services';
import { useAuthStore } from '@/store/auth';
import { formatDateTime, formatDuration, timeAgo } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Session, SessionStatus } from '@/types';

const STATUS_COLORS: Record<SessionStatus, string> = {
  PENDING: '#F59E0B',
  SCHEDULED: '#6C63FF',
  COMPLETED: '#3ECF8E',
  CANCELLED: '#F43F5E',
};

function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => (await adminApi.getDashboard()).data.data,
  });

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  const roleMap: Record<string, number> = {};
  data.users.byRole.forEach((r) => { roleMap[r.role] = r._count.role; });

  const statusData = data.sessions.byStatus.map((s) => ({
    name: s.status,
    value: s._count.status,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={data.users.total} icon={<Users size={20} />} color="accent" change={`${roleMap['MENTOR'] || 0} mentors · ${roleMap['LEARNER'] || 0} learners`} />
        <StatCard label="Skills" value={data.skills.total} icon={<BookOpen size={20} />} color="sage" />
        <StatCard label="Sessions" value={data.sessions.total} icon={<Calendar size={20} />} color="amber" />
        <StatCard label="Avg Rating" value={data.feedback.avgRating ? data.feedback.avgRating.toFixed(1) : '—'} icon={<Star size={20} />} color="rose" change={`${data.feedback.totalReviews} reviews`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="p-6">
          <h3 className="font-display font-bold text-ink-200 mb-4">Sessions by Status</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name as SessionStatus] || '#48485F'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1E1E2D', border: '1px solid #303045', borderRadius: 12, color: '#E8E8EE' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-ink-600 text-sm">No data yet</div>
          )}
          <div className="mt-3 space-y-1.5">
            {statusData.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_COLORS[s.name as SessionStatus] }} />
                  <span className="text-ink-400 capitalize">{s.name.toLowerCase()}</span>
                </div>
                <span className="text-ink-200 font-medium">{s.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent users */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-ink-200">Recent Users</h3>
            <Link href="/admin"><Button variant="ghost" size="sm">View all</Button></Link>
          </div>
          <div className="space-y-3">
            {data.recent.users.map((u) => (
              <div key={u.id} className="flex items-center gap-3">
                <Avatar name={u.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-200 truncate">{u.name}</p>
                  <p className="text-xs text-ink-500">{u.email}</p>
                </div>
                <Badge role={u.role}>{u.role}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function MentorDashboard() {
  const { data: statsData } = useQuery({
    queryKey: ['mentor-stats'],
    queryFn: async () => (await sessionsApi.getStats()).data.data,
  });

  const { data: sessionsData } = useQuery({
    queryKey: ['mentor-recent-sessions'],
    queryFn: async () => (await sessionsApi.getAll({ limit: 5 })).data.data,
  });

  const byStatus: Record<string, number> = {};
  statsData?.byStatus.forEach((s) => { byStatus[s.status] = s._count.status; });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Sessions" value={statsData?.total || 0} icon={<Calendar size={20} />} color="accent" />
        <StatCard label="Completed" value={byStatus['COMPLETED'] || 0} icon={<TrendingUp size={20} />} color="sage" />
        <StatCard label="Scheduled" value={byStatus['SCHEDULED'] || 0} icon={<Clock size={20} />} color="amber" />
        <StatCard label="Avg Rating" value={statsData?.avgRating._avg.rating ? statsData.avgRating._avg.rating.toFixed(1) : '—'} icon={<Star size={20} />} color="rose" change={`${statsData?.avgRating._count.rating || 0} reviews`} />
      </div>
      <UpcomingSessions sessions={sessionsData?.sessions || []} />
    </div>
  );
}

function LearnerDashboard() {
  const { data } = useQuery({
    queryKey: ['learner-sessions'],
    queryFn: async () => (await sessionsApi.getAll({ limit: 5 })).data.data,
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="My Sessions" value={data?.pagination.total || 0} icon={<Calendar size={20} />} color="accent" />
        <StatCard label="Completed" value={data?.sessions.filter(s => s.status === 'COMPLETED').length || 0} icon={<TrendingUp size={20} />} color="sage" />
        <StatCard label="Upcoming" value={data?.sessions.filter(s => s.status === 'SCHEDULED').length || 0} icon={<Clock size={20} />} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingSessions sessions={data?.sessions || []} />
        <Card className="p-6">
          <h3 className="font-display font-bold text-ink-200 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/skills">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-accent-500/8 border border-accent-500/20 hover:bg-accent-500/15 transition-colors cursor-pointer">
                <BookOpen size={18} className="text-accent-400" />
                <div>
                  <p className="text-sm font-medium text-ink-200">Browse Skills</p>
                  <p className="text-xs text-ink-500">Discover new skills to learn</p>
                </div>
              </div>
            </Link>
            <Link href="/sessions">
              <div className="flex items-center gap-3 p-3 mt-3 rounded-xl bg-sage-500/8 border border-sage-500/20 hover:bg-sage-500/15 transition-colors cursor-pointer">
                <Calendar size={18} className="text-sage-400" />
                <div>
                  <p className="text-sm font-medium text-ink-200">Find Sessions</p>
                  <p className="text-xs text-ink-500">Book a session with a mentor</p>
                </div>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

function UpcomingSessions({ sessions }: { sessions: Session[] }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-ink-200">Recent Sessions</h3>
        <Link href="/sessions"><Button variant="ghost" size="sm">View all</Button></Link>
      </div>
      {sessions.length === 0 ? (
        <p className="text-ink-600 text-sm text-center py-8">No sessions yet</p>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <Link key={s.id} href={`/sessions/${s.id}`}>
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-ink-700/40 transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-accent-500/10 flex items-center justify-center text-accent-400 shrink-0">
                  <Calendar size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-200 truncate">{s.title}</p>
                  <p className="text-xs text-ink-500">{formatDateTime(s.scheduledAt)} · {formatDuration(s.duration)}</p>
                </div>
                <Badge status={s.status}>{s.status}</Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen">
      <Header title="Dashboard" subtitle={`${greeting()}, ${user?.name?.split(' ')[0]} 👋`} />
      <div className="p-8">
        {user?.role === 'ADMIN' && <AdminDashboard />}
        {user?.role === 'MENTOR' && <MentorDashboard />}
        {user?.role === 'LEARNER' && <LearnerDashboard />}
      </div>
    </div>
  );
}
