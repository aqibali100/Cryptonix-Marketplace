import type { Metadata } from "next";
import UserProfile from "../../../components/profile/UserProfile";

export const metadata: Metadata = {
  title: "My Profile — Cryptonix",
  description: "View and edit your Cryptonix profile.",
};

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return <UserProfile routeUsername={username} />;
}
