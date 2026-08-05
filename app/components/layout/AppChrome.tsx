"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "../auth/AuthProvider";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const auth = useAuth();
  const isCreatorWorkspace = pathname === "/creator" || pathname.startsWith("/creator/");
  const hasCreatorAccess = auth.user?.role === "creator" && auth.user.creatorStatus === "approved";

  if (isCreatorWorkspace && (auth.isLoading || hasCreatorAccess)) return children;

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
