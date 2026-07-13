import { Session } from '@/types';

/** Formats a Date as a UTC iCalendar timestamp: YYYYMMDDTHHMMSSZ. */
function toIcsUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/** Escapes reserved characters per RFC 5545 (backslash, comma, semicolon, newline). */
function escapeText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/** Builds a VCALENDAR string for a single session — no external library. */
export function buildIcs(session: Session): string {
  const start = new Date(session.scheduledAt);
  const end = new Date(start.getTime() + session.duration * 60_000);

  const description =
    session.description?.trim() ||
    `SkillSwap session • ${session.skill.title}${
      session.meetingLink ? `\nJoin: ${session.meetingLink}` : ''
    }`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SkillSwap//Sessions//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:session-${session.id}@skillswap`,
    `DTSTAMP:${toIcsUtc(new Date())}`,
    `DTSTART:${toIcsUtc(start)}`,
    `DTEND:${toIcsUtc(end)}`,
    `SUMMARY:${escapeText(session.title)}`,
    `DESCRIPTION:${escapeText(description)}`,
    ...(session.meetingLink ? [`LOCATION:${escapeText(session.meetingLink)}`] : []),
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.join('\r\n');
}

/** Generates and downloads the .ics file entirely client-side. */
export function downloadIcs(session: Session): void {
  const blob = new Blob([buildIcs(session)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const safeName = session.title.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase();
  anchor.href = url;
  anchor.download = `${safeName || 'session'}.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
