import type { Metadata } from "next";
import PermissionGuard from "../../components/auth/PermissionGuard";
import FavoritesDirectory from "../../components/favorites/FavoritesDirectory";

export const metadata: Metadata = {
  title: "My Favourite — Cryptonix",
  description: "Browse and manage the NFTs saved to your Cryptonix wishlist.",
};

export default function FavoritesPage() {
  return (
    <PermissionGuard permission="favorites:manage">
      <FavoritesDirectory />
    </PermissionGuard>
  );
}
