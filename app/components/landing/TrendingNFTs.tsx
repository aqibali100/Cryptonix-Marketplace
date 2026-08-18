"use client";

import { useQuery } from "@tanstack/react-query";
import { formatEther } from "viem";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { API_URL, graphQLRequest } from "../../lib/api";
import NftCardSkeleton from "../skeleton/NftCardSkeleton";

type HomeNft = {
  id: string;
  rank: number;
  name: string;
  creator: { name: string; verified: boolean };
  imageUrl: string;
  priceWei: string;
  likes: number;
  volumeChange24h: number;
};

type TrendingResponse = {
  homeTrendingNfts: {
    success: boolean;
    message: string;
    count: number;
    items: HomeNft[];
  };
};

const HOME_NFTS_QUERY = /* GraphQL */ `
  query HomeTrendingNfts {
    homeTrendingNfts {
      success
      message
      count
      items {
        id
        rank
        name
        creator {
          name
          verified
        }
        imageUrl
        priceWei
        likes
        volumeChange24h
      }
    }
  }
`;

function displayPrice(priceWei: string) {
  try {
    return `${Number(formatEther(BigInt(priceWei))).toLocaleString(undefined, { maximumFractionDigits: 4 })} ETH`;
  } catch {
    return "0 ETH";
  }
}

function Icon({
  name,
  className = "h-4 w-4",
}: {
  name: "left" | "right" | "heart" | "sparkles" | "verified" | "image";
  className?: string;
}) {
  const paths = {
    left: <path d="m15 18-6-6 6-6" />,
    right: <path d="m9 18 6-6-6-6" />,
    heart: (
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
    ),
    sparkles: (
      <>
        <path d="m12 3-1.4 3.6L7 8l3.6 1.4L12 13l1.4-3.6L17 8l-3.6-1.4L12 3Z" />
        <path d="m5 14-.9 2.1L2 17l2.1.9L5 20l.9-2.1L8 17l-2.1-.9L5 14Z" />
      </>
    ),
    verified: (
      <>
        <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
        <path d="m8.5 12 2.2 2.2 4.8-5" />
      </>
    ),
    image: (
      <>
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function Artwork({ nft }: { nft: HomeNft }) {
  const [failed, setFailed] = useState(false);
  const source = nft.imageUrl.startsWith("http") ? nft.imageUrl : `${API_URL}${nft.imageUrl}`;
  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#273153,#11162c_70%)]">
      {!failed ? (
        // Dynamic NFT media is served by our signed API redirect, so Next Image
        // host optimization cannot know the final Pinata hostname ahead of time.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={source}
          alt={`${nft.name} artwork`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="grid h-full place-items-center text-[#657087]">
          <div className="grid justify-items-center gap-2">
            <Icon name="image" className="h-9 w-9" />
            <span className="text-[11px]">Artwork unavailable</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrendingNFTs() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({ back: false, forward: false });
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["home", "trending-nfts"],
    queryFn: () => graphQLRequest<TrendingResponse>(HOME_NFTS_QUERY),
    staleTime: 60_000,
  });
  const nfts = data?.homeTrendingNfts.items ?? [];

  const updateControls = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const end = slider.scrollWidth - slider.clientWidth;
    setScrollState({ back: slider.scrollLeft > 2, forward: slider.scrollLeft < end - 2 });
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const observer = new ResizeObserver(updateControls);
    observer.observe(slider);
    updateControls();
    return () => observer.disconnect();
  }, [updateControls, isPending, nfts.length]);

  const moveSlider = (direction: -1 | 1) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const card = slider.firstElementChild as HTMLElement | null;
    slider.scrollBy({
      left: direction * ((card?.offsetWidth ?? slider.clientWidth) + 13),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  return (
    <section
      className="border-y-[1px_solid_var(--line)] px-0 py-[52px] max-[600px]:py-[75px]"
      id="trending"
    >
      <div className="w-[min(1180px,_calc(100%_-_40px))] [margin-inline:auto] max-[600px]:w-[min(100%_-_28px,_1180px)]">
        <div className="mb-7 flex items-end justify-between max-[600px]:items-start">
          <div>
            <span className="text-[12px] font-bold tracking-[2px] text-[var(--cyan)]">
              LIVE MARKET
            </span>
            <h2 className="mb-0 mt-[7px] text-[clamp(29px,4vw,40px)] font-semibold tracking-[-1.8px]">
              Trending NFTs
            </h2>
            <p className="mt-[5px] text-[12px] text-[#6f7a8f]">
              Rare assets collectors cannot stop watching right now.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/marketplace"
              className="group mr-2 flex items-center gap-1.5 text-[12px] font-semibold text-white transition-colors hover:text-[#6be1d7] max-[600px]:hidden"
            >
              All NFTs{" "}
              <Icon
                name="right"
                className="h-3.5 w-3.5 text-[#6be1d7] transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <button
              type="button"
              onClick={() => moveSlider(-1)}
              disabled={!scrollState.back || isPending}
              aria-label="Show previous NFTs"
              className="grid cursor-pointer h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[.04] transition hover:border-[#5de0d4]/50 hover:text-[#5de0d4] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Icon name="left" />
            </button>
            <button
              type="button"
              onClick={() => moveSlider(1)}
              disabled={!scrollState.forward || isPending}
              aria-label="Show next NFTs"
              className="grid cursor-pointer h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[.04] transition hover:border-[#5de0d4]/50 hover:text-[#5de0d4] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Icon name="right" />
            </button>
          </div>
        </div>

        {isError ? (
          <div className="grid min-h-[220px] place-items-center rounded-[19px] border border-[var(--line)] bg-white/[.02] text-center">
            <div>
              <p className="text-sm text-[#9da7bb]">Trending NFTs could not be loaded.</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-3 cursor-pointer rounded-full border border-[#5de0d4]/30 px-4 py-2 text-xs font-semibold text-[#5de0d4] transition hover:bg-[#5de0d4]/10"
              >
                Try again
              </button>
            </div>
          </div>
        ) : (
          <div
            ref={sliderRef}
            onScroll={updateControls}
            className="flex snap-x snap-mandatory gap-[13px] overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Trending NFT carousel"
            aria-busy={isPending}
          >
            {isPending
              ? Array.from({ length: 4 }, (_, index) => <NftCardSkeleton key={index} />)
              : nfts.map((nft) => (
                  <Link
                    href={`/nft/${nft.id}`}
                className="glass group w-[calc((100%-39px)/4)] min-w-[calc((100%-39px)/4)] snap-start overflow-hidden rounded-[19px] border-[1px_solid_var(--line)] bg-[var(--surface)] shadow-[inset_0_1px_rgba(255,255,255,.05)] transition-transform duration-300 [backdrop-filter:blur(22px)] [-webkit-backdrop-filter:blur(22px)] hover:-translate-y-1 hover:border-[rgba(155,123,255,.35)] max-[900px]:w-[calc((100%-13px)/2)] max-[900px]:min-w-[calc((100%-13px)/2)] max-[600px]:w-full max-[600px]:min-w-full"
                    key={nft.id}
                  >
                    <div className="relative grid h-[245px] place-items-center overflow-hidden bg-[#151a31] max-[600px]:h-[310px]">
                      <Artwork nft={nft} />
                      <span className="absolute right-[11px] top-[11px] flex items-center gap-1.5 rounded-full border border-white/10 bg-[#050711b8] px-2 py-1.5 text-[12px]">
                        <Icon name="heart" className="h-3.5 w-3.5" />
                        {nft.likes}
                      </span>
                      <i className="absolute left-[11px] top-[11px] flex items-center gap-1.5 rounded-full border border-white/10 bg-[#050711b8] px-2 py-1.5 text-[12px] not-italic tracking-[.5px] text-[#cbbcff]">
                        <Icon name="sparkles" className="h-3.5 w-3.5" />
                        TOP {nft.rank}
                      </i>
                    </div>
                    <div className="flex justify-between p-[13px] text-[12px]">
                      <div className="grid gap-1">
                        <small className="flex items-center gap-1 text-[#657087]">
                          {nft.creator.name}{" "}
                          {nft.creator.verified && (
                            <Icon name="verified" className="h-3 w-3 text-[#8067e5]" />
                          )}
                        </small>
                        <strong>{nft.name}</strong>
                      </div>
                      <div className="grid gap-1 text-right">
                        <small className="text-[#657087]">Price</small>
                        <strong className="text-[#5de0d4]">{displayPrice(nft.priceWei)}</strong>
                      </div>
                    </div>
                    <div className="flex justify-between border-t-[1px_solid_var(--line)] px-[13px] py-[9px] text-[12px] text-[#626d82]">
                      <span>24h volume</span>
                      <strong
                        className={nft.volumeChange24h >= 0 ? "text-[#5edab6]" : "text-rose-400"}
                      >
                        {nft.volumeChange24h >= 0 ? "+" : ""}
                        {nft.volumeChange24h.toFixed(1)}%
                      </strong>
                    </div>
                  </Link>
                ))}
          </div>
        )}
        {!isPending && !isError && nfts.length === 0 && (
          <p className="py-16 text-center text-sm text-[#6f7a8f]">
            No trending NFTs are available yet.
          </p>
        )}
      </div>
    </section>
  );
}
