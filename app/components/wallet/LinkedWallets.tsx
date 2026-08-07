"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { formatUnits } from "viem";
import { useBalance, useChains, useConnection, useSwitchChain } from "wagmi";
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

function NetworkMark({ chainId, name }: { chainId: number; name: string }) {
  const networkColors: Record<number, string> = {
    1: "from-[#627eea] to-[#8da2f5]",
    10: "from-[#ff0420] to-[#ff6475]",
    56: "from-[#f0b90b] to-[#ffd75e]",
    137: "from-[#8247e5] to-[#b07cff]",
    59144: "from-[#61dfff] to-[#6b7cff]",
    8453: "from-[#0052ff] to-[#5688ff]",
    42161: "from-[#28a0f0] to-[#1756a9]",
    80002: "from-[#8247e5] to-[#b07cff]",
    84532: "from-[#0052ff] to-[#5688ff]",
    11155111: "from-[#627eea] to-[#8da2f5]",
  };

  return (
    <span
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-[11px] bg-gradient-to-br ${networkColors[chainId] ?? "from-[#8d6bff] to-[#4addd1]"} text-[10px] font-black text-white shadow-[inset_0_1px_rgba(255,255,255,.3),0_6px_16px_rgba(0,0,0,.22)]`}
      aria-label={`${name} network`}
    >
      {name.slice(0, 2).toUpperCase()}
    </span>
  );
}

export default function LinkedWallets() {
  const connection = useConnection();
  const supportedChains = useChains();
  const { switchChain, error: switchError, isPending: isSwitching } = useSwitchChain();
  const balance = useBalance({
    address: connection.address,
    chainId: connection.chainId,
    query: { enabled: connection.isConnected && Boolean(connection.address) },
  });
  const [walletOpen, setWalletOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [networkMenuOpen, setNetworkMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const networkMenuRef = useRef<HTMLDivElement>(null);
  const shortAddress = connection.address
    ? `${connection.address.slice(0, 6)}…${connection.address.slice(-4)}`
    : "No wallet connected";
  const balanceLabel = balance.data
    ? `${Number(formatUnits(balance.data.value, balance.data.decimals)).toLocaleString(undefined, { maximumFractionDigits: 5 })} ${balance.data.symbol}`
    : balance.isLoading
      ? "Loading balance…"
      : "Balance unavailable";
  const activeNetwork =
    connection.chain?.name ?? (connection.chainId ? `Chain ${connection.chainId}` : "Select network");

  useEffect(() => {
    if (!networkMenuOpen) return;
    const closeMenu = (event: MouseEvent) => {
      if (!networkMenuRef.current?.contains(event.target as Node)) setNetworkMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNetworkMenuOpen(false);
    };
    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [networkMenuOpen]);

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
              Your Linked Wallets
            </h1>
            <p className="mb-0 mt-2 text-[12px] leading-5 text-[#737e93]">
              Wallets connected to your Cryptonix user account.
            </p>
          </div>
          <button
            className="h-11 shrink-0 cursor-pointer rounded-xl bg-[linear-gradient(110deg,#8d6bff,#6849ea)] px-5 text-[12px] font-semibold shadow-[0_10px_25px_rgba(105,72,235,.25)] transition hover:brightness-110 max-[550px]:w-full"
            onClick={() => setWalletOpen(true)}
          >
            Link a Wallet
          </button>
        </div>

        {connection.isConnected && (
          <div className="mt-5 flex items-center justify-between gap-4 rounded-[16px] border border-[var(--line)] bg-white/[.018] p-4 max-[600px]:items-stretch max-[600px]:flex-col">
            <div>
              <strong className="block text-[13px]">MetaMask Network</strong>
              <span className="mt-1 block text-[11px] text-[#778298]">
                Switch network to view its native balance and use it across Cryptonix.
              </span>
            </div>
            <div className="relative min-w-[250px] max-[600px]:w-full" ref={networkMenuRef}>
              <button
                aria-expanded={networkMenuOpen}
                aria-haspopup="listbox"
                className="group flex h-[54px] w-full cursor-pointer items-center gap-3 rounded-[15px] border border-[rgba(155,123,255,.24)] bg-[linear-gradient(135deg,rgba(141,107,255,.09),rgba(8,12,25,.92))] px-3 text-left shadow-[inset_0_1px_rgba(255,255,255,.045),0_10px_30px_rgba(0,0,0,.15)] outline-none transition hover:border-[rgba(155,123,255,.48)] hover:bg-[linear-gradient(135deg,rgba(141,107,255,.14),rgba(8,12,25,.96))] focus-visible:ring-2 focus-visible:ring-[#8d6bff]/50 disabled:cursor-wait disabled:opacity-60"
                disabled={isSwitching}
                onClick={() => setNetworkMenuOpen((value) => !value)}
              >
                <NetworkMark chainId={connection.chainId ?? 0} name={activeNetwork} />
                <span className="min-w-0 flex-1">
                  <small className="block text-[9px] font-bold uppercase tracking-[1.3px] text-[#667187]">
                    Active network
                  </small>
                  <strong className="mt-0.5 block truncate text-[12px] text-[#eef1f8]">
                    {isSwitching ? "Confirm in MetaMask…" : activeNetwork}
                  </strong>
                </span>
                <svg
                  aria-hidden="true"
                  className={`h-4 w-4 shrink-0 text-[#818ca1] transition duration-200 ${networkMenuOpen ? "rotate-180 text-[#aa95f6]" : "group-hover:text-white"}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m7 10 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {networkMenuOpen && (
                <div
                  className="absolute right-0 top-[62px] z-30 w-full min-w-[290px] overflow-hidden rounded-[18px] border border-[rgba(155,123,255,.24)] bg-[rgba(8,11,23,.97)] p-2 shadow-[0_24px_70px_rgba(0,0,0,.55),inset_0_1px_rgba(255,255,255,.05)] backdrop-blur-2xl max-[600px]:min-w-0"
                  role="listbox"
                  aria-label="MetaMask networks"
                >
                  <div className="border-b border-white/[.06] px-2 pb-2 pt-1">
                    <strong className="block text-[11px]">Choose a Network</strong>
                    <span className="text-[9px] text-[#657087]">MetaMask will ask you to confirm</span>
                  </div>
                  <div className="mt-1 max-h-[292px] space-y-1 overflow-y-auto pr-1 [scrollbar-color:#4f4378_transparent] [scrollbar-width:thin]">
                    {supportedChains.map((chain) => {
                      const active = chain.id === connection.chainId;
                      return (
                        <button
                          key={chain.id}
                          role="option"
                          aria-selected={active}
                          className={`flex w-full cursor-pointer items-center gap-3 rounded-[12px] border px-2.5 py-2 text-left transition ${active ? "border-[rgba(155,123,255,.24)] bg-[linear-gradient(110deg,rgba(141,107,255,.17),rgba(74,221,209,.05))]" : "border-transparent hover:border-white/[.055] hover:bg-white/[.045]"}`}
                          onClick={() => {
                            setNetworkMenuOpen(false);
                            if (!active) switchChain({ chainId: chain.id });
                          }}
                        >
                          <NetworkMark chainId={chain.id} name={chain.name} />
                          <span className="min-w-0 flex-1">
                            <strong className="block truncate text-[11px] text-[#dce1eb]">{chain.name}</strong>
                            <small className="mt-0.5 block text-[9px] text-[#657087]">Chain ID {chain.id}</small>
                          </span>
                          {active && (
                            <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-400/[.12] text-[11px] text-emerald-300">✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {switchError && (
          <p className="mb-0 mt-2 text-right text-[11px] text-rose-300" role="alert">
            {/rejected|denied/i.test(switchError.message)
              ? "Network switch was rejected in MetaMask."
              : "MetaMask could not switch to that network."}
          </p>
        )}

        <div className="mt-4">
          {connection.isConnected && connection.address ? (
            <article className="relative flex min-h-[82px] items-center gap-3 rounded-[16px] border border-[var(--line)] bg-white/[.018] px-4 py-3 transition hover:border-[rgba(155,123,255,.25)] max-[500px]:items-start">
              <span className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-[15px] border border-[#f6851b]/20 bg-[linear-gradient(145deg,rgba(246,133,27,.16),rgba(14,17,31,.95))] shadow-[inset_0_1px_rgba(255,255,255,.07),0_8px_24px_rgba(246,133,27,.1)]">
                <Image
                  className="h-9 w-9 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,.35)]"
                  src={metamaskIcon}
                  alt="Connected with MetaMask"
                  sizes="36px"
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
                <span className="mt-1 block text-[12px] text-[#778298]">
                  {balanceLabel} <span className="text-[#596478]">on {activeNetwork}</span>
                </span>
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
