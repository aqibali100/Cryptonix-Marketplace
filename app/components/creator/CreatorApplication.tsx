"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type FieldPath, type FieldPathValue } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from "../../lib/api";
import type { CreatorApplicationData, CreatorStatus } from "../../types";
import { useAuth } from "../auth/AuthProvider";
import CreatorApplicationProgress from "./CreatorApplicationProgress";

type Application = CreatorApplicationData;

const initialForm = {
  displayName: "",
  creatorType: "individual",
  email: "",
  country: "",
  bio: "",
  website: "",
  primaryCategory: "art",
  experience: "new",
  ownershipConfirmed: false,
  termsAccepted: false,
};

const creatorApplicationSchema = z.object({
  displayName: z.string().trim().min(4, "Enter at least 4 characters.").max(60),
  creatorType: z.string().min(1, "Select a creator type."),
  email: z.string().trim().min(1, "Email address is required.").email("Enter a valid email address."),
  country: z.string().trim().min(2, "Enter your country.").max(80),
  bio: z.string().trim().min(20, "Bio must be at least 20 characters.").max(600),
  website: z
    .string()
    .trim()
    .min(1, "Website URL is required.")
    .url("Enter a valid website URL.")
    .refine((value) => /^https?:\/\//i.test(value), "URL must start with http:// or https://."),
  primaryCategory: z.string().min(1, "Select a primary category."),
  experience: z.string().min(1, "Select your experience."),
  ownershipConfirmed: z.boolean().refine(Boolean, "You must confirm content ownership."),
  termsAccepted: z.boolean().refine(Boolean, "You must accept the creator terms."),
});

type CreatorApplicationForm = z.infer<typeof creatorApplicationSchema>;

const stepFields: Record<1 | 2, Array<keyof CreatorApplicationForm>> = {
  1: ["displayName", "creatorType", "email", "country"],
  2: ["bio", "website", "primaryCategory", "experience"],
};

const creatorTypeGroups: ReadonlyArray<{
  label: string;
  options: ReadonlyArray<readonly [string, string]>;
}> = [
  {
    label: "Independent creators",
    options: [
      ["individual", "Independent creator"],
      ["digital_artist", "Digital artist"],
      ["illustrator", "Illustrator / graphic designer"],
      ["three_d_artist", "3D artist"],
      ["animator", "Animator / motion designer"],
      ["photographer", "Photographer"],
      ["filmmaker", "Filmmaker / video creator"],
      ["musician", "Musician / audio artist"],
    ],
  },
  {
    label: "Teams & organizations",
    options: [
      ["studio", "Creative studio / team"],
      ["brand", "Brand / company"],
    ],
  },
];

const creatorTypeLabels = Object.fromEntries(
  creatorTypeGroups.flatMap((group) => group.options),
) as Record<string, string>;

type FieldIconName =
  | "name"
  | "type"
  | "email"
  | "country"
  | "website"
  | "category"
  | "experience";

const fieldIcons: Record<FieldIconName, React.ReactNode> = {
  name: (
    <>
      <circle cx="12" cy="8" r="3" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </>
  ),
  type: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M9 5V3h6v2M8 10h8M8 14h5" />
    </>
  ),
  email: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  country: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
    </>
  ),
  website: (
    <>
      <path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1" />
    </>
  ),
  category: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  experience: (
    <>
      <path d="M4 19V9M10 19V5M16 19v-7M22 19V3" />
      <path d="m3 7 6-4 6 5 7-5" />
    </>
  ),
};

function FieldIcon({ name }: { name: FieldIconName }) {
  return (
    <svg
      aria-hidden="true"
      className="h-[17px] w-[17px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {fieldIcons[name]}
    </svg>
  );
}

function Field({
  label,
  icon,
  children,
  optional = false,
  hint,
  error,
}: {
  label: string;
  icon?: FieldIconName;
  children: React.ReactNode;
  optional?: boolean;
  hint?: string;
  error?: string;
}) {
  return (
    <label className="grid gap-2.5">
      <span className="flex items-center gap-2 text-[12px] font-semibold text-white">
        {label}
        <small
          className={`ml-auto text-[9px] font-medium ${optional ? "text-[#566176]" : "text-[#8d76dc]"}`}
        >
          {optional ? "Optional" : "Required"}
        </small>
      </span>
      <span className={`relative block [&>svg]:pointer-events-none [&>svg]:absolute [&>svg]:left-3.5 [&>svg]:top-6 [&>svg]:z-10 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:-translate-y-1/2 [&>svg]:text-[#5d6a82] [&_input]:h-12 [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-[var(--line)] [&_input]:bg-[#0b0f1e] [&_input]:pl-10 [&_input]:pr-3.5 [&_input]:text-[13px] [&_input]:font-normal [&_input]:text-white [&_input]:outline-none [&_input]:transition [&_input]:placeholder:text-[#465267] [&_input]:focus:border-[rgba(155,123,255,.5)] [&_input]:focus:shadow-[0_0_0_3px_rgba(126,95,255,.07)] [&_select]:h-12 [&_select]:w-full [&_select]:appearance-none [&_select]:rounded-xl [&_select]:border [&_select]:border-[var(--line)] [&_select]:bg-[#0b0f1e] [&_select]:pl-10 [&_select]:pr-9 [&_select]:text-[13px] [&_select]:font-normal [&_select]:text-white [&_select]:outline-none [&_select]:transition [&_select]:focus:border-[rgba(155,123,255,.5)] [&_textarea]:min-h-32 [&_textarea]:w-full [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-[var(--line)] [&_textarea]:bg-[#0b0f1e] [&_textarea]:py-3.5 [&_textarea]:pr-3.5 [&_textarea]:text-[13px] [&_textarea]:font-normal [&_textarea]:leading-6 [&_textarea]:text-white [&_textarea]:outline-none [&_textarea]:transition [&_textarea]:placeholder:text-[#465267] [&_textarea]:focus:border-[rgba(155,123,255,.5)] ${icon ? "[&_textarea]:pl-10" : "[&_textarea]:pl-3.5"} ${error ? "[&_input]:!border-rose-400/60 [&_select]:!border-rose-400/60 [&_textarea]:!border-rose-400/60" : ""}`}>
        {children}
        {icon && <FieldIcon name={icon} />}
      </span>
      {error ? (
        <small className="text-[10px] font-medium leading-4 text-rose-300" role="alert">
          {error}
        </small>
      ) : (
        hint && <small className="text-[10px] font-normal leading-4 text-[#5f6b80]">{hint}</small>
      )}
    </label>
  );
}

export default function CreatorApplication() {
  const auth = useAuth();
  const [step, setStep] = useState(1);
  const {
    control,
    setValue,
    reset,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<CreatorApplicationForm>({
    resolver: zodResolver(creatorApplicationSchema),
    defaultValues: initialForm,
    mode: "onChange",
  });
  const watchedForm = useWatch({ control });
  const form: CreatorApplicationForm = { ...initialForm, ...watchedForm };
  const [application, setApplication] = useState<Application | null>(null);
  const [status, setStatus] = useState<CreatorStatus>("not_applied");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (auth.isLoading) return;
    if (!auth.user) return;
    let active = true;
    apiRequest<{ creatorStatus: CreatorStatus; application: Application | null }>(
      "/api/creator/application",
    )
      .then((result) => {
        if (!active) return;
        setStatus(result.creatorStatus);
        setApplication(result.application);
        if (result.application && result.creatorStatus === "rejected") {
          reset({
            ...initialForm,
            ...result.application,
            ownershipConfirmed: false,
            termsAccepted: false,
          });
        }
      })
      .catch(
        (requestError) =>
          active &&
          setError(
            requestError instanceof Error ? requestError.message : "Could not load application.",
          ),
      )
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [auth.isLoading, auth.user, reset]);

  const update = <Name extends FieldPath<CreatorApplicationForm>>(
    name: Name,
    value: FieldPathValue<CreatorApplicationForm, Name>,
  ) => setValue(name, value, { shouldDirty: true, shouldValidate: true });

  const continueToNextStep = async () => {
    if (step !== 1 && step !== 2) return;
    const valid = await trigger(stepFields[step]);
    if (valid) setStep(step + 1);
  };

  const submit = async () => {
    if (!(await trigger())) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await apiRequest<{ creatorStatus: CreatorStatus; application: Application }>(
        "/api/creator/application",
        { method: "POST", body: JSON.stringify(getValues()) },
      );
      setStatus(result.creatorStatus);
      setApplication(result.application);
      await auth.refreshUser();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Could not submit application.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (auth.isLoading || (Boolean(auth.user) && loading))
    return (
      <main className="grid min-h-screen place-items-center pt-24 text-[12px] text-[#7d889c]">
        Loading creator application…
      </main>
    );

  if (!auth.user) notFound();

  if (status === "pending" || status === "approved" || status === "suspended") {
    const approved = status === "approved";
    return (
      <main className="mx-auto w-[min(860px,calc(100%_-_32px))] pb-10 pt-[130px]">
        <section className="relative overflow-hidden rounded-[28px] border border-[var(--line)] bg-[radial-gradient(circle_at_50%_0%,rgba(126,95,255,.17),transparent_30rem),rgba(255,255,255,.018)] p-3 text-center">
          <span
            className={`mx-auto grid h-16 w-16 place-items-center rounded-[22px] text-2xl ${approved ? "bg-emerald-400/[.1] text-emerald-300" : "bg-[rgba(155,123,255,.1)] text-[#b19bf8]"}`}
          >
            {approved ? "✓" : status === "suspended" ? "!" : "◷"}
          </span>
          <span className="mt-6 block text-[10px] font-bold tracking-[1.8px] text-[var(--cyan)]">
            CREATOR APPLICATION
          </span>
          <h1 className="mb-0 mt-3 text-[clamp(32px,5vw,48px)] font-semibold tracking-[-2px]">
            {approved
              ? "You are now a creator"
              : status === "suspended"
                ? "Creator access suspended"
                : "Your application is under review"}
          </h1>
          <p className="mx-auto mb-0 mt-4 max-w-lg text-[11px] leading-5 text-[#748096]">
            {approved
              ? "Creator Studio is unlocked. You can now create collections, mint NFTs, and manage sales."
              : status === "suspended"
                ? "Creator tools are temporarily unavailable. Contact support for more information."
                : "Our team is reviewing your identity, portfolio, and ownership declaration. Reviews usually take 1–3 business days."}
          </p>
          {application && (
            <div className="mx-auto mt-7 grid max-w-xl grid-cols-3 gap-2 text-left max-[560px]:grid-cols-1">
              {[
                ["Creator", application.displayName],
                ["Submitted", new Date(application.submittedAt).toLocaleDateString()],
                ["Status", status],
              ].map(([label, value]) => (
                <span
                  className="rounded-xl border border-white/[.055] bg-white/[.025] p-3"
                  key={label}
                >
                  <small className="block text-[8px] uppercase tracking-[1px] text-[#5e6a80]">
                    {label}
                  </small>
                  <strong className="mt-1.5 block truncate text-[10px] capitalize">{value}</strong>
                </span>
              ))}
            </div>
          )}
            {approved && (
          <div className="mt-7 flex flex-wrap justify-center gap-2">
              <Link
                className="inline-flex h-11 cursor-pointer items-center rounded-xl bg-[linear-gradient(110deg,#8d6bff,#6849ea)] px-5 text-[13px] font-semibold"
                href="/creator"
              >
                Open Creator Studio
              </Link>
          </div>
            )}
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-[min(920px,calc(100%_-_32px))] pb-5 pt-[125px]">
      <header className="mb-7 text-center">
        <span className="text-[10px] font-bold tracking-[1.8px] text-[var(--cyan)]">
          BECOME A CREATOR
        </span>
        <h1 className="mb-0 mt-3 text-[clamp(36px,6vw,58px)] font-semibold tracking-[-3px]">
          Build Your Creator Profile
        </h1>
        <p className="mx-auto mb-0 mt-3 max-w-xl text-[11px] leading-5 text-[#748096]">
          Tell us about your work and submit a portfolio for review.
        </p>
      </header>
      <CreatorApplicationProgress currentStep={step} onStepChange={setStep} />
      <section className="rounded-[24px] border border-[var(--line)] bg-[rgba(255,255,255,.022)] p-4">
        {status === "rejected" && application?.reviewNote && (
          <div className="mb-5 rounded-xl border border-rose-400/[.14] bg-rose-400/[.04] p-4 text-[10px] leading-5 text-rose-200">
            <strong className="block">Application needs changes</strong>
            {application.reviewNote}
          </div>
        )}
        {step === 1 && (
          <div className="grid gap-5">
            <div>
              <h2 className="m-0 text-[10px] font-bold uppercase tracking-[1.8px] text-[var(--cyan)]">
                Creator identity
              </h2>
              <p className="mb-0 mt-2 text-[10px] text-[#68748a]">
                This information appears on your public creator profile.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 max-[620px]:grid-cols-1">
              <Field
                label="Creator Name"
                icon="name"
                hint="Use the name collectors will recognize."
                error={errors.displayName?.message}
              >
                <input
                  placeholder="e.g. Aether Studio"
                  value={form.displayName}
                  onChange={(event) => update("displayName", event.target.value)}
                  required
                />
              </Field>
              <Field
                label="Creator Type"
                icon="type"
                hint="Choose the option that best describes you."
                error={errors.creatorType?.message}
              >
                <select
                  className="cursor-pointer hover:border-white/20"
                  value={form.creatorType}
                  onChange={(event) => update("creatorType", event.target.value)}
                >
                  {creatorTypeGroups.map((group) => (
                    <optgroup key={group.label} label={group.label}>
                      {group.options.map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-md bg-white/[.045] text-[11px] text-[#8d76dc]"
                >
                  ▾
                </span>
              </Field>
              <Field
                label="Email Address"
                icon="email"
                hint="Application updates will be sent here."
                error={errors.email?.message}
              >
                <input
                  type="email"
                  placeholder="creator@example.com"
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
                  required
                />
              </Field>
              <Field
                label="Country"
                icon="country"
                hint="Used for verification and regional requirements."
                error={errors.country?.message}
              >
                <input
                  placeholder="e.g. Pakistan"
                  value={form.country}
                  onChange={(event) => update("country", event.target.value)}
                  required
                />
              </Field>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="grid gap-5">
            <div>
              <h2 className="m-0 text-[10px] font-bold uppercase tracking-[1.8px] text-[var(--cyan)]">
                Work and portfolio
              </h2>
              <p className="mb-0 mt-2 text-[10px] text-[#68748a]">
                Share enough context for our team to assess your original work.
              </p>
            </div>
            <Field
              label="Creator bio"
              hint={`${form.bio.length}/600 characters`}
              error={errors.bio?.message}
            >
              <textarea
                maxLength={600}
                value={form.bio}
                onChange={(event) => update("bio", event.target.value)}
                placeholder="Describe your creative practice, style, and the work you plan to publish."
                required
              />
            </Field>
            <div className="grid grid-cols-2 gap-4 max-[620px]:grid-cols-1">
              <Field
                label="Website URL"
                icon="website"
                hint="Your profile, portfolio, or studio website."
                error={errors.website?.message}
              >
                <input
                  type="url"
                  value={form.website}
                  onChange={(event) => update("website", event.target.value)}
                  placeholder="https://yourstudio.com"
                  required
                />
              </Field>
              <Field
                label="Primary category"
                icon="category"
                hint="Your main type of creative work."
                error={errors.primaryCategory?.message}
              >
                <select
                  value={form.primaryCategory}
                  onChange={(event) => update("primaryCategory", event.target.value)}
                >
                  <option value="art">Digital art</option>
                  <option value="collectibles">Collectibles</option>
                  <option value="photography">Photography</option>
                  <option value="music">Music</option>
                  <option value="gaming">Gaming assets</option>
                  <option value="other">Other</option>
                </select>
              </Field>
              <Field
                label="Creator experience"
                icon="experience"
                hint="This helps us understand your background."
                error={errors.experience?.message}
              >
                <select
                  value={form.experience}
                  onChange={(event) => update("experience", event.target.value)}
                >
                  <option value="new">Just getting started</option>
                  <option value="under_1_year">Under 1 year</option>
                  <option value="1_3_years">1–3 years</option>
                  <option value="3_plus_years">3+ years</option>
                </select>
              </Field>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="grid gap-5">
            <div>
              <h2 className="m-0 text-[10px] font-bold uppercase tracking-[1.8px] text-[var(--cyan)]">
                Review and declaration
              </h2>
              <p className="mb-0 mt-2 text-[10px] text-[#68748a]">
                Confirm ownership before sending your application for review.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 max-[620px]:grid-cols-1">
              {[
                ["Creator", form.displayName],
                ["Type", creatorTypeLabels[form.creatorType] ?? form.creatorType],
                ["Category", form.primaryCategory],
                ["Website", form.website],
              ].map(([label, value]) => (
                <div
                  className="rounded-xl border border-white/[.055] bg-white/[.02] p-3"
                  key={label}
                >
                  <small className="text-[8px] uppercase tracking-[1px] text-[#596579]">
                    {label}
                  </small>
                  <strong className="mt-1.5 block truncate text-[10px] capitalize">
                    {value || "Not provided"}
                  </strong>
                </div>
              ))}
            </div>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--line)] p-4 text-[10px] leading-5 text-[#8d98ab]">
              <input
                className="mt-1 accent-[var(--cyan)]"
                type="checkbox"
                checked={form.ownershipConfirmed}
                onChange={(event) => update("ownershipConfirmed", event.target.checked)}
              />
              <span>I confirm that I own or hold the necessary rights to every work I submit.</span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--line)] p-4 text-[10px] leading-5 text-[#8d98ab]">
              <input
                className="mt-1 accent-[var(--cyan)]"
                type="checkbox"
                checked={form.termsAccepted}
                onChange={(event) => update("termsAccepted", event.target.checked)}
              />
              <span>I accept the Creator Terms, content policy, and marketplace rules.</span>
            </label>
          </div>
        )}
        {error && (
          <p
            className="mb-0 mt-5 rounded-xl bg-rose-400/[.05] p-3 text-[10px] text-rose-300"
            role="alert"
          >
            {error}
          </p>
        )}
        <div className="mt-7 flex items-center justify-between gap-3">
          <button
            className="h-11 cursor-pointer rounded-xl border border-[var(--line)] bg-white/[.035] px-5 text-[13px] font-medium disabled:opacity-0"
            disabled={step === 1}
            onClick={() => setStep((current) => current - 1)}
          >
            Back
          </button>
          {step < 3 ? (
            <button
              className="h-11 cursor-pointer rounded-xl bg-[linear-gradient(110deg,#8d6bff,#6849ea)] px-5 text-[13px] font-semibold"
              onClick={() => void continueToNextStep()}
            >
              Continue
            </button>
          ) : (
            <button
              className="h-11 cursor-pointer rounded-xl bg-[linear-gradient(110deg,#8d6bff,#6849ea)] px-5 text-[13px] font-semibold disabled:opacity-60"
              disabled={submitting || !form.ownershipConfirmed || !form.termsAccepted}
              onClick={() => void submit()}
            >
              {submitting ? "Submitting…" : "Submit Application"}
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
