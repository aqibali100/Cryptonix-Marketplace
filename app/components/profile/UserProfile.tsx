"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../lib/api";
import { useAuth } from "../auth/AuthProvider";

type Profile = {
  address: string;
  username: string;
  email: string;
  website: string;
  profileImage: string;
  updatedAt: string;
};

const emptyProfile: Profile = {
  address: "",
  username: "",
  email: "",
  website: "",
  profileImage: "",
  updatedAt: "",
};

function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-[12px] font-semibold text-[#aeb7c8]">{label}</span>
      <input
        className="h-12 w-full rounded-xl border border-[var(--line)] bg-[#0d1120] px-3.5 text-[13px] text-white outline-none transition placeholder:text-[#4f596d] focus:border-[rgba(155,123,255,.5)]"
        {...props}
      />
    </label>
  );
}

function ProfileSkeleton() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading profile"
      className="mx-auto min-h-screen w-[calc(100%_-_40px)] max-w-6xl pb-0 pt-[100px] max-[600px]:w-[calc(100%_-_28px)] max-[600px]:pt-[74px]"
    >
      <section className="h-52 animate-pulse rounded-[26px] border border-[var(--line)] bg-white/[.045] max-[600px]:h-40" />

      <section className="relative px-7 max-[600px]:px-3">
        <div className="flex items-end justify-between gap-5 max-[600px]:items-start max-[600px]:flex-col">
          <div className="flex min-w-0 items-end gap-4 max-[600px]:items-center">
            <div className="-mt-14 h-28 w-28 shrink-0 animate-pulse rounded-[30px] border-[6px] border-[#050711] bg-white/[.09] max-[600px]:h-24 max-[600px]:w-24" />
            <div className="min-w-0 animate-pulse pb-1">
              <div className="h-9 w-52 max-w-[48vw] rounded-lg bg-white/[.08] max-[600px]:h-8 max-[600px]:w-40" />
              <div className="mt-2 h-3 w-40 rounded bg-white/[.055]" />
            </div>
          </div>
          <div className="h-10 w-[112px] animate-pulse rounded-xl bg-white/[.08] max-[600px]:w-full" />
        </div>

        <section className="mt-8 grid grid-cols-2 gap-4 rounded-[22px] border border-[var(--line)] bg-white/[.018] p-6 max-[650px]:grid-cols-1 max-[600px]:p-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className="animate-pulse rounded-2xl border border-white/[.055] bg-white/[.02] p-2"
              key={index}
            >
              <div className="h-3 w-16 rounded bg-white/[.055]" />
              <div className="mt-3 h-4 w-32 max-w-[70%] rounded bg-white/[.08]" />
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}

export default function UserProfile({ routeUsername }: { routeUsername: string }) {
  const auth = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [draft, setDraft] = useState<Profile>(emptyProfile);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (auth.isLoading) return;
    if (!auth.user) return;
    let active = true;
    apiRequest<{ profile: Profile }>("/api/user/profile")
      .then(({ profile: savedProfile }) => {
        if (!active) return;
        setProfile(savedProfile);
        setDraft(savedProfile);
      })
      .catch((requestError) => {
        if (active)
          setError(requestError instanceof Error ? requestError.message : "Profile failed.");
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [auth.isLoading, auth.user]);

  const chooseImage = (file?: File) => {
    if (!file) return;
    setError(null);
    if (!/image\/(png|jpeg|webp)/.test(file.type) || file.size > 500 * 1024) {
      setError("Choose a PNG, JPG, or WEBP image smaller than 500 KB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setDraft((current) => ({ ...current, profileImage: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const { profile: updatedProfile } = await apiRequest<{ profile: Profile }>(
        "/api/user/profile",
        { method: "PATCH", body: JSON.stringify(draft) },
      );
      await auth.updateUsername(updatedProfile.username);
      setProfile(updatedProfile);
      setDraft(updatedProfile);
      setEditing(false);
      setSuccess("Profile updated successfully.");
      if (updatedProfile.username.toLowerCase() !== routeUsername.toLowerCase()) {
        router.replace(`/profile/${encodeURIComponent(updatedProfile.username)}`);
      }
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (auth.isLoading || (Boolean(auth.user) && loading)) {
    return <ProfileSkeleton />;
  }

  if (!auth.user) {
    return (
      <main className="grid min-h-screen place-items-center px-5 pt-24 text-center">
        <div>
          <span className="text-[12px] font-bold tracking-[2px] text-[var(--cyan)]">PROFILE</span>
          <h1 className="mt-3 text-3xl">Sign in to view your profile</h1>
          <p className="text-sm text-[#7c879b]">
            Use the profile icon in the navbar to authenticate.
          </p>
        </div>
      </main>
    );
  }

  const initials = (profile.username || auth.user.username || "U").slice(0, 2).toUpperCase();
  const shortAddress = `${auth.user.address.slice(0, 6)}…${auth.user.address.slice(-4)}`;

  return (
    <main className="mx-auto min-h-screen w-[calc(100%_-_40px)] max-w-6xl pb-6 pt-[100px] max-[600px]:w-[calc(100%_-_28px)] max-[600px]:pt-[74px]">
      <section className="relative h-52 overflow-hidden rounded-[26px] border border-[var(--line)] bg-[radial-gradient(circle_at_72%_30%,rgba(118,82,222,.65),transparent_22%),radial-gradient(circle_at_24%_70%,rgba(62,218,207,.3),transparent_23%),linear-gradient(145deg,#0b2034,#171231_58%,#281943)] max-[600px]:h-40">
        <div className="absolute inset-0 opacity-[.13] [background-image:linear-gradient(rgba(255,255,255,.13)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.13)_1px,transparent_1px)] [background-size:44px_44px]" />
      </section>

      <section className="relative px-7 max-[600px]:px-3">
        <div className="flex items-end justify-between gap-5 max-[600px]:items-start max-[600px]:flex-col">
          <div className="flex min-w-0 items-end gap-4 max-[600px]:items-center">
            <div
              className="-mt-14 grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-[30px] border-[6px] border-[#050711] bg-[linear-gradient(145deg,#8d6bff,#3bcfc3)] bg-cover bg-center text-2xl font-semibold shadow-[0_16px_40px_rgba(0,0,0,.4)] max-[600px]:h-24 max-[600px]:w-24"
              style={
                profile.profileImage
                  ? { backgroundImage: `url(${profile.profileImage})` }
                  : undefined
              }
            >
              {!profile.profileImage && initials}
            </div>
            <div className="min-w-0 pb-1">
              <h1 className="m-0 truncate text-[32px] font-semibold tracking-[-1.3px] max-[600px]:text-[25px]">
                @{profile.username}
              </h1>
              <p className="mb-0 mt-1 text-[12px] text-[#6f7a90]">{shortAddress} · User account</p>
            </div>
          </div>
          <button
            className="h-10 cursor-pointer rounded-xl bg-[linear-gradient(110deg,#8d6bff,#6849ea)] px-5 text-[12px] font-semibold shadow-[0_10px_25px_rgba(105,72,235,.24)] max-[600px]:w-full"
            onClick={() => {
              setDraft(profile);
              setEditing((value) => !value);
              setError(null);
              setSuccess(null);
            }}
          >
            {editing ? "Cancel editing" : "Edit profile"}
          </button>
        </div>

        {editing ? (
          <form
            className="mt-8 grid gap-5 rounded-[22px] border border-[var(--line)] bg-white/[.018] p-3 max-[600px]:p-4"
            onSubmit={(event) => void save(event)}
          >
            <div className="flex items-center gap-4 rounded-2xl border border-[var(--line)] bg-white/[.02] p-4 max-[500px]:items-start max-[500px]:flex-col">
              <div
                className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-[22px] bg-[linear-gradient(145deg,#8d6bff,#3bcfc3)] bg-cover bg-center text-lg font-semibold"
                style={
                  draft.profileImage ? { backgroundImage: `url(${draft.profileImage})` } : undefined
                }
              >
                {!draft.profileImage && initials}
              </div>
              <div>
                <strong className="text-[13px]">Profile picture</strong>
                <p className="mb-3 mt-1 text-[12px] text-[#667187]">
                  PNG, JPG or WEBP. Maximum 500 KB.
                </p>
                <label className="inline-flex h-9 cursor-pointer items-center rounded-lg border border-[var(--line)] bg-white/[.04] px-3 text-[12px] font-semibold text-[#c6cedc] hover:bg-white/[.08]">
                  Choose image
                  <input
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(event) => chooseImage(event.target.files?.[0])}
                    type="file"
                  />
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 max-[650px]:grid-cols-1">
              <Field
                label="Username"
                maxLength={20}
                minLength={3}
                onChange={(event) => setDraft({ ...draft, username: event.target.value })}
                pattern="[A-Za-z0-9_]+"
                required
                value={draft.username}
              />
              <Field
                label="Email"
                onChange={(event) => setDraft({ ...draft, email: event.target.value })}
                placeholder="you@example.com"
                type="email"
                value={draft.email}
              />
            </div>
            <Field
              label="Website URL"
              onChange={(event) => setDraft({ ...draft, website: event.target.value })}
              placeholder="https://your-site.com"
              type="url"
              value={draft.website}
            />
            {error && <p className="m-0 text-[12px] text-rose-300">{error}</p>}
            <button
              className="h-12 cursor-pointer rounded-xl bg-[linear-gradient(110deg,#8d6bff,#6849ea)] text-[13px] font-semibold disabled:cursor-not-allowed disabled:opacity-60"
              disabled={saving}
              type="submit"
            >
              {saving ? "Saving profile…" : "Save changes"}
            </button>
          </form>
        ) : (
          <section className="mt-4 grid grid-cols-2 gap-4 rounded-[22px] border border-[var(--line)] bg-white/[.018] p-3 max-[650px]:grid-cols-1 max-[600px]:p-4">
            <div className="rounded-2xl border border-white/[.055] bg-white/[.02] p-2">
              <span className="text-[12px] uppercase tracking-[1px] text-[#626d82]">Username</span>
              <strong className="mt-2 block text-sm">@{profile.username}</strong>
            </div>
            <div className="rounded-2xl border border-white/[.055] bg-white/[.02] p-2">
              <span className="text-[12px] uppercase tracking-[1px] text-[#626d82]">Email</span>
              <strong className="mt-2 block break-all text-sm">
                {profile.email || "Not added"}
              </strong>
            </div>
            <div className="rounded-2xl border border-white/[.055] bg-white/[.02] p-2">
              <span className="text-[12px] uppercase tracking-[1px] text-[#626d82]">Website</span>
              {profile.website ? (
                <a
                  className="mt-2 block truncate text-sm text-[var(--cyan)]"
                  href={profile.website}
                  rel="noreferrer"
                  target="_blank"
                >
                  {profile.website}
                </a>
              ) : (
                <strong className="mt-2 block text-sm">Not added</strong>
              )}
            </div>
            <div className="rounded-2xl border border-white/[.055] bg-white/[.02] p-2">
              <span className="text-[12px] uppercase tracking-[1px] text-[#626d82]">Role</span>
              <strong className="mt-2 block text-sm capitalize">{auth.user.role}</strong>
            </div>
          </section>
        )}
        {success && <p className="mt-4 text-center text-[12px] text-emerald-300">{success}</p>}
      </section>
    </main>
  );
}
