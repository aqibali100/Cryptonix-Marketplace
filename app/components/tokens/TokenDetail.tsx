"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../../lib/api";

type TokenDetailData = {
  id: string;
  name: string;
  symbol: string;
  image?: string;
  rank?: number;
  categories: string[];
  description: string;
  homepage?: string;
  explorer?: string;
  price: number;
  marketCap: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  circulatingSupply: number;
  totalSupply: number;
  ath: number;
  athChange: number;
  change24h: number;
  sparkline: number[];
  lastUpdated?: string;
};
type Range = "1D" | "7D";

function money(value: number, compact = false) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: value < 1 ? 6 : 2,
  }).format(value);
}
function number(value: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(
    value,
  );
}
function fullNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
}

function buildChart(prices: number[]) {
  if (prices.length < 2) return { points: "0,170 760,40", min: 0, max: 0, change: 0 };
  const count = Math.min(90, prices.length);
  const sample = Array.from(
    { length: count },
    (_, index) => prices[Math.round((index * (prices.length - 1)) / (count - 1))],
  );
  const min = Math.min(...sample);
  const max = Math.max(...sample);
  const range = max - min || 1;
  const points = sample
    .map((price, index) => `${(index / (count - 1)) * 760},${188 - ((price - min) / range) * 154}`)
    .join(" ");
  return { points, min, max, change: ((sample.at(-1)! - sample[0]) / sample[0]) * 100 };
}

function Metric({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <article className="group rounded-[16px] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(255,255,255,.03),rgba(155,123,255,.018))] p-2 transition hover:border-[rgba(155,123,255,.28)] hover:bg-[rgba(155,123,255,.05)]">
      <span className="text-[12px] uppercase tracking-[1px] text-emerald-400 font-semibold">
        {label}
      </span>
      <strong className="mt-3 block truncate text-[14px] font-semibold text-[#edf0f8]">
        {value}
      </strong>
      {note && <small className="mt-1.5 block text-[12px] text-[#596479]">{note}</small>}
    </article>
  );
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <span className={`block rounded bg-white/[.075] ${className}`} />;
}

function TokenDetailSkeleton() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading token details"
      className="relative mx-auto w-[min(1180px,calc(100%_-_40px))] animate-pulse pb-5 pt-[100px] max-[600px]:w-[calc(100%_-_28px)] max-[600px]:pt-[112px]"
    >
      <section className="glass overflow-hidden rounded-[27px] border border-[var(--line)] bg-[linear-gradient(125deg,rgba(16,19,38,.94),rgba(11,14,28,.9))] p-4 max-[600px]:p-5">
        <div className="flex items-start justify-between gap-8 max-[700px]:flex-col">
          <div className="flex items-center gap-4">
            <SkeletonBlock className="h-[74px] w-[74px] shrink-0 rounded-[22px]" />
            <div>
              <div className="flex gap-2">
                <SkeletonBlock className="h-6 w-20 rounded-full" />
                <SkeletonBlock className="h-6 w-14 rounded-full" />
              </div>
              <SkeletonBlock className="mt-3 h-10 w-52 max-w-[55vw]" />
              <SkeletonBlock className="mt-3 h-3 w-36" />
            </div>
          </div>
          <div className="flex flex-col items-end gap-3 max-[700px]:w-full max-[700px]:items-start">
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="h-10 w-40" />
            <SkeletonBlock className="h-6 w-24 rounded-full" />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 border-t border-white/[.055] pt-3">
          <SkeletonBlock className="h-10 w-36 rounded-[11px]" />
          <SkeletonBlock className="h-10 w-28 rounded-[11px]" />
          <SkeletonBlock className="ml-auto h-10 w-32 rounded-[11px] max-[500px]:ml-0" />
        </div>
      </section>

      <section className="mt-4 grid grid-cols-[minmax(0,1.65fr)_minmax(280px,.65fr)] gap-4 max-[900px]:grid-cols-1">
        <article className="rounded-[23px] border border-[var(--line)] bg-white/[.018] p-5 max-[600px]:p-4">
          <div className="flex justify-between">
            <div>
              <SkeletonBlock className="h-3 w-32" />
              <SkeletonBlock className="mt-3 h-6 w-24" />
            </div>
            <SkeletonBlock className="h-9 w-24 rounded-[10px]" />
          </div>
          <div className="mt-5 grid grid-cols-[1fr_54px] gap-3">
            <div className="relative h-[265px] overflow-hidden rounded-[16px] bg-white/[.025] max-[600px]:h-[220px]">
              <div className="absolute inset-0 flex flex-col justify-between py-5">
                {[0, 1, 2, 3, 4].map((line) => (
                  <i className="h-px bg-white/[.055]" key={line} />
                ))}
              </div>
              <div className="absolute inset-x-[8%] bottom-[25%] h-20 rotate-[-4deg] rounded-[50%] border-t-2 border-white/[.07]" />
            </div>
            <div className="flex h-[265px] flex-col justify-between py-4 max-[600px]:h-[220px]">
              <SkeletonBlock className="h-3 w-12" />
              <SkeletonBlock className="h-3 w-12" />
              <SkeletonBlock className="h-3 w-12" />
            </div>
          </div>
        </article>

        <aside className="grid content-start gap-5 rounded-[23px] border border-[var(--line)] bg-white/[.018] p-5">
          {[0, 1, 2].map((item) => (
            <div className="border-b border-white/[.05] pb-5 last:border-0 last:pb-0" key={item}>
              <SkeletonBlock className="h-3 w-28" />
              <div className="mt-4 flex justify-between">
                <SkeletonBlock className="h-4 w-20" />
                <SkeletonBlock className="h-4 w-24" />
              </div>
              <SkeletonBlock className="mt-4 h-1.5 w-full rounded-full" />
            </div>
          ))}
        </aside>
      </section>

      <section className="mt-4 grid grid-cols-4 gap-3 max-[900px]:grid-cols-2 max-[500px]:grid-cols-1">
        {[0, 1, 2, 3].map((item) => (
          <article
            className="rounded-[16px] border border-[var(--line)] bg-white/[.018] p-4"
            key={item}
          >
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="mt-4 h-5 w-32" />
            <SkeletonBlock className="mt-3 h-3 w-20" />
          </article>
        ))}
      </section>

      <section className="mt-4 grid grid-cols-[minmax(0,1.5fr)_minmax(270px,.55fr)] gap-4 max-[850px]:grid-cols-1">
        <article className="rounded-[22px] border border-[var(--line)] bg-white/[.018] p-5">
          <SkeletonBlock className="h-3 w-32" />
          <SkeletonBlock className="mt-4 h-7 w-52" />
          <div className="mt-6 space-y-3">
            <SkeletonBlock className="h-3 w-full" />
            <SkeletonBlock className="h-3 w-[94%]" />
            <SkeletonBlock className="h-3 w-[98%]" />
            <SkeletonBlock className="h-3 w-[72%]" />
          </div>
        </article>
        <aside className="rounded-[22px] border border-[var(--line)] bg-white/[.018] p-5">
          <SkeletonBlock className="h-3 w-32" />
          <SkeletonBlock className="mt-5 h-11 w-full rounded-xl" />
          <SkeletonBlock className="mt-2 h-11 w-full rounded-xl" />
          <SkeletonBlock className="mt-6 h-3 w-24" />
          <div className="mt-3 flex gap-2">
            <SkeletonBlock className="h-7 w-20 rounded-full" />
            <SkeletonBlock className="h-7 w-24 rounded-full" />
          </div>
        </aside>
      </section>
    </main>
  );
}

export default function TokenDetail({ id }: { id: string }) {
  const [token, setToken] = useState<TokenDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<Range>("7D");
  const [watching, setWatching] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    apiRequest<{ success: true; data: { token: TokenDetailData } }>(
      `/api/tokens/${encodeURIComponent(id)}`,
    )
      .then((result) => result.data.token)
      .then((data) => active && setToken(data))
      .catch(
        (requestError) =>
          active &&
          setError(
            requestError instanceof Error ? requestError.message : "Token data is unavailable.",
          ),
      );
    return () => {
      active = false;
    };
  }, [id]);

  const visiblePrices = useMemo(() => {
    if (!token) return [];
    return range === "1D" ? token.sparkline.slice(-25) : token.sparkline;
  }, [range, token]);
  const chart = useMemo(() => buildChart(visiblePrices), [visiblePrices]);

  if (error)
    return (
      <main className="grid min-h-screen place-items-center px-5 pt-24 text-center">
        <div>
          <span className="text-[12px] font-bold tracking-[2px] text-rose-400">
            MARKET DATA ERROR
          </span>
          <h1 className="mt-3 text-3xl">Token unavailable</h1>
          <p className="text-sm text-red-300">{error}</p>
          <Link className="text-xs text-[#9c86ed]" href="/tokens">
            ← Back to tokens
          </Link>
        </div>
      </main>
    );
  if (!token) return <TokenDetailSkeleton />;

  const positive = token.change24h >= 0;
  const chartPositive = chart.change >= 0;
  const lineColor = chartPositive ? "#52dda0" : "#fb7185";
  const supplyPercent = token.totalSupply
    ? Math.min(100, (token.circulatingSupply / token.totalSupply) * 100)
    : 0;
  const athRecovery = token.ath ? Math.min(100, (token.price / token.ath) * 100) : 0;
  const updated = token.lastUpdated
    ? new Date(token.lastUpdated).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Recently";

  const share = async () => {
    await navigator.clipboard.writeText(window.location.href).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <main className="relative mx-auto w-[min(1180px,calc(100%_-_40px))] pb-5 pt-[100px] max-[600px]:w-[calc(100%_-_28px)] max-[600px]:pt-[112px]">
      <div className="pointer-events-none absolute -right-40 top-24 -z-10 h-[480px] w-[480px] rounded-full bg-[rgba(112,77,210,.1)] blur-[120px]" />

      <section className="glass relative overflow-hidden rounded-[27px] border border-[var(--line)] bg-[linear-gradient(125deg,rgba(16,19,38,.94),rgba(11,14,28,.9))] p-4 shadow-[0_28px_90px_rgba(0,0,0,.32),inset_0_1px_rgba(255,255,255,.045)] max-[600px]:p-5">
        <div className="absolute right-[-80px] top-[-120px] h-72 w-72 rounded-full bg-[rgba(126,95,255,.11)] blur-[70px]" />
        <div className="relative flex items-start justify-between gap-8 max-[700px]:flex-col">
          <div className="flex min-w-0 items-center gap-4">
            {token.image && (
              <span className="grid h-[74px] w-[74px] shrink-0 place-items-center rounded-[22px] border border-white/10 bg-white/[.035] shadow-[0_14px_35px_rgba(0,0,0,.3)]">
                <Image
                  className="h-14 w-14 rounded-full"
                  src={token.image}
                  width={56}
                  height={56}
                  alt={`${token.name} logo`}
                  priority
                />
              </span>
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[rgba(155,123,255,.2)] bg-[rgba(155,123,255,.08)] px-2.5 py-1 text-[12px] text-[#ac99f3]">
                  Rank #{token.rank ?? "—"}
                </span>
                <span className="rounded-full bg-white/[.045] px-2.5 py-1 text-[12px] text-[#788399]">
                  {token.symbol}
                </span>
              </div>
              <h1 className="m-0 truncate text-[clamp(38px,6vw,52px)] font-semibold tracking-[-3.5px]">
                {token.name}
              </h1>
              <p className="mb-0 text-[12px] text-[#606b80]">Last updated {updated}</p>
            </div>
          </div>
          <div className="shrink-0 text-right max-[700px]:w-full max-[700px]:text-left">
            <span className="text-[12px] uppercase tracking-[1px] text-[#657086]">
              Current price
            </span>
            <strong className="block text-[clamp(30px,4vw,44px)] tracking-[-1.7px]">
              {money(token.price)}
            </strong>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ${positive ? "bg-emerald-400/10 text-emerald-400" : "bg-rose-400/10 text-rose-400"}`}
            >
              {positive ? "↗" : "↘"} {positive ? "+" : ""}
              {token.change24h.toFixed(2)}% <small className="text-[12px] opacity-60">24h</small>
            </span>
          </div>
        </div>
        <div className="relative mt-3 flex flex-wrap gap-2 border-t border-white/[.055] pt-3">
          <button
            aria-pressed={watching}
            className={`inline-flex h-10 items-center gap-2 rounded-[11px] border px-4 text-[12px] font-semibold transition ${watching ? "border-[rgba(109,238,224,.28)] bg-[rgba(109,238,224,.08)] text-[var(--cyan)]" : "border-[var(--line)] bg-white/[.03] text-[#b8c0d0] hover:bg-white/[.07]"} cursor-pointer`}
            onClick={() => setWatching((value) => !value)}
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill={watching ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.5a.56.56 0 011.04 0l2.02 4.88a.56.56 0 00.47.34l5.27.42a.56.56 0 01.32.98l-4.02 3.44a.56.56 0 00-.18.55l1.23 5.14a.56.56 0 01-.84.61l-4.51-2.76a.56.56 0 00-.58 0l-4.51 2.76a.56.56 0 01-.84-.61l1.23-5.14a.56.56 0 00-.18-.55L3.4 10.12a.56.56 0 01.32-.98l5.27-.42a.56.56 0 00.47-.34l2.02-4.88z"
              />
            </svg>
            {watching ? "In watchlist" : "Add to watchlist"}
          </button>
          <button
            className="inline-flex h-10 items-center gap-2 rounded-[11px] border border-[var(--line)] bg-white/[.03] px-4 text-[12px] font-semibold text-[#b8c0d0] transition hover:bg-white/[.07] cursor-pointer"
            onClick={() => void share()}
          >
            {copied ? (
              <svg
                aria-hidden="true"
                className="h-4 w-4 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12.5l4 4L19 7" />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.59 13.51l6.83-3.98M8.59 10.49l6.83 3.98M18 8.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM6 14.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM18 20.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                />
              </svg>
            )}
            {copied ? "Copied" : "Share Token"}
          </button>
          {token.homepage && (
            <Link
              className="ml-auto inline-flex h-10 items-center rounded-[11px] bg-[linear-gradient(110deg,#8d6bff,#6849ea)] px-4 text-[12px] font-semibold shadow-[0_10px_25px_rgba(105,72,235,.24)] max-[500px]:ml-0"
              href={token.homepage}
              target="_blank"
              rel="noreferrer"
            >
              Official website
            </Link>
          )}
        </div>
      </section>

      <section className="mt-4 grid grid-cols-[minmax(0,1.65fr)_minmax(280px,.65fr)] gap-4 max-[900px]:grid-cols-1">
        <article className="rounded-[23px] border border-[var(--line)] bg-[rgba(255,255,255,.018)] p-5 shadow-[inset_0_1px_rgba(255,255,255,.03)] max-[600px]:p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[12px] uppercase tracking-[1px] text-white font-semibold">
                Price performance
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <strong
                  className={`text-lg ${chartPositive ? "text-emerald-400" : "text-rose-400"}`}
                >
                  {chartPositive ? "+" : ""}
                  {chart.change.toFixed(2)}%
                </strong>
                <span className="text-[12px] text-[#596479]">selected period</span>
              </div>
            </div>
            <div className="flex rounded-[10px] border border-[var(--line)] bg-black/10 p-1">
              {(["1D", "7D"] as Range[]).map((item) => (
                <button
                  className={`h-7 rounded-[7px] px-3 text-[12px] font-semibold transition ${range === item ? "bg-[rgba(155,123,255,.18)] text-white" : "text-[#626d82] hover:text-white"} cursor-pointer`}
                  key={item}
                  onClick={() => setRange(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5 grid grid-cols-[1fr_54px] gap-3">
            <div className="relative h-[265px] overflow-hidden rounded-[16px] bg-[linear-gradient(180deg,rgba(155,123,255,.035),transparent)] max-[600px]:h-[220px]">
              <div className="absolute inset-0 flex flex-col justify-between py-4">
                {[0, 1, 2, 3, 4].map((line) => (
                  <i className="h-px bg-white/[.04]" key={line} />
                ))}
              </div>
              <svg
                className="relative h-full w-full overflow-visible"
                viewBox="0 0 760 220"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="advanced-chart" x1="0" y1="0" x2="0" y2="1">
                    <stop stopColor={lineColor} stopOpacity=".28" />
                    <stop offset="1" stopColor={lineColor} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon points={`${chart.points} 760,220 0,220`} fill="url(#advanced-chart)" />
                <polyline
                  points={chart.points}
                  fill="none"
                  stroke={lineColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <div className="absolute inset-x-3 bottom-2 flex justify-between text-[12px] text-[#444f64]">
                <span>{range === "1D" ? "24h ago" : "7 days ago"}</span>
                <span>Now</span>
              </div>
            </div>
            <div className="flex h-[265px] flex-col justify-between py-4 text-right text-[12px] text-[#566176] max-[600px]:h-[220px]">
              <span>{money(chart.max)}</span>
              <span>{money((chart.max + chart.min) / 2)}</span>
              <span>{money(chart.min)}</span>
            </div>
          </div>
        </article>

        <aside className="grid content-start gap-3 rounded-[23px] border border-[var(--line)] bg-[rgba(255,255,255,.018)] p-5">
          <div>
            <span className="text-[12px] uppercase tracking-[1px] text-emerald-400 font-semibold">
              24h range
            </span>
            <div className="mt-3 flex items-end justify-between">
              <strong className="text-sm">{money(token.low24h)}</strong>
              <strong className="text-sm">{money(token.high24h)}</strong>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[.06]">
              <span
                className="block h-full rounded-full bg-[linear-gradient(90deg,#62d9c7,#8d6bff)]"
                style={{
                  width: `${Math.max(3, Math.min(100, ((token.price - token.low24h) / Math.max(1, token.high24h - token.low24h)) * 100))}%`,
                }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[12px] text-[#4e596e]">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
          <div className="my-1 h-px bg-white/[.05]" />
          <div>
            <span className="text-[12px] uppercase tracking-[1px] text-emerald-400 font-semibold">
              Supply released
            </span>
            <div className="mt-3 flex items-end justify-between">
              <strong className="text-sm">{supplyPercent.toFixed(1)}%</strong>
              <span className="text-[12px] text-[#596479]">
                {number(token.circulatingSupply)} / {number(token.totalSupply)}
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[.06]">
              <span
                className="block h-full rounded-full bg-[linear-gradient(90deg,#8d6bff,#b36cff)]"
                style={{ width: `${supplyPercent}%` }}
              />
            </div>
          </div>
          <div className="my-1 h-px bg-white/[.05]" />
          <div>
            <span className="text-[12px] uppercase tracking-[1px] text-emerald-400 font-semibold">
              ATH recovery
            </span>
            <div className="mt-3 flex items-end justify-between">
              <strong className="text-sm">{athRecovery.toFixed(1)}%</strong>
              <span className="text-[12px] text-rose-300">
                {token.athChange.toFixed(2)}% from ATH
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[.06]">
              <span
                className="block h-full rounded-full bg-[linear-gradient(90deg,#ef5f84,#a86cff)]"
                style={{ width: `${athRecovery}%` }}
              />
            </div>
          </div>
        </aside>
      </section>

      <section className="mt-4 grid grid-cols-4 gap-3 max-[900px]:grid-cols-2 max-[500px]:grid-cols-1">
        <Metric
          label="Market cap"
          value={money(token.marketCap, true)}
          note={`Rank #${token.rank ?? "—"}`}
        />
        <Metric
          label="24h volume"
          value={money(token.volume24h, true)}
          note={`${((token.volume24h / Math.max(1, token.marketCap)) * 100).toFixed(2)}% of market cap`}
        />
        <Metric
          label="Circulating supply"
          value={`${number(token.circulatingSupply)} ${token.symbol}`}
          note={fullNumber(token.circulatingSupply)}
        />
        <Metric
          label="All-time high"
          value={money(token.ath)}
          note={`${token.athChange.toFixed(2)}% below ATH`}
        />
      </section>

      <section className="mt-4 grid grid-cols-[minmax(0,1.5fr)_minmax(270px,.55fr)] gap-4 max-[850px]:grid-cols-1">
        <article className="rounded-[22px] border border-[var(--line)] bg-white/[.018] p-4">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <span className="text-[12px] uppercase tracking-[1px] text-emerald-400 font-semibold">
                Project overview
              </span>
              <h2 className="mb-0 mt-2 text-2xl tracking-[-.7px]">About {token.name}</h2>
            </div>
            {token.image && (
              <Image
                className="h-9 w-9 rounded-full opacity-60"
                src={token.image}
                width={36}
                height={36}
                alt=""
              />
            )}
          </div>
          <div
            className={`relative overflow-hidden transition-all ${showMore ? "max-h-[2000px]" : "max-h-[190px]"}`}
          >
            <p className="m-0 text-[12px] leading-7 text-[#7d889c]">
              {token.description || "No project description is currently available."}
            </p>
            {!showMore && token.description.length > 500 && (
              <div className="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(transparent,#080b16)]" />
            )}
          </div>
          {token.description.length > 500 && (
            <button
              className="mt-4 cursor-pointer text-[12px] font-semibold text-[#9d88ef] hover:text-white"
              onClick={() => setShowMore((value) => !value)}
            >
              {showMore ? "Show less ↑" : "Read Full Overview ↓"}
            </button>
          )}
        </article>
        <aside className="rounded-[22px] border border-[var(--line)] bg-white/[.018] p-5">
          <span className="text-[12px] uppercase tracking-[1px] text-emerald-400 font-semibold">
            Official resources
          </span>
          <div className="mt-4 flex flex-col gap-2">
            {token.homepage && (
              <a
                className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-white/[.025] p-3 text-[12px] transition hover:border-[rgba(155,123,255,.3)] hover:bg-white/[.06]"
                href={token.homepage}
                target="_blank"
                rel="noreferrer"
              >
                <span>Website</span>
                <span className="text-[#8d78df]">↗</span>
              </a>
            )}
            {token.explorer && (
              <a
                className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-white/[.025] p-3 text-[12px] transition hover:border-[rgba(155,123,255,.3)] hover:bg-white/[.06]"
                href={token.explorer}
                target="_blank"
                rel="noreferrer"
              >
                <span>Block explorer</span>
                <span className="text-[#8d78df]">↗</span>
              </a>
            )}
          </div>
          {token.categories.length > 0 && (
            <div className="mt-6">
              <span className="text-[12px] uppercase tracking-[1px] text-emerald-400 font-semibold">
                Categories
              </span>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {token.categories.map((category) => (
                  <span
                    className="rounded-full border border-[rgba(155,123,255,.14)] bg-[rgba(155,123,255,.07)] px-2 py-1.5 text-[12px] text-[#a995ec]"
                    key={category}
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
