import Link from "next/link";

const metrics = [
  { label: "Net revenue", value: "42.84 ETH", usd: "$107,438", change: "+12.4%", icon: "revenue" },
  { label: "Sales volume", value: "58.32 ETH", usd: "31 sales", change: "+8.7%", icon: "volume" },
  { label: "Active collectors", value: "1,284", usd: "68 new this month", change: "+5.6%", icon: "collectors" },
  { label: "Conversion rate", value: "6.84%", usd: "Views to sales", change: "+1.2%", icon: "conversion" },
];

const recentActivity = [
  { title: "Celestial Drift received a bid", meta: "4.80 ETH by nova.collector", time: "2m", tone: "violet" },
  { title: "Beyond the Horizon sold", meta: "3.24 ETH · Settlement complete", time: "1h", tone: "green" },
  { title: "Signal Garden was favorited", meta: "18 new collectors are watching", time: "4h", tone: "cyan" },
  { title: "Royalty payment received", meta: "0.16 ETH from a secondary sale", time: "8h", tone: "amber" },
];

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-[20px] border border-[var(--line)] bg-[linear-gradient(145deg,rgba(255,255,255,.028),rgba(155,123,255,.012))] p-4 shadow-[0_20px_55px_rgba(0,0,0,.17)] ${className}`}
    >
      {children}
    </section>
  );
}

function MetricIcon({ name }: { name: string }) {
  const content: Record<string, React.ReactNode> = {
    revenue: <><circle cx="12" cy="12" r="8" /><path d="M15 8.5c-.7-.8-1.7-1.2-3-1.2-1.7 0-3 1-3 2.2 0 1.4 1.1 2 3 2.4 2 .4 3 1 3 2.4 0 1.3-1.3 2.4-3 2.4-1.3 0-2.5-.5-3.2-1.3M12 5.5v13" /></>,
    volume: <><path d="M4 19V9M10 19V5M16 19v-7M22 19V3" /><path d="m3 7 6-4 6 5 7-5" /></>,
    collectors: <><circle cx="9" cy="8" r="3" /><path d="M3 19a6 6 0 0 1 12 0M16 8.5a2.5 2.5 0 0 1 0 5M17 16a4.5 4.5 0 0 1 4 3" /></>,
    conversion: <><path d="M5 17 17 5M7 5h10v10" /><path d="M19 13v6H5V5h6" /></>,
  };
  return <svg aria-hidden="true" className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{content[name]}</svg>;
}

function SectionTitle({ kicker, title, action }: { kicker: string; title: string; action?: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-4"><div><span className="text-[9px] font-bold tracking-[1.4px] text-[#68748a]">{kicker}</span><h2 className="mb-0 mt-1.5 text-[15px] font-semibold">{title}</h2></div>{action}</div>;
}

export default function CreatorOverview() {
  return (
    <div>
      <header className="relative mb-5 overflow-hidden rounded-[24px] border border-[rgba(155,123,255,.16)] bg-[radial-gradient(circle_at_85%_20%,rgba(83,232,220,.13),transparent_25%),radial-gradient(circle_at_15%_100%,rgba(141,107,255,.19),transparent_34%),rgba(255,255,255,.018)] p-5 sm:p-6">
        <div className="pointer-events-none absolute inset-0 opacity-[.07] [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:38px_38px]" />
        <div className="relative flex items-end justify-between gap-5 max-[680px]:items-start max-[680px]:flex-col">
          <div>
            <div className="flex items-center gap-2 text-[9px] font-bold tracking-[1.6px] text-[var(--cyan)]"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,.8)]" /> CREATOR BUSINESS OVERVIEW</div>
            <h1 className="mb-0 mt-3 text-[clamp(30px,4vw,46px)] font-semibold leading-none tracking-[-2.3px]">Good evening, Aether.</h1>
            <p className="mb-0 mt-3 max-w-xl text-[11px] leading-5 text-[#7f8ba0]">Your studio is up 12.4% this month. Two auctions and four new offers need your attention.</p>
          </div>
          <div className="flex flex-wrap gap-2 max-[480px]:grid max-[480px]:w-full max-[480px]:grid-cols-2">
            <Link className="inline-flex h-10 items-center justify-center rounded-xl border border-[var(--line)] bg-white/[.035] px-4 text-[10px] font-semibold text-[#bdc5d4] transition hover:bg-white/[.065]" href="/creator/earnings">View reports</Link>
            <Link className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(110deg,#8d6bff,#6849ea)] px-4 text-[10px] font-semibold shadow-[0_10px_28px_rgba(105,72,235,.3)] transition hover:-translate-y-0.5" href="/creator/create"><span className="text-base font-light">+</span> Create NFT</Link>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-4 gap-3 max-[1180px]:grid-cols-2 max-[560px]:grid-cols-1" aria-label="Creator key metrics">
        {metrics.map((metric) => (
          <article className="group relative overflow-hidden rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,.022)] p-4 transition hover:-translate-y-0.5 hover:border-[rgba(155,123,255,.25)]" key={metric.label}>
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-[rgba(125,87,228,.08)] blur-2xl" />
            <div className="relative flex items-start justify-between"><span className="text-[10px] text-[#748096]">{metric.label}</span><span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[rgba(155,123,255,.09)] text-[#a993f5]"><MetricIcon name={metric.icon} /></span></div>
            <strong className="relative mt-4 block text-[22px] tracking-[-.9px]">{metric.value}</strong>
            <div className="relative mt-2 flex items-center justify-between gap-2"><small className="truncate text-[9px] text-[#596579]">{metric.usd}</small><small className="rounded-full bg-emerald-400/[.07] px-2 py-1 text-[9px] font-semibold text-emerald-300">{metric.change}</small></div>
          </article>
        ))}
      </section>

      <div className="mt-4 grid grid-cols-[minmax(0,1.55fr)_minmax(270px,.65fr)] gap-4 max-[1050px]:grid-cols-1">
        <Panel>
          <SectionTitle kicker="REVENUE ANALYTICS" title="Sales performance" action={<select aria-label="Chart period" className="h-8 rounded-lg border border-[var(--line)] bg-[#0b0f1e] px-2 text-[9px] text-[#9aa5b8]"><option>Last 30 days</option><option>Last 90 days</option></select>} />
          <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-2"><div><span className="text-[9px] text-[#68748a]">Gross volume</span><strong className="mt-1 block text-xl">58.32 ETH</strong></div><div className="pb-0.5"><span className="text-[9px] text-[#68748a]">Net revenue</span><strong className="mt-1 block text-[12px] text-[#c9d0dc]">42.84 ETH</strong></div><span className="mb-0.5 rounded-full bg-emerald-400/[.07] px-2 py-1 text-[9px] text-emerald-300">↗ 12.4%</span></div>
          <div className="relative mt-5 h-[230px] overflow-hidden rounded-xl bg-[linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:100%_46px] max-[600px]:h-[190px]">
            <div className="absolute bottom-2 left-2 top-1 flex flex-col justify-between text-[8px] text-[#465166]"><span>16 ETH</span><span>12 ETH</span><span>8 ETH</span><span>4 ETH</span><span>0</span></div>
            <svg className="absolute inset-0 h-full w-full pl-10" viewBox="0 0 760 230" preserveAspectRatio="none"><defs><linearGradient id="overviewFill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#8d6bff" stopOpacity=".35"/><stop offset="1" stopColor="#8d6bff" stopOpacity="0"/></linearGradient><linearGradient id="overviewLine" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#8d6bff"/><stop offset="1" stopColor="#53e8dc"/></linearGradient></defs><path d="M0 194 C60 184 94 151 145 160 S220 126 278 139 S362 93 421 105 S510 56 568 74 S650 32 760 42 V230 H0Z" fill="url(#overviewFill)"/><path d="M0 194 C60 184 94 151 145 160 S220 126 278 139 S362 93 421 105 S510 56 568 74 S650 32 760 42" fill="none" stroke="url(#overviewLine)" strokeWidth="3"/><circle cx="568" cy="74" r="5" fill="#53e8dc" stroke="#08101d" strokeWidth="3"/></svg>
            <div className="absolute bottom-0 left-10 right-1 flex justify-between text-[8px] text-[#465166]"><span>Jul 01</span><span>Jul 08</span><span>Jul 15</span><span>Jul 22</span><span>Jul 30</span></div>
          </div>
        </Panel>

        <Panel>
          <SectionTitle kicker="SALES FUNNEL" title="Collector conversion" />
          <div className="mt-5 space-y-4">{[
            ["Profile views", "18,420", "100%", "w-full", "bg-[#6c55cc]"],
            ["NFT views", "9,284", "50.4%", "w-[50.4%]", "bg-[#8369e8]"],
            ["Offers & bids", "642", "6.9%", "w-[28%]", "bg-[#6b9fe0]"],
            ["Completed sales", "126", "19.6%", "w-[19.6%]", "bg-[#53d8cc]"],
          ].map(([label,value,rate,width,color]) => <div key={label}><div className="mb-2 flex items-center justify-between"><span className="text-[9px] text-[#748096]">{label}</span><div className="text-right"><b className="text-[10px]">{value}</b><small className="ml-2 text-[8px] text-[#566176]">{rate}</small></div></div><div className="h-1.5 overflow-hidden rounded-full bg-white/[.045]"><span className={`block h-full rounded-full ${width} ${color}`} /></div></div>)}</div>
          <div className="mt-6 rounded-xl border border-emerald-400/[.1] bg-emerald-400/[.035] p-3"><strong className="block text-[10px] text-emerald-300">Conversion is healthy</strong><p className="mb-0 mt-1 text-[9px] leading-4 text-[#647187]">Your offer-to-sale rate is 3.2% above similar creators.</p></div>
        </Panel>
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] gap-4 max-[950px]:grid-cols-1">
        <Panel>
          <SectionTitle kicker="LIVE MARKET" title="Auctions & offers" action={<Link className="text-[9px] font-semibold text-[#9b85ed]" href="/creator/offers">View all →</Link>} />
          <div className="mt-4 grid grid-cols-2 gap-3 max-[580px]:grid-cols-1">
            <article className="rounded-2xl border border-[rgba(155,123,255,.14)] bg-[rgba(155,123,255,.035)] p-3"><div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-[9px] text-emerald-300"><i className="h-1.5 w-1.5 rounded-full bg-emerald-300 not-italic"/> LIVE AUCTION</span><span className="text-[9px] text-[#78849a]">02:14:38</span></div><strong className="mt-4 block truncate text-[11px]">Celestial Drift</strong><div className="mt-3 flex items-end justify-between"><span><small className="block text-[8px] text-[#657087]">Top bid</small><b className="mt-1 block text-[13px]">4.80 ETH</b></span><span className="text-[9px] text-[#7e8ba0]">12 bids</span></div></article>
            <article className="rounded-2xl border border-rose-400/[.12] bg-rose-400/[.025] p-3"><div className="flex items-center justify-between"><span className="text-[9px] text-rose-300">BEST OFFER</span><span className="rounded-full bg-rose-400/[.1] px-2 py-1 text-[8px] text-rose-300">NEW</span></div><strong className="mt-4 block truncate text-[11px]">Signal Garden #1048</strong><div className="mt-3 flex items-end justify-between"><span><small className="block text-[8px] text-[#657087]">Offer</small><b className="mt-1 block text-[13px]">2.85 ETH</b></span><span className="text-[9px] text-[#7e8ba0]">Expires 6h</span></div></article>
          </div>
          <div className="mt-3 grid grid-cols-3 divide-x divide-white/[.055] rounded-xl border border-white/[.05] bg-white/[.018] py-3 text-center"><span><b className="block text-[12px]">5</b><small className="text-[8px] text-[#637087]">Live auctions</small></span><span><b className="block text-[12px]">19</b><small className="text-[8px] text-[#637087]">Total bids</small></span><span><b className="block text-[12px]">4</b><small className="text-[8px] text-[#637087]">Open offers</small></span></div>
        </Panel>

        <Panel>
          <SectionTitle kicker="ACTIVITY" title="Recent studio activity" action={<button className="text-[9px] text-[#7c879a]">Mark all read</button>} />
          <div className="mt-3">{recentActivity.map((item) => <div className="flex items-center gap-3 border-b border-white/[.05] py-3 last:border-0" key={item.title}><span className={`h-8 w-1 shrink-0 rounded-full ${item.tone === "violet" ? "bg-[#8d6bff]" : item.tone === "green" ? "bg-emerald-400" : item.tone === "cyan" ? "bg-cyan-300" : "bg-amber-300"}`} /><div className="min-w-0 flex-1"><strong className="block truncate text-[10px]">{item.title}</strong><small className="mt-1 block truncate text-[8px] text-[#626e83]">{item.meta}</small></div><time className="text-[8px] text-[#4f5a6f]">{item.time}</time></div>)}</div>
        </Panel>
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1.2fr)_minmax(260px,.8fr)] gap-4 max-[950px]:grid-cols-1">
        <Panel>
          <SectionTitle kicker="PORTFOLIO" title="Top-performing collections" action={<Link className="text-[9px] font-semibold text-[#9b85ed]" href="/creator/collections">Manage collections →</Link>} />
          <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[560px] border-collapse text-left"><thead><tr className="border-b border-white/[.055] text-[8px] uppercase tracking-[1px] text-[#596579]"><th className="pb-3 font-semibold">Collection</th><th className="pb-3 font-semibold">Volume</th><th className="pb-3 font-semibold">Floor</th><th className="pb-3 font-semibold">Owners</th><th className="pb-3 text-right font-semibold">Change</th></tr></thead><tbody>{[["Aether Dimensions","28.42 ETH","1.72 ETH","684","+14.8%"],["Synthetic Nature","9.84 ETH","0.94 ETH","312","+7.2%"],["Prismatic Forms","4.58 ETH","2.10 ETH","148","+3.9%"]].map((row,index)=><tr className="border-b border-white/[.045] last:border-0" key={row[0]}><td className="py-3"><span className="flex items-center gap-2"><i className={`h-8 w-8 rounded-[10px] not-italic ${index===0?"bg-[radial-gradient(circle,#9d78ef,transparent_45%),#171d35]":index===1?"bg-[radial-gradient(circle,#4dd6c9,transparent_45%),#142a35]":"bg-[radial-gradient(circle,#e069b3,transparent_45%),#271936]"}`}/><b className="text-[10px]">{row[0]}</b></span></td>{row.slice(1,-1).map(value=><td className="py-3 text-[9px] text-[#7c889d]" key={value}>{value}</td>)}<td className="py-3 text-right text-[9px] font-semibold text-emerald-300">{row[4]}</td></tr>)}</tbody></table></div>
        </Panel>

        <Panel>
          <SectionTitle kicker="AUDIENCE" title="Collector insights" />
          <div className="mt-4 flex items-center gap-5 max-[450px]:flex-col"><div className="relative grid h-28 w-28 shrink-0 place-items-center rounded-full bg-[conic-gradient(#8d6bff_0_52%,#53d8cc_52%_78%,#e06ab8_78%_91%,#3a4056_91%)]"><div className="grid h-[76px] w-[76px] place-items-center rounded-full bg-[#090c18] text-center"><span><b className="block text-lg">1.2K</b><small className="text-[8px] text-[#637087]">Collectors</small></span></div></div><div className="w-full space-y-3">{[["Ethereum","52%","bg-[#8d6bff]"],["Base","26%","bg-[#53d8cc]"],["Polygon","13%","bg-[#e06ab8]"],["Other","9%","bg-[#3a4056]"]].map(([name,value,color])=><div className="flex items-center gap-2 text-[9px]" key={name}><i className={`h-2 w-2 rounded-full not-italic ${color}`}/><span className="flex-1 text-[#778399]">{name}</span><b>{value}</b></div>)}</div></div>
          <div className="mt-5 grid grid-cols-2 gap-2"><div className="rounded-xl bg-white/[.025] p-3"><small className="text-[8px] text-[#637087]">Repeat buyers</small><b className="mt-1 block text-[12px]">34.8%</b></div><div className="rounded-xl bg-white/[.025] p-3"><small className="text-[8px] text-[#637087]">Top region</small><b className="mt-1 block text-[12px]">North America</b></div></div>
        </Panel>
      </div>
    </div>
  );
}
