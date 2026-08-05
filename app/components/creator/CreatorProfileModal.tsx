"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../../lib/api";
import type { CreatorApplicationData } from "../../types";
import { useAuth } from "../auth/AuthProvider";

type CreatorProfileForm = Pick<
  CreatorApplicationData,
  | "displayName"
  | "creatorType"
  | "email"
  | "country"
  | "bio"
  | "website"
  | "primaryCategory"
  | "experience"
>;

const emptyProfile: CreatorProfileForm = {
  displayName: "",
  creatorType: "individual",
  email: "",
  country: "",
  bio: "",
  website: "",
  primaryCategory: "art",
  experience: "new",
};

const fieldClass =
  "mt-2 h-11 w-full rounded-xl border border-[var(--line)] bg-[#0b0f1d] px-3 text-[12px] text-white outline-none transition placeholder:text-[#4f5a70] focus:border-[rgba(155,123,255,.55)]";

function validateCreatorProfile(form: CreatorProfileForm) {
  const displayName = form.displayName.trim();
  if (displayName.length < 4) return "Creator name must be at least 4 characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    return "Enter a valid email address.";
  }
  if (form.country.trim().length < 2) return "Enter a valid country.";
  if (form.bio.trim().length < 20) return "Bio must be at least 20 characters.";

  try {
    const website = new URL(form.website.trim());
    if (!["http:", "https:"].includes(website.protocol)) return "Enter a valid website URL.";
  } catch {
    return "Enter a valid website URL.";
  }

  return null;
}

function CreatorProfileSkeleton() {
  return (
    <div
      aria-label="Loading creator profile"
      className="max-h-[calc(100vh-130px)] overflow-hidden p-5 sm:p-6"
      role="status"
    >
      <div className="animate-pulse">
        <div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index}>
              <div className="h-3 w-24 rounded-full bg-white/[.08]" />
              <div className="mt-2 h-11 rounded-xl border border-white/[.045] bg-white/[.04]" />
            </div>
          ))}
        </div>

        <div className="mt-4">
          <div className="h-3 w-20 rounded-full bg-white/[.08]" />
          <div className="mt-2 h-11 rounded-xl border border-white/[.045] bg-white/[.04]" />
        </div>
        <div className="mt-4">
          <div className="h-3 w-12 rounded-full bg-white/[.08]" />
          <div className="mt-2 h-28 rounded-xl border border-white/[.045] bg-white/[.04]" />
          <div className="ml-auto mt-2 h-2.5 w-12 rounded-full bg-white/[.055]" />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <div className="h-11 w-24 rounded-xl bg-white/[.05]" />
          <div className="h-11 w-32 rounded-xl bg-[rgba(141,107,255,.18)]" />
        </div>
      </div>
      <span className="sr-only">Loading creator profile…</span>
    </div>
  );
}

export default function CreatorProfileModal({ onClose }: { onClose: () => void }) {
  const auth = useAuth();
  const [form, setForm] = useState<CreatorProfileForm>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    apiRequest<{
      status: true;
      message: string;
      data: { profile: CreatorApplicationData };
    }>("/api/auth/creator/profile")
      .then((result) => {
        if (!active) return;
        setForm(result.data.profile);
      })
      .catch((requestError) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Could not load creator profile.",
          );
        }
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !saving) onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose, saving]);

  useEffect(() => {
    if (!error) return;
    const timer = window.setTimeout(() => setError(null), 3000);
    return () => window.clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(() => setSuccess(null), 3000);
    return () => window.clearTimeout(timer);
  }, [success]);

  const update = (field: keyof CreatorProfileForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError(null);
    setValidationError(null);
    setSuccess(null);
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const profileValidationError = validateCreatorProfile(form);
    if (profileValidationError) {
      setValidationError(profileValidationError);
      setError(null);
      setSuccess(null);
      return;
    }

    setSaving(true);
    setError(null);
    setValidationError(null);
    setSuccess(null);
    try {
      const result = await apiRequest<{
        status: true;
        message: string;
        data: { profile: CreatorApplicationData };
      }>("/api/auth/creator/profile", {
        method: "PATCH",
        body: JSON.stringify(form),
      });
      setForm(result.data.profile);
      setSuccess(result.message);
      await auth.refreshUser();
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Could not update creator profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      aria-labelledby="creator-profile-title"
      aria-modal="true"
      className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
      role="dialog"
    >
      <section className="my-auto w-full max-w-[720px] overflow-hidden rounded-[24px] border border-[var(--line)] bg-[rgba(9,12,25,.98)] shadow-[0_30px_100px_rgba(0,0,0,.65)]">
        <header className="flex items-start justify-between gap-4 border-b border-[var(--line)] p-3">
          <div>
            <span className="text-[10px] font-bold tracking-[1.6px] text-[var(--cyan)]">
              CREATOR PROFILE
            </span>
            <h2 className="mb-0 mt-1 text-xl font-semibold" id="creator-profile-title">
              Edit Your Creator Information
            </h2>
          </div>
          <button
            aria-label="Close creator profile"
            className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-xl border border-[var(--line)] bg-white/[.035] text-lg text-[#8d98ab] transition hover:bg-white/[.08] hover:text-white"
            disabled={saving}
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </header>

        {loading ? (
          <CreatorProfileSkeleton />
        ) : (
          <form
            className="creator-sidebar-scroll max-h-[calc(100vh-130px)] overflow-y-auto p-3 pt-4"
            onSubmit={save}
          >
            <div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
              <label className="text-[11px] font-semibold text-[#b9c2d2]">
                Creator name
                <input
                  className={fieldClass}
                  maxLength={60}
                  minLength={4}
                  onChange={(event) => update("displayName", event.target.value)}
                  required
                  value={form.displayName}
                />
              </label>
              <label className="text-[11px] font-semibold text-[#b9c2d2]">
                Email
                <input
                  className={fieldClass}
                  maxLength={120}
                  onChange={(event) => update("email", event.target.value)}
                  required
                  type="email"
                  value={form.email}
                />
              </label>
              <label className="text-[11px] font-semibold text-[#b9c2d2]">
                Creator type
                <select
                  className={fieldClass}
                  onChange={(event) => update("creatorType", event.target.value)}
                  value={form.creatorType}
                >
                  <option value="individual">Independent creator</option>
                  <option value="digital_artist">Digital artist</option>
                  <option value="illustrator">Illustrator / graphic designer</option>
                  <option value="three_d_artist">3D artist</option>
                  <option value="animator">Animator / motion designer</option>
                  <option value="photographer">Photographer</option>
                  <option value="filmmaker">Filmmaker / video creator</option>
                  <option value="musician">Musician / audio artist</option>
                  <option value="studio">Creative studio / team</option>
                  <option value="brand">Brand / company</option>
                </select>
              </label>
              <label className="text-[11px] font-semibold text-[#b9c2d2]">
                Country
                <input
                  className={fieldClass}
                  maxLength={80}
                  onChange={(event) => update("country", event.target.value)}
                  required
                  value={form.country}
                />
              </label>
              <label className="text-[11px] font-semibold text-[#b9c2d2]">
                Primary category
                <select
                  className={fieldClass}
                  onChange={(event) => update("primaryCategory", event.target.value)}
                  value={form.primaryCategory}
                >
                  <option value="art">Art</option>
                  <option value="collectibles">Collectibles</option>
                  <option value="photography">Photography</option>
                  <option value="music">Music</option>
                  <option value="gaming">Gaming</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label className="text-[11px] font-semibold text-[#b9c2d2]">
                Experience
                <select
                  className={fieldClass}
                  onChange={(event) => update("experience", event.target.value)}
                  value={form.experience}
                >
                  <option value="new">New creator</option>
                  <option value="under_1_year">Under 1 year</option>
                  <option value="1_3_years">1–3 years</option>
                  <option value="3_plus_years">3+ years</option>
                </select>
              </label>
            </div>

            <label className="mt-4 block text-[11px] font-semibold text-[#b9c2d2]">
              Website URL
              <input
                className={fieldClass}
                onChange={(event) => update("website", event.target.value)}
                placeholder="https://your-site.com"
                required
                type="url"
                value={form.website}
              />
            </label>
            <label className="mt-4 block text-[11px] font-semibold text-[#b9c2d2]">
              Bio
              <textarea
                className={`${fieldClass} min-h-28 resize-y py-3 leading-5`}
                maxLength={600}
                minLength={20}
                onChange={(event) => update("bio", event.target.value)}
                required
                value={form.bio}
              />
              <span className="mt-1 block text-right text-[10px] font-normal text-[#626d82]">
                {form.bio.length}/600
              </span>
            </label>

            {(validationError || error) && (
              <p
                className="mb-0 mt-4 rounded-xl border border-rose-400/20 bg-rose-400/[.07] px-3 py-2 text-[11px] text-rose-300"
                role="alert"
              >
                {validationError || error}
              </p>
            )}
            {success && (
              <p
                className="mb-0 mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/[.07] px-3 py-2 text-[11px] text-emerald-300"
                role="status"
              >
                {success}
              </p>
            )}

            <div className="mt-2 flex justify-end gap-2 max-[480px]:grid max-[480px]:grid-cols-2">
              <button
                className="h-11 cursor-pointer rounded-xl border border-[var(--line)] bg-white/[.035] px-5 text-[11px] font-semibold text-[#aeb7c8] transition hover:bg-white/[.07]"
                disabled={saving}
                onClick={onClose}
                type="button"
              >
                Cancel
              </button>
              <button
                className="h-11 cursor-pointer rounded-xl bg-[linear-gradient(110deg,#8d6bff,#6849ea)] px-5 text-[11px] font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={saving}
                type="submit"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
