import type { Metadata } from "next";
import CreatorApplication from "../../components/creator/CreatorApplication";

export const metadata: Metadata = {
  title: "Become a Creator — Cryptonix",
  description: "Apply for verified creator access on Cryptonix.",
};

export default function BecomeCreatorPage() {
  return <CreatorApplication />;
}
