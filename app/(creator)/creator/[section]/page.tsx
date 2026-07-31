import { notFound } from "next/navigation";
import CreatorSection from "../../../components/creator/CreatorSection";
import { creatorSections, type CreatorSectionName } from "../../../components/creator/creator-navigation";

export function generateStaticParams() {
  return [...creatorSections]
    .filter((section) => section !== "overview")
    .map((section) => ({ section }));
}

export default async function CreatorSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!creatorSections.has(section) || section === "overview") notFound();
  return <CreatorSection section={section as CreatorSectionName} />;
}
