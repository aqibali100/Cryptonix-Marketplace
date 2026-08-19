"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { formatEther } from "viem";
import { API_URL, apiRequest } from "../../lib/api";
import { useAuth } from "../auth/AuthProvider";
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
    pagination: { page: number; limit: number; total: number; pages: number };
  };
};

function displayPrice(value: string) {
  try {
    return `${Number(formatEther(BigInt(value || "0"))).toLocaleString(undefined, { maximumFractionDigits: 4 })} ETH`;
  } catch {
    return "0 ETH";
  }
}

function FavoriteSkeleton() {
  return (
    <div className="overflow-hidden rounded-[18px] border border-[var(--line)] bg-white/[.018]">
      <div className="aspect-[1.12] animate-pulse bg-white/[.045]" />
      <div className="animate-pulse p-3.5">
        <span className="block h-3 w-20 rounded bg-white/[.05]" />
        <span className="mt-3 block h-4 w-32 rounded bg-white/[.08]" />
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const auth = useAuth();
  const username = auth.user?.username;
  const favorites = useQuery({
    queryKey: ["favorites", auth.user?.address],
    queryFn: () => apiRequest<FavoritesResponse>("/api/user/favorites?limit=12"),
    enabled: Boolean(auth.user),
    staleTime: 30_000,
  });
  const result = favorites.data?.data;

  return (
    <main className="mx-auto min-h-screen w-[min(1180px,calc(100%_-_40px))] pb-24 pt-[98px] max-[600px]:w-[calc(100%_-_28px)] max-[600px]:pb-16 max-[600px]:pt-[105px]">
      <header className="relative overflow-hidden rounded-[28px] border border-[var(--line)] bg-[radial-gradient(circle_at_82%_22%,rgba(84,220,207,.16),transparent_25%),radial-gradient(circle_at_18%_80%,rgba(141,107,255,.19),transparent_30%),rgba(255,255,255,.018)] px-6 py-9 shadow-[0_24px_80px_rgba(0,0,0,.22)] max-[600px]:px-5 max-[600px]:py-7">
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
            <p className="m-0 max-w-xl text-[12px] leading-5 text-[#737e93]">
              Your saved digital assets are synchronized with your Cryptonix account.
            </p>
          </div>
          <Link href="/marketplace" className="user-primary-action relative shrink-0">
            Explore marketplace
          </Link>
        </div>
      </header>

      <section
        className="mt-4 grid grid-cols-3 gap-4 max-[760px]:grid-cols-1"
        aria-label="Account overview"
      >
        {[
          {
            label: "Favorites",
            value: favorites.isPending ? "—" : String(result?.pagination.total ?? 0),
            note: "Saved for later",
            icon: "♡",
          },
          {
            label: "Account",
            value: auth.user?.role === "creator" ? "Creator" : "Collector",
            note: "Active marketplace role",
            icon: "◇",
          },
          {
            label: "Wallet",
            value: auth.user
              ? `${auth.user.address.slice(0, 6)}…${auth.user.address.slice(-4)}`
              : "—",
            note: "Authenticated wallet",
            icon: "⌁",
          },
        ].map((stat) => (
          <article
            className="rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[0_18px_50px_rgba(0,0,0,.18)]"
            key={stat.label}
          >
            <div className="flex items-center justify-between text-[12px] text-[#778298]">
              <span>{stat.label}</span>
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-400/[.09] text-violet-300">
                {stat.icon}
              </span>
            </div>
            <strong className="mt-3 block truncate text-[22px] tracking-[-.7px]">
              {stat.value}
            </strong>
            <small className="text-[11px] text-[#566176]">{stat.note}</small>
          </article>
        ))}
      </section>

      <section className="mt-4 rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_24px_70px_rgba(0,0,0,.2)] max-[600px]:p-4">
        <div className="mb-5 flex items-end justify-between gap-5">
          <div>
            <span className="text-[10px] font-bold tracking-[1.6px] text-violet-300">
              SAVED ASSETS
            </span>
            <h2 className="mb-0 mt-2 text-2xl font-semibold tracking-[-.8px]">Your favorites</h2>
            <p className="mb-0 mt-1 text-[11px] text-[#657087]">Assets you want to keep close.</p>
          </div>
          {result && result.pagination.total > 0 && (
            <span className="rounded-full border border-violet-400/15 bg-violet-400/[.07] px-3 py-1.5 text-[10px] text-violet-200">
              {result.pagination.total} saved
            </span>
          )}
        </div>

        {favorites.isError ? (
          <div className="grid min-h-48 place-items-center rounded-[18px] border border-rose-400/10 bg-rose-400/[.025] text-center">
            <div>
              <p className="text-xs text-[#929caf]">Favorites could not be loaded.</p>
              <button
                type="button"
                onClick={() => favorites.refetch()}
                className="mt-2 cursor-pointer text-[11px] font-semibold text-violet-300"
              >
                Try again
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3 max-[900px]:grid-cols-3 max-[680px]:grid-cols-2 max-[430px]:grid-cols-1">
            {favorites.isPending
              ? Array.from({ length: 4 }, (_, index) => <FavoriteSkeleton key={index} />)
              : result?.items.map((nft) => (
                  <Link
                    key={nft.id}
                    href={`/nft/${nft.id}`}
                    className="group overflow-hidden rounded-[18px] border border-[var(--line)] bg-white/[.018] transition hover:-translate-y-1 hover:border-violet-400/25"
                  >
                    <div className="relative aspect-[1.12] overflow-hidden bg-[#12172a]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`${API_URL}${nft.imageUrl}`}
                        alt={`${nft.name} artwork`}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <FavoriteButton
                        nftId={nft.id}
                        isFavorited={nft.isFavorited}
                        likes={nft.likes}
                        showCount={false}
                        wrapperClassName="absolute right-2.5 top-2.5 z-10"
                        className="h-8 w-8 rounded-full border border-white/10 bg-[#070a16d9] text-rose-400 backdrop-blur-lg hover:bg-[#160d1b]"
                      />
                    </div>
                    <div className="p-3.5">
                      <span className="block truncate text-[10px] text-[#657087]">
                        @{nft.creator.username} · {nft.category}
                      </span>
                      <strong className="mt-1.5 block truncate text-[12px]">{nft.name}</strong>
                      <span className="mt-2 block text-[11px] font-semibold text-cyan-300">
                        {nft.saleType === "MINT_ONLY" ? "Not listed" : displayPrice(nft.priceWei)}
                      </span>
                    </div>
                  </Link>
                ))}
          </div>
        )}

        {!favorites.isPending && !favorites.isError && result?.items.length === 0 && (
          <div className="grid min-h-56 place-items-center rounded-[18px] border border-dashed border-white/[.08] bg-white/[.012] text-center">
            <div>
              <span className="text-4xl text-violet-300">♡</span>
              <h3 className="mb-1 mt-3 text-sm">No favorites yet</h3>
              <p className="text-[11px] text-[#657087]">
                Tap the heart on any NFT to save it here.
              </p>
              <Link href="/marketplace" className="user-primary-action mt-4">
                Explore marketplace
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
