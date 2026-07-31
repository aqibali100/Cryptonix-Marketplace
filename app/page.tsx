"use client";

import CollectionSection from "./components/landing/CollectionSection";
import HeroSection from "./components/landing/HeroSection";
import TrendingNFTs from "./components/landing/TrendingNFTs";
import TrendingTokens from "./components/landing/TrendingTokens";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <TrendingTokens />
      <CollectionSection />
      <TrendingNFTs />
      {/* <HowItWorks />
      <StatisticsSection /> */}
    </main>
  );
}
