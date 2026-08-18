import type { Metadata } from "next";
import TokensDirectory from "../../components/tokens/TokensDirectory";
import PageBreadcrumb from "../../components/layout/PageBreadcrumb";

export const metadata: Metadata = {
  title: "Token Market — Cryptonix",
  description: "Explore live cryptocurrency prices, market caps, and performance.",
};

export default function TokensPage() {
  return (
    <main className="mx-auto min-h-screen w-[min(1180px,calc(100%_-_40px))] pb-15 pt-[118px] max-[600px]:w-[calc(100%_-_28px)] max-[600px]:pt-[100px]">
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Tokens" }]} />
      <div className="mb-9">
        <h1 className="text-[clamp(38px,6vw,68px)] font-semibold tracking-[-3.5px] max-[400px]:text-[34px] max-[400px]:tracking-[-2px]">
          Explore all tokens.
        </h1>
        <p className="max-w-xl text-xs leading-6 text-[#788399]">
          Discover live cryptocurrency prices, market caps, and performance metrics for a wide range
          of tokens.
        </p>
      </div>
      <TokensDirectory />
    </main>
  );
}
