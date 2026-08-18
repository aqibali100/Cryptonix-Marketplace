"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { apiRequest, graphQLRequest } from "../../lib/api";

export type CreatedCollection = {
  id: string;
  name: string;
  slug: string;
  description: string;
  website: string;
  chainId: number;
  royaltyBps: number;
  bannerUrl: string;
  isVerified: boolean;
  createdAt: string;
};
const mutation = /* GraphQL */ `
  mutation CreateCollection($input: CreateCollectionInput!) {
    createCollection(input: $input) {
      success
      message
      collection {
        id
        name
        slug
        description
        website
        chainId
        royaltyBps
        bannerUrl
        isVerified
        createdAt
      }
    }
  }
`;

function CreatorDropdown({
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
    const outside = (event: MouseEvent) =>
      !ref.current?.contains(event.target as Node) && setOpen(false);
    const escape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`group flex h-11 w-full items-center gap-2 rounded-xl border px-3 text-left transition ${open || value ? "border-[rgba(155,123,255,.3)] bg-[linear-gradient(110deg,rgba(141,107,255,.11),rgba(74,221,209,.025))]" : "border-white/[.09] bg-[#0b0f20] hover:border-[rgba(155,123,255,.24)]"}`}
      >
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#9b7cf5] shadow-[0_0_8px_rgba(155,124,245,.65)]" />
        <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-[#c1c8d5]">
          {selected.label}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`h-3.5 w-3.5 text-[#657087] transition ${open ? "rotate-180 text-[#aa95f6]" : ""}`}
        >
          <path d="m7 10 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div
          role="listbox"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+8px)] z-50 w-full min-w-[180px] overflow-hidden rounded-[16px] border border-[rgba(155,123,255,.24)] bg-[rgba(8,11,23,.98)] p-2 shadow-[0_22px_60px_rgba(0,0,0,.55),inset_0_1px_rgba(255,255,255,.04)] backdrop-blur-2xl"
        >
          <div className="max-h-[280px] space-y-1 overflow-y-auto [scrollbar-width:thin]">
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
                  className={`flex w-full items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left text-[10px] transition ${active ? "border-[rgba(155,123,255,.2)] bg-[rgba(155,123,255,.1)] text-[#d8ceff]" : "border-transparent text-[#aab3c4] hover:bg-white/[.045] hover:text-white"}`}
                >
                  <span
                    className={`grid h-4 w-4 place-items-center rounded-full border ${active ? "border-[#8d6bff] bg-[#8d6bff]" : "border-[#3f485b]"}`}
                  >
                    {active && (
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-2.5 w-2.5"
                      >
                        <path d="m3 8 3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  {option.label}
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
}: {
  name: "close" | "collection" | "link" | "image" | "sparkles" | "loader";
}) {
  const paths = {
    close: <path d="m6 6 12 12M18 6 6 18" />,
    collection: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="m8 15 3-3 2 2 3-4 2 3" />
        <circle cx="9" cy="9" r="1" />
      </>
    ),
    link: (
      <>
        <path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.1 1" />
        <path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1" />
      </>
    ),
    image: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3-3a2 2 0 0 0-3 0l-9 9" />
      </>
    ),
    sparkles: (
      <>
        <path d="m12 3-1.4 3.6L7 8l3.6 1.4L12 13l1.4-3.6L17 8l-3.6-1.4L12 3Z" />
        <path d="m5 14-.8 2.2L2 17l2.2.8L5 20l.8-2.2L8 17l-2.2-.8L5 14Z" />
      </>
    ),
    loader: <path d="M21 12a9 9 0 1 1-6.2-8.6" />,
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
      className={`h-4 w-4 ${name === "loader" ? "animate-spin" : ""}`}
    >
      {paths[name]}
    </svg>
  );
}

export default function CreateCollectionModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (collection: CreatedCollection) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [banner, setBanner] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [chainId, setChainId] = useState("84532");
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && !busy && onClose();
    document.addEventListener("keydown", close);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", close);
      document.body.style.overflow = "";
    };
  }, [busy, onClose, open]);
  if (!open) return null;
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    const values = new FormData(event.currentTarget);
    try {
      if (!banner) throw new Error("Choose a collection banner.");
      const uploadBody = new FormData();
      uploadBody.append("file", banner);
      const uploaded = await apiRequest<{ data: { cid: string } }>("/api/collections/banner", {
        method: "POST",
        body: uploadBody,
      });
      const result = await graphQLRequest<{ createCollection: { collection: CreatedCollection } }>(
        mutation,
        {
          input: {
            name,
            description: String(values.get("description")),
            chainId: Number(values.get("chainId")),
            royaltyPercent: Number(values.get("royaltyPercent")),
            bannerCid: uploaded.data.cid,
            website: String(values.get("website")),
            imageUrl: "",
          },
        },
      );
      onCreated(result.createCollection.collection);
      onClose();
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "Collection could not be created.",
      );
    } finally {
      setBusy(false);
    }
  };
  const field =
    "h-11 w-full rounded-xl border border-white/[.09] bg-[#0b0f20] px-3 text-[12px] text-white outline-none transition placeholder:text-[#4f5a70] focus:border-[#8d72ee]/55";
  return createPortal(
    <div
      className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-[#02040bd9] p-4 backdrop-blur-md"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && !busy && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="collection-modal-title"
        className="my-auto w-[min(940px,100%)] overflow-visible rounded-[24px] border border-white/[.1] bg-[linear-gradient(145deg,#11162b,#090d1b)] shadow-[0_32px_100px_rgba(0,0,0,.65)]"
      >
        <header className="relative border-b border-white/[.07] p-3">
          <div className="absolute right-12 top-[-60px] h-40 w-40 rounded-full bg-violet-500/15 blur-[60px]" />
          <div className="relative flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] border border-[#8d72ee]/25 bg-[#8d72ee]/10 text-[#ae9afb]">
              <Icon name="collection" />
            </span>
            <div>
              <span className="text-[10px] font-bold tracking-[1.7px] text-[var(--cyan)]">
                NEW COLLECTION
              </span>
              <h2 id="collection-modal-title" className="m-0 mt-1 text-xl tracking-[-.7px]">
                Create your collection
              </h2>
              <p className="mb-0 mt-1 text-[11px] text-[#6e798e]">
                Build a recognizable home for your NFT series.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              aria-label="Close dialog"
              className="ml-auto grid h-9 w-9 cursor-pointer place-items-center rounded-xl border border-white/[.08] bg-white/[.025] text-[#8993a7] transition hover:bg-white/[.07] hover:text-white"
            >
              <Icon name="close" />
            </button>
          </div>
        </header>
        <form onSubmit={(event) => void submit(event)} className="p-3">
          <div className="grid grid-cols-[.86fr_1.14fr] gap-x-6 gap-y-4 max-[760px]:grid-cols-1">
            <label className="col-start-2 row-start-1 grid gap-2 max-[760px]:col-start-1 max-[760px]:row-auto">
              <span className="text-[11px] font-semibold text-[#aeb6c6]">Collection name</span>
              <input
                className={field}
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                minLength={3}
                maxLength={60}
                placeholder="e.g. Neon Horizons"
                required
              />
              <small className="truncate text-[10px] text-[#59657a]">
                URL: cryptonix.com/collection/{slug || "your-collection"}
              </small>
            </label>
            <label className="col-start-2 row-start-2 grid gap-2 max-[760px]:col-start-1 max-[760px]:row-auto">
              <span className="text-[11px] font-semibold text-[#aeb6c6]">Description</span>
              <textarea
                name="description"
                minLength={20}
                maxLength={800}
                required
                rows={4}
                placeholder="Tell collectors what makes this collection unique…"
                className={`${field} h-auto resize-none py-3 leading-5`}
              />
            </label>
            <label className="col-start-1 row-span-4 row-start-1 grid content-start gap-2 max-[760px]:row-auto">
              <span className="text-[11px] font-semibold text-[#aeb6c6]">Collection banner</span>
              <span className="relative grid min-h-[354px] cursor-pointer place-items-center overflow-hidden rounded-2xl border border-dashed border-[#8d72ee]/35 bg-[linear-gradient(145deg,rgba(141,114,238,.07),rgba(36,185,177,.025))] transition hover:border-[#8d72ee]/60 max-[760px]:min-h-44">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="Banner preview" className="h-full w-full object-cover" />
                ) : (
                  <span className="grid justify-items-center gap-2 text-[#7e899e]">
                    <Icon name="image" />
                    <small className="text-[10px]">Upload PNG, JPG or WEBP · Max 10 MB</small>
                  </span>
                )}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  required
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    if (file && file.size > 10 * 1024 * 1024) {
                      setError("Banner cannot exceed 10 MB.");
                      return;
                    }
                    setBanner(file);
                    setError("");
                    setPreview(file ? URL.createObjectURL(file) : "");
                  }}
                />
              </span>
            </label>
            <div className="col-start-2 row-start-3 grid max-[760px]:col-start-1 max-[760px]:row-auto">
              <label className="grid gap-2">
                <span className="text-[11px] font-semibold text-[#aeb6c6]">
                  Website <i className="font-normal not-italic text-[#59657a]">(optional)</i>
                </span>
                <span className="relative">
                  <input
                    name="website"
                    type="url"
                    placeholder="https://"
                    className={`${field} pl-10`}
                  />
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#647087]">
                    <Icon name="link" />
                  </span>
                </span>
              </label>
            </div>
            <div className="col-start-2 row-start-4 grid grid-cols-2 gap-3 max-[760px]:col-start-1 max-[760px]:row-auto max-[520px]:grid-cols-1">
              <label className="grid gap-2">
                <span className="text-[11px] font-semibold text-[#aeb6c6]">Blockchain</span>
                <input type="hidden" name="chainId" value={chainId} />
                <CreatorDropdown
                  label="Blockchain"
                  value={chainId}
                  onChange={setChainId}
                  options={[
                    { value: "84532", label: "Base Sepolia" },
                    { value: "11155111", label: "Ethereum Sepolia" },
                    { value: "80002", label: "Polygon Amoy" },
                  ]}
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[11px] font-semibold text-[#aeb6c6]">Creator royalty</span>
                <span className="relative">
                  <input
                    name="royaltyPercent"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    defaultValue="5"
                    required
                    className={`${field} pr-10`}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#647087]">
                    %
                  </span>
                </span>
                <small className="text-[9px] text-[#59657a]">
                  Applied to secondary sales · Max 10%
                </small>
              </label>
            </div>
            {error && (
              <p
                role="alert"
                className="col-span-2 m-0 rounded-xl border border-rose-400/15 bg-rose-400/[.06] px-3 py-2.5 text-[11px] text-rose-300 max-[760px]:col-span-1"
              >
                {error}
              </p>
            )}
          </div>
          <footer className="mt-6 flex justify-end gap-2 border-t border-white/[.06] pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="h-11 cursor-pointer rounded-xl border border-white/[.09] px-5 text-[11px] font-semibold text-[#9da7b9] hover:bg-white/[.04]"
            >
              Cancel
            </button>
            <button
              disabled={busy}
              className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-[linear-gradient(110deg,#8d6bff,#6849ea)] px-5 text-[11px] font-semibold shadow-[0_10px_28px_rgba(105,72,235,.28)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon name={busy ? "loader" : "sparkles"} />
              {busy ? "Creating…" : "Create collection"}
            </button>
          </footer>
        </form>
      </div>
    </div>,
    document.body,
  );
}
