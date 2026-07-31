import type { Metadata } from "next";
import DashboardGuard from "../components/auth/DashboardGuard";
import UserDashboard from "../components/dashboard/UserDashboard";

export const metadata: Metadata = {
  title: "User Dashboard — Cryptonix",
  description: "Manage your collection, bids, favorites, profile, and linked wallets.",
};

export default function DashboardPage() {
  return (
    <DashboardGuard>
      <UserDashboard />
    </DashboardGuard>
  );
}
