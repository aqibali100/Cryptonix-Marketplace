import React from 'react'
import Link from 'next/link'
import CollectionCard from './CollectionCard';

const CollectionSection = () => {
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
    ];
  return (
   <>
   <section
           className="landing-section page-shell py-[52px] px-0 max-[600px]:py-[75px] max-[600px]:px-0 w-[min(1180px,_calc(100%_-_40px))] [margin-inline:auto] max-[600px]:w-[min(100%_-_28px,_1180px)]"
           id="collections"
         >
           <div className="landing-section-head flex items-end justify-between mb-7 [&_h2]:[margin:7px_0_5px] [&_p]:text-[#6f7a8f] [&_p]:text-[12px] [&>a]:text-[#9da7bb] [&>a]:text-[12px] [&>a_span]:ml-2 [&>a_span]:text-[#6be1d7] max-[600px]:items-start max-[600px]:[&>a]:text-0 max-[600px]:[&>a_span]:text-[19px]">
             <div>
               <span className="section-kicker text-[var(--cyan)] text-[12px] font-bold tracking-[2px]">
                 CURATED COLLECTIONS
               </span>
               <h2 className="mt-[7px] mb-0 text-[clamp(29px,4vw,40px)] font-semibold tracking-[-1.8px]">
                 Top collections
               </h2>
               <p>The most sought-after digital worlds, ranked by collector activity.</p>
             </div>
              <Link
               href="/collections"
               className="group flex items-center gap-1.5 text-[12px] font-semibold text-white"
             >
               <span>All Collections</span>
               <svg
                 className="h-3 w-3 transition group-hover:translate-x-0.5"
                 viewBox="0 0 12 12"
                 fill="none"
               >
                 <path
                   d="M4.5 2.25L7.75 5.5L4.5 8.75"
                   stroke="currentColor"
                   strokeWidth="1.5"
                   strokeLinecap="round"
                   strokeLinejoin="round"
                 />
               </svg>
             </Link>
           </div>
           <div className="top-collections-grid grid grid-cols-[repeat(4,1fr)] gap-[13px] max-[900px]:grid-cols-[repeat(2,1fr)] max-[600px]:grid-cols-[1fr]">
             {collections.map((collection, index) => (
               <CollectionCard key={collection.name} collection={collection} rank={index + 1} />
             ))}
           </div>
         </section>
   </>
  )
}

export default CollectionSection