"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type FormEvent } from "react";
import "./one-field-sign-in.css";

/**
 * One-Field Sign-in
 * Continuity instead of pages. The same rounded field holds each step:
 *   email → (sending) → 6-digit code → (checking) → signed in.
 * Its width eases between steps, the old label lifts away as the new one
 * settles, and a hairline across the bottom is the progress bar.
 */

type Step = "email" | "sending" | "code" | "checking" | "done";

type Props = {
  title?: string;
  subtitle?: string;
  /** Resolve true to accept the code. Defaults to accepting anything but 000000. */
  verify?: (code: string) => Promise<boolean>;
  onSignedIn?: (email: string) => void;
  accent?: string;
  theme?: "night" | "paper";
  className?: string;
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const mask = (e: string) => {
  const [u, d] = e.split("@");
  return `${u.slice(0, 1)}${"•".repeat(Math.max(2, Math.min(6, u.length - 1)))}@${d}`;
};

export function OneFieldSignIn({ title = "Sign in", subtitle = "We'll email you a six-digit code. No password needed.", verify, onSignedIn, accent = "#b9cce4", theme = "night", className = "" }: Props) {
  const uid = useId();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(0);
  const emailRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === "code") requestAnimationFrame(() => codeRef.current?.focus());
    if (step === "email") requestAnimationFrame(() => emailRef.current?.focus({ preventScroll: true }));
  }, [step]);

  const sendCode = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError("That doesn't look like an email address."); setShake((s) => s + 1); return; }
    setError(null); setStep("sending");
    await wait(900);
    setStep("code");
  };

  const check = async (value: string) => {
    setStep("checking");
    const ok = verify ? await verify(value) : (await wait(900), value !== "000000");
    if (ok) { setStep("done"); onSignedIn?.(email); }
    else { setError("That code didn't match. Try again."); setCode(""); setShake((s) => s + 1); setStep("code"); }
  };

  const onCode = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 6);
    setCode(digits); setError(null);
    if (digits.length === 6) check(digits);
  };

  const progress = { email: 0.12, sending: 0.4, code: 0.62, checking: 0.86, done: 1 }[step];
  const busy = step === "sending" || step === "checking";
  const initial = (email.split("@")[0] || "you").charAt(0).toUpperCase();

  return (
    <section className={`one-field-sign-in one-field-sign-in--${theme} ${className}`} style={{ "--of-accent": accent, "--of-progress": progress } as CSSProperties} data-step={step}>
      <h2 className="one-field-sign-in__title">{step === "done" ? "Welcome back" : title}</h2>
      <p className="one-field-sign-in__sub">{step === "done" ? "You're signed in on this device." : step === "email" || step === "sending" ? subtitle : "Check your inbox — the code expires in 10 minutes."}</p>

      <form className="one-field-sign-in__field" data-error={error ? "" : undefined} key={shake} onSubmit={sendCode} noValidate>
        {/* labels: each step has its own; they hand off rather than swap */}
        <label htmlFor={`${uid}-email`} className="one-field-sign-in__label" data-on={step === "email" || step === "sending" || undefined}>Email</label>
        <label htmlFor={`${uid}-code`} className="one-field-sign-in__label" data-on={step === "code" || step === "checking" || undefined}>
          Code sent to {email ? mask(email) : "your inbox"}
        </label>

        <div className="one-field-sign-in__layer" data-on={step === "email" || step === "sending" || undefined}>
          <input
            ref={emailRef}
            id={`${uid}-email`}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null); }}
            disabled={step !== "email"}
            aria-invalid={!!error && step === "email"}
            aria-describedby={`${uid}-msg`}
          />
          <button type="submit" className="one-field-sign-in__go" disabled={step !== "email"} aria-label="Send code">
            {step === "sending" ? <span className="one-field-sign-in__spin" aria-hidden="true" /> : <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8h9M8.5 4l4 4-4 4" /></svg>}
          </button>
        </div>

        <div className="one-field-sign-in__layer" data-on={step === "code" || step === "checking" || undefined}>
          <div className="one-field-sign-in__slots" onClick={() => codeRef.current?.focus()} data-checking={step === "checking" || undefined}>
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} className="one-field-sign-in__slot" data-filled={code[i] ? "" : undefined} data-caret={step === "code" && i === code.length ? "" : undefined} style={{ "--i": i } as CSSProperties}>
                {code[i] ?? ""}
              </span>
            ))}
            <input
              ref={codeRef}
              id={`${uid}-code`}
              className="one-field-sign-in__code"
              value={code}
              onChange={(e) => onCode(e.target.value)}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              disabled={step !== "code"}
              aria-invalid={!!error && step === "code"}
              aria-describedby={`${uid}-msg`}
            />
          </div>
          <button type="button" className="one-field-sign-in__back" onClick={() => { setCode(""); setError(null); setStep("email"); }} disabled={busy}>Change</button>
        </div>

        <div className="one-field-sign-in__layer one-field-sign-in__layer--done" data-on={step === "done" || undefined} aria-hidden={step !== "done"}>
          <span className="one-field-sign-in__avatar">{initial}</span>
          <span className="one-field-sign-in__who">{email}</span>
          <svg className="one-field-sign-in__check" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" /></svg>
        </div>

        <span className="one-field-sign-in__rule" aria-hidden="true" />
      </form>

      <p id={`${uid}-msg`} className="one-field-sign-in__msg" role="status" aria-live="polite">
        {error ?? (step === "sending" ? "Sending your code…" : step === "checking" ? "Checking…" : step === "done" ? `Signed in as ${email}` : "")}
      </p>
    </section>
  );
}
