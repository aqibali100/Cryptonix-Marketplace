import type { CreatorIconName } from "./creator-navigation";

const paths: Record<CreatorIconName, React.ReactNode> = {
  overview: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </>
  ),
  create: (
    <>
      <path d="M12 3v12M6 9h12" />
      <path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
    </>
  ),
  nfts: (
    <>
      <path d="m12 2 8 4.5v9L12 20l-8-4.5v-9L12 2Z" />
      <path d="m4.5 6.8 7.5 4.3 7.5-4.3M12 11.1V20" />
    </>
  ),
  collections: (
    <>
      <rect x="4" y="4" width="13" height="13" rx="2" />
      <path d="M8 20h10a2 2 0 0 0 2-2V8" />
      <path d="m7.5 13 2.7-3 2.1 2.2 1.7-1.7" />
    </>
  ),
  listings: (
    <>
      <path d="M9 5h11M9 12h11M9 19h11" />
      <path d="M4 5h.01M4 12h.01M4 19h.01" />
    </>
  ),
  auctions: (
    <>
      <path d="m14 5 5 5M12.5 6.5l3-3 5 5-3 3zM3 21l8.5-8.5" />
      <path d="M5 16l3 3M13 21h8" />
    </>
  ),
  offers: (
    <>
      <path d="M20 12V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6" />
      <path d="m8 9 4 3 4-3M16 17h6M19 14l3 3-3 3" />
    </>
  ),
  sales: (
    <>
      <path d="M4 19V9M10 19V5M16 19v-7M22 19V2" />
      <path d="m3 6 6-3 6 5 7-6" />
    </>
  ),
  earnings: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M16 8.5c-.7-.9-2-1.5-3.5-1.5-2 0-3.5 1-3.5 2.5s1.2 2.1 3.5 2.5 3.5 1 3.5 2.5-1.5 2.5-3.5 2.5C11 17 9.7 16.4 9 15.5M12.5 5v14" />
    </>
  ),
  royalties: (
    <>
      <circle cx="7" cy="7" r="2.5" />
      <circle cx="17" cy="17" r="2.5" />
      <path d="m19 5-14 14" />
    </>
  ),
  wallets: (
    <>
      <path d="M4 7a3 3 0 0 1 3-3h11a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a3 3 0 0 1-3-3V7Z" />
      <path d="M3 8h15M16 13h5v4h-5a2 2 0 1 1 0-4Z" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="8" r="3" />
      <path d="M5.5 20a6.5 6.5 0 0 1 11.4-4.3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M18 13.5v1M18 21.5v1M13.5 18h1M21.5 18h1" />
    </>
  ),
};

export default function CreatorNavIcon({ name }: { name: CreatorIconName }) {
  return (
    <svg
      aria-hidden="true"
      className="h-[17px] w-[17px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
