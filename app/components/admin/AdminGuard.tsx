"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { ADMIN_ME_QUERY, adminGraphql } from "../../lib/admin-auth";

type AdminIdentity = { id: string; name: string; email: string };
type AdminSessionState = {
  admin: AdminIdentity | null;
  status: "idle" | "loading" | "authenticated" | "unauthorized";
};

const AdminSessionContext = createContext<AdminSessionState>({
  admin: null,
  status: "idle",
});

export function useAdminSession() {
  return useContext(AdminSessionContext);
}

export function AdminSessionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";
  const [session, setSession] = useState<AdminSessionState>({
    admin: null,
    status: isLogin ? "idle" : "loading",
  });

  useEffect(() => {
    if (isLogin) return;
    let active = true;
    adminGraphql(ADMIN_ME_QUERY)
      .then((payload) => {
        if (!active) return;
        if (payload.success && payload.data?.admin) {
          setSession({ admin: payload.data.admin, status: "authenticated" });
        } else {
          setSession({ admin: null, status: "unauthorized" });
        }
      })
      .catch(() => {
        if (active) setSession({ admin: null, status: "unauthorized" });
      });
    return () => {
      active = false;
    };
  }, [isLogin]);

  return <AdminSessionContext.Provider value={session}>{children}</AdminSessionContext.Provider>;
}

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useAdminSession();
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (!isLogin && status === "unauthorized") router.replace("/404");
  }, [isLogin, router, status]);

  if (isLogin) return children;
  if (status !== "authenticated") return <AdminContentSkeleton />;
  return children;
}

function AdminContentSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="mb-5 space-y-2">
        <div className="h-2.5 w-32 rounded-full bg-white/[.055]" />
        <div className="h-8 w-64 max-w-full rounded-xl bg-white/[.06]" />
        <div className="h-3 w-[460px] max-w-full rounded-full bg-white/[.04]" />
      </div>
      <div className="grid grid-cols-4 gap-3 max-[1050px]:grid-cols-2 max-[540px]:grid-cols-1">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            className="h-[116px] rounded-[20px] border border-white/[.055] bg-white/[.025]"
            key={index}
          />
        ))}
      </div>
      <div className="mt-4 h-[360px] rounded-[20px] border border-white/[.055] bg-white/[.02]" />
    </div>
  );
}
