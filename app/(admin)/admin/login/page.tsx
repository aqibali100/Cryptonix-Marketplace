import type { Metadata } from "next";
import AdminLogin from "../../../components/admin/AdminLogin";

export const metadata: Metadata = {
  title: "Admin Sign In — Cryptonix",
  description: "Secure administrator access to the Cryptonix operations portal.",
};

export default function AdminLoginPage() {
  return <AdminLogin />;
}
