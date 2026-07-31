export default function TokenCardSkeleton() {
  return (
    <div
      className="relative flex min-h-[50px] animate-pulse items-center gap-3.5 overflow-hidden rounded-[17px] border border-[var(--line)] bg-[linear-gradient(120deg,rgba(255,255,255,.028),rgba(155,123,255,.018))] p-2"
      aria-hidden="true"
    >
      <span className="h-12 w-12 shrink-0 rounded-[15px] bg-white/[.07]" />
      <div className="min-w-0 flex-1">
        <span className="block h-4 w-[58%] rounded-full bg-white/[.08]" />
        <span className="mt-2.5 block h-2 w-[42%] rounded-full bg-white/[.045]" />
        <div className="mt-3 flex gap-2">
          <span className="block h-2.5 w-14 rounded-full bg-white/[.06]" />
          <span className="block h-2.5 w-10 rounded-full bg-emerald-400/[.08]" />
        </div>
      </div>
      <div className="flex h-11 w-[66px] shrink-0 items-end gap-1 opacity-60">
        <span className="h-2 w-1 rounded-full bg-white/[.05]" />
        <span className="h-4 w-1 rounded-full bg-white/[.06]" />
        <span className="h-3 w-1 rounded-full bg-white/[.05]" />
        <span className="h-7 w-1 rounded-full bg-white/[.08]" />
        <span className="h-6 w-1 rounded-full bg-white/[.07]" />
        <span className="h-9 w-1 rounded-full bg-white/[.09]" />
        <span className="h-8 w-1 rounded-full bg-white/[.08]" />
        <span className="h-10 w-1 rounded-full bg-white/[.1]" />
      </div>
      <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(100deg,transparent,rgba(255,255,255,.035),transparent)] [animation:shimmer_1.8s_infinite]" />
    </div>
  );
}
