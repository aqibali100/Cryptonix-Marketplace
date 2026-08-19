"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { formatEther, parseEther } from "viem";
import PageBreadcrumb from "../../components/layout/PageBreadcrumb";
import { API_URL, apiRequest } from "../../lib/api";
import FavoriteButton from "../../components/nfts/FavoriteButton";

const categories = ["All assets", "Art", "Collectibles", "Gaming", "Photography", "Music"];
const chains = [
  { value: "", label: "All chains" },
  { value: "11155111", label: "Ethereum" },
  { value: "84532", label: "Base" },
  { value: "80002", label: "Polygon" },
];
const chainNames: Record<number, string> = { 11155111: "ETH", 84532: "BASE", 80002: "POLY" };
const sortOptions = [
  { value: "newest", label: "Recently listed" },
  { value: "oldest", label: "Oldest first" },
  { value: "popular", label: "Most liked" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];
const saleOptions = [
  { value: "", label: "All listings" },
  { value: "AUCTION", label: "Live auction" },
  { value: "FIXED", label: "Fixed price" },
  { value: "MINT_ONLY", label: "Not listed" },
];

type MarketplaceNft = {
  id: string;
  name: string;
  category: string;
  collectionSlug: string;
  chainId: number;
  saleType: "MINT_ONLY" | "FIXED" | "AUCTION";
  priceWei: string;
  auctionEndsAt: string | null;
  likes: number;
  isFavorited: boolean;
  mintedAt: string | null;
  imageUrl: string;
  creator: { username: string; profileImage: string; verified: boolean };
};
type MarketplaceResponse = {
  success: true;
  data: {
    items: MarketplaceNft[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    stats: { allAssets: number; liveAuctions: number };
  };
};
type Filters = { chainId: string; saleType: string; minPrice: string; maxPrice: string };
const emptyFilters: Filters = { chainId: "", saleType: "", minPrice: "", maxPrice: "" };

function MarketplaceDropdown({
  label,
  value,
  options,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("keydown", closeEscape);
    return () => {
      document.removeEventListener("mousedown", closeOutside);
      document.removeEventListener("keydown", closeEscape);
    };
  }, [open]);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`group flex h-11 w-full cursor-pointer items-center gap-2 rounded-xl border px-3 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-[#8d6bff]/40 ${
          open || value
            ? "border-[rgba(155,123,255,.3)] bg-[linear-gradient(110deg,rgba(141,107,255,.11),rgba(74,221,209,.025))]"
            : "border-[var(--line)] bg-white/[.025] hover:border-[rgba(155,123,255,.24)] hover:bg-white/[.045]"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
            value ? "bg-[#9b7cf5] shadow-[0_0_8px_rgba(155,124,245,.65)]" : "bg-[#465166]"
          }`}
        />
        <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-[#aeb7c8]">
          {selected.label}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`h-3.5 w-3.5 shrink-0 text-[#657087] transition ${
            open ? "rotate-180 text-[#aa95f6]" : "group-hover:text-[#9da8ba]"
          }`}
        >
          <path d="m7 10 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div
          role="listbox"
          aria-label={label}
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-max min-w-full max-w-[240px] overflow-hidden rounded-[16px] border border-[rgba(155,123,255,.24)] bg-[rgba(8,11,23,.98)] p-2 shadow-[0_22px_60px_rgba(0,0,0,.55),inset_0_1px_rgba(255,255,255,.04)] backdrop-blur-2xl"
        >
          <div className="max-h-[245px] space-y-1 overflow-y-auto [scrollbar-color:#4f4378_transparent] [scrollbar-width:thin]">
            {options.map((option) => {
              const active = option.value === value;
              return (
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full cursor-pointer items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left text-[10px] transition ${
                    active
                      ? "border-[rgba(155,123,255,.2)] bg-[rgba(155,123,255,.1)] text-[#d8ceff]"
                      : "border-transparent text-[#aab3c4] hover:border-white/[.05] hover:bg-white/[.045] hover:text-white"
                  }`}
                >
                  <span
                    className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border text-[9px] ${
                      active ? "border-[#8d6bff] bg-[#8d6bff] text-white" : "border-[#3f485b]"
                    }`}
                  >
                    {active && (
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-2.5 w-2.5"
                      >
                        <path d="m5 12 4 4 10-10" />
                      </svg>
                    )}
                  </span>
                  <span className="truncate">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Icon({
  name,
  className = "h-4 w-4",
}: {
  name: "search" | "filter" | "image" | "heart" | "verified" | "left" | "right" | "grid" | "list";
  className?: string;
}) {
  const paths = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
    filter: (
      <>
        <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
        <circle cx="16" cy="7" r="2" />
        <circle cx="8" cy="17" r="2" />
      </>
    ),
    image: (
      <>
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l8.9 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8Z" />
    ),
    verified: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12 2.2 2.2 4.8-5" />
      </>
    ),
    left: <path d="m15 18-6-6 6-6" />,
    right: <path d="m9 18 6-6-6-6" />,
    grid: (
      <>
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
      </>
    ),
    list: (
      <>
        <path d="M9 6h11M9 12h11M9 18h11" />
        <circle cx="5" cy="6" r="1" fill="currentColor" stroke="none" />
        <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="5" cy="18" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  };
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}

function formatPrice(value: string) {
  try {
    return `${Number(formatEther(BigInt(value || "0"))).toLocaleString(undefined, { maximumFractionDigits: 4 })} ETH`;
  } catch {
    return "0 ETH";
  }
}
function toWei(value: string) {
  if (!value.trim()) return "";
  try {
    return parseEther(value.trim()).toString();
  } catch {
    return "";
  }
}
function auctionTime(value: string | null) {
  if (!value) return null;
  const milliseconds = new Date(value).getTime() - Date.now();
  if (milliseconds <= 0) return "Ended";
  const hours = Math.floor(milliseconds / 3_600_000);
  const days = Math.floor(hours / 24);
  return days
    ? `${days}d ${hours % 24}h`
    : `${hours}h ${Math.floor((milliseconds % 3_600_000) / 60_000)}m`;
}

function paginationItems(current: number, total: number): Array<number | "left-gap" | "right-gap"> {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "right-gap", total];
  if (current >= total - 3) {
    return [1, "left-gap", total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, "left-gap", current - 1, current, current + 1, "right-gap", total];
}

function Artwork({ nft }: { nft: MarketplaceNft }) {
  const [failed, setFailed] = useState(false);
  const source = nft.imageUrl.startsWith("http") ? nft.imageUrl : `${API_URL}${nft.imageUrl}`;
  return failed ? (
    <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_50%_35%,#273153,#11162c_70%)] text-[#657087]">
      <div className="grid justify-items-center gap-2">
        <Icon name="image" className="h-9 w-9" />
        <span className="text-[11px]">Artwork unavailable</span>
      </div>
    </div>
  ) : (
    // Dynamic NFT media resolves through a signed API redirect.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={source}
      alt={`${nft.name} artwork`}
      onError={() => setFailed(true)}
      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
    />
  );
}

function CardSkeleton({ view }: { view: "grid" | "list" }) {
  return (
    <div
      aria-hidden="true"
      className={`overflow-hidden rounded-[21px] border border-[var(--line)] bg-[var(--surface)] ${view === "list" ? "flex min-h-[170px] max-[560px]:min-h-[132px]" : ""}`}
    >
      <div
        className={`${view === "list" ? "h-auto w-[250px] shrink-0 max-[560px]:w-[112px]" : "h-[225px]"} animate-pulse bg-white/[.045]`}
      />
      <div className="flex-1 animate-pulse p-3">
        <span className="block h-3 w-24 rounded bg-white/[.06]" />
        <span className="mt-4 block h-4 w-40 rounded bg-white/[.08]" />
        <span className="mt-5 block h-px bg-white/[.06]" />
        <span className="mt-4 block h-3 w-20 rounded bg-cyan-300/[.08]" />
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  const [query, setQuery] = useState("");
  const search = useDeferredValue(query.trim());
  const [category, setCategory] = useState("All assets");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<Filters>(emptyFilters);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const invalidPriceRange = Boolean(
    draftFilters.minPrice &&
    draftFilters.maxPrice &&
    Number(draftFilters.minPrice) > Number(draftFilters.maxPrice),
  );

  const requestPath = useMemo(() => {
    const params = new URLSearchParams({ page: String(page), limit: "9", sort });
    if (search) params.set("search", search);
    if (category !== "All assets") params.set("category", category);
    if (filters.chainId) params.set("chainId", filters.chainId);
    if (filters.saleType) params.set("saleType", filters.saleType);
    if (toWei(filters.minPrice)) params.set("minPriceWei", toWei(filters.minPrice));
    if (toWei(filters.maxPrice)) params.set("maxPriceWei", toWei(filters.maxPrice));
    return `/api/nfts?${params}`;
  }, [page, search, category, filters, sort]);
  const { data, isPending, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["marketplace", requestPath],
    queryFn: () => apiRequest<MarketplaceResponse>(requestPath),
    staleTime: 30_000,
    placeholderData: (previous) => previous,
  });
  const result = data?.data;
  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const clearAll = () => {
    setQuery("");
    setCategory("All assets");
    setDraftFilters(emptyFilters);
    setFilters(emptyFilters);
    setPage(1);
  };

  return (
    <main className="relative min-h-screen overflow-hidden pb-[10px] pt-[118px] max-[600px]:pt-[100px]">
      <div className="pointer-events-none absolute left-[60%] top-20 z-[-1] h-[280px] w-[420px] rounded-full bg-[rgba(108,74,224,.13)] blur-[100px]" />
      <section className="mx-auto w-[min(1180px,calc(100%-40px))] max-[600px]:w-[min(100%-28px,1180px)]">
        <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Marketplace" }]} />
        <div className="flex items-end justify-between gap-12 pb-12 max-[900px]:flex-col max-[900px]:items-start">
          <div>
            <span className="text-[12px] font-bold tracking-[2px] text-[var(--cyan)]">
              EXPLORE THE EXTRAORDINARY
            </span>
            <h1 className="m-0 mt-3 max-w-[760px] text-[clamp(46px,6.1vw,74px)] font-semibold leading-[.99] tracking-[-4.6px]">
              Discover digital{" "}
              <span className="bg-gradient-to-r from-[#b49dff] to-[#6deee0] bg-clip-text text-transparent">
                masterpieces.
              </span>
            </h1>
            <p className="mt-5 max-w-[660px] text-[15px] leading-7 text-[var(--muted)]">
              Explore minted assets from verified creators across supported chains.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-4 rounded-[17px] border border-[var(--line)] bg-[var(--surface)] px-5 py-4 shadow-[0_24px_80px_rgba(0,0,0,.28)]">
            <i className="h-2 w-2 rounded-full bg-[#59e5be] shadow-[0_0_10px_#59e5be]" />
            <div>
              <strong className="block text-[13px]">{result?.stats.liveAuctions ?? "—"}</strong>
              <span className="text-[12px] text-[#747f96]">Live auctions</span>
            </div>
            <i className="h-7 w-px bg-[var(--line)]" />
            <div>
              <strong className="block text-[13px]">{result?.stats.allAssets ?? "—"}</strong>
              <span className="text-[12px] text-[#747f96]">Unique assets</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-[min(1180px,calc(100%-40px))] max-[600px]:w-[min(100%-28px,1180px)]">
        <div className="flex gap-2.5 rounded-[19px] border border-[var(--line)] bg-[var(--surface)] p-2.5 max-[600px]:flex-wrap">
          <label className="flex h-11 min-w-0 flex-1 items-center gap-3 px-2 max-[600px]:basis-full">
            <Icon name="search" className="h-5 w-5 text-[#7d88a0]" />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search items, collections, or creators"
              aria-label="Search marketplace"
              className="min-w-0 flex-1 border-0 bg-transparent text-[13px] text-white outline-none placeholder:text-[#626d84]"
            />
          </label>
          <button
            type="button"
            onClick={() => setFiltersOpen((value) => !value)}
            aria-expanded={filtersOpen}
            className="flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-[var(--line)] bg-white/[.035] px-4 text-[12px] text-[#c4cbd9]"
          >
            <Icon name="filter" />
            Filters
            {activeFilterCount > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-violet-500/20 px-1 text-violet-200">
                {activeFilterCount}
              </span>
            )}
          </button>
          <MarketplaceDropdown
            label="Sort marketplace"
            value={sort}
            options={sortOptions}
            onChange={(value) => {
              setSort(value);
              setPage(1);
            }}
            className="w-[178px] max-[600px]:flex-1"
          />
          <div
            className="flex shrink-0 rounded-xl border border-[var(--line)] bg-white/[.025] p-1"
            role="group"
            aria-label="Marketplace view"
          >
            {(["grid", "list"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-label={`${option} view`}
                aria-pressed={view === option}
                onClick={() => setView(option)}
                className={`grid h-9 w-9 cursor-pointer place-items-center rounded-lg transition ${
                  view === option
                    ? "bg-violet-500/20 text-violet-200 shadow-[inset_0_0_0_1px_rgba(155,123,255,.2)]"
                    : "text-[#657087] hover:bg-white/[.04] hover:text-white"
                }`}
              >
                <Icon name={option} />
              </button>
            ))}
          </div>
        </div>

        {filtersOpen && (
          <div className="mt-3 grid grid-cols-[1.4fr_1fr_1fr_auto] gap-3 rounded-[17px] border border-[var(--line)] bg-[var(--surface)] p-4 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
            <label className="grid gap-2 text-[12px] text-[#7a859b]">
              <span>Price range (ETH)</span>
              <div className="flex gap-2">
                <input
                  value={draftFilters.minPrice}
                  onChange={(e) => setDraftFilters((old) => ({ ...old, minPrice: e.target.value }))}
                  placeholder="Min"
                  type="number"
                  min="0"
                  step="any"
                  className="h-10 min-w-0 flex-1 rounded-lg border border-[var(--line)] bg-[#0e1223] px-3 text-white outline-none"
                />
                <input
                  value={draftFilters.maxPrice}
                  onChange={(e) => setDraftFilters((old) => ({ ...old, maxPrice: e.target.value }))}
                  placeholder="Max"
                  type="number"
                  min="0"
                  step="any"
                  className="h-10 min-w-0 flex-1 rounded-lg border border-[var(--line)] bg-[#0e1223] px-3 text-white outline-none"
                />
              </div>
              {invalidPriceRange && (
                <span className="text-rose-400">Maximum must be greater than minimum.</span>
              )}
            </label>
            <div className="grid gap-2 text-[12px] text-[#7a859b]">
              <span>Blockchain</span>
              <MarketplaceDropdown
                label="Blockchain"
                value={draftFilters.chainId}
                options={chains}
                onChange={(value) => setDraftFilters((old) => ({ ...old, chainId: value }))}
                className="w-full"
              />
            </div>
            <div className="grid gap-2 text-[12px] text-[#7a859b]">
              <span>Sale type</span>
              <MarketplaceDropdown
                label="Sale type"
                value={draftFilters.saleType}
                options={saleOptions}
                onChange={(value) => setDraftFilters((old) => ({ ...old, saleType: value }))}
                className="w-full"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setDraftFilters(emptyFilters);
                  setFilters(emptyFilters);
                  setPage(1);
                }}
                className="h-10 cursor-pointer rounded-lg border border-[var(--line)] px-4 text-[12px] text-[#8994aa]"
              >
                Reset
              </button>
              <button
                type="button"
                disabled={invalidPriceRange}
                onClick={() => {
                  setFilters(draftFilters);
                  setFiltersOpen(false);
                  setPage(1);
                }}
                className="user-primary-action min-h-10"
              >
                Apply
              </button>
            </div>
          </div>
        )}

        <div className="my-7 flex gap-2 overflow-x-auto [scrollbar-width:none]">
          {categories.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => {
                setCategory(item);
                setPage(1);
              }}
              className={`shrink-0 cursor-pointer rounded-full border px-4 py-2 text-[12px] transition ${category === item ? "border-violet-400/25 bg-violet-400/10 text-violet-200" : "border-transparent text-[#78839a] hover:text-white"}`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="m-0 text-[clamp(29px,4vw,40px)] font-semibold tracking-[-1.8px]">
              {search ? "Search results" : category === "All assets" ? "Marketplace" : category}
            </h2>
            <span className="text-[12px] text-[#69758c]">
              {isPending ? "Finding assets…" : `${result?.pagination.total ?? 0} unique assets`}
            </span>
          </div>
          {isFetching && !isPending && (
            <span className="text-[12px] text-violet-300">Updating…</span>
          )}
        </div>

        {isError ? (
          <div className="grid min-h-[280px] place-items-center rounded-[21px] border border-[var(--line)] bg-[var(--surface)] text-center">
            <div>
              <p className="text-sm text-[#9da7bb]">
                {error instanceof Error ? error.message : "Marketplace could not be loaded."}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-3 cursor-pointer rounded-full border border-cyan-300/30 px-4 py-2 text-xs font-semibold text-cyan-300"
              >
                Try again
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`${
              view === "grid"
                ? "grid grid-cols-4 gap-[18px] max-[1050px]:grid-cols-3 max-[800px]:grid-cols-2 max-[560px]:grid-cols-1"
                : "grid gap-3"
            } transition-opacity ${isFetching && !isPending ? "opacity-60" : ""}`}
            aria-busy={isFetching}
          >
            {isPending
              ? Array.from({ length: 12 }, (_, index) => (
                  <CardSkeleton key={index} view={view} />
                ))
              : result?.items.map((nft) => {
                  const remaining = auctionTime(nft.auctionEndsAt);
                  return (
                    <Link
                      href={`/nft/${nft.id}`}
                      key={nft.id}
                      className={`group overflow-hidden rounded-[21px] border border-[var(--line)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(0,0,0,.28)] transition hover:-translate-y-1 hover:border-violet-400/30 ${
                        view === "list" ? "flex min-h-[170px] max-[560px]:min-h-[132px]" : ""
                      }`}
                    >
                      <div
                        className={`relative shrink-0 overflow-hidden bg-[#151734] ${
                          view === "grid"
                            ? "h-[225px] w-full"
                            : "w-[250px] max-[700px]:w-[190px] max-[560px]:w-[112px]"
                        }`}
                      >
                        <Artwork nft={nft} />
                        <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-[#070a16b8] px-2.5 py-1.5 text-[11px] font-semibold">
                          {chainNames[nft.chainId] ?? `CHAIN ${nft.chainId}`}
                        </span>
                        <FavoriteButton
                          nftId={nft.id}
                          isFavorited={nft.isFavorited}
                          likes={nft.likes}
                          wrapperClassName="absolute right-3 top-3 z-10"
                          className="rounded-full border border-white/10 bg-[#070a16d9] px-2.5 py-1.5 text-[11px] text-white backdrop-blur-lg hover:border-rose-400/30 hover:bg-[#160d1bd9]"
                        />
                        {remaining && (
                          <span className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-[#070a16c9] px-2.5 py-1.5 text-[11px] text-emerald-300">
                            {remaining === "Ended" ? remaining : `Ends in ${remaining}`}
                          </span>
                        )}
                      </div>
                      {view === "list" ? (
                        <div className="flex min-w-0 flex-1 items-center justify-between gap-8 p-5 max-[850px]:items-stretch max-[850px]:flex-col max-[850px]:justify-center max-[850px]:gap-4 max-[560px]:p-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex min-w-0 items-center gap-2 text-[11px] text-[#778299]">
                              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-gradient-to-br from-violet-400 to-cyan-400 text-[10px] font-bold text-white">
                                {nft.creator.username.slice(0, 2).toUpperCase()}
                              </span>
                              <span className="truncate">
                                Created by{" "}
                                <strong className="font-medium text-[#c7cedb]">
                                  @{nft.creator.username}
                                </strong>
                              </span>
                              {nft.creator.verified && (
                                <Icon
                                  name="verified"
                                  className="h-3.5 w-3.5 shrink-0 text-violet-400"
                                />
                              )}
                            </div>
                            <h3 className="mb-0 mt-4 truncate text-[20px] font-semibold tracking-[-.6px] max-[560px]:mt-2 max-[560px]:text-[14px]">
                              {nft.name}
                            </h3>
                            <div className="mt-3 flex flex-wrap gap-1.5 max-[560px]:mt-2">
                              <span className="rounded-full border border-violet-400/15 bg-violet-400/[.07] px-2.5 py-1 text-[9px] text-violet-200">
                                {nft.category}
                              </span>
                              <span className="max-w-[180px] truncate rounded-full border border-white/[.07] bg-white/[.025] px-2.5 py-1 text-[9px] text-[#788399]">
                                {nft.collectionSlug.replaceAll("-", " ")}
                              </span>
                            </div>
                            <strong className="mt-2 hidden text-[11px] text-cyan-300 max-[560px]:block">
                              {nft.saleType === "MINT_ONLY"
                                ? "Not listed"
                                : formatPrice(nft.priceWei)}
                            </strong>
                          </div>

                          <dl className="grid w-[430px] shrink-0 grid-cols-2 gap-x-8 gap-y-5 border-l border-white/[.065] pl-7 max-[1000px]:w-[360px] max-[850px]:w-full max-[850px]:grid-cols-4 max-[850px]:gap-4 max-[850px]:border-l-0 max-[850px]:border-t max-[850px]:pl-0 max-[850px]:pt-4 max-[650px]:grid-cols-2 max-[560px]:hidden">
                            <div>
                              <dt className="text-[9px] font-medium uppercase tracking-[1px] text-[#566177]">
                                {nft.saleType === "AUCTION" ? "Current bid" : "Price"}
                              </dt>
                              <dd className="mb-0 mt-1.5 text-[12px] font-semibold text-cyan-300">
                                {nft.saleType === "MINT_ONLY"
                                  ? "Not listed"
                                  : formatPrice(nft.priceWei)}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-[9px] font-medium uppercase tracking-[1px] text-[#566177]">
                                Sale type
                              </dt>
                              <dd className="mb-0 mt-1.5 text-[12px] font-medium text-[#c2c9d6]">
                                {nft.saleType === "MINT_ONLY"
                                  ? "Not listed"
                                  : nft.saleType === "FIXED"
                                    ? "Fixed price"
                                    : "Live auction"}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-[9px] font-medium uppercase tracking-[1px] text-[#566177]">
                                Network
                              </dt>
                              <dd className="mb-0 mt-1.5 text-[12px] font-medium text-[#c2c9d6]">
                                {chainNames[nft.chainId] ?? `Chain ${nft.chainId}`}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-[9px] font-medium uppercase tracking-[1px] text-[#566177]">
                                Minted
                              </dt>
                              <dd className="mb-0 mt-1.5 text-[12px] font-medium text-[#c2c9d6]">
                                {nft.mintedAt
                                  ? new Date(nft.mintedAt).toLocaleDateString()
                                  : "Recently"}
                              </dd>
                            </div>
                          </dl>
                        </div>
                      ) : (
                        <div className="min-w-0 flex-1 p-3">
                          <div className="flex min-w-0 items-center gap-2 text-[12px] text-[#778299]">
                            <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-violet-400 to-cyan-400 text-[9px] font-bold text-white">
                              {nft.creator.username.slice(0, 2).toUpperCase()}
                            </span>
                            <span>
                              by{" "}
                              <strong className="font-medium text-[#b9c1d1]">
                                {nft.creator.username}
                              </strong>
                            </span>
                            {nft.creator.verified && (
                              <Icon name="verified" className="h-3.5 w-3.5 text-violet-400" />
                            )}
                          </div>
                          <h3 className="my-3 truncate text-[14px] font-semibold">{nft.name}</h3>
                          <div className="flex items-end justify-between border-t border-[var(--line)] pt-2.5 text-[11px]">
                            <div>
                              <span className="block text-[#6f7a91]">
                                {nft.saleType === "AUCTION"
                                  ? "Current bid"
                                  : nft.saleType === "FIXED"
                                    ? "Price"
                                    : "Minted asset"}
                              </span>
                              <strong className="mt-1 block text-[13px] text-cyan-300">
                                {nft.saleType === "MINT_ONLY"
                                  ? "Not listed"
                                  : formatPrice(nft.priceWei)}
                              </strong>
                            </div>
                            <span className="max-w-[130px] truncate text-right text-[#69748b]">
                              {nft.category}
                            </span>
                          </div>
                        </div>
                      )}
                    </Link>
                  );
                })}
          </div>
        )}

        {!isPending && !isError && result?.items.length === 0 && (
          <div className="grid place-items-center rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-14 text-center">
            <Icon name="search" className="h-10 w-10 text-violet-400" />
            <h3 className="mb-1 mt-4">No assets found</h3>
            <p className="text-[12px] text-[#6f7a90]">Try changing your search or filters.</p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-4 cursor-pointer text-[12px] font-semibold text-violet-300"
            >
              Clear all filters
            </button>
          </div>
        )}
        {result && result.pagination.total > 0 && (
          <nav
            aria-label="Marketplace pagination"
            className="mt-12 flex items-center justify-between gap-5 rounded-[20px] border border-[var(--line)] bg-[linear-gradient(120deg,rgba(155,123,255,.055),rgba(255,255,255,.018))] p-3 shadow-[0_20px_60px_rgba(0,0,0,.2),inset_0_1px_rgba(255,255,255,.035)] max-[760px]:justify-center"
          >
            <div className="min-w-[170px] pl-2 max-[760px]:hidden">
              <strong className="block text-[11px] font-semibold text-[#c9d0dc]">
                Showing {(result.pagination.page - 1) * result.pagination.limit + 1}–
                {Math.min(
                  result.pagination.page * result.pagination.limit,
                  result.pagination.total,
                )}
              </strong>
              <span className="mt-0.5 block text-[9px] text-[#657087]">
                of {result.pagination.total.toLocaleString()} marketplace assets
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Previous page"
                disabled={!result.pagination.hasPreviousPage || isFetching}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                className="group flex h-10 cursor-pointer items-center gap-1.5 rounded-xl border border-white/[.075] bg-white/[.025] px-3 text-[10px] font-medium text-[#9da7b9] transition hover:border-violet-400/30 hover:bg-violet-400/[.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Icon name="left" className="h-3.5 w-3.5 transition group-hover:-translate-x-0.5" />
                <span className="max-[520px]:hidden">Previous</span>
              </button>

              <div
                className="flex items-center gap-1 max-[520px]:max-w-[156px] max-[520px]:overflow-x-auto max-[520px]:[scrollbar-width:none] max-[520px]:[&::-webkit-scrollbar]:hidden"
                aria-label="Page selection"
              >
                {paginationItems(result.pagination.page, result.pagination.pages).map((item) =>
                  typeof item === "number" ? (
                    <button
                      type="button"
                      key={item}
                      aria-label={`Go to page ${item}`}
                      aria-current={item === result.pagination.page ? "page" : undefined}
                      disabled={isFetching}
                      onClick={() => setPage(item)}
                      className={`grid h-10 min-w-10 cursor-pointer place-items-center rounded-xl border px-2 text-[11px] font-semibold transition disabled:cursor-wait max-[520px]:h-9 max-[520px]:min-w-9 ${
                        item === result.pagination.page
                          ? "border-violet-300/35 bg-[linear-gradient(135deg,#8d6bff,#6849ea)] text-white shadow-[0_8px_24px_rgba(105,72,235,.3),inset_0_1px_rgba(255,255,255,.18)]"
                          : "border-transparent text-[#768198] hover:border-white/[.08] hover:bg-white/[.045] hover:text-white"
                      }`}
                    >
                      {item}
                    </button>
                  ) : (
                    <span
                      key={item}
                      aria-hidden="true"
                      className="grid h-10 min-w-6 place-items-center text-[12px] tracking-[2px] text-[#4f596d] max-[520px]:hidden"
                    >
                      •••
                    </span>
                  ),
                )}
              </div>

              <button
                type="button"
                aria-label="Next page"
                disabled={!result.pagination.hasNextPage || isFetching}
                onClick={() => setPage((value) => value + 1)}
                className="group flex h-10 cursor-pointer items-center gap-1.5 rounded-xl border border-white/[.075] bg-white/[.025] px-3 text-[10px] font-medium text-[#9da7b9] transition hover:border-violet-400/30 hover:bg-violet-400/[.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <span className="max-[520px]:hidden">Next</span>
                <Icon name="right" className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </button>
            </div>

            <div className="min-w-[170px] pr-2 text-right max-[760px]:hidden">
              <span className="text-[9px] font-bold uppercase tracking-[1.3px] text-[#596479]">
                Current page
              </span>
              <strong className="mt-0.5 block text-[11px] text-[#b9c1d0]">
                {result.pagination.page} / {result.pagination.pages}
              </strong>
            </div>
          </nav>
        )}
      </section>
    </main>
  );
}
