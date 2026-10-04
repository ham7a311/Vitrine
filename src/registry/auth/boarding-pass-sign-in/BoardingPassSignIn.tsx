"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import "./boarding-pass-sign-in.css";

/**
 * Boarding Pass Sign-in
 * Signing in as checking in. The form is a boarding pass: your email is the
 * passenger, your password the passcode. Board, and a barcode prints onto
 * the stub, line by line; then the stub tears away along the perforation
 * and the pass shows your gate. If the details don't check out, an ink
 * stamp says so — and the fields say exactly what to fix.
 */

type Props = {
  product?: string;
  /** Resolves on success, rejects with a message on failure. */
  onSignIn?: (email: string, password: string) => Promise<void>;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** A barcode from the email: the same address always prints the same bars. */
function bars(seed: string) {
  let h = 2166136261;
  for (const c of seed || "vitrine") h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const out: number[] = [];
  for (let i = 0; i < 34; i++) {
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    out.push(1 + ((h >>> 0) % 3));
  }
  return out;
}

const demo = (email: string, password: string) =>
  new Promise<void>((ok, no) => setTimeout(() => (password === "wrongpass" ? no(new Error("That passcode doesn’t match this passenger.")) : ok()), 900));

export function BoardingPassSignIn({ product = "Vitrine", onSignIn = demo, theme = "paper", motion = "full", className = "" }: Props) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [stage, setStage] = useState<"idle" | "checking" | "printed" | "torn" | "denied">("idle");
  const [stamp, setStamp] = useState(0);
  const okRef = useRef<HTMLHeadingElement>(null);
  const reduced = () => motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const name = email.split("@")[0]?.replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Passenger";
  const seat = `${2 + ((email.length * 7) % 18)}${"ACDF"[email.length % 4]}`;

  useEffect(() => {
    if (stage === "torn") okRef.current?.focus();
  }, [stage]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (stage === "checking") return;
    const next: typeof errors = {};
    if (!EMAIL.test(email.trim())) next.email = "Enter the email you signed up with, like hamza@tryvitrine.dev.";
    if (password.length < 8) next.password = "Passcodes are at least 8 characters.";
    setErrors(next);
    if (next.email || next.password) {
      setStage("denied");
      setStamp((n) => n + 1);
      return;
    }
    setStage("checking");
    try {
      await onSignIn(email.trim(), password);
      setStage("printed");
      // Let the barcode finish printing, then tear the stub away.
      window.setTimeout(() => setStage("torn"), reduced() ? 0 : 1100);
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "We couldn’t check you in." });
      setStage("denied");
      setStamp((n) => n + 1);
    }
  };

  const reset = () => {
    setStage("idle");
    setPassword("");
    setErrors({});
  };

  const done = stage === "torn";
  const printed = stage === "printed" || stage === "torn";

  return (
    <div className={`bp bp--${theme} ${className}`} data-motion={motion} data-stage={stage}>
      <form className="bp__main" onSubmit={submit} noValidate aria-labelledby={`${id}-t`}>
        <header className="bp__band">
          <span className="bp__brand">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M2 11.5l16-6-4.5 11-3-4.2zM10.5 12.3L18 5.5" /></svg>
            {product} Air
          </span>
          <span className="bp__kind" id={`${id}-t`}>{done ? "Checked in" : "Boarding pass · Sign in"}</span>
        </header>

        <div className="bp__route" aria-hidden="true">
          <span><b>MCT</b> Muscat</span>
          <span className="bp__path"><i /></span>
          <span className="bp__to"><b>ATL</b> {product}</span>
        </div>

        {!done ? (
          <div className="bp__fields">
            <div className="bp__field" data-err={errors.email ? "" : undefined}>
              <label htmlFor={`${id}-e`}>Passenger · email</label>
              <input
                id={`${id}-e`}
                type="email"
                autoComplete="username"
                inputMode="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((x) => ({ ...x, email: undefined })); if (stage === "denied") setStage("idle"); }}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? `${id}-ee` : undefined}
                placeholder="hamza@tryvitrine.dev"
                disabled={stage === "checking" || printed}
              />
              {errors.email && <p className="bp__err" id={`${id}-ee`}>{errors.email}</p>}
            </div>
            <div className="bp__field" data-err={errors.password || errors.form ? "" : undefined}>
              <label htmlFor={`${id}-p`}>Passcode · password</label>
              <div className="bp__pw">
                <input
                  id={`${id}-p`}
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((x) => ({ ...x, password: undefined, form: undefined })); if (stage === "denied") setStage("idle"); }}
                  aria-invalid={!!errors.password || !!errors.form}
                  aria-describedby={errors.password ? `${id}-pe` : errors.form ? `${id}-fe` : `${id}-ph`}
                  placeholder="••••••••"
                  disabled={stage === "checking" || printed}
                />
                <button type="button" className="bp__eye" onClick={() => setShow((s) => !s)} aria-pressed={show} aria-label={show ? "Hide password" : "Show password"} disabled={printed}>
                  {show ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password ? <p className="bp__err" id={`${id}-pe`}>{errors.password}</p> : <p className="bp__hint" id={`${id}-ph`}>Any 8+ characters works in this demo — try “wrongpass” to see a refusal.</p>}
            </div>
            {errors.form && <p className="bp__err bp__err--form" id={`${id}-fe`} role="alert">{errors.form}</p>}
            <div className="bp__row">
              <a href="#" className="bp__link" onClick={(e) => e.preventDefault()}>Forgot your passcode?</a>
              <button type="submit" className="bp__board" disabled={stage === "checking" || printed}>
                {stage === "checking" ? "Checking…" : printed ? "Printing…" : "Board"}
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="bp__ok">
            <h2 ref={okRef} tabIndex={-1}>Welcome aboard, {name}.</h2>
            <dl className="bp__info">
              <div><dt>Gate</dt><dd>A4</dd></div>
              <div><dt>Seat</dt><dd>{seat}</dd></div>
              <div><dt>Boarding</dt><dd>Now</dd></div>
            </dl>
            <button type="button" className="bp__link bp__again" onClick={reset}>Sign out</button>
          </div>
        )}

        {/* The stamp: pressed onto the pass when the details don't check out. */}
        {stage === "denied" && (
          <span key={stamp} className="bp__stamp" aria-hidden="true">
            Check details
          </span>
        )}
        <p className="bp__sr" role="status" aria-live="polite">
          {stage === "checking" ? "Checking you in…" : done ? `Signed in. Gate A4, seat ${seat}.` : ""}
        </p>
      </form>

      {/* The stub: perforated, barcoded, and torn away on success. */}
      <aside className="bp__stub" aria-hidden="true">
        <div className="bp__stub-in">
          <p className="bp__stub-k">Passenger</p>
          <p className="bp__stub-v">{email ? name : "—"}</p>
          <div className="bp__stub-grid">
            <span><i>Gate</i>{printed ? "A4" : "—"}</span>
            <span><i>Seat</i>{printed ? seat : "—"}</span>
          </div>
          <div className="bp__code" data-on={printed || undefined}>
            {bars(email).map((w, i) => (
              <span key={i} style={{ width: w * 1.6, ["--i" as string]: i }} />
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
