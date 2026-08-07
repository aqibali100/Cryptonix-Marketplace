"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "../../lib/api";

type Token = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  price: number;
  marketCap: number;
  change24h: number;
  rank: number | null;
};

type TokensResponse = {
  success: true;
  data: { tokens: Token[] };
  meta: {
    pagination: { page: number; limit: number; hasMore: boolean; total?: number };
    cache: "HIT" | "MISS" | "STALE";
  };
};

function money(value: number, compact = false) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: value < 1 ? 5 : 2,
  }).format(value);
}

function TokensTableSkeleton() {
  return Array.from({ length: 50 }, (_, index) => (
    <div
      aria-hidden="true"
      className="grid min-h-[60px] animate-pulse grid-cols-[52px_minmax(220px,1.6fr)_minmax(120px,.8fr)_100px_minmax(130px,.8fr)] items-center gap-4 border-b border-white/[.045] px-5 last:border-0 max-[700px]:grid-cols-[36px_minmax(0,1fr)_minmax(90px,.65fr)] max-[700px]:gap-3 max-[700px]:px-3 max-[400px]:grid-cols-[26px_minmax(0,1fr)_82px] max-[400px]:gap-2 max-[400px]:px-2"
      key={index}
    >
      <span className="mx-auto h-3 w-4 rounded bg-white/[.07]" />
      <span className="flex min-w-0 items-center gap-3">
        <span className="h-10 w-10 shrink-0 rounded-full bg-white/[.08]" />
        <span className="min-w-0 flex-1">
          <span className="block h-3 w-28 max-w-[75%] rounded bg-white/[.09]" />
          <span className="mt-2 block h-2.5 w-12 rounded bg-white/[.055]" />
        </span>
      </span>
      <span className="h-3 w-20 rounded bg-white/[.075]" />
      <span className="h-3 w-12 rounded bg-white/[.065] max-[700px]:hidden" />
      <span className="h-3 w-20 rounded bg-white/[.065] max-[700px]:hidden" />
    </div>
  ));
}

export default function TokensDirectory() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(
      async () => {
        setLoading(true);
        setError(null);
        try {
          const params = new URLSearchParams({ mode: "all", page: String(page) });
          if (query.trim()) params.set("search", query.trim());
          const result = await apiRequest<TokensResponse>(`/api/tokens?${params}`, {
            signal: controller.signal,
          });
          setTokens(result.data.tokens);
          setHasMore(result.meta.pagination.hasMore);
          setTotal(result.meta.pagination.total ?? null);
        } catch (requestError) {
          if (requestError instanceof DOMException && requestError.name === "AbortError") return;
          setError(requestError instanceof Error ? requestError.message : "Could not load tokens.");
        } finally {
          if (!controller.signal.aborted) setLoading(false);
        }
      },
      query.trim() ? 400 : 0,
    );

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [page, query]);

  return (
    <>
      <div className="mb-5 flex items-center justify-end gap-4 max-[600px]:items-stretch max-[600px]:flex-col">
        <label className="flex h-12 w-[min(390px,100%)] items-center gap-3 rounded-[14px] border border-[var(--line)] bg-white/[.03] px-4 transition focus-within:border-[rgba(155,123,255,.4)]">
          <span className="sr-only">Search all tokens</span>
          <input
            className="min-w-0 flex-1 border-0 bg-transparent text-sm text-white outline-none placeholder:text-[#535d72]"
            placeholder="Search All Tokens…"
            value={query}
            onChange={(event) => {
              setLoading(true);
              setQuery(event.target.value);
              setPage(1);
            }}
          />
          <span className="text-[#7e889d]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </span>
        </label>
      </div>
      <div className="overflow-hidden rounded-[20px] border border-[var(--line)] bg-[rgba(255,255,255,.018)] shadow-[0_20px_55px_rgba(0,0,0,.16)]">
        <div className="grid grid-cols-[52px_minmax(220px,1.6fr)_minmax(120px,.8fr)_100px_minmax(130px,.8fr)] items-center gap-4 border-b border-[var(--line)] bg-white/[.018] px-5 py-4 text-[12px] font-semibold uppercase tracking-[1px] text-[#aeb7c8] max-[700px]:grid-cols-[36px_minmax(0,1fr)_minmax(90px,.65fr)] max-[700px]:gap-3 max-[700px]:px-3 max-[400px]:grid-cols-[26px_minmax(0,1fr)_82px] max-[400px]:gap-2 max-[400px]:px-2">
          <span className="text-center">#</span>
          <span>Token</span>
          <span>Price</span>
          <span className="max-[700px]:hidden">24h</span>
          <span className="max-[700px]:hidden">Market cap</span>
        </div>
        {loading && <TokensTableSkeleton />}
        {!loading &&
          tokens.map((token, index) => {
            const positive = token.change24h >= 0;
            return (
              <Link
                href={`/token/${token.id}`}
                className="grid min-h-[60px] grid-cols-[52px_minmax(220px,1.6fr)_minmax(120px,.8fr)_100px_minmax(130px,.8fr)] items-center gap-4 border-b border-white/[.045] px-5 transition last:border-0 hover:bg-[linear-gradient(90deg,rgba(155,123,255,.075),rgba(74,221,209,.025))] max-[700px]:grid-cols-[36px_minmax(0,1fr)_minmax(90px,.65fr)] max-[700px]:gap-3 max-[700px]:px-3 max-[400px]:grid-cols-[26px_minmax(0,1fr)_82px] max-[400px]:gap-2 max-[400px]:px-2"
                key={token.id}
              >
                <span className="text-center text-[12px] tabular-nums text-[#626d82]">
                  {token.rank ?? (page - 1) * (query.trim() ? 20 : 50) + index + 1}
                </span>
                <span className="flex min-w-0 items-center gap-3">
                  <Image
                    className="h-10 w-10 shrink-0 rounded-full bg-white/[.04]"
                    src={token.image}
                    width={40}
                    height={40}
                    alt={`${token.name} logo`}
                  />
                  <span className="min-w-0">
                    <strong className="block truncate text-[13px] font-semibold text-[#e8ebf3]">
                      {token.name}
                    </strong>
                    <small className="mt-1 block uppercase text-[12px] text-[#667187]">
                      {token.symbol}
                    </small>
                  </span>
                </span>
                <span className="truncate text-[13px] font-medium tabular-nums text-[#dce1eb]">
                  {money(token.price)}
                </span>
                <span
                  className={`text-[12px] font-semibold tabular-nums max-[700px]:hidden ${positive ? "text-emerald-400" : "text-rose-400"}`}
                >
                  {positive ? "+" : ""}
                  {token.change24h.toFixed(2)}%
                </span>
                <span className="text-[12px] tabular-nums text-[#9ca5b6] max-[700px]:hidden">
                  {money(token.marketCap, true)}
                </span>
              </Link>
            );
          })}
        {!loading && tokens.length === 0 && (
          <div className="p-10 text-center text-xs text-[#687388]">
            {query.trim() ? `No token found for “${query.trim()}”.` : "No tokens available."}
          </div>
        )}
      </div>
      {error && <p className="mt-4 text-center text-xs text-red-300">{error}</p>}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          className="h-11 cursor-pointer rounded-[13px] border border-[var(--line)] bg-white/[.025] px-5 text-xs font-semibold transition hover:bg-white/[.06] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={loading || page === 1}
          onClick={() => {
            setLoading(true);
            setPage((current) => Math.max(1, current - 1));
          }}
        >
          Previous
        </button>
        <span className="min-w-24 text-center text-xs text-[#8e98ab]">
          Page {page}
          {total !== null ? ` of ${Math.max(1, Math.ceil(total / 20))}` : ""}
        </span>
        <button
          className="h-11 cursor-pointer rounded-[13px] border border-[rgba(155,123,255,.28)] bg-[rgba(155,123,255,.08)] px-5 text-xs font-semibold transition hover:bg-[rgba(155,123,255,.15)] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={loading || !hasMore}
          onClick={() => {
            setLoading(true);
            setPage((current) => current + 1);
          }}
        >
          Next
        </button>
      </div>
    </>
  );
}
