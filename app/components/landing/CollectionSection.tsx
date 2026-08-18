"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import CollectionCard from "./CollectionCard";

const collections = [
  {
    name: "Cyber Punk",
    category: "Collectibles",
    floor: "2.48 ETH",
    volume: "1.2K ETH",
    owners: "8.4K",
    tone: "punk",
  },
  {
    name: "AI Art",
    category: "Generative",
    floor: "1.16 ETH",
    volume: "842 ETH",
    owners: "5.1K",
    tone: "ai",
  },
  {
    name: "Gaming Assets",
    category: "Gaming",
    floor: "0.74 ETH",
    volume: "629 ETH",
    owners: "12K",
    tone: "gaming",
  },
  {
    name: "Metaverse",
    category: "Virtual worlds",
    floor: "3.05 ETH",
    volume: "2.1K ETH",
    owners: "6.8K",
    tone: "meta",
  },
  {
    name: "Neon Dreams",
    category: "Digital Art",
    floor: "1.82 ETH",
    volume: "956 ETH",
    owners: "4.7K",
    tone: "gaming",
  },
  {
    name: "Quantum Beasts",
    category: "Collectibles",
    floor: "2.12 ETH",
    volume: "1.4K ETH",
    owners: "7.2K",
    tone: "ai",
  },
  {
    name: "Cosmic Realms",
    category: "Virtual worlds",
    floor: "4.20 ETH",
    volume: "2.8K ETH",
    owners: "9.1K",
    tone: "punk",
  },
  {
    name: "Pixel Legends",
    category: "Gaming",
    floor: "0.92 ETH",
    volume: "734 ETH",
    owners: "11K",
    tone: "meta",
  },
  {
    name: "Synthetic Minds",
    category: "Generative",
    floor: "1.54 ETH",
    volume: "887 ETH",
    owners: "5.9K",
    tone: "ai",
  },
  {
    name: "Ethereal Forms",
    category: "Digital Art",
    floor: "2.76 ETH",
    volume: "1.7K ETH",
    owners: "6.3K",
    tone: "gaming",
  },
];

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

export default function CollectionSection() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({ back: false, forward: true });
  const updateControls = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const end = slider.scrollWidth - slider.clientWidth;
    setScrollState({ back: slider.scrollLeft > 2, forward: slider.scrollLeft < end - 2 });
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const observer = new ResizeObserver(updateControls);
    observer.observe(slider);
    updateControls();
    return () => observer.disconnect();
  }, [updateControls]);

  const moveSlider = (direction: -1 | 1) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const card = slider.firstElementChild as HTMLElement | null;
    slider.scrollBy({
      left: direction * ((card?.offsetWidth ?? slider.clientWidth) + 13),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  return (
    <section
      className="landing-section page-shell w-[min(1180px,_calc(100%_-_40px))] scroll-mt-[98px] px-0 pb-[72px] pt-4 [margin-inline:auto] max-[600px]:w-[min(100%_-_28px,_1180px)] max-[600px]:scroll-mt-[76px] max-[600px]:pb-[62px]"
      id="collections"
    >
      <div className="mb-7 flex items-end justify-between max-[600px]:items-start">
        <div>
          <span className="text-[12px] font-bold tracking-[2px] text-[var(--cyan)]">
            CURATED COLLECTIONS
          </span>
          <h2 className="mb-0 mt-[7px] text-[clamp(29px,4vw,40px)] font-semibold tracking-[-1.8px]">
            Top collections
          </h2>
          <p className="mt-[5px] text-[12px] text-[#6f7a8f]">
            The most sought-after digital worlds, ranked by collector activity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/marketplace"
            className="group mr-2 flex items-center gap-1.5 text-[12px] font-semibold text-[#67e6dc] transition hover:text-white max-[600px]:hidden"
          >
            All Collections <ArrowIcon direction="right" />
          </Link>
          <button
            type="button"
            onClick={() => moveSlider(-1)}
            disabled={!scrollState.back}
            aria-label="Show previous collections"
            className="grid cursor-pointer h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[.04] transition hover:border-[#5de0d4]/50 hover:text-[#5de0d4] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={() => moveSlider(1)}
            disabled={!scrollState.forward}
            aria-label="Show next collections"
            className="grid cursor-pointer h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[.04] transition hover:border-[#5de0d4]/50 hover:text-[#5de0d4] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowIcon direction="right" />
          </button>
        </div>
      </div>
      <div
        ref={sliderRef}
        onScroll={updateControls}
        className="flex snap-x snap-mandatory gap-[13px] overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Top collections carousel"
      >
        {collections.map((collection, index) => (
          <CollectionCard key={collection.name} collection={collection} rank={index + 1} />
        ))}
      </div>
    </section>
  );
}
