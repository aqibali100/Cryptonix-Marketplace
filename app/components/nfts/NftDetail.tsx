"use client";

import { useQuery } from "@tanstack/react-query";
import { formatEther } from "viem";
import { useState } from "react";
import { API_URL, graphQLRequest } from "../../lib/api";
import PageBreadcrumb from "../layout/PageBreadcrumb";

type Nft = {
  id: string;
  name: string;
  description: string;
  collectionSlug: string;
  category: string;
  standard: string;
  supply: number;
  chainId: number;
  royaltyBps: number;
  metadataFrozen: boolean;
  saleType: string;
  priceWei: string;
  auctionEndsAt: string | null;
  imageUrl: string;
  status: string;
  contractAddress: string | null;
  tokenId: string | null;
  mintedAt: string | null;
  likes: number;
  volumeChange24h: number;
  creator: { username: string; profileImage: string; verified: boolean };
  traits: Array<{ traitType: string; value: string }>;
};

const NFT_QUERY = /* GraphQL */ `
  query NftDetail($id: ID!) {
    nftDetail(id: $id) {
      success
      message
      nft {
        id
        name
        description
        collectionSlug
        category
        standard
        supply
        chainId
        royaltyBps
        metadataFrozen
        saleType
        priceWei
        auctionEndsAt
        imageUrl
        status
        contractAddress
        tokenId
        mintedAt
        likes
        volumeChange24h
        creator {
          username
          profileImage
          verified
        }
        traits {
          traitType
          value
        }
      }
    }
  }
`;

type IconName = "back" | "heart" | "share" | "external" | "copy" | "check" | "image";
function Icon({ name, className = "h-4 w-4" }: { name: IconName; className?: string }) {
  const paths = {
    back: <path d="m15 18-6-6 6-6" />,
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l8.9 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8Z" />
    ),
    share: (
      <>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4" />
      </>
    ),
    external: (
      <>
        <path d="M15 3h6v6M10 14 21 3" />
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      </>
    ),
    copy: (
      <>
        <rect width="14" height="14" x="8" y="8" rx="2" />
        <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="m8 12 2.5 2.5L16 9" />
      </>
    ),
    image: (
      <>
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3-3a2 2 0 0 0-3 0l-9 9" />
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

function Skeleton() {
  const bar = "animate-pulse rounded-lg bg-white/[.07]";
  return (
    <main aria-busy="true" className="mx-auto w-[min(1180px,calc(100%_-_40px))] pb-24 pt-[125px]">
      <span className={`${bar} mb-7 block h-4 w-40`} />
      <div className="grid grid-cols-2 gap-12 max-[900px]:grid-cols-1">
        <div className="aspect-square animate-pulse rounded-[26px] bg-white/[.04]" />
        <div>
          <span className={`${bar} block h-6 w-36`} />
          <span className={`${bar} mt-5 block h-16 w-4/5`} />
          <span className={`${bar} mt-7 block h-12 w-52`} />
          <span className={`${bar} mt-8 block h-20 w-full`} />
          <div className="mt-7 grid grid-cols-3 gap-3">
            {[1, 2, 3].map((x) => (
              <span className={`${bar} h-20`} key={x} />
            ))}
          </div>
          <span className={`${bar} mt-7 block h-44 w-full`} />
        </div>
      </div>
    </main>
  );
}

const chains: Record<number, string> = {
  1: "Ethereum",
  8453: "Base",
  84532: "Base Sepolia",
  11155111: "Ethereum Sepolia",
  137: "Polygon",
  80002: "Polygon Amoy",
};
const explorers: Record<number, string> = {
  1: "https://etherscan.io",
  8453: "https://basescan.org",
  84532: "https://sepolia.basescan.org",
  11155111: "https://sepolia.etherscan.io",
  137: "https://polygonscan.com",
  80002: "https://amoy.polygonscan.com",
};
const short = (v: string) => (v.length > 18 ? `${v.slice(0, 8)}…${v.slice(-6)}` : v);

export default function NftDetail({ id }: { id: string }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [copied, setCopied] = useState("");
  const query = useQuery({
    queryKey: ["nft", id],
    queryFn: () => graphQLRequest<{ nftDetail: { nft: Nft } }>(NFT_QUERY, { id }),
    staleTime: 60_000,
  });
  if (query.isPending) return <Skeleton />;
  if (query.isError || !query.data)
    return (
      <main className="grid min-h-[75vh] place-items-center px-5 pt-24 text-center">
        <div>
          <span className="text-xs font-bold tracking-[2px] text-rose-400">NFT UNAVAILABLE</span>
          <h1 className="mt-3 text-4xl">We couldn&apos;t load this NFT</h1>
          <p className="text-sm text-[#7d879b]">
            {query.error instanceof Error ? query.error.message : "This NFT is not public."}
          </p>
          <button
            onClick={() => query.refetch()}
            className="mt-4 rounded-xl bg-[#7659e8] px-5 py-2.5 text-sm font-semibold"
          >
            Try again
          </button>
        </div>
      </main>
    );
  const nft = query.data.nftDetail.nft;
  const price = `${Number(formatEther(BigInt(nft.priceWei || "0"))).toLocaleString(undefined, { maximumFractionDigits: 5 })} ETH`;
  const copy = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1400);
  };
  const explorer =
    nft.contractAddress && explorers[nft.chainId]
      ? `${explorers[nft.chainId]}/address/${nft.contractAddress}`
      : null;
  const facts = [
    ["Blockchain", chains[nft.chainId] || `Chain ${nft.chainId}`],
    ["Token standard", nft.standard.replace("ERC", "ERC-")],
    ["Creator royalty", `${nft.royaltyBps / 100}%`],
    ["Supply", String(nft.supply)],
    ["Metadata", nft.metadataFrozen ? "Frozen" : "Editable"],
    ["Status", nft.status],
  ];
  const provenance = [
    ["Contract", nft.contractAddress || "Pending"],
    ["Token ID", nft.tokenId || "Pending"],
    ["Minted", nft.mintedAt ? new Date(nft.mintedAt).toLocaleString() : "Pending"],
  ];
  return (
    <main className="relative mx-auto w-[min(1220px,calc(100%_-_40px))] pb-28 pt-[118px] max-[600px]:w-[calc(100%_-_28px)] max-[600px]:pb-20 max-[600px]:pt-[100px]">
      <div className="pointer-events-none absolute -left-52 top-40 -z-10 h-[480px] w-[480px] rounded-full bg-cyan-400/[.055] blur-[120px]" />
      <div className="pointer-events-none absolute -right-52 top-10 -z-10 h-[520px] w-[520px] rounded-full bg-violet-500/[.09] blur-[140px]" />
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Marketplace", href: "/marketplace" },
          { label: nft.name },
        ]}
      />
      <div className="grid grid-cols-[minmax(0,1.12fr)_minmax(390px,.88fr)] items-start gap-7 max-[950px]:grid-cols-1 max-[600px]:gap-5">
        <section className="sticky top-[110px] max-[900px]:static">
          <div className="group relative aspect-square overflow-hidden rounded-[28px] border border-white/[.09] bg-[linear-gradient(145deg,rgba(21,27,51,.96),rgba(10,13,27,.98))] p-2.5 shadow-[0_32px_110px_rgba(0,0,0,.42),inset_0_1px_rgba(255,255,255,.06)] max-[600px]:rounded-[22px] max-[600px]:p-2">
            {!imageFailed ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${API_URL}${nft.imageUrl}`}
                  alt={`${nft.name} artwork`}
                  onError={() => setImageFailed(true)}
                  className="h-full w-full rounded-[21px] object-cover transition-transform duration-700 group-hover:scale-[1.015] max-[600px]:rounded-[16px]"
                />
              </>
            ) : (
              <div className="grid h-full place-items-center rounded-[19px] text-[#69748a]">
                <Icon name="image" className="h-12 w-12" />
              </div>
            )}
            <span className="absolute bottom-6 left-6 rounded-full border border-white/[.13] bg-[#050711d9] px-3 py-2 text-[10px] font-semibold tracking-[1.2px] shadow-lg backdrop-blur-xl">
              {nft.supply === 1 ? "1 / 1 EDITION" : `${nft.supply} EDITIONS`}
            </span>
          </div>
          <div className="mt-3 flex justify-center gap-1 rounded-2xl border border-white/[.055] bg-white/[.018] p-1.5">
            <button
              onClick={() => void copy("share", window.location.href)}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs text-[#8993a8] transition hover:bg-white/[.045] hover:text-white"
            >
              <Icon name={copied === "share" ? "check" : "share"} />
              {copied === "share" ? "Copied" : "Share"}
            </button>
            {explorer && (
              <a
                href={explorer}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs text-[#8993a8] transition hover:bg-white/[.045] hover:text-white"
              >
                <Icon name="external" />
                Contract
              </a>
            )}
          </div>
        </section>
        <section className="rounded-[26px] border border-white/[.075] bg-[linear-gradient(145deg,rgba(17,21,41,.76),rgba(10,13,27,.66))] p-6 shadow-[0_28px_90px_rgba(0,0,0,.24),inset_0_1px_rgba(255,255,255,.045)] backdrop-blur-2xl max-[600px]:rounded-[21px] max-[600px]:p-4">
          <div className="flex items-center justify-between">
            <span className="rounded-full border border-[#9b7bff]/20 bg-[#9b7bff]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[1.5px] text-[#b7a5ff]">
              {nft.category}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[.07] bg-white/[.025] px-3 py-1.5 text-xs text-[#9099aa]">
              <Icon name="heart" />
              {nft.likes}
            </span>
          </div>
          <h1 className="mb-5 mt-4 text-[clamp(42px,5.5vw,68px)] font-semibold leading-[.94] tracking-[-3.8px]">
            {nft.name}
          </h1>
          <div className="flex items-center gap-3 rounded-2xl border border-white/[.06] bg-white/[.022] p-3">
            <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[#a475ed] to-[#35bbb0] font-bold">
              {nft.creator.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={nft.creator.profileImage} alt="" className="h-full w-full object-cover" />
              ) : (
                nft.creator.username[0]?.toUpperCase()
              )}
            </span>
            <div>
              <small className="block text-xs text-[#687389]">Created by</small>
              <strong className="flex items-center gap-1.5 text-sm">
                @{nft.creator.username}
                {nft.creator.verified && (
                  <Icon name="check" className="h-3.5 w-3.5 text-[#8d73f4]" />
                )}
              </strong>
            </div>
          </div>
          <p className="mb-5 mt-5 border-l-2 border-[#8067e5]/50 pl-4 text-[13px] leading-6 text-[#929caf]">
            {nft.description || "No description has been provided."}
          </p>
          <div className="grid grid-cols-3 gap-2 max-[500px]:grid-cols-2">
            {facts.map(([l, v]) => (
              <div
                key={l}
                className="rounded-xl border border-white/[.06] bg-white/[.022] p-3 transition hover:border-[#8c72ee]/25 hover:bg-[#8c72ee]/[.04]"
              >
                <small className="block text-[11px] text-[#687389]">{l}</small>
                <strong className="mt-1.5 block text-xs">{v}</strong>
              </div>
            ))}
          </div>
          <div className="my-5 overflow-hidden rounded-[20px] border border-[#8c72ee]/20 bg-[linear-gradient(135deg,rgba(116,83,225,.15),rgba(42,202,190,.045))] p-5 shadow-[inset_0_1px_rgba(255,255,255,.04)]">
            <div className="flex items-end justify-between gap-5">
              <div>
                <small className="text-xs text-[#737e93]">
                  {nft.saleType === "MINT_ONLY" ? "Listing status" : "Current price"}
                </small>
                <strong className="mt-2 block text-[32px] tracking-[-1.5px]">
                  {nft.saleType === "MINT_ONLY" ? "Not listed" : price}
                </strong>
              </div>
              <div className="text-right">
                <small className="block text-[11px] text-[#687389]">24h activity</small>
                <strong className={nft.volumeChange24h >= 0 ? "text-emerald-400" : "text-rose-400"}>
                  {nft.volumeChange24h >= 0 ? "+" : ""}
                  {nft.volumeChange24h.toFixed(1)}%
                </strong>
              </div>
            </div>
            <span className="mt-4 inline-flex rounded-full border border-white/[.07] bg-white/[.035] px-2.5 py-1 text-[10px] font-semibold tracking-[1px] text-[#8993a7]">
              {nft.saleType.replaceAll("_", " ")}
            </span>
            {nft.auctionEndsAt && (
              <p className="mb-0 mt-3 text-xs text-[#737e93]">
                Auction ends {new Date(nft.auctionEndsAt).toLocaleString()}
              </p>
            )}
          </div>
          {nft.traits.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center justify-between text-sm">
                <span>Properties</span>
                <span className="rounded-full bg-white/[.04] px-2 py-1 text-[10px] text-[#727d91]">
                  {nft.traits.length} traits
                </span>
              </h2>
              <div className="grid grid-cols-3 gap-2 max-[500px]:grid-cols-2">
                {nft.traits.map((t) => (
                  <div
                    key={`${t.traitType}-${t.value}`}
                    className="rounded-xl border border-[#8c72ee]/20 bg-[#8c72ee]/[.055] p-3 text-center transition hover:-translate-y-0.5 hover:border-[#8c72ee]/40"
                  >
                    <small className="block text-[10px] uppercase tracking-[1px] text-[#8171bd]">
                      {t.traitType}
                    </small>
                    <strong className="mt-1.5 block text-xs">{t.value}</strong>
                  </div>
                ))}
              </div>
            </section>
          )}
          <section className="mt-5 rounded-[18px] border border-white/[.06] bg-black/[.08] p-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="m-0 text-sm">On-chain details</h2>
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.65)]" />
            </div>
            {provenance.map(([l, v]) => (
              <div
                key={l}
                className="flex items-center justify-between gap-4 border-b border-white/[.05] py-2.5 last:border-0"
              >
                <span className="text-xs text-[#687389]">{l}</span>
                <button
                  onClick={() => v !== "Pending" && void copy(l, v)}
                  className="flex min-w-0 items-center gap-2 font-mono text-[11px] text-[#b1b8c7]"
                >
                  <span className="truncate">{v.startsWith("0x") ? short(v) : v}</span>
                  {v !== "Pending" && (
                    <Icon name={copied === l ? "check" : "copy"} className="h-3.5 w-3.5 shrink-0" />
                  )}
                </button>
              </div>
            ))}
          </section>
        </section>
      </div>
    </main>
  );
}
