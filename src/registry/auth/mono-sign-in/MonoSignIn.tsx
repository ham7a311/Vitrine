"use client";
import { useEffect, useId, useRef, useState } from "react";
import { isEmail, providerError } from "./mono";
import { PROVIDER_NAMES, ProviderMark, Spinner, type ProviderId } from "./providers";
import "./mono-sign-in.css";

export type MonoSignInProps = {
  /** Wordmark shown large on the dark side. */
  brand: string;
  /** One line under the wordmark. */
  tagline?: string;
  providers?: ProviderId[];
  /** Marked "Last used". */
  lastUsed?: ProviderId;
  /** Resolve when the provider signs the person in; reject with { reason: "closed" | "denied" } or anything else. */
  onProvider?: (id: ProviderId) => Promise<void>;
  /** Resolve when the email and password are right; reject when they aren't. */
  onSignIn?: (email: string, password: string) => Promise<void>;
  signUpHref?: string;
  forgotHref?: string;
  theme?: "paper" | "night";
  className?: string;
};

type Phase = "idle" | "busy" | "done";

/**
 * Mono Sign-in
 * A stark black-and-white split: a dark slab with the wordmark over a slow drifting dot field,
 * and a plain form with Google, GitHub and Microsoft first and email underneath, whose password
 * field opens in place once the email checks out.
 */
export function MonoSignIn({ brand, tagline, providers = ["google", "github", "microsoft"], lastUsed, onProvider, onSignIn, signUpHref = "#sign-up", forgotHref = "#forgot", theme = "paper", className = "" }: MonoSignInProps) {
  const id = useId();
  const [pending, setPending] = useState<ProviderId | "email" | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"email" | "password">("email");
  const [error, setError] = useState<{ field?: "email" | "password"; text: string } | null>(null);
  const pass = useRef<HTMLInputElement>(null);
  const mail = useRef<HTMLInputElement>(null);
  const done = phase === "done";

  useEffect(() => { if (step === "password") pass.current?.focus(); }, [step]);

  const viaProvider = async (p: ProviderId) => {
    setError(null); setPending(p); setPhase("busy");
    try { await (onProvider?.(p) ?? Promise.resolve()); setPhase("done"); }
    catch (e) { setPhase("idle"); setError({ text: providerError(PROVIDER_NAMES[p], (e as { reason?: string })?.reason) }); }
    finally { setPending(null); }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (step === "email") {
      if (!isEmail(email)) { setError({ field: "email", text: "Enter an email like name@example.com." }); mail.current?.focus(); return; }
      setStep("password"); return;
    }
    if (!password) { setError({ field: "password", text: "Enter your password." }); pass.current?.focus(); return; }
    setPending("email"); setPhase("busy");
    try { await (onSignIn?.(email, password) ?? Promise.resolve()); setPhase("done"); }
    catch { setPhase("idle"); setError({ field: "password", text: "That email and password don't match. Try again or reset it." }); pass.current?.select(); }
    finally { setPending(null); }
  };

  const busy = phase === "busy";
  return (
    <div className={`msign msign--${theme} ${className}`}>
      <aside className="msign__slab" aria-hidden="true">
        <div className="msign__field" />
        <p className="msign__mark">{brand}<span>.</span></p>
        {tagline && <p className="msign__tag">{tagline}</p>}
        <p className="msign__foot"><span>© 2026</span><span>Status: all systems normal</span></p>
      </aside>
      <main className="msign__main">
        <form className="msign__form" onSubmit={submit} noValidate aria-describedby={error ? `${id}-err` : undefined}>
          <h1 className="msign__title">{done ? `Welcome back` : `Sign in to ${brand}`}</h1>
          <p className="msign__sub">{done ? "You're signed in. Taking you to your workspace…" : <>New here? <a href={signUpHref}>Create an account</a></>}</p>

          {!done && (
            <>
              <div className="msign__providers">
                {providers.map((p) => (
                  <button key={p} type="button" className="msign__provider" disabled={busy} aria-busy={pending === p} onClick={() => viaProvider(p)}>
                    {pending === p ? <Spinner /> : <ProviderMark id={p} mono />}
                    <span>Continue with {PROVIDER_NAMES[p]}</span>
                    {lastUsed === p && <em>Last used</em>}
                  </button>
                ))}
              </div>
              <p className="msign__or"><span>or</span></p>

              <label className="msign__label" htmlFor={`${id}-email`}>Email</label>
              <div className={`msign__row ${step === "password" ? "msign__row--locked" : ""}`}>
                <input ref={mail} id={`${id}-email`} className="msign__input" type="email" autoComplete="email" inputMode="email" placeholder="you@company.com"
                  value={email} readOnly={step === "password"} aria-invalid={error?.field === "email" || undefined} aria-describedby={error?.field === "email" ? `${id}-err` : undefined}
                  onChange={(e) => { setEmail(e.target.value); if (error?.field === "email") setError(null); }} />
                {step === "password" && <button type="button" className="msign__edit" onClick={() => { setStep("email"); setPassword(""); setError(null); requestAnimationFrame(() => mail.current?.focus()); }}>Change</button>}
              </div>

              <div className={`msign__reveal ${step === "password" ? "msign__reveal--open" : ""}`} inert={step !== "password" ? true : undefined}>
                <div>
                  <div className="msign__label-row"><label className="msign__label" htmlFor={`${id}-pass`}>Password</label><a href={forgotHref}>Forgot?</a></div>
                  <input ref={pass} id={`${id}-pass`} className="msign__input" type="password" autoComplete="current-password"
                    value={password} aria-invalid={error?.field === "password" || undefined} aria-describedby={error?.field === "password" ? `${id}-err` : undefined}
                    onChange={(e) => { setPassword(e.target.value); if (error?.field === "password") setError(null); }} />
                </div>
              </div>

              {error && <p id={`${id}-err`} className="msign__error" role="alert">{error.text}</p>}

              <button type="submit" className="msign__submit" disabled={busy} aria-busy={pending === "email"}>
                {pending === "email" ? <Spinner /> : null}
                {step === "email" ? "Continue with email" : pending === "email" ? "Signing in" : "Sign in"}
              </button>
            </>
          )}
          {done && <div className="msign__done" role="status"><svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true"><path d="m7 14.5 4.5 4.5L21 9.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>Signed in</div>}
          <p className="msign__legal">By continuing you agree to the <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</p>
        </form>
      </main>
    </div>
  );
}

export default MonoSignIn;
