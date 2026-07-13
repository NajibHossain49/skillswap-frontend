'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Users, SlidersHorizontal, X } from 'lucide-react';
import { Header } from '@/app/(dashboard)/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SkeletonCard, EmptyState } from '@/components/ui';
import { ErrorState } from '@/components/ui/ErrorState';
import { MentorCard } from '@/components/mentors/MentorCard';
import { useMentors, MentorsQuery } from '@/hooks/useMentors';
import { useCategories } from '@/hooks/useSkills';

type SortBy = NonNullable<MentorsQuery['sortBy']>;

const SORT_OPTIONS: { label: string; value: SortBy }[] = [
  { label: 'Highest rated', value: 'rating' },
  { label: 'Most sessions', value: 'sessions' },
  { label: 'Newest', value: 'newest' },
];

const RATING_OPTIONS: { label: string; value: string }[] = [
  { label: 'Any rating', value: '' },
  { label: '3.0+ stars', value: '3' },
  { label: '4.0+ stars', value: '4' },
  { label: '4.5+ stars', value: '4.5' },
];

const PAGE_SIZE = 12;

function MentorsDirectory() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? '';
  const minRating = searchParams.get('minRating') ?? '';
  const sortBy = (searchParams.get('sortBy') as SortBy) || 'rating';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const { data: categories } = useCategories();

  // Local, controlled search box so typing feels instant; the URL (and query)
  // only update after a 300ms debounce.
  const [searchInput, setSearchInput] = useState(search);

  // Keep the box in sync if the URL changes externally (e.g. back button).
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const setParams = useCallback(
    (patch: Record<string, string | number | undefined>, resetPage = true) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(patch).forEach(([key, value]) => {
        if (value === undefined || value === '' || value === null) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });
      if (resetPage && !('page' in patch)) next.delete('page');
      const qs = next.toString();
      router.replace(qs ? `/mentors?${qs}` : '/mentors', { scroll: false });
    },
    [router, searchParams],
  );

  // Debounce search → URL.
  useEffect(() => {
    if (searchInput === search) return;
    const t = setTimeout(() => setParams({ search: searchInput }), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const query: MentorsQuery = {
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    category: category || undefined,
    minRating: minRating ? Number(minRating) : undefined,
    sortBy,
  };

  const { data, isLoading, isFetching, isError, refetch } = useMentors(query);
  const mentors = data?.mentors ?? [];
  const pagination = data?.pagination;

  const hasActiveFilters = !!(search || category || minRating) || sortBy !== 'rating';

  const categoryOptions = [
    { label: 'All categories', value: '' },
    ...(categories ?? []).map((c) => ({ label: c, value: c })),
  ];

  return (
    <div className="min-h-screen">
      <Header title="Find a Mentor" subtitle="Browse expert mentors and request a session" />

      <div className="p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Filter sidebar ── */}
          <aside className="lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-5">
              <div className="flex items-center gap-2 text-ink-300">
                <SlidersHorizontal size={15} />
                <span className="text-sm font-semibold">Filters</span>
                {hasActiveFilters && (
                  <button
                    onClick={() => router.replace('/mentors', { scroll: false })}
                    className="ml-auto flex items-center gap-1 text-xs text-ink-500 hover:text-rose-400 transition-colors"
                  >
                    <X size={12} /> Clear
                  </button>
                )}
              </div>

              <Input
                placeholder="Search mentors..."
                icon={<Search size={15} />}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                aria-label="Search mentors"
              />

              <Select
                label="Category"
                options={categoryOptions}
                value={category}
                onChange={(e) => setParams({ category: e.target.value })}
              />

              <Select
                label="Minimum rating"
                options={RATING_OPTIONS}
                value={minRating}
                onChange={(e) => setParams({ minRating: e.target.value })}
              />

              <Select
                label="Sort by"
                options={SORT_OPTIONS}
                value={sortBy}
                onChange={(e) => setParams({ sortBy: e.target.value })}
              />
            </div>
          </aside>

          {/* ── Results ── */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4 h-5">
              {pagination && !isLoading && (
                <p className="text-sm text-ink-500">
                  {pagination.total} mentor{pagination.total === 1 ? '' : 's'}
                  {search && (
                    <>
                      {' '}for <span className="text-ink-300">&ldquo;{search}&rdquo;</span>
                    </>
                  )}
                </p>
              )}
              {isFetching && !isLoading && (
                <span className="text-xs text-ink-600 animate-pulse">Updating…</span>
              )}
            </div>

            {isError ? (
              <ErrorState onRetry={() => refetch()} />
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : mentors.length === 0 ? (
              <EmptyState
                icon={<Users size={28} />}
                title="No mentors found"
                description={
                  hasActiveFilters
                    ? 'Try widening your filters — clear the search or lower the minimum rating.'
                    : 'No mentors are available just yet. Check back soon!'
                }
                action={
                  hasActiveFilters ? (
                    <Button
                      variant="secondary"
                      onClick={() => router.replace('/mentors', { scroll: false })}
                    >
                      Clear filters
                    </Button>
                  ) : undefined
                }
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {mentors.map((mentor) => (
                    <MentorCard key={mentor.id} mentor={mentor} />
                  ))}
                </div>

                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setParams({ page: page - 1 }, false)}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-ink-500">
                      Page {page} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={page >= pagination.totalPages}
                      onClick={() => setParams({ page: page + 1 }, false)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MentorsFallback() {
  return (
    <div className="min-h-screen">
      <Header title="Find a Mentor" subtitle="Browse expert mentors and request a session" />
      <div className="p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MentorsPage() {
  return (
    <Suspense fallback={<MentorsFallback />}>
      <MentorsDirectory />
    </Suspense>
  );
}
