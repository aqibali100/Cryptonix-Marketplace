import Link from "next/link";

type Collection = {
  name: string;
  category: string;
  floor: string;
  volume: string;
  owners: string;
  tone: string;
};

export default function CollectionCard({
  collection,
  rank,
}: {
  collection: Collection;
  rank: number;
}) {
  return (
    <Link
      href="/marketplace"
      className="top-collection-card glass w-[calc((100%-39px)/4)] min-w-[calc((100%-39px)/4)] snap-start overflow-hidden rounded-[19px] transition hover:[transform:translateY(-6px)] hover:border-[rgba(155,123,255,.35)] border-[1px_solid_var(--line)] bg-[var(--surface)] shadow-[inset_0_1px_rgba(255,255,255,.05)] [backdrop-filter:blur(22px)] [-webkit-backdrop-filter:blur(22px)] max-[900px]:w-[calc((100%-13px)/2)] max-[900px]:min-w-[calc((100%-13px)/2)] max-[600px]:w-full max-[600px]:min-w-full"
    >
      <div
        className={`top-collection-art ${collection.tone} relative grid h-[170px] place-items-center bg-[radial-gradient(circle,#9869e0,transparent_27%),linear-gradient(145deg,#17173a,#392050)] [&.ai]:bg-[radial-gradient(circle,#58d8ce,transparent_25%),linear-gradient(145deg,#123942,#201b47)] [&.gaming]:bg-[radial-gradient(circle,#ec75ab,transparent_25%),linear-gradient(145deg,#4b203f,#171b3b)] [&.meta]:bg-[radial-gradient(circle,#e6ad62,transparent_25%),linear-gradient(145deg,#402d24,#1e1938)] [&>span]:absolute [&>span]:left-[11px] [&>span]:top-[11px] [&>span]:text-[rgba(255,255,255,.45)] [&>span]:font-[var(--font-geist-mono)] [&>span]:text-[12px] max-[600px]:h-[210px]`}
      >
        <div className="collection-emblem relative w-[75px] h-[75px] border-[1px_solid_rgba(255,255,255,.5)] [transform:rotate(45deg)] shadow-[inset_0_0_25px_rgba(255,255,255,.14),0_0_25px_rgba(255,255,255,.12)] [&_i]:absolute [&_i]:inset-3 [&_i]:border-[1px_solid_rgba(255,255,255,.35)] [&_i:nth-child(2)]:inset-[26px] [&_i:nth-child(3)]:inset-[-18px_30px] [&_i:nth-child(3)]:[transform:rotate(30deg)]">
          <i />
          <i />
          <i />
        </div>
        <span>0{rank}</span>
      </div>
      <div className="top-collection-body p-[13px]">
        <div className="collection-title flex items-center gap-2 [&_p]:grid [&_p]:gap-[3px] [&_strong]:text-[12px] [&_strong_i]:text-[#7b63e7] [&_strong_i]:not-italic [&_small]:text-[#606b80] [&_small]:text-[12px]">
          <span
            className={`collection-avatar ${collection.tone} grid w-[31px] h-[31px] place-items-center rounded-[9px] bg-[linear-gradient(145deg,#a46fe2,#542c9e)] text-[12px]`}
          >
            {collection.name.slice(0, 2).toUpperCase()}
          </span>
          <p>
            <strong className="flex items-center gap-1">
              {collection.name}
              <svg
                className="h-3 w-3 text-[#8067e5]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-label="Verified collection"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="m8.5 12 2.2 2.2 4.8-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </strong>
            <small>
              {collection.category} · {collection.owners} owners
            </small>
          </p>
        </div>
        <div className="collection-values flex justify-between mt-3.5 border-t-[1px_solid_var(--line)] pt-[11px] [&_p]:grid [&_p]:gap-[3px] [&_p:last-child]:text-right [&_small]:text-[#626d82] [&_small]:text-[12px] [&_strong]:text-[12px] [&_p:last-child_strong]:text-[#5bdccf]">
          <p>
            <small>Floor</small>
            <strong>{collection.floor}</strong>
          </p>
          <p>
            <small>Volume</small>
            <strong>{collection.volume}</strong>
          </p>
        </div>
      </div>
    </Link>
  );
}
