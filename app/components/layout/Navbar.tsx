"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { formatUnits } from "viem";
import { useBalance, useConnection } from "wagmi";
import WalletModal from "../wallet/WalletModal";
import { useAuth } from "../auth/AuthProvider";
import cryptonixLogo from "../../../public/assets/logo.png";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Tokens", href: "/tokens" },
  { label: "Collections", href: "/#collections" },
];

function validateUsername(value: string) {
  const username = value.trim();
  if (!username) return "Username is required.";
  if (username.length < 3) return "Username must be at least 4` characters.";
  if (username.length > 20) return "Username cannot exceed 20 characters.";
  if (!/^[A-Za-z0-9_]+$/.test(username)) {
    return "Only letters, numbers and underscores are allowed.";
  }
  return null;
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5z" />
      <path d="M16 11h4v4h-4a2 2 0 1 1 0-4Z" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5.75 19a6.25 6.25 0 0 1 12.5 0" strokeLinecap="round" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="4" width="6" height="6" rx="1.5" />
      <rect x="14" y="4" width="6" height="6" rx="1.5" />
      <rect x="4" y="14" width="6" height="6" rx="1.5" />
      <rect x="14" y="14" width="6" height="6" rx="1.5" />
    </svg>
  );
}

function CreatorIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 4.5 5.5 7.25 4 14.5l5.25 5.25 7.25-1.5L19.25 12 12 4.5Z" />
      <path d="m9.25 19.75 3.15-6.3M4 14.5l5.2-.05 3.2-1 1-3.2L13.45 5" />
      <circle cx="11.35" cy="12.35" r="1.35" />
      <path d="M19 3.5v3M17.5 5h3" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M10 5H6.75A1.75 1.75 0 0 0 5 6.75v10.5A1.75 1.75 0 0 0 6.75 19H10" />
      <path d="m15 8 4 4-4 4M9 12h10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [isSavingUsername, setIsSavingUsername] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const auth = useAuth();
  const connection = useConnection();
  const balance = useBalance({
    address: connection.address,
    chainId: connection.chainId,
    query: { enabled: connection.isConnected && Boolean(connection.address) },
  });
  const networkLabel =
    connection.chain?.name ?? (connection.chainId ? `Chain ${connection.chainId}` : "Network");
  const walletLabel = connection.isConnected
    ? balance.data
      ? balance.data.value === BigInt(0)
        ? `0 ${balance.data.symbol}`
        : `${Number(formatUnits(balance.data.value, balance.data.decimals)).toLocaleString(undefined, { maximumFractionDigits: 4 })} ${balance.data.symbol}`
      : balance.isLoading
        ? "•••"
        : "—"
    : "Connect Wallet";
  const compactNetworkLabel = connection.chain?.name ?? "Network";
  const visibleNavigation = navigation;
  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/#collections") return false;
    if (href === "/tokens") return pathname === "/tokens" || pathname.startsWith("/token/");
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    if (!profileOpen) return;
    const closeProfile = (event: MouseEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) setProfileOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("mousedown", closeProfile);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeProfile);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [profileOpen]);

  const authenticate = async () => {
    if (!connection.isConnected) {
      setProfileOpen(false);
      setWalletOpen(true);
      return;
    }
    await auth.signIn().catch(() => undefined);
  };

  const completeProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUsernameTouched(true);
    const usernameError = validateUsername(username);
    if (usernameError) return;

    setIsSavingUsername(true);
    await auth
      .updateUsername(username.trim())
      .then(() => {
        setUsername("");
        setUsernameTouched(false);
      })
      .catch(() => undefined)
      .finally(() => setIsSavingUsername(false));
  };

  const usernameError = usernameTouched ? validateUsername(username) : null;

  return (
    <header className="site-header fixed z-50 top-0 left-0 w-full p-5 max-[600px]:p-3">
      <nav
        className="navbar glass relative flex items-center justify-between w-[min(1180px,_100%)] min-h-[68px] m-[auto] pt-0 pr-3.5 pb-0 pl-5 rounded-[20px] max-[600px]:min-h-15 max-[600px]:px-2.5 max-[600px]:rounded-[17px] border-[1px_solid_var(--line)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(0,0,0,.28),_inset_0_1px_rgba(255,255,255,.05)] [backdrop-filter:blur(22px)] [-webkit-backdrop-filter:blur(22px)]"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="brand inline-flex min-w-0 items-center gap-2.5 text-xl font-[720] leading-none tracking-[-.5px] max-[600px]:gap-1.5 max-[600px]:text-[16px]"
          aria-label="Cryptonix home"
        >
          <Image
            className="block h-12 w-12 shrink-0 object-contain object-center drop-shadow-[0_0_12px_rgba(126,95,255,.55)] max-[600px]:h-9 max-[600px]:w-9"
            src={cryptonixLogo}
            alt=""
            sizes="40px"
            priority
          />
          <span className="-mt-2 inline-flex h-10 items-center text-[25px]">Cryptonix</span>
        </Link>

        <div
          className="nav-links absolute left-[50%] flex gap-1 rounded-[14px] border border-white/[.035] bg-black/[.08] p-1 [transform:translateX(-50%)] text-sm font-[520] max-[900px]:hidden"
          aria-label="Primary links"
        >
          {visibleNavigation.map((item) => {
            const active = isActiveLink(item.href);
            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={`nav-reflection-link rounded-[10px] border px-4 py-2 transition ${active ? "border-[rgba(155,123,255,.22)] bg-[linear-gradient(110deg,rgba(141,107,255,.2),rgba(74,221,209,.07))] text-white shadow-[inset_0_1px_rgba(255,255,255,.06)]" : "border-transparent text-[#aeb7c9] hover:border-white/[.06] hover:bg-white/[.065] hover:text-white"}`}
                key={item.label}
                href={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="nav-actions flex items-center gap-[9px]">
          <button
            className="icon-button desktop-search grid w-[42px] h-[42px] place-items-center border-[1px_solid_var(--line)] rounded-[13px] bg-[rgba(255,255,255,.04)] cursor-pointer [&_svg]:w-4.5 [&_svg]:h-4.5 max-[900px]:hidden"
            aria-label="Search marketplace"
          >
            <SearchIcon />
          </button>
          <button
            className={`wallet-button nav-reflection-link [&_svg]:w-4.5 [&_svg]:h-4.5 relative flex h-11 items-center gap-2 rounded-[13px] py-0 px-3.5 text-[13px] font-semibold cursor-pointer transition hover:[transform:translateY(-2px)] max-[600px]:px-3 max-[420px]:w-10 max-[420px]:min-w-10 max-[420px]:justify-center max-[420px]:px-0 max-[420px]:[&_.wallet-label]:hidden ${connection.isConnected ? "min-w-[104px] border border-[rgba(155,123,255,.24)] bg-[linear-gradient(115deg,rgba(141,107,255,.16),rgba(104,73,234,.08))] shadow-[inset_0_1px_rgba(255,255,255,.05),0_8px_24px_rgba(80,54,180,.16)] hover:border-[rgba(155,123,255,.4)] hover:bg-[linear-gradient(115deg,rgba(141,107,255,.23),rgba(104,73,234,.13))]" : "max-w-[180px] border-0 bg-[linear-gradient(110deg,_#8d6bff,_#6849ea)] shadow-[0_10px_28px_rgba(105,72,235,.3)] hover:shadow-[0_14px_34px_rgba(105,72,235,.42)]"}`}
            onClick={() => setWalletOpen(true)}
            title={connection.isConnected ? `${networkLabel} — ${walletLabel}` : undefined}
            aria-label={
              connection.isConnected
                ? `${networkLabel} connected wallet balance ${walletLabel}`
                : walletLabel
            }
          >
            <WalletIcon />
            <span className="wallet-label min-w-0 leading-tight">
              <span className="block truncate">{walletLabel}</span>
              {connection.isConnected && (
                <span className="block truncate text-[9px] font-medium text-[#8f99ad]">
                  {compactNetworkLabel}
                </span>
              )}
            </span>
          </button>
          <div className="relative" ref={profileRef}>
            <button
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              aria-label={auth.user ? "Open account menu" : "Open sign-in menu"}
              className={`relative grid h-[42px] w-[42px] cursor-pointer place-items-center rounded-[13px] border transition [&_svg]:h-[19px] [&_svg]:w-[19px] ${auth.user?.username ? "border-[rgba(82,221,160,.25)] bg-emerald-400/[.08] text-emerald-300" : auth.user ? "border-amber-300/20 bg-amber-300/[.07] text-amber-200" : "border-[var(--line)] bg-white/[.04] text-[#b7c0d1] hover:bg-white/[.08] hover:text-white"}`}
              onClick={() => {
                setIsOpen(false);
                setProfileOpen((value) => !value);
              }}
            >
              <ProfileIcon />
              {auth.user && (
                <span
                  className={`absolute right-1 top-1 h-2 w-2 rounded-full border border-[#11162b] ${auth.user.username ? "bg-emerald-400" : "bg-amber-300"}`}
                />
              )}
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 top-[calc(100%+10px)] w-[200px] overflow-hidden rounded-[18px] border border-[var(--line)] bg-[rgba(9,12,25,.97)] p-2 shadow-[0_24px_70px_rgba(0,0,0,.5)] [backdrop-filter:blur(24px)] max-[400px]:fixed max-[400px]:right-2 max-[400px]:top-[76px]"
                role="menu"
              >
                <div className="rounded-[13px] border border-white/[.055] bg-white/[.025] p-2.5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-[10px] [&_svg]:h-4 [&_svg]:w-4 ${auth.user ? "bg-emerald-400/[.1] text-emerald-300" : "bg-[rgba(155,123,255,.1)] text-[#ad99f7]"}`}
                    >
                      <ProfileIcon />
                    </span>
                    <div className="min-w-0">
                      <strong className="block truncate text-[12px] text-[#edf0f7]">
                        {auth.user?.username
                          ? `@${auth.user.username}`
                          : auth.user
                            ? "Complete Your Profile"
                            : "Cryptonix Account"}
                      </strong>
                      <span className="mt-1 block truncate text-[12px] text-[#707b91]">
                        {auth.user
                          ? `${auth.user.address.slice(0, 6)}…${auth.user.address.slice(-4)}`
                          : connection.isConnected
                            ? "Wallet connected"
                            : "Connect your wallet to continue"}
                      </span>
                    </div>
                  </div>
                </div>

                {auth.user && !auth.user.username ? (
                  <form
                    className="mt-2 grid gap-2"
                    onSubmit={(event) => void completeProfile(event)}
                  >
                    <label className="grid gap-2 px-1">
                      <span className="text-[12px] font-semibold text-[#cbd2df]">
                        Choose your username
                      </span>
                      <input
                        aria-describedby={usernameError ? "username-error" : "username-help"}
                        aria-invalid={Boolean(usernameError)}
                        autoComplete="username"
                        autoFocus
                        className={`h-11 w-full rounded-xl border bg-[#0d1120] px-3 text-[13px] text-white outline-none transition placeholder:text-[#505a6f] ${usernameError ? "border-rose-400/60 focus:border-rose-400" : "border-[var(--line)] focus:border-[rgba(155,123,255,.5)]"}`}
                        maxLength={20}
                        minLength={3}
                        onBlur={() => setUsernameTouched(true)}
                        onChange={(event) => {
                          setUsername(event.target.value);
                          if (!usernameTouched) setUsernameTouched(true);
                        }}
                        pattern="[A-Za-z0-9_]+"
                        placeholder="e.g. cryptonix_user"
                        required
                        value={username}
                      />
                    </label>
                    {usernameError ? (
                      <p
                        className="m-0 px-1 text-[12px] leading-5 text-rose-300"
                        id="username-error"
                        role="alert"
                      >
                        {usernameError}
                      </p>
                    ) : (
                      <p
                        className="m-0 px-1 text-[12px] leading-5 text-[#626d82]"
                        id="username-help"
                      >
                        3–20 characters. Letters, numbers and underscores only.
                      </p>
                    )}
                    {auth.error && (
                      <p className="m-0 px-1 text-[12px] leading-5 text-rose-300" role="alert">
                        {auth.error}
                      </p>
                    )}
                    <button
                      className="mt-1 h-11 cursor-pointer rounded-xl bg-[linear-gradient(110deg,#8d6bff,#6849ea)] px-4 text-[12px] font-semibold shadow-[0_10px_25px_rgba(105,72,235,.25)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={isSavingUsername || Boolean(validateUsername(username))}
                      type="submit"
                    >
                      {isSavingUsername ? "Saving username…" : "Complete sign in"}
                    </button>
                  </form>
                ) : auth.user ? (
                  <div className="mt-2 grid gap-1 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0">
                    <Link
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[12px] text-[#cbd2df] transition hover:bg-white/[.06] hover:text-white"
                      href={`/profile/${encodeURIComponent(auth.user.username!)}`}
                      onClick={() => setProfileOpen(false)}
                      role="menuitem"
                    >
                      <ProfileIcon />
                      <span>Profile</span>
                    </Link>
                    <Link
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[12px] text-[#cbd2df] transition hover:bg-white/[.06] hover:text-white"
                      href="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      role="menuitem"
                    >
                      <DashboardIcon />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[12px] text-[#cbd2df] transition hover:bg-white/[.06] hover:text-white"
                      href="/linked-wallets"
                      onClick={() => setProfileOpen(false)}
                      role="menuitem"
                    >
                      <WalletIcon />
                      <span>Linked wallets</span>
                    </Link>
                    <Link
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[12px] text-[#cbd2df] transition hover:bg-white/[.06] hover:text-white"
                      href={auth.user.creatorStatus === "approved" ? "/creator" : "/become-creator"}
                      onClick={() => setProfileOpen(false)}
                      role="menuitem"
                    >
                      <CreatorIcon />
                      <span>
                        {auth.user.creatorStatus === "approved"
                          ? "Creator Studio"
                          : auth.user.creatorStatus === "pending"
                            ? "Creator application"
                            : "Become a creator"}
                      </span>
                    </Link>
                    <div className="my-1 h-px bg-white/[.06]" />
                    <button
                      className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[12px] text-rose-300 transition hover:bg-rose-400/[.07] [&_svg]:h-4 [&_svg]:w-4"
                      onClick={() => void auth.logout().finally(() => setProfileOpen(false))}
                      role="menuitem"
                    >
                      <SignOutIcon /> Sign out
                    </button>
                  </div>
                ) : (
                  <div className="mt-2">
                    <button
                      className="flex h-10 w-full cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-[linear-gradient(110deg,#8d6bff,#6849ea)] px-2 text-[11px] font-semibold shadow-[0_10px_25px_rgba(105,72,235,.25)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 [&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:shrink-0"
                      disabled={auth.isLoading || auth.isSigningIn}
                      onClick={() => void authenticate()}
                      role="menuitem"
                    >
                      <ProfileIcon />
                      {!connection.isConnected
                        ? "Connect Wallet"
                        : auth.isSigningIn
                          ? "Waiting for Signature…"
                          : "Sign in with Ethereum"}
                    </button>
                    {auth.error && (
                      <p
                        className="mb-1 mt-2 px-1 text-[12px] leading-5 text-rose-300"
                        role="alert"
                      >
                        {auth.error}
                      </p>
                    )}
                    <p className="mb-1 mt-2 text-center text-[12px] leading-5 text-[#626d82]">
                      Signature is free and does not create a transaction.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          <button
            className={`menu-button ${isOpen ? "is-open" : ""} grid w-[42px] h-[42px] place-items-center border-[1px_solid_var(--line)] rounded-[13px] bg-[rgba(255,255,255,.04)] cursor-pointer hidden relative [&_span]:absolute [&_span]:w-[17px] [&_span]:h-[1.5px] [&_span]:bg-white [&_span]:transition [&_span]:[transform:translateY(-3px)] [&_span:last-child]:[transform:translateY(3px)] [&.is-open_span]:[transform:rotate(45deg)] [&.is-open_span:last-child]:[transform:rotate(-45deg)] max-[900px]:grid`}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </div>

        {isOpen && (
          <div className="mobile-menu absolute top-[calc(100%_+_10px)] left-0 grid w-full gap-0.5 p-2.5 border-[1px_solid_var(--line)] rounded-[18px] bg-[rgba(9,12,25,.94)] shadow-[0_25px_70px_rgba(0,0,0,.45)] [backdrop-filter:blur(24px)] [&_a]:flex [&_a]:justify-between [&_a]:rounded-[11px] [&_a]:py-[13px] [&_a]:px-[15px] [&_a]:text-[#d8ddeb] [&_a:hover]:bg-[rgba(255,255,255,.06)] [&_a:hover]:text-white">
            {visibleNavigation.map((item) => {
              const active = isActiveLink(item.href);
              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`nav-reflection-link ${
                    active
                      ? "border border-[rgba(155,123,255,.2)] bg-[linear-gradient(110deg,rgba(141,107,255,.18),rgba(74,221,209,.06))] text-white"
                      : "border border-transparent"
                  }`}
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                  <span aria-hidden="true">↗</span>
                </Link>
              );
            })}
          </div>
        )}
      </nav>
      <WalletModal open={walletOpen} onClose={() => setWalletOpen(false)} />
    </header>
  );
}
