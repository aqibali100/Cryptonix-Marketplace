import type { Metadata } from "next";
import AdminShell from "../../components/admin/AdminShell";
import AdminGuard, { AdminSessionProvider } from "../../components/admin/AdminGuard";

export const metadata: Metadata = {
  title: "Admin Portal — Cryptonix",
  description: "Cryptonix marketplace administration and operations portal.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminSessionProvider>
      <AdminShell>
        <AdminGuard>{children}</AdminGuard>
      </AdminShell>
    </AdminSessionProvider>
  );
}
