"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { API_URL, apiRequest, graphQLRequest } from "../../lib/api";
import { formatEther, parseEther } from "viem";
import { useConnection, useSendTransaction, useSwitchChain } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { wagmiConfig } from "../../lib/wagmi";
import CreatorOverview from "./CreatorOverview";
import CreateNftForm from "./CreateNftForm";
import type { CreatorSectionName } from "./creator-navigation";
import CreateCollectionModal from "./CreateCollectionModal";

const tableRows = {
  listings: [
    ["Beyond the Horizon", "Fixed price", "3.24 ETH", "142 views", "Active"],
    ["Parallel Light", "Fixed price", "1.75 ETH", "89 views", "Active"],
    ["Orbital Bloom", "Reserved", "2.40 ETH", "51 views", "Pending"],
  ],
  auctions: [
    ["Celestial Drift", "4.80 ETH", "12 bids", "02h 14m", "Live"],
    ["Chromatic Echo", "2.15 ETH", "7 bids", "08h 45m", "Live"],
    ["Infinite Bloom", "1.20 ETH", "0 bids", "Starts tomorrow", "Scheduled"],
  ],
  offers: [
    ["Signal Garden #1048", "nova.collector", "2.85 ETH", "6h", "New"],
    ["Beyond the Horizon", "0x71F...8A2", "3.10 ETH", "18h", "New"],
    ["Parallel Light", "mika.eth", "1.62 ETH", "2d", "Review"],
  ],
  sales: [
    ["Liquid Memory #07", "ori.collector", "3.25 ETH", "Jul 28, 2026", "Complete"],
    ["Synthetic Soul", "0x29D...81C", "1.90 ETH", "Jul 22, 2026", "Complete"],
    ["Neon Genesis #042", "nova.collector", "4.10 ETH", "Jul 18, 2026", "Complete"],
  ],
};

function Header({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-2 flex items-end justify-between gap-5 max-[640px]:items-start max-[640px]:flex-col">
      <div>
        <h1 className="m-0 text-[clamp(30px,4vw,30px)] font-semibold tracking-[-2px]">{title}</h1>
        <p className="m-0 max-w-2xl text-[12px] leading-5 text-[#727e93]">{text}</p>
      </div>
      {action}
    </header>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-[20px] border border-[var(--line)] bg-[rgba(255,255,255,.022)] p-2 shadow-[0_18px_50px_rgba(0,0,0,.16)] ${className}`}
    >
      {children}
    </section>
  );
}

function Button({
  children,
  secondary = false,
}: {
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <button
      className={`inline-flex h-10 cursor-pointer items-center justify-center rounded-xl px-4 text-[11px] font-semibold transition hover:-translate-y-0.5 ${secondary ? "border border-[var(--line)] bg-white/[.035] text-[#bdc5d4] hover:bg-white/[.065]" : "bg-[linear-gradient(110deg,#8d6bff,#6849ea)] text-white shadow-[0_10px_28px_rgba(105,72,235,.25)]"}`}
    >
      {children}
    </button>
  );
}

function CreateNftLink() {
  return (
    <Link
      className="inline-flex h-10 items-center justify-center rounded-xl bg-[linear-gradient(110deg,#8d6bff,#6849ea)] px-4 text-[11px] font-semibold text-white shadow-[0_10px_28px_rgba(105,72,235,.25)] transition hover:-translate-y-0.5"
      href="/creator/create"
    >
      Create NFT
    </Link>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-[11px] font-semibold text-[#aab3c4] [&_input]:h-11 [&_input]:rounded-xl [&_input]:border [&_input]:border-[var(--line)] [&_input]:bg-[#0b0f1e] [&_input]:px-3 [&_input]:text-[12px] [&_input]:font-normal [&_input]:text-white [&_input]:outline-none [&_select]:h-11 [&_select]:rounded-xl [&_select]:border [&_select]:border-[var(--line)] [&_select]:bg-[#0b0f1e] [&_select]:px-3 [&_select]:text-[12px] [&_select]:font-normal [&_select]:text-white [&_textarea]:min-h-28 [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-[var(--line)] [&_textarea]:bg-[#0b0f1e] [&_textarea]:p-3 [&_textarea]:text-[12px] [&_textarea]:font-normal [&_textarea]:text-white [&_textarea]:outline-none">
      {label}
      {children}
    </label>
  );
}

type CreatorNft = {
  id: string;
  name: string;
  description: string;
  collectionSlug: string;
  category: string;
  externalUrl: string;
  standard: "ERC721" | "ERC1155";
  supply: number;
  chainId: number;
  status: "AWAITING_MINT" | "MINTED" | "FAILED";
  saleType: "MINT_ONLY" | "FIXED" | "AUCTION";
  priceWei: string;
  auctionEndsAt: string | null;
  royaltyBps: number;
  metadataFrozen: boolean;
  creatorWallet: string;
  traits: { traitType: string; value: string }[];
  archivedAt: string | null;
  tokenId: string | null;
  contractAddress: string | null;
  mintTransactionHash: string | null;
  metadataUri: string;
  mintedAt: string | null;
  mediaCid: string;
  mediaGatewayUrl: string;
};

function NftArtwork({ nft }: { nft: CreatorNft }) {
  const sources = useMemo(
    () => [
      `${API_URL}/api/nfts/${nft.id}/media`,
      nft.mediaGatewayUrl,
      `https://${nft.mediaCid}.ipfs.w3s.link/`,
      `https://${nft.mediaCid}.ipfs.dweb.link/`,
      `https://ipfs.io/ipfs/${nft.mediaCid}`,
      `https://nftstorage.link/ipfs/${nft.mediaCid}`,
    ],
    [nft.id, nft.mediaCid, nft.mediaGatewayUrl],
  );
  const [sourceIndex, setSourceIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded || failed) return;
    const timeout = window.setTimeout(
      () => {
        if (sourceIndex < sources.length - 1) {
          setSourceIndex((index) => index + 1);
        } else {
          setFailed(true);
        }
      },
      sourceIndex === 0 ? 30_000 : 8_000,
    );
    return () => window.clearTimeout(timeout);
  }, [failed, loaded, sourceIndex, sources.length]);

  return (
    <div className="relative aspect-[1.25] overflow-hidden rounded-[14px] bg-[#11172a]">
      {!failed ? (
        // IPFS artwork can come from several runtime gateways, so a native image
        // is used here instead of restricting hosts in the Next image optimizer.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={nft.name}
          className={`h-full w-full object-cover transition duration-300 group-hover:scale-[1.025] ${loaded ? "opacity-100" : "opacity-0"}`}
          loading="lazy"
          src={sources[sourceIndex]}
          onLoad={() => setLoaded(true)}
          onError={() => {
            if (sourceIndex < sources.length - 1) {
              setLoaded(false);
              setSourceIndex((index) => index + 1);
            } else setFailed(true);
          }}
        />
      ) : (
        <span className="absolute inset-0 grid place-items-center text-[9px] text-[#596579]">
          Artwork unavailable
        </span>
      )}
      {!loaded && !failed ? (
        <span className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,#11172a_18%,#1a2340_42%,#11172a_66%)] bg-[length:220%_100%]" />
      ) : null}
    </div>
  );
}

function NftCardSkeleton() {
  return (
    <Card className="h-full animate-pulse p-2">
      <div className="aspect-[1.25] rounded-[14px] bg-[#121a30]" />
      <div className="space-y-3 p-2">
        <div className="h-2 w-2/5 rounded-full bg-[#182137]" />
        <div className="h-3 w-3/4 rounded-full bg-[#1b243c]" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-2.5 w-1/3 rounded-full bg-[#182137]" />
          <div className="h-6 w-14 rounded-full bg-[#182137]" />
        </div>
      </div>
    </Card>
  );
}

function NftMenuIcon({
  name,
}: {
  name: "view" | "edit" | "mint" | "archive" | "restore" | "delete";
}) {
  const paths = {
    view: (
      <>
        <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
      </>
    ),
    mint: (
      <>
        <path d="M12 3v12M7 8l5-5 5 5" />
        <path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
      </>
    ),
    archive: (
      <>
        <rect x="3" y="5" width="18" height="4" rx="1" />
        <path d="M5 9v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9M10 13h4" />
      </>
    ),
    restore: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5" />
      </>
    ),
    delete: (
      <>
        <path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6" />
        <path d="M10 11v5M14 11v5" />
      </>
    ),
  } as const;
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function NftActionMenu({
  nft,
  busy,
  onEdit,
  onView,
  onMint,
  onAction,
}: {
  nft: CreatorNft;
  busy: boolean;
  onEdit: () => void;
  onView: () => void;
  onMint: () => void;
  onAction: (action: "delete" | "archive" | "restore") => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const choose = (action: () => void) => {
    setOpen(false);
    action();
  };
  const itemClass =
    "flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[12px] text-[#cbd2df] transition hover:bg-white/[.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="absolute right-3 top-3 z-30 cursor-pointer" ref={menuRef}>
      <button
        type="button"
        aria-label={`Actions for ${nft.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={busy}
        onClick={() => setOpen((value) => !value)}
        className="grid cursor-pointer h-9 w-9 place-items-center rounded-xl border border-white/[.12] bg-[rgba(6,9,19,.78)] text-[#aab3c4] shadow-[0_8px_24px_rgba(0,0,0,.35)] backdrop-blur-xl transition hover:border-[rgba(155,123,255,.35)] hover:bg-[#151a2c] hover:text-white disabled:opacity-45"
      >
        <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="5" cy="12" r="1.8" />
          <circle cx="12" cy="12" r="1.8" />
          <circle cx="19" cy="12" r="1.8" />
        </svg>
      </button>
      {open ? (
        <div
          className="absolute right-0 top-[calc(100%+10px)] z-40 w-[153px] overflow-hidden rounded-[18px] border border-[var(--line)] bg-[rgba(9,12,25,.97)] p-2 shadow-[0_24px_70px_rgba(0,0,0,.5)] backdrop-blur-2xl"
          role="menu"
        >
          <div className="grid gap-1">
            <button className={itemClass} role="menuitem" onClick={() => choose(onView)}>
              <NftMenuIcon name="view" />
              <span>View details</span>
            </button>
            {!nft.archivedAt ? (
              <button className={itemClass} role="menuitem" onClick={() => choose(onEdit)}>
                <NftMenuIcon name="edit" />
                <span>Edit NFT</span>
              </button>
            ) : null}
            {!nft.archivedAt && nft.status !== "MINTED" ? (
              <button className={itemClass} role="menuitem" onClick={() => choose(onMint)}>
                <NftMenuIcon name="mint" />
                <span>{nft.status === "FAILED" ? "Retry mint" : "Mint NFT"}</span>
              </button>
            ) : null}
            {nft.archivedAt ? (
              <button
                className={itemClass}
                role="menuitem"
                onClick={() => choose(() => onAction("restore"))}
              >
                <NftMenuIcon name="restore" />
                <span>Restore NFT</span>
              </button>
            ) : nft.status === "MINTED" ? (
              <button
                className={itemClass}
                role="menuitem"
                onClick={() => choose(() => onAction("archive"))}
              >
                <NftMenuIcon name="archive" />
                <span>Archive NFT</span>
              </button>
            ) : (
              <>
                <div className="my-1 h-px bg-white/[.06]" />
                <button
                  className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[12px] text-rose-300 transition hover:bg-rose-400/[.07]"
                  role="menuitem"
                  onClick={() => choose(() => onAction("delete"))}
                >
                  <NftMenuIcon name="delete" />
                  <span>Delete</span>
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
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
    <div className="relative min-w-[148px]" ref={ref}>
      <button
        type="button"
        className={`group flex h-10 w-full items-center gap-2 rounded-xl border px-3 text-left transition ${open || value ? "border-[rgba(155,123,255,.3)] bg-[linear-gradient(110deg,rgba(141,107,255,.11),rgba(74,221,209,.025))]" : "border-[var(--line)] bg-white/[.025] hover:border-[rgba(155,123,255,.24)] hover:bg-white/[.045]"}`}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${value ? "bg-[#9b7cf5] shadow-[0_0_8px_rgba(155,124,245,.65)]" : "bg-[#465166]"}`}
        />
        <span className="min-w-0 flex-1 truncate text-[10px] font-medium text-[#aeb7c8]">
          {selected.label}
        </span>
        <svg
          aria-hidden="true"
          className={`h-3.5 w-3.5 shrink-0 text-[#657087] transition ${open ? "rotate-180 text-[#aa95f6]" : "group-hover:text-[#9da8ba]"}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m7 10 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open ? (
        <div
          className="absolute left-0 top-[calc(100%+8px)] z-50 min-w-full w-max max-w-[230px] overflow-hidden rounded-[16px] border border-[rgba(155,123,255,.24)] bg-[rgba(8,11,23,.98)] p-2 shadow-[0_22px_60px_rgba(0,0,0,.55),inset_0_1px_rgba(255,255,255,.04)] backdrop-blur-2xl"
          role="listbox"
          aria-label={label}
        >
          <div className="max-h-[245px] space-y-1 overflow-y-auto [scrollbar-color:#4f4378_transparent] [scrollbar-width:thin]">
            {options.map((option) => {
              const active = option.value === value;
              return (
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={`flex w-full items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left text-[10px] transition ${active ? "border-[rgba(155,123,255,.2)] bg-[rgba(155,123,255,.1)] text-[#d8ceff]" : "border-transparent text-[#aab3c4] hover:border-white/[.05] hover:bg-white/[.045] hover:text-white"}`}
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <span
                    className={`grid h-4 w-4 place-items-center rounded-full border text-[9px] ${active ? "border-[#8d6bff] bg-[#8d6bff] text-white" : "border-[#3f485b]"}`}
                  >
                    {active ? "✓" : ""}
                  </span>
                  <span className="truncate">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NftGrid() {
  const connection = useConnection();
  const { sendTransactionAsync } = useSendTransaction();
  const { switchChainAsync } = useSwitchChain();
  const [nfts, setNfts] = useState<CreatorNft[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [standard, setStandard] = useState("");
  const [collection, setCollection] = useState("");
  const [chainId, setChainId] = useState("");
  const [saleStatus, setSaleStatus] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 0, limit: 12 });
  const [collections, setCollections] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingNft, setEditingNft] = useState<CreatorNft | null>(null);
  const [detailNft, setDetailNft] = useState<CreatorNft | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<CreatorNft | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!detailOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDetailOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [detailOpen]);

  useEffect(() => {
    if (!deleteCandidate) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && actionId !== deleteCandidate.id) {
        setDeleteCandidate(null);
        setDeleteError(null);
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [actionId, deleteCandidate]);

  useEffect(() => {
    if (!successNotice) return;
    const timeout = window.setTimeout(() => setSuccessNotice(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [successNotice]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams({ page: String(page), limit: "12", sort });
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (status) params.set("status", status);
    if (standard) params.set("standard", standard);
    if (collection) params.set("collection", collection);
    if (chainId) params.set("chainId", chainId);
    if (saleStatus) params.set("saleStatus", saleStatus);

    // A filter/page change starts a new server request and should immediately
    // replace stale cards with skeletons.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    setError(null);
    apiRequest<{
      data: CreatorNft[];
      meta: {
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
          collections: string[];
        };
      };
    }>(`/api/nfts/mine?${params}`)
      .then((response) => {
        if (!active) return;
        setNfts(response.data);
        setPagination(response.meta.pagination);
        setCollections(response.meta.pagination.collections);
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "Could not load NFTs.");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [chainId, collection, debouncedSearch, page, refreshKey, saleStatus, sort, standard, status]);

  const runAction = async (nft: CreatorNft, action: "delete" | "archive" | "restore") => {
    if (action === "archive" && !window.confirm(`Archive “${nft.name}” from the marketplace?`))
      return;
    setActionId(nft.id);
    setError(null);
    try {
      await apiRequest(`/api/nfts/${nft.id}${action === "delete" ? "" : `/${action}`}`, {
        method: action === "delete" ? "DELETE" : "POST",
      });
      setRefreshKey((value) => value + 1);
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "NFT action failed.");
    } finally {
      setActionId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    const nft = deleteCandidate;
    setActionId(nft.id);
    setDeleteError(null);
    try {
      await apiRequest(`/api/nfts/${nft.id}`, { method: "DELETE" });
      setDeleteCandidate(null);
      setSuccessNotice(`“${nft.name}” was deleted permanently.`);
      setRefreshKey((value) => value + 1);
    } catch (actionError) {
      setDeleteError(actionError instanceof Error ? actionError.message : "Could not delete NFT.");
    } finally {
      setActionId(null);
    }
  };

  const openDetails = async (nft: CreatorNft) => {
    setDetailNft(nft);
    setDetailOpen(true);
    setDetailLoading(true);
    try {
      const response = await apiRequest<{ data: { nft: CreatorNft } }>(`/api/nfts/${nft.id}`);
      setDetailNft(response.data.nft);
    } catch (detailError) {
      setError(detailError instanceof Error ? detailError.message : "Could not load NFT details.");
    } finally {
      setDetailLoading(false);
    }
  };

  const retryMint = async (nft: CreatorNft) => {
    setActionId(nft.id);
    setError(null);
    try {
      const response = await apiRequest<{
        data: {
          mint: {
            nftId: string;
            chainId: number;
            transactionRequest: { to: `0x${string}`; data: `0x${string}`; value: string };
          };
        };
      }>(`/api/nfts/${nft.id}/retry`, { method: "POST" });
      const mint = response.data.mint;
      const mintChainId = mint.chainId as 84532 | 11155111 | 80002;
      if (connection.chainId !== mintChainId) await switchChainAsync({ chainId: mintChainId });
      const transactionHash = await sendTransactionAsync({
        chainId: mintChainId,
        to: mint.transactionRequest.to,
        data: mint.transactionRequest.data,
        value: BigInt(mint.transactionRequest.value),
      });
      await waitForTransactionReceipt(wagmiConfig, {
        chainId: mintChainId,
        hash: transactionHash,
        confirmations: 1,
      });
      await apiRequest(`/api/nfts/${nft.id}/confirm`, {
        method: "POST",
        body: JSON.stringify({ transactionHash }),
      });
      setRefreshKey((value) => value + 1);
    } catch (mintError) {
      setError(mintError instanceof Error ? mintError.message : "Mint retry failed.");
    } finally {
      setActionId(null);
    }
  };

  const saveEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingNft) return;
    const values = new FormData(event.currentTarget);
    const saleType = String(values.get("saleType"));
    const price = String(values.get("price") || "0");
    const immutable = editingNft.status === "MINTED";
    const auctionEnd = String(values.get("auctionEndsAt") || "");
    const payload = {
      name: immutable ? editingNft.name : String(values.get("name")),
      description: immutable ? editingNft.description : String(values.get("description")),
      collectionSlug: String(values.get("collectionSlug")),
      category: String(values.get("category")),
      externalUrl: String(values.get("externalUrl")),
      standard: editingNft.standard,
      supply: editingNft.supply,
      chainId: editingNft.chainId,
      creatorWallet: editingNft.creatorWallet,
      royaltyPercent: editingNft.royaltyBps / 100,
      metadataFrozen: editingNft.metadataFrozen,
      saleType,
      priceWei: saleType === "MINT_ONLY" ? "0" : parseEther(price).toString(),
      ...(saleType === "AUCTION" && auctionEnd
        ? { auctionEndsAt: new Date(auctionEnd).toISOString() }
        : {}),
      unlockable: "",
      rightsConfirmed: true,
      traits: editingNft.traits.map(({ traitType, value }) => ({ traitType, value })),
    };
    const body = new FormData();
    body.append("payload", JSON.stringify(payload));
    const file = values.get("file");
    if (file instanceof File && file.size) body.append("file", file);
    setActionId(editingNft.id);
    try {
      await apiRequest(`/api/nfts/${editingNft.id}`, { method: "PATCH", body });
      setEditingNft(null);
      setRefreshKey((value) => value + 1);
    } catch (editError) {
      setError(editError instanceof Error ? editError.message : "Could not update NFT.");
    } finally {
      setActionId(null);
    }
  };

  const pageNumbers = useMemo(() => {
    const start = Math.max(1, Math.min(page - 2, pagination.pages - 4));
    return Array.from({ length: Math.min(5, pagination.pages) }, (_, index) => start + index);
  }, [page, pagination.pages]);

  const hasFilters = Boolean(
    search || status || standard || collection || chainId || saleStatus || sort !== "newest",
  );
  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatus("");
    setStandard("");
    setCollection("");
    setChainId("");
    setSaleStatus("");
    setSort("newest");
    setPage(1);
  };

  const statusStyle = {
    MINTED: "bg-emerald-400/[.08] text-emerald-300",
    AWAITING_MINT: "bg-amber-400/[.08] text-amber-300",
    FAILED: "bg-rose-400/[.08] text-rose-300",
  } as const;

  return (
    <>
      <Header
        title="My NFTs"
        text="Manage every digital asset created or owned by your studio."
        action={<CreateNftLink />}
      />
      <div className="mb-3 flex gap-2">
        <input
          className="h-10 min-w-0 flex-1 rounded-xl border border-[var(--line)] bg-white/[.025] px-3 text-[11px] outline-none"
          placeholder="Search your NFTs..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
        <span className="inline-flex h-10 items-center rounded-xl border border-[var(--line)] bg-white/[.025] px-3 text-[10px] text-[#7f8ba0]">
          {pagination.total} {pagination.total === 1 ? "NFT" : "NFTs"}
        </span>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <FilterDropdown
          label="Filter by status"
          value={status}
          options={[
            { value: "", label: "All statuses" },
            { value: "MINTED", label: "Minted" },
            { value: "AWAITING_MINT", label: "Awaiting mint" },
            { value: "FAILED", label: "Failed" },
          ]}
          onChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
        />
        <FilterDropdown
          label="Filter by standard"
          value={standard}
          options={[
            { value: "", label: "All standards" },
            { value: "ERC721", label: "ERC-721" },
            { value: "ERC1155", label: "ERC-1155" },
          ]}
          onChange={(value) => {
            setStandard(value);
            setPage(1);
          }}
        />
        <FilterDropdown
          label="Filter by collection"
          value={collection}
          options={[
            { value: "", label: "All collections" },
            ...collections.map((slug) => ({ value: slug, label: slug.replaceAll("-", " ") })),
          ]}
          onChange={(value) => {
            setCollection(value);
            setPage(1);
          }}
        />
        <FilterDropdown
          label="Filter by network"
          value={chainId}
          options={[
            { value: "", label: "All networks" },
            { value: "84532", label: "Base Sepolia" },
            { value: "11155111", label: "Ethereum Sepolia" },
            { value: "80002", label: "Polygon Amoy" },
          ]}
          onChange={(value) => {
            setChainId(value);
            setPage(1);
          }}
        />
        <FilterDropdown
          label="Filter by sale status"
          value={saleStatus}
          options={[
            { value: "", label: "All sale statuses" },
            { value: "NOT_LISTED", label: "Not listed" },
            { value: "LISTED", label: "Listed" },
            { value: "AUCTION", label: "Auction" },
          ]}
          onChange={(value) => {
            setSaleStatus(value);
            setPage(1);
          }}
        />
        <FilterDropdown
          label="Sort NFTs"
          value={sort}
          options={[
            { value: "newest", label: "Newest" },
            { value: "oldest", label: "Oldest" },
            { value: "name", label: "Name A–Z" },
            { value: "tokenId", label: "Token ID" },
          ]}
          onChange={(value) => {
            setSort(value);
            setPage(1);
          }}
        />
        {hasFilters ? (
          <button
            className="group cursor-pointer inline-flex h-10 items-center gap-2 rounded-xl border border-rose-300/[.14] bg-[linear-gradient(110deg,rgba(244,114,182,.07),rgba(141,107,255,.055))] px-3 text-[10px] font-semibold text-[#c9b8cf] shadow-[inset_0_1px_rgba(255,255,255,.035)] transition hover:border-rose-300/[.28] hover:bg-[linear-gradient(110deg,rgba(244,114,182,.12),rgba(141,107,255,.09))] hover:text-white"
            onClick={clearFilters}
            aria-label="Clear all active NFT filters"
          >
            <span className="grid h-5 w-5 place-items-center rounded-[7px] bg-rose-300/[.08] text-rose-200 transition group-hover:bg-rose-300/[.14]">
              <svg
                aria-hidden="true"
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 5h16M7 12h10M10 19h4" />
                <path d="m17 16 4 4m0-4-4 4" />
              </svg>
            </span>
            Clear All Filters
          </button>
        ) : null}
      </div>
      {isLoading ? (
        <div
          className="grid grid-cols-4 gap-3 max-[1150px]:grid-cols-3 max-[820px]:grid-cols-2 max-[520px]:grid-cols-1"
          aria-label="Loading NFTs"
          aria-busy="true"
        >
          {Array.from({ length: 8 }, (_, index) => (
            <NftCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <Card className="border-rose-400/20 py-14 text-center text-[11px] text-rose-300">
          {error}
        </Card>
      ) : nfts.length === 0 ? (
        <Card className="py-14 text-center">
          <strong className="block text-[13px]">
            {hasFilters ? "No matching NFTs" : "No NFTs yet"}
          </strong>
          <p className="mb-0 mt-2 text-[10px] text-[#68748a]">
            {hasFilters
              ? "Clear or change the active filters and try again."
              : "Create and mint your first NFT to see it here."}
          </p>
          {hasFilters ? (
            <button
              className="mt-4 cursor-pointer text-[10px] font-semibold text-[#9d87ee]"
              onClick={clearFilters}
            >
              Clear All Filters
            </button>
          ) : null}
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-3 max-[1150px]:grid-cols-3 max-[820px]:grid-cols-2 max-[520px]:grid-cols-1">
            {nfts.map((nft) => (
              <div key={nft.id}>
                <Card className="group relative h-full p-2 transition hover:-translate-y-0.5 hover:border-[rgba(155,123,255,.28)]">
                  <Link href={`/nft/${nft.id}`}>
                    <NftArtwork nft={nft} />
                  </Link>
                  <NftActionMenu
                    nft={nft}
                    busy={actionId === nft.id}
                    onEdit={() => setEditingNft(nft)}
                    onView={() => void openDetails(nft)}
                    onMint={() => void retryMint(nft)}
                    onAction={(action) => {
                      if (action === "delete") {
                        setDeleteError(null);
                        setDeleteCandidate(nft);
                        return;
                      }
                      void runAction(nft, action);
                    }}
                  />
                  <div className="p-2 pb-0">
                    <span className="block truncate text-[9px] capitalize text-[#657087]">
                      {nft.collectionSlug.replaceAll("-", " ")}
                    </span>
                    <strong className="mt-1 block truncate text-[12px]">{nft.name}</strong>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="truncate text-[10px] text-[#a990fa]">
                        {nft.standard}
                        {nft.tokenId ? ` · #${nft.tokenId}` : ""}
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-1 text-[9px] ${statusStyle[nft.status]}`}
                      >
                        {nft.status === "AWAITING_MINT"
                          ? "Awaiting mint"
                          : nft.status === "MINTED"
                            ? "Minted"
                            : "Failed"}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
          {pagination.pages > 1 ? (
            <nav
              className="mt-5 flex flex-wrap items-center justify-center gap-2"
              aria-label="NFT pages"
            >
              <button
                className="h-9 rounded-xl border border-[var(--line)] px-3 text-[10px] disabled:cursor-not-allowed disabled:opacity-35"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Previous
              </button>
              {pageNumbers.map((number) => (
                <button
                  className={`h-9 min-w-9 rounded-xl border px-3 text-[10px] ${number === page ? "border-[#765ce0] bg-[#765ce0] text-white" : "border-[var(--line)] text-[#8f9aaf] hover:bg-white/[.04]"}`}
                  aria-current={number === page ? "page" : undefined}
                  key={number}
                  onClick={() => setPage(number)}
                >
                  {number}
                </button>
              ))}
              <button
                className="h-9 rounded-xl border border-[var(--line)] px-3 text-[10px] disabled:cursor-not-allowed disabled:opacity-35"
                disabled={page >= pagination.pages || isLoading}
                onClick={() => setPage((current) => Math.min(pagination.pages, current + 1))}
              >
                Next
              </button>
            </nav>
          ) : null}
        </>
      )}
      {successNotice ? (
        <div
          className="fixed right-5 top-5 z-[140] flex max-w-[360px] items-center gap-3 rounded-2xl border border-emerald-300/[.16] bg-[rgba(8,24,24,.96)] px-4 py-3 text-[11px] text-emerald-100 shadow-[0_20px_60px_rgba(0,0,0,.45)] backdrop-blur-xl"
          role="status"
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-400/[.12] text-emerald-300">
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m5 12 4 4L19 6" />
            </svg>
          </span>
          <span className="leading-5">{successNotice}</span>
        </div>
      ) : null}
      {deleteCandidate ? (
        <div
          className="fixed inset-0 z-[130] grid place-items-center bg-[rgba(2,4,11,.84)] p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-nft-title"
          aria-describedby="delete-nft-description"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && actionId !== deleteCandidate.id) {
              setDeleteCandidate(null);
              setDeleteError(null);
            }
          }}
        >
          <section className="w-full max-w-[500px] overflow-hidden rounded-[24px] border border-rose-300/[.14] bg-[rgba(9,12,25,.98)] shadow-[0_32px_100px_rgba(0,0,0,.68)]">
            <header className="flex items-start justify-between border-b border-white/[.06] p-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-rose-300/[.12] bg-rose-400/[.08] text-rose-300">
                  <NftMenuIcon name="delete" />
                </span>
                <div className="min-w-0">
                  <span className="text-[9px] font-bold tracking-[1.4px] text-rose-300/80">
                    PERMANENT ACTION
                  </span>
                  <h2 id="delete-nft-title" className="m-0 mt-1 text-[18px] font-semibold">
                    Delete this NFT?
                  </h2>
                </div>
              </div>
              <button
                type="button"
                className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-xl border border-[var(--line)] text-[#8994a8] transition hover:bg-white/[.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                disabled={actionId === deleteCandidate.id}
                onClick={() => {
                  setDeleteCandidate(null);
                  setDeleteError(null);
                }}
                aria-label="Close delete confirmation"
              >
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </header>

            <div className="p-3">
              <div className="flex items-center gap-4 rounded-2xl border border-white/[.06] bg-white/[.025] p-3">
                <div className="w-[92px] shrink-0 overflow-hidden rounded-xl">
                  <NftArtwork nft={deleteCandidate} />
                </div>
                <div className="min-w-0">
                  <strong className="block truncate text-[13px] text-white">
                    {deleteCandidate.name}
                  </strong>
                  <span className="mt-1.5 block truncate text-[10px] capitalize text-[#707c91]">
                    {deleteCandidate.collectionSlug.replaceAll("-", " ")}
                  </span>
                  <span
                    className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-[9px] ${statusStyle[deleteCandidate.status]}`}
                  >
                    {deleteCandidate.status === "AWAITING_MINT" ? "Awaiting mint" : "Failed"}
                  </span>
                </div>
              </div>

              <div
                id="delete-nft-description"
                className="mt-4 rounded-2xl border border-rose-300/[.12] bg-rose-400/[.055] p-4"
              >
                <div className="flex gap-3">
                  <svg
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-rose-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3 2.8 19a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3Z" />
                    <path d="M12 9v5M12 18h.01" />
                  </svg>
                  <div>
                    <strong className="block text-[11px] text-rose-100">
                      This cannot be undone
                    </strong>
                    <p className="m-0 mt-1 text-[10px] leading-5 text-[#9aa4b6]">
                      The draft, metadata reference and marketplace record will be permanently
                      removed. No on-chain NFT will be affected because this asset has not been
                      minted successfully.
                    </p>
                  </div>
                </div>
              </div>

              {deleteError ? (
                <div
                  className="mt-3 rounded-xl border border-rose-300/[.15] bg-rose-400/[.07] px-3 py-2.5 text-[10px] leading-5 text-rose-200"
                  role="alert"
                >
                  {deleteError}
                </div>
              ) : null}
            </div>

            <footer className="flex items-center justify-end gap-2 border-t border-white/[.06] bg-white/[.012] p-3">
              <button
                type="button"
                className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-rose-300/[.14] bg-[linear-gradient(110deg,#e34862,#b92747)] px-5 text-[11px] font-semibold text-white shadow-[0_10px_28px_rgba(190,35,67,.22)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(190,35,67,.34)] disabled:cursor-not-allowed disabled:opacity-55"
                disabled={actionId === deleteCandidate.id}
                onClick={() => void confirmDelete()}
              >
                {actionId === deleteCandidate.id ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <NftMenuIcon name="delete" />
                )}
                {actionId === deleteCandidate.id ? "Deleting…" : "Delete permanently"}
              </button>
            </footer>
          </section>
        </div>
      ) : null}
      {detailOpen ? (
        <div
          className="fixed inset-0 z-[110] grid place-items-center bg-[rgba(2,4,11,.82)] p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="NFT details"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDetailOpen(false);
          }}
        >
          <section className="max-h-[90vh] w-full max-w-[760px] overflow-y-auto rounded-[24px] border border-[var(--line)] bg-[rgba(9,12,25,.98)] p-3 shadow-[0_32px_100px_rgba(0,0,0,.65)] [scrollbar-width:thin]">
            <header className="flex items-center justify-between">
              <div>
                <span className="text-[9px] font-bold tracking-[1.5px] text-[#8870e4]">
                  NFT DETAILS
                </span>
                <h2 className="m-0 mt-1 text-[18px] font-semibold">
                  {detailLoading ? "Loading asset…" : detailNft?.name}
                </h2>
              </div>
              <button
                className="grid h-9 cursor-pointer w-9 place-items-center rounded-xl border border-[var(--line)] text-[#8994a8] transition hover:bg-white/[.05] hover:text-white"
                onClick={() => setDetailOpen(false)}
                aria-label="Close NFT details"
              >
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </header>
            {detailLoading || !detailNft ? (
              <div className="mt-2 grid animate-pulse grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] gap-4 max-[680px]:grid-cols-1">
                <div className="aspect-square rounded-[18px] bg-[#121a30]" />
                <div className="space-y-4 p-2">
                  <div className="h-4 w-2/3 rounded bg-[#19223a]" />
                  <div className="h-16 rounded-xl bg-[#121a30]" />
                  <div className="grid grid-cols-2 gap-3">
                    {Array.from({ length: 6 }, (_, index) => (
                      <div className="h-16 rounded-xl bg-[#121a30]" key={index} />
                    ))}
                  </div>
                  <div className="h-10 rounded-xl bg-[#19223a]" />
                </div>
              </div>
            ) : (
              <div className="mt-2 grid grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] gap-4 max-[680px]:grid-cols-1">
                <div>
                  <NftArtwork nft={detailNft} />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[9px] ${statusStyle[detailNft.status]}`}
                    >
                      {detailNft.status === "AWAITING_MINT"
                        ? "Awaiting mint"
                        : detailNft.status === "MINTED"
                          ? "Minted"
                          : "Failed"}
                    </span>
                    {detailNft.archivedAt ? (
                      <span className="rounded-full bg-slate-400/[.1] px-2.5 py-1 text-[9px] text-slate-300">
                        Archived
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="">
                  <p className="m-0 text-[11px] leading-5 text-[#8490a5]">
                    {detailNft.description}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-2 max-[430px]:grid-cols-1">
                    {[
                      ["Collection", detailNft.collectionSlug.replaceAll("-", " ")],
                      ["Category", detailNft.category],
                      [
                        "Network",
                        detailNft.chainId === 84532
                          ? "Base Sepolia"
                          : detailNft.chainId === 11155111
                            ? "Ethereum Sepolia"
                            : "Polygon Amoy",
                      ],
                      ["Standard", detailNft.standard],
                      ["Token ID", detailNft.tokenId ?? "Not minted"],
                      ["Supply", String(detailNft.supply)],
                      ["Royalty", `${detailNft.royaltyBps / 100}%`],
                      [
                        "Sale",
                        detailNft.saleType === "MINT_ONLY"
                          ? "Not listed"
                          : detailNft.saleType === "FIXED"
                            ? "Fixed price"
                            : "Auction",
                      ],
                    ].map(([label, value]) => (
                      <div
                        className="rounded-xl border border-white/[.055] bg-white/[.022] p-3"
                        key={label}
                      >
                        <span className="block text-[8px] uppercase tracking-[.8px] text-[#5f6b80]">
                          {label}
                        </span>
                        <strong className="mt-1.5 block truncate text-[10px] capitalize text-[#d9deea]">
                          {value}
                        </strong>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 space-y-2 rounded-xl border border-white/[.055] bg-white/[.018] p-3 text-[9px]">
                    <div className="flex justify-between gap-3">
                      <span className="text-[#657087]">Contract</span>
                      <span className="truncate text-[#a895ef]">
                        {detailNft.contractAddress ?? "Pending mint"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-[#657087]">Metadata</span>
                      <span className="truncate text-[#a895ef]">{detailNft.metadataUri}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      ) : null}
      {editingNft ? (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-[rgba(2,4,11,.82)] p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Edit NFT"
        >
          <form
            className="flex max-h-[90vh] w-full max-w-[680px] flex-col overflow-hidden rounded-[24px] border border-[var(--line)] bg-[rgba(9,12,25,.98)] shadow-[0_32px_100px_rgba(0,0,0,.65)]"
            onSubmit={saveEdit}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-white/[.06] bg-[rgba(9,12,25,.96)] p-3">
              <div>
                <span className="text-[9px] font-bold tracking-[1.5px] text-[#8870e4]">
                  CREATOR ASSET
                </span>
                <h2 className="m-0 mt-1 text-[18px] font-semibold">Edit NFT</h2>
                <p className="m-0 mt-1 text-[10px] text-[#657087]">
                  Update the fields available for this asset state.
                </p>
              </div>
              <button
                type="button"
                className="grid cursor-pointer h-9 w-9 place-items-center rounded-xl border border-[var(--line)] text-[#8994a8] transition hover:bg-white/[.05] hover:text-white"
                onClick={() => setEditingNft(null)}
                aria-label="Close NFT editor"
              >
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto p-3 [scrollbar-color:#4f4378_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#4f4378] hover:[&::-webkit-scrollbar-thumb]:bg-[#66558f]">
              {editingNft.status === "MINTED" ? (
                <p className="m-0 mb-4 rounded-xl border border-amber-300/[.12] bg-amber-400/[.06] p-3 text-[10px] leading-5 text-amber-200">
                  Minted artwork and on-chain metadata are immutable. Only marketplace fields can be
                  changed.
                </p>
              ) : null}
              <div className="mb-4 rounded-[16px] border border-white/[.055] bg-white/[.018] p-4">
                <div className="mb-3">
                  <span className="text-[9px] font-bold tracking-[1.2px] text-[#69758a]">
                    ASSET INFORMATION
                  </span>
                </div>
                <div className="grid gap-4">
                  <label className="grid gap-2 text-[10px] font-semibold text-[#aeb7c8]">
                    Name
                    <input
                      name="name"
                      defaultValue={editingNft.name}
                      disabled={editingNft.status === "MINTED"}
                      className="h-11 rounded-xl border border-[var(--line)] bg-[#0b0f1d] px-3 text-[12px] text-white outline-none transition focus:border-[rgba(155,123,255,.55)] disabled:cursor-not-allowed disabled:opacity-45"
                    />
                  </label>
                  <label className="grid gap-2 text-[10px] font-semibold text-[#aeb7c8]">
                    Description
                    <textarea
                      name="description"
                      defaultValue={editingNft.description}
                      disabled={editingNft.status === "MINTED"}
                      className="min-h-28 resize-y rounded-xl border border-[var(--line)] bg-[#0b0f1d] p-3 text-[12px] leading-5 text-white outline-none transition focus:border-[rgba(155,123,255,.55)] disabled:cursor-not-allowed disabled:opacity-45"
                    />
                  </label>
                </div>
              </div>
              <div className="rounded-[16px] border border-white/[.055] bg-white/[.018] p-4">
                <div className="mb-3">
                  <span className="text-[9px] font-bold tracking-[1.2px] text-[#69758a]">
                    MARKETPLACE SETTINGS
                  </span>
                </div>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-3 max-[520px]:grid-cols-1">
                    <label className="grid gap-1 text-[10px] text-[#8995aa]">
                      Collection slug
                      <input
                        name="collectionSlug"
                        defaultValue={editingNft.collectionSlug}
                        className="h-10 rounded-xl border border-[var(--line)] bg-[#080b15] px-3 text-white"
                      />
                    </label>
                    <label className="grid gap-1 text-[10px] text-[#8995aa]">
                      Category
                      <input
                        name="category"
                        defaultValue={editingNft.category}
                        className="h-10 rounded-xl border border-[var(--line)] bg-[#080b15] px-3 text-white"
                      />
                    </label>
                  </div>
                  <label className="grid gap-1 text-[10px] text-[#8995aa]">
                    External URL
                    <input
                      name="externalUrl"
                      defaultValue={editingNft.externalUrl}
                      className="h-10 rounded-xl border border-[var(--line)] bg-[#080b15] px-3 text-white"
                    />
                  </label>
                  <label className="grid gap-1 text-[10px] text-[#8995aa]">
                    Sale status
                    <select
                      name="saleType"
                      defaultValue={editingNft.saleType}
                      className="h-10 rounded-xl border border-[var(--line)] bg-[#080b15] px-3 text-white"
                    >
                      <option value="MINT_ONLY">Not listed</option>
                      <option value="FIXED">Fixed price</option>
                      <option value="AUCTION">Auction</option>
                    </select>
                  </label>
                  <label className="grid gap-1 text-[10px] text-[#8995aa]">
                    Price (ETH)
                    <input
                      name="price"
                      type="number"
                      min="0"
                      step="0.000001"
                      defaultValue={
                        editingNft.priceWei && editingNft.priceWei !== "0"
                          ? formatEther(BigInt(editingNft.priceWei))
                          : "0"
                      }
                      className="h-10 rounded-xl border border-[var(--line)] bg-[#080b15] px-3 text-white"
                    />
                  </label>
                  <label className="grid gap-1 text-[10px] text-[#8995aa]">
                    Auction end (ISO date)
                    <input
                      name="auctionEndsAt"
                      type="datetime-local"
                      defaultValue={
                        editingNft.auctionEndsAt ? editingNft.auctionEndsAt.slice(0, 16) : ""
                      }
                      className="h-10 rounded-xl border border-[var(--line)] bg-[#080b15] px-3 text-white"
                    />
                  </label>
                  {editingNft.status !== "MINTED" ? (
                    <label className="grid gap-1 text-[10px] text-[#8995aa]">
                      Replace artwork
                      <input
                        name="file"
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        className="rounded-xl border border-[var(--line)] p-3"
                      />
                    </label>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center justify-end gap-2 border-t border-white/[.06] bg-[rgba(9,12,25,.96)] p-3">
              <button
                type="button"
                className="h-11 cursor-pointer rounded-xl border border-[var(--line)] bg-white/[.025] px-5 text-[11px] font-semibold text-[#aeb7c8] transition hover:bg-white/[.06] hover:text-white"
                onClick={() => setEditingNft(null)}
              >
                Cancel
              </button>
              <button
                disabled={actionId === editingNft.id}
                className="h-11 rounded-xl cursor-pointer bg-[linear-gradient(110deg,#8d6bff,#6849ea)] px-5 text-[11px] font-semibold text-white shadow-[0_10px_28px_rgba(105,72,235,.28)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(105,72,235,.38)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}

function Collections() {
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  type CollectionCard = {
    id: string;
    name: string;
    slug: string;
    bannerUrl: string;
    chainId: number;
    royaltyBps: number;
    isVerified: boolean;
    itemCount: number;
    floorPriceWei: string;
  };
  type CollectionsResult = {
    myCollections: {
      success: boolean;
      message: string;
      items: CollectionCard[];
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
  const collectionsQuery = useQuery({
    queryKey: ["creator", "collections", page],
    queryFn: () =>
      graphQLRequest<CollectionsResult>(
        `query MyCollections($page: Int!) { myCollections(page: $page) { success message items { id name slug bannerUrl chainId royaltyBps isVerified itemCount floorPriceWei } pagination { page limit total pages hasNextPage hasPreviousPage } } }`,
        { page },
      ),
    staleTime: 30_000,
  });
  const result = collectionsQuery.data?.myCollections;
  const chainNames: Record<number, string> = {
    84532: "Base Sepolia",
    11155111: "Ethereum Sepolia",
    80002: "Polygon Amoy",
  };
  const floor = (value: string) =>
    value
      ? `${Number(formatEther(BigInt(value))).toLocaleString(undefined, { maximumFractionDigits: 4 })} ETH`
      : "—";
  return (
    <>
      <Header
        title="Collections"
        text="Organize your work into recognizable worlds for collectors."
        action={
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-[linear-gradient(110deg,#8d6bff,#6849ea)] px-4 text-[11px] font-semibold shadow-[0_10px_28px_rgba(105,72,235,.25)] transition hover:-translate-y-0.5"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
            >
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            New collection
          </button>
        }
      />
      {collectionsQuery.isPending ? (
        <div className="grid grid-cols-3 gap-4 max-[950px]:grid-cols-2 max-[600px]:grid-cols-1">
          {Array.from({ length: 9 }, (_, index) => (
            <div
              key={index}
              aria-hidden="true"
              className="animate-pulse overflow-hidden rounded-[20px] border border-[var(--line)] bg-white/[.022] p-2"
            >
              <div className="h-36 rounded-[14px] bg-white/[.055]" />
              <div className="p-3">
                <span className="block h-3 w-2/3 rounded bg-white/[.08]" />
                <span className="mt-3 block h-2 w-1/3 rounded bg-white/[.045]" />
                <div className="mt-5 flex justify-between">
                  <span className="h-7 w-14 rounded bg-white/[.05]" />
                  <span className="h-7 w-16 rounded bg-white/[.05]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : collectionsQuery.isError ? (
        <div className="grid min-h-64 place-items-center rounded-[20px] border border-rose-400/10 bg-rose-400/[.025] text-center">
          <div>
            <p className="text-[12px] text-rose-300">
              {collectionsQuery.error instanceof Error
                ? collectionsQuery.error.message
                : "Collections could not be loaded."}
            </p>
            <button
              type="button"
              onClick={() => collectionsQuery.refetch()}
              className="mt-3 rounded-xl border border-white/[.09] px-4 py-2 text-[11px] hover:bg-white/[.05]"
            >
              Try again
            </button>
          </div>
        </div>
      ) : result?.items.length ? (
        <>
          <div className="grid grid-cols-3 gap-4 max-[950px]:grid-cols-2 max-[600px]:grid-cols-1">
            {result.items.map((collection) => (
              <Card className="group overflow-hidden p-2" key={collection.id}>
                <div className="relative h-36 overflow-hidden rounded-[14px] bg-[#151a31]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${API_URL}${collection.bannerUrl}`}
                    alt={`${collection.name} banner`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="absolute bottom-2 left-2 rounded-full border border-white/10 bg-[#050711bf] px-2 py-1 text-[9px] backdrop-blur-xl">
                    {chainNames[collection.chainId] ?? `Chain ${collection.chainId}`}
                  </span>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between gap-3">
                    <strong className="truncate text-[13px]">{collection.name}</strong>
                    <span className="text-[9px] text-[#75678f]">
                      {collection.royaltyBps / 100}% royalty
                    </span>
                  </div>
                  <small className="mt-1 block truncate text-[9px] text-[#59657a]">
                    /{collection.slug}
                  </small>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <span>
                      <small className="block text-[9px] text-[#657087]">Items</small>
                      <b className="text-[11px]">{collection.itemCount}</b>
                    </span>
                    <span className="text-right">
                      <small className="block text-[9px] text-[#657087]">Floor</small>
                      <b className="text-[11px] text-[var(--cyan)]">
                        {floor(collection.floorPriceWei)}
                      </b>
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {result.pagination.pages > 1 && (
            <nav
              aria-label="Collection pages"
              className="mt-5 flex items-center justify-between rounded-[16px] border border-white/[.06] bg-white/[.018] p-2"
            >
              <span className="px-2 text-[10px] text-[#687389]">
                Page {result.pagination.page} of {result.pagination.pages} ·{" "}
                {result.pagination.total} collections
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  disabled={!result.pagination.hasPreviousPage}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  aria-label="Previous collections page"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-white/[.08] text-[#9ba5b7] transition hover:bg-white/[.05] disabled:opacity-30"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                  >
                    <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  disabled={!result.pagination.hasNextPage}
                  onClick={() => setPage((value) => value + 1)}
                  aria-label="Next collections page"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-white/[.08] text-[#9ba5b7] transition hover:bg-white/[.05] disabled:opacity-30"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                  >
                    <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </nav>
          )}
        </>
      ) : (
        <div className="grid min-h-64 place-items-center rounded-[20px] border border-dashed border-white/[.09] bg-white/[.015] text-center">
          <div>
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#8d72ee]/10 text-[#a996ef]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-5 w-5"
              >
                <rect x="4" y="4" width="16" height="16" rx="3" />
                <path d="m8 15 3-3 2 2 3-4 2 3" />
              </svg>
            </span>
            <h2 className="mb-1 mt-3 text-sm">Create your first collection</h2>
            <p className="text-[10px] text-[#657087]">
              Your published collection worlds will appear here.
            </p>
          </div>
        </div>
      )}
      <CreateCollectionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => {
          setPage(1);
          void collectionsQuery.refetch();
        }}
      />
    </>
  );
}

function DataScreen({ type }: { type: keyof typeof tableRows }) {
  const config = {
    listings: [
      "MARKET",
      "Active listings",
      "Monitor and manage assets currently available to collectors.",
      ["Asset", "Sale type", "Price", "Performance", "Status"],
    ],
    auctions: [
      "LIVE SALES",
      "Auctions",
      "Track bids, reserve prices, and auction countdowns.",
      ["Asset", "Top bid", "Activity", "Time remaining", "Status"],
    ],
    offers: [
      "INBOX",
      "Offers received",
      "Review and respond to offers from collectors.",
      ["Asset", "Collector", "Offer", "Expires", "Status"],
    ],
    sales: [
      "HISTORY",
      "Sales history",
      "A complete record of your studio's settled sales.",
      ["Asset", "Buyer", "Amount", "Date", "Status"],
    ],
  } as const;
  const [, title, text, heads] = config[type];
  return (
    <>
      <Header title={title} text={text} action={<Button secondary>Export CSV</Button>} />
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--line)] bg-white/[.018]">
                {heads.map((h) => (
                  <th
                    className="px-4 py-3 text-[9px] font-bold uppercase tracking-[1px] text-[#68748a]"
                    key={h}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows[type].map((row) => (
                <tr
                  className="border-b border-white/[.05] last:border-0 hover:bg-white/[.018]"
                  key={row[0]}
                >
                  {row.map((cell, j) => (
                    <td
                      className={`px-4 py-4 text-[11px] ${j === 0 ? "font-semibold text-[#e7eaf2]" : "text-[#8290a5]"}`}
                      key={cell}
                    >
                      {j === 4 ? (
                        <span className="rounded-full bg-emerald-400/[.07] px-2 py-1 text-[9px] text-emerald-300">
                          {cell}
                        </span>
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function Earnings() {
  return (
    <>
      <Header
        title="Earnings"
        text="Understand revenue across sales, chains, and collections."
        action={<Button secondary>Download report</Button>}
      />
      <div className="grid grid-cols-3 gap-3 max-[800px]:grid-cols-1">
        {[
          ["Available balance", "18.42 ETH", "≈ $46,184"],
          ["Pending settlement", "3.80 ETH", "≈ $9,527"],
          ["Lifetime earnings", "126.74 ETH", "≈ $317,940"],
        ].map(([a, b, c]) => (
          <Card key={a}>
            <span className="text-[10px] text-[#707c91]">{a}</span>
            <strong className="mt-3 block text-2xl">{b}</strong>
            <small className="mt-2 block text-[10px] text-[#596579]">{c}</small>
          </Card>
        ))}
      </div>
      <Card className="mt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base">Revenue by collection</h2>
          <Button>Withdraw earnings</Button>
        </div>
        <div className="mt-6 space-y-5">
          {[
            ["Aether Dimensions", "68%", "86.19 ETH"],
            ["Synthetic Nature", "21%", "26.62 ETH"],
            ["Prismatic Forms", "11%", "13.93 ETH"],
          ].map(([name, width, value]) => (
            <div key={name}>
              <div className="mb-2 flex justify-between text-[10px]">
                <span>{name}</span>
                <span className="text-[#8894a8]">{value}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[.045]">
                <span
                  className="block h-full rounded-full bg-[linear-gradient(90deg,#7456e7,#4dd9cf)]"
                  style={{ width }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function Royalties() {
  return (
    <>
      <Header title="Royalties" text="Track ongoing earnings when your work changes hands." />
      <div className="grid grid-cols-[.7fr_1.3fr] gap-4 max-[900px]:grid-cols-1">
        <Card>
          <span className="text-[10px] text-[#707c91]">Royalty earnings</span>
          <strong className="mt-3 block text-3xl">14.28 ETH</strong>
          <small className="mt-2 block text-[10px] text-emerald-300">+18.2% this month</small>
          <div className="mt-6 rounded-xl border border-white/[.05] bg-white/[.02] p-3">
            <span className="text-[10px] text-[#6c788d]">Default royalty</span>
            <div className="mt-2 flex items-center justify-between">
              <strong>5.0%</strong>
              <button className="text-[10px] text-[#9d87ee]">Edit</button>
            </div>
          </div>
        </Card>
        <Card>
          <h2 className="text-base">Royalty activity</h2>
          <div className="mt-3">
            {[
              ["Beyond the Horizon", "0.16 ETH", "Secondary sale"],
              ["Celestial Drift", "0.24 ETH", "Secondary sale"],
              ["Signal Garden #1048", "0.11 ETH", "Secondary sale"],
            ].map(([name, value, note]) => (
              <div
                className="flex items-center gap-3 border-b border-white/[.05] py-3 last:border-0"
                key={name}
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[rgba(155,123,255,.09)] text-[#a990fa]">
                  %
                </span>
                <div className="flex-1">
                  <strong className="block text-[11px]">{name}</strong>
                  <small className="text-[9px] text-[#657087]">{note}</small>
                </div>
                <b className="text-[11px] text-emerald-300">+{value}</b>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function Wallets() {
  return (
    <>
      <Header
        title="Linked wallets"
        text="Manage wallets authorized to mint and receive creator earnings."
        action={<Button>Link wallet +</Button>}
      />
      <Card>
        <div className="flex items-center gap-4 max-[560px]:items-start">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(145deg,#e17739,#7e3b9b)] text-lg">
            ◆
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <strong className="truncate text-[12px]">0x7A2F...91C4</strong>
              <span className="rounded-full bg-emerald-400/[.08] px-2 py-1 text-[9px] text-emerald-300">
                Primary
              </span>
            </div>
            <small className="mt-1 block text-[10px] text-[#68748a]">
              Ethereum · Connected Jul 12, 2026
            </small>
          </div>
          <Button secondary>Manage</Button>
        </div>
      </Card>
    </>
  );
}

function Settings() {
  return (
    <>
      <Header
        title="Profile settings"
        text="Keep your public creator identity and studio information up to date."
      />
      <div className="grid grid-cols-[220px_1fr] gap-4 max-[750px]:grid-cols-1">
        <Card className="self-start text-center">
          <span className="mx-auto grid h-24 w-24 place-items-center rounded-[28px] bg-[linear-gradient(145deg,#8d6bff,#45cfc5)] text-2xl font-bold">
            AS
          </span>
          <strong className="mt-4 block text-[13px]">Aether Studio</strong>
          <small className="mt-1 block text-[10px] text-emerald-300">Verified creator</small>
          <div className="mt-4">
            <Button secondary>Change image</Button>
          </div>
        </Card>
        <Card>
          <form className="grid gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
              <Field label="Display name">
                <input defaultValue="Aether Studio" />
              </Field>
              <Field label="Username">
                <input defaultValue="aether.studio" />
              </Field>
            </div>
            <Field label="Bio">
              <textarea defaultValue="Exploring the space between generative systems and human imagination." />
            </Field>
            <div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
              <Field label="Email">
                <input type="email" defaultValue="studio@aether.xyz" />
              </Field>
              <Field label="Website">
                <input type="url" defaultValue="https://aether.xyz" />
              </Field>
            </div>
            <div className="flex justify-end">
              <Button>Save changes</Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}

export default function CreatorSection({ section }: { section: CreatorSectionName }) {
  if (section === "overview") return <CreatorOverview />;
  if (section === "create") return <CreateNftForm />;
  if (section === "nfts") return <NftGrid />;
  if (section === "collections") return <Collections />;
  if (["listings", "auctions", "offers", "sales"].includes(section))
    return <DataScreen type={section as keyof typeof tableRows} />;
  if (section === "earnings") return <Earnings />;
  if (section === "royalties") return <Royalties />;
  if (section === "wallets") return <Wallets />;
  return <Settings />;
}
