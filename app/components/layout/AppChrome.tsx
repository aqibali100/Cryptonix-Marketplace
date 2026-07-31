"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCreatorWorkspace = pathname === "/creator" || pathname.startsWith("/creator/");

  if (isCreatorWorkspace) return children;

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
