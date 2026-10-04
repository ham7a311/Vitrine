"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import "./envelope-reset.css";

/**
 * Envelope Reset
 * A password reset you can watch leave. Send the link and the form becomes
 * a letter: it slides into an envelope, the flap folds shut, a wax seal
 * presses on and the envelope is gone. When the email arrives the envelope
 * comes back, the seal breaks, and the letter that rises out is the form
 * for your new password.
 */

type Phase = "ask" | "folding" | "sent" | "opening" | "letter" | "done";
type Props = {
  product?: string;
  onSend?: (email: string) => Promise<void>;
  onReset?: (password: string) => Promise<void>;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const COOLDOWN = 30;

export function EnvelopeReset({ product = "Vitrine", onSend = () => wait(500), onReset = () => wait(700), theme = "paper", motion = "full", className = "" }: Props) {
  const id = useId();
  const [phase, setPhase] = useState<Phase>("ask");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [left, setLeft] = useState(0);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [pwErr, setPwErr] = useState("");
  const timers = useRef<number[]>([]);
  const headRef = useRef<HTMLHeadingElement>(null);
  const reduced = () => motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;

  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, reduced() ? 0 : ms)); };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // The resend cooldown.
  useEffect(() => {
    if (left <= 0) return;
    const t = window.setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  // Each new step takes focus at its heading.
  useEffect(() => {
    if (phase === "sent" || phase === "letter" || phase === "done") headRef.current?.focus();
  }, [phase]);

  const send = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!EMAIL.test(email.trim())) { setErr("Enter the email on your account, like hamza@tryvitrine.dev."); return; }
    setErr("");
    setBusy(true);
    try { await onSend(email.trim()); } catch { setErr("We couldn’t send that just now. Try again in a moment."); setBusy(false); return; }
    setBusy(false);
    setPhase("folding");
    setLeft(COOLDOWN);
    later(() => setPhase("sent"), 2150);
  };
  const open = () => {
    setPhase("opening");
    later(() => setPhase("letter"), 1900);
  };

  const rules = [
    { ok: pw.length >= 10, t: "At least 10 characters" },
    { ok: /[\d\W_]/.test(pw), t: "A number or a symbol" },
    { ok: pw.length > 0 && pw === pw2, t: "Both passwords match" },
  ];
  const reset = async (e: FormEvent) => {
    e.preventDefault();
    if (!rules.every((r) => r.ok)) { setPwErr("Check the requirements below."); return; }
    setPwErr("");
    setBusy(true);
    try { await onReset(pw); setPhase("done"); } catch { setPwErr("That didn’t save. Try once more."); }
    setBusy(false);
  };

  const scene = phase === "folding" || phase === "opening";
  const mins = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;

  return (
    <section className={`er er--${theme} ${className}`} data-motion={motion} data-phase={phase} aria-labelledby={`${id}-h`}>
      <div className="er__card">
        {phase === "ask" && (
          <form className="er__step" onSubmit={send} noValidate>
            <p className="er__eyebrow">{product} · account</p>
            <h2 id={`${id}-h`} className="er__h">Forgot your password?</h2>
            <p className="er__p">We’ll send a link to reset it. It works once and lasts an hour.</p>
            <label htmlFor={`${id}-e`} className="er__label">Email</label>
            <input
              id={`${id}-e`}
              className="er__input"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              placeholder="hamza@tryvitrine.dev"
              onChange={(e) => { setEmail(e.target.value); setErr(""); }}
              aria-invalid={!!err}
              aria-describedby={err ? `${id}-ee` : undefined}
            />
            {err && <p id={`${id}-ee`} className="er__err">{err}</p>}
            <button type="submit" className="er__btn" disabled={busy}>{busy ? "Sending…" : "Send reset link"}</button>
            <a href="#" className="er__link" onClick={(e) => e.preventDefault()}>Back to sign in</a>
          </form>
        )}

        {(phase === "sent" || phase === "folding") && (
          <div className="er__step er__sent" aria-hidden={phase === "folding" || undefined}>
            <p className="er__eyebrow">Sent</p>
            <h2 id={`${id}-h`} ref={headRef} tabIndex={-1} className="er__h">Check your inbox</h2>
            <p className="er__p">
              We sent a link to <b>{email.trim()}</b>. If it isn’t there in a minute, look in spam.
            </p>
            <button type="button" className="er__btn" onClick={open}>I’ve got the email</button>
            <button type="button" className="er__link" disabled={left > 0} onClick={() => { setPhase("folding"); setLeft(COOLDOWN); later(() => setPhase("sent"), 2150); }}>
              {left > 0 ? `Resend in ${mins}` : "Resend the link"}
            </button>
          </div>
        )}

        {(phase === "letter" || phase === "opening") && (
          <form className="er__step er__letter" onSubmit={reset} noValidate aria-hidden={phase === "opening" || undefined}>
            <p className="er__eyebrow">Reset · {email.trim() || "your account"}</p>
            <h2 id={`${id}-h`} ref={headRef} tabIndex={-1} className="er__h">Choose a new password</h2>
            <label htmlFor={`${id}-p1`} className="er__label">New password</label>
            <input id={`${id}-p1`} className="er__input" type="password" autoComplete="new-password" value={pw} onChange={(e) => { setPw(e.target.value); setPwErr(""); }} aria-describedby={`${id}-rules`} aria-invalid={!!pwErr} />
            <label htmlFor={`${id}-p2`} className="er__label">Type it again</label>
            <input id={`${id}-p2`} className="er__input" type="password" autoComplete="new-password" value={pw2} onChange={(e) => { setPw2(e.target.value); setPwErr(""); }} aria-describedby={`${id}-rules`} />
            <ul id={`${id}-rules`} className="er__rules">
              {rules.map((r) => (
                <li key={r.t} data-ok={r.ok || undefined}>
                  <svg viewBox="0 0 16 16" aria-hidden="true"><path d={r.ok ? "M3.5 8.5l3 3 6-7" : "M8 8h0"} /></svg>
                  {r.t}
                  <span className="er__sr">{r.ok ? " — done" : " — not yet"}</span>
                </li>
              ))}
            </ul>
            {pwErr && <p className="er__err" role="alert">{pwErr}</p>}
            <button type="submit" className="er__btn" disabled={busy}>{busy ? "Saving…" : "Update password"}</button>
          </form>
        )}

        {phase === "done" && (
          <div className="er__step er__done">
            <span className="er__check" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9" /></svg></span>
            <h2 id={`${id}-h`} ref={headRef} tabIndex={-1} className="er__h">Password updated</h2>
            <p className="er__p">You can sign in with it now. We’ve signed you out everywhere else, just in case.</p>
            <button type="button" className="er__btn" onClick={() => { setPhase("ask"); setPw(""); setPw2(""); }}>Back to sign in</button>
          </div>
        )}
      </div>

      {/* The envelope, only on stage while a letter is going out or coming back. */}
      <div className="er__scene" aria-hidden="true" data-on={scene || undefined}>
        <div className="er__env">
          <div className="er__back" />
          <div className="er__paper">
            <span className="er__paper-h" />
            <span /><span /><span className="er__paper-s" />
          </div>
          <div className="er__front" />
          <div className="er__flap" />
          <div className="er__seal">{product[0]}</div>
        </div>
      </div>
      <p className="er__sr" role="status" aria-live="polite">
        {phase === "folding" ? "Sending your reset link" : phase === "sent" ? `Reset link sent to ${email.trim()}` : phase === "done" ? "Password updated" : ""}
      </p>
    </section>
  );
}
