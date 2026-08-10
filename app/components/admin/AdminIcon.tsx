import type { AdminIconName } from "./admin-navigation";

export default function AdminIcon({
  name,
  className = "h-[18px] w-[18px]",
}: {
  name: AdminIconName;
  className?: string;
}) {
  const paths: Record<AdminIconName, React.ReactNode> = {
    overview: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    creators: (
      <>
        <path d="m12 3 2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.3-4.5 2.3.9-5-3.6-3.5 5-.7Z" />
        <path d="M8 21h8" />
      </>
    ),
    nfts: (
      <>
        <path d="m12 2 8 4.5v9L12 20l-8-4.5v-9Z" />
        <path d="m4 6.5 8 4.5 8-4.5M12 11v9" />
      </>
    ),
    collections: (
      <>
        <rect x="4" y="4" width="15" height="15" rx="3" />
        <path d="M8 1h9a5 5 0 0 1 5 5v9M8 14l2.5-3 2.5 2 2.5-3 3.5 4" />
      </>
    ),
    listings: (
      <>
        <path d="M4 5h16M4 12h16M4 19h16" />
        <circle cx="8" cy="5" r="2" fill="currentColor" stroke="none" />
        <circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" />
        <circle cx="11" cy="19" r="2" fill="currentColor" stroke="none" />
      </>
    ),
    transactions: (
      <>
        <path d="M7 7h12l-3-3M17 17H5l3 3" />
        <path d="m19 7-3 3M5 17l3-3" />
      </>
    ),
    moderation: (
      <>
        <path d="M12 3 4 6v5c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V6Z" />
        <path d="m9 12 2 2 4-5" />
      </>
    ),
    ipfs: (
      <>
        <path d="m12 2 8.5 5v10L12 22l-8.5-5V7Z" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v7M3.5 7l6 3.5M20.5 7l-6 3.5M12 15v7" />
      </>
    ),
    notifications: (
      <>
        <path d="M18 9a6 6 0 0 0-12 0v4l-2 3h16l-2-3Z" />
        <path d="M10 20h4" />
      </>
    ),
    revenue: (
      <>
        <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
        <path d="m3 6 6-4 6 4 6-3" />
      </>
    ),
    royalties: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 9.5c0-1.4 1.4-2.5 3.5-2.5S15 8 15 9.5 13.7 12 11.5 12 8 13.1 8 14.5 9.4 17 11.5 17s3.5-1.1 3.5-2.5M11.5 5v14" />
      </>
    ),
    settlements: (
      <>
        <path d="M3 8h18M5 8V5h14v3M5 8v11h14V8" />
        <path d="M9 13h6" />
      </>
    ),
    networks: (
      <>
        <circle cx="12" cy="5" r="3" />
        <circle cx="5" cy="18" r="3" />
        <circle cx="19" cy="18" r="3" />
        <path d="m10.5 7.6-4 7M13.5 7.6l4 7M8 18h8" />
      </>
    ),
    admins: (
      <>
        <circle cx="9" cy="8" r="4" />
        <path d="M2 21a7 7 0 0 1 12-4.9" />
        <path d="m17 14 .8 1.6 1.8.3-1.3 1.3.3 1.8-1.6-.8-1.6.8.3-1.8-1.3-1.3 1.8-.3Z" />
      </>
    ),
    audit: (
      <>
        <path d="M6 3h12v18H6z" />
        <path d="M9 8h6M9 12h6M9 16h3" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    external: (
      <>
        <path d="M14 4h6v6M20 4l-9 9" />
        <path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
      </>
    ),
    chevronDown: <path d="m7 9 5 5 5-5" />,
    chevronLeft: <path d="m15 18-6-6 6-6" />,
    chevronRight: <path d="m9 18 6-6-6-6" />,
    filter: (
      <>
        <path d="M4 6h16M7 12h10M10 18h4" />
        <circle cx="8" cy="6" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="15" cy="12" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="12" cy="18" r="1.5" fill="currentColor" stroke="none" />
      </>
    ),
    more: (
      <>
        <circle cx="5" cy="12" r="1.7" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none" />
        <circle cx="19" cy="12" r="1.7" fill="currentColor" stroke="none" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="3" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
      </>
    ),
    eye: (
      <>
        <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    eyeOff: (
      <>
        <path d="m3 3 18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.4 5.3A9.8 9.8 0 0 1 12 5c5.5 0 9 7 9 7a16 16 0 0 1-2.1 3M6.6 6.6C4.4 8 3 12 3 12s3.5 7 9 7a9.5 9.5 0 0 0 3.1-.5" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 4 6v5c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V6Z" />
        <path d="m9 12 2 2 4-5" />
      </>
    ),
    arrowRight: <path d="M5 12h14m-5-5 5 5-5 5" />,
    key: (
      <>
        <circle cx="8" cy="15" r="4" />
        <path d="m11 12 8-8M15 8l2 2M17 6l2 2" />
      </>
    ),
    wallet: (
      <>
        <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a3 3 0 0 1-3-3V7" />
        <path d="M3 8h17M15 12h6v4h-6a2 2 0 0 1 0-4Z" />
      </>
    ),
    userCheck: (
      <>
        <circle cx="9" cy="8" r="4" />
        <path d="M2 21a7 7 0 0 1 12-4.9M16 18l2 2 4-5" />
      </>
    ),
    userX: (
      <>
        <circle cx="9" cy="8" r="4" />
        <path d="M2 21a7 7 0 0 1 12-4.9M17 16l5 5M22 16l-5 5" />
      </>
    ),
  };
  return (
    <svg
      aria-hidden="true"
      className={className}
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
