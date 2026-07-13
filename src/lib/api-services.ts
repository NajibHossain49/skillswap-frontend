import api from './api';
import {
  AuthResponse,
  User,
  Skill,
  SkillLevel,
  MentorStatus,
  Session,
  Feedback,
  DashboardStats,
  MentorStats,
  SkillsQuery,
  SessionsQuery,
  UsersQuery,
  Pagination,
  Notification,
  BookingRequest,
  BookingRequestStatus,
  Availability,
  CreditTransaction,
  CreditTxnType,
  Report,
  ReportReason,
  ReportStatus,
  AuditLog,
  MentorProfile,
  MentorReview,
} from '@/types';

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    bio?: string;
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

  // The backend rotates the session on password change and returns a fresh
  // token pair so the user stays signed in (all other sessions are revoked).
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post<{
      success: boolean;
      message: string;
      data?: { accessToken: string; refreshToken: string };
    }>('/auth/change-password', data),

  forgotPassword: (data: { email: string }) =>
    api.post<{ success: boolean; message: string }>('/auth/forgot-password', data),

  resetPassword: (data: { token: string; newPassword: string }) =>
    api.post<{ success: boolean; message: string }>('/auth/reset-password', data),

  verifyEmail: (data: { token: string }) =>
    api.post<{ success: boolean; message: string }>('/auth/verify-email', data),

  resendVerification: () =>
    api.post<{ success: boolean; message: string }>('/auth/resend-verification'),

  listSessions: () =>
    api.get<{
      success: boolean;
      data: {
        id: string;
        userAgent?: string | null;
        ip?: string | null;
        current: boolean;
        createdAt: string;
        expiresAt: string;
      }[];
    }>('/auth/sessions'),

  revokeSession: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/auth/sessions/${id}`),
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

  create: (data: {
    title: string;
    description: string;
    category: string;
    level?: SkillLevel;
    tags?: string[];
    creditCost?: number;
  }) => api.post<{ success: boolean; data: Skill }>('/skills', data),

  update: (
    id: string,
    data: {
      title?: string;
      description?: string;
      category?: string;
      level?: SkillLevel;
      tags?: string[];
      creditCost?: number;
    },
  ) => api.patch<{ success: boolean; data: Skill }>(`/skills/${id}`, data),

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

  getAuditLogs: (
    query: {
      page?: number;
      limit?: number;
      action?: string;
      actorId?: string;
      entityType?: string;
    } = {},
  ) =>
    api.get<{ success: boolean; data: { logs: AuditLog[]; pagination: Pagination } }>(
      '/admin/audit-logs',
      { params: query },
    ),

  getMentorApplications: (
    query: { page?: number; limit?: number; status?: MentorStatus } = {},
  ) =>
    api.get<{ success: boolean; data: { applications: User[]; pagination: Pagination } }>(
      '/admin/mentor-applications',
      { params: query },
    ),

  reviewMentorApplication: (
    userId: string,
    data: { status: 'APPROVED' | 'REJECTED'; note?: string },
  ) =>
    api.patch<{ success: boolean; data: User }>(
      `/admin/mentor-applications/${userId}`,
      data,
    ),

  adjustCredits: (data: { userId: string; amount: number; reason: string }) =>
    api.post<{ success: boolean; data: CreditTransaction }>('/admin/credits/adjust', data),
};

// ─── Notifications ─────────────────────────────────────────────────────────────

export const notificationsApi = {
  getAll: (query: { page?: number; limit?: number; unreadOnly?: boolean } = {}) =>
    api.get<{
      success: boolean;
      data: { notifications: Notification[]; pagination: Pagination };
    }>('/notifications', { params: query }),

  getUnreadCount: () =>
    api.get<{ success: boolean; data: { count: number } }>('/notifications/unread-count'),

  markRead: (id: string) =>
    api.patch<{ success: boolean; data: Notification }>(`/notifications/${id}/read`),

  markAllRead: () =>
    api.patch<{ success: boolean; message: string }>('/notifications/read-all'),

  remove: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/notifications/${id}`),
};

// ─── Credits ───────────────────────────────────────────────────────────────────

export const creditsApi = {
  getBalance: () =>
    api.get<{ success: boolean; data: { balance: number } }>('/credits/balance'),

  getTransactions: (query: { page?: number; limit?: number; type?: CreditTxnType } = {}) =>
    api.get<{
      success: boolean;
      data: { transactions: CreditTransaction[]; pagination: Pagination };
    }>('/credits/transactions', { params: query }),
};

// ─── Mentors ─────────────────────────────────────────────────────────────────

export const mentorsApi = {
  getAll: (
    query: {
      page?: number;
      limit?: number;
      category?: string;
      minRating?: number;
      search?: string;
      sortBy?: string;
    } = {},
  ) =>
    api.get<{
      success: boolean;
      data: { mentors: MentorProfile[]; pagination: Pagination };
    }>('/mentors', { params: query }),

  getById: (id: string) =>
    api.get<{ success: boolean; data: MentorProfile }>(`/mentors/${id}`),

  getReviews: (id: string, query: { page?: number; limit?: number } = {}) =>
    api.get<{
      success: boolean;
      data: { reviews: MentorReview[]; pagination: Pagination };
    }>(`/mentors/${id}/reviews`, { params: query }),

  apply: (data: { headline: string; experience: string; linkedinUrl?: string }) =>
    api.post<{ success: boolean; data: User }>('/mentors/apply', data),
};

// ─── Bookings ────────────────────────────────────────────────────────────────

export const bookingsApi = {
  create: (data: {
    mentorId: string;
    skillId: string;
    proposedAt: string;
    duration: number;
    message?: string;
  }) => api.post<{ success: boolean; data: BookingRequest }>('/bookings', data),

  getAll: (
    query: { status?: BookingRequestStatus; page?: number; limit?: number } = {},
  ) =>
    api.get<{
      success: boolean;
      data: { bookings: BookingRequest[]; pagination: Pagination };
    }>('/bookings', { params: query }),

  getById: (id: string) =>
    api.get<{ success: boolean; data: BookingRequest }>(`/bookings/${id}`),

  accept: (id: string) =>
    api.patch<{ success: boolean; data: BookingRequest }>(`/bookings/${id}/accept`),

  reject: (id: string, data: { reason: string }) =>
    api.patch<{ success: boolean; data: BookingRequest }>(`/bookings/${id}/reject`, data),

  cancel: (id: string) =>
    api.patch<{ success: boolean; data: BookingRequest }>(`/bookings/${id}/cancel`),
};

// ─── Availability ──────────────────────────────────────────────────────────────

export const availabilityApi = {
  getMine: () =>
    api.get<{ success: boolean; data: Availability[] }>('/availability'),

  create: (data: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    timezone?: string;
  }) => api.post<{ success: boolean; data: Availability }>('/availability', data),

  update: (
    id: string,
    data: { dayOfWeek?: number; startTime?: string; endTime?: string; timezone?: string },
  ) => api.patch<{ success: boolean; data: Availability }>(`/availability/${id}`, data),

  remove: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/availability/${id}`),

  getForMentor: (mentorId: string) =>
    api.get<{ success: boolean; data: Availability[] }>(
      `/availability/mentor/${mentorId}`,
    ),

  getSlots: (mentorId: string, date: string) =>
    api.get<{ success: boolean; data: { start: string; end: string }[] }>(
      `/availability/mentor/${mentorId}/slots`,
      { params: { date } },
    ),
};

// ─── Reports ─────────────────────────────────────────────────────────────────

export const reportsApi = {
  create: (data: {
    reportedUserId?: string;
    sessionId?: string;
    reason: ReportReason;
    description?: string;
  }) => api.post<{ success: boolean; data: Report }>('/reports', data),

  getAll: (
    query: { page?: number; limit?: number; status?: ReportStatus } = {},
  ) =>
    api.get<{ success: boolean; data: { reports: Report[]; pagination: Pagination } }>(
      '/reports',
      { params: query },
    ),

  getById: (id: string) =>
    api.get<{ success: boolean; data: Report }>(`/reports/${id}`),

  resolve: (id: string, data: { status: ReportStatus; adminNote?: string }) =>
    api.patch<{ success: boolean; data: Report }>(`/reports/${id}/resolve`, data),
};
