import type { Metadata } from "next";
import CreatorShell from "../../components/creator/CreatorShell";
import CreatorGuard from "../../components/auth/CreatorGuard";

export const metadata: Metadata = {
  title: "Creator Studio — Cryptonix",
  description: "Create, manage, and grow your digital asset business.",
};

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <CreatorShell>
      <CreatorGuard>{children}</CreatorGuard>
    </CreatorShell>
  );
}
