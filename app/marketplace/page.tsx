"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const categories = ["All assets", "Art", "Collectibles", "Gaming", "Photography", "Music"];

const assets = [
  {
    name: "Neon Genesis #042",
    creator: "Aether Labs",
    price: "2.84 ETH",
    bid: "12 bids",
    chain: "ETH",
    tone: "aurora",
    avatar: "AL",
    time: "02h 14m",
  },
  {
    name: "Orbital Bloom",
    creator: "Mika Vale",
    price: "1.42 ETH",
    bid: "8 bids",
    chain: "BASE",
    tone: "solar",
    avatar: "MV",
    time: "06h 32m",
  },
  {
    name: "Chromatic Echo #18",
    creator: "Lucid Form",
    price: "4.10 ETH",
    bid: "21 bids",
    chain: "ETH",
    tone: "prism",
    avatar: "LF",
    time: "11h 08m",
  },
  {
    name: "Synthetic Soul",
    creator: "Nox Studio",
    price: "0.96 ETH",
    bid: "5 bids",
    chain: "ARB",
    tone: "void",
    avatar: "NS",
    time: "18h 45m",
  },
  {
    name: "Liquid Memory #07",
    creator: "Ori Kane",
    price: "3.25 ETH",
    bid: "16 bids",
    chain: "ETH",
    tone: "liquid",
    avatar: "OK",
    time: "01d 04h",
  },
  {
    name: "Parallel Nature",
    creator: "Field Notes",
    price: "1.08 ETH",
    bid: "9 bids",
    chain: "POLY",
    tone: "nature",
    avatar: "FN",
    time: "01d 12h",
  },
];

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="8" cy="17" r="2" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </svg>
  );
}

export default function MarketplacePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All assets");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const visibleAssets = useMemo(
    () =>
      assets.filter((asset) =>
        `${asset.name} ${asset.creator} ${asset.chain}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  return (
    <main className="marketplace-page relative min-h-screen overflow-hidden [padding:145px_0_100px] max-[600px]:pt-[115px]">
      <div className="market-glow market-glow-one absolute z-[-1] rounded-full [filter:blur(100px)] pointer-events-none top-20 left-[60%] w-[420px] h-[280px] bg-[rgba(108,_74,_224,_.13)]" />
      <div className="market-glow market-glow-two absolute z-[-1] rounded-full [filter:blur(100px)] pointer-events-none top-[600px] left-[-180px] w-[390px] h-[390px] bg-[rgba(47,_216,_205,_.06)]" />

      <section className="market-hero page-shell w-[min(1180px,_calc(100%_-_40px))] [margin-inline:auto] max-[600px]:w-[min(100%_-_28px,_1180px)]">
        <div className="market-breadcrumb flex gap-[9px] mb-[30px] text-[#667188] text-[12px] [&_a:hover]:text-white [&_strong]:text-[#a6afc2] [&_strong]:font-medium max-[600px]:mb-5">
          <Link href="/">Home</Link>
          <span>/</span>
          <strong>Marketplace</strong>
        </div>
        <div className="market-title-row flex items-end justify-between gap-[50px] pb-12 [&_h1]:max-w-[760px] [&_h1]:mt-3 [&_h1]:text-[clamp(46px,_6.1vw,_74px)] [&_>_div:first-child_>_p]:max-w-[660px] [&_>_div:first-child_>_p]:[margin:22px_0_0] [&_>_div:first-child_>_p]:text-[var(--muted)] [&_>_div:first-child_>_p]:text-[15px] [&_>_div:first-child_>_p]:leading-[1.7] max-[900px]:items-start max-[900px]:flex-col max-[600px]:gap-7 max-[600px]:pb-[34px] max-[600px]:[&_h1]:text-[42px] max-[600px]:[&_h1]:tracking-[-2.7px] max-[600px]:[&_>_div:first-child_>_p]:text-sm">
          <div>
            <span className="section-kicker text-[var(--cyan)] text-[12px] font-bold tracking-[2px]">
              EXPLORE THE EXTRAORDINARY
            </span>
            <h1 className="max-w-[690px] m-0 text-[clamp(48px,5.6vw,76px)] font-[620] tracking-[-4.6px] leading-[.99] [&_span]:bg-[linear-gradient(100deg,#b49dff_12%,#6deee0_100%)] [&_span]:bg-clip-text [&_span]:text-transparent">
              Discover digital <span>masterpieces.</span>
            </h1>
            <p>
              Explore a curated universe of rare assets, breakthrough artists, and culture-defining
              collections across every chain.
            </p>
          </div>
          <div className="market-pulse glass flex flex-[0_0_auto] items-center gap-3.5 rounded-[17px] py-[15px] px-4.5 [&_>_div]:grid [&_>_div]:gap-[3px] [&_strong]:text-[13px] [&_span]:text-[#747f96] [&_span]:text-[12px] [&_>_i]:w-px [&_>_i]:h-7 [&_>_i]:bg-[var(--line)] max-[900px]:self-stretch max-[900px]:justify-center max-[600px]:w-full max-[600px]:gap-2.5 max-[600px]:py-[13px] max-[600px]:px-2.5 max-[600px]:[&_>_div]:flex-[1] border-[1px_solid_var(--line)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(0,0,0,.28),_inset_0_1px_rgba(255,255,255,.05)] [backdrop-filter:blur(22px)] [-webkit-backdrop-filter:blur(22px)]">
            <span className="pulse-dot inline-block w-[7px] h-[7px] rounded-full bg-[#59e5be] shadow-[0_0_10px_rgba(89,229,190,.75)]" />
            <div>
              <strong>2,481</strong>
              <span>Live auctions</span>
            </div>
            <i />
            <div>
              <strong>184.2 ETH</strong>
              <span>24h volume</span>
            </div>
          </div>
        </div>
      </section>

      <section className="market-content page-shell w-[min(1180px,_calc(100%_-_40px))] [margin-inline:auto] max-[600px]:w-[min(100%_-_28px,_1180px)]">
        <div className="market-toolbar glass flex gap-2.5 rounded-[19px] p-2.5 max-[600px]:flex-wrap border-[1px_solid_var(--line)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(0,0,0,.28),_inset_0_1px_rgba(255,255,255,.05)] [backdrop-filter:blur(22px)] [-webkit-backdrop-filter:blur(22px)]">
          <label className="market-search flex flex-[1] items-center gap-3 py-0 px-2 [&_svg]:w-4.5 [&_svg]:h-4.5 [&_svg]:text-[#7d88a0] [&_input]:flex-[1] [&_input]:[min-width:0] [&_input]:border-0 [&_input]:[outline:0] [&_input]:bg-transparent [&_input]:text-white [&_input]:text-[13px] [&_input::placeholder]:text-[#626d84] [&_kbd]:border-[1px_solid_var(--line)] [&_kbd]:rounded-[7px] [&_kbd]:py-[3px] [&_kbd]:px-[7px] [&_kbd]:bg-[rgba(255,255,255,.04)] [&_kbd]:text-[#69738a] [&_kbd]:font-[inherit] [&_kbd]:text-[12px] max-[600px]:[flex-basis:100%] max-[600px]:h-[42px]">
            <SearchIcon />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search items, collections, or creators"
              aria-label="Search marketplace"
            />
            <kbd>⌘ K</kbd>
          </label>
          <button
            className="filter-button [&_svg]:w-4.5 [&_svg]:h-4.5 [&_svg]:text-[#7d88a0] flex h-11 items-center justify-center gap-2 border-[1px_solid_var(--line)] rounded-xl bg-[rgba(255,255,255,.035)] text-[#c4cbd9] text-[12px] cursor-pointer py-0 px-[15px] [&_span]:grid [&_span]:w-4.5 [&_span]:h-4.5 [&_span]:place-items-center [&_span]:rounded-full [&_span]:bg-[rgba(151,120,255,.2)] [&_span]:text-[#bda9ff] [&_span]:text-[12px] max-[600px]:flex-[1]"
            onClick={() => setFiltersOpen((value) => !value)}
          >
            <SlidersIcon /> Filters <span>{filtersOpen ? "×" : "3"}</span>
          </button>
          <button className="sort-button flex h-11 items-center justify-center gap-2 border-[1px_solid_var(--line)] rounded-xl bg-[rgba(255,255,255,.035)] text-[#c4cbd9] text-[12px] cursor-pointer py-0 px-[15px] [&_span]:text-[#768198] [&_span]:text-sm max-[900px]:hidden">
            Recently listed <span>⌄</span>
          </button>
          <button
            className="grid-button [&_svg]:w-4.5 [&_svg]:h-4.5 [&_svg]:text-[#7d88a0] flex h-11 items-center justify-center gap-2 border-[1px_solid_var(--line)] rounded-xl bg-[rgba(255,255,255,.035)] text-[#c4cbd9] text-[12px] cursor-pointer w-11 max-[600px]:flex-[0_0_44px]"
            aria-label="Grid view"
          >
            <GridIcon />
          </button>
        </div>

        {filtersOpen && (
          <div className="filter-drawer glass grid grid-cols-[1.4fr_1fr_1fr_auto] gap-3 mt-3 rounded-[17px] p-[15px] [&_label]:grid [&_label]:gap-2 [&_label>span]:text-[#7a859b] [&_label>span]:text-[12px] [&_label>div]:flex [&_label>div]:gap-1.5 [&_input]:w-full [&_input]:h-[38px] [&_input]:border-[1px_solid_var(--line)] [&_input]:rounded-[9px] [&_input]:outline-none [&_input]:py-0 [&_input]:px-2.5 [&_input]:bg-[#0e1223] [&_input]:text-[#c8cfdd] [&_input]:text-[12px] [&_select]:w-full [&_select]:h-[38px] [&_select]:border-[1px_solid_var(--line)] [&_select]:rounded-[9px] [&_select]:outline-none [&_select]:py-0 [&_select]:px-2.5 [&_select]:bg-[#0e1223] [&_select]:text-[#c8cfdd] [&_select]:text-[12px] [&_button]:self-end [&_button]:h-[38px] [&_button]:border-0 [&_button]:rounded-[10px] [&_button]:py-0 [&_button]:px-[15px] [&_button]:bg-[#7659eb] [&_button]:text-[12px] [&_button]:font-semibold [&_button]:cursor-pointer max-[900px]:grid-cols-[1fr_1fr] max-[600px]:grid-cols-[1fr] border-[1px_solid_var(--line)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(0,0,0,.28),_inset_0_1px_rgba(255,255,255,.05)] [backdrop-filter:blur(22px)] [-webkit-backdrop-filter:blur(22px)]">
            <label>
              <span>Price range</span>
              <div>
                <input placeholder="Min" inputMode="decimal" />
                <input placeholder="Max" inputMode="decimal" />
              </div>
            </label>
            <label>
              <span>Blockchain</span>
              <select>
                <option>All chains</option>
                <option>Ethereum</option>
                <option>Base</option>
                <option>Polygon</option>
              </select>
            </label>
            <label>
              <span>Sale type</span>
              <select>
                <option>All listings</option>
                <option>Live auction</option>
                <option>Fixed price</option>
              </select>
            </label>
            <button onClick={() => setFiltersOpen(false)}>Apply filters</button>
          </div>
        )}

        <div
          className="category-tabs flex gap-[7px] [margin:22px_0_42px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&_button]:flex-[0_0_auto] [&_button]:border-[1px_solid_transparent] [&_button]:rounded-full [&_button]:py-[9px] [&_button]:px-4 [&_button]:bg-transparent [&_button]:text-[#78839a] [&_button]:text-[12px] [&_button]:cursor-pointer [&_button:hover]:text-white [&_button.active]:border-[rgba(155,123,255,.24)] [&_button.active]:bg-[rgba(155,123,255,.11)] [&_button.active]:text-[#cbbbff] max-[600px]:[margin:17px_0_32px]"
          role="list"
          aria-label="Asset categories"
        >
          {categories.map((item) => (
            <button
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
              key={item}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="market-results-heading flex items-center justify-between mb-5 [&_>_div]:flex [&_>_div]:[align-items:baseline] [&_>_div]:gap-3 [&_h2]:text-[27px] [&_h2]:tracking--px [&_>_div_>_span]:text-[#69758c] [&_>_div_>_span]:text-[12px] [&_p]:text-[#69758c] [&_p]:text-[12px] [&_p]:flex [&_p]:items-center [&_p]:gap-[7px] [&_.pulse-dot]:w-[5px] [&_.pulse-dot]:h-[5px] max-[600px]:[&_p]:hidden">
          <div>
            <h2 className="mt-[7px] mb-0 text-[clamp(29px,4vw,40px)] font-semibold tracking-[-1.8px]">
              {query ? "Search results" : category === "All assets" ? "Trending now" : category}
            </h2>
            <span>
              {visibleAssets.length ? `${visibleAssets.length} featured items` : "No items"}
            </span>
          </div>
          <p>
            <span className="pulse-dot inline-block w-[7px] h-[7px] rounded-full bg-[#59e5be] shadow-[0_0_10px_rgba(89,229,190,.75)]" />{" "}
            Updated moments ago
          </p>
        </div>

        <div className="asset-grid grid grid-cols-[repeat(3,_1fr)] gap-4.5 max-[900px]:grid-cols-[repeat(2,1fr)] max-[600px]:grid-cols-[1fr]">
          {visibleAssets.map((asset, index) => (
            <article
              className="asset-card glass overflow-hidden rounded-[21px] transition hover:[transform:translateY(-7px)] hover:border-[rgba(155,123,255,.32)] hover:shadow-[0_28px_80px_rgba(0,0,0,.42),_0_0_40px_rgba(119,82,238,.06)] border-[1px_solid_var(--line)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(0,0,0,.28),_inset_0_1px_rgba(255,255,255,.05)] [backdrop-filter:blur(22px)] [-webkit-backdrop-filter:blur(22px)]"
              key={asset.name}
            >
              <div
                className={`asset-visual ${asset.tone} relative grid h-[285px] overflow-hidden place-items-center bg-[#151734] after:[content:''] after:absolute after:inset-0 after:bg-[linear-gradient(180deg,_transparent_68%,_rgba(5,7,17,.35))] [&.aurora]:bg-[radial-gradient(circle_at_22%_20%,rgba(89,232,218,.45),transparent_27%),radial-gradient(circle_at_80%_68%,rgba(164,94,255,.6),transparent_28%),linear-gradient(135deg,#153550,#241447)] [&.solar]:bg-[radial-gradient(circle_at_55%_45%,#ffe5ac_0_4%,#e17862_10%,transparent_29%),linear-gradient(145deg,#2e1634,#5d2a42_58%,#121b36)] [&.prism]:bg-[conic-gradient(from_200deg_at_50%_45%,#12283d,#6262cc,#ce62bd,#5ed8c8,#12283d)] [&.void]:bg-[radial-gradient(ellipse_at_center,#5a4fac_0_8%,#222350_26%,transparent_55%),linear-gradient(145deg,#090d1a,#17152f)] [&.liquid]:bg-[radial-gradient(circle_at_25%_70%,#58ddd4,transparent_19%),radial-gradient(circle_at_72%_22%,#874ee5,transparent_26%),linear-gradient(145deg,#102940,#321950)] [&.nature]:bg-[radial-gradient(circle_at_55%_45%,#d7f5ae_0_5%,#55a677_13%,transparent_36%),linear-gradient(145deg,#17332f,#1a1e39)] max-[600px]:h-[320px]`}
              >
                <div className="generative-shape relative w-[135px] h-[135px] border-[1px_solid_rgba(255,255,255,.45)] rounded-[35%_65%_57%_43%_/_55%_40%_60%_45%] shadow-[inset_0_0_40px_rgba(255,255,255,.15),0_0_45px_rgba(255,255,255,.13)] [transform:rotate(18deg)] [backdrop-filter:blur(4px)] before:[content:''] before:absolute before:border-[1px_solid_rgba(255,255,255,.35)] before:rounded-[inherit] before:inset-[15px] before:[transform:rotate(24deg)] after:[content:''] after:absolute after:border-[1px_solid_rgba(255,255,255,.35)] after:rounded-[inherit] after:inset-[15px] after:[transform:rotate(24deg)] [&_i]:[content:''] [&_i]:absolute [&_i]:border-[1px_solid_rgba(255,255,255,.35)] [&_i]:rounded-[inherit] [&_i]:inset-[15px] [&_i]:[transform:rotate(24deg)] after:inset-[34px] after:[transform:rotate(48deg)] [&_i:nth-child(1)]:inset-[-28px_40px] [&_i:nth-child(1)]:[transform:rotate(70deg)] [&_i:nth-child(2)]:inset-[42px_-25px] [&_i:nth-child(2)]:[transform:rotate(-30deg)] [&_i:nth-child(3)]:inset-[54px] [&_i:nth-child(3)]:rounded-full [&_i:nth-child(3)]:bg-[rgba(255,255,255,.4)] [&_i:nth-child(3)]:shadow-[0_0_18px_white]">
                  <i />
                  <i />
                  <i />
                </div>
                <span className="asset-chain absolute z-[2] top-[13px] border-[1px_solid_rgba(255,255,255,.13)] rounded-full bg-[rgba(7,10,22,.55)] [backdrop-filter:blur(12px)] text-[12px] font-semibold left-[13px] py-1.5 px-[9px] text-[#d9dfeb]">
                  {asset.chain}
                </span>
                <span className="asset-time absolute z-[2] top-[13px] border-[1px_solid_rgba(255,255,255,.13)] rounded-full bg-[rgba(7,10,22,.55)] [backdrop-filter:blur(12px)] text-[12px] font-semibold right-[49px] flex items-center gap-[5px] py-1.5 px-[9px] text-[#c2cada] [&_i]:w-1 [&_i]:h-1 [&_i]:rounded-full [&_i]:bg-[#59e5be]">
                  <i /> {asset.time}
                </span>
                <button
                  className="heart-button absolute z-[2] right-[13px] top-[13px] grid w-[29px] h-[29px] place-items-center border-[1px_solid_rgba(255,255,255,.13)] rounded-full bg-[rgba(7,10,22,.55)] text-base cursor-pointer [backdrop-filter:blur(12px)]"
                  aria-label={`Save ${asset.name}`}
                >
                  ♡
                </button>
                {index === 0 && (
                  <span className="hot-label absolute z-[2] top-[13px] border-[1px_solid_rgba(255,255,255,.13)] rounded-full bg-[rgba(7,10,22,.55)] [backdrop-filter:blur(12px)] text-[12px] font-semibold top-[auto] bottom-[13px] left-[13px] py-1.5 px-[9px] text-[#d0c2ff] tracking-[.6px]">
                    ✦ TRENDING
                  </span>
                )}
              </div>
              <div className="asset-body [padding:15px_16px_17px] [&_h3]:[margin:13px_0_17px] [&_h3]:text-[15px] [&_h3]:font-semibold [&_h3]:tracking-[-.2px]">
                <div className="asset-creator flex items-center gap-2 text-[#778299] text-[12px] [&_strong]:text-[#b9c1d1] [&_strong]:font-medium [&_i]:[display:inline-grid] [&_i]:w-[11px] [&_i]:h-[11px] [&_i]:ml-[3px] [&_i]:place-items-center [&_i]:rounded-full [&_i]:bg-[#7962ec] [&_i]:text-white [&_i]:text-[12px] [&_i]:not-italic [&_button]:ml-auto [&_button]:border-0 [&_button]:bg-transparent [&_button]:text-[#69748b] [&_button]:tracking-[2px] [&_button]:cursor-pointer">
                  <span
                    className={`mini-avatar avatar-${index} grid w-[25px] h-[25px] place-items-center border-[2px_solid_rgba(255,255,255,.12)] rounded-full bg-[linear-gradient(135deg,#9c74ef,#45cfc5)] text-white text-[12px] font-bold`}
                  >
                    {asset.avatar}
                  </span>
                  <span>
                    by <strong>{asset.creator}</strong>
                    <i>✓</i>
                  </span>
                  <button aria-label="More options">•••</button>
                </div>
                <Link href={`/nft/${index + 1}`}>
                  <h3>{asset.name}</h3>
                </Link>
                <div className="asset-price-row flex items-end justify-between border-t-[1px_solid_var(--line)] pt-[13px] [&_>_div]:grid [&_>_div]:gap-1 [&_span]:text-[#6f7a91] [&_span]:text-[12px] [&_strong]:text-[13px] [&_>_div:last-child]:text-right [&_button]:border-0 [&_button]:bg-transparent [&_button]:text-[#a995ff] [&_button]:text-[12px] [&_button]:font-semibold [&_button]:cursor-pointer">
                  <div>
                    <span>Current bid</span>
                    <strong>{asset.price}</strong>
                  </div>
                  <div>
                    <span>{asset.bid}</span>
                    <button>Place a bid</button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {!visibleAssets.length && (
          <div className="empty-results glass grid place-items-center mt-4.5 rounded-[20px] p-[50px] [&>span]:text-[36px] [&>span]:text-[#765ed3] [&_h3]:[margin:12px_0_4px] [&_p]:text-[#6f7a90] [&_p]:text-[12px] [&_button]:border-0 [&_button]:bg-transparent [&_button]:text-[#a58cff] [&_button]:text-[12px] [&_button]:cursor-pointer border-[1px_solid_var(--line)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(0,0,0,.28),_inset_0_1px_rgba(255,255,255,.05)] [backdrop-filter:blur(22px)] [-webkit-backdrop-filter:blur(22px)]">
            <span>⌕</span>
            <h3>No assets found</h3>
            <p>Try a different name, creator, or blockchain.</p>
            <button onClick={() => setQuery("")}>Clear search</button>
          </div>
        )}

        <div className="load-more-wrap grid place-items-center pt-12 [&_p]:mt-3 [&_p]:text-[#566177] [&_p]:text-[12px]">
          <button className="load-more flex min-h-12 items-center gap-[13px] border-[1px_solid_rgba(155,123,255,.28)] rounded-[14px] py-0 px-5 bg-[rgba(155,123,255,.07)] text-[#c8bbf8] text-[12px] font-semibold cursor-pointer hover:bg-[rgba(155,123,255,.13)]">
            Load more discoveries <span>↓</span>
          </button>
          <p>Showing 6 of 12,804 unique assets</p>
        </div>
      </section>
    </main>
  );
}
