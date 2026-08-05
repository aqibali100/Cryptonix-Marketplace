"use client";

import { SiweMessage } from "siwe";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useConnection, useSignMessage } from "wagmi";
import { apiRequest } from "../../lib/api";
import type { CreatorStatus } from "../../types";

export type { CreatorStatus } from "../../types";

export type Permission =
  | "marketplace:view"
  | "nft:view"
  | "nft:buy"
  | "nft:bid"
  | "profile:view"
  | "profile:edit-own"
  | "favorites:manage"
  | "dashboard:view"
  | "linked-wallets:manage"
  | "nft:create"
  | "nft:list"
  | "content:moderate"
  | "roles:manage";

export type AuthUser = {
  address: string;
  chainId: number;
  authenticatedAt: string;
  role: "user" | "creator";
  creatorStatus: CreatorStatus;
  permissions: Permission[];
  username: string | null;
  creatorName: string | null;
};
type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  isSigningIn: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const connection = useConnection();
  const { signMessageAsync } = useSignMessage();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    const { user: sessionUser } = await apiRequest<{ user: AuthUser }>("/api/auth/me");
    setUser(sessionUser);
  }, []);

  const logout = useCallback(async () => {
    await apiRequest<void>("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    setUser(null);
    setError(null);
  }, []);

  useEffect(() => {
    let active = true;
    apiRequest<{ user: AuthUser }>("/api/auth/me")
      .then(({ user: sessionUser }) => active && setUser(sessionUser))
      .catch(() => active && setUser(null))
      .finally(() => active && setIsLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async () => {
    if (!connection.address || !connection.chainId) {
      setError("Connect your MetaMask wallet first.");
      return;
    }

    setIsSigningIn(true);
    setError(null);
    try {
      const { nonce } = await apiRequest<{ nonce: string }>("/api/auth/nonce");
      const message = new SiweMessage({
        domain: window.location.host,
        address: connection.address,
        statement: "Sign in to Cryptonix Marketplace.",
        uri: window.location.origin,
        version: "1",
        chainId: connection.chainId,
        nonce,
      }).prepareMessage();
      const signature = await signMessageAsync({ message });
      const result = await apiRequest<{ user: AuthUser }>("/api/auth/verify", {
        method: "POST",
        body: JSON.stringify({ message, signature }),
      });
      setUser(result.user);
    } catch (signInError) {
      const message = signInError instanceof Error ? signInError.message : "Sign-in failed.";
      setError(
        /rejected|denied/i.test(message) ? "Signature request rejected in MetaMask." : message,
      );
      throw signInError;
    } finally {
      setIsSigningIn(false);
    }
  }, [connection.address, connection.chainId, signMessageAsync]);

  const updateUsername = useCallback(async (username: string) => {
    setError(null);
    try {
      const result = await apiRequest<{
        status: true;
        message: string;
        data: { user: AuthUser };
      }>("/api/auth/username", {
        method: "POST",
        body: JSON.stringify({ username }),
      });
      setUser(result.data.user);
    } catch (usernameError) {
      const message = usernameError instanceof Error ? usernameError.message : "Username failed.";
      setError(message);
      throw usernameError;
    }
  }, []);

  const authenticatedUser =
    user && connection.address && user.address.toLowerCase() === connection.address.toLowerCase()
      ? user
      : null;
  const authIsLoading =
    isLoading || connection.status === "connecting" || connection.status === "reconnecting";
  const value = useMemo(
    () => ({
      user: authenticatedUser,
      isLoading: authIsLoading,
      isSigningIn,
      error,
      signIn,
      updateUsername,
      refreshUser,
      logout,
    }),
    [
      authenticatedUser,
      authIsLoading,
      error,
      isSigningIn,
      logout,
      refreshUser,
      signIn,
      updateUsername,
    ],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
