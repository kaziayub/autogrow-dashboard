export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse p-2">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-white/10 rounded-md" />
          <div className="h-4 w-72 bg-white/5 rounded-md" />
        </div>
        <div className="h-9 w-24 bg-white/10 rounded-lg" />
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-black/20 border border-border-soft p-4 space-y-3">
            <div className="h-3 w-20 bg-white/10 rounded" />
            <div className="h-7 w-16 bg-white/15 rounded" />
          </div>
        ))}
      </div>

      {/* Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-64 rounded-xl bg-black/20 border border-border-soft p-4 space-y-4">
          <div className="h-4 w-32 bg-white/10 rounded" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-white/5 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="h-64 rounded-xl bg-black/20 border border-border-soft p-4 space-y-4">
          <div className="h-4 w-28 bg-white/10 rounded" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-white/5 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
