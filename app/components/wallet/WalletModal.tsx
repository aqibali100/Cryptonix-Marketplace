"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useConnect, useConnection, useDisconnect } from "wagmi";
import metamaskIcon from "../../../public/assets/wallet-icons/metamask.png";
import { useAuth } from "../auth/AuthProvider";

function friendlyError(error: Error | null) {
  if (!error) return null;
  if (/rejected|denied/i.test(error.message)) return "Connection request rejected in MetaMask.";
  if (/already pending/i.test(error.message))
    return "A MetaMask request is already open. Check your wallet.";
  if (/provider|not found|unavailable/i.test(error.message))
    return "MetaMask could not be reached. Unlock the extension and try again.";
  return "Could not connect to MetaMask. Please try again.";
}

export default function WalletModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [hasMetaMask, setHasMetaMask] = useState<boolean | null>(null);
  const auth = useAuth();
  const connection = useConnection();
  const { connectors, connect, error, isPending, reset } = useConnect();
  const { disconnect, isPending: isDisconnecting } = useDisconnect();
  // This app configures a single EIP-1193 browser connector. Keeping the
  // connector generic avoids MetaMask SDK/discovery failures in extension browsers.
  const metaMask = connectors[0];

  useEffect(() => {
    if (!open) return;

    type MetaMaskProvider = { isMetaMask?: boolean; providers?: MetaMaskProvider[] };
    const ethereum = (window as Window & { ethereum?: MetaMaskProvider }).ethereum;
    const detectionTimer = window.setTimeout(() => {
      setHasMetaMask(
        Boolean(
          ethereum?.isMetaMask || ethereum?.providers?.some((provider) => provider.isMetaMask),
        ),
      );
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(detectionTimer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleConnect = () => {
    reset();
    if (hasMetaMask && metaMask) connect({ connector: metaMask }, { onSuccess: onClose });
  };

  return (
    <div
      className="modal-backdrop fixed z-[100] inset-0 grid place-items-center p-5 bg-[rgba(2,3,10,.76)] [backdrop-filter:blur(10px)] [animation:fadeIn_.2s_ease] max-[600px]:p-3"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        className="wallet-modal glass max-h-[calc(100vh-32px)] w-[min(440px,100%)] overflow-y-auto rounded-[26px] p-[26px] [animation:modalIn_.28s_ease] max-[600px]:p-5 border-[1px_solid_var(--line)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(0,0,0,.28),_inset_0_1px_rgba(255,255,255,.05)] [backdrop-filter:blur(22px)] [-webkit-backdrop-filter:blur(22px)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wallet-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-head flex items-start justify-between [&_h2]:mt-[7px] [&_h2]:text-[28px] [&_button]:grid [&_button]:w-[34px] [&_button]:h-[34px] [&_button]:place-items-center [&_button]:border-[1px_solid_var(--line)] [&_button]:rounded-[10px] [&_button]:bg-[rgba(255,255,255,.04)] [&_button]:text-[21px] [&_button]:cursor-pointer">
          <div>
            <span className="section-kicker text-[var(--cyan)] text-[12px] font-bold tracking-[2px]">
              ENTER CRYPTONIX
            </span>
            <h2
              className="mt-[7px] mb-0 text-[clamp(29px,4vw,40px)] font-semibold tracking-[-1.8px]"
              id="wallet-title"
            >
              {connection.isConnected ? "Wallet connected" : "Connect your wallet"}
            </h2>
          </div>
          <button onClick={onClose} aria-label="Close wallet modal">
            ×
          </button>
        </div>

        {connection.isConnected ? (
          <div className="mt-5 grid gap-4">
            <div className="flex items-center gap-3 rounded-[14px] border border-[var(--line)] bg-[rgba(255,255,255,.025)] p-3">
              <Image
                className="h-[39px] w-[39px] rounded-xl"
                src={metamaskIcon}
                alt="MetaMask logo"
                sizes="39px"
              />
              <div className="min-w-0">
                <strong className="block text-sm">MetaMask</strong>
                <span className="block text-xs text-[#808ba1]">
                  {connection.address
                    ? `${connection.address.slice(0, 6)}…${connection.address.slice(-4)}`
                    : "Wallet connected"}
                </span>
              </div>
              <span
                className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[.07] px-2.5 py-1 text-[12px] font-semibold text-emerald-300 before:h-1.5 before:w-1.5 before:rounded-full before:bg-emerald-400 before:content-['']"
                role="status"
              >
                Connected
              </span>
            </div>
            <button
              className="h-11 rounded-[13px] border border-[var(--line)] bg-[rgba(255,255,255,.04)] text-sm font-semibold transition hover:bg-[rgba(255,255,255,.08)] disabled:opacity-60"
              disabled={isDisconnecting}
              onClick={() =>
                void auth.logout().finally(() => disconnect(undefined, { onSuccess: onClose }))
              }
            >
              {isDisconnecting ? "Disconnecting…" : "Disconnect wallet"}
            </button>
          </div>
        ) : (
          <>
            <p className="wallet-intro [margin:11px_0_20px] text-[#808ba1] text-xs leading-[1.6]">
              Connect with MetaMask. Your keys and assets always stay in your wallet.
            </p>
            <button
              className="flex w-full items-center gap-3 rounded-[14px] border border-[var(--line)] bg-[rgba(255,255,255,.025)] p-2.5 text-left transition hover:translate-x-[3px] hover:border-[rgba(155,123,255,.35)] hover:bg-[rgba(155,123,255,.07)] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isPending || hasMetaMask !== true}
              onClick={handleConnect}
            >
              <Image
                className="h-[39px] w-[39px] rounded-xl object-cover"
                src={metamaskIcon}
                alt="MetaMask logo"
                sizes="39px"
              />
              <span className="grid gap-1">
                <strong className="text-xs">MetaMask</strong>
                <small className="text-[12px] text-[#727d94]">
                  {hasMetaMask === false ? "Extension required" : "Browser extension"}
                </small>
              </span>
              <i className="ml-auto not-italic text-[#737e95]">{isPending ? "…" : "→"}</i>
            </button>
            {hasMetaMask === false && (
              <div
                className="mt-3 rounded-[13px] border border-amber-400/20 bg-amber-400/[.07] p-3 text-xs leading-5 text-amber-200"
                role="alert"
              >
                <p className="m-0">
                  MetaMask browser extension is not installed. Install it to connect your wallet.
                </p>
                <a
                  className="mt-2 inline-flex rounded-lg bg-amber-300 px-3 py-1.5 font-semibold text-[#171109] transition hover:bg-amber-200"
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Install MetaMask ↗
                </a>
              </div>
            )}
            {friendlyError(error) && (
              <p className="mt-3 text-xs text-red-300" role="alert">
                {friendlyError(error)}
              </p>
            )}
            <p className="wallet-intro text-center m-0 mt-3 text-[#808ba1] text-xs leading-[1.6]">
              By connecting, you agree to Cryptonix&apos;s Terms and Privacy Policy.
            </p>
          </>
        )}
      </section>
    </div>
  );
}
