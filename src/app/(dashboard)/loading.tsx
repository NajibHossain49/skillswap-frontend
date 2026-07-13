export default function DashboardLoading() {
  return (
    <div className="min-h-screen">
      {/* Header placeholder */}
      <div className="border-b border-ink-800 px-8 py-6">
        <div className="h-6 w-40 rounded bg-ink-800 animate-pulse" />
        <div className="mt-2 h-3.5 w-64 rounded bg-ink-800/60 animate-pulse" />
      </div>

      <div className="p-8 space-y-6">
        {/* Stat row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-ink-700/60 bg-ink-800/60 p-5">
              <div className="h-3 w-20 rounded bg-ink-700/60 animate-pulse" />
              <div className="mt-3 h-8 w-16 rounded bg-ink-700/60 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Content cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 rounded-2xl border border-ink-700/60 bg-ink-800/40 animate-pulse" />
          <div className="h-64 rounded-2xl border border-ink-700/60 bg-ink-800/40 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
