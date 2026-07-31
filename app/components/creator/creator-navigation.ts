export const creatorNavigation = [
  { label: "Overview", href: "/creator", icon: "overview", section: "overview" },
  { label: "Create NFT", href: "/creator/create", icon: "create", section: "create" },
  { label: "My NFTs", href: "/creator/nfts", icon: "nfts", section: "nfts" },
  { label: "Collections", href: "/creator/collections", icon: "collections", section: "collections" },
  { label: "Active listings", href: "/creator/listings", icon: "listings", section: "listings" },
  { label: "Auctions", href: "/creator/auctions", icon: "auctions", section: "auctions" },
  { label: "Offers received", href: "/creator/offers", icon: "offers", section: "offers" },
  { label: "Sales history", href: "/creator/sales", icon: "sales", section: "sales" },
  { label: "Earnings", href: "/creator/earnings", icon: "earnings", section: "earnings" },
  { label: "Royalties", href: "/creator/royalties", icon: "royalties", section: "royalties" },
  { label: "Linked wallets", href: "/creator/wallets", icon: "wallets", section: "wallets" },
  { label: "Profile settings", href: "/creator/settings", icon: "settings", section: "settings" },
] as const;

export type CreatorSectionName = (typeof creatorNavigation)[number]["section"];
export type CreatorIconName = (typeof creatorNavigation)[number]["icon"];

export const creatorSections = new Set<string>(creatorNavigation.map((item) => item.section));
