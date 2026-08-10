"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import cryptonixLogo from "../../../public/assets/logo.png";
import {
  ADMIN_ENROLL_MFA_MUTATION,
  ADMIN_LOGIN_MUTATION,
  ADMIN_VERIFY_MFA_MUTATION,
  adminGraphql,
  adminLoginFormSchema,
  adminMfaFormSchema,
} from "../../lib/admin-auth";
import AdminIcon from "./AdminIcon";

export default function AdminLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"credentials" | "verification" | "recovery">("credentials");
  const [codes, setCodes] = useState(["", "", "", "", "", ""]);
  const [challengeToken, setChallengeToken] = useState("");
  const [mfaSetup, setMfaSetup] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const codeRefs = useRef<Array<HTMLInputElement | null>>([]);
  const redirectTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!error) return;
    const timeout = window.setTimeout(() => setError(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [error]);

  useEffect(
    () => () => {
      if (redirectTimerRef.current) window.clearTimeout(redirectTimerRef.current);
    },
    [],
  );

  const updateCode = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setCodes((current) => current.map((code, codeIndex) => (codeIndex === index ? digit : code)));
    if (digit && index < 5) codeRefs.current[index + 1]?.focus();
  };

  const resetMfaCode = () => {
    setCodes(["", "", "", "", "", ""]);
    window.setTimeout(() => codeRefs.current[0]?.focus(), 0);
  };

  const submitCredentials = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    const form = new FormData(event.currentTarget);
    const parsed = adminLoginFormSchema.safeParse({
      email: form.get("email"),
      password: form.get("password"),
    });
    if (!parsed.success) {
      setFieldErrors(
        Object.fromEntries(
          parsed.error.issues.map((issue) => [String(issue.path[0]), issue.message]),
        ),
      );
      return;
    }
    setSubmitting(true);
    try {
      const payload = await adminGraphql(ADMIN_LOGIN_MUTATION, { input: parsed.data });
      if (!payload.success || !payload.data?.challengeToken) {
        setError(payload.message);
        return;
      }
      setChallengeToken(payload.data.challengeToken);
      setMfaSetup(payload.data.status === "MFA_SETUP_REQUIRED");
      setQrCode(payload.data.qrCodeDataUrl ?? null);
      setCodes(["", "", "", "", "", ""]);
      setStep("verification");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  const submitMfa = async () => {
    setError(null);
    const parsed = adminMfaFormSchema.safeParse({ code: codes.join("") });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter the verification code.");
      resetMfaCode();
      return;
    }
    setSubmitting(true);
    try {
      const payload = await adminGraphql(
        mfaSetup ? ADMIN_ENROLL_MFA_MUTATION : ADMIN_VERIFY_MFA_MUTATION,
        { input: { challengeToken, code: parsed.data.code } },
      );
      if (!payload.success) {
        setError(payload.message);
        resetMfaCode();
        return;
      }
      if (mfaSetup && payload.data?.recoveryCodes?.length) {
        setRecoveryCodes(payload.data.recoveryCodes);
        setStep("recovery");
      } else {
        setVerificationSuccess(true);
        redirectTimerRef.current = window.setTimeout(() => {
          router.replace("/admin");
          router.refresh();
        }, 2000);
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Verification failed.");
      resetMfaCode();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="admin-workspace relative min-h-screen min-h-dvh overflow-x-hidden overflow-y-auto bg-[#050711] p-3 text-[#f4f6fb] max-[480px]:p-0">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(83,232,220,.09),transparent_28rem),radial-gradient(circle_at_88%_8%,rgba(141,107,255,.18),transparent_34rem)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[.035] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:54px_54px]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-24px)] min-h-[calc(100dvh-24px)] max-w-[1440px] grid-cols-[minmax(0,1.05fr)_minmax(420px,.75fr)] overflow-hidden rounded-[28px] border border-white/[.075] bg-[rgba(8,11,23,.76)] shadow-[0_35px_120px_rgba(0,0,0,.46)] backdrop-blur-2xl max-[1100px]:grid-cols-1 max-[480px]:min-h-screen max-[480px]:min-h-dvh max-[480px]:rounded-none max-[480px]:border-0">
        <section className="admin-login-brand relative flex flex-col justify-between overflow-hidden border-r border-white/[.07] p-3 max-[1100px]:hidden">
          <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-cyan-400/[.08] blur-[90px]" />
          <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-violet-500/[.14] blur-[100px]" />
          <Link className="relative flex w-fit items-center gap-3" href="/">
            <Image
              className="h-11 w-11 object-contain"
              src={cryptonixLogo}
              alt="Cryptonix"
              sizes="44px"
            />
            <div>
              <strong className="block text-[16px] tracking-[-.3px]">Cryptonix</strong>
              <span className="text-[9px] font-bold tracking-[1.7px] text-[#9e87f5]">
                ADMIN COMMAND
              </span>
            </div>
          </Link>

          <div className="relative max-w-[580px] mx-auto">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-violet-300/[.15] bg-violet-400/[.09] text-[#b9a8ff] shadow-[0_15px_45px_rgba(104,73,232,.14)]">
                <AdminIcon name="shield" className="h-6 w-6" />
              </span>
              <span className="text-[9px] font-bold tracking-[1.7px] text-[#8872dd]">
                SECURE OPERATIONS ACCESS
              </span>
            </div>
            <h1 className="m-0 mt-3 max-w-[560px] text-[32px] font-semibold leading-[1.12] tracking-[-1.5px] xl:text-[38px]">
              Protecting the marketplace starts here.
            </h1>
            <p className="m-0 mt-5 max-w-[510px] text-[12px] leading-6 text-[#7f8ba1]">
              Monitor blockchain operations, safeguard digital assets and manage the Cryptonix
              ecosystem from one trusted workspace.
            </p>
            <div className="mt-8 grid max-w-[500px] grid-cols-3 gap-3">
              {[
                ["24/7", "Monitoring"],
                ["100%", "MFA protected"],
                ["Immutable", "Audit trail"],
              ].map(([value, label]) => (
                <div
                  className="rounded-2xl border border-white/[.07] bg-white/[.025] p-3"
                  key={label}
                >
                  <strong className="block text-[13px]">{value}</strong>
                  <span className="mt-1.5 block text-[9px] text-[#647086]">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center gap-2 text-[9px] text-[#566176]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            All authentication systems operational
            <span className="mx-1 text-white/10">•</span>
            Protected by Cryptonix Security
          </div>
        </section>

        <section className="flex min-h-0 flex-col overflow-y-auto">
          <div className="flex items-center justify-between p-3 min-[1101px]:hidden">
            <Link className="flex items-center gap-2.5" href="/">
              <Image
                className="h-9 w-9 object-contain"
                src={cryptonixLogo}
                alt="Cryptonix"
                sizes="36px"
              />
              <div>
                <strong className="block text-[14px]">Cryptonix</strong>
                <span className="text-[8px] font-bold tracking-[1.4px] text-[#927ce8]">ADMIN</span>
              </div>
            </Link>
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-300/[.11] bg-emerald-400/[.05] px-2.5 py-1.5 text-[8px] text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Secure
            </span>
          </div>

          <div className="admin-login-form my-auto w-full max-w-[440px] self-center p-3 sm:p-6 min-[1101px]:p-3">
            {step === "credentials" ? (
              <form onSubmit={submitCredentials} noValidate>
                <div className="mb-7">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/[.08] bg-white/[.035] text-[#a794f6]">
                      <AdminIcon name="lock" className="h-5 w-5" />
                    </span>
                    <span className="text-[9px] font-bold tracking-[1.5px] text-[#7763c6]">
                      AUTHORIZED PERSONNEL ONLY
                    </span>
                  </div>
                  <h2 className="m-0 mt-2 text-[26px] font-semibold tracking-[-.7px]">
                    Welcome Back
                  </h2>
                  <p className="m-0 mt-2 text-[10px] leading-5 text-[#707c91]">
                    Sign in with your assigned administrator credentials.
                  </p>
                </div>

                <div className="grid gap-4">
                  <label className="grid gap-2 text-[10px] font-semibold text-[#aeb7c8]">
                    Admin Email
                    <span className="relative block">
                      <AdminIcon
                        name="mail"
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5f6b80]"
                      />
                      <input
                        name="email"
                        type="email"
                        autoComplete="username"
                        placeholder="admin@cryptonix.io"
                        aria-invalid={Boolean(fieldErrors.email)}
                        aria-describedby={fieldErrors.email ? "admin-email-error" : undefined}
                        onChange={() => {
                          if (fieldErrors.email)
                            setFieldErrors((current) => ({ ...current, email: "" }));
                        }}
                        className={`h-12 w-full rounded-xl border bg-[#080b16] pl-10 pr-3 text-[11px] font-normal text-white outline-none transition placeholder:text-[#465064] focus:bg-white/[.025] focus:ring-4 ${fieldErrors.email ? "border-rose-400/45 focus:border-rose-400/60 focus:ring-rose-500/[.06]" : "border-white/[.08] focus:border-violet-400/40 focus:ring-violet-500/[.05]"}`}
                      />
                    </span>
                    {fieldErrors.email ? (
                      <span
                        id="admin-email-error"
                        className="text-[9px] font-normal text-rose-300"
                        role="alert"
                      >
                        {fieldErrors.email}
                      </span>
                    ) : null}
                  </label>

                  <label className="grid gap-2 text-[10px] font-semibold text-[#aeb7c8]">
                    Password
                    <span className="relative block">
                      <AdminIcon
                        name="lock"
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5f6b80]"
                      />
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter your secure password"
                        aria-invalid={Boolean(fieldErrors.password)}
                        aria-describedby={fieldErrors.password ? "admin-password-error" : undefined}
                        onChange={() => {
                          if (fieldErrors.password)
                            setFieldErrors((current) => ({ ...current, password: "" }));
                        }}
                        className={`h-12 w-full rounded-xl border bg-[#080b16] pl-10 pr-11 text-[11px] font-normal text-white outline-none transition placeholder:text-[#465064] focus:bg-white/[.025] focus:ring-4 ${fieldErrors.password ? "border-rose-400/45 focus:border-rose-400/60 focus:ring-rose-500/[.06]" : "border-white/[.08] focus:border-violet-400/40 focus:ring-violet-500/[.05]"}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute cursor-pointer right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-[#667287] transition hover:bg-white/[.05] hover:text-white"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        <AdminIcon name={showPassword ? "eyeOff" : "eye"} className="h-4 w-4" />
                      </button>
                    </span>
                    {fieldErrors.password ? (
                      <span
                        id="admin-password-error"
                        className="text-[9px] font-normal text-rose-300"
                        role="alert"
                      >
                        {fieldErrors.password}
                      </span>
                    ) : null}
                  </label>
                </div>

                <div className="my-5 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    className="text-[9px] cursor-pointer font-medium text-[#9d87f1] transition hover:text-[#c2b4fb]"
                  >
                    Forgot password?
                  </button>
                </div>

                {error ? (
                  <div
                    className="mb-3 rounded-xl border border-rose-300/[.14] bg-rose-400/[.07] p-3 text-[9px] leading-5 text-rose-200"
                    role="alert"
                  >
                    {error}
                  </div>
                ) : null}

                <button
                  disabled={submitting}
                  className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[linear-gradient(110deg,#8d6bff,#6544df)] text-[11px] font-semibold text-white shadow-[0_14px_36px_rgba(104,73,232,.26)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(104,73,232,.34)] disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {submitting ? "Checking" : "Continue"}
                  <AdminIcon name="arrowRight" className="h-4 w-4" />
                </button>

                <div className="mt-5 flex gap-2.5 rounded-xl border border-cyan-300/[.09] bg-cyan-400/[.035] p-3">
                  <AdminIcon name="shield" className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                  <p className="m-0 text-[9px] leading-5 text-[#748095]">
                    This is a restricted portal. Every sign-in attempt is monitored and recorded in
                    the security audit trail.
                  </p>
                </div>
              </form>
            ) : step === "verification" ? (
              <div>
                <button
                  onClick={() => {
                    setStep("credentials");
                    setError(null);
                    setVerificationSuccess(false);
                  }}
                  className="mb-7 cursor-pointer flex items-center gap-1.5 text-[9px] text-[#7c879b] transition hover:text-white"
                >
                  <AdminIcon name="chevronLeft" className="h-3.5 w-3.5" />
                  Back to sign in
                </button>
                <div className="mb-4 flex items-center gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-violet-300/[.13] bg-violet-400/[.08] text-[#b5a2ff]">
                    <AdminIcon name="key" className="h-6 w-6" />
                  </span>
                  <span className="text-[9px] font-bold tracking-[1.5px] text-[#7763c6]">
                    TWO-STEP VERIFICATION
                  </span>
                </div>
                <h2 className="m-0 mt-2 text-[26px] font-semibold tracking-[-.7px]">
                  Verify it’s you
                </h2>
                <p className="m-0 mt-2 max-w-[390px] text-[10px] leading-5 text-[#707c91]">
                  {mfaSetup
                    ? "Scan this QR code with your authenticator app, then enter its 6-digit code."
                    : "Enter the 6-digit code from your authenticator app to finish signing in."}
                </p>

                {mfaSetup && qrCode ? (
                  <div className="mt-5 flex justify-center rounded-2xl border border-white/[.08] bg-white p-3">
                    {/* QR data is generated by the authenticated enrollment challenge. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrCode}
                      alt="Cryptonix authenticator enrollment QR code"
                      className="h-[180px] w-[180px]"
                    />
                  </div>
                ) : null}

                <div className="my-7 grid grid-cols-6 gap-2 max-[390px]:gap-1.5">
                  {codes.map((code, index) => (
                    <input
                      key={index}
                      ref={(element) => {
                        codeRefs.current[index] = element;
                      }}
                      value={code}
                      onChange={(event) => updateCode(index, event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Backspace" && !codes[index] && index > 0)
                          codeRefs.current[index - 1]?.focus();
                      }}
                      inputMode="numeric"
                      maxLength={1}
                      disabled={verificationSuccess}
                      aria-label={`Verification digit ${index + 1}`}
                      className="aspect-square min-w-0 rounded-xl border border-white/[.09] bg-[#080b16] text-center text-[18px] font-semibold text-white outline-none transition focus:border-violet-400/50 focus:bg-violet-400/[.04] focus:ring-4 focus:ring-violet-500/[.06] max-[390px]:rounded-lg"
                    />
                  ))}
                </div>

                {error ? (
                  <div
                    className="mb-3 rounded-xl border border-rose-300/[.14] bg-rose-400/[.07] p-3 text-[9px] leading-5 text-rose-200"
                    role="alert"
                  >
                    {error}
                  </div>
                ) : null}

                <button
                  type="button"
                  disabled={!codes.every(Boolean) || submitting || verificationSuccess}
                  onClick={() => void submitMfa()}
                  className={`flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl text-[11px] font-semibold text-white transition disabled:cursor-not-allowed ${verificationSuccess ? "border border-emerald-300/20 bg-[linear-gradient(110deg,#20a874,#16865f)] shadow-[0_14px_36px_rgba(32,168,116,.24)]" : "bg-[linear-gradient(110deg,#8d6bff,#6544df)] shadow-[0_14px_36px_rgba(104,73,232,.26)] hover:-translate-y-0.5 disabled:opacity-45"}`}
                >
                  {verificationSuccess ? (
                    <>
                      <span className="grid h-6 w-6 place-items-center rounded-full border border-white/20 bg-white/[.12]">
                        <svg
                          aria-hidden="true"
                          className="h-3.5 w-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m5 12 4 4 10-10" />
                        </svg>
                      </span>
                      Verified
                    </>
                  ) : submitting ? (
                    "Verifying…"
                  ) : mfaSetup ? (
                    "Connect authenticator"
                  ) : (
                    "Continue To Verification"
                  )}
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-emerald-300/[.13] bg-emerald-400/[.08] text-emerald-300">
                    <AdminIcon name="shield" className="h-6 w-6" />
                  </span>
                  <span className="text-[9px] font-bold tracking-[1.5px] text-emerald-300">
                    AUTHENTICATOR CONNECTED
                  </span>
                </div>
                <h2 className="m-0 text-[26px] font-semibold tracking-[-.7px]">
                  Save recovery codes
                </h2>
                <p className="m-0 mt-2 text-[10px] leading-5 text-[#707c91]">
                  Store these one-time codes securely. They will not be shown again.
                </p>
                <div className="my-5 grid grid-cols-2 gap-2 rounded-2xl border border-white/[.08] bg-[#080b16] p-3 max-[390px]:grid-cols-1">
                  {recoveryCodes.map((code) => (
                    <code
                      key={code}
                      className="rounded-lg bg-white/[.035] p-2 text-center text-[10px] text-[#c7bddf]"
                    >
                      {code}
                    </code>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => router.replace("/admin")}
                  className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[linear-gradient(110deg,#8d6bff,#6544df)] text-[11px] font-semibold text-white"
                >
                  I saved the codes
                  <AdminIcon name="arrowRight" className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <footer className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 p-3 text-center text-[8px] text-[#4f5a6e]">
            <span>© 2026 Cryptonix</span>
            <span>Privacy</span>
            <span>Security</span>
            <span>Administrator support</span>
          </footer>
        </section>
      </div>
    </main>
  );
}
