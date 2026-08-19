"use client";

import Link from "next/link";
import { useConnection } from "wagmi";
import { useAuth } from "./AuthProvider";

export default function DashboardGuard({ children }: { children: React.ReactNode }) {
  const connection = useConnection();
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <main className="grid min-h-screen place-items-center pt-24 text-sm text-[#8e98ad]">
        Checking your session…
      </main>
    );
  }

  if (!auth.user) {
    return (
      <main className="grid min-h-screen place-items-center px-5 pt-24">
        <section className="glass w-[min(440px,100%)] rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-7 text-center shadow-[0_24px_80px_rgba(0,0,0,.28)]">
          <span className="text-[12px] font-bold tracking-[2px] text-[var(--cyan)]">
            PROTECTED AREA
          </span>
          <h1 className="my-3 text-3xl font-semibold tracking-[-1.5px]">
            Sign in to your dashboard
          </h1>
          <p className="mb-2 text-xs leading-6 text-[#808ba1]">
            This one-time signature proves that you own the connected wallet.
          </p>
          <div className="mb-5 grid grid-cols-3 gap-2 text-[12px] text-[#8f99ad]">
            <span className="rounded-lg bg-white/[.035] p-2">No gas fee</span>
            <span className="rounded-lg bg-white/[.035] p-2">No transaction</span>
            <span className="rounded-lg bg-white/[.035] p-2">No password</span>
          </div>
          {connection.isConnected ? (
            <button
              className="user-primary-action w-full"
              disabled={auth.isSigningIn}
              onClick={() => void auth.signIn().catch(() => undefined)}
            >
              {auth.isSigningIn ? "Check MetaMask…" : "Verify wallet & continue"}
            </button>
          ) : (
            <p className="rounded-xl border border-amber-300/20 bg-amber-300/[.06] p-3 text-xs text-amber-200">
              Connect MetaMask from the navbar first.
            </p>
          )}
          {auth.error && (
            <p className="mt-3 text-xs text-red-300" role="alert">
              {auth.error}
            </p>
          )}
          <Link className="mt-4 inline-block text-xs text-[#9c86ed]" href="/">
            ← Back home
          </Link>
        </section>
      </main>
    );
  }

  if (!auth.user.permissions.includes("dashboard:view")) {
    return (
      <main className="grid min-h-screen place-items-center pt-24 text-sm text-red-300">
        You do not have dashboard access.
      </main>
    );
  }

  if (auth.user.role !== "user") {
    return (
      <main className="grid min-h-screen place-items-center px-5 pt-24">
        <section className="glass w-[min(430px,100%)] rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-7 text-center">
          <span className="text-[12px] font-bold tracking-[2px] text-amber-300">USER ONLY</span>
          <h1 className="my-3 text-3xl font-semibold tracking-[-1.5px]">
            This dashboard is for collectors
          </h1>
          <p className="text-xs leading-6 text-[#808ba1]">
            Your current account role cannot access the user dashboard.
          </p>
        </section>
      </main>
    );
  }

  return children;
}
