"use client";

import Link from "next/link";
import { useAuth } from "../auth/AuthProvider";

const modules = [
  {
    eyebrow: "DISCOVER",
    icon: "⌕",
    title: "Explore & buy",
    description: "Discover verified NFTs, compare prices, and buy assets from the marketplace.",
    href: "/marketplace",
    action: "Explore marketplace",
    tone: "violet",
  },
  {
    eyebrow: "AUCTIONS",
    icon: "◷",
    title: "Active bids",
    description: "Track the auctions you have joined and keep an eye on items ending soon.",
    href: "/marketplace",
    action: "Browse live auctions",
    tone: "cyan",
  },
  {
    eyebrow: "ASSETS",
    icon: "◇",
    title: "My collection",
    description: "Review NFTs owned by your connected wallet and open their asset details.",
    href: "/marketplace",
    action: "View collected assets",
    tone: "rose",
  },
  {
    eyebrow: "SAVED",
    icon: "♡",
    title: "Favorites",
    description: "Keep interesting assets close and return when you are ready to place a bid.",
    href: "/marketplace",
    action: "Find new favorites",
    tone: "amber",
  },
] as const;

const activity = [
  { icon: "↗", title: "Bid placed", detail: "Beyond the Horizon · 3.24 ETH", time: "2m" },
  { icon: "◇", title: "Asset collected", detail: "Celestial Drift · 4.80 ETH", time: "1h" },
  { icon: "♡", title: "Added to favorites", detail: "Signal Garden · #1048", time: "4h" },
];

const stats = [
  { label: "Owned assets", value: "03", note: "In your collection", icon: "◇" },
  { label: "Active bids", value: "02", note: "Across live auctions", icon: "◷" },
  { label: "Favorites", value: "12", note: "Saved for later", icon: "♡" },
];

export default function UserDashboard() {
  const auth = useAuth();
  const username = auth.user?.username;
  const profileHref = username ? `/profile/${encodeURIComponent(username)}` : "/";
  const shortAddress = auth.user
    ? `${auth.user.address.slice(0, 6)}…${auth.user.address.slice(-4)}`
    : "";

  return (
    <main className="mx-auto min-h-screen w-[min(1180px,calc(100%_-_40px))] pb-24 pt-[98px] max-[600px]:w-[calc(100%_-_28px)] max-[600px]:pb-16 max-[600px]:pt-[105px]">
      <header className="relative overflow-hidden rounded-[28px] border border-[var(--line)] bg-[radial-gradient(circle_at_82%_22%,rgba(84,220,207,.16),transparent_25%),radial-gradient(circle_at_18%_80%,rgba(141,107,255,.19),transparent_30%),rgba(255,255,255,.018)] px-4 py-4 shadow-[0_24px_80px_rgba(0,0,0,.22)] max-[600px]:px-5 max-[600px]:py-7">
        <div className="absolute inset-0 opacity-[.08] [background-image:linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="relative flex items-end justify-between gap-8 max-[760px]:items-start max-[760px]:flex-col">
          <div>
            <span className="text-[12px] font-bold tracking-[2px] text-[var(--cyan)]">
              YOUR DASHBOARD
            </span>
            <h1 className="mb-3 mt-3 text-[clamp(36px,5vw,60px)] font-semibold leading-none tracking-[-3px] max-[600px]:tracking-[-2px]">
              Welcome Back,{" "}
              <span className="bg-[linear-gradient(100deg,#b49dff,#6deee0)] bg-clip-text text-transparent">
                {username ? `@${username}` : "Collector"}
              </span>
            </h1>
          </div>
        </div>
      </header>

      <section
        className="mt-2 grid grid-cols-3 gap-4 max-[760px]:grid-cols-1"
        aria-label="Account overview"
      >
        {stats.map((stat) => (
          <article
            className="rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-3 shadow-[0_18px_50px_rgba(0,0,0,.18)]"
            key={stat.label}
          >
            <div className="flex items-center justify-between text-[12px] text-[#778298]">
              <span>{stat.label}</span>
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[rgba(155,123,255,.09)] text-[#a68cf7]">
                {stat.icon}
              </span>
            </div>
            <strong className="mt-3 block text-[28px] tracking-[-1px]">{stat.value}</strong>
            <small className="text-[12px] text-[#566176]">{stat.note}</small>
          </article>
        ))}
      </section>

      <section className="mt-4 grid grid-cols-[1.15fr_.85fr] gap-4 max-[850px]:grid-cols-1">
        <article className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-6 max-[500px]:p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-[1.6px] text-[#68748a]">LATEST</span>
              <h2 className="mb-0 mt-2 text-xl font-semibold">Recent activity</h2>
            </div>
            <Link className="text-[12px] text-[#9982ec]" href="/marketplace">
              View market
            </Link>
          </div>
          <div>
            {activity.map((item) => (
              <div
                className="flex items-center gap-3 border-b border-white/[.055] py-4 last:border-0"
                key={item.title}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[.035] text-[#9c86ed]">
                  {item.icon}
                </span>
                <p className="m-0 min-w-0 flex-1">
                  <strong className="block text-[12px] font-semibold">{item.title}</strong>
                  <small className="mt-1 block truncate text-[12px] text-[#626d82]">
                    {item.detail}
                  </small>
                </p>
                <time className="text-[11px] text-[#505b70]">{item.time}</time>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
