"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

export default function CreatorGuard({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  if (auth.isLoading) {
    return <main className="grid min-h-screen place-items-center bg-[#050711] text-[12px] text-[#7f8ba0]">Checking creator access…</main>;
  }

  if (auth.user?.role === "creator" && auth.user.creatorStatus === "approved") return children;

  const pending = auth.user?.creatorStatus === "pending";
  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_50%_20%,rgba(126,95,255,.15),transparent_30rem),#050711] px-5">
      <section className="w-full max-w-md rounded-[24px] border border-[var(--line)] bg-[rgba(14,18,35,.82)] p-7 text-center shadow-[0_30px_90px_rgba(0,0,0,.4)] backdrop-blur-xl">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[rgba(155,123,255,.11)] text-xl text-[#ad97f6]">◇</span>
        <span className="mt-5 block text-[10px] font-bold tracking-[1.8px] text-[var(--cyan)]">CREATOR ACCESS</span>
        <h1 className="mb-0 mt-3 text-3xl font-semibold tracking-[-1.5px]">{pending ? "Application under review" : auth.user ? "Become a Cryptonix creator" : "Sign in required"}</h1>
        <p className="mx-auto mb-0 mt-3 max-w-sm text-[11px] leading-5 text-[#748096]">{pending ? "We are reviewing your portfolio and creator information. You will get access after approval." : auth.user ? "Submit your creator profile and portfolio to unlock minting, listings, auctions, and earnings." : "Connect and verify your wallet before accessing Creator Studio."}</p>
        <div className="mt-6 grid gap-2">
          <Link className="flex h-11 items-center justify-center rounded-xl bg-[linear-gradient(110deg,#8d6bff,#6849ea)] text-[11px] font-semibold" href={auth.user ? "/become-creator" : "/dashboard"}>{pending ? "View application status" : auth.user ? "Start creator application" : "Go to sign in"}</Link>
          <Link className="flex h-10 items-center justify-center text-[10px] text-[#7d889c]" href="/">← Back to marketplace</Link>
        </div>
      </section>
    </main>
  );
}
