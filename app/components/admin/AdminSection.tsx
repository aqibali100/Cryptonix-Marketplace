"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { adminGraphql } from "../../lib/admin-auth";
import { API_URL } from "../../lib/api";
import { ADMIN_CREATORS_QUERY, type AdminCreatorsPayload } from "../../lib/admin-creators";
import {
  ADMIN_USER_DETAILS_QUERY,
  ADMIN_USER_NFTS_QUERY,
  ADMIN_USER_WALLETS_QUERY,
  ADMIN_USERS_QUERY,
  ADMIN_USERS_EXPORT_QUERY,
  UPDATE_ADMIN_USER_STATUS_MUTATION,
  adminUsersFilterSchema,
  type AdminManagedUser,
  type AdminUserDetails,
  type AdminUserDetailsPayload,
  type AdminUserNftsPayload,
  type AdminUserWallets,
  type AdminUserWalletsPayload,
  type AdminUserStatusPayload,
  type AdminUsersPayload,
  type AdminUsersExportPayload,
} from "../../lib/admin-users";
import { useAdminSession } from "./AdminGuard";
import AdminIcon from "./AdminIcon";
import type { AdminIconName, AdminSectionName } from "./admin-navigation";

type Tone = "violet" | "cyan" | "green" | "amber" | "rose";
type Metric = { label: string; value: string; change: string; tone: Tone };
type Row = { primary: string; secondary: string; values: string[]; status: string; tone: Tone };
type ModuleConfig = {
  title: string;
  description: string;
  action: string;
  metrics: Metric[];
  columns: string[];
  rows: Row[];
};

const toneClasses: Record<Tone, { text: string; bg: string; border: string }> = {
  violet: { text: "text-[#b7a4ff]", bg: "bg-violet-400/[.08]", border: "border-violet-300/[.14]" },
  cyan: { text: "text-cyan-300", bg: "bg-cyan-400/[.07]", border: "border-cyan-300/[.13]" },
  green: {
    text: "text-emerald-300",
    bg: "bg-emerald-400/[.07]",
    border: "border-emerald-300/[.13]",
  },
  amber: { text: "text-amber-300", bg: "bg-amber-400/[.07]", border: "border-amber-300/[.13]" },
  rose: { text: "text-rose-300", bg: "bg-rose-400/[.07]", border: "border-rose-300/[.13]" },
};

const configs: Record<Exclude<AdminSectionName, "overview">, ModuleConfig> = {
  users: {
    title: "User Management",
    description: "Review accounts, wallet activity and platform access from one secure workspace.",
    action: "Export users",
    metrics: [
      { label: "Total users", value: "24,892", change: "+8.4% this month", tone: "violet" },
      { label: "Active today", value: "3,641", change: "14.6% of total", tone: "cyan" },
      { label: "New this week", value: "1,284", change: "+12.1%", tone: "green" },
      { label: "Restricted", value: "38", change: "7 need review", tone: "rose" },
    ],
    columns: ["Account", "Wallet", "Role", "Joined", "Status"],
    rows: [
      {
        primary: "Maya Chen",
        secondary: "@maya.collects",
        values: ["0x71F2…8A40", "User", "Aug 10, 2026"],
        status: "Active",
        tone: "green",
      },
      {
        primary: "Alex Rivera",
        secondary: "@alexr",
        values: ["0x9B31…F122", "Creator", "Aug 09, 2026"],
        status: "Active",
        tone: "green",
      },
      {
        primary: "Noah Williams",
        secondary: "@noahw",
        values: ["0x32A0…91BC", "User", "Aug 08, 2026"],
        status: "Review",
        tone: "amber",
      },
      {
        primary: "Lina Park",
        secondary: "@linap",
        values: ["0xD190…55A1", "User", "Aug 07, 2026"],
        status: "Suspended",
        tone: "rose",
      },
    ],
  },
  creators: {
    title: "Creator Management",
    description: "Verify creative identities, review applications and monitor creator health.",
    action: "Review applications",
    metrics: [
      { label: "Verified creators", value: "1,248", change: "+54 this month", tone: "violet" },
      { label: "Applications", value: "86", change: "21 high priority", tone: "amber" },
      { label: "Active creators", value: "892", change: "71.4% active", tone: "green" },
      { label: "Flagged", value: "14", change: "3 escalated", tone: "rose" },
    ],
    columns: ["Creator", "Collections", "Total volume", "Applied", "Verification"],
    rows: [
      {
        primary: "Aqib Ali",
        secondary: "Digital artist · Pakistan",
        values: ["6 collections", "42.8 ETH", "Aug 10, 2026"],
        status: "Verified",
        tone: "green",
      },
      {
        primary: "Studio Kairo",
        secondary: "3D collective · Japan",
        values: ["3 collections", "18.2 ETH", "Aug 09, 2026"],
        status: "Pending",
        tone: "amber",
      },
      {
        primary: "Nova Frames",
        secondary: "Motion artist · UK",
        values: ["8 collections", "91.5 ETH", "Aug 07, 2026"],
        status: "Verified",
        tone: "green",
      },
      {
        primary: "Pixel Loom",
        secondary: "Generative art · USA",
        values: ["1 collection", "2.4 ETH", "Aug 05, 2026"],
        status: "Needs info",
        tone: "rose",
      },
    ],
  },
  nfts: {
    title: "NFT Management",
    description: "Inspect metadata, ownership, visibility and mint health across every network.",
    action: "Export assets",
    metrics: [
      { label: "Total NFTs", value: "84,210", change: "+2,041 this week", tone: "violet" },
      { label: "Minted", value: "81,924", change: "97.3% success", tone: "green" },
      { label: "Awaiting mint", value: "1,846", change: "Normal queue", tone: "amber" },
      { label: "Failed", value: "440", change: "64 need review", tone: "rose" },
    ],
    columns: ["Asset", "Creator", "Network", "Token", "Status"],
    rows: [
      {
        primary: "Neon Tide #827",
        secondary: "Aether Dimensions",
        values: ["Aqib Ali", "Base Sepolia", "ERC-721 · #827"],
        status: "Minted",
        tone: "green",
      },
      {
        primary: "Synthetic Bloom #41",
        secondary: "Synthetic Nature",
        values: ["Nova Frames", "Ethereum", "ERC-1155 · #41"],
        status: "Minted",
        tone: "green",
      },
      {
        primary: "Prismatic Form #12",
        secondary: "Prismatic Forms",
        values: ["Studio Kairo", "Polygon Amoy", "ERC-721"],
        status: "Awaiting",
        tone: "amber",
      },
      {
        primary: "Void Signal #08",
        secondary: "Signal Lost",
        values: ["Pixel Loom", "Base Sepolia", "ERC-721"],
        status: "Failed",
        tone: "rose",
      },
    ],
  },
  collections: {
    title: "Collections",
    description: "Review verified collections, marketplace reach and authenticity signals.",
    action: "Feature collection",
    metrics: [
      { label: "Collections", value: "3,842", change: "+126 this month", tone: "violet" },
      { label: "Verified", value: "1,106", change: "28.7% verified", tone: "green" },
      { label: "Total volume", value: "18.4K ETH", change: "+6.2%", tone: "cyan" },
      { label: "Under review", value: "29", change: "8 priority", tone: "amber" },
    ],
    columns: ["Collection", "Creator", "Items", "Volume", "Status"],
    rows: [
      {
        primary: "Aether Dimensions",
        secondary: "Floor 1.72 ETH",
        values: ["Aqib Ali", "842", "2,482 ETH"],
        status: "Verified",
        tone: "green",
      },
      {
        primary: "Synthetic Nature",
        secondary: "Floor 0.94 ETH",
        values: ["Nova Frames", "510", "1,921 ETH"],
        status: "Verified",
        tone: "green",
      },
      {
        primary: "Prismatic Forms",
        secondary: "Floor 2.10 ETH",
        values: ["Studio Kairo", "184", "728 ETH"],
        status: "Review",
        tone: "amber",
      },
      {
        primary: "Signal Lost",
        secondary: "Floor 0.18 ETH",
        values: ["Pixel Loom", "92", "84 ETH"],
        status: "Flagged",
        tone: "rose",
      },
    ],
  },
  listings: {
    title: "Listings & Auctions",
    description: "Monitor live inventory, bids, expiry and abnormal marketplace activity.",
    action: "Export activity",
    metrics: [
      { label: "Active listings", value: "12,492", change: "+4.7% today", tone: "violet" },
      { label: "Live auctions", value: "628", change: "184 ending soon", tone: "cyan" },
      { label: "Sales today", value: "1,042", change: "894.2 ETH", tone: "green" },
      { label: "Stale listings", value: "74", change: "Needs sync", tone: "amber" },
    ],
    columns: ["Asset", "Seller", "Type", "Price / top bid", "Status"],
    rows: [
      {
        primary: "Neon Tide #827",
        secondary: "Aether Dimensions",
        values: ["0x71F2…8A40", "Fixed price", "2.40 ETH"],
        status: "Listed",
        tone: "green",
      },
      {
        primary: "Lucid Matter #19",
        secondary: "Matter State",
        values: ["0x2A17…C842", "Auction", "8.12 ETH"],
        status: "3h left",
        tone: "amber",
      },
      {
        primary: "Bloom #41",
        secondary: "Synthetic Nature",
        values: ["0xE109…7F91", "Auction", "1.08 ETH"],
        status: "12 bids",
        tone: "cyan",
      },
      {
        primary: "Void Signal #08",
        secondary: "Signal Lost",
        values: ["0x18BC…2A01", "Fixed price", "0.20 ETH"],
        status: "Stale",
        tone: "rose",
      },
    ],
  },
  transactions: {
    title: "Transactions",
    description: "Trace confirmations, contract calls and reconciliation status in real time.",
    action: "Export ledger",
    metrics: [
      { label: "Transactions", value: "1.28M", change: "+18.2K today", tone: "violet" },
      { label: "Confirmed", value: "99.72%", change: "Healthy", tone: "green" },
      { label: "Pending", value: "284", change: "Median 8 sec", tone: "amber" },
      { label: "Failed", value: "67", change: "12 mismatches", tone: "rose" },
    ],
    columns: ["Transaction", "Type", "Network", "Value", "Status"],
    rows: [
      {
        primary: "0x6ddb…0aac",
        secondary: "3 minutes ago",
        values: ["Mint", "Base Sepolia", "0.0002 ETH"],
        status: "Confirmed",
        tone: "green",
      },
      {
        primary: "0xb907…feb3",
        secondary: "7 minutes ago",
        values: ["Mint", "Base Sepolia", "0.0002 ETH"],
        status: "Confirmed",
        tone: "green",
      },
      {
        primary: "0x92fa…184c",
        secondary: "9 minutes ago",
        values: ["Settlement", "Ethereum", "4.28 ETH"],
        status: "Pending",
        tone: "amber",
      },
      {
        primary: "0x81bd…73a2",
        secondary: "14 minutes ago",
        values: ["Listing", "Polygon Amoy", "0 ETH"],
        status: "Mismatch",
        tone: "rose",
      },
    ],
  },
  moderation: {
    title: "Moderation Center",
    description: "Prioritize reports, capture evidence and resolve marketplace safety cases.",
    action: "Create case",
    metrics: [
      { label: "Open cases", value: "124", change: "12 high priority", tone: "rose" },
      { label: "In review", value: "46", change: "8 assigned to you", tone: "amber" },
      { label: "Resolved today", value: "38", change: "Avg. 2.4 hours", tone: "green" },
      { label: "SLA health", value: "96.8%", change: "+1.2%", tone: "cyan" },
    ],
    columns: ["Case", "Category", "Reporter", "Assigned", "Priority"],
    rows: [
      {
        primary: "#MOD-2841 · Signal Lost",
        secondary: "Reported 18 min ago",
        values: ["Copyright", "@originalframes", "Sarah K."],
        status: "Critical",
        tone: "rose",
      },
      {
        primary: "#MOD-2840 · User 0x71F2",
        secondary: "Reported 42 min ago",
        values: ["Impersonation", "@mayac", "Omar A."],
        status: "High",
        tone: "amber",
      },
      {
        primary: "#MOD-2839 · Bloom #18",
        secondary: "Reported 1 hour ago",
        values: ["Explicit content", "System", "Unassigned"],
        status: "Medium",
        tone: "cyan",
      },
      {
        primary: "#MOD-2838 · Kairo Labs",
        secondary: "Reported 2 hours ago",
        values: ["Spam", "@noahw", "Lina P."],
        status: "Low",
        tone: "violet",
      },
    ],
  },
  ipfs: {
    title: "IPFS & Metadata",
    description: "Validate content availability, gateway performance and metadata integrity.",
    action: "Run health scan",
    metrics: [
      { label: "Pinned assets", value: "168.4K", change: "2.8 TB stored", tone: "violet" },
      { label: "Gateway uptime", value: "99.98%", change: "142 ms latency", tone: "green" },
      { label: "Metadata valid", value: "99.4%", change: "1,012 warnings", tone: "cyan" },
      { label: "Broken assets", value: "38", change: "14 recovered", tone: "rose" },
    ],
    columns: ["CID / asset", "Content", "Gateway", "Last checked", "Health"],
    rows: [
      {
        primary: "bafybei…7p2k",
        secondary: "Neon Tide #827",
        values: ["Image · 4.2 MB", "Primary", "30 sec ago"],
        status: "Available",
        tone: "green",
      },
      {
        primary: "bafybei…1x9m",
        secondary: "Synthetic Bloom #41",
        values: ["Metadata · 2 KB", "Primary", "1 min ago"],
        status: "Available",
        tone: "green",
      },
      {
        primary: "bafybei…8q4n",
        secondary: "Prismatic Form #12",
        values: ["Image · 8.1 MB", "Fallback", "4 min ago"],
        status: "Degraded",
        tone: "amber",
      },
      {
        primary: "bafybei…3v7c",
        secondary: "Void Signal #08",
        values: ["Image · unknown", "Unavailable", "8 min ago"],
        status: "Broken",
        tone: "rose",
      },
    ],
  },
  notifications: {
    title: "Notifications",
    description: "Manage platform alerts, delivery channels and audience communication.",
    action: "New broadcast",
    metrics: [
      { label: "Sent today", value: "48,210", change: "+8.2%", tone: "violet" },
      { label: "Delivery rate", value: "98.7%", change: "Healthy", tone: "green" },
      { label: "Scheduled", value: "12", change: "Next in 2h", tone: "cyan" },
      { label: "Failed", value: "284", change: "Retry queued", tone: "rose" },
    ],
    columns: ["Campaign", "Channel", "Audience", "Delivery", "Status"],
    rows: [
      {
        primary: "Weekly creator digest",
        secondary: "Aug 10, 10:00 AM",
        values: ["Email + In-app", "1,248 creators", "98.9%"],
        status: "Delivered",
        tone: "green",
      },
      {
        primary: "Auction ending alerts",
        secondary: "Continuous trigger",
        values: ["Push + In-app", "Dynamic", "99.4%"],
        status: "Active",
        tone: "cyan",
      },
      {
        primary: "Network maintenance",
        secondary: "Aug 12, 02:00 AM",
        values: ["All channels", "24,892 users", "—"],
        status: "Scheduled",
        tone: "amber",
      },
      {
        primary: "Failed mint follow-up",
        secondary: "Aug 09, 06:00 PM",
        values: ["Email", "440 users", "91.2%"],
        status: "Review",
        tone: "rose",
      },
    ],
  },
  revenue: {
    title: "Revenue",
    description: "Track marketplace fees, network contribution and financial performance.",
    action: "Download report",
    metrics: [
      { label: "Gross volume", value: "$4.82M", change: "+12.4% MoM", tone: "violet" },
      { label: "Platform revenue", value: "$120.6K", change: "+9.8% MoM", tone: "green" },
      { label: "Today", value: "$8,942", change: "+4.1%", tone: "cyan" },
      { label: "Refunds", value: "$1,284", change: "0.03% of volume", tone: "amber" },
    ],
    columns: ["Period / network", "Sales volume", "Fees", "Refunds", "Performance"],
    rows: [
      {
        primary: "Base",
        secondary: "August 2026",
        values: ["$2.41M", "$60.2K", "$420"],
        status: "+14.2%",
        tone: "green",
      },
      {
        primary: "Ethereum",
        secondary: "August 2026",
        values: ["$1.82M", "$45.5K", "$692"],
        status: "+8.7%",
        tone: "green",
      },
      {
        primary: "Polygon",
        secondary: "August 2026",
        values: ["$590K", "$14.9K", "$172"],
        status: "+3.1%",
        tone: "cyan",
      },
      {
        primary: "Cross-network",
        secondary: "Pending reconciliation",
        values: ["$18.4K", "$460", "$0"],
        status: "Review",
        tone: "amber",
      },
    ],
  },
  royalties: {
    title: "Royalties",
    description: "Monitor creator royalty obligations, distributions and compliance.",
    action: "Export royalties",
    metrics: [
      { label: "Paid royalties", value: "$842.6K", change: "Lifetime", tone: "violet" },
      { label: "This month", value: "$48.2K", change: "+11.8%", tone: "green" },
      { label: "Creators paid", value: "1,106", change: "98.3% coverage", tone: "cyan" },
      { label: "Exceptions", value: "18", change: "$2,410 held", tone: "amber" },
    ],
    columns: ["Creator", "Collection", "Rate", "Earned", "Payout"],
    rows: [
      {
        primary: "Aqib Ali",
        secondary: "0xB2C…19F",
        values: ["Aether Dimensions", "7.5%", "$12,482"],
        status: "Paid",
        tone: "green",
      },
      {
        primary: "Nova Frames",
        secondary: "0x91A…72E",
        values: ["Synthetic Nature", "10%", "$8,194"],
        status: "Paid",
        tone: "green",
      },
      {
        primary: "Studio Kairo",
        secondary: "0x4D2…8C1",
        values: ["Prismatic Forms", "5%", "$3,842"],
        status: "Processing",
        tone: "cyan",
      },
      {
        primary: "Pixel Loom",
        secondary: "0xC20…4F7",
        values: ["Signal Lost", "8%", "$1,026"],
        status: "On hold",
        tone: "amber",
      },
    ],
  },
  settlements: {
    title: "Settlements",
    description: "Reconcile seller payouts, fees and settlement exceptions.",
    action: "Run settlement",
    metrics: [
      { label: "Settled today", value: "$284.9K", change: "1,042 orders", tone: "green" },
      { label: "Processing", value: "$42.1K", change: "184 orders", tone: "cyan" },
      { label: "Next batch", value: "02:14:36", change: "Automated", tone: "violet" },
      { label: "Exceptions", value: "12", change: "$8.4K held", tone: "rose" },
    ],
    columns: ["Settlement", "Recipient", "Gross", "Net payout", "Status"],
    rows: [
      {
        primary: "STL-20260810-0942",
        secondary: "Batch #842",
        values: ["0x71F2…8A40", "$4,820", "$4,699.50"],
        status: "Settled",
        tone: "green",
      },
      {
        primary: "STL-20260810-0941",
        secondary: "Batch #842",
        values: ["0x91A0…72E1", "$2,184", "$2,129.40"],
        status: "Settled",
        tone: "green",
      },
      {
        primary: "STL-20260810-0940",
        secondary: "Batch #843",
        values: ["0x4D20…8C12", "$8,410", "$8,199.75"],
        status: "Processing",
        tone: "cyan",
      },
      {
        primary: "STL-20260810-0939",
        secondary: "Manual review",
        values: ["0xC201…4F72", "$1,290", "$1,257.75"],
        status: "On hold",
        tone: "rose",
      },
    ],
  },
  networks: {
    title: "Networks & Contracts",
    description: "Observe RPC health, deployments, gas and contract versions.",
    action: "Add network",
    metrics: [
      { label: "Active networks", value: "4", change: "All operational", tone: "green" },
      { label: "Contracts", value: "12", change: "3 per network", tone: "violet" },
      { label: "Avg. RPC latency", value: "142 ms", change: "Within target", tone: "cyan" },
      { label: "Alerts", value: "2", change: "Non-critical", tone: "amber" },
    ],
    columns: ["Network", "Chain ID", "Contracts", "RPC latency", "Health"],
    rows: [
      {
        primary: "Base Sepolia",
        secondary: "Testnet · Active",
        values: ["84532", "3 deployed", "91 ms"],
        status: "Operational",
        tone: "green",
      },
      {
        primary: "Ethereum Sepolia",
        secondary: "Testnet · Active",
        values: ["11155111", "3 deployed", "184 ms"],
        status: "Operational",
        tone: "green",
      },
      {
        primary: "Polygon Amoy",
        secondary: "Testnet · Active",
        values: ["80002", "3 deployed", "122 ms"],
        status: "Operational",
        tone: "green",
      },
      {
        primary: "Ethereum",
        secondary: "Mainnet · Restricted",
        values: ["1", "3 deployed", "171 ms"],
        status: "Standby",
        tone: "amber",
      },
    ],
  },
  admins: {
    title: "Admins & Roles",
    description: "Control privileged access with scoped roles and secure review workflows.",
    action: "Invite admin",
    metrics: [
      { label: "Administrators", value: "18", change: "6 roles", tone: "violet" },
      { label: "Active now", value: "7", change: "Across 4 regions", tone: "green" },
      { label: "MFA coverage", value: "100%", change: "Required", tone: "cyan" },
      { label: "Access reviews", value: "3", change: "Due this week", tone: "amber" },
    ],
    columns: ["Administrator", "Role", "Scope", "Last active", "Access"],
    rows: [
      {
        primary: "Sarah Ahmed",
        secondary: "sarah@cryptonix.io",
        values: ["Super Admin", "Full platform", "Now"],
        status: "Active",
        tone: "green",
      },
      {
        primary: "Omar Khan",
        secondary: "omar@cryptonix.io",
        values: ["Operations", "Users, NFTs, Ops", "8 min ago"],
        status: "Active",
        tone: "green",
      },
      {
        primary: "Lina Park",
        secondary: "lina@cryptonix.io",
        values: ["Finance", "Finance modules", "2 hours ago"],
        status: "Active",
        tone: "green",
      },
      {
        primary: "James Cole",
        secondary: "james@cryptonix.io",
        values: ["Moderator", "Trust & Safety", "Aug 07, 2026"],
        status: "Review due",
        tone: "amber",
      },
    ],
  },
  audit: {
    title: "Audit Logs",
    description: "Review immutable records of every privileged platform action.",
    action: "Export audit log",
    metrics: [
      { label: "Events today", value: "8,492", change: "+4.2%", tone: "violet" },
      { label: "Admin actions", value: "624", change: "18 administrators", tone: "cyan" },
      { label: "Sensitive actions", value: "42", change: "All verified", tone: "amber" },
      { label: "Anomalies", value: "3", change: "Under review", tone: "rose" },
    ],
    columns: ["Event", "Administrator", "Target", "IP / device", "Result"],
    rows: [
      {
        primary: "Creator verification approved",
        secondary: "EVT-91A204 · 2 min ago",
        values: ["Sarah Ahmed", "Creator · Aqib Ali", "103.12.••.42 · Chrome"],
        status: "Success",
        tone: "green",
      },
      {
        primary: "NFT visibility changed",
        secondary: "EVT-91A203 · 8 min ago",
        values: ["Omar Khan", "NFT · Signal Lost #08", "185.4.••.19 · Safari"],
        status: "Success",
        tone: "green",
      },
      {
        primary: "Platform fee viewed",
        secondary: "EVT-91A202 · 14 min ago",
        values: ["Lina Park", "Finance settings", "91.18.••.82 · Chrome"],
        status: "Success",
        tone: "green",
      },
      {
        primary: "Role permission denied",
        secondary: "EVT-91A201 · 20 min ago",
        values: ["James Cole", "Network settings", "71.22.••.10 · Firefox"],
        status: "Denied",
        tone: "rose",
      },
    ],
  },
  settings: {
    title: "Platform Settings",
    description: "Configure marketplace behavior, limits and operational safeguards.",
    action: "Review changes",
    metrics: [
      { label: "Environment", value: "Testnet", change: "Base Sepolia primary", tone: "violet" },
      { label: "Platform fee", value: "2.50%", change: "Last changed Jun 12", tone: "cyan" },
      { label: "Feature flags", value: "18 / 21", change: "3 disabled", tone: "green" },
      { label: "Pending changes", value: "2", change: "Approval required", tone: "amber" },
    ],
    columns: ["Setting group", "Configuration", "Last changed", "Changed by", "State"],
    rows: [
      {
        primary: "Marketplace fees",
        secondary: "Trading and settlement",
        values: ["2.50% platform fee", "Jun 12, 2026", "Sarah Ahmed"],
        status: "Active",
        tone: "green",
      },
      {
        primary: "Minting controls",
        secondary: "Network availability",
        values: ["3 testnets enabled", "Aug 08, 2026", "Omar Khan"],
        status: "Active",
        tone: "green",
      },
      {
        primary: "Upload policy",
        secondary: "Media limits",
        values: ["50 MB · 4 formats", "Aug 01, 2026", "Sarah Ahmed"],
        status: "Active",
        tone: "green",
      },
      {
        primary: "Maintenance window",
        secondary: "Scheduled operations",
        values: ["Aug 12 · 02:00 UTC", "Aug 10, 2026", "Omar Khan"],
        status: "Scheduled",
        tone: "amber",
      },
    ],
  },
};

function Card({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[20px] border border-white/[.075] bg-[rgba(12,16,31,.7)] shadow-[0_18px_55px_rgba(0,0,0,.12)] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

function AdminFilterDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("keydown", closeEscape);
    return () => {
      document.removeEventListener("mousedown", closeOutside);
      document.removeEventListener("keydown", closeEscape);
    };
  }, [open]);

  return (
    <div className="relative w-[150px] min-w-[150px] max-[700px]:w-full" ref={ref}>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`group flex h-10 w-full cursor-pointer items-center gap-2 rounded-xl border px-3 text-left transition ${open ? "border-[rgba(155,123,255,.35)] bg-[linear-gradient(110deg,rgba(141,107,255,.12),rgba(74,221,209,.03))]" : "border-white/[.075] bg-white/[.025] hover:border-[rgba(155,123,255,.24)] hover:bg-white/[.045]"}`}
      >
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${value && value !== "30_DAYS" && value !== "NEWEST" ? "bg-[#9b7cf5] shadow-[0_0_8px_rgba(155,124,245,.65)]" : "bg-[#465166]"}`}
        />
        <span className="min-w-0 flex-1 truncate text-[10px] font-medium text-[#aeb7c8]">
          {selected.label}
        </span>
        <AdminIcon
          name="chevronDown"
          className={`h-3.5 w-3.5 shrink-0 text-[#657087] transition ${open ? "rotate-180 text-[#aa95f6]" : "group-hover:text-[#9da8ba]"}`}
        />
      </button>
      {open ? (
        <div
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-max min-w-full max-w-[230px] overflow-hidden rounded-[16px] border border-[rgba(155,123,255,.24)] bg-[rgba(8,11,23,.98)] p-2 shadow-[0_22px_60px_rgba(0,0,0,.55),inset_0_1px_rgba(255,255,255,.04)] backdrop-blur-2xl"
          role="listbox"
          aria-label={label}
        >
          <div className="max-h-[245px] space-y-1 overflow-y-auto admin-sidebar-scroll">
            {options.map((option) => {
              const active = option.value === value;
              return (
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full cursor-pointer items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left text-[10px] transition ${active ? "border-[rgba(155,123,255,.2)] bg-[rgba(155,123,255,.1)] text-[#d8ceff]" : "border-transparent text-[#aab3c4] hover:border-white/[.05] hover:bg-white/[.045] hover:text-white"}`}
                >
                  <span
                    className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${active ? "border-[#8d6bff] bg-[#8d6bff] text-white" : "border-[#3f485b]"}`}
                  >
                    {active ? (
                      <svg
                        className="h-2.5 w-2.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m5 12 4 4 10-10" />
                      </svg>
                    ) : null}
                  </span>
                  <span className="truncate">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function AdminUsersExportMenu({
  exporting,
  onExport,
}: {
  exporting: "csv" | "json" | null;
  onExport: (format: "csv" | "json") => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("keydown", closeEscape);
    return () => {
      document.removeEventListener("mousedown", closeOutside);
      document.removeEventListener("keydown", closeEscape);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={exporting !== null}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-[linear-gradient(110deg,#8d6bff,#6849e8)] px-3 text-[10px] font-semibold text-white shadow-[0_10px_28px_rgba(104,73,232,.22)] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
      >
        {exporting ? (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : (
          <AdminIcon name="external" className="h-3.5 w-3.5" />
        )}
        {exporting ? `Exporting ${exporting.toUpperCase()}…` : "Export users"}
        {!exporting ? (
          <AdminIcon
            name="chevronDown"
            className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`}
          />
        ) : null}
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-[80] w-[240px] overflow-hidden rounded-[18px] border border-[rgba(155,123,255,.22)] bg-[rgba(8,11,23,.99)] p-2 shadow-[0_24px_70px_rgba(0,0,0,.58)] backdrop-blur-2xl"
        >
          <div className="px-2.5 pb-2 pt-1">
            <span className="text-[8px] font-bold uppercase tracking-[1px] text-[#59657a]">
              Download format
            </span>
          </div>
          {(
            [
              ["csv", "Export CSV", "Excel and Google Sheets", "CSV"],
              ["json", "Export JSON", "Developers and integrations", "{ }"],
            ] as const
          ).map(([format, title, description, badge]) => (
            <button
              key={format}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onExport(format);
              }}
              className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-transparent p-2.5 text-left transition hover:border-white/[.06] hover:bg-white/[.045]"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-violet-300/[.12] bg-violet-400/[.08] font-mono text-[9px] font-bold text-[#b6a4fa]">
                {badge}
              </span>
              <span className="min-w-0">
                <strong className="block text-[10px] font-semibold text-[#cdd3de] group-hover:text-white">
                  {title}
                </strong>
                <small className="mt-1 block text-[8px] text-[#69758a]">{description}</small>
              </span>
            </button>
          ))}
          <p className="mb-1 mt-2 border-t border-white/[.055] px-2.5 pt-2.5 text-[8px] leading-4 text-[#59657a]">
            Current filters apply to the complete export.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function Header({ config, action }: { config: ModuleConfig; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="m-0 text-[24px] font-semibold tracking-[-.7px] sm:text-[28px]">
          {config.title}
        </h1>
        <p className="m-0 mt-2 max-w-[680px] text-[11px] leading-5 text-[#748096]">
          {config.description}
        </p>
      </div>
      {action ?? (
        <button className="flex h-10 items-center gap-2 rounded-xl bg-[linear-gradient(110deg,#8d6bff,#6849e8)] px-3 text-[10px] font-semibold text-white shadow-[0_10px_28px_rgba(104,73,232,.22)] transition hover:-translate-y-0.5">
          {config.action}
          <AdminIcon name="external" className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

function Metrics({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="mb-4 grid grid-cols-4 gap-3 max-[1050px]:grid-cols-2 max-[540px]:grid-cols-1">
      {metrics.map((metric, index) => (
        <Card className="relative overflow-hidden p-3" key={metric.label}>
          <span
            className={`absolute -right-5 -top-5 h-20 w-20 rounded-full blur-2xl ${toneClasses[metric.tone].bg}`}
          />
          <div className="flex items-start justify-between">
            <span className="text-[10px] text-[#707c91]">{metric.label}</span>
            <span
              className={`grid h-7 w-7 place-items-center rounded-lg ${toneClasses[metric.tone].bg} ${toneClasses[metric.tone].text}`}
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d={index % 2 ? "m4 14 5-5 4 4 7-7" : "M4 18V9M10 18V5M16 18v-7M22 18H2"} />
              </svg>
            </span>
          </div>
          <strong className="block text-[21px] tracking-[-.4px]">{metric.value}</strong>
          <span className={`block text-[9px] ${toneClasses[metric.tone].text}`}>
            {metric.change}
          </span>
        </Card>
      ))}
    </div>
  );
}

function AdminMetricsSkeleton() {
  return (
    <div
      className="mb-4 grid grid-cols-4 gap-3 max-[1050px]:grid-cols-2 max-[540px]:grid-cols-1"
      aria-label="Loading management metrics"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <Card className="h-[112px] overflow-hidden p-3" key={index}>
          <div className="animate-pulse">
            <div className="h-2.5 w-20 rounded-full bg-white/[.055]" />
            <div className="mt-5 h-7 w-14 rounded-lg bg-white/[.065]" />
            <div className="mt-3 h-2 w-24 rounded-full bg-white/[.04]" />
          </div>
        </Card>
      ))}
    </div>
  );
}

function AdminManagementTableSkeleton({ columns = 6 }: { columns?: number }) {
  return (
    <div aria-label="Loading management records">
      <Card className="overflow-hidden">
        <div className="border-b border-white/[.06] p-3">
          <div className="grid grid-cols-[minmax(220px,1fr)_150px_150px_150px] gap-2 max-[700px]:grid-cols-2 max-[480px]:grid-cols-1">
            <div className="h-10 animate-pulse rounded-xl bg-white/[.035] max-[700px]:col-span-2 max-[480px]:col-span-1" />
            <div className="h-10 animate-pulse rounded-xl bg-white/[.035]" />
            <div className="h-10 animate-pulse rounded-xl bg-white/[.035]" />
            <div className="h-10 animate-pulse rounded-xl bg-white/[.035] max-[700px]:hidden" />
          </div>
        </div>
        <div className="overflow-hidden">
          <div
            className="grid gap-4 border-b border-white/[.05] bg-white/[.012] p-3"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(80px, 1fr))` }}
          >
            {Array.from({ length: columns }, (_, index) => (
              <div key={index} className="h-2 animate-pulse rounded-full bg-white/[.035]" />
            ))}
          </div>
          {Array.from({ length: 6 }, (_, row) => (
            <div
              key={row}
              className="grid min-h-[61px] items-center gap-4 border-b border-white/[.04] p-3 last:border-0"
              style={{ gridTemplateColumns: `repeat(${columns}, minmax(80px, 1fr))` }}
            >
              {Array.from({ length: columns }, (_, column) => (
                <div
                  key={column}
                  className={`animate-pulse rounded-full bg-white/[.035] ${column === 0 ? "h-3 w-3/4" : "h-2.5 w-2/3"}`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-white/[.05] p-3">
          <div className="h-2.5 w-32 animate-pulse rounded-full bg-white/[.035]" />
          <div className="h-8 w-44 animate-pulse rounded-lg bg-white/[.035]" />
        </div>
      </Card>
    </div>
  );
}

function DataTable({ config }: { config: ModuleConfig }) {
  const [query, setQuery] = useState("");
  const rows = config.rows.filter((row) =>
    `${row.primary} ${row.secondary} ${row.values.join(" ")} ${row.status}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-white/[.06] p-3">
        <label className="relative min-w-[220px] flex-1">
          <AdminIcon
            name="search"
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5d687c]"
          />
          <input
            className="h-10 w-full rounded-xl border border-white/[.07] bg-[#080b16] pl-9 pr-3 text-[10px] outline-none placeholder:text-[#515c70] focus:border-violet-400/30"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${config.title.toLowerCase()}…`}
          />
        </label>
        <button className="flex h-10 items-center gap-2 rounded-xl border border-white/[.075] bg-white/[.025] px-3 text-[10px] text-[#9da7b9] hover:bg-white/[.05]">
          All statuses
          <AdminIcon name="chevronDown" className="h-3.5 w-3.5 text-[#657187]" />
        </button>
        <button className="flex h-10 items-center gap-2 rounded-xl border border-white/[.075] bg-white/[.025] px-3 text-[10px] text-[#9da7b9] hover:bg-white/[.05]">
          Last 30 days
          <AdminIcon name="chevronDown" className="h-3.5 w-3.5 text-[#657187]" />
        </button>
        <button
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/[.075] bg-white/[.025] text-[#8995a8]"
          aria-label="More filters"
        >
          <AdminIcon name="filter" className="h-4 w-4" />
        </button>
      </div>
      <div className="overflow-x-auto admin-sidebar-scroll">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr>
              {config.columns.map((column) => (
                <th
                  key={column}
                  className="border-b border-white/[.055] bg-white/[.012] p-3 text-[8px] font-bold uppercase tracking-[1px] text-[#505c70]"
                >
                  {column}
                </th>
              ))}
              <th className="border-b border-white/[.055] bg-white/[.012] p-3 text-right text-[8px] font-bold uppercase tracking-[1px] text-[#505c70]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.primary}
                className="group border-b border-white/[.045] last:border-0 hover:bg-white/[.018]"
              >
                <td className="p-3">
                  <strong className="block text-[10px] font-semibold text-[#dde2ec]">
                    {row.primary}
                  </strong>
                  <span className="mt-1 block text-[9px] text-[#606c81]">{row.secondary}</span>
                </td>
                {row.values.map((value, index) => (
                  <td key={`${row.primary}-${index}`} className="p-3 text-[10px] text-[#8d98aa]">
                    {value}
                  </td>
                ))}
                <td className="p-3">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] ${toneClasses[row.tone].bg} ${toneClasses[row.tone].border} ${toneClasses[row.tone].text}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="p-10 text-right">
                  <button
                    className="grid h-8 w-8 place-items-center rounded-lg border border-white/[.07] bg-white/[.025] text-[#717c90] opacity-70 hover:bg-white/[.06] hover:text-white group-hover:opacity-100"
                    aria-label={`Actions for ${row.primary}`}
                  >
                    <AdminIcon name="more" className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[.055] p-3">
        <span className="text-[9px] text-[#5d687c]">
          Showing {rows.length} of {config.metrics[0].value} records
        </span>
        <div className="flex gap-1">
          <button className="flex h-8 items-center gap-1 rounded-lg border border-white/[.07] px-3 text-[9px] text-[#677287]">
            <AdminIcon name="chevronLeft" className="h-3 w-3" />
            Previous
          </button>
          <button className="h-8 min-w-8 rounded-lg bg-violet-500 text-[9px] text-white">1</button>
          <button className="h-8 min-w-8 rounded-lg border border-white/[.07] text-[9px] text-[#8994a8]">
            2
          </button>
          <button className="h-8 min-w-8 rounded-lg border border-white/[.07] text-[9px] text-[#8994a8]">
            3
          </button>
          <button className="flex h-8 items-center gap-1 rounded-lg border border-white/[.07] px-3 text-[9px] text-[#8994a8]">
            Next
            <AdminIcon name="chevronRight" className="h-3 w-3" />
          </button>
        </div>
      </div>
    </Card>
  );
}

function AdminUserActionMenu({
  user,
  busy,
  onViewDetails,
  onViewWallets,
  onViewNfts,
  onStatus,
}: {
  user: AdminManagedUser;
  busy: boolean;
  onViewDetails: () => void;
  onViewWallets: () => void;
  onViewNfts: () => void;
  onStatus: (status: "ACTIVE" | "REVIEW" | "SUSPENDED") => void;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top?: number;
    bottom?: number;
    right: number;
    maxHeight: number;
  }>({ top: 0, right: 0, maxHeight: 0 });

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const closeOnViewportChange = () => setOpen(false);
    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("keydown", closeEscape);
    window.addEventListener("resize", closeOnViewportChange);
    window.addEventListener("scroll", closeOnViewportChange, true);
    return () => {
      document.removeEventListener("mousedown", closeOutside);
      document.removeEventListener("keydown", closeEscape);
      window.removeEventListener("resize", closeOnViewportChange);
      window.removeEventListener("scroll", closeOnViewportChange, true);
    };
  }, [open]);

  const close = () => setOpen(false);
  const toggleMenu = () => {
    if (open) {
      close();
      return;
    }

    const trigger = triggerRef.current?.getBoundingClientRect();
    if (!trigger) return;

    const estimatedMenuHeight = user.role === "Creator" ? 342 : 304;
    const spaceBelow = window.innerHeight - trigger.bottom - 8;
    const right = Math.max(8, window.innerWidth - trigger.right);

    if (spaceBelow >= estimatedMenuHeight) {
      setMenuPosition({
        top: trigger.bottom + 8,
        right,
        maxHeight: Math.max(120, spaceBelow),
      });
    } else {
      setMenuPosition({
        bottom: window.innerHeight - trigger.top + 8,
        right,
        maxHeight: Math.max(120, trigger.top - 16),
      });
    }
    setOpen(true);
  };
  const itemClass =
    "flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[10px] text-[#b7c0cf] transition hover:bg-white/[.055] hover:text-white disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="relative ml-auto w-fit" ref={triggerRef}>
      <button
        type="button"
        disabled={busy}
        onClick={toggleMenu}
        className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border border-white/[.07] bg-white/[.025] text-[#717c90] transition hover:border-violet-300/20 hover:bg-white/[.06] hover:text-white disabled:opacity-40"
        aria-label={`Actions for ${user.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {busy ? (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-violet-300" />
        ) : (
          <AdminIcon name="more" className="h-4 w-4" />
        )}
      </button>
      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              style={menuPosition}
              className="admin-sidebar-scroll fixed z-[150] w-[175px] overflow-y-auto rounded-[18px] border border-white/[.09] bg-[rgba(8,11,23,.98)] p-2 text-left shadow-[0_24px_70px_rgba(0,0,0,.58)] backdrop-blur-2xl"
            >
              <div className="grid gap-1">
                <button
                  type="button"
                  className={itemClass}
                  onClick={() => {
                    close();
                    onViewDetails();
                  }}
                  role="menuitem"
                >
                  <AdminIcon name="eye" className="h-4 w-4 text-[#9e8bed]" />
                  View Details
                </button>
                <button
                  type="button"
                  className={itemClass}
                  onClick={() => {
                    close();
                    onViewWallets();
                  }}
                  role="menuitem"
                >
                  <AdminIcon name="wallet" className="h-4 w-4 text-cyan-300" />
                  View Wallets
                </button>
                {user.role === "Creator" ? (
                  <button
                    type="button"
                    className={itemClass}
                    onClick={() => {
                      close();
                      onViewNfts();
                    }}
                    role="menuitem"
                  >
                    <AdminIcon name="nfts" className="h-4 w-4 text-[#a28df1]" />
                    View NFTs
                  </button>
                ) : null}
                <button type="button" className={itemClass} onClick={close} role="menuitem">
                  <AdminIcon name="transactions" className="h-4 w-4 text-emerald-300" />
                  View Transactions
                </button>
              </div>
              <div className="my-2 h-px bg-white/[.06]" />
              <span className="mb-1 block px-3 text-[8px] font-bold uppercase tracking-[1px] text-[#505c70]">
                Account control
              </span>
              <div className="grid gap-1">
                {user.status !== "REVIEW" ? (
                  <button
                    type="button"
                    className={itemClass}
                    onClick={() => {
                      close();
                      onStatus("REVIEW");
                    }}
                    role="menuitem"
                  >
                    <AdminIcon name="moderation" className="h-4 w-4 text-amber-300" />
                    Mark For Review
                  </button>
                ) : null}
                {user.status !== "SUSPENDED" ? (
                  <button
                    type="button"
                    className={`${itemClass} text-rose-300 hover:bg-rose-400/[.07] hover:text-rose-200`}
                    onClick={() => {
                      close();
                      onStatus("SUSPENDED");
                    }}
                    role="menuitem"
                  >
                    <AdminIcon name="userX" className="h-4 w-4" />
                    Suspend Account
                  </button>
                ) : (
                  <button
                    type="button"
                    className={`${itemClass} text-emerald-300 hover:bg-emerald-400/[.07] hover:text-emerald-200`}
                    onClick={() => {
                      close();
                      onStatus("ACTIVE");
                    }}
                    role="menuitem"
                  >
                    <AdminIcon name="userCheck" className="h-4 w-4" />
                    Reactivate account
                  </button>
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function AdminUserWalletsModal({
  open,
  loading,
  error,
  user,
  onClose,
  onRetry,
}: {
  open: boolean;
  loading: boolean;
  error: string | null;
  user: AdminUserWallets | null;
  onClose: () => void;
  onRetry: () => void;
}) {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeEscape);
    };
  }, [onClose, open]);

  if (!open || typeof document === "undefined") return null;

  const networkName = (chainId: number) =>
    chainId === 84532
      ? "Base Sepolia"
      : chainId === 11155111
        ? "Ethereum Sepolia"
        : chainId === 80002
          ? "Polygon Amoy"
          : `Chain ${chainId}`;
  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("en", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(new Date(value));
  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      window.setTimeout(() => setCopiedAddress(null), 1800);
    } catch {
      setCopiedAddress(null);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[200] grid place-items-center bg-[rgba(2,4,11,.84)] p-3 backdrop-blur-md sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label="User wallets"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="admin-sidebar-scroll flex max-h-[88vh] w-full max-w-[680px] flex-col overflow-hidden rounded-[24px] border border-white/[.09] bg-[rgba(8,11,23,.99)] shadow-[0_34px_110px_rgba(0,0,0,.72)]">
        <header className="flex shrink-0 items-center justify-between border-b border-white/[.06] p-4 sm:p-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-cyan-300/[.14] bg-cyan-400/[.08] text-cyan-300">
              <AdminIcon name="wallet" className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="m-0 truncate text-lg font-semibold text-[#edf0f7] sm:text-xl">
                Connected wallets
              </h2>
              <p className="m-0 mt-1 truncate text-xs leading-5 text-[#778298]">
                {loading
                  ? "Loading wallet connections…"
                  : `${user?.name || "User"} · ${user?.wallets.length || 0} connected`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-xl border border-white/[.08] text-[#8994a8] transition hover:bg-white/[.05] hover:text-white"
            aria-label="Close wallets"
          >
            <AdminIcon name="close" className="h-4 w-4" />
          </button>
        </header>

        <div className="admin-sidebar-scroll min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          {loading ? (
            <div className="space-y-3" aria-label="Loading wallets">
              {Array.from({ length: 2 }, (_, index) => (
                <div
                  key={index}
                  className="h-[142px] animate-pulse rounded-[18px] border border-white/[.04] bg-white/[.025]"
                />
              ))}
            </div>
          ) : error ? (
            <div className="grid min-h-[260px] place-items-center text-center">
              <div className="max-w-[360px]">
                <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl border border-rose-300/[.14] bg-rose-400/[.08] text-rose-300">
                  <AdminIcon name="wallet" className="h-5 w-5" />
                </span>
                <h3 className="mb-0 mt-4 text-base font-semibold text-[#e9edf5]">
                  Could not load wallets
                </h3>
                <p className="mb-4 mt-2 text-sm leading-6 text-[#8b96aa]">{error}</p>
                <button
                  type="button"
                  onClick={onRetry}
                  className="h-9 cursor-pointer rounded-xl bg-violet-500 px-4 text-xs font-semibold text-white transition hover:bg-violet-400"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : user?.wallets.length ? (
            <div className="space-y-3">
              {user.wallets.map((wallet) => (
                <article
                  key={wallet.id}
                  className="rounded-[18px] border border-white/[.065] bg-[linear-gradient(120deg,rgba(34,211,238,.065),rgba(124,91,241,.035))] p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-cyan-300/[.12] bg-[#0b1420] text-cyan-300">
                        <AdminIcon name="networks" className="h-[18px] w-[18px]" />
                      </span>
                      <div>
                        <h3 className="m-0 text-sm font-semibold text-[#dce5ee]">
                          {networkName(wallet.chainId)}
                        </h3>
                        <p className="m-0 mt-1 text-[10px] font-medium uppercase tracking-wider text-[#718096]">
                          Chain ID {wallet.chainId}
                        </p>
                      </div>
                    </div>
                    {wallet.isPrimary ? (
                      <span className="rounded-full border border-emerald-300/[.14] bg-emerald-400/[.08] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-emerald-300">
                        Primary
                      </span>
                    ) : (
                      <span className="rounded-full border border-white/[.07] bg-white/[.025] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-[#8b96aa]">
                        Connected
                      </span>
                    )}
                  </div>

                  <div className="mt-4 rounded-xl border border-white/[.055] bg-[#070a14]/70 p-3">
                    <span className="block text-[10px] font-medium uppercase tracking-wider text-[#69758a]">
                      Wallet address
                    </span>
                    <div className="mt-2 flex items-center gap-2">
                      <code className="min-w-0 flex-1 break-all text-[11px] leading-5 text-[#b8c3d2]">
                        {wallet.address}
                      </code>
                      <button
                        type="button"
                        onClick={() => void copyAddress(wallet.address)}
                        className="h-8 shrink-0 cursor-pointer rounded-lg border border-white/[.08] px-3 text-[10px] font-semibold text-[#9da8b9] transition hover:border-cyan-300/20 hover:bg-cyan-400/[.06] hover:text-cyan-200"
                        aria-label={`Copy wallet address ${wallet.address}`}
                      >
                        {copiedAddress === wallet.address ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3 text-[10px]">
                    <span className="uppercase tracking-wide text-[#69758a]">Connected on</span>
                    <span className="font-medium text-[#9ea9ba]">
                      {formatDate(wallet.connectedAt)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="grid min-h-[260px] place-items-center text-center">
              <div className="max-w-[320px]">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-dashed border-white/[.12] text-[#667187]">
                  <AdminIcon name="wallet" className="h-5 w-5" />
                </span>
                <h3 className="mb-0 mt-4 text-sm font-semibold text-[#dce1eb]">
                  No wallets connected
                </h3>
                <p className="mb-0 mt-2 text-xs leading-5 text-[#778298]">
                  This user has not connected a wallet to their account yet.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>,
    document.body,
  );
}

function AdminNftArtwork({
  nft,
}: {
  nft: { id: string; name: string; mediaCid: string; mediaUri: string };
}) {
  const sources = useMemo(() => {
    const directUri = nft.mediaUri.startsWith("ipfs://")
      ? `https://ipfs.io/ipfs/${nft.mediaUri.slice(7)}`
      : nft.mediaUri;
    return Array.from(
      new Set(
        [
          `${API_URL}/api/nfts/${nft.id}/media`,
          directUri,
          `https://${nft.mediaCid}.ipfs.w3s.link/`,
          `https://${nft.mediaCid}.ipfs.dweb.link/`,
          `https://ipfs.io/ipfs/${nft.mediaCid}`,
          `https://nftstorage.link/ipfs/${nft.mediaCid}`,
        ].filter(Boolean),
      ),
    );
  }, [nft.id, nft.mediaCid, nft.mediaUri]);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (loaded || failed) return;
    const timeout = window.setTimeout(
      () => {
        if (sourceIndex < sources.length - 1) setSourceIndex((index) => index + 1);
        else setFailed(true);
      },
      sourceIndex === 0 ? 30_000 : 8_000,
    );
    return () => window.clearTimeout(timeout);
  }, [failed, loaded, sourceIndex, sources.length]);

  return (
    <div className="absolute inset-0 bg-[#111629]">
      {!failed ? (
        // IPFS availability varies by gateway, so the native image can rotate
        // through the API redirect and several public gateway fallbacks.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={sources[sourceIndex]}
          alt={nft.name}
          loading="lazy"
          className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false);
            if (sourceIndex < sources.length - 1) setSourceIndex((index) => index + 1);
            else setFailed(true);
          }}
        />
      ) : (
        <div className="grid h-full place-items-center text-center text-[10px] text-[#69758a]">
          <span>
            <AdminIcon name="nfts" className="mx-auto mb-2 h-7 w-7 text-[#7767b8]" />
            Artwork unavailable
          </span>
        </div>
      )}
      {!loaded && !failed ? (
        <span className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,#11172a_18%,#1a2340_42%,#11172a_66%)] bg-[length:220%_100%]" />
      ) : null}
    </div>
  );
}

function AdminUserNftsModal({
  open,
  loading,
  error,
  data,
  onClose,
  onRetry,
  onPageChange,
}: {
  open: boolean;
  loading: boolean;
  error: string | null;
  data: AdminUserNftsPayload["data"];
  onClose: () => void;
  onRetry: () => void;
  onPageChange: (page: number) => void;
}) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const closeEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeEscape);
    };
  }, [onClose, open]);

  if (!open || typeof document === "undefined") return null;
  const networkName = (chainId: number) =>
    chainId === 84532
      ? "Base Sepolia"
      : chainId === 11155111
        ? "Ethereum Sepolia"
        : chainId === 80002
          ? "Polygon Amoy"
          : `Chain ${chainId}`;
  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("en", { month: "short", day: "2-digit", year: "numeric" }).format(
      new Date(value),
    );
  const short = (value: string) =>
    value.length > 20 ? `${value.slice(0, 8)}…${value.slice(-6)}` : value;

  return createPortal(
    <div
      className="fixed inset-0 z-[210] grid place-items-center bg-[rgba(2,4,11,.86)] p-3 backdrop-blur-md sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label="Creator NFTs"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section className="flex max-h-[92vh] w-full max-w-[1040px] flex-col overflow-hidden rounded-[24px] border border-white/[.09] bg-[rgba(8,11,23,.99)] shadow-[0_34px_110px_rgba(0,0,0,.72)]">
        <header className="flex shrink-0 items-center justify-between border-b border-white/[.06] p-4 sm:p-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-violet-300/[.14] bg-violet-400/[.08] text-[#b6a4fa]">
              <AdminIcon name="nfts" className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="m-0 truncate text-lg font-semibold text-[#edf0f7] sm:text-xl">
                {data?.creator.name || "Creator NFTs"}
              </h2>
              <p className="m-0 mt-1 text-xs text-[#778298]">
                {loading && !data
                  ? "Loading NFT inventory…"
                  : `${data?.pagination.total ?? 0} NFT${data?.pagination.total === 1 ? "" : "s"} created`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/[.08] text-[#8994a8] hover:bg-white/[.05] hover:text-white"
            aria-label="Close creator NFTs"
          >
            <AdminIcon name="close" className="h-4 w-4" />
          </button>
        </header>

        <div className="admin-sidebar-scroll min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          {loading && !data ? (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className="h-[340px] animate-pulse rounded-[18px] bg-white/[.03]"
                />
              ))}
            </div>
          ) : error ? (
            <div className="grid min-h-[330px] place-items-center text-center">
              <div>
                <h3 className="text-base font-semibold text-[#e9edf5]">Could not load NFTs</h3>
                <p className="text-sm text-[#8b96aa]">{error}</p>
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-2 h-9 rounded-xl bg-violet-500 px-4 text-xs font-semibold text-white"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : data?.nfts.length ? (
            <div
              className={`grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 ${loading ? "opacity-60" : ""}`}
            >
              {data.nfts.map((nft) => (
                <article
                  key={nft.id}
                  className="overflow-hidden rounded-[18px] border border-white/[.07] bg-white/[.022]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#111629]">
                    {nft.mediaMimeType.startsWith("image/") ? (
                      <AdminNftArtwork nft={nft} />
                    ) : (
                      <div className="grid h-full place-items-center text-[#7767b8]">
                        <AdminIcon name="nfts" className="h-8 w-8" />
                      </div>
                    )}
                    <span className="absolute right-2 top-2 rounded-full border border-white/10 bg-[#080b16]/90 px-2 py-1 text-[9px] font-semibold text-[#c4b7f8]">
                      {nft.status.replaceAll("_", " ")}
                    </span>
                    {nft.archivedAt ? (
                      <span className="absolute left-2 top-2 rounded-full bg-rose-500/90 px-2 py-1 text-[9px] font-semibold text-white">
                        Archived
                      </span>
                    ) : null}
                  </div>
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="m-0 truncate text-sm font-semibold text-[#e1e5ed]">
                          {nft.name}
                        </h3>
                        <p className="m-0 mt-1 truncate text-[10px] capitalize text-[#788398]">
                          {nft.collectionSlug.replaceAll("-", " ")} · {nft.category}
                        </p>
                      </div>
                      <span className="shrink-0 text-[10px] font-medium text-[#a995f2]">
                        {nft.tokenId ? `#${nft.tokenId}` : "Draft"}
                      </span>
                    </div>
                    <p className="mb-0 mt-3 line-clamp-2 min-h-10 text-[10px] leading-5 text-[#8994a8]">
                      {nft.description || "No description provided."}
                    </p>
                    <div className="mt-3 grid grid-cols-3 gap-1.5">
                      {[
                        ["Network", networkName(nft.chainId)],
                        ["Standard", nft.standard.replace("ERC", "ERC-")],
                        ["Supply", nft.supply.toLocaleString()],
                      ].map(([label, value]) => (
                        <div key={label} className="min-w-0 rounded-lg bg-[#080b16] p-2">
                          <span className="block text-[8px] uppercase tracking-wide text-[#59657a]">
                            {label}
                          </span>
                          <strong className="mt-1 block truncate text-[9px] font-medium text-[#abb4c4]">
                            {value}
                          </strong>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 space-y-1.5 border-t border-white/[.05] pt-3 text-[9px] text-[#758196]">
                      <div className="flex justify-between gap-3">
                        <span>Wallet</span>
                        <code className="text-[#aab3c2]">{short(nft.creatorWallet)}</code>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span>Royalty</span>
                        <span className="text-[#aab3c2]">{nft.royaltyBps / 100}%</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span>Created</span>
                        <span className="text-[#aab3c2]">{formatDate(nft.createdAt)}</span>
                      </div>
                      {nft.contractAddress ? (
                        <div className="flex justify-between gap-3">
                          <span>Contract</span>
                          <code className="text-[#aab3c2]">{short(nft.contractAddress)}</code>
                        </div>
                      ) : null}
                    </div>
                    {nft.failureReason ? (
                      <p className="mb-0 mt-3 rounded-lg border border-rose-300/10 bg-rose-400/[.06] p-2 text-[9px] leading-4 text-rose-300">
                        {nft.failureReason}
                      </p>
                    ) : null}
                    {nft.traits.length ? (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {nft.traits.slice(0, 4).map((trait) => (
                          <span
                            key={`${trait.traitType}-${trait.value}`}
                            className="rounded-md bg-violet-400/[.07] px-2 py-1 text-[8px] text-[#a899df]"
                          >
                            {trait.traitType}: {trait.value}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="grid min-h-[330px] place-items-center text-center">
              <div>
                <AdminIcon name="nfts" className="mx-auto h-8 w-8 text-[#625684]" />
                <h3 className="mt-4 text-sm font-semibold text-[#dce1eb]">No NFTs created yet</h3>
                <p className="text-xs text-[#778298]">
                  This creator does not have any NFT records.
                </p>
              </div>
            </div>
          )}
        </div>
        {data && data.pagination.pages > 1 ? (
          <footer className="flex items-center justify-between border-t border-white/[.06] p-3 sm:px-5">
            <span className="text-[10px] text-[#6e7a8f]">
              Page {data.pagination.page} of {data.pagination.pages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={loading || data.pagination.page <= 1}
                onClick={() => onPageChange(data.pagination.page - 1)}
                className="h-8 rounded-lg border border-white/[.08] px-3 text-[10px] text-[#9aa5b7] disabled:opacity-35"
              >
                Previous
              </button>
              <button
                disabled={loading || data.pagination.page >= data.pagination.pages}
                onClick={() => onPageChange(data.pagination.page + 1)}
                className="h-8 rounded-lg border border-white/[.08] px-3 text-[10px] text-[#9aa5b7] disabled:opacity-35"
              >
                Next
              </button>
            </div>
          </footer>
        ) : null}
      </section>
    </div>,
    document.body,
  );
}

function AdminUserDetailsModal({
  open,
  loading,
  error,
  user,
  onClose,
  onRetry,
}: {
  open: boolean;
  loading: boolean;
  error: string | null;
  user: AdminUserDetails | null;
  onClose: () => void;
  onRetry: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeEscape);
    };
  }, [onClose, open]);

  if (!open || typeof document === "undefined") return null;

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("en", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  const networkName = (chainId: number) =>
    chainId === 84532
      ? "Base Sepolia"
      : chainId === 11155111
        ? "Ethereum Sepolia"
        : chainId === 80002
          ? "Polygon Amoy"
          : `Chain ${chainId}`;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] grid place-items-center bg-[rgba(2,4,11,.84)] p-3 backdrop-blur-md sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label="User details"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="admin-sidebar-scroll flex max-h-[92vh] w-full max-w-[820px] flex-col overflow-hidden rounded-[24px] border border-white/[.09] bg-[rgba(8,11,23,.99)] shadow-[0_34px_110px_rgba(0,0,0,.72)]">
        <header className="flex shrink-0 items-center justify-between border-b border-white/[.06] p-3 sm:p-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-violet-300/[.14] bg-violet-400/[.08] text-[#b6a4fa]">
              <AdminIcon name="users" className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="m-0 truncate text-[17px] font-semibold text-[#edf0f7] sm:text-[19px]">
                {loading ? "Loading user…" : user?.name || "User details"}
              </h2>
              <p className="m-0 mt-1 truncate text-xs leading-5 text-[#778298]">
                Account identity, access and marketplace activity
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-xl border border-white/[.08] text-[#8994a8] transition hover:bg-white/[.05] hover:text-white"
            aria-label="Close user details"
          >
            <AdminIcon name="close" className="h-4 w-4" />
          </button>
        </header>

        <div className="admin-sidebar-scroll min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-[112px] rounded-[18px] bg-white/[.035]" />
              <div className="grid grid-cols-4 gap-2 max-[620px]:grid-cols-2">
                {Array.from({ length: 4 }, (_, index) => (
                  <div key={index} className="h-[74px] rounded-xl bg-white/[.035]" />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 max-[620px]:grid-cols-1">
                <div className="h-[210px] rounded-[18px] bg-white/[.035]" />
                <div className="h-[210px] rounded-[18px] bg-white/[.035]" />
              </div>
            </div>
          ) : error ? (
            <div className="grid min-h-[310px] place-items-center text-center">
              <div className="max-w-[360px]">
                <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl border border-rose-300/[.14] bg-rose-400/[.08] text-rose-300">
                  <AdminIcon name="userX" className="h-5 w-5" />
                </span>
                <h3 className="mb-0 mt-4 text-base font-semibold text-[#e9edf5]">
                  Could not load user details
                </h3>
                <p className="mb-4 mt-2 text-sm leading-6 text-[#8b96aa]">{error}</p>
                <button
                  type="button"
                  onClick={onRetry}
                  className="h-9 cursor-pointer rounded-xl bg-violet-500 px-4 text-xs font-semibold text-white transition hover:bg-violet-400"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : user ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3 rounded-[18px] border border-white/[.065] bg-[linear-gradient(115deg,rgba(125,91,241,.1),rgba(43,210,196,.025))] p-3 sm:p-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-violet-300/[.16] bg-[#12172a] text-[17px] font-semibold text-[#b8a7fa]">
                  {user.name.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-[180px] flex-1">
                  <h3 className="m-0 text-base font-semibold leading-6 text-[#eef1f7]">
                    {user.name}
                  </h3>
                  <p className="m-0 mt-1 text-xs leading-5 text-[#8b96aa]">
                    {user.username} · {user.email}
                  </p>
                  <span className="mt-2 inline-flex rounded-full border border-violet-300/[.14] bg-violet-400/[.08] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#b7a4ff]">
                    {user.role}
                  </span>
                </div>
                <span
                  className={`rounded-full border px-3 py-1.5 text-[10px] font-medium capitalize tracking-wide ${user.status === "ACTIVE" ? "border-emerald-300/[.14] bg-emerald-400/[.08] text-emerald-300" : user.status === "REVIEW" ? "border-amber-300/[.14] bg-amber-400/[.08] text-amber-300" : "border-rose-300/[.14] bg-rose-400/[.08] text-rose-300"}`}
                >
                  {user.status === "REVIEW" ? "Under review" : user.status.toLowerCase()}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 max-[620px]:grid-cols-2">
                {[
                  ["Total NFTs", user.nftStats.total],
                  ["Minted", user.nftStats.minted],
                  ["Awaiting mint", user.nftStats.awaitingMint],
                  ["Failed", user.nftStats.failed],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/[.055] bg-white/[.022] p-3"
                  >
                    <span className="block text-[10px] font-medium uppercase tracking-wider text-[#778298]">
                      {label}
                    </span>
                    <strong className="mt-1.5 block text-lg font-semibold leading-6 text-[#e2e7f0]">
                      {value}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 max-[680px]:grid-cols-1">
                <div className="rounded-[18px] border border-white/[.06] bg-white/[.018] p-3">
                  <h3 className="m-0 text-sm font-semibold leading-5 text-[#dce1eb]">
                    Account information
                  </h3>
                  <div className="mt-3 grid gap-2">
                    {[
                      ["User ID", user.id],
                      ["Joined", formatDate(user.joinedAt)],
                      ["Last active", formatDate(user.lastActiveAt)],
                      ["Last updated", formatDate(user.updatedAt)],
                      ["Creator status", user.creatorStatus.replaceAll("_", " ")],
                      ["Website", user.website || "Not provided"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-start justify-between gap-4 border-b border-white/[.045] py-2 last:border-0"
                      >
                        <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-[#717d92]">
                          {label}
                        </span>
                        <span className="break-all text-right text-xs leading-5 capitalize text-[#b7c0cf]">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[18px] border border-white/[.06] bg-white/[.018] p-3">
                  <h3 className="m-0 text-sm font-semibold leading-5 text-[#dce1eb]">
                    Connected wallets
                  </h3>
                  <div className="mt-3 grid gap-2">
                    {user.wallets.length ? (
                      user.wallets.map((wallet) => (
                        <div
                          key={wallet.id}
                          className="rounded-xl border border-white/[.05] bg-[#080b16] p-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-medium text-[#b7a4ff]">
                              {networkName(wallet.chainId)}
                            </span>
                            {wallet.isPrimary ? (
                              <span className="rounded-full bg-emerald-400/[.08] px-2 py-1 text-[10px] font-medium text-emerald-300">
                                Primary
                              </span>
                            ) : null}
                          </div>
                          <p className="mb-0 mt-2 break-all font-mono text-[10px] leading-5 text-[#8b96aa]">
                            {wallet.address}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="m-0 rounded-xl border border-dashed border-white/[.07] p-5 text-center text-xs text-[#778298]">
                        No wallet connected.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {user.creator ? (
                <div className="rounded-[18px] border border-white/[.06] bg-white/[.018] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="m-0 text-sm font-semibold leading-5 text-[#dce1eb]">
                      Creator application
                    </h3>
                    <span className="rounded-full border border-violet-300/[.12] bg-violet-400/[.07] px-2.5 py-1 text-[10px] font-medium capitalize tracking-wide text-[#b5a3f5]">
                      {user.creator.status}
                    </span>
                  </div>
                  <p className="mb-0 mt-3 text-xs leading-5 text-[#929db0]">{user.creator.bio}</p>
                  <div className="mt-3 grid grid-cols-3 gap-2 max-[560px]:grid-cols-1">
                    {[
                      ["Type", user.creator.creatorType],
                      ["Category", user.creator.primaryCategory],
                      ["Country", user.creator.country],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-xl border border-white/[.05] bg-[#080b16] p-3"
                      >
                        <span className="block text-[10px] font-medium uppercase tracking-wide text-[#717d92]">
                          {label}
                        </span>
                        <strong className="mt-1 block text-xs font-medium capitalize leading-5 text-[#c2c9d5]">
                          {value}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
    </div>,
    document.body,
  );
}

function AdminUsers() {
  const config = configs.users;
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<"" | "ACTIVE" | "REVIEW" | "SUSPENDED">("");
  const [dateRange, setDateRange] = useState<"ALL" | "TODAY" | "7_DAYS" | "30_DAYS">("30_DAYS");
  const [sort, setSort] = useState<"NEWEST" | "OLDEST" | "NAME_ASC">("NEWEST");
  const [page, setPage] = useState(1);
  const [payload, setPayload] = useState<AdminUsersPayload["data"]>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [exporting, setExporting] = useState<"csv" | "json" | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [detailUserId, setDetailUserId] = useState<string | null>(null);
  const [detailUser, setDetailUser] = useState<AdminUserDetails | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [walletUserId, setWalletUserId] = useState<string | null>(null);
  const [walletUser, setWalletUser] = useState<AdminUserWallets | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const detailRequestRef = useRef(0);
  const walletRequestRef = useRef(0);
  const [nftUserId, setNftUserId] = useState<string | null>(null);
  const [nftData, setNftData] = useState<AdminUserNftsPayload["data"]>(null);
  const [nftLoading, setNftLoading] = useState(false);
  const [nftError, setNftError] = useState<string | null>(null);
  const nftRequestRef = useRef(0);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    let active = true;
    const input = adminUsersFilterSchema.parse({
      page,
      limit: 12,
      search: debouncedSearch,
      status: status || undefined,
      dateRange,
      sort,
    });
    // Each server-side filter change starts a fresh table request.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);
    adminGraphql<AdminUsersPayload>(ADMIN_USERS_QUERY, { input })
      .then((response) => {
        if (!active) return;
        if (!response.success || !response.data) throw new Error(response.message);
        setPayload(response.data);
      })
      .catch((requestError) => {
        if (active)
          setError(requestError instanceof Error ? requestError.message : "Could not load users.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [dateRange, debouncedSearch, page, refreshKey, sort, status]);

  const updateUserStatus = async (
    user: AdminManagedUser,
    nextStatus: "ACTIVE" | "REVIEW" | "SUSPENDED",
  ) => {
    setActionId(user.id);
    setError(null);
    try {
      const response = await adminGraphql<AdminUserStatusPayload>(
        UPDATE_ADMIN_USER_STATUS_MUTATION,
        { userId: user.id, status: nextStatus },
      );
      if (!response.success) throw new Error(response.message);
      setPayload((current) =>
        current
          ? {
              ...current,
              users: current.users.map((item) =>
                item.id === user.id ? { ...item, status: nextStatus } : item,
              ),
            }
          : current,
      );
      setRefreshKey((value) => value + 1);
    } catch (actionError) {
      setError(
        actionError instanceof Error ? actionError.message : "Could not update user status.",
      );
    } finally {
      setActionId(null);
    }
  };

  const loadUserDetails = async (userId: string) => {
    const requestId = ++detailRequestRef.current;
    setDetailUserId(userId);
    setDetailUser(null);
    setDetailError(null);
    setDetailLoading(true);
    try {
      const response = await adminGraphql<AdminUserDetailsPayload>(ADMIN_USER_DETAILS_QUERY, {
        userId,
      });
      if (!response.success || !response.data) throw new Error(response.message);
      if (requestId !== detailRequestRef.current) return;
      setDetailUser(response.data);
    } catch (requestError) {
      if (requestId !== detailRequestRef.current) return;
      setDetailError(
        requestError instanceof Error ? requestError.message : "Could not load user details.",
      );
    } finally {
      if (requestId === detailRequestRef.current) setDetailLoading(false);
    }
  };

  const loadUserWallets = async (userId: string) => {
    const requestId = ++walletRequestRef.current;
    setWalletUserId(userId);
    setWalletUser(null);
    setWalletError(null);
    setWalletLoading(true);
    try {
      const response = await adminGraphql<AdminUserWalletsPayload>(ADMIN_USER_WALLETS_QUERY, {
        userId,
      });
      if (!response.success || !response.data) throw new Error(response.message);
      if (requestId !== walletRequestRef.current) return;
      setWalletUser(response.data);
    } catch (requestError) {
      if (requestId !== walletRequestRef.current) return;
      setWalletError(
        requestError instanceof Error ? requestError.message : "Could not load user wallets.",
      );
    } finally {
      if (requestId === walletRequestRef.current) setWalletLoading(false);
    }
  };

  const loadUserNfts = async (userId: string, requestedPage = 1) => {
    const requestId = ++nftRequestRef.current;
    setNftUserId(userId);
    if (requestedPage === 1) setNftData(null);
    setNftError(null);
    setNftLoading(true);
    try {
      const response = await adminGraphql<AdminUserNftsPayload>(ADMIN_USER_NFTS_QUERY, {
        userId,
        page: requestedPage,
        limit: 12,
      });
      if (!response.success || !response.data) throw new Error(response.message);
      if (requestId !== nftRequestRef.current) return;
      setNftData(response.data);
    } catch (requestError) {
      if (requestId !== nftRequestRef.current) return;
      setNftError(
        requestError instanceof Error ? requestError.message : "Could not load creator NFTs.",
      );
    } finally {
      if (requestId === nftRequestRef.current) setNftLoading(false);
    }
  };

  const exportUsers = async (format: "csv" | "json") => {
    setExporting(format);
    setExportError(null);
    try {
      const input = adminUsersFilterSchema.parse({
        page: 1,
        limit: 1,
        search: debouncedSearch,
        status: status || undefined,
        dateRange,
        sort,
      });
      const response = await adminGraphql<AdminUsersExportPayload>(ADMIN_USERS_EXPORT_QUERY, {
        input,
      });
      if (!response.success || !response.data) throw new Error(response.message);
      if (response.data.truncated) {
        throw new Error(
          `Export contains more than ${response.data.exported.toLocaleString()} records. Narrow the filters and try again.`,
        );
      }

      const date = new Date().toISOString().slice(0, 10);
      let content: string;
      let mimeType: string;
      if (format === "json") {
        content = JSON.stringify(
          {
            generatedAt: response.data.generatedAt,
            total: response.data.total,
            filters: { search: debouncedSearch, status: status || null, dateRange, sort },
            users: response.data.users,
          },
          null,
          2,
        );
        mimeType = "application/json;charset=utf-8";
      } else {
        const csvCell = (value: string | number | null) => {
          let normalized = value == null ? "" : String(value);
          // Prevent spreadsheet formula execution in user-controlled fields.
          if (/^[=+\-@]/.test(normalized)) normalized = `'${normalized}`;
          return `"${normalized.replaceAll('"', '""')}"`;
        };
        const headers = [
          "User ID",
          "Name",
          "Username",
          "Email",
          "Role",
          "Creator Status",
          "Account Status",
          "Primary Wallet",
          "Wallet Network",
          "Joined At",
          "Last Active At",
          "Total NFTs",
        ];
        const network = (chainId: number | null) =>
          chainId === 84532
            ? "Base Sepolia"
            : chainId === 11155111
              ? "Ethereum Sepolia"
              : chainId === 80002
                ? "Polygon Amoy"
                : chainId
                  ? `Chain ${chainId}`
                  : "";
        const rows = response.data.users.map((user) =>
          [
            user.id,
            user.name,
            user.username,
            user.email,
            user.role,
            user.creatorStatus,
            user.accountStatus,
            user.primaryWallet,
            network(user.walletChainId),
            user.joinedAt,
            user.lastActiveAt,
            user.totalNfts,
          ]
            .map(csvCell)
            .join(","),
        );
        content = `\uFEFF${headers.map(csvCell).join(",")}\r\n${rows.join("\r\n")}`;
        mimeType = "text/csv;charset=utf-8";
      }

      const url = URL.createObjectURL(new Blob([content], { type: mimeType }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `cryptonix-users-${date}.${format}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
    } catch (requestError) {
      setExportError(
        requestError instanceof Error ? requestError.message : "Could not export users.",
      );
    } finally {
      setExporting(null);
    }
  };

  const metrics: Metric[] = payload
    ? [
        {
          label: "Total users",
          value: payload.metrics.totalUsers.toLocaleString(),
          change: `${payload.metrics.totalChangePercent >= 0 ? "+" : ""}${payload.metrics.totalChangePercent}% this month`,
          tone: "violet",
        },
        {
          label: "Active today",
          value: payload.metrics.activeToday.toLocaleString(),
          change: `${payload.metrics.activeSharePercent}% of total`,
          tone: "cyan",
        },
        {
          label: "New this week",
          value: payload.metrics.newThisWeek.toLocaleString(),
          change: `${payload.metrics.newChangePercent >= 0 ? "+" : ""}${payload.metrics.newChangePercent}%`,
          tone: "green",
        },
        {
          label: "Restricted",
          value: payload.metrics.restricted.toLocaleString(),
          change: `${payload.metrics.reviewRequired} need review`,
          tone: "rose",
        },
      ]
    : [];

  return (
    <>
      <Header
        config={config}
        action={<AdminUsersExportMenu exporting={exporting} onExport={exportUsers} />}
      />
      {exportError ? (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-rose-300/[.12] bg-rose-400/[.06] px-3 py-2 text-[10px] text-rose-300">
          <span>{exportError}</span>
          <button
            type="button"
            onClick={() => setExportError(null)}
            className="text-rose-200"
            aria-label="Dismiss export error"
          >
            <AdminIcon name="close" className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}
      {loading && !payload ? (
        <AdminMetricsSkeleton />
      ) : payload ? (
        <Metrics metrics={metrics} />
      ) : null}

      {loading && !payload ? (
        <AdminManagementTableSkeleton />
      ) : (
        <Card className="overflow-visible">
          <div className="flex flex-wrap items-center gap-2 border-b border-white/[.06] p-3">
            <label className="relative min-w-[220px] flex-1 max-[700px]:w-full max-[700px]:min-w-0 max-[700px]:flex-none">
              <AdminIcon
                name="search"
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5d687c]"
              />
              <input
                className="h-10 w-full rounded-xl border border-white/[.07] bg-[#080b16] pl-9 pr-3 text-[10px] outline-none placeholder:text-[#515c70] focus:border-violet-400/30"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search user management…"
              />
            </label>
            <div className="flex shrink-0 gap-2 max-[700px]:grid max-[700px]:w-full max-[700px]:grid-cols-2 max-[480px]:grid-cols-1">
              <AdminFilterDropdown
                label="Filter users by status"
                value={status}
                options={[
                  { value: "", label: "All statuses" },
                  { value: "ACTIVE", label: "Active" },
                  { value: "REVIEW", label: "Review" },
                  { value: "SUSPENDED", label: "Suspended" },
                ]}
                onChange={(value) => {
                  setStatus(value as typeof status);
                  setPage(1);
                }}
              />
              <AdminFilterDropdown
                label="Filter users by date"
                value={dateRange}
                options={[
                  { value: "ALL", label: "All time" },
                  { value: "TODAY", label: "Today" },
                  { value: "7_DAYS", label: "Last 7 days" },
                  { value: "30_DAYS", label: "Last 30 days" },
                ]}
                onChange={(value) => {
                  setDateRange(value as typeof dateRange);
                  setPage(1);
                }}
              />
              <AdminFilterDropdown
                label="Sort users"
                value={sort}
                options={[
                  { value: "NEWEST", label: "Newest" },
                  { value: "OLDEST", label: "Oldest" },
                  { value: "NAME_ASC", label: "Name A–Z" },
                ]}
                onChange={(value) => {
                  setSort(value as typeof sort);
                  setPage(1);
                }}
              />
            </div>
          </div>

          {error ? (
            <div className="p-8 text-center text-[10px] text-rose-300">{error}</div>
          ) : loading && !payload ? (
            <div className="space-y-px p-3">
              {Array.from({ length: 6 }, (_, index) => (
                <div className="h-[58px] animate-pulse rounded-xl bg-white/[.025]" key={index} />
              ))}
            </div>
          ) : payload?.users.length ? (
            <div className="overflow-x-auto admin-sidebar-scroll">
              <table className="w-full min-w-[820px] border-collapse text-left">
                <thead>
                  <tr>
                    {["Account", "Wallet", "Role", "Joined", "Status", "Actions"].map((column) => (
                      <th
                        key={column}
                        className={`border-b border-white/[.055] bg-white/[.012] p-3 text-[8px] font-bold uppercase tracking-[1px] text-[#505c70] ${column === "Actions" ? "text-right" : ""}`}
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payload.users.map((user) => {
                    const style =
                      user.status === "ACTIVE"
                        ? toneClasses.green
                        : user.status === "REVIEW"
                          ? toneClasses.amber
                          : toneClasses.rose;
                    return (
                      <tr
                        key={user.id}
                        className="group border-b border-white/[.045] last:border-0 hover:bg-white/[.018]"
                      >
                        <td className="p-3">
                          <strong className="block text-[10px] font-semibold text-[#dde2ec]">
                            {user.name}
                          </strong>
                          <span className="mt-1 block text-[9px] text-[#606c81]">
                            {user.username}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-[9px] text-[#8d98aa]">
                          {user.wallet.length > 18
                            ? `${user.wallet.slice(0, 8)}…${user.wallet.slice(-6)}`
                            : user.wallet}
                        </td>
                        <td className="p-3 text-[10px] text-[#8d98aa]">{user.role}</td>
                        <td className="p-3 text-[10px] text-[#8d98aa]">
                          {new Intl.DateTimeFormat("en", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          }).format(new Date(user.joinedAt))}
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] ${style.bg} ${style.border} ${style.text}`}
                          >
                            {user.status === "REVIEW"
                              ? "Review"
                              : user.status === "SUSPENDED"
                                ? "Suspended"
                                : "Active"}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <AdminUserActionMenu
                            user={user}
                            busy={actionId === user.id}
                            onViewDetails={() => void loadUserDetails(user.id)}
                            onViewWallets={() => void loadUserWallets(user.id)}
                            onViewNfts={() => void loadUserNfts(user.id)}
                            onStatus={(nextStatus) => void updateUserStatus(user, nextStatus)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center">
              <strong className="text-[11px]">No users found</strong>
              <p className="m-0 mt-2 text-[9px] text-[#637086]">
                Change your filters or search query and try again.
              </p>
            </div>
          )}

          {payload ? (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[.055] p-3">
              <span className="text-[9px] text-[#5d687c]">
                Showing {payload.users.length} of {payload.pagination.total.toLocaleString()}{" "}
                records
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  className="flex h-8 items-center gap-1 rounded-lg border border-white/[.07] px-3 text-[9px] text-[#8994a8] disabled:opacity-35"
                >
                  <AdminIcon name="chevronLeft" className="h-3 w-3" />
                  Previous
                </button>
                <span className="grid h-8 min-w-8 place-items-center rounded-lg bg-violet-500 px-2 text-[9px] text-white">
                  {page}
                </span>
                <span className="px-1 text-[9px] text-[#5d687c]">
                  of {Math.max(1, payload.pagination.pages)}
                </span>
                <button
                  disabled={page >= payload.pagination.pages || loading}
                  onClick={() => setPage((value) => value + 1)}
                  className="flex h-8 items-center gap-1 rounded-lg border border-white/[.07] px-3 text-[9px] text-[#8994a8] disabled:opacity-35"
                >
                  Next
                  <AdminIcon name="chevronRight" className="h-3 w-3" />
                </button>
              </div>
            </div>
          ) : null}
        </Card>
      )}
      <AdminUserDetailsModal
        open={detailUserId !== null}
        loading={detailLoading}
        error={detailError}
        user={detailUser}
        onClose={() => {
          detailRequestRef.current += 1;
          setDetailUserId(null);
          setDetailUser(null);
          setDetailError(null);
        }}
        onRetry={() => {
          if (detailUserId) void loadUserDetails(detailUserId);
        }}
      />
      <AdminUserWalletsModal
        open={walletUserId !== null}
        loading={walletLoading}
        error={walletError}
        user={walletUser}
        onClose={() => {
          walletRequestRef.current += 1;
          setWalletUserId(null);
          setWalletUser(null);
          setWalletError(null);
        }}
        onRetry={() => {
          if (walletUserId) void loadUserWallets(walletUserId);
        }}
      />
      <AdminUserNftsModal
        open={nftUserId !== null}
        loading={nftLoading}
        error={nftError}
        data={nftData}
        onClose={() => {
          nftRequestRef.current += 1;
          setNftUserId(null);
          setNftData(null);
          setNftError(null);
        }}
        onRetry={() => {
          if (nftUserId) void loadUserNfts(nftUserId, nftData?.pagination.page ?? 1);
        }}
        onPageChange={(nextPage) => {
          if (nftUserId) void loadUserNfts(nftUserId, nextPage);
        }}
      />
    </>
  );
}

function AdminCreators() {
  const config = configs.creators;
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<"" | "approved" | "pending" | "rejected" | "suspended">("");
  const [sort, setSort] = useState<"NEWEST" | "OLDEST" | "NAME_ASC">("NEWEST");
  const [page, setPage] = useState(1);
  const [payload, setPayload] = useState<AdminCreatorsPayload["data"]>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [detailUserId, setDetailUserId] = useState<string | null>(null);
  const [detailUser, setDetailUser] = useState<AdminUserDetails | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [walletUserId, setWalletUserId] = useState<string | null>(null);
  const [walletUser, setWalletUser] = useState<AdminUserWallets | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [nftUserId, setNftUserId] = useState<string | null>(null);
  const [nftData, setNftData] = useState<AdminUserNftsPayload["data"]>(null);
  const [nftLoading, setNftLoading] = useState(false);
  const [nftError, setNftError] = useState<string | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    let active = true;
    // Each creator filter change starts a fresh server-side request.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);
    adminGraphql<AdminCreatorsPayload>(ADMIN_CREATORS_QUERY, {
      input: { page, limit: 12, search: debouncedSearch, status: status || undefined, sort },
    })
      .then((response) => {
        if (!active) return;
        if (!response.success || !response.data) throw new Error(response.message);
        setPayload(response.data);
      })
      .catch((requestError) => {
        if (active)
          setError(
            requestError instanceof Error ? requestError.message : "Could not load creators.",
          );
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [debouncedSearch, page, refreshKey, sort, status]);

  const loadDetails = async (userId: string) => {
    setDetailUserId(userId);
    setDetailUser(null);
    setDetailError(null);
    setDetailLoading(true);
    try {
      const response = await adminGraphql<AdminUserDetailsPayload>(ADMIN_USER_DETAILS_QUERY, {
        userId,
      });
      if (!response.success || !response.data) throw new Error(response.message);
      setDetailUser(response.data);
    } catch (requestError) {
      setDetailError(
        requestError instanceof Error ? requestError.message : "Could not load creator details.",
      );
    } finally {
      setDetailLoading(false);
    }
  };
  const loadNfts = async (userId: string, requestedPage = 1) => {
    setNftUserId(userId);
    if (requestedPage === 1) setNftData(null);
    setNftError(null);
    setNftLoading(true);
    try {
      const response = await adminGraphql<AdminUserNftsPayload>(ADMIN_USER_NFTS_QUERY, {
        userId,
        page: requestedPage,
        limit: 12,
      });
      if (!response.success || !response.data) throw new Error(response.message);
      setNftData(response.data);
    } catch (requestError) {
      setNftError(
        requestError instanceof Error ? requestError.message : "Could not load creator NFTs.",
      );
    } finally {
      setNftLoading(false);
    }
  };

  const loadCreatorWallets = async (userId: string) => {
    setWalletUserId(userId);
    setWalletUser(null);
    setWalletError(null);
    setWalletLoading(true);
    try {
      const response = await adminGraphql<AdminUserWalletsPayload>(ADMIN_USER_WALLETS_QUERY, {
        userId,
      });
      if (!response.success || !response.data) throw new Error(response.message);
      setWalletUser(response.data);
    } catch (requestError) {
      setWalletError(
        requestError instanceof Error ? requestError.message : "Could not load creator wallets.",
      );
    } finally {
      setWalletLoading(false);
    }
  };

  const updateCreatorAccountStatus = async (
    creator: NonNullable<AdminCreatorsPayload["data"]>["creators"][number],
    nextStatus: "ACTIVE" | "REVIEW" | "SUSPENDED",
  ) => {
    setActionId(creator.id);
    setError(null);
    try {
      const response = await adminGraphql<AdminUserStatusPayload>(
        UPDATE_ADMIN_USER_STATUS_MUTATION,
        { userId: creator.id, status: nextStatus },
      );
      if (!response.success) throw new Error(response.message);
      setPayload((current) =>
        current
          ? {
              ...current,
              creators: current.creators.map((item) =>
                item.id === creator.id ? { ...item, accountStatus: nextStatus } : item,
              ),
            }
          : current,
      );
      setRefreshKey((value) => value + 1);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not update creator account status.",
      );
    } finally {
      setActionId(null);
    }
  };

  const metrics: Metric[] = payload
    ? [
        {
          label: "Total creators",
          value: payload.metrics.totalCreators.toLocaleString(),
          change: `${payload.metrics.approved} approved`,
          tone: "violet",
        },
        {
          label: "Approved",
          value: payload.metrics.approved.toLocaleString(),
          change: "Verified creator access",
          tone: "green",
        },
        {
          label: "Active creators",
          value: payload.metrics.activeCreators.toLocaleString(),
          change: "Active in last 30 days",
          tone: "cyan",
        },
        {
          label: "Needs attention",
          value: (payload.metrics.pending + payload.metrics.restricted).toLocaleString(),
          change: `${payload.metrics.pending} pending · ${payload.metrics.restricted} restricted`,
          tone: "amber",
        },
      ]
    : [];

  return (
    <>
      <Header config={config} />
      {loading && !payload ? (
        <AdminMetricsSkeleton />
      ) : payload ? (
        <Metrics metrics={metrics} />
      ) : null}
      {loading && !payload ? (
        <AdminManagementTableSkeleton columns={7} />
      ) : (
        <Card className="overflow-visible">
          <div className="flex flex-wrap items-center gap-2 border-b border-white/[.06] p-3">
            <label className="relative min-w-[220px] flex-1 max-[700px]:w-full max-[700px]:min-w-0 max-[700px]:flex-none">
              <AdminIcon
                name="search"
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5d687c]"
              />
              <input
                className="h-10 w-full rounded-xl border border-white/[.07] bg-[#080b16] pl-9 pr-3 text-[10px] outline-none placeholder:text-[#515c70] focus:border-violet-400/30"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search creators…"
              />
            </label>
            <div className="flex shrink-0 gap-2 max-[700px]:grid max-[700px]:w-full max-[700px]:grid-cols-2 max-[480px]:grid-cols-1">
              <AdminFilterDropdown
                label="Filter creators by status"
                value={status}
                options={[
                  { value: "", label: "All statuses" },
                  { value: "approved", label: "Approved" },
                  { value: "pending", label: "Pending" },
                  { value: "rejected", label: "Rejected" },
                  { value: "suspended", label: "Suspended" },
                ]}
                onChange={(value) => {
                  setStatus(value as typeof status);
                  setPage(1);
                }}
              />
              <AdminFilterDropdown
                label="Sort creators"
                value={sort}
                options={[
                  { value: "NEWEST", label: "Newest" },
                  { value: "OLDEST", label: "Oldest" },
                  { value: "NAME_ASC", label: "Name A–Z" },
                ]}
                onChange={(value) => {
                  setSort(value as typeof sort);
                  setPage(1);
                }}
              />
            </div>
          </div>
          {error ? (
            <div className="p-8 text-center text-[10px] text-rose-300">{error}</div>
          ) : loading && !payload ? (
            <div className="space-y-px p-3">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="h-[58px] animate-pulse rounded-xl bg-white/[.025]" />
              ))}
            </div>
          ) : payload?.creators.length ? (
            <div className="overflow-x-auto admin-sidebar-scroll">
              <table className="w-full min-w-[900px] border-collapse text-left">
                <thead>
                  <tr>
                    {["Creator", "Wallet", "Category", "NFTs", "Joined", "Status", "Actions"].map(
                      (column) => (
                        <th
                          key={column}
                          className={`border-b border-white/[.055] bg-white/[.012] p-3 text-[8px] font-bold uppercase tracking-[1px] text-[#505c70] ${column === "Actions" ? "text-right" : ""}`}
                        >
                          {column}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {payload.creators.map((creator) => (
                    <tr
                      key={creator.id}
                      className="border-b border-white/[.045] last:border-0 hover:bg-white/[.018]"
                    >
                      <td className="p-3">
                        <strong className="block text-[10px] font-semibold text-[#dde2ec]">
                          {creator.name}
                        </strong>
                        <span className="mt-1 block text-[9px] text-[#606c81]">
                          {creator.username} · {creator.country}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[9px] text-[#8d98aa]">
                        {creator.wallet.length > 18
                          ? `${creator.wallet.slice(0, 8)}…${creator.wallet.slice(-6)}`
                          : creator.wallet}
                      </td>
                      <td className="p-3 text-[10px] capitalize text-[#8d98aa]">
                        {creator.category}
                      </td>
                      <td className="p-3 text-[10px] text-[#8d98aa]">{creator.nftCount}</td>
                      <td className="p-3 text-[10px] text-[#8d98aa]">
                        {new Intl.DateTimeFormat("en", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        }).format(new Date(creator.joinedAt))}
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] capitalize ${creator.creatorStatus === "approved" ? "border-emerald-300/[.13] bg-emerald-400/[.07] text-emerald-300" : creator.creatorStatus === "pending" ? "border-amber-300/[.13] bg-amber-400/[.07] text-amber-300" : "border-rose-300/[.13] bg-rose-400/[.07] text-rose-300"}`}
                        >
                          {creator.creatorStatus}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <AdminUserActionMenu
                          user={{
                            id: creator.id,
                            name: creator.name,
                            username: creator.username,
                            wallet: creator.wallet,
                            role: "Creator",
                            joinedAt: creator.joinedAt,
                            lastActiveAt: creator.lastActiveAt,
                            status: creator.accountStatus,
                          }}
                          busy={actionId === creator.id}
                          onViewDetails={() => void loadDetails(creator.id)}
                          onViewWallets={() => void loadCreatorWallets(creator.id)}
                          onViewNfts={() => void loadNfts(creator.id)}
                          onStatus={(nextStatus) =>
                            void updateCreatorAccountStatus(creator, nextStatus)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center text-[10px] text-[#637086]">No creators found.</div>
          )}
          {payload ? (
            <div className="flex items-center justify-between gap-3 border-t border-white/[.055] p-3">
              <span className="text-[9px] text-[#5d687c]">
                Showing {payload.creators.length} of {payload.pagination.total.toLocaleString()}{" "}
                creators
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((value) => value - 1)}
                  className="h-8 rounded-lg border border-white/[.07] px-3 text-[9px] text-[#8994a8] disabled:opacity-35"
                >
                  Previous
                </button>
                <span className="grid h-8 min-w-8 place-items-center rounded-lg bg-violet-500 px-2 text-[9px] text-white">
                  {page}
                </span>
                <span className="px-1 text-[9px] text-[#5d687c]">
                  of {Math.max(1, payload.pagination.pages)}
                </span>
                <button
                  disabled={page >= payload.pagination.pages || loading}
                  onClick={() => setPage((value) => value + 1)}
                  className="h-8 rounded-lg border border-white/[.07] px-3 text-[9px] text-[#8994a8] disabled:opacity-35"
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </Card>
      )}
      <AdminUserDetailsModal
        open={detailUserId !== null}
        loading={detailLoading}
        error={detailError}
        user={detailUser}
        onClose={() => {
          setDetailUserId(null);
          setDetailUser(null);
          setDetailError(null);
        }}
        onRetry={() => {
          if (detailUserId) void loadDetails(detailUserId);
        }}
      />
      <AdminUserWalletsModal
        open={walletUserId !== null}
        loading={walletLoading}
        error={walletError}
        user={walletUser}
        onClose={() => {
          setWalletUserId(null);
          setWalletUser(null);
          setWalletError(null);
        }}
        onRetry={() => {
          if (walletUserId) void loadCreatorWallets(walletUserId);
        }}
      />
      <AdminUserNftsModal
        open={nftUserId !== null}
        loading={nftLoading}
        error={nftError}
        data={nftData}
        onClose={() => {
          setNftUserId(null);
          setNftData(null);
          setNftError(null);
        }}
        onRetry={() => {
          if (nftUserId) void loadNfts(nftUserId, nftData?.pagination.page ?? 1);
        }}
        onPageChange={(nextPage) => {
          if (nftUserId) void loadNfts(nftUserId, nextPage);
        }}
      />
    </>
  );
}

function Overview() {
  const { admin } = useAdminSession();
  const metrics: Metric[] = [
    {
      label: "Marketplace Volume",
      value: "$4.82M",
      change: "+12.4% vs last month",
      tone: "violet",
    },
    { label: "Active Users", value: "24,892", change: "+8.4% vs last month", tone: "cyan" },
    { label: "NFTs Minted", value: "84,210", change: "99.72% confirmation rate", tone: "green" },
    { label: "Open Cases", value: "124", change: "12 require attention", tone: "rose" },
  ];
  const activity = [
    {
      icon: "creators",
      title: "Creator verification approved",
      text: "Aqib Ali · by Sarah Ahmed",
      time: "2m",
      tone: "green",
    },
    {
      icon: "transactions",
      title: "Settlement batch completed",
      text: "Batch #842 · $284,920",
      time: "8m",
      tone: "cyan",
    },
    {
      icon: "moderation",
      title: "Critical case escalated",
      text: "#MOD-2841 · Copyright",
      time: "18m",
      tone: "rose",
    },
    {
      icon: "ipfs",
      title: "IPFS recovery successful",
      text: "14 assets re-pinned",
      time: "32m",
      tone: "violet",
    },
  ] as const;
  return (
    <>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="m-0 text-[24px] font-semibold tracking-[-.7px] sm:text-[28px]">
            Good Morning, {admin?.name ?? "Administrator"}
          </h1>
          <p className="m-0 mt-2 text-[11px] text-[#748096]">
            Here is what is happening across Cryptonix today.
          </p>
        </div>
      </div>
      <Metrics metrics={metrics} />
      <div className="grid grid-cols-[minmax(0,1.65fr)_minmax(290px,.75fr)] gap-4 max-[1000px]:grid-cols-1">
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <strong className="text-[12px]">Marketplace Performance</strong>
              <span className="mt-1 block text-[9px] text-[#647086]">
                Sales volume across all supported networks
              </span>
            </div>
            <button className="flex items-center gap-1.5 rounded-lg border border-white/[.07] px-2.5 py-2 text-[9px] text-[#8b96aa]">
              Last 30 days
              <AdminIcon name="chevronDown" className="h-3 w-3" />
            </button>
          </div>
          <div className="mt-7 flex h-[220px] items-end gap-2 border-b border-white/[.06] px-1 sm:gap-3">
            {[
              36, 48, 41, 62, 55, 72, 66, 82, 70, 88, 79, 96, 84, 92, 74, 89, 98, 86, 100, 94, 106,
              98, 116, 110,
            ].map((height, index) => (
              <div
                key={index}
                className="group relative flex-1 rounded-t-[4px] bg-[linear-gradient(180deg,rgba(155,123,255,.8),rgba(83,232,220,.12))] transition hover:brightness-125"
                style={{ height: `${height * 1.65}px` }}
              >
                <span className="absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded-md bg-[#1a2034] px-1.5 py-1 text-[8px] group-hover:block">
                  ${height}K
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[8px] text-[#505b6f]">
            <span>Jul 12</span>
            <span>Jul 19</span>
            <span>Jul 26</span>
            <span>Aug 02</span>
            <span>Aug 10</span>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <strong className="text-[12px]">Recent Activity</strong>
              <span className="mt-1 block text-[9px] text-[#647086]">
                Live administrative events
              </span>
            </div>
            <button className="flex items-center gap-1 text-[9px] text-[#9a84ef]">
              View all
              <AdminIcon name="chevronRight" className="h-3 w-3" />
            </button>
          </div>
          <div className="mt-4 space-y-1">
            {activity.map((item) => (
              <div
                className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-white/[.025]"
                key={item.title}
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${toneClasses[item.tone].bg} ${toneClasses[item.tone].text}`}
                >
                  <AdminIcon name={item.icon as AdminIconName} className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <strong className="block truncate text-[10px] text-[#d4dae5]">
                    {item.title}
                  </strong>
                  <span className="mt-1 block truncate text-[8px] text-[#5d687c]">{item.text}</span>
                </div>
                <span className="ml-auto text-[8px] text-[#515d71]">{item.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 max-[900px]:grid-cols-1">
        <HealthCard
          title="Network Health"
          icon="networks"
          items={[
            ["Base Sepolia", "99.99%"],
            ["Ethereum Sepolia", "99.97%"],
            ["Polygon Amoy", "99.98%"],
          ]}
        />
        <HealthCard
          title="Operational Queue"
          icon="transactions"
          items={[
            ["Pending transactions", "284"],
            ["Mint retries", "64"],
            ["Settlement exceptions", "12"],
          ]}
        />
        <HealthCard
          title="Attention Required"
          icon="moderation"
          items={[
            ["Critical reports", "12"],
            ["Creator applications", "86"],
            ["Broken IPFS assets", "38"],
          ]}
        />
      </div>
    </>
  );
}

function HealthCard({
  title,
  icon,
  items,
}: {
  title: string;
  icon: AdminIconName;
  items: string[][];
}) {
  return (
    <Card className="p-3">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-400/[.08] text-[#aa96fb]">
          <AdminIcon name={icon} className="h-4 w-4" />
        </span>
        <strong className="text-[11px]">{title}</strong>
      </div>
      <div className="space-y-3">
        {items.map(([label, value], index) => (
          <div className="flex items-center justify-between" key={label}>
            <span className="flex items-center gap-2 text-[9px] text-[#748095]">
              <span
                className={`h-1.5 w-1.5 rounded-full ${index === 2 && title === "Attention required" ? "bg-rose-400" : "bg-emerald-400"}`}
              />
              {label}
            </span>
            <strong className="text-[9px] text-[#bbc3d0]">{value}</strong>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function AdminSection({ section }: { section: AdminSectionName }) {
  if (section === "overview") return <Overview />;
  if (section === "users") return <AdminUsers />;
  if (section === "creators") return <AdminCreators />;
  const config = configs[section];
  return (
    <>
      <Header config={config} />
      <Metrics metrics={config.metrics} />
      <DataTable config={config} />
    </>
  );
}
