import type { Metadata } from "next";
import TokenDetail from "../../components/tokens/TokenDetail";

export const metadata: Metadata = {
  title: "Token Details — Cryptonix",
  description: "Live token price, market statistics, and project information.",
};

export default async function TokenPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TokenDetail id={id} />;
}
