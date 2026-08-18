export default function NftCardSkeleton() {
  return (
    <div className="w-[calc((100%-39px)/4)] min-w-[calc((100%-39px)/4)] snap-start overflow-hidden rounded-[19px] border border-[var(--line)] bg-[var(--surface)] shadow-[inset_0_1px_rgba(255,255,255,.05)] max-[900px]:w-[calc((100%-13px)/2)] max-[900px]:min-w-[calc((100%-13px)/2)] max-[600px]:w-full max-[600px]:min-w-full" aria-hidden="true">
      <div className="relative h-[245px] animate-pulse overflow-hidden bg-white/[.045] max-[600px]:h-[310px]">
        <span className="absolute left-3 top-3 h-7 w-16 rounded-full bg-white/[.07]" />
        <span className="absolute right-3 top-3 h-7 w-14 rounded-full bg-white/[.07]" />
        <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(100deg,transparent,rgba(255,255,255,.06),transparent)] [animation:shimmer_1.8s_infinite]" />
      </div>
      <div className="flex animate-pulse justify-between p-[13px]">
        <div><span className="block h-3 w-20 rounded-full bg-white/[.06]" /><span className="mt-2.5 block h-3 w-28 rounded-full bg-white/[.09]" /></div>
        <div><span className="ml-auto block h-3 w-9 rounded-full bg-white/[.05]" /><span className="mt-2.5 block h-3 w-16 rounded-full bg-cyan-300/[.08]" /></div>
      </div>
      <div className="flex animate-pulse justify-between border-t border-[var(--line)] px-[13px] py-[11px]"><span className="h-3 w-20 rounded-full bg-white/[.05]" /><span className="h-3 w-12 rounded-full bg-emerald-300/[.08]" /></div>
    </div>
  );
}
