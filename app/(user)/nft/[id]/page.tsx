import type { Metadata } from "next";
import NftDetail from "../../../components/nfts/NftDetail";

export const metadata: Metadata = {
  title: "NFT Details — Cryptonix",
  description: "Explore artwork, creator, traits, provenance, and listing information.",
};

export default async function NftDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <NftDetail id={id} />;
}
