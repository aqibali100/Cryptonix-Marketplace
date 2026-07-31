"use client";

import Link from "next/link";
import { useState } from "react";
import CreatorOverview from "./CreatorOverview";
import type { CreatorSectionName } from "./creator-navigation";

const nfts = [
  { name: "Beyond the Horizon", collection: "Aether Dimensions", price: "3.24 ETH", status: "Listed", tone: "violet" },
  { name: "Celestial Drift", collection: "Aether Dimensions", price: "4.80 ETH", status: "Auction", tone: "cyan" },
  { name: "Signal Garden #1048", collection: "Synthetic Nature", price: "2.10 ETH", status: "Owned", tone: "rose" },
  { name: "Parallel Light", collection: "Prismatic Forms", price: "1.75 ETH", status: "Listed", tone: "amber" },
];

const tableRows = {
  listings: [
    ["Beyond the Horizon", "Fixed price", "3.24 ETH", "142 views", "Active"],
    ["Parallel Light", "Fixed price", "1.75 ETH", "89 views", "Active"],
    ["Orbital Bloom", "Reserved", "2.40 ETH", "51 views", "Pending"],
  ],
  auctions: [
    ["Celestial Drift", "4.80 ETH", "12 bids", "02h 14m", "Live"],
    ["Chromatic Echo", "2.15 ETH", "7 bids", "08h 45m", "Live"],
    ["Infinite Bloom", "1.20 ETH", "0 bids", "Starts tomorrow", "Scheduled"],
  ],
  offers: [
    ["Signal Garden #1048", "nova.collector", "2.85 ETH", "6h", "New"],
    ["Beyond the Horizon", "0x71F...8A2", "3.10 ETH", "18h", "New"],
    ["Parallel Light", "mika.eth", "1.62 ETH", "2d", "Review"],
  ],
  sales: [
    ["Liquid Memory #07", "ori.collector", "3.25 ETH", "Jul 28, 2026", "Complete"],
    ["Synthetic Soul", "0x29D...81C", "1.90 ETH", "Jul 22, 2026", "Complete"],
    ["Neon Genesis #042", "nova.collector", "4.10 ETH", "Jul 18, 2026", "Complete"],
  ],
};

function Header({ eyebrow, title, text, action }: { eyebrow: string; title: string; text: string; action?: React.ReactNode }) {
  return (
    <header className="mb-6 flex items-end justify-between gap-5 max-[640px]:items-start max-[640px]:flex-col">
      <div>
        <span className="text-[10px] font-bold tracking-[1.8px] text-[var(--cyan)]">{eyebrow}</span>
        <h1 className="mb-0 mt-2 text-[clamp(30px,4vw,44px)] font-semibold tracking-[-2px]">{title}</h1>
        <p className="mb-0 mt-2 max-w-2xl text-[12px] leading-5 text-[#727e93]">{text}</p>
      </div>
      {action}
    </header>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-[20px] border border-[var(--line)] bg-[rgba(255,255,255,.022)] p-4 shadow-[0_18px_50px_rgba(0,0,0,.16)] ${className}`}>{children}</section>;
}

function Button({ children, secondary = false }: { children: React.ReactNode; secondary?: boolean }) {
  return <button className={`inline-flex h-10 cursor-pointer items-center justify-center rounded-xl px-4 text-[11px] font-semibold transition hover:-translate-y-0.5 ${secondary ? "border border-[var(--line)] bg-white/[.035] text-[#bdc5d4] hover:bg-white/[.065]" : "bg-[linear-gradient(110deg,#8d6bff,#6849ea)] text-white shadow-[0_10px_28px_rgba(105,72,235,.25)]"}`}>{children}</button>;
}

function CreateNftLink() {
  return <Link className="inline-flex h-10 items-center justify-center rounded-xl bg-[linear-gradient(110deg,#8d6bff,#6849ea)] px-4 text-[11px] font-semibold text-white shadow-[0_10px_28px_rgba(105,72,235,.25)] transition hover:-translate-y-0.5" href="/creator/create">Create NFT +</Link>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-2 text-[11px] font-semibold text-[#aab3c4] [&_input]:h-11 [&_input]:rounded-xl [&_input]:border [&_input]:border-[var(--line)] [&_input]:bg-[#0b0f1e] [&_input]:px-3 [&_input]:text-[12px] [&_input]:font-normal [&_input]:text-white [&_input]:outline-none [&_select]:h-11 [&_select]:rounded-xl [&_select]:border [&_select]:border-[var(--line)] [&_select]:bg-[#0b0f1e] [&_select]:px-3 [&_select]:text-[12px] [&_select]:font-normal [&_select]:text-white [&_textarea]:min-h-28 [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-[var(--line)] [&_textarea]:bg-[#0b0f1e] [&_textarea]:p-3 [&_textarea]:text-[12px] [&_textarea]:font-normal [&_textarea]:text-white [&_textarea]:outline-none">{label}{children}</label>;
}

function AssetVisual({ tone }: { tone: string }) {
  const backgrounds: Record<string, string> = {
    violet: "bg-[radial-gradient(circle_at_35%_30%,#a17bff,transparent_22%),linear-gradient(145deg,#101d3a,#2f174a)]",
    cyan: "bg-[radial-gradient(circle_at_60%_42%,#62e4d8,transparent_20%),linear-gradient(145deg,#12343b,#19183c)]",
    rose: "bg-[radial-gradient(circle_at_45%_38%,#e06ab8,transparent_21%),linear-gradient(145deg,#421e3c,#171a35)]",
    amber: "bg-[radial-gradient(circle_at_55%_45%,#f1c46a,transparent_19%),linear-gradient(145deg,#38263b,#141b36)]",
  };
  return <div className={`grid aspect-[1.25] place-items-center rounded-[14px] ${backgrounds[tone]}`}><span className="h-20 w-20 rotate-12 rounded-[38%_62%_46%_54%] border border-white/40 shadow-[inset_0_0_25px_rgba(255,255,255,.12),0_0_35px_rgba(255,255,255,.12)]" /></div>;
}

function CreateNft() {
  const [auction, setAuction] = useState(false);
  return <><Header eyebrow="CREATE" title="Create a new NFT." text="Upload your work, add its details, and choose how collectors can own it." />
    <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-4 max-[950px]:grid-cols-1"><Card className="p-5"><form className="grid gap-5" onSubmit={(e) => e.preventDefault()}><label className="grid min-h-44 cursor-pointer place-items-center rounded-2xl border border-dashed border-[rgba(155,123,255,.35)] bg-[rgba(155,123,255,.035)] text-center"><input type="file" className="hidden"/><span><b className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-[rgba(155,123,255,.13)] text-xl text-[#b39eff]">↑</b><strong className="mt-3 block text-[12px]">Drop your artwork here</strong><small className="mt-1 block text-[10px] text-[#69758b]">PNG, WEBP, GIF, MP4 or MP3 · Max 100 MB</small></span></label><div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1"><Field label="NFT name"><input placeholder="e.g. Beyond the Horizon" required/></Field><Field label="Collection"><select><option>Aether Dimensions</option><option>Prismatic Forms</option></select></Field></div><Field label="Description"><textarea placeholder="Tell collectors about this creation..."/></Field><div className="grid grid-cols-3 gap-4 max-[700px]:grid-cols-1"><Field label="Supply"><input type="number" defaultValue="1" min="1"/></Field><Field label="Blockchain"><select><option>Ethereum</option><option>Base</option><option>Polygon</option></select></Field><Field label="Royalty"><input defaultValue="5%"/></Field></div><div><span className="text-[11px] font-semibold text-[#aab3c4]">Sale type</span><div className="mt-2 grid grid-cols-2 gap-3 max-[500px]:grid-cols-1"><button className={`rounded-xl border p-4 text-left ${!auction ? "border-[rgba(155,123,255,.45)] bg-[rgba(155,123,255,.08)]" : "border-[var(--line)]"}`} onClick={() => setAuction(false)} type="button"><strong className="block text-[11px]">Fixed price</strong><small className="mt-1 block text-[10px] text-[#69758b]">Sell instantly at one price</small></button><button className={`rounded-xl border p-4 text-left ${auction ? "border-[rgba(155,123,255,.45)] bg-[rgba(155,123,255,.08)]" : "border-[var(--line)]"}`} onClick={() => setAuction(true)} type="button"><strong className="block text-[11px]">Timed auction</strong><small className="mt-1 block text-[10px] text-[#69758b]">Let collectors compete</small></button></div></div><div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1"><Field label={auction ? "Minimum bid" : "Price"}><input defaultValue="1.00 ETH"/></Field>{auction && <Field label="Duration"><select><option>24 hours</option><option>3 days</option><option>7 days</option></select></Field>}</div><Button>Create digital asset →</Button></form></Card><aside><span className="mb-2 block px-1 text-[10px] font-bold tracking-[1.4px] text-[#68748a]">LIVE PREVIEW</span><Card><AssetVisual tone="violet"/><div className="mt-4 flex justify-between gap-3"><div><small className="text-[10px] text-[#68748a]">Untitled</small><strong className="mt-1 block text-[11px]">By Aether Studio</strong></div><div className="text-right"><small className="text-[10px] text-[#68748a]">Price</small><strong className="mt-1 block text-[11px]">1.00 ETH</strong></div></div></Card></aside></div></>;
}

function NftGrid() { return <><Header eyebrow="LIBRARY" title="My NFTs" text="Manage every digital asset created or owned by your studio." action={<CreateNftLink />}/><div className="mb-4 flex flex-wrap gap-2"><input className="h-10 min-w-0 flex-1 rounded-xl border border-[var(--line)] bg-white/[.025] px-3 text-[11px] outline-none" placeholder="Search your NFTs..."/><Button secondary>Filter</Button><Button secondary>Newest first⌄</Button></div><div className="grid grid-cols-4 gap-3 max-[1150px]:grid-cols-3 max-[820px]:grid-cols-2 max-[520px]:grid-cols-1">{nfts.map(item => <Card className="p-2" key={item.name}><AssetVisual tone={item.tone}/><div className="p-2"><span className="text-[9px] text-[#657087]">{item.collection}</span><strong className="mt-1 block truncate text-[12px]">{item.name}</strong><div className="mt-3 flex items-center justify-between"><span className="text-[11px] text-[#a990fa]">{item.price}</span><span className="rounded-full bg-emerald-400/[.08] px-2 py-1 text-[9px] text-emerald-300">{item.status}</span></div></div></Card>)}</div></> }

function Collections() { return <><Header eyebrow="PORTFOLIO" title="Collections" text="Organize your work into recognizable worlds for collectors." action={<Button>New collection +</Button>}/><div className="grid grid-cols-3 gap-4 max-[950px]:grid-cols-2 max-[600px]:grid-cols-1">{[["Aether Dimensions","42 items","1.72 ETH"],["Synthetic Nature","31 items","0.94 ETH"],["Prismatic Forms","18 items","2.10 ETH"]].map(([name,count,floor],i)=><Card className="overflow-hidden p-2" key={name}><div className={`h-36 rounded-[14px] ${i===0?"bg-[radial-gradient(circle_at_30%_30%,#8965e9,transparent_25%),linear-gradient(135deg,#12283d,#291747)]":i===1?"bg-[radial-gradient(circle_at_65%_40%,#51d8c9,transparent_22%),linear-gradient(135deg,#14383a,#1b1b42)]":"bg-[conic-gradient(from_180deg,#151d3b,#8a55d5,#d363a9,#4dd9cb,#151d3b)]"}`}/><div className="p-3"><strong className="text-[13px]">{name}</strong><div className="mt-4 grid grid-cols-2 gap-2"><span><small className="block text-[9px] text-[#657087]">Items</small><b className="text-[11px]">{count}</b></span><span><small className="block text-[9px] text-[#657087]">Floor</small><b className="text-[11px]">{floor}</b></span></div></div></Card>)}</div></> }

function DataScreen({ type }: { type: keyof typeof tableRows }) { const config={listings:["MARKET","Active listings","Monitor and manage assets currently available to collectors.",["Asset","Sale type","Price","Performance","Status"]],auctions:["LIVE SALES","Auctions","Track bids, reserve prices, and auction countdowns.",["Asset","Top bid","Activity","Time remaining","Status"]],offers:["INBOX","Offers received","Review and respond to offers from collectors.",["Asset","Collector","Offer","Expires","Status"]],sales:["HISTORY","Sales history","A complete record of your studio's settled sales.",["Asset","Buyer","Amount","Date","Status"]]} as const; const [eyebrow,title,text,heads]=config[type]; return <><Header eyebrow={eyebrow} title={title} text={text} action={<Button secondary>Export CSV</Button>}/><Card className="overflow-hidden p-0"><div className="overflow-x-auto"><table className="w-full min-w-[700px] border-collapse text-left"><thead><tr className="border-b border-[var(--line)] bg-white/[.018]">{heads.map(h=><th className="px-4 py-3 text-[9px] font-bold uppercase tracking-[1px] text-[#68748a]" key={h}>{h}</th>)}</tr></thead><tbody>{tableRows[type].map((row)=><tr className="border-b border-white/[.05] last:border-0 hover:bg-white/[.018]" key={row[0]}>{row.map((cell,j)=><td className={`px-4 py-4 text-[11px] ${j===0?"font-semibold text-[#e7eaf2]":"text-[#8290a5]"}`} key={cell}>{j===4?<span className="rounded-full bg-emerald-400/[.07] px-2 py-1 text-[9px] text-emerald-300">{cell}</span>:cell}</td>)}</tr>)}</tbody></table></div></Card></> }

function Earnings() { return <><Header eyebrow="FINANCE" title="Earnings" text="Understand revenue across sales, chains, and collections." action={<Button secondary>Download report</Button>}/><div className="grid grid-cols-3 gap-3 max-[800px]:grid-cols-1">{[["Available balance","18.42 ETH","≈ $46,184"],["Pending settlement","3.80 ETH","≈ $9,527"],["Lifetime earnings","126.74 ETH","≈ $317,940"]].map(([a,b,c])=><Card key={a}><span className="text-[10px] text-[#707c91]">{a}</span><strong className="mt-3 block text-2xl">{b}</strong><small className="mt-2 block text-[10px] text-[#596579]">{c}</small></Card>)}</div><Card className="mt-4"><div className="flex items-center justify-between"><h2 className="text-base">Revenue by collection</h2><Button>Withdraw earnings</Button></div><div className="mt-6 space-y-5">{[["Aether Dimensions","68%","86.19 ETH"],["Synthetic Nature","21%","26.62 ETH"],["Prismatic Forms","11%","13.93 ETH"]].map(([name,width,value])=><div key={name}><div className="mb-2 flex justify-between text-[10px]"><span>{name}</span><span className="text-[#8894a8]">{value}</span></div><div className="h-2 overflow-hidden rounded-full bg-white/[.045]"><span className="block h-full rounded-full bg-[linear-gradient(90deg,#7456e7,#4dd9cf)]" style={{width}}/></div></div>)}</div></Card></> }

function Royalties() { return <><Header eyebrow="PASSIVE REVENUE" title="Royalties" text="Track ongoing earnings when your work changes hands."/><div className="grid grid-cols-[.7fr_1.3fr] gap-4 max-[900px]:grid-cols-1"><Card><span className="text-[10px] text-[#707c91]">Royalty earnings</span><strong className="mt-3 block text-3xl">14.28 ETH</strong><small className="mt-2 block text-[10px] text-emerald-300">+18.2% this month</small><div className="mt-6 rounded-xl border border-white/[.05] bg-white/[.02] p-3"><span className="text-[10px] text-[#6c788d]">Default royalty</span><div className="mt-2 flex items-center justify-between"><strong>5.0%</strong><button className="text-[10px] text-[#9d87ee]">Edit</button></div></div></Card><Card><h2 className="text-base">Royalty activity</h2><div className="mt-3">{[["Beyond the Horizon","0.16 ETH","Secondary sale"],["Celestial Drift","0.24 ETH","Secondary sale"],["Signal Garden #1048","0.11 ETH","Secondary sale"]].map(([name,value,note])=><div className="flex items-center gap-3 border-b border-white/[.05] py-3 last:border-0" key={name}><span className="grid h-9 w-9 place-items-center rounded-xl bg-[rgba(155,123,255,.09)] text-[#a990fa]">%</span><div className="flex-1"><strong className="block text-[11px]">{name}</strong><small className="text-[9px] text-[#657087]">{note}</small></div><b className="text-[11px] text-emerald-300">+{value}</b></div>)}</div></Card></div></> }

function Wallets() { return <><Header eyebrow="SECURITY" title="Linked wallets" text="Manage wallets authorized to mint and receive creator earnings." action={<Button>Link wallet +</Button>}/><Card><div className="flex items-center gap-4 max-[560px]:items-start"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(145deg,#e17739,#7e3b9b)] text-lg">◆</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><strong className="truncate text-[12px]">0x7A2F...91C4</strong><span className="rounded-full bg-emerald-400/[.08] px-2 py-1 text-[9px] text-emerald-300">Primary</span></div><small className="mt-1 block text-[10px] text-[#68748a]">Ethereum · Connected Jul 12, 2026</small></div><Button secondary>Manage</Button></div></Card></> }

function Settings() { return <><Header eyebrow="ACCOUNT" title="Profile settings" text="Keep your public creator identity and studio information up to date."/><div className="grid grid-cols-[220px_1fr] gap-4 max-[750px]:grid-cols-1"><Card className="self-start text-center"><span className="mx-auto grid h-24 w-24 place-items-center rounded-[28px] bg-[linear-gradient(145deg,#8d6bff,#45cfc5)] text-2xl font-bold">AS</span><strong className="mt-4 block text-[13px]">Aether Studio</strong><small className="mt-1 block text-[10px] text-emerald-300">Verified creator</small><div className="mt-4"><Button secondary>Change image</Button></div></Card><Card><form className="grid gap-4" onSubmit={e=>e.preventDefault()}><div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1"><Field label="Display name"><input defaultValue="Aether Studio"/></Field><Field label="Username"><input defaultValue="aether.studio"/></Field></div><Field label="Bio"><textarea defaultValue="Exploring the space between generative systems and human imagination."/></Field><div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1"><Field label="Email"><input type="email" defaultValue="studio@aether.xyz"/></Field><Field label="Website"><input type="url" defaultValue="https://aether.xyz"/></Field></div><div className="flex justify-end"><Button>Save changes</Button></div></form></Card></div></> }

export default function CreatorSection({ section }: { section: CreatorSectionName }) {
  if (section === "overview") return <CreatorOverview />;
  if (section === "create") return <CreateNft />;
  if (section === "nfts") return <NftGrid />;
  if (section === "collections") return <Collections />;
  if (["listings", "auctions", "offers", "sales"].includes(section)) return <DataScreen type={section as keyof typeof tableRows} />;
  if (section === "earnings") return <Earnings />;
  if (section === "royalties") return <Royalties />;
  if (section === "wallets") return <Wallets />;
  return <Settings />;
}
