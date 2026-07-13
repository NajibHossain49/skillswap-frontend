import { Session, User } from '@/types';

/**
 * A session can be booked when a learner (who isn't the mentor) views an open,
 * still-pending session that nobody has claimed yet.
 */
export function canBookSession(
  session: Pick<Session, 'status' | 'learnerId' | 'mentorId'>,
  user: Pick<User, 'id' | 'role'> | null | undefined,
): boolean {
  return (
    !!user &&
    user.role === 'LEARNER' &&
    session.status === 'PENDING' &&
    !session.learnerId &&
    session.mentorId !== user.id
  );
}

/**
 * Whether cancelling now returns the held credits. The backend rule: full
 * refund only if the session hasn't started yet.
 */
export function willRefundOnCancel(
  session: Pick<Session, 'scheduledAt' | 'learnerId'>,
): boolean {
  return !!session.learnerId && new Date(session.scheduledAt).getTime() > Date.now();
}
