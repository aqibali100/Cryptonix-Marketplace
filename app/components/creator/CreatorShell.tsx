"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import cryptonixLogo from "../../../public/assets/logo.png";
import { useAuth } from "../auth/AuthProvider";
import CreatorNavIcon from "./CreatorNavIcon";
import CreatorProfileModal from "./CreatorProfileModal";
import { creatorNavigation } from "./creator-navigation";

function ProfileIcon() {
  return (
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5.75 19a6.25 6.25 0 0 1 12.5 0" strokeLinecap="round" />
    </svg>
  );
}

function NotificationIcon() {
  return (
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path
        d="M18 9a6 6 0 0 0-12 0v3.5L4.5 15h15L18 12.5V9Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 18h4" strokeLinecap="round" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M10 5H6.75A1.75 1.75 0 0 0 5 6.75v10.5A1.75 1.75 0 0 0 6.75 19H10" />
      <path d="m15 8 4 4-4 4M9 12h10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CreatorShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const auth = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const current =
    creatorNavigation.find((item) =>
      item.href === "/creator" ? pathname === item.href : pathname.startsWith(item.href),
    ) ?? creatorNavigation[0];
  const creatorName = auth.user?.creatorName ?? auth.user?.username ?? "Creator";
  const creatorInitials =
    creatorName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "CR";

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

  return (
    <div className="creator-workspace min-h-screen bg-[radial-gradient(circle_at_85%_0%,rgba(117,82,230,.12),transparent_28rem),#050711]">
      {profileModalOpen && <CreatorProfileModal onClose={() => setProfileModalOpen(false)} />}
      {sidebarOpen && (
        <button
          aria-label="Close creator navigation"
          className="fixed inset-0 z-40 cursor-default bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-[var(--line)] bg-[rgba(7,10,21,.96)] p-3 backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-16 items-center justify-between px-2">
          <Link className="flex items-center gap-2.5" href="/creator">
            <Image className="h-10 w-10 object-contain" src={cryptonixLogo} alt="" sizes="40px" />
            <div>
              <strong className="block text-[15px]">Cryptonix</strong>
              <span className="text-[10px] font-semibold tracking-[1.5px] text-[var(--cyan)]">
                CREATOR STUDIO
              </span>
            </div>
          </Link>
          <button
            aria-label="Close sidebar"
            className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--line)] text-[#8792a7] lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>
        </div>

        <nav
          className="creator-sidebar-scroll mt-3 flex-1 space-y-1 overflow-y-auto pr-2"
          aria-label="Creator workspace"
        >
          {creatorNavigation.map((item) => {
            const active =
              item.href === "/creator" ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={`group flex min-h-10 items-center gap-3 rounded-xl border px-3 text-[12px] transition ${active ? "border-[rgba(155,123,255,.22)] bg-[linear-gradient(100deg,rgba(141,107,255,.18),rgba(83,232,220,.05))] text-white" : "border-transparent text-[#778298] hover:bg-white/[.045] hover:text-[#dce1ec]"}`}
                href={item.href}
                key={item.href}
                onClick={() => setSidebarOpen(false)}
              >
                <span
                  className={`grid h-7 w-7 place-items-center rounded-lg ${active ? "bg-[rgba(155,123,255,.16)] text-[#bdaaff]" : "bg-white/[.035] text-[#6e798e] group-hover:text-[#9f8aec]"}`}
                >
                  <CreatorNavIcon name={item.icon} />
                </span>
                {item.label}
                {item.section === "offers" && (
                  <span className="ml-auto rounded-full bg-rose-400/[.12] px-2 py-0.5 text-[10px] text-rose-300">
                    4
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-3 rounded-2xl border border-[rgba(83,232,220,.12)] bg-[rgba(83,232,220,.045)] p-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[linear-gradient(145deg,#8d6bff,#45cfc5)] text-[11px] font-bold">
              {creatorInitials}
            </span>
            <div className="min-w-0">
              <strong className="block truncate text-[12px]">{creatorName}</strong>
              <span className="text-[10px] text-emerald-300">● Verified creator</span>
            </div>
          </div>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex h-[60px] items-center gap-3 border-b border-[var(--line)] bg-[rgba(5,7,17,.82)] px-4 backdrop-blur-2xl">
          <button
            aria-label="Open creator navigation"
            className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--line)] bg-white/[.035] lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <div className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold tracking-[1.5px] text-[#647087]">
              CREATOR WORKSPACE
            </span>
            <strong className="mt-1 block truncate text-[14px]">{current.label}</strong>
          </div>
          <Link
            className="hidden h-10 items-center rounded-xl border border-[var(--line)] bg-white/[.03] px-4 text-[11px] text-[#aeb7c8] transition hover:bg-white/[.06] sm:flex"
            href="/marketplace"
          >
            View marketplace ↗
          </Link>
          <button
            className="relative grid h-10 w-10 cursor-pointer place-items-center rounded-xl border border-[var(--line)] bg-white/[.035] text-[#99a4b7] transition hover:bg-white/[.07] hover:text-white [&_svg]:h-[18px] [&_svg]:w-[18px]"
            aria-label="Notifications"
          >
            <NotificationIcon />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-400 shadow-[0_0_7px_rgba(251,113,133,.7)]" />
          </button>
          <div className="relative" ref={profileRef}>
            <button
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              aria-label="Open account menu"
              className="relative grid h-10 w-10 cursor-pointer place-items-center rounded-xl border border-[rgba(82,221,160,.25)] bg-emerald-400/[.08] text-emerald-300 transition hover:bg-emerald-400/[.14] [&_svg]:h-[18px] [&_svg]:w-[18px]"
              onClick={() => setProfileOpen((value) => !value)}
            >
              <ProfileIcon />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full border border-[#11162b] bg-emerald-400" />
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 top-[calc(100%+10px)] z-50 w-[210px] overflow-hidden rounded-[18px] border border-[var(--line)] bg-[rgba(9,12,25,.97)] p-2 shadow-[0_24px_70px_rgba(0,0,0,.5)] backdrop-blur-2xl max-[400px]:fixed max-[400px]:right-2 max-[400px]:top-[70px]"
                role="menu"
              >
                <div className="rounded-[13px] border border-white/[.055] bg-white/[.025] p-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-emerald-400/[.1] text-emerald-300 [&_svg]:h-4 [&_svg]:w-4">
                      <ProfileIcon />
                    </span>
                    <div className="min-w-0">
                      <strong className="block truncate text-[12px] text-[#edf0f7]">
                        {creatorName}
                      </strong>
                      {auth.user?.username ? (
                        <span className="mt-1 block truncate text-[12px] text-[#707b91]">
                          @{auth.user.username}
                        </span>
                      ) : auth.user ? (
                        <span className="mt-1 block truncate text-[12px] text-[#707b91]">
                          {auth.user.address.slice(0, 6)}…{auth.user.address.slice(-4)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="mt-2 grid gap-1 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0">
                  <button
                    className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[12px] text-[#cbd2df] transition hover:bg-white/[.06] hover:text-white"
                    onClick={() => {
                      setProfileOpen(false);
                      setProfileModalOpen(true);
                    }}
                    role="menuitem"
                    type="button"
                  >
                    <ProfileIcon />
                    <span>Profile</span>
                  </button>
                  <Link
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[12px] text-[#cbd2df] transition hover:bg-white/[.06] hover:text-white"
                    href="/linked-wallets"
                    onClick={() => setProfileOpen(false)}
                    role="menuitem"
                  >
                    <CreatorNavIcon name="wallets" />
                    <span>Linked wallets</span>
                  </Link>
                  <Link
                    className="flex items-center gap-2.5 rounded-xl bg-[rgba(155,123,255,.08)] px-3 py-2.5 text-[12px] text-[#cbbdff]"
                    href="/"
                    onClick={() => setProfileOpen(false)}
                    role="menuitem"
                  >
                    <ProfileIcon />
                    <span>Login as user</span>
                  </Link>
                  <div className="my-1 h-px bg-white/[.06]" />
                  <button
                    className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[12px] text-rose-300 transition hover:bg-rose-400/[.07]"
                    onClick={() =>
                      void auth.logout().finally(() => {
                        setProfileOpen(false);
                        window.location.replace("/");
                      })
                    }
                    role="menuitem"
                  >
                    <SignOutIcon />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="min-h-[calc(100vh-148px)] p-3 pt-2">{children}</div>

        <footer className="flex min-h-[72px] flex-col justify-center gap-2 border-t border-[var(--line)] px-4 py-4 text-[10px] text-[#515c71] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© 2026 Cryptonix Creator Studio</span>
          <span>Secure minting · Multi-chain · Creator-owned</span>
        </footer>
      </div>
    </div>
  );
}
