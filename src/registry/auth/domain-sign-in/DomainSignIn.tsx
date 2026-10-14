"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { PROVIDER_NAMES, ProviderMark, Spinner } from "./providers";
import { hint, route, type Org, type Route } from "./route";
import "./domain-sign-in.css";

export type DomainSignInProps = {
  app: { name: string; mark: ReactNode };
  /** Companies whose people sign in through their own identity provider. */
  orgs: Org[];
  /** Hand off to single sign-on, Google or Microsoft. Resolve when signed in. */
  onHandoff?: (to: Exclude<Route["kind"], "invalid" | "password">, email: string, org?: Org) => Promise<void>;
  /** Resolve when the password is right; reject when it isn't. */
  onPassword?: (email: string, password: string) => Promise<void>;
  createHref?: string;
  forgotHref?: string;
  theme?: "night" | "paper";
  className?: string;
};

/**
 * Domain Sign-in
 * Identifier first: type your email and the form works out where you belong — your company's
 * single sign-on, Google, Microsoft or a password — and shows only that, with the address
 * folded into a chip you can step back from.
 */
export function DomainSignIn({ app, orgs, onHandoff, onPassword, createHref = "#create", forgotHref = "#forgot", theme = "paper", className = "" }: DomainSignInProps) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [r, setR] = useState<Route | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const step2 = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLInputElement>(null);
  const near = hint(email, orgs);

  const prev = useRef<Route | null>(null);
  useEffect(() => {
    if (prev.current === r) return;
    prev.current = r;
    if (r) step2.current?.querySelector<HTMLElement>("input, .dsign__primary")?.focus();
    else first.current?.focus();
  }, [r]);

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    const to = route(email, orgs);
    if (to.kind === "invalid") { setError(email.trim() ? "Enter a valid email, like name@company.com." : "Enter your email to continue."); return; }
    setError(""); setR(to);
  };
  const back = () => { setR(null); setPassword(""); setError(""); };
  const go = async (fn: () => Promise<void> | undefined) => {
    setBusy(true); setError("");
    try { await (fn() ?? Promise.resolve()); setDone(true); }
    catch { setError(r?.kind === "password" ? "Wrong password. Try again or reset it." : "That didn't go through. Try again."); }
    finally { setBusy(false); }
  };

  const initial = email.trim()[0]?.toUpperCase() ?? "?";
  return (
    <div className={`dsign dsign--${theme} ${className}`}>
      <div className="dsign__card">
        <span className="dsign__mark" aria-hidden="true">{app.mark}</span>
        <div className="dsign__track" data-step={r ? 2 : 1}>
          {/* step one: who are you */}
          <form className="dsign__pane" onSubmit={next} noValidate inert={r ? true : undefined} aria-hidden={r ? true : undefined}>
            <h2 className="dsign__title">Sign in</h2>
            <p className="dsign__sub">to continue to {app.name}</p>
            <div className={`dsign__field ${email ? "dsign__field--filled" : ""} ${!r && error ? "dsign__field--bad" : ""}`}>
              <input ref={first} id={`${id}-email`} type="email" autoComplete="username email" inputMode="email" value={email} placeholder=" "
                aria-invalid={!r && error ? true : undefined} aria-describedby={`${id}-hint`} onChange={(e) => { setEmail(e.target.value); setError(""); }} />
              <label htmlFor={`${id}-email`}>Email</label>
            </div>
            <p id={`${id}-hint`} className="dsign__hint" aria-live="polite">
              {!r && error ? <span className="dsign__err">{error}</span>
                : near ? <span className="dsign__org-hint"><i style={{ background: near.color }} aria-hidden="true">{near.name[0]}</i>{near.name} signs in with {near.idp}</span>
                : <span>Use your work or personal email.</span>}
            </p>
            <div className="dsign__actions">
              <a className="dsign__text" href={createHref}>Create account</a>
              <button type="submit" className="dsign__next">Next</button>
            </div>
          </form>

          {/* step two: the one way in for this address */}
          <div ref={step2} className="dsign__pane" inert={!r ? true : undefined} aria-hidden={!r ? true : undefined}>
            <h2 className="dsign__title dsign__title--2">Welcome</h2>
            <button type="button" className="dsign__chip" onClick={back} aria-label={`${email}. Use a different account`}>
              <i aria-hidden="true">{initial}</i><span>{email}</span>
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="m3 4.5 3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            {done ? (
              <div className="dsign__done" role="status"><span aria-hidden="true">✓</span>Welcome back. Opening {app.name}…</div>
            ) : r?.kind === "sso" ? (
              <>
                <div className="dsign__org"><i style={{ background: r.org.color }} aria-hidden="true">{r.org.name[0]}</i><div><b>{r.org.name}</b><span>Managed by your administrator</span></div></div>
                <p className="dsign__sub dsign__sub--left">{r.org.name} signs its people in with {r.org.idp}. You'll come straight back here afterwards.</p>
                <button type="button" className="dsign__primary" disabled={busy} onClick={() => go(() => onHandoff?.("sso", email, r.org))}>{busy ? <Spinner /> : null}Continue to {r.org.idp}</button>
              </>
            ) : r?.kind === "google" || r?.kind === "microsoft" ? (
              <>
                <p className="dsign__sub dsign__sub--left">This looks like a {PROVIDER_NAMES[r.kind]} account. Sign in there — it's quicker, and you won't need another password.</p>
                <button type="button" className={`dsign__primary dsign__primary--${r.kind}`} disabled={busy} onClick={() => go(() => onHandoff?.(r.kind as "google", email))}>
                  {busy ? <Spinner /> : <ProviderMark id={r.kind} size={18} />}Continue with {PROVIDER_NAMES[r.kind]}
                </button>
                <button type="button" className="dsign__text dsign__text--block" onClick={() => setR({ kind: "password" })}>Use a password instead</button>
              </>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (!password) { setError("Enter your password."); return; } go(() => onPassword?.(email, password)); }} noValidate>
                <div className={`dsign__field ${password ? "dsign__field--filled" : ""} ${error ? "dsign__field--bad" : ""}`}>
                  <input id={`${id}-pass`} type={show ? "text" : "password"} autoComplete="current-password" value={password} placeholder=" "
                    aria-invalid={error ? true : undefined} aria-describedby={`${id}-perr`} onChange={(e) => { setPassword(e.target.value); setError(""); }} />
                  <label htmlFor={`${id}-pass`}>Password</label>
                </div>
                <p id={`${id}-perr`} className="dsign__hint" aria-live="polite">{error ? <span className="dsign__err">{error}</span> : null}</p>
                <label className="dsign__show"><input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />Show password</label>
                <div className="dsign__actions">
                  <a className="dsign__text" href={forgotHref}>Forgot password?</a>
                  <button type="submit" className="dsign__next" disabled={busy}>{busy ? <Spinner /> : null}Next</button>
                </div>
              </form>
            )}
            {r?.kind === "sso" && error && <p className="dsign__hint"><span className="dsign__err" role="alert">{error}</span></p>}
            {(r?.kind === "google" || r?.kind === "microsoft") && error && <p className="dsign__hint"><span className="dsign__err" role="alert">{error}</span></p>}
          </div>
        </div>
      </div>
      <p className="dsign__foot"><span>English (UK)</span><span><a href="#help">Help</a> · <a href="#privacy">Privacy</a> · <a href="#terms">Terms</a></span></p>
    </div>
  );
}

export default DomainSignIn;
