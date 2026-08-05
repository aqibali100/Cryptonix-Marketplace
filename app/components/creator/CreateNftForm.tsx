"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useConnection, useSendTransaction, useSwitchChain } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { parseEther } from "viem";
import { z } from "zod";
import { useAuth } from "../auth/AuthProvider";
import { apiRequest } from "../../lib/api";
import { wagmiConfig } from "../../lib/wagmi";
import CreateNftProgress from "./CreateNftProgress";
import CreatorNavIcon from "./CreatorNavIcon";

type Step = 1 | 2 | 3 | 4;
type EditionType = "single" | "multiple";
type SaleType = "mint-only" | "fixed" | "auction";
type Trait = { id: number; type: string; value: string };

const MAX_FILE_SIZE = 100 * 1024 * 1024;
const MAX_EDITION_SUPPLY = 10_000;
const allowedFileTypes = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "video/mp4",
  "audio/mpeg",
];

const createNftSchema = z
  .object({
    file: z
      .custom<File | null>(
        (value) => typeof File !== "undefined" && value instanceof File,
        "Artwork is required before you can continue.",
      )
      .refine((value) => !value || value.size > 0, "Choose a non-empty artwork file.")
      .refine((value) => !value || value.size <= MAX_FILE_SIZE, "Artwork cannot exceed 100 MB.")
      .refine(
        (value) => !value || allowedFileTypes.includes(value.type),
        "Upload a PNG, JPG, WEBP, GIF, MP4 or MP3 file.",
      ),
    editionType: z.enum(["single", "multiple"]),
    supply: z.string(),
    name: z.string().trim().min(3, "NFT name must be at least 3 characters.").max(80),
    description: z.string().trim().min(10, "Description must be at least 10 characters.").max(1000),
    collection: z.string().min(1, "Select a collection."),
    category: z.string().min(1, "Select a category."),
    externalUrl: z
      .string()
      .trim()
      .refine((value) => {
        if (!value) return true;
        try {
          const url = new URL(value);
          return url.protocol === "http:" || url.protocol === "https:";
        } catch {
          return false;
        }
      }, "Enter a valid http:// or https:// URL."),
    traits: z.array(z.object({ id: z.number(), type: z.string(), value: z.string() })),
    chain: z.string().min(1, "Select a blockchain network."),
    walletAddress: z.string().min(1, "Connect your creator wallet before continuing."),
    royalty: z.string(),
    freezeMetadata: z.boolean(),
    saleType: z.enum(["mint-only", "fixed", "auction"]),
    price: z.string(),
    auctionDuration: z.string(),
    unlockable: z.string().max(2000, "Unlockable content cannot exceed 2,000 characters."),
    rightsConfirmed: z.boolean().refine(Boolean, "You must confirm content ownership."),
  })
  .superRefine((data, context) => {
    if (data.editionType === "multiple") {
      const supply = Number(data.supply);
      if (!Number.isInteger(supply) || supply < 2 || supply > MAX_EDITION_SUPPLY) {
        context.addIssue({
          code: "custom",
          path: ["supply"],
          message: "Supply must be a whole number between 2 and 10,000.",
        });
      }
    }

    data.traits.forEach((trait, index) => {
      if (Boolean(trait.type.trim()) !== Boolean(trait.value.trim())) {
        context.addIssue({
          code: "custom",
          path: ["traits", index, trait.type.trim() ? "value" : "type"],
          message: "Complete both property fields or remove this property.",
        });
      }
    });

    const royalty = Number(data.royalty);
    if (data.royalty.trim() === "" || !Number.isFinite(royalty) || royalty < 0 || royalty > 10) {
      context.addIssue({
        code: "custom",
        path: ["royalty"],
        message: "Royalty must be between 0% and 10%.",
      });
    }

    if (data.saleType !== "mint-only") {
      const price = Number(data.price);
      if (data.price.trim() === "" || !Number.isFinite(price) || price <= 0) {
        context.addIssue({
          code: "custom",
          path: ["price"],
          message:
            data.saleType === "auction"
              ? "Enter a valid minimum bid."
              : "Enter a valid sale price.",
        });
      }
    }

    if (data.saleType === "auction" && !data.auctionDuration) {
      context.addIssue({
        code: "custom",
        path: ["auctionDuration"],
        message: "Select an auction duration.",
      });
    }
  });

type CreateNftFormData = z.infer<typeof createNftSchema>;

const stepFields: Record<1 | 2 | 3, Array<keyof CreateNftFormData>> = {
  1: ["file", "editionType", "supply"],
  2: ["name", "description", "collection", "category", "externalUrl", "traits"],
  3: [
    "chain",
    "walletAddress",
    "royalty",
    "freezeMetadata",
    "saleType",
    "price",
    "auctionDuration",
    "unlockable",
    "rightsConfirmed",
  ],
};

function firstValidationMessage(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  if ("message" in value && typeof value.message === "string") return value.message;
  for (const child of Object.values(value)) {
    const message = firstValidationMessage(child);
    if (message) return message;
  }
  return null;
}

function ValidationError({ error }: { error: unknown }) {
  const message = firstValidationMessage(error);
  return message ? (
    <small className="mt-1.5 block text-[10px] font-medium text-rose-300" role="alert">
      {message}
    </small>
  ) : null;
}

const inputClass =
  "mt-2 h-11 w-full rounded-xl border border-[var(--line)] bg-[#0b0f1e] px-3 text-[12px] font-normal text-white outline-none transition placeholder:text-[#4e586c] focus:border-[rgba(155,123,255,.55)]";

type MintChainId = 84532 | 11155111 | 80002;

const chains: Array<{
  id: string;
  chainId: MintChainId;
  name: string;
  symbol: string;
  badge: string;
}> = [
  { id: "base-sepolia", chainId: 84532, name: "Base Sepolia", symbol: "ETH", badge: "Recommended" },
  {
    id: "ethereum-sepolia",
    chainId: 11155111,
    name: "Ethereum Sepolia",
    symbol: "ETH",
    badge: "Testnet",
  },
  { id: "polygon-amoy", chainId: 80002, name: "Polygon Amoy", symbol: "POL", badge: "Testnet" },
];

type MintApiResponse = {
  success: true;
  code: "NFT_READY_TO_MINT";
  message: string;
  data: {
    nft: { id: string };
    mint: {
      chainId: MintChainId;
      transactionRequest: {
        to: `0x${string}`;
        data: `0x${string}`;
        value: string;
      };
    };
  };
};

function auctionEndIso(duration: string) {
  const durationMs =
    duration === "24-hours"
      ? 24 * 60 * 60 * 1000
      : duration === "7-days"
        ? 7 * 24 * 60 * 60 * 1000
        : 3 * 24 * 60 * 60 * 1000;
  return new Date(Date.now() + durationMs).toISOString();
}

function UploadIcon() {
  return (
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
      <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="m6 12 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ChainIcon() {
  return (
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
      <path d="M10 13a5 5 0 0 0 7.1.1l2-2A5 5 0 0 0 12 4l-1.1 1.1" />
      <path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1" />
    </svg>
  );
}

function SectionHeading({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="mb-3 flex items-start gap-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] border border-[rgba(155,123,255,.2)] bg-[rgba(155,123,255,.1)] text-[11px] font-bold text-[#b6a4f8]">
        {number}
      </span>
      <div>
        <h2 className="m-0 text-[14px] font-semibold text-[#edf0f7]">{title}</h2>
        <p className="mb-0 mt-1 text-[10px] leading-4 text-[#657087]">{text}</p>
      </div>
    </div>
  );
}

function ChoiceCard({
  active,
  title,
  text,
  onClick,
  badge,
}: {
  active: boolean;
  title: string;
  text: string;
  onClick: () => void;
  badge?: string;
}) {
  return (
    <button
      aria-pressed={active}
      className={`relative min-h-[86px] cursor-pointer rounded-2xl border p-2 text-left transition ${active ? "border-[rgba(155,123,255,.5)] bg-[linear-gradient(120deg,rgba(141,107,255,.13),rgba(83,232,220,.035))] shadow-[inset_0_0_0_1px_rgba(155,123,255,.08)]" : "border-[var(--line)] bg-white/[.018] hover:border-white/[.13] hover:bg-white/[.035]"}`}
      onClick={onClick}
      type="button"
    >
      <span className="flex items-center justify-between gap-2">
        <strong className="text-[11px] text-[#e8ebf3]">{title}</strong>
        {badge && (
          <span className="rounded-full bg-emerald-400/[.09] px-2 py-1 text-[8px] font-semibold text-emerald-300">
            {badge}
          </span>
        )}
      </span>
      <small className="mt-1.5 block text-[9px] leading-4 text-[#667187]">{text}</small>
      {active && (
        <span className="absolute bottom-2.5 right-2.5 grid h-5 w-5 place-items-center rounded-full bg-[#8060ed] text-white [&_svg]:h-3 [&_svg]:w-3">
          <CheckIcon />
        </span>
      )}
    </button>
  );
}

export default function CreateNftForm() {
  const auth = useAuth();
  const connection = useConnection();
  const { sendTransactionAsync } = useSendTransaction();
  const { switchChainAsync } = useSwitchChain();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const nextTraitId = useRef(2);
  const [step, setStep] = useState<Step>(1);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [mintedNftId, setMintedNftId] = useState<string | null>(null);
  const [editionType, setEditionType] = useState<EditionType>("single");
  const [supply, setSupply] = useState("1");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [collection, setCollection] = useState("aether-dimensions");
  const [category, setCategory] = useState("art");
  const [externalUrl, setExternalUrl] = useState("");
  const [traits, setTraits] = useState<Trait[]>([{ id: 1, type: "", value: "" }]);
  const [chain, setChain] = useState("base-sepolia");
  const [royalty, setRoyalty] = useState("5");
  const [freezeMetadata, setFreezeMetadata] = useState(true);
  const [saleType, setSaleType] = useState<SaleType>("mint-only");
  const [price, setPrice] = useState("1.00");
  const [auctionDuration, setAuctionDuration] = useState("3-days");
  const [unlockable, setUnlockable] = useState("");
  const [rightsConfirmed, setRightsConfirmed] = useState(false);

  const {
    trigger,
    formState: { errors },
  } = useForm<CreateNftFormData>({
    resolver: zodResolver(createNftSchema),
    mode: "onChange",
    values: {
      file,
      editionType,
      supply,
      name,
      description,
      collection,
      category,
      externalUrl,
      traits,
      chain,
      walletAddress: connection.address ?? "",
      royalty,
      freezeMetadata,
      saleType,
      price,
      auctionDuration,
      unlockable,
      rightsConfirmed,
    },
  });

  const creatorName = auth.user?.creatorName ?? auth.user?.username ?? "Creator";
  const selectedChain = chains.find((item) => item.id === chain) ?? chains[0];
  const walletLabel = connection.address
    ? `${connection.address.slice(0, 6)}…${connection.address.slice(-4)}`
    : "Wallet not connected";
  const completedTraits = traits.filter((trait) => trait.type.trim() && trait.value.trim());

  useEffect(
    () => () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    },
    [],
  );

  const chooseFile = (selectedFile?: File) => {
    if (!selectedFile) return;
    if (!allowedFileTypes.includes(selectedFile.type)) {
      setFileError("Upload a PNG, JPG, WEBP, GIF, MP4 or MP3 file.");
      return;
    }
    if (selectedFile.size === 0) {
      setFileError("The selected file is empty. Choose a valid artwork file.");
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      setFileError("File size cannot exceed 100 MB.");
      return;
    }

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const nextPreviewUrl = URL.createObjectURL(selectedFile);
    previewUrlRef.current = nextPreviewUrl;
    setPreviewUrl(nextPreviewUrl);
    setFile(selectedFile);
    setFileError(null);
  };

  const validateStep = async (stepToValidate: 1 | 2 | 3) => {
    const valid = await trigger(stepFields[stepToValidate], { shouldFocus: true });
    return valid;
  };

  const continueFlow = async () => {
    if (step === 4) return;
    if (!(await validateStep(step))) {
      return;
    }
    setStep((current) => Math.min(4, current + 1) as Step);
  };

  const reviewMint = async () => {
    for (const stepToValidate of [1, 2, 3] as const) {
      if (!(await validateStep(stepToValidate))) {
        setStep(stepToValidate);
        setNotice(null);
        return;
      }
    }
    if (!file || !connection.address || !auth.user) {
      setNotice("Connect and sign in with your creator wallet before minting.");
      return;
    }

    setIsMinting(true);
    setMintedNftId(null);
    setNotice("Uploading artwork and metadata to IPFS…");
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        collectionSlug: collection,
        category,
        externalUrl: externalUrl.trim(),
        standard: editionType === "single" ? "ERC721" : "ERC1155",
        supply: Number(supply),
        chainId: selectedChain.chainId,
        creatorWallet: connection.address,
        royaltyPercent: Number(royalty),
        metadataFrozen: freezeMetadata,
        saleType:
          saleType === "mint-only" ? "MINT_ONLY" : saleType === "fixed" ? "FIXED" : "AUCTION",
        priceWei: saleType === "mint-only" ? "0" : parseEther(price).toString(),
        ...(saleType === "auction" ? { auctionEndsAt: auctionEndIso(auctionDuration) } : {}),
        unlockable,
        rightsConfirmed,
        traits: completedTraits.map((trait) => ({
          traitType: trait.type.trim(),
          value: trait.value.trim(),
        })),
      };
      const formData = new FormData();
      formData.append("file", file);
      formData.append("payload", JSON.stringify(payload));

      const prepared = await apiRequest<MintApiResponse>("/api/nfts", {
        method: "POST",
        body: formData,
      });
      const mint = prepared.data.mint;

      if (connection.chainId !== mint.chainId) {
        setNotice(`Switching wallet to ${selectedChain.name}…`);
        await switchChainAsync({ chainId: mint.chainId });
      }

      setNotice("Confirm the mint transaction in your wallet…");
      const transactionHash = await sendTransactionAsync({
        chainId: mint.chainId,
        to: mint.transactionRequest.to,
        data: mint.transactionRequest.data,
        value: BigInt(mint.transactionRequest.value),
      });

      setNotice("Transaction submitted. Waiting for blockchain confirmation…");
      await waitForTransactionReceipt(wagmiConfig, {
        chainId: mint.chainId,
        hash: transactionHash,
        confirmations: 1,
      });

      setNotice("Transaction confirmed. Verifying NFT on the backend…");
      await apiRequest(`/api/nfts/${prepared.data.nft.id}/confirm`, {
        method: "POST",
        body: JSON.stringify({ transactionHash }),
      });
      setMintedNftId(prepared.data.nft.id);
      setNotice("NFT minted and verified successfully.");
    } catch (mintError) {
      const message = mintError instanceof Error ? mintError.message : "NFT minting failed.";
      setNotice(
        /rejected|denied|user refused/i.test(message)
          ? "Mint transaction was rejected in your wallet."
          : message,
      );
    } finally {
      setIsMinting(false);
    }
  };

  const updateTrait = (id: number, field: "type" | "value", value: string) => {
    setTraits((current) =>
      current.map((trait) => (trait.id === id ? { ...trait, [field]: value } : trait)),
    );
  };

  const renderArtworkStep = () => (
    <>
      <SectionHeading
        number="01"
        text="This file will become the NFT media stored with its metadata."
        title="Upload Your Artwork"
      />
      <div
        className={`group relative grid min-h-[260px] cursor-pointer place-items-center overflow-hidden rounded-[20px] border border-dashed text-center transition ${file ? "border-[rgba(83,232,220,.3)] bg-[#090e1c]" : "border-[rgba(155,123,255,.35)] bg-[radial-gradient(circle_at_50%_20%,rgba(126,95,255,.09),transparent_18rem)] hover:border-[rgba(155,123,255,.65)] hover:bg-[rgba(155,123,255,.045)]"}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          chooseFile(event.dataTransfer.files[0]);
        }}
        role="button"
        tabIndex={0}
      >
        <input
          accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,audio/mpeg"
          className="hidden"
          onChange={(event) => chooseFile(event.target.files?.[0])}
          ref={fileInputRef}
          type="file"
        />
        {file && previewUrl && file.type.startsWith("image/") ? (
          <>
            <Image
              alt="NFT artwork preview"
              className="object-contain p-3"
              fill
              sizes="(max-width: 980px) 90vw, 650px"
              src={previewUrl}
              unoptimized
            />
            <span className="absolute bottom-3 right-3 rounded-lg border border-white/[.1] bg-black/65 px-3 py-2 text-[9px] font-semibold text-white backdrop-blur-md">
              Change Artwork
            </span>
          </>
        ) : file ? (
          <div className="px-5">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[rgba(83,232,220,.1)] text-[11px] font-bold text-[var(--cyan)]">
              {file.type.startsWith("video/") ? "MP4" : "MP3"}
            </span>
            <strong className="mt-4 block max-w-sm truncate text-[12px]">{file.name}</strong>
            <small className="mt-2 block text-[10px] text-[#68748a]">Click to replace file</small>
          </div>
        ) : (
          <div className="px-5">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-[rgba(155,123,255,.18)] bg-[rgba(155,123,255,.1)] text-[#b8a4ff] shadow-[0_12px_30px_rgba(92,62,198,.16)] [&_svg]:h-6 [&_svg]:w-6">
              <UploadIcon />
            </span>
            <strong className="mt-4 block text-[13px]">Drop Your Artwork Here</strong>
            <span className="mt-1.5 block text-[10px] text-[#6d788d]">
              or click to browse from your device
            </span>
            <span className="mt-4 inline-flex rounded-full border border-white/[.055] bg-white/[.025] px-3 py-1.5 text-[9px] text-[#7e899d]">
              PNG, JPG, WEBP, GIF, MP4 or MP3 · Max 100 MB
            </span>
          </div>
        )}
      </div>
      {fileError && <p className="mb-0 mt-2 text-[10px] text-rose-300">{fileError}</p>}
      {!fileError && <ValidationError error={errors.file} />}
      {file && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/[.05] bg-white/[.018] px-3 py-2 text-[9px] text-[#68748a]">
          <span className="max-w-[70%] truncate">{file.name}</span>
          <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
        </div>
      )}

      <div className="my-3 h-px bg-white/[.055]" />
      <SectionHeading
        number="02"
        text="Choose one unique token or multiple identical editions."
        title="Select NFT Edition"
      />
      <div className="grid grid-cols-2 gap-3 max-[560px]:grid-cols-1">
        <ChoiceCard
          active={editionType === "single"}
          badge="ERC-721"
          onClick={() => {
            setEditionType("single");
            setSupply("1");
          }}
          text="A unique 1-of-1 NFT with a single owner."
          title="Single NFT"
        />
        <ChoiceCard
          active={editionType === "multiple"}
          badge="ERC-1155"
          onClick={() => {
            setEditionType("multiple");
            if (Number(supply) < 2) setSupply("10");
          }}
          text="Create multiple copies of the same artwork."
          title="Multiple Edition"
        />
      </div>
      {editionType === "multiple" && (
        <label className="mt-4 block text-[11px] font-semibold text-[#aab3c4]">
          Number of Copies <span className="text-rose-300">*</span>
          <input
            className={inputClass}
            max="10000"
            min="2"
            onChange={(event) => setSupply(event.target.value)}
            type="number"
            required
            value={supply}
          />
          <small className="mt-1.5 block font-normal text-[#606b80]">
            Every copy shares the same media and metadata.
          </small>
          <ValidationError error={errors.supply} />
        </label>
      )}
    </>
  );

  const renderDetailsStep = () => (
    <>
      <SectionHeading
        number="01"
        text="These details will be included in the public NFT metadata."
        title="NFT Information"
      />
      <div className="grid grid-cols-2 gap-4 max-[620px]:grid-cols-1">
        <label className="text-[11px] font-semibold text-[#aab3c4]">
          NFT Name <span className="text-rose-300">*</span>
          <input
            className={inputClass}
            maxLength={80}
            minLength={3}
            onChange={(event) => {
              setName(event.target.value);
            }}
            placeholder="e.g. Beyond the Horizon"
            required
            value={name}
          />
          <small className="mt-1 block text-right font-normal text-[#596579]">
            {name.length}/80
          </small>
          <ValidationError error={errors.name} />
        </label>
        <label className="text-[11px] font-semibold text-[#aab3c4]">
          Collection <span className="text-rose-300">*</span>
          <select
            className={inputClass}
            onChange={(event) => setCollection(event.target.value)}
            value={collection}
            required
          >
            <option value="aether-dimensions">Aether Dimensions</option>
            <option value="synthetic-nature">Synthetic Nature</option>
            <option value="prismatic-forms">Prismatic Forms</option>
          </select>
          <ValidationError error={errors.collection} />
        </label>
      </div>
      <label className="mt-3 block text-[11px] font-semibold text-[#aab3c4]">
        Description <span className="text-rose-300">*</span>
        <textarea
          className={`${inputClass} min-h-32 resize-y py-3 leading-5`}
          maxLength={1000}
          minLength={10}
          onChange={(event) => {
            setDescription(event.target.value);
          }}
          placeholder="Tell collectors the story, inspiration, and meaning behind this creation..."
          required
          value={description}
        />
        <small className="mt-1 block text-right font-normal text-[#596579]">
          {description.length}/1000
        </small>
        <ValidationError error={errors.description} />
      </label>
      <div className="mt-3 grid grid-cols-2 gap-4 max-[620px]:grid-cols-1">
        <label className="text-[11px] font-semibold text-[#aab3c4]">
          Category <span className="text-rose-300">*</span>
          <select
            className={inputClass}
            onChange={(event) => setCategory(event.target.value)}
            value={category}
            required
          >
            <option value="art">Art</option>
            <option value="collectibles">Collectibles</option>
            <option value="photography">Photography</option>
            <option value="music">Music</option>
            <option value="gaming">Gaming</option>
            <option value="other">Other</option>
          </select>
          <ValidationError error={errors.category} />
        </label>
        <label className="text-[11px] font-semibold text-[#aab3c4]">
          External URL
          <input
            className={inputClass}
            onChange={(event) => setExternalUrl(event.target.value)}
            placeholder="https://your-site.com/artwork"
            type="url"
            value={externalUrl}
          />
          <ValidationError error={errors.externalUrl} />
        </label>
      </div>
      <div className="my-3 h-px bg-white/[.055]" />
      <SectionHeading
        number="02"
        text="Traits help collectors filter items and understand rarity."
        title="Properties and Traits"
      />
      <div className="space-y-2">
        {traits.map((trait, index) => (
          <div
            className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_44px] items-center gap-3 max-[480px]:gap-2 mb-0"
            key={trait.id}
          >
            <input
              aria-label={`Trait ${index + 1} type`}
              className={`${inputClass} mt-0`}
              onChange={(event) => updateTrait(trait.id, "type", event.target.value)}
              placeholder="Type, e.g. Background"
              value={trait.type}
            />
            <input
              aria-label={`Trait ${index + 1} value`}
              className={`${inputClass} mt-0`}
              onChange={(event) => updateTrait(trait.id, "value", event.target.value)}
              placeholder="Value, e.g. Purple"
              value={trait.value}
            />
            <button
              aria-label={`Remove trait ${index + 1}`}
              className="grid h-11 w-11 cursor-pointer mt-2 place-items-center rounded-xl border border-[var(--line)] text-[#657087] transition hover:border-rose-400/20 hover:bg-rose-400/[.06] hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={traits.length === 1}
              onClick={() => setTraits((current) => current.filter((item) => item.id !== trait.id))}
              type="button"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <ValidationError error={errors.traits} />
      <button
        className="mt-3 inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl border border-[var(--line)] bg-white/[.025] px-3 text-[10px] font-semibold text-[#9f8dec] transition hover:border-[rgba(155,123,255,.28)] hover:bg-white/[.055] hover:text-[#b9a9f6]"
        onClick={() => {
          setTraits((current) => [...current, { id: nextTraitId.current, type: "", value: "" }]);
          nextTraitId.current += 1;
        }}
        type="button"
      >
        <PlusIcon />
        <span>Add property</span>
      </button>
    </>
  );

  const renderBlockchainStep = () => (
    <>
      <SectionHeading
        number="01"
        text="The NFT will be minted on the selected public test network."
        title="Blockchain Network"
      />
      <div className="grid grid-cols-3 gap-2 max-[700px]:grid-cols-1">
        {chains.map((item) => (
          <ChoiceCard
            active={chain === item.id}
            badge={item.badge}
            key={item.id}
            onClick={() => setChain(item.id)}
            text={`Gas token: ${item.symbol}`}
            title={item.name}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[rgba(83,232,220,.12)] bg-[rgba(83,232,220,.035)] px-3 py-2.5 text-[9px]">
        <span className="inline-flex items-center gap-2 text-[#8f9aad] [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-[var(--cyan)]">
          <CreatorNavIcon name="wallets" /> Connected Wallet
        </span>
        <strong className={connection.address ? "text-emerald-300" : "text-amber-200"}>
          {walletLabel}
        </strong>
      </div>
      <ValidationError error={errors.walletAddress} />

      <div className="my-3 h-px bg-white/[.055]" />
      <SectionHeading
        number="02"
        text="Configure permanent metadata and secondary-sale earnings."
        title="Metadata And Royalty"
      />
      <div className="grid grid-cols-2 gap-4 max-[620px]:grid-cols-1">
        <label className="text-[11px] font-semibold text-[#aab3c4]">
          Royalty Percentage <span className="text-rose-300">*</span>
          <div className="relative">
            <input
              className={`${inputClass} pr-9`}
              max="10"
              min="0"
              onChange={(event) => setRoyalty(event.target.value)}
              step="0.5"
              type="number"
              value={royalty}
              required
            />
            <span className="pointer-events-none absolute right-3 top-[22px] text-[11px] text-[#69758b]">
              %
            </span>
          </div>
          <small className="mt-1.5 block font-normal text-[#606b80]">
            Maximum 10% on secondary sales.
          </small>
          <ValidationError error={errors.royalty} />
        </label>
        <label className="text-[11px] font-semibold text-[#aab3c4]">
          Royalty Receiver <span className="text-rose-300">*</span>
          <input
            className={`${inputClass} text-[#7e899d]`}
            disabled
            value={connection.address ?? "Connect wallet"}
          />
          <small className="mt-1.5 block font-normal text-[#606b80]">
            Uses your connected creator wallet.
          </small>
        </label>
      </div>
      <div className="mt-3 flex items-center justify-between gap-4 rounded-2xl border border-[var(--line)] bg-white/[.018] p-4">
        <div>
          <strong className="text-[11px] text-[#dce1ea]">Freeze metadata after mint</strong>
          <p className="mb-0 mt-1 text-[9px] leading-4 text-[#657087]">
            Media and metadata will be prepared for IPFS and made immutable.
          </p>
        </div>
        <button
          aria-label="Toggle metadata freeze"
          aria-pressed={freezeMetadata}
          className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition ${freezeMetadata ? "bg-[#7555df]" : "bg-white/[.12]"}`}
          onClick={() => setFreezeMetadata((value) => !value)}
          type="button"
        >
          <span
            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${freezeMetadata ? "left-6" : "left-1"}`}
          />
        </button>
      </div>

      <div className="my-3 h-px bg-white/[.055]" />
      <SectionHeading
        number="03"
        text="Mint to your wallet now, or prepare a marketplace listing."
        title="Sale Method"
      />
      <div className="grid grid-cols-3 gap-2 max-[700px]:grid-cols-1">
        <ChoiceCard
          active={saleType === "mint-only"}
          onClick={() => setSaleType("mint-only")}
          text="Mint to your wallet without listing."
          title="Not For Sale"
        />
        <ChoiceCard
          active={saleType === "fixed"}
          onClick={() => setSaleType("fixed")}
          text="Collectors can buy at one price."
          title="Fixed Price"
        />
        <ChoiceCard
          active={saleType === "auction"}
          onClick={() => setSaleType("auction")}
          text="Collectors compete with timed bids."
          title="Timed Auction"
        />
      </div>
      {saleType !== "mint-only" && (
        <div className="mt-4 grid grid-cols-2 gap-4 max-[620px]:grid-cols-1">
          <label className="text-[11px] font-semibold text-[#aab3c4]">
            {saleType === "auction" ? "Minimum Bid" : "Sale Price"}{" "}
            <span className="text-rose-300">*</span>
            <div className="relative">
              <input
                className={`${inputClass} pr-14`}
                min="0"
                onChange={(event) => setPrice(event.target.value)}
                step="0.001"
                type="number"
                value={price}
                required
              />
              <span className="pointer-events-none absolute right-3 top-[22px] text-[10px] font-semibold text-[#8c97aa]">
                {selectedChain.symbol}
              </span>
            </div>
            <ValidationError error={errors.price} />
          </label>
          {saleType === "auction" ? (
            <label className="text-[11px] font-semibold text-[#aab3c4]">
              Auction Duration <span className="text-rose-300">*</span>
              <select
                className={inputClass}
                onChange={(event) => setAuctionDuration(event.target.value)}
                value={auctionDuration}
                required
              >
                <option value="24-hours">24 hours</option>
                <option value="3-days">3 days</option>
                <option value="7-days">7 days</option>
              </select>
              <ValidationError error={errors.auctionDuration} />
            </label>
          ) : (
            <label className="text-[11px] font-semibold text-[#aab3c4]">
              Listing Duration
              <select className={inputClass} defaultValue="30-days">
                <option value="7-days">7 days</option>
                <option value="30-days">30 days</option>
                <option value="6-months">6 months</option>
              </select>
            </label>
          )}
        </div>
      )}
      <label className="mt-4 block text-[11px] font-semibold text-[#aab3c4]">
        Unlockable Content <span className="font-normal text-[#5d687d]">(optional)</span>
        <textarea
          className={`${inputClass} min-h-20 resize-y py-3 leading-5`}
          onChange={(event) => setUnlockable(event.target.value)}
          placeholder="Private link, download code, or a message visible to the owner..."
          value={unlockable}
        />
        <ValidationError error={errors.unlockable} />
      </label>
      <ValidationError error={errors.rightsConfirmed} />
      <label className="mt-2 flex cursor-pointer items-start gap-3 rounded-2xl border border-[var(--line)] bg-white/[.018] p-3">
        <input
          checked={rightsConfirmed}
          className="mt-1 accent-[var(--cyan)]"
          onChange={(event) => {
            setRightsConfirmed(event.target.checked);
          }}
          type="checkbox"
        />
        <span>
          <strong className="block text-[11px] text-[#dce1ea]">
            I own the rights to this work
          </strong>
          <small className="mt-1 block text-[9px] leading-4 text-[#657087]">
            I confirm this content is original or I have permission to mint it on-chain.
          </small>
        </span>
      </label>
    </>
  );

  const renderReviewStep = () => {
    const reviewRows = [
      ["NFT Type", editionType === "single" ? "1 of 1 · ERC-721" : `${supply} copies · ERC-1155`],
      ["Collection", collection.replaceAll("-", " ")],
      ["Blockchain", selectedChain.name],
      ["Metadata", freezeMetadata ? "IPFS · Frozen after mint" : "IPFS · Editable"],
      ["Royalty", `${royalty || "0"}% to ${walletLabel}`],
      [
        "Sale",
        saleType === "mint-only"
          ? "Not listed"
          : `${saleType === "fixed" ? "Fixed price" : "Timed auction"} · ${price} ${selectedChain.symbol}`,
      ],
    ];

    return (
      <>
        <SectionHeading
          number="01"
          text="Review every detail before requesting the blockchain transaction."
          title="Confirm NFT Details"
        />
        <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white/[.016]">
          {reviewRows.map(([label, value]) => (
            <div
              className="flex items-center justify-between gap-5 border-b border-white/[.05] px-4 py-3 last:border-0"
              key={label}
            >
              <span className="text-[10px] text-[#68748a]">{label}</span>
              <strong className="text-right text-[10px] capitalize text-[#c9d0dc]">{value}</strong>
            </div>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-3 gap-2 max-[650px]:grid-cols-1">
          {[
            ["Media", file ? "Ready" : "Missing"],
            ["Metadata", `${completedTraits.length} traits`],
            ["Wallet", connection.address ? "Connected" : "Required"],
          ].map(([label, value]) => (
            <div className="rounded-xl border border-[var(--line)] bg-white/[.018] p-2" key={label}>
              <span className="text-[9px] text-[#606b80]">{label}</span>
              <strong className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#d5dbe6]">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${value === "Missing" || value === "Required" ? "bg-amber-300" : "bg-emerald-400"}`}
                />
                {value}
              </strong>
            </div>
          ))}
        </div>

        <div className="mt-2 rounded-2xl border border-[rgba(155,123,255,.16)] bg-[rgba(155,123,255,.045)] p-3">
          <div className="flex items-start gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[rgba(155,123,255,.12)] text-[#b5a2f8] [&_svg]:h-4 [&_svg]:w-4">
              <ChainIcon />
            </span>
            <div>
              <strong className="text-[11px] text-[#dce1ea]">
                Your wallet will confirm the mint
              </strong>
              <p className="mb-0 mt-1 text-[9px] leading-4 text-[#68748a]">
                Cryptonix will never access your private key. The final transaction will require a
                wallet signature and testnet gas.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div>
      <header className="mb-5 flex items-end justify-between gap-4 max-[650px]:items-start max-[650px]:flex-col">
        <div>
          <h1 className="mb-0 mt-1 text-[clamp(28px,4vw,38px)] font-semibold tracking-[-2px]">
            Create an NFT
          </h1>
          <p className="mb-0 mt-1 max-w-2xl text-[11px] leading-5 text-[#727e93]">
            Prepare your artwork, metadata, blockchain settings, and marketplace release.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-xl border border-[rgba(83,232,220,.12)] bg-[rgba(83,232,220,.04)] px-3 py-2 text-[9px] font-semibold text-[#9aa6b9]">
          <span className="h-2 w-2 rounded-full bg-[var(--cyan)] shadow-[0_0_9px_rgba(83,232,220,.7)]" />
          Testnet minting flow
        </span>
      </header>

      <CreateNftProgress
        currentStep={step}
        onStepChange={(nextStep) => {
          if (isMinting) return;
          setStep(nextStep as Step);
          setNotice(null);
        }}
      />

      <div className="grid grid-cols-[minmax(0,1fr)_310px] items-start gap-4 max-[980px]:grid-cols-1">
        <section className="rounded-[22px] border border-[var(--line)] bg-[rgba(255,255,255,.02)] p-3 shadow-[0_20px_55px_rgba(0,0,0,.18)]">
          {step === 1 && renderArtworkStep()}
          {step === 2 && renderDetailsStep()}
          {step === 3 && renderBlockchainStep()}
          {step === 4 && renderReviewStep()}

          {notice && (
            <p
              className="mb-0 mt-5 rounded-xl border border-cyan-400/20 bg-cyan-400/[.06] px-3 py-2.5 text-[10px] text-cyan-200"
              role="status"
            >
              {notice}
            </p>
          )}

          <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/[.055] pt-3">
            <button
              className="h-10 cursor-pointer rounded-xl border border-[var(--line)] bg-white/[.025] px-4 text-[10px] font-semibold text-[#9da7b9] transition hover:bg-white/[.06] disabled:cursor-not-allowed disabled:opacity-35"
              disabled={step === 1}
              onClick={() => {
                if (isMinting) return;
                setStep((current) => Math.max(1, current - 1) as Step);
                setNotice(null);
              }}
              type="button"
            >
              Back
            </button>
            {step < 4 ? (
              <button
                className="h-10 cursor-pointer rounded-xl bg-[linear-gradient(110deg,#8d6bff,#6849ea)] px-5 text-[10px] font-semibold text-white shadow-[0_10px_28px_rgba(105,72,235,.25)] transition hover:-translate-y-0.5 hover:brightness-110"
                onClick={continueFlow}
                type="button"
              >
                Continue
              </button>
            ) : (
              <button
                className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[linear-gradient(110deg,#8d6bff,#6849ea)] px-5 text-[10px] font-semibold text-white shadow-[0_12px_32px_rgba(105,72,235,.3)] transition hover:-translate-y-0.5 hover:brightness-110 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0"
                disabled={isMinting || Boolean(mintedNftId)}
                onClick={reviewMint}
                type="button"
              >
                <span>{isMinting ? "Minting…" : mintedNftId ? "Minted" : "Mint NFT"}</span>
              </button>
            )}
          </div>
        </section>

        <aside className="sticky top-[76px] max-[980px]:static">
          <span className="mb-2 block px-1 text-[9px] font-bold tracking-[1.4px] text-[#68748a]">
            LIVE PREVIEW
          </span>
          <div className="overflow-hidden rounded-[22px] border border-[var(--line)] bg-[rgba(255,255,255,.022)] p-2 shadow-[0_20px_55px_rgba(0,0,0,.2)]">
            <div className="relative grid aspect-square place-items-center overflow-hidden rounded-[16px] bg-[radial-gradient(circle_at_35%_28%,rgba(148,109,255,.42),transparent_25%),radial-gradient(circle_at_70%_72%,rgba(61,211,200,.2),transparent_28%),#0b1020]">
              {previewUrl && file?.type.startsWith("image/") ? (
                <Image
                  alt="NFT preview"
                  className="object-fill"
                  fill
                  sizes="310px"
                  src={previewUrl}
                  unoptimized
                />
              ) : file ? (
                <div className="text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/[.07] text-[11px] font-bold text-[#b9a8f8]">
                    {file.type.startsWith("video/") ? "MP4" : "MP3"}
                  </span>
                  <span className="mt-3 block max-w-[220px] truncate text-[9px] text-[#8390a5]">
                    {file.name}
                  </span>
                </div>
              ) : (
                <div className="text-center text-[#647087]">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/[.07] bg-white/[.035] [&_svg]:h-6 [&_svg]:w-6">
                    <UploadIcon />
                  </span>
                  <span className="mt-3 block text-[9px]">Artwork preview</span>
                </div>
              )}
              <span className="absolute left-3 top-3 rounded-lg border border-white/[.08] bg-black/45 px-2 py-1 text-[8px] font-semibold text-[#dfe4ed] backdrop-blur-md">
                {editionType === "single" ? "1 of 1" : `${supply || "0"} editions`}
              </span>
            </div>
            <div className="">
              <span className="text-[9px] uppercase tracking-[1px] text-[#667187]">
                {collection.replaceAll("-", " ")}
              </span>
              <h3 className="mb-0 mt-1 truncate text-[14px] font-semibold">
                {name.trim() || "Untitled NFT"}
              </h3>
              <p className="mb-0 mt-1 text-[9px] text-[#6e798e]">By {creatorName}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-white/[.05] bg-white/[.018] p-3">
                <span>
                  <small className="block text-[8px] text-[#5f6a7f]">
                    {saleType === "auction"
                      ? "Minimum bid"
                      : saleType === "fixed"
                        ? "Price"
                        : "Sale"}
                  </small>
                  <strong className="mt-1 block text-[10px] text-[#c4b5fa]">
                    {saleType === "mint-only"
                      ? "Not listed"
                      : `${price || "0"} ${selectedChain.symbol}`}
                  </strong>
                </span>
                <span className="text-right">
                  <small className="block text-[8px] text-[#5f6a7f]">Network</small>
                  <strong className="mt-1 block truncate text-[9px] text-[#9ba6b9]">
                    {selectedChain.name}
                  </strong>
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 rounded-2xl border border-[var(--line)] bg-white/[.018] p-3">
            <div className="flex items-center justify-between text-[9px]">
              <span className="text-[#657087]">Metadata storage</span>
              <strong className="text-[#9fa9bb]">IPFS</strong>
            </div>
            <div className="mt-2 flex items-center justify-between text-[9px]">
              <span className="text-[#657087]">Token standard</span>
              <strong className="text-[#9fa9bb]">
                {editionType === "single" ? "ERC-721" : "ERC-1155"}
              </strong>
            </div>
            <div className="mt-2 flex items-center justify-between text-[9px]">
              <span className="text-[#657087]">Royalty</span>
              <strong className="text-[#9fa9bb]">{royalty || "0"}%</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
