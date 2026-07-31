"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Token = {
  id: string;
  name: string;
  symbol: string;
  image?: string;
  price: number;
  marketCap: number;
  change24h: number;
  sparkline: number[];
  lastUpdated?: string;
};

const fallbackTokens: Token[] = [
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    price: 0,
    marketCap: 310_100_000_000,
    change24h: 3.9,
    sparkline: [20, 22, 21, 27, 26, 35],
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    price: 0,
    marketCap: 84_600_000_000,
    change24h: 8.5,
    sparkline: [16, 22, 28, 35, 33, 31],
  },
  {
    id: "binancecoin",
    name: "BNB",
    symbol: "BNB",
    price: 0,
    marketCap: 92_400_000_000,
    change24h: 1.7,
    sparkline: [18, 17, 20, 19, 27, 29],
  },
  {
    id: "chainlink",
    name: "Chainlink",
    symbol: "LINK",
    price: 0,
    marketCap: 10_800_000_000,
    change24h: 11.2,
    sparkline: [10, 15, 17, 22, 25, 34],
  },
  {
    id: "avalanche-2",
    name: "Avalanche",
    symbol: "AVAX",
    price: 0,
    marketCap: 14_200_000_000,
    change24h: 3.3,
    sparkline: [24, 13, 17, 31, 36, 29],
  },
  {
    id: "polygon-ecosystem-token",
    name: "Polygon",
    symbol: "POL",
    price: 0,
    marketCap: 4_100_000_000,
    change24h: 6.8,
    sparkline: [15, 12, 22, 20, 31, 29],
  },
];

const colors: Record<string, string> = {
  ETH: "#8b7cff",
  SOL: "#59e2cf",
  BNB: "#f5ba41",
  LINK: "#4e80ff",
  AVAX: "#ef5967",
  POL: "#a77bff",
};

function compactCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function priceLabel(value: number) {
  if (!value) return "Price unavailable";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 1 ? 4 : 2,
  }).format(value);
}

function chartPoints(prices: number[]) {
  if (prices.length < 2) return "0,34 60,8";
  const sampleCount = Math.min(18, prices.length);
  const sampled = Array.from(
    { length: sampleCount },
    (_, index) => prices[Math.round((index * (prices.length - 1)) / (sampleCount - 1))],
  );
  const min = Math.min(...sampled);
  const max = Math.max(...sampled);
  const range = max - min || 1;
  return sampled
    .map(
      (price, index) => `${(index / (sampleCount - 1)) * 60},${38 - ((price - min) / range) * 32}`,
    )
    .join(" ");
}

function TokenCardSkeleton() {
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

export default function TrendingTokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/tokens")
      .then((response) => {
        if (!response.ok) throw new Error("Market request failed");
        return response.json() as Promise<{ tokens: Token[] }>;
      })
      .then((data) => {
        if (active && data.tokens.length) {
          setTokens(data.tokens);
        }
      })
      .catch(() => {
        if (active) setTokens(fallbackTokens);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      className="relative bg-[linear-gradient(180deg,rgba(255,255,255,.012),rgba(112,77,210,.025))] py-[52px] max-[600px]:py-[68px]"
      id="tokens"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-[60%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(126,95,255,.1),transparent_68%)]" />
      <div className="page-shell relative mx-auto w-[min(1180px,calc(100%_-_40px))] max-[600px]:w-[calc(100%_-_28px)]">
        <div className="mb-7 flex items-end justify-between gap-5 max-[600px]:items-start">
          <div>
            <span className="text-[12px] font-bold tracking-[2px] text-[var(--cyan)]">
              MARKET PULSE
            </span>
            <h2 className="mb-1 mt-2 text-[clamp(29px,4vw,40px)] font-semibold tracking-[-1.8px]">
              Trending tokens
            </h2>
            <p className="m-0 text-[12px] text-[#6f7a8f]">
              Live prices and seven-day momentum across the market.
            </p>
          </div>
          <Link
            href="/tokens"
            className="group flex items-center gap-1.5 text-[12px] font-semibold text-white"
          >
            <span>All Tokens</span>
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
        <div className="grid grid-cols-3 gap-3 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
          {loading
            ? Array.from({ length: 6 }, (_, index) => <TokenCardSkeleton key={index} />)
            : tokens.map((token) => {
                const color = colors[token.symbol] ?? "#8b7cff";
                const points = chartPoints(token.sparkline);
                const positive = token.change24h >= 0;
                return (
                  <Link
                    href={`/token/${token.id}`}
                    className="group flex min-h-[50px] items-center gap-3.5 overflow-hidden rounded-[17px] border border-[var(--line)] bg-[linear-gradient(120deg,rgba(255,255,255,.035),rgba(155,123,255,.025))] p-2 shadow-[inset_0_1px_rgba(255,255,255,.035),0_14px_35px_rgba(0,0,0,.16)] transition hover:-translate-y-1 hover:border-[rgba(155,123,255,.32)]"
                    key={token.id}
                    title={`${token.name}: ${priceLabel(token.price)}`}
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-[30px] border border-white/10 bg-[#111522] shadow-[0_9px_22px_rgba(0,0,0,.24)]">
                      {token.image ? (
                        <Image
                          src={token.image}
                          alt={`${token.name} logo`}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <strong className="text-[12px]">{token.symbol}</strong>
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <strong className="truncate text-sm font-semibold text-[#edf0f8]">
                          {token.name}
                        </strong>
                      </div>
                      <small className="mt-1 block truncate text-[12px] text-[#7c879b]">
                        {priceLabel(token.price)}
                      </small>
                      <div className="mt-1.5 flex items-center gap-2 text-[12px]">
                        <span className="text-[#7c879b]">{compactCurrency(token.marketCap)}</span>
                        <span
                          className={
                            positive
                              ? "font-semibold text-[#50d98b]"
                              : "font-semibold text-[#ff6f81]"
                          }
                        >
                          {positive ? "+" : ""}
                          {token.change24h.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    <svg
                      className="h-11 w-[66px] shrink-0 overflow-visible"
                      viewBox="0 0 60 42"
                      fill="none"
                      aria-label={`${token.name} seven-day trend`}
                    >
                      <defs>
                        <linearGradient
                          id={`token-gradient-${token.symbol}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop stopColor={color} stopOpacity=".22" />
                          <stop offset="1" stopColor={color} stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <polygon
                        points={`${points} 60,42 0,42`}
                        fill={`url(#token-gradient-${token.symbol})`}
                      />
                      <polyline
                        points={points}
                        stroke={color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                );
              })}
        </div>
      </div>
    </section>
  );
}
