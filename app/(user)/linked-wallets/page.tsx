import type { Metadata } from "next";
import PermissionGuard from "../../components/auth/PermissionGuard";
import LinkedWallets from "../../components/wallet/LinkedWallets";

export const metadata: Metadata = {
  title: "Linked Wallets — Cryptonix",
  description: "View and manage wallets linked to your Cryptonix account.",
};

export default function LinkedWalletsPage() {
  return (
    <PermissionGuard permission="linked-wallets:manage">
      <LinkedWallets />
    </PermissionGuard>
  );
}
