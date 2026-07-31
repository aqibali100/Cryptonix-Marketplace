import Link from "next/link";

const nfts = [
  {
    name: "Chromatic Echo",
    creator: "Lucid Form",
    price: "4.10 ETH",
    volume: "+18.4%",
    tone: "echo",
  },
  {
    name: "Orbital Bloom",
    creator: "Mika Vale",
    price: "1.42 ETH",
    volume: "+12.8%",
    tone: "bloom",
  },
  {
    name: "Synthetic Soul",
    creator: "Nox Studio",
    price: "0.96 ETH",
    volume: "+8.7%",
    tone: "soul",
  },
  {
    name: "Liquid Memory",
    creator: "Ori Kane",
    price: "3.25 ETH",
    volume: "+24.1%",
    tone: "memory",
  },
];

export default function TrendingNFTs() {
  return (
    <section
      className="trending-section border-y-[1px_solid_var(--line)] py-[52px] px-0 bg-[rgba(255,255,255,.014)] max-[600px]:py-[75px] max-[600px]:px-0"
      id="trending"
    >
      <div className="page-shell w-[min(1180px,_calc(100%_-_40px))] [margin-inline:auto] max-[600px]:w-[min(100%_-_28px,_1180px)]">
        <div className="landing-section-head flex items-end justify-between mb-7 [&_h2]:[margin:7px_0_5px] [&_p]:text-[#6f7a8f] [&_p]:text-[12px] [&>a]:text-[#9da7bb] [&>a]:text-[12px] [&>a_span]:ml-2 [&>a_span]:text-[#6be1d7] max-[600px]:items-start max-[600px]:[&>a]:text-0 max-[600px]:[&>a_span]:text-[19px]">
          <div>
            <span className="section-kicker text-[var(--cyan)] text-[12px] font-bold tracking-[2px]">
              LIVE MARKET
            </span>
            <h2 className="mt-[7px] mb-0 text-[clamp(29px,4vw,40px)] font-semibold tracking-[-1.8px]">
              Trending NFTs
            </h2>
            <p>Rare assets collectors cannot stop watching right now.</p>
          </div>
          <Link
            href="/marketplace"
            className="group flex items-center gap-1.5 text-[12px] font-semibold text-white"
          >
            <span>All NFTs</span>
            <svg
              className="h-3 w-3 transition group-hover:translate-x-0.5"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M4.5 2.25L7.75 5.5L4.5 8.75"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
        <div className="landing-trending-grid grid grid-cols-[repeat(4,1fr)] gap-[13px] max-[900px]:grid-cols-[repeat(2,1fr)] max-[600px]:grid-cols-[1fr]">
          {nfts.map((nft, index) => (
            <Link
              href={`/nft/${index + 1}`}
              className="landing-trend-card glass overflow-hidden rounded-[19px] transition hover:[transform:translateY(-6px)] border-[1px_solid_var(--line)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(0,0,0,.28),_inset_0_1px_rgba(255,255,255,.05)] [backdrop-filter:blur(22px)] [-webkit-backdrop-filter:blur(22px)]"
              key={nft.name}
            >
              <div
                className={`trend-image ${nft.tone} relative grid h-[245px] place-items-center bg-[conic-gradient(from_180deg,#102d3e,#7355c1,#da6eb6,#4ed1c7,#102d3e)] [&.bloom]:bg-[radial-gradient(circle,#f2b86f,transparent_24%),linear-gradient(145deg,#492535,#201b3b)] [&.soul]:bg-[radial-gradient(circle,#6e6ad5,transparent_25%),linear-gradient(145deg,#111832,#251a42)] [&.memory]:bg-[radial-gradient(circle,#53d9ce,transparent_24%),linear-gradient(145deg,#153d42,#281744)] [&>span]:absolute [&>span]:top-[11px] [&>span]:border-[1px_solid_rgba(255,255,255,.13)] [&>span]:rounded-[99px] [&>span]:py-1.5 [&>span]:px-2 [&>span]:bg-[rgba(5,7,17,.52)] [&>span]:text-[12px] [&>i]:absolute [&>i]:top-[11px] [&>i]:border-[1px_solid_rgba(255,255,255,.13)] [&>i]:rounded-[99px] [&>i]:py-1.5 [&>i]:px-2 [&>i]:bg-[rgba(5,7,17,.52)] [&>i]:text-[12px] [&>span]:right-[11px] [&>i]:left-[11px] [&>i]:text-[#cbbcff] [&>i]:not-italic [&>i]:tracking-[.5px] max-[600px]:h-[310px]`}
              >
                <div className="trend-object w-[92px] h-[92px] border-[1px_solid_rgba(255,255,255,.55)] rounded-[38%_62%_58%_42%] [transform:rotate(27deg)] shadow-[inset_0_0_30px_rgba(255,255,255,.18),0_0_35px_rgba(255,255,255,.2)]" />
                <span>♡ {128 + index * 43}</span>
                <i>✦ TOP {index + 1}</i>
              </div>
              <div className="trend-meta flex justify-between p-[13px] [&>div]:grid [&>div]:gap-1 [&>div:last-child]:text-right [&_small]:text-[#657087] [&_small]:text-[12px] [&_small_i]:text-[#8067e5] [&_small_i]:not-italic [&_strong]:text-[12px] [&>div:last-child_strong]:text-[#5de0d4]">
                <div>
                  <small>
                    {nft.creator} <i>✓</i>
                  </small>
                  <strong>{nft.name}</strong>
                </div>
                <div>
                  <small>Price</small>
                  <strong>{nft.price}</strong>
                </div>
              </div>
              <div className="trend-volume flex justify-between border-t-[1px_solid_var(--line)] py-[9px] px-[13px] text-[#626d82] text-[12px] [&_strong]:text-[#5edab6]">
                <span>24h volume</span>
                <strong>{nft.volume}</strong>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
