export const adminNavigation = [
  {
    label: "Overview",
    items: [{ label: "Overview", href: "/admin", icon: "overview", section: "overview" }],
  },
  {
    label: "Management",
    items: [
      { label: "Users", href: "/admin/users", icon: "users", section: "users" },
      { label: "Creators", href: "/admin/creators", icon: "creators", section: "creators" },
      { label: "NFTs", href: "/admin/nfts", icon: "nfts", section: "nfts" },
      {
        label: "Collections",
        href: "/admin/collections",
        icon: "collections",
        section: "collections",
      },
      {
        label: "Listings & Auctions",
        href: "/admin/listings",
        icon: "listings",
        section: "listings",
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        label: "Transactions",
        href: "/admin/transactions",
        icon: "transactions",
        section: "transactions",
      },
      {
        label: "Moderation",
        href: "/admin/moderation",
        icon: "moderation",
        section: "moderation",
        badge: "12",
      },
      {
        label: "IPFS & Metadata",
        href: "/admin/ipfs",
        icon: "ipfs",
        section: "ipfs",
      },
      {
        label: "Notifications",
        href: "/admin/notifications",
        icon: "notifications",
        section: "notifications",
      },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Revenue", href: "/admin/revenue", icon: "revenue", section: "revenue" },
      {
        label: "Royalties",
        href: "/admin/royalties",
        icon: "royalties",
        section: "royalties",
      },
      {
        label: "Settlements",
        href: "/admin/settlements",
        icon: "settlements",
        section: "settlements",
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        label: "Networks & Contracts",
        href: "/admin/networks",
        icon: "networks",
        section: "networks",
      },
      {
        label: "Admins & Roles",
        href: "/admin/admins",
        icon: "admins",
        section: "admins",
      },
      { label: "Audit Logs", href: "/admin/audit", icon: "audit", section: "audit" },
      {
        label: "Platform Settings",
        href: "/admin/settings",
        icon: "settings",
        section: "settings",
      },
    ],
  },
] as const;

type AdminItem = (typeof adminNavigation)[number]["items"][number];
export const adminItems = adminNavigation.reduce<AdminItem[]>(
  (items, group) => [...items, ...group.items],
  [],
);
export type AdminSectionName = AdminItem["section"];
export type AdminIconName =
  | AdminItem["icon"]
  | "search"
  | "menu"
  | "close"
  | "external"
  | "chevronDown"
  | "chevronLeft"
  | "chevronRight"
  | "filter"
  | "more"
  | "mail"
  | "lock"
  | "eye"
  | "eyeOff"
  | "shield"
  | "arrowRight"
  | "key"
  | "wallet"
  | "userCheck"
  | "userX";
export const adminSections = new Set<string>(adminItems.map((item) => item.section));
