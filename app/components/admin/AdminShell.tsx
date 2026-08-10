"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import cryptonixLogo from "../../../public/assets/logo.png";
import { ADMIN_LOGOUT_MUTATION, adminGraphql } from "../../lib/admin-auth";
import AdminIcon from "./AdminIcon";
import { useAdminSession } from "./AdminGuard";
import { adminItems, adminNavigation } from "./admin-navigation";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin } = useAdminSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const current =
    adminItems.find((item) =>
      item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href),
    ) ?? adminItems[0];
  const adminName = admin?.name ?? "Administrator";
  const adminEmail = admin?.email ?? "";
  const adminInitials =
    adminName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "AD";

  useEffect(() => {
    if (!accountOpen) return;
    const close = (event: MouseEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) setAccountOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [accountOpen]);

  if (pathname === "/admin/login") return children;

  return (
    <div className="admin-workspace min-h-screen bg-[radial-gradient(circle_at_78%_-10%,rgba(118,83,235,.14),transparent_34rem),radial-gradient(circle_at_28%_120%,rgba(31,196,183,.06),transparent_30rem),#050711] text-[#f4f6fb]">
      {sidebarOpen ? (
        <button
          className="fixed inset-0 z-40 cursor-default bg-black/65 backdrop-blur-sm xl:hidden"
          aria-label="Close admin navigation"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[276px] flex-col border-r border-white/[.075] bg-[rgba(6,9,19,.97)] p-3 shadow-[20px_0_70px_rgba(0,0,0,.14)] backdrop-blur-2xl transition-transform duration-300 xl:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-[66px] items-center justify-between px-2">
          <Link className="flex items-center gap-2.5" href="/admin">
            <Image
              className="h-13 w-13 object-contain"
              src={cryptonixLogo}
              alt="Cryptonix"
              sizes="40px"
            />
            <div>
              <strong className="block text-[20px] tracking-[-.2px]">Cryptonix</strong>
              <span className="text-[9px] font-bold tracking-[1.65px] text-[#9e87f5]">
                ADMIN COMMAND
              </span>
            </div>
          </Link>
          <button
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/[.08] text-[#8490a6] xl:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <AdminIcon name="close" />
          </button>
        </div>

        <nav
          className="admin-sidebar-scroll flex-1 space-y-5 overflow-y-auto px-1 pr-2 pt-4"
          aria-label="Admin portal"
        >
          {adminNavigation.map((group) => (
            <div key={group.label}>
              <span className="mb-1.5 block px-3 text-[9px] font-bold uppercase tracking-[1.45px] text-[#4f5a70]">
                {group.label}
              </span>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active =
                    item.href === "/admin"
                      ? pathname === item.href
                      : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`group flex min-h-10 items-center gap-3 rounded-xl border px-3 text-[11px] font-medium transition ${active ? "border-[rgba(155,123,255,.2)] bg-[linear-gradient(100deg,rgba(141,107,255,.17),rgba(83,232,220,.035))] text-[#f3f0ff] shadow-[inset_3px_0_0_#8d6bff]" : "border-transparent text-[#78849a] hover:bg-white/[.04] hover:text-[#dce1ec]"}`}
                    >
                      <span
                        className={
                          active ? "text-[#b8a6ff]" : "text-[#606c82] group-hover:text-[#9180d6]"
                        }
                      >
                        <AdminIcon name={item.icon} />
                      </span>
                      <span className="truncate">{item.label}</span>
                      {"badge" in item ? (
                        <span className="ml-auto rounded-full bg-rose-400/[.12] px-2 py-0.5 text-[9px] text-rose-300">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-3 rounded-2xl border border-white/[.07] bg-white/[.025] p-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[linear-gradient(145deg,#8d6bff,#6544dc)] text-[10px] font-bold shadow-[0_8px_24px_rgba(104,73,230,.2)]">
              {adminInitials}
            </span>
            <div className="min-w-0">
              <strong className="block truncate text-[11px]">{adminName}</strong>
              <span className="block max-w-[155px] truncate text-[9px] text-[#667187]">
                Full Access
              </span>
            </div>
            <span className="ml-auto h-2 w-2 rounded-full bg-emerald-400" />
          </div>
        </div>
      </aside>

      <div className="min-h-screen xl:pl-[276px]">
        <header className="sticky top-0 z-30 flex h-[66px] items-center gap-3 border-b border-white/[.075] bg-[rgba(5,7,17,.8)] p-3 backdrop-blur-2xl">
          <button
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/[.08] bg-white/[.03] text-[#9ba5b7] xl:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open admin navigation"
          >
            <AdminIcon name="menu" />
          </button>
          <div className="hidden min-w-[145px] lg:block">
            <span className="block text-[8px] font-bold tracking-[1.45px] text-[#566176]">
              ADMIN PORTAL
            </span>
            <strong className="mt-1 block truncate text-[13px]">{current.label}</strong>
          </div>
          <label className="relative mx-auto flex h-10 w-full max-w-[500px] items-center">
            <AdminIcon name="search" className="absolute left-3 h-4 w-4 text-[#606b80]" />
            <input
              className="h-full w-full rounded-xl border border-white/[.08] bg-white/[.025] pl-10 pr-14 text-[11px] text-white outline-none transition placeholder:text-[#566176] focus:border-[rgba(155,123,255,.38)] focus:bg-white/[.04]"
              placeholder="Search users, NFTs, transactions…"
            />
            <kbd className="absolute right-3 hidden rounded-md border border-white/[.08] bg-white/[.04] px-1.5 py-1 text-[8px] text-[#626e83] sm:block">
              ⌘ K
            </kbd>
          </label>
          <button
            className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/[.08] bg-white/[.03] text-[#8d98ab] transition hover:bg-white/[.06] hover:text-white"
            aria-label="Admin notifications"
          >
            <AdminIcon name="notifications" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,.8)]" />
          </button>
          <div className="relative cursor-pointer" ref={accountRef}>
            <button
              className="flex cursor-pointer h-10 items-center gap-2 rounded-xl border border-white/[.08] bg-white/[.03] px-1.5 pr-2.5 transition hover:bg-white/[.06]"
              onClick={() => setAccountOpen((value) => !value)}
              aria-expanded={accountOpen}
            >
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-[linear-gradient(145deg,#8d6bff,#6848dc)] text-[9px] font-bold">
                {adminInitials}
              </span>
              <span className="hidden max-w-[120px] truncate text-[10px] font-medium text-[#c7cedb] sm:block">
                {adminName}
              </span>
              <AdminIcon
                name="chevronDown"
                className={`hidden h-3.5 w-3.5 text-[#637086] transition sm:block ${accountOpen ? "rotate-180" : ""}`}
              />
            </button>
            {accountOpen ? (
              <div className="absolute right-0 top-[calc(100%+10px)] w-[190px] rounded-2xl border border-white/[.08] bg-[rgba(9,12,25,.98)] p-2 text-[11px] shadow-[0_24px_70px_rgba(0,0,0,.5)] backdrop-blur-2xl">
                <div className="rounded-xl bg-white/[.03] p-3">
                  <strong className="block truncate">{adminName}</strong>
                  <span className="mt-1 block truncate text-[9px] text-[#667187]">
                    {adminEmail}
                  </span>
                </div>
                <Link
                  href="/admin/settings"
                  className="mt-1 flex items-center gap-2.5 rounded-xl p-3 text-[#aab3c4] hover:bg-white/[.05] hover:text-white"
                >
                  <AdminIcon name="settings" className="h-4 w-4" />
                  Account settings
                </Link>
                <Link
                  href="/"
                  className="flex items-center gap-2.5 rounded-xl p-3 text-[#aab3c4] hover:bg-white/[.05] hover:text-white"
                >
                  <AdminIcon name="external" className="h-4 w-4" />
                  View marketplace
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    void adminGraphql(ADMIN_LOGOUT_MUTATION).finally(() => {
                      setAccountOpen(false);
                      router.replace("/admin/login");
                      router.refresh();
                    });
                  }}
                  className="flex cursor-pointer w-full items-center gap-2.5 rounded-xl p-3 text-left text-rose-300 transition hover:bg-rose-400/[.07]"
                >
                  <AdminIcon name="lock" className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            ) : null}
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1580px] p-3">{children}</main>
      </div>
    </div>
  );
}
