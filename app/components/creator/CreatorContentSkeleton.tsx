function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-white/[.055] ${className}`} />;
}

export default function CreatorContentSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading Creator Studio content"
      className="min-h-[calc(100vh-232px)] rounded-[22px] border border-[var(--line)] bg-[rgba(10,14,28,.56)] p-4 sm:p-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="h-8 w-52 max-w-full" />
          <SkeletonBlock className="h-3 w-72 max-w-full" />
        </div>
        <SkeletonBlock className="h-10 w-36" />
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div className="rounded-2xl border border-white/[.05] bg-white/[.018] p-4" key={index}>
            <SkeletonBlock className="h-9 w-9" />
            <SkeletonBlock className="mt-5 h-3 w-20" />
            <SkeletonBlock className="mt-3 h-7 w-28" />
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-white/[.05] bg-white/[.018] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <SkeletonBlock className="h-5 w-36" />
            <SkeletonBlock className="h-3 w-52 max-w-full" />
          </div>
          <SkeletonBlock className="h-9 w-24" />
        </div>
        <div className="mt-5 space-y-3">
          {Array.from({ length: 4 }, (_, index) => (
            <SkeletonBlock className="h-12 w-full" key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
