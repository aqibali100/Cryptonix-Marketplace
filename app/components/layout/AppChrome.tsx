"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "../auth/AuthProvider";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const auth = useAuth();
  const isAdminWorkspace = pathname === "/admin" || pathname.startsWith("/admin/");
  const isCreatorWorkspace = pathname === "/creator" || pathname.startsWith("/creator/");
  const hasCreatorAccess = auth.user?.role === "creator" && auth.user.creatorStatus === "approved";

  // Admin has its own isolated navigation and application shell.
  if (isAdminWorkspace) return children;
  if (isCreatorWorkspace && (auth.isLoading || hasCreatorAccess)) return children;

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
