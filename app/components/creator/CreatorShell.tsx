"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import cryptonixLogo from "../../../public/assets/logo.png";
import CreatorNavIcon from "./CreatorNavIcon";
import { creatorNavigation } from "./creator-navigation";

export default function CreatorShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const current =
    creatorNavigation.find((item) =>
      item.href === "/creator" ? pathname === item.href : pathname.startsWith(item.href),
    ) ?? creatorNavigation[0];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_85%_0%,rgba(117,82,230,.12),transparent_28rem),#050711]">
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
                <span className={`grid h-7 w-7 place-items-center rounded-lg ${active ? "bg-[rgba(155,123,255,.16)] text-[#bdaaff]" : "bg-white/[.035] text-[#6e798e] group-hover:text-[#9f8aec]"}`}>
                  <CreatorNavIcon name={item.icon} />
                </span>
                {item.label}
                {item.section === "offers" && (
                  <span className="ml-auto rounded-full bg-rose-400/[.12] px-2 py-0.5 text-[10px] text-rose-300">4</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-3 rounded-2xl border border-[rgba(83,232,220,.12)] bg-[rgba(83,232,220,.045)] p-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[linear-gradient(145deg,#8d6bff,#45cfc5)] text-[11px] font-bold">AS</span>
            <div className="min-w-0">
              <strong className="block truncate text-[12px]">Aether Studio</strong>
              <span className="text-[10px] text-emerald-300">● Verified creator</span>
            </div>
          </div>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center gap-3 border-b border-[var(--line)] bg-[rgba(5,7,17,.82)] px-4 backdrop-blur-2xl sm:px-6 lg:px-8">
          <button
            aria-label="Open creator navigation"
            className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--line)] bg-white/[.035] lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <div className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold tracking-[1.5px] text-[#647087]">CREATOR WORKSPACE</span>
            <strong className="mt-1 block truncate text-[14px]">{current.label}</strong>
          </div>
          <Link className="hidden h-10 items-center rounded-xl border border-[var(--line)] bg-white/[.03] px-4 text-[11px] text-[#aeb7c8] transition hover:bg-white/[.06] sm:flex" href="/marketplace">
            View marketplace ↗
          </Link>
          <button className="relative grid h-10 w-10 place-items-center rounded-xl border border-[var(--line)] bg-white/[.035] text-[#99a4b7]" aria-label="Notifications">
            ♢<span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-400" />
          </button>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[linear-gradient(145deg,#8d6bff,#45cfc5)] text-[11px] font-bold">AS</div>
        </header>

        <div className="min-h-[calc(100vh-148px)] p-4 sm:p-6 lg:p-8">{children}</div>

        <footer className="flex min-h-[72px] flex-col justify-center gap-2 border-t border-[var(--line)] px-4 py-4 text-[10px] text-[#515c71] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© 2026 Cryptonix Creator Studio</span>
          <span>Secure minting · Multi-chain · Creator-owned</span>
        </footer>
      </div>
    </div>
  );
}
