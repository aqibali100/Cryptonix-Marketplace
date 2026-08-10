import { notFound } from "next/navigation";
import AdminSection from "../../../components/admin/AdminSection";
import { adminSections, type AdminSectionName } from "../../../components/admin/admin-navigation";

export function generateStaticParams() {
  return [...adminSections]
    .filter((section) => section !== "overview")
    .map((section) => ({ section }));
}

export default async function AdminModulePage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!adminSections.has(section) || section === "overview") notFound();
  return <AdminSection section={section as AdminSectionName} />;
}
