"use client";

import Link from "next/link";
import type { Permission } from "./AuthProvider";
import { useAuth } from "./AuthProvider";

export default function PermissionGuard({
  permission,
  children,
}: {
  permission: Permission;
  children: React.ReactNode;
}) {
  const auth = useAuth();

  if (auth.isLoading)
    return (
      <main className="grid min-h-screen place-items-center pt-24 text-sm text-[#8e98ad]">
        Checking access…
      </main>
    );

  if (!auth.user || !auth.user.permissions.includes(permission)) {
    return (
      <main className="grid min-h-screen place-items-center px-5 pt-24">
        <section className="glass w-[min(430px,100%)] rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-7 text-center shadow-[0_24px_80px_rgba(0,0,0,.28)]">
          <span className="text-[12px] font-bold tracking-[2px] text-amber-300">
            ACCESS RESTRICTED
          </span>
          <h1 className="my-3 text-3xl font-semibold tracking-[-1.5px]">
            This feature is not available
          </h1>
          <p className="mb-5 text-xs leading-6 text-[#808ba1]">
            Your current user role does not include creator access. Creator roles can be added later
            without changing the authentication flow.
          </p>
          <Link className="user-primary-action" href="/marketplace">
            Explore marketplace
          </Link>
        </section>
      </main>
    );
  }

  return children;
}
