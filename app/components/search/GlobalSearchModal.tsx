"use client";

/* eslint-disable @next/next/no-img-element */

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { formatEther } from "viem";
import { API_URL, apiRequest } from "../../lib/api";

type SearchResponse = {
  success: true;
  data: {
    query: string;
    results: {
      nfts: Array<{
        id: string;
        name: string;
        category: string;
        priceWei: string;
        imageUrl: string;
        creator: string;
      }>;
      collections: Array<{
        id: string;
        name: string;
        slug: string;
        isVerified: boolean;
        bannerUrl: string;
        creator: string;
      }>;
      creators: Array<{ username: string; displayName: string; profileImage: string }>;
      tokens: Array<{
        id: string;
        name: string;
        symbol: string;
        image: string;
        price: number;
        change24h: number;
      }>;
    };
  };
};

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function price(value: string) {
  try {
    return `${Number(formatEther(BigInt(value || "0"))).toLocaleString(undefined, { maximumFractionDigits: 4 })} ETH`;
  } catch {
    return "0 ETH";
  }
}

function ResultImage({ src, alt, fallback }: { src: string; alt: string; fallback: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-[11px] border border-white/[.07] bg-gradient-to-br from-violet-500/20 to-cyan-400/10 text-[10px] font-bold text-violet-200">
      {src && !failed ? (
        <img
          src={src.startsWith("http") ? src : `${API_URL}${src}`}
          alt={alt}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        fallback
      )}
    </span>
  );
}

export default function GlobalSearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 280);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, onClose]);

  const search = useQuery({
    queryKey: ["global-search", debouncedQuery],
    queryFn: () =>
      apiRequest<SearchResponse>(`/api/search?q=${encodeURIComponent(debouncedQuery)}`),
    enabled: open && debouncedQuery.length >= 2,
    staleTime: 30_000,
  });
  if (!open || typeof document === "undefined") return null;
  const results = search.data?.data.results;
  const total = results
    ? results.nfts.length +
      results.collections.length +
      results.creators.length +
      results.tokens.length
    : 0;
  const resultClass =
    "group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition hover:border-white/[.06] hover:bg-white/[.045]";

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-start justify-center bg-[#03050dc7] px-4 pt-[2vh] backdrop-blur-md">
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Search Cryptonix"
        className="w-full max-w-[680px] overflow-hidden rounded-[24px] border border-violet-400/20 bg-[#090d1cf5] shadow-[0_35px_110px_rgba(0,0,0,.68),inset_0_1px_rgba(255,255,255,.05)]"
      >
        <div className="flex h-16 items-center gap-3 border-b border-white/[.07] px-5">
          <SearchIcon />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search NFTs, collections, creators, or tokens…"
            aria-label="Global search"
            className="min-w-0 flex-1 border-0 bg-transparent text-[14px] text-white outline-none placeholder:text-[#7f899d]"
          />
          <kbd className="rounded-lg border border-white/[.09] bg-white/[.04] px-2 py-1 text-[10px] text-[#929bad] max-[520px]:hidden">
            ESC
          </kbd>
          <button
            type="button"
            aria-label="Close search"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-xl border border-white/[.08] bg-white/[.035] text-[#7d879a] transition hover:border-rose-400/25 hover:bg-rose-400/[.06] hover:text-white"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              className="h-4 w-4"
            >
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <div className="max-h-[min(650px,72vh)] overflow-y-auto p-3 [scrollbar-color:#4f4378_transparent] [scrollbar-width:thin]">
          {query.trim().length < 2 ? (
            <div className="grid min-h-56 place-items-center text-center">
              <div>
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-violet-400/[.08] text-violet-300">
                  <SearchIcon />
                </span>
                <p className="mb-0 mt-4 text-[13px] font-medium text-[#a4adbd]">
                  Enter at least 2 characters to search Cryptonix.
                </p>
              </div>
            </div>
          ) : search.isPending ? (
            <div className="grid gap-2 py-2">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="flex animate-pulse items-center gap-3 rounded-xl p-3">
                  <span className="h-10 w-10 rounded-xl bg-white/[.055]" />
                  <span className="h-3 w-40 rounded bg-white/[.06]" />
                </div>
              ))}
            </div>
          ) : search.isError ? (
            <div className="grid min-h-52 place-items-center text-center">
              <div>
                <p className="text-[12px] text-rose-300">Search is temporarily unavailable.</p>
                <button
                  type="button"
                  onClick={() => search.refetch()}
                  className="user-primary-action mt-3"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : total === 0 ? (
            <div className="grid min-h-56 place-items-center text-center">
              <div>
                <p className="text-sm font-semibold">No results found</p>
                <span className="mt-1 block text-[12px] text-[#929bad]">
                  Try another NFT, creator, collection, or token name.
                </span>
              </div>
            </div>
          ) : (
            <div className="grid gap-3">
              {results && results.nfts.length > 0 && (
                <div>
                  <h2 className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[1.5px] text-[#919bad]">
                    NFTs
                  </h2>
                  {results.nfts.map((item) => (
                    <Link
                      key={item.id}
                      href={`/nft/${item.id}`}
                      onClick={onClose}
                      className={resultClass}
                    >
                      <ResultImage src={item.imageUrl} alt="" fallback="NFT" />
                      <span className="min-w-0 flex-1">
                        <strong className="block truncate text-[12px]">{item.name}</strong>
                        <small className="mt-1 block truncate text-[10px] text-[#8993a7]">
                          @{item.creator} · {item.category}
                        </small>
                      </span>
                      <span className="text-[10px] font-semibold text-cyan-300">
                        {price(item.priceWei)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
              {results && results.collections.length > 0 && (
                <div>
                  <h2 className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[1.5px] text-[#919bad]">
                    Collections
                  </h2>
                  {results.collections.map((item) => (
                    <Link
                      key={item.id}
                      href={`/marketplace?search=${encodeURIComponent(item.slug)}`}
                      onClick={onClose}
                      className={resultClass}
                    >
                      <ResultImage src={item.bannerUrl} alt="" fallback="COL" />
                      <span className="min-w-0 flex-1">
                        <strong className="block truncate text-[12px]">
                          {item.name}
                          {item.isVerified && <span className="ml-1 text-violet-300">✓</span>}
                        </strong>
                        <small className="mt-1 block truncate text-[10px] text-[#8993a7]">
                          by @{item.creator}
                        </small>
                      </span>
                      <span className="text-[10px] font-medium text-[#8993a7]">Collection</span>
                    </Link>
                  ))}
                </div>
              )}
              {results && results.creators.length > 0 && (
                <div>
                  <h2 className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[1.5px] text-[#919bad]">
                    Creators
                  </h2>
                  {results.creators.map((item) => (
                    <Link
                      key={item.username}
                      href={`/profile/${encodeURIComponent(item.username)}`}
                      onClick={onClose}
                      className={resultClass}
                    >
                      <ResultImage
                        src={item.profileImage}
                        alt=""
                        fallback={item.username.slice(0, 2).toUpperCase()}
                      />
                      <span className="min-w-0 flex-1">
                        <strong className="block truncate text-[12px]">{item.displayName}</strong>
                        <small className="mt-1 block text-[10px] text-[#8993a7]">
                          @{item.username}
                        </small>
                      </span>
                      <span className="text-[10px] text-violet-300">Creator</span>
                    </Link>
                  ))}
                </div>
              )}
              {results && results.tokens.length > 0 && (
                <div>
                  <h2 className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[1.5px] text-[#919bad]">
                    Tokens
                  </h2>
                  {results.tokens.map((item) => (
                    <Link
                      key={item.id}
                      href={`/token/${item.id}`}
                      onClick={onClose}
                      className={resultClass}
                    >
                      <ResultImage src={item.image} alt="" fallback={item.symbol.slice(0, 2)} />
                      <span className="min-w-0 flex-1">
                        <strong className="block truncate text-[12px]">{item.name}</strong>
                        <small className="mt-1 block text-[10px] text-[#8993a7]">
                          {item.symbol}
                        </small>
                      </span>
                      <span
                        className={`text-[10px] font-semibold ${item.change24h >= 0 ? "text-emerald-300" : "text-rose-300"}`}
                      >
                        {item.change24h >= 0 ? "+" : ""}
                        {item.change24h.toFixed(2)}%
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <footer className="flex items-center justify-between border-t border-white/[.07] px-5 py-3 text-[10px] font-medium text-[#7f899d]">
          <span>Search across the Cryptonix marketplace</span>
          <span>
            <kbd className="rounded border border-white/[.07] px-1.5 py-0.5">⌘</kbd> +{" "}
            <kbd className="rounded border border-white/[.07] px-1.5 py-0.5">K</kbd>
          </span>
        </footer>
      </section>
    </div>,
    document.body,
  );
}
