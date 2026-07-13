import Link from 'next/link';
import { MapPin, GraduationCap } from 'lucide-react';
import { Card } from '@/components/ui';
import { MentorAvatar } from '@/components/mentors/MentorAvatar';
import { StarRating } from '@/components/mentors/StarRating';
import { MentorProfile } from '@/types';

function topCategories(mentor: MentorProfile, max = 3): string[] {
  const seen = new Set<string>();
  const cats: string[] = [];
  for (const skill of mentor.skills) {
    if (!seen.has(skill.category)) {
      seen.add(skill.category);
      cats.push(skill.category);
    }
    if (cats.length >= max) break;
  }
  return cats;
}

export function MentorCard({ mentor }: { mentor: MentorProfile }) {
  const categories = topCategories(mentor);

  return (
    <Link href={`/mentors/${mentor.id}`}>
      <Card hover className="p-5 h-full flex flex-col group">
        <div className="flex items-start gap-3 mb-3">
          <MentorAvatar name={mentor.name} avatarUrl={mentor.avatarUrl} size="lg" />
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-bold text-ink-100 text-base truncate group-hover:text-accent-300 transition-colors">
              {mentor.name}
            </h3>
            {mentor.headline && (
              <p className="text-xs text-ink-400 line-clamp-2 mt-0.5">{mentor.headline}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-3">
          <StarRating value={mentor.ratingAvg} count={mentor.ratingCount} />
          {mentor.location && (
            <span className="flex items-center gap-1 text-xs text-ink-500">
              <MapPin size={11} />
              {mentor.location}
            </span>
          )}
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {categories.map((cat) => (
              <span
                key={cat}
                className="text-[11px] font-medium text-ink-300 bg-ink-700/60 px-2.5 py-1 rounded-full"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center gap-1.5 pt-3 border-t border-ink-700/60 text-xs text-ink-500">
          <GraduationCap size={13} />
          <span>
            <span className="font-semibold text-ink-300">{mentor.totalSessionsTaught}</span> session
            {mentor.totalSessionsTaught === 1 ? '' : 's'} taught
          </span>
        </div>
      </Card>
    </Link>
  );
}
