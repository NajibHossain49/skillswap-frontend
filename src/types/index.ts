import { StaticImport } from "next/dist/shared/lib/get-img-props";

export type Role = 'ADMIN' | 'MENTOR' | 'LEARNER';
export type SessionStatus = 'PENDING' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

export interface User {
  avatar?: string;
  id: string;
  email: string;
  name: string;
  bio?: string | null;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  category: string;
  createdById: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: { id: string; name: string; email?: string };
  _count?: { sessions: number };
}

export interface Feedback {
  id: string;
  sessionId: string;
  learnerId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  updatedAt: string;
  learner?: { id: string; name: string };
  session?: { id: string; title: string };
}

export interface Session {
  id: string;
  mentorId: string;
  learnerId?: string | null;
  skillId: string;
  title: string;
  description?: string | null;
  scheduledAt: string;
  duration: number;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
  mentor: { id: string; name: string; email: string };
  learner?: { id: string; name: string; email: string } | null;
  skill: { id: string; title: string; category: string };
  feedback?: Feedback | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface DashboardStats {
  users: {
    total: number;
    byRole: { role: Role; _count: { role: number } }[];
  };
  skills: { total: number };
  sessions: {
    total: number;
    byStatus: { status: SessionStatus; _count: { status: number } }[];
  };
  feedback: { avgRating: number | null; totalReviews: number };
  recent: { users: User[]; sessions: Session[] };
}

export interface MentorStats {
  total: number;
  byStatus: { status: SessionStatus; _count: { status: number } }[];
  avgRating: { _avg: { rating: number | null }; _count: { rating: number } };
}

export interface SkillsQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export interface SessionsQuery {
  page?: number;
  limit?: number;
  status?: SessionStatus;
  mentorId?: string;
  skillId?: string;
}

export interface UsersQuery {
  page?: number;
  limit?: number;
  role?: Role;
  search?: string;
}
