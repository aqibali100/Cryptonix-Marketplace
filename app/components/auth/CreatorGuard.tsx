"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import cryptonixLogo from "../../../public/assets/logo.png";
import CreatorContentSkeleton from "../creator/CreatorContentSkeleton";
import { useAuth } from "./AuthProvider";

export default function CreatorGuard({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  if (auth.isLoading) {
    return <CreatorContentSkeleton />;
  }

  if (!auth.user) notFound();

  if (auth.user?.role === "creator" && auth.user.creatorStatus === "approved") return children;

  const pending = auth.user?.creatorStatus === "pending";
  return (
    <main className="grid min-h-[calc(100vh-232px)] place-items-center rounded-[22px] bg-[radial-gradient(circle_at_50%_20%,rgba(126,95,255,.15),transparent_30rem),#050711] px-5">
      <section className="w-full max-w-md rounded-[24px] border border-[var(--line)] bg-[rgba(14,18,35,.82)] p-7 text-center shadow-[0_30px_90px_rgba(0,0,0,.4)] backdrop-blur-xl">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[rgba(155,123,255,.11)] p-1">
          <Image
            alt="Cryptonix"
            className="h-full w-full object-contain drop-shadow-[0_0_10px_rgba(126,95,255,.55)]"
            priority
            sizes="48px"
            src={cryptonixLogo}
          />
        </span>
        <span className="mt-5 block text-[10px] font-bold tracking-[1.8px] text-[var(--cyan)]">
          CREATOR ACCESS
        </span>
        <h1 className="mb-0 mt-3 text-3xl font-semibold tracking-[-1.5px]">
          {pending
            ? "Application under review"
            : auth.user
              ? "Become a Cryptonix Creator"
              : "Sign in required"}
        </h1>
        <p className="mx-auto mb-0 mt-3 max-w-sm text-[11px] leading-5 text-[#748096]">
          {pending
            ? "We are reviewing your portfolio and creator information. You will get access after approval."
            : auth.user
              ? "Submit your creator profile and portfolio to unlock minting, listings, auctions, and earnings."
              : "Connect and verify your wallet before accessing Creator Studio."}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-2 max-[480px]:grid-cols-1">
          <Link
            className="flex h-11 min-w-0 items-center justify-center rounded-xl border border-[var(--line)] bg-white/[.025] px-3 text-center text-[10px] text-[#a4aec0] transition hover:bg-white/[.06] hover:text-white"
            href="/marketplace"
          >
            Back to Marketplace
          </Link>
          <Link
            className="user-primary-action min-w-0 px-3 text-[11px]"
            href={auth.user ? "/become-creator" : "/dashboard"}
          >
            {pending
              ? "View application status"
              : auth.user
                ? "Submit Application"
                : "Go to sign in"}
          </Link>
        </div>
      </section>
    </main>
  );
}
