import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketplace — Cryptonix",
  description: "Discover rare digital assets and trending cross-chain collections.",
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
