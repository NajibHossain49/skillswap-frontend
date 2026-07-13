export type Role = 'ADMIN' | 'MENTOR' | 'LEARNER';
export type SessionStatus = 'PENDING' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

export type MentorStatus = 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export type NotificationType =
  | 'SESSION_BOOKED'
  | 'SESSION_CANCELLED'
  | 'SESSION_REMINDER'
  | 'SESSION_COMPLETED'
  | 'FEEDBACK_RECEIVED'
  | 'BOOKING_REQUEST'
  | 'BOOKING_ACCEPTED'
  | 'BOOKING_REJECTED'
  | 'MENTOR_APPROVED'
  | 'SYSTEM';

export type BookingRequestStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'EXPIRED';

export type CreditTxnType =
  | 'SIGNUP_BONUS'
  | 'EARNED'
  | 'SPENT'
  | 'REFUND'
  | 'ADMIN_ADJUSTMENT';

export type ReportReason =
  | 'SPAM'
  | 'HARASSMENT'
  | 'INAPPROPRIATE_CONTENT'
  | 'NO_SHOW'
  | 'FRAUD'
  | 'OTHER';

export type ReportStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';

export interface User {
  id: string;
  email: string;
  name: string;
  bio?: string | null;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  creditBalance: number;
  ratingAvg: number;
  ratingCount: number;
  totalSessionsTaught: number;
  avatarUrl?: string | null;
  isEmailVerified: boolean;
  mentorStatus: MentorStatus;
  headline?: string | null;
  location?: string | null;
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
  level: SkillLevel;
  tags: string[];
  creditCost: number;
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
  meetingLink?: string | null;
  cancelReason?: string | null;
  createdAt: string;
  updatedAt: string;
  mentor: { id: string; name: string; email: string };
  learner?: { id: string; name: string; email: string } | null;
  skill: { id: string; title: string; category: string };
  feedback?: Feedback | null;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string | null;
  data?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface BookingRequest {
  id: string;
  mentorId: string;
  learnerId: string;
  skillId: string;
  proposedAt: string;
  duration: number;
  message?: string | null;
  status: BookingRequestStatus;
  reason?: string | null;
  createdAt: string;
  updatedAt: string;
  mentor?: { id: string; name: string; avatarUrl?: string | null };
  learner?: { id: string; name: string; avatarUrl?: string | null };
  skill?: { id: string; title: string; category: string; creditCost: number };
}

export interface Availability {
  id: string;
  mentorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  type: CreditTxnType;
  amount: number;
  balanceAfter: number;
  description?: string | null;
  sessionId?: string | null;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId?: string | null;
  sessionId?: string | null;
  reason: ReportReason;
  description?: string | null;
  status: ReportStatus;
  adminNote?: string | null;
  createdAt: string;
  updatedAt: string;
  reporter?: { id: string; name: string; email: string };
  reportedUser?: { id: string; name: string; email: string } | null;
}

export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  actor?: { id: string; name: string; email: string };
}

export interface MentorProfile {
  id: string;
  name: string;
  bio?: string | null;
  headline?: string | null;
  location?: string | null;
  avatarUrl?: string | null;
  ratingAvg: number;
  ratingCount: number;
  totalSessionsTaught: number;
  skills: Skill[];
  createdAt: string;
}

export interface MentorReview {
  id: string;
  mentorId: string;
  learnerId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  learner?: { id: string; name: string; avatarUrl?: string | null };
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
