"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { apiRequest } from "../../lib/api";
import { useAuth } from "../auth/AuthProvider";

type FavoriteResult = {
  success: true;
  data: { favorite: { nftId: string; isFavorited: boolean; likes: number } };
};

export default function FavoriteButton({
  nftId,
  isFavorited,
  likes,
  className = "",
  wrapperClassName = "",
  showCount = true,
}: {
  nftId: string;
  isFavorited: boolean;
  likes: number;
  className?: string;
  wrapperClassName?: string;
  showCount?: boolean;
}) {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const toastId = useId();
  const [message, setMessage] = useState("");
  const [toastPosition, setToastPosition] = useState({ top: 0, right: 16 });
  const [cooldown, setCooldown] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const dismissOtherToast = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== toastId) setMessage("");
    };
    window.addEventListener("cryptonix:favorite-toast", dismissOtherToast);
    return () => {
      window.removeEventListener("cryptonix:favorite-toast", dismissOtherToast);
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
      if (messageTimer.current) clearTimeout(messageTimer.current);
    };
  }, [toastId]);

  const showMessage = (text: string) => {
    window.dispatchEvent(new CustomEvent("cryptonix:favorite-toast", { detail: toastId }));
    const bounds = buttonRef.current?.getBoundingClientRect();
    if (bounds) {
      setToastPosition({
        top: Math.min(bounds.bottom + 8, window.innerHeight - 76),
        right: Math.max(16, window.innerWidth - bounds.right),
      });
    }
    setMessage(text);
    if (messageTimer.current) clearTimeout(messageTimer.current);
    messageTimer.current = setTimeout(() => setMessage(""), 3_500);
  };

  const startCooldown = () => {
    setCooldown(true);
    if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
    cooldownTimer.current = setTimeout(() => setCooldown(false), 900);
  };

  const mutation = useMutation({
    mutationFn: async (target: boolean) => {
      // This is a second defensive client-side boundary. The click handler
      // normally blocks this path before a mutation is created.
      if (!auth.user) throw new Error("Sign in to save NFTs to your wishlist.");
      return apiRequest<FavoriteResult>(`/api/nfts/${nftId}/favorite`, {
        method: target ? "POST" : "DELETE",
      });
    },
    onSuccess: async () => {
      setMessage("");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["marketplace"] }),
        queryClient.invalidateQueries({ queryKey: ["home", "trending-nfts"] }),
        queryClient.invalidateQueries({ queryKey: ["nft", nftId] }),
        queryClient.invalidateQueries({ queryKey: ["favorites"] }),
      ]);
    },
    onError: (error) => {
      showMessage(
        error instanceof Error ? error.message : "Could not update this favorite. Try again.",
      );
    },
  });

  const confirmed = mutation.data?.data.favorite;
  const baseFavorited = confirmed?.isFavorited ?? isFavorited;
  const baseLikes = confirmed?.likes ?? likes;
  const active = mutation.isPending ? !baseFavorited : baseFavorited;
  const count = mutation.isPending ? Math.max(0, baseLikes + (active ? 1 : -1)) : baseLikes;

  return (
    <span className={`inline-flex ${wrapperClassName}`}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={active ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={active}
        title={
          auth.user ? (active ? "Remove from favorites" : "Add to favorites") : "Sign in to save"
        }
        disabled={mutation.isPending || cooldown}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (auth.isLoading) {
            showMessage("Checking your session. Please wait a moment.");
            return;
          }
          if (!auth.user) {
            showMessage("Please connect your wallet and sign in to use the wishlist.");
            return;
          }
          if (mutation.isPending || cooldown) return;
          setMessage("");
          startCooldown();
          mutation.mutate(!baseFavorited);
        }}
        className={`group/favorite inline-flex cursor-pointer items-center justify-center gap-1.5 transition disabled:cursor-wait disabled:opacity-60 ${className}`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-3.5 w-3.5 transition-transform group-hover/favorite:scale-110 ${active ? "text-rose-400" : ""}`}
        >
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l8.9 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8Z" />
        </svg>
        {showCount && <span>{count}</span>}
      </button>
      {message && typeof document !== "undefined"
        ? createPortal(
            <div
              role="alert"
              aria-live="polite"
              style={{ top: toastPosition.top, right: toastPosition.right }}
              className="fixed z-[9999] w-max max-w-[min(320px,calc(100vw-32px))] rounded-xl border border-rose-400/20 bg-[#130d18]/95 px-3.5 py-2.5 text-[10px] leading-4 text-rose-200 shadow-[0_18px_55px_rgba(0,0,0,.55)] backdrop-blur-xl"
            >
              {message}
            </div>,
            document.body,
          )
        : null}
    </span>
  );
}
