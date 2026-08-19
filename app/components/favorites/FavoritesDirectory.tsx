"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { formatEther } from "viem";
import { API_URL, apiRequest } from "../../lib/api";
import PageBreadcrumb from "../layout/PageBreadcrumb";
import FavoriteButton from "../nfts/FavoriteButton";

type FavoriteNft = {
  id: string;
  name: string;
  category: string;
  chainId: number;
  saleType: "MINT_ONLY" | "FIXED" | "AUCTION";
  priceWei: string;
  likes: number;
  imageUrl: string;
  isFavorited: true;
  favoritedAt: string;
  creator: { username: string };
};

type FavoritesResponse = {
  success: true;
  data: {
    items: FavoriteNft[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
};

const chainNames: Record<number, string> = {
  84532: "Base Sepolia",
  11155111: "Ethereum Sepolia",
  80002: "Polygon Amoy",
};

function Icon({ name }: { name: "grid" | "list" | "left" | "right" | "heart" }) {
  const paths = {
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
    left: <path d="m15 18-6-6 6-6" />,
    right: <path d="m9 18 6-6-6-6" />,
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l8.9 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8Z" />
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
      className="h-4 w-4"
    >
      {paths[name]}
    </svg>
  );
}

function displayPrice(nft: FavoriteNft) {
  if (nft.saleType === "MINT_ONLY") return "Not listed";
  try {
    return `${Number(formatEther(BigInt(nft.priceWei || "0"))).toLocaleString(undefined, { maximumFractionDigits: 4 })} ETH`;
  } catch {
    return "0 ETH";
  }
}

function Skeleton({ view }: { view: "grid" | "list" }) {
  return (
    <div
      className={`overflow-hidden rounded-[20px] border border-[var(--line)] bg-white/[.018] ${view === "list" ? "flex h-[128px]" : ""}`}
    >
      <div
        className={`${view === "list" ? "w-[150px] shrink-0" : "aspect-[1.12]"} animate-pulse bg-white/[.045]`}
      />
      <div className="flex-1 animate-pulse p-4">
        <span className="block h-3 w-20 rounded bg-white/[.05]" />
        <span className="mt-3 block h-4 w-36 rounded bg-white/[.08]" />
        <span className="mt-4 block h-3 w-24 rounded bg-cyan-300/[.07]" />
      </div>
    </div>
  );
}

export default function FavoritesDirectory() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const favorites = useQuery({
    queryKey: ["favorites", "directory", page],
    queryFn: () => apiRequest<FavoritesResponse>(`/api/user/favorites?page=${page}&limit=12`),
    staleTime: 30_000,
    placeholderData: (previous) => previous,
  });
  const result = favorites.data?.data;

  return (
    <main className="relative min-h-screen overflow-hidden pb-24 pt-[118px] max-[600px]:pt-[100px]">
      <div className="pointer-events-none absolute right-[-160px] top-20 -z-10 h-[420px] w-[420px] rounded-full bg-violet-500/[.09] blur-[120px]" />
      <div className="mx-auto w-[min(1180px,calc(100%_-_40px))] max-[600px]:w-[calc(100%_-_28px)]">
        <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "My Favourite" }]} />

        <header className="flex items-end justify-between gap-8 border-b border-[var(--line)] pb-8 max-[700px]:items-start max-[700px]:flex-col">
          <div>
            <span className="text-[11px] font-bold tracking-[2px] text-[var(--cyan)]">
              YOUR COLLECTION
            </span>
            <h1 className="mb-0 mt-3 text-[clamp(42px,6vw,68px)] font-semibold leading-none tracking-[-3.5px]">
              My{" "}
              <span className="bg-gradient-to-r from-[#b49dff] to-[#6deee0] bg-clip-text text-transparent">
                Favourite.
              </span>
            </h1>
            <p className="mb-0 mt-4 max-w-xl text-[12px] leading-5 text-[#737e93]">
              Every NFT you save, organized in one private collection.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-violet-400/15 bg-violet-400/[.07] px-3.5 py-2 text-[11px] text-violet-200">
              {favorites.isPending ? "—" : (result?.pagination.total ?? 0)} saved
            </span>
            <div
              className="flex rounded-xl border border-[var(--line)] bg-white/[.025] p-1"
              role="group"
              aria-label="Favourite view"
            >
              {(["grid", "list"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-label={`${option} view`}
                  aria-pressed={view === option}
                  onClick={() => setView(option)}
                  className={`grid h-9 w-9 cursor-pointer place-items-center rounded-lg transition ${view === option ? "bg-violet-500/20 text-violet-200 shadow-[inset_0_0_0_1px_rgba(155,123,255,.2)]" : "text-[#657087] hover:bg-white/[.04] hover:text-white"}`}
                >
                  <Icon name={option} />
                </button>
              ))}
            </div>
          </div>
        </header>

        {favorites.isError ? (
          <div className="mt-8 grid min-h-72 place-items-center rounded-[22px] border border-rose-400/10 bg-rose-400/[.025] text-center">
            <div>
              <p className="text-sm text-[#929caf]">Your favourites could not be loaded.</p>
              <button
                type="button"
                onClick={() => favorites.refetch()}
                className="mt-2 cursor-pointer rounded-full border border-violet-400/25 px-4 py-2 text-[11px] font-semibold text-violet-300"
              >
                Try again
              </button>
            </div>
          </div>
        ) : (
          <section
            className={`mt-8 transition-opacity ${view === "grid" ? "grid grid-cols-4 gap-4 max-[980px]:grid-cols-3 max-[700px]:grid-cols-2 max-[440px]:grid-cols-1" : "grid gap-3"} ${favorites.isFetching && !favorites.isPending ? "opacity-60" : ""}`}
            aria-busy={favorites.isFetching}
          >
            {favorites.isPending
              ? Array.from({ length: view === "grid" ? 8 : 5 }, (_, index) => (
                  <Skeleton key={index} view={view} />
                ))
              : result?.items.map((nft) => (
                  <Link
                    key={nft.id}
                    href={`/nft/${nft.id}`}
                    className={`group relative overflow-hidden rounded-[20px] border border-[var(--line)] bg-[var(--surface)] shadow-[0_18px_55px_rgba(0,0,0,.18)] transition hover:-translate-y-1 hover:border-violet-400/25 ${view === "list" ? "flex min-h-[132px] max-[560px]:min-h-0 max-[560px]:items-stretch" : ""}`}
                  >
                    <div
                      className={`relative shrink-0 overflow-hidden bg-[#12172a] ${view === "grid" ? "aspect-[1.12] w-full" : "w-[170px] max-[560px]:w-[112px]"}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`${API_URL}${nft.imageUrl}`}
                        alt={`${nft.name} artwork`}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      {view === "grid" && (
                        <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-[#070a16c9] px-2 py-1 text-[9px] text-white backdrop-blur-lg">
                          {chainNames[nft.chainId] ?? `Chain ${nft.chainId}`}
                        </span>
                      )}
                    </div>
                    <div
                      className={`min-w-0 flex-1 p-4 ${view === "list" ? "flex items-center justify-between gap-5 max-[560px]:items-start max-[560px]:flex-col max-[560px]:gap-2 max-[560px]:p-3" : ""}`}
                    >
                      <div className="min-w-0">
                        <span className="block truncate text-[10px] text-[#657087]">
                          @{nft.creator.username} · {nft.category}
                        </span>
                        <h2 className="mb-0 mt-2 truncate text-[14px] font-semibold">{nft.name}</h2>
                        {view === "list" && (
                          <span className="mt-2 block text-[9px] text-[#596479]">
                            Saved {new Date(nft.favoritedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div
                        className={
                          view === "list"
                            ? "shrink-0 text-right max-[560px]:text-left"
                            : "mt-4 border-t border-[var(--line)] pt-3"
                        }
                      >
                        <span className="block text-[9px] text-[#657087]">
                          {nft.saleType === "AUCTION" ? "Current bid" : "Price"}
                        </span>
                        <strong className="mt-1 block text-[12px] text-cyan-300">
                          {displayPrice(nft)}
                        </strong>
                      </div>
                    </div>
                    <FavoriteButton
                      nftId={nft.id}
                      isFavorited={nft.isFavorited}
                      likes={nft.likes}
                      showCount={false}
                      wrapperClassName="absolute right-3 top-3 z-10"
                      className="h-9 w-9 rounded-full border border-white/10 bg-[#070a16df] text-rose-400 shadow-lg backdrop-blur-lg hover:border-rose-400/35 hover:bg-[#160d1b]"
                    />
                  </Link>
                ))}
          </section>
        )}

        {!favorites.isPending && !favorites.isError && result?.items.length === 0 && (
          <div className="mt-8 grid min-h-80 place-items-center rounded-[22px] border border-dashed border-white/[.09] bg-white/[.012] text-center">
            <div>
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-violet-400/[.08] text-violet-300">
                <Icon name="heart" />
              </span>
              <h2 className="mb-1 mt-4 text-lg">Your wishlist is empty</h2>
              <p className="text-[11px] text-[#657087]">
                Save NFTs from the marketplace and they will appear here.
              </p>
              <Link href="/marketplace" className="user-primary-action mt-4">
                Explore marketplace
              </Link>
            </div>
          </div>
        )}

        {result && result.pagination.pages > 1 && (
          <nav
            aria-label="Favourite pagination"
            className="mt-10 flex items-center justify-center gap-3"
          >
            <button
              type="button"
              aria-label="Previous page"
              disabled={!result.pagination.hasPreviousPage || favorites.isFetching}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl border border-[var(--line)] bg-white/[.025] text-[#8d97aa] transition hover:border-violet-400/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Icon name="left" />
            </button>
            <span className="min-w-24 text-center text-[11px] text-[#657087]">
              Page <strong className="text-white">{result.pagination.page}</strong> of{" "}
              {result.pagination.pages}
            </span>
            <button
              type="button"
              aria-label="Next page"
              disabled={!result.pagination.hasNextPage || favorites.isFetching}
              onClick={() => setPage((value) => value + 1)}
              className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl border border-[var(--line)] bg-white/[.025] text-[#8d97aa] transition hover:border-violet-400/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Icon name="right" />
            </button>
          </nav>
        )}
      </div>
    </main>
  );
}
