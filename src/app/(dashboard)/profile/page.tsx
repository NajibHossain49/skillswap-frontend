'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, LogOut, Shield, Calendar, Star, BookOpen } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card, Avatar, Badge, StatCard } from '@/components/ui';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui';
import { usersApi, sessionsApi } from '@/lib/api-services';
import { useAuthStore } from '@/store/auth';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { timeAgo } from '@/lib/utils';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const updateUser = useAuthStore((s) => s.updateUser);
  const qc = useQueryClient();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ['my-session-stats'],
    queryFn: async () => (await sessionsApi.getStats()).data.data,
    enabled: user?.role === 'MENTOR' || user?.role === 'ADMIN',
  });

  const { data: profileData } = useQuery({
    queryKey: ['my-profile'],
    queryFn: async () => (await usersApi.getProfile()).data.data,
  });

  const updateProfile = async () => {
    setSaving(true);
    try {
      const res = await usersApi.updateProfile({ name, bio });
      updateUser(res.data.data);
      qc.invalidateQueries({ queryKey: ['my-profile'] });
      toast.success('Profile updated!');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const byStatus: Record<string, number> = {};
  stats?.byStatus.forEach((s) => { byStatus[s.status] = s._count.status; });

  return (
    <div className="min-h-screen">
      <Header title="Profile" subtitle="Manage your account settings" />
      <div className="p-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile card */}
          <div className="space-y-4">
            <Card className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <Avatar name={user.name} size="xl" />
              </div>
              <h2 className="font-display font-black text-xl text-ink-100">{user.name}</h2>
              <p className="text-ink-500 text-sm mt-1">{user.email}</p>
              <div className="mt-3 flex justify-center">
                <Badge role={user.role}>{user.role}</Badge>
              </div>
              {user.bio && (
                <p className="mt-4 text-ink-400 text-sm leading-relaxed">{user.bio}</p>
              )}
              <div className="mt-4 pt-4 border-t border-ink-700/60 text-xs text-ink-600">
                Member since {timeAgo(profileData?.createdAt || user.createdAt || '')}
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={14} className="text-ink-500" />
                <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Account Status</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sage-400" />
                <span className="text-sm text-sage-400">Active</span>
              </div>
            </Card>

            <Button variant="danger" className="w-full" icon={<LogOut size={16} />} onClick={logout}>
              Sign Out
            </Button>
          </div>

          {/* Edit form + stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            {(user.role === 'MENTOR' || user.role === 'ADMIN') && stats && (
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Total Sessions" value={stats.total} icon={<Calendar size={18} />} color="accent" />
                <StatCard label="Completed" value={byStatus['COMPLETED'] || 0} icon={<BookOpen size={18} />} color="sage" />
                <StatCard label="Avg Rating" value={stats.avgRating._avg.rating?.toFixed(1) || '—'} icon={<Star size={18} />} color="amber" change={`${stats.avgRating._count.rating} reviews`} />
                <StatCard label="Scheduled" value={byStatus['SCHEDULED'] || 0} icon={<Calendar size={18} />} color="rose" />
              </div>
            )}

            {/* Edit form */}
            <Card className="p-6">
              <h3 className="font-display font-bold text-ink-200 mb-5">Edit Profile</h3>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
                <Input
                  label="Email"
                  value={user.email}
                  disabled
                  className="opacity-60"
                  hint="Email cannot be changed"
                />
                <Textarea
                  label="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell others about yourself..."
                  rows={4}
                />
                <Button onClick={updateProfile} loading={saving} icon={<Save size={16} />} className="w-full sm:w-auto">
                  Save Changes
                </Button>
              </div>
            </Card>

            {/* Role info */}
            <Card className="p-5 border-accent-500/20">
              <h4 className="font-semibold text-ink-200 mb-3 text-sm">Your Role: {user.role}</h4>
              <p className="text-ink-500 text-sm">
                {user.role === 'ADMIN' && 'You have full system access including user management, skill curation, and analytics.'}
                {user.role === 'MENTOR' && 'You can create skills, host learning sessions, and help learners grow.'}
                {user.role === 'LEARNER' && 'You can browse skills, book sessions with mentors, and track your learning journey.'}
              </p>
              {user.role === 'LEARNER' && (
                <p className="text-ink-600 text-xs mt-2">Want to become a mentor? Contact an admin to upgrade your role.</p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
