"use client";

import Image from "next/image";
import { useState } from "react";
import { formatUnits } from "viem";
import { useBalance, useConnection } from "wagmi";
import metamaskIcon from "../../../public/assets/wallet-icons/metamask.png";
import WalletModal from "./WalletModal";

function CopyIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="8" y="8" width="10" height="10" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  );
}

export default function LinkedWallets() {
  const connection = useConnection();
  const balance = useBalance({
    address: connection.address,
    chainId: connection.chainId,
    query: { enabled: connection.isConnected && Boolean(connection.address) },
  });
  const [walletOpen, setWalletOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shortAddress = connection.address
    ? `${connection.address.slice(0, 6)}…${connection.address.slice(-4)}`
    : "No wallet connected";
  const balanceLabel = balance.data
    ? `${Number(formatUnits(balance.data.value, balance.data.decimals)).toLocaleString(undefined, { maximumFractionDigits: 5 })} ${balance.data.symbol}`
    : balance.isLoading
      ? "Loading balance…"
      : "Balance unavailable";

  const copyAddress = async () => {
    if (!connection.address) return;
    await navigator.clipboard.writeText(connection.address);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <main className="mx-auto min-h-screen w-[calc(100%_-_40px)] max-w-6xl pb-24 pt-[100px] max-[600px]:w-[calc(100%_-_28px)] max-[600px]:pt-[110px]">
      <section className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,.018)] p-6 shadow-[0_24px_70px_rgba(0,0,0,.2)] max-[600px]:p-4">
        <div className="flex items-center justify-between gap-5 border-b border-white/[.055] pb-5 max-[550px]:items-start max-[550px]:flex-col">
          <div>
            <span className="text-[12px] font-bold tracking-[2px] text-[var(--cyan)]">
              ACCOUNT SECURITY
            </span>
            <h1 className="mb-0 mt-2 text-[clamp(28px,4vw,38px)] font-semibold tracking-[-1.5px]">
              Your linked wallets
            </h1>
            <p className="mb-0 mt-2 text-[12px] leading-5 text-[#737e93]">
              Wallets connected to your Cryptonix user account.
            </p>
          </div>
          <button
            className="h-11 shrink-0 cursor-pointer rounded-xl bg-[linear-gradient(110deg,#8d6bff,#6849ea)] px-5 text-[12px] font-semibold shadow-[0_10px_25px_rgba(105,72,235,.25)] transition hover:brightness-110 max-[550px]:w-full"
            onClick={() => setWalletOpen(true)}
          >
            Link a wallet
          </button>
        </div>

        <div className="mt-5">
          {connection.isConnected && connection.address ? (
            <article className="relative flex min-h-[82px] items-center gap-3 rounded-[16px] border border-[var(--line)] bg-white/[.018] px-4 py-3 transition hover:border-[rgba(155,123,255,.25)] max-[500px]:items-start">
              <span className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full border border-white/10 bg-[radial-gradient(circle_at_35%_30%,#e06ab8,#833e9e_45%,#271c5c)]">
                <span className="absolute inset-0 opacity-25 [background-image:linear-gradient(45deg,transparent_40%,white_41%,transparent_43%)] [background-size:8px_8px]" />
                <Image
                  className="absolute bottom-0 right-0 h-5 w-5 rounded-md"
                  src={metamaskIcon}
                  alt="MetaMask"
                  sizes="20px"
                />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <strong className="truncate text-[14px]">{shortAddress}</strong>
                  <button
                    aria-label="Copy wallet address"
                    className="grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-lg text-[#7c879b] transition hover:bg-white/[.06] hover:text-white [&_svg]:h-4 [&_svg]:w-4"
                    onClick={() => void copyAddress()}
                    title={copied ? "Copied" : "Copy address"}
                  >
                    <CopyIcon />
                  </button>
                  <span className="rounded-full border border-emerald-400/15 bg-emerald-400/[.06] px-2 py-1 text-[12px] text-emerald-300 max-[500px]:hidden">
                    Primary
                  </span>
                </div>
                <span className="mt-1 block text-[12px] text-[#778298]">{balanceLabel}</span>
                <span className="mt-1 hidden text-[12px] text-emerald-300 max-[500px]:block">
                  Primary wallet
                </span>
              </div>
              <button
                aria-expanded={menuOpen}
                aria-label="Wallet actions"
                className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-lg tracking-[2px] text-[#7a8498] transition hover:bg-white/[.06] hover:text-white"
                onClick={() => setMenuOpen((value) => !value)}
              >
                •••
              </button>
              {menuOpen && (
                <div className="absolute right-3 top-[64px] z-10 w-40 rounded-xl border border-[var(--line)] bg-[#0b0e1c] p-1.5 shadow-[0_18px_45px_rgba(0,0,0,.45)]">
                  <button
                    className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-[12px] text-[#c4ccda] hover:bg-white/[.06]"
                    onClick={() => {
                      setMenuOpen(false);
                      setWalletOpen(true);
                    }}
                  >
                    Manage wallet
                  </button>
                </div>
              )}
            </article>
          ) : (
            <div className="rounded-[16px] border border-dashed border-[var(--line)] p-10 text-center">
              <p className="m-0 text-sm text-[#8490a4]">No wallet is currently connected.</p>
              <button
                className="mt-4 cursor-pointer text-[12px] font-semibold text-[#a38cf3]"
                onClick={() => setWalletOpen(true)}
              >
                Connect MetaMask
              </button>
            </div>
          )}
        </div>
      </section>
      <WalletModal open={walletOpen} onClose={() => setWalletOpen(false)} />
    </main>
  );
}
