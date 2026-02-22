import api from './api';
import {
  AuthResponse,
  User,
  Skill,
  Session,
  Feedback,
  DashboardStats,
  MentorStats,
  SkillsQuery,
  SessionsQuery,
  UsersQuery,
  Pagination,
} from '@/types';

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    bio?: string;
    role?: 'MENTOR' | 'LEARNER';
  }) => api.post<{ success: boolean; data: AuthResponse }>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<{ success: boolean; data: AuthResponse }>('/auth/login', data),

  refresh: (refreshToken: string) =>
    api.post<{ success: boolean; data: { accessToken: string; refreshToken: string } }>(
      '/auth/refresh',
      { refreshToken },
    ),

  logout: (refreshToken: string) => api.post('/auth/logout', { refreshToken }),

  logoutAll: () => api.post('/auth/logout-all'),
};

// ─── Users ───────────────────────────────────────────────────────────────────

export const usersApi = {
  getProfile: () => api.get<{ success: boolean; data: User }>('/users/profile'),

  updateProfile: (data: { name?: string; bio?: string }) =>
    api.patch<{ success: boolean; data: User }>('/users/profile', data),

  getAll: (query: UsersQuery = {}) =>
    api.get<{ success: boolean; data: { users: User[]; pagination: Pagination } }>('/users', {
      params: query,
    }),

  getById: (id: string) =>
    api.get<{ success: boolean; data: User }>(`/users/${id}`),

  updateRole: (id: string, role: string) =>
    api.patch<{ success: boolean; data: User }>(`/users/${id}/role`, { role }),

  deactivate: (id: string) =>
    api.patch<{ success: boolean; data: User }>(`/users/${id}/deactivate`),

  activate: (id: string) =>
    api.patch<{ success: boolean; data: User }>(`/users/${id}/activate`),

  delete: (id: string) => api.delete(`/users/${id}`),
};

// ─── Skills ──────────────────────────────────────────────────────────────────

export const skillsApi = {
  getAll: (query: SkillsQuery = {}) =>
    api.get<{ success: boolean; data: { skills: Skill[]; pagination: Pagination } }>('/skills', {
      params: query,
    }),

  getById: (id: string) => api.get<{ success: boolean; data: Skill }>(`/skills/${id}`),

  getCategories: () =>
    api.get<{ success: boolean; data: string[] }>('/skills/categories'),

  create: (data: { title: string; description: string; category: string }) =>
    api.post<{ success: boolean; data: Skill }>('/skills', data),

  update: (id: string, data: { title?: string; description?: string; category?: string }) =>
    api.patch<{ success: boolean; data: Skill }>(`/skills/${id}`, data),

  delete: (id: string) => api.delete(`/skills/${id}`),
};

// ─── Sessions ─────────────────────────────────────────────────────────────────

export const sessionsApi = {
  getAll: (query: SessionsQuery = {}) =>
    api.get<{ success: boolean; data: { sessions: Session[]; pagination: Pagination } }>(
      '/sessions',
      { params: query },
    ),

  getById: (id: string) =>
    api.get<{ success: boolean; data: Session }>(`/sessions/${id}`),

  create: (data: {
    skillId: string;
    title: string;
    description?: string;
    scheduledAt: string;
    duration: number;
  }) => api.post<{ success: boolean; data: Session }>('/sessions', data),

  book: (id: string) =>
    api.post<{ success: boolean; data: Session }>(`/sessions/${id}/book`),

  updateStatus: (id: string, status: string) =>
    api.patch<{ success: boolean; data: Session }>(`/sessions/${id}/status`, { status }),

  addFeedback: (id: string, data: { rating: number; comment?: string }) =>
    api.post<{ success: boolean; data: Feedback }>(`/sessions/${id}/feedback`, data),

  getFeedback: (id: string) =>
    api.get<{ success: boolean; data: Feedback }>(`/sessions/${id}/feedback`),

  getStats: () => api.get<{ success: boolean; data: MentorStats }>('/sessions/stats'),
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const adminApi = {
  getDashboard: () =>
    api.get<{ success: boolean; data: DashboardStats }>('/admin/dashboard'),

  getActivity: (days = 30) =>
    api.get<{
      success: boolean;
      data: {
        period: string;
        newUsers: number;
        newSessions: number;
        completedSessions: number;
      };
    }>('/admin/activity', { params: { days } }),
};
