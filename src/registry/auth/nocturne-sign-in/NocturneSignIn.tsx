"use client";

import { useId, useState, type FormEvent } from "react";
import "./nocturne-sign-in.css";

/**
 * Nocturne Sign-in
 * A single quiet column on near-black. A thin seam of frost light breathes
 * behind the form like a doorway ajar in a dark room. Email + password, a
 * magic-link alternative, inline validation and a reveal toggle — nothing else.
 */

type Props = {
  brand: string;
  onSubmit?: (data: { email: string; password: string }) => void;
  onMagicLink?: (email: string) => void;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function NocturneSignIn({ brand, onSubmit, onMagicLink }: Props) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [status, setStatus] = useState<"idle" | "busy" | "link">("idle");

  const emailErr = touched.email && !EMAIL.test(email) ? "Enter a valid email address." : "";
  const passErr = touched.password && password.length < 8 ? "Use at least 8 characters." : "";

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!EMAIL.test(email) || password.length < 8) return;
    setStatus("busy");
    onSubmit?.({ email, password });
    setTimeout(() => setStatus("idle"), 1400);
  };

  const magic = () => {
    setTouched((t) => ({ ...t, email: true }));
    if (!EMAIL.test(email)) return;
    onMagicLink?.(email);
    setStatus("link");
  };

  return (
    <div className="noc">
      <div className="noc__seam" aria-hidden="true" />
      <div className="noc__stars" aria-hidden="true" />

      <main className="noc__col">
        <p className="noc__brand">{brand}</p>
        <h1 className="noc__title">Welcome back.</h1>
        <p className="noc__sub">Sign in to pick up where you left off.</p>

        <form className="noc__form" onSubmit={submit} noValidate aria-label="Sign in">
          <div className="noc__field" data-invalid={emailErr ? "true" : undefined}>
            <label htmlFor={`${id}-email`}>Email</label>
            <input
              id={`${id}-email`}
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              aria-invalid={!!emailErr}
              aria-describedby={emailErr ? `${id}-email-err` : undefined}
              placeholder="you@example.com"
            />
            {emailErr && (
              <p id={`${id}-email-err`} className="noc__err" role="alert">
                {emailErr}
              </p>
            )}
          </div>

          <div className="noc__field" data-invalid={passErr ? "true" : undefined}>
            <div className="noc__row">
              <label htmlFor={`${id}-pw`}>Password</label>
              <a href="#forgot" className="noc__link">
                Forgot?
              </a>
            </div>
            <div className="noc__pw">
              <input
                id={`${id}-pw`}
                type={show ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                aria-invalid={!!passErr}
                aria-describedby={passErr ? `${id}-pw-err` : undefined}
              />
              <button type="button" className="noc__reveal" onClick={() => setShow((s) => !s)} aria-pressed={show} aria-label={show ? "Hide password" : "Show password"}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                  <path className="noc__slash" d="M4 4l16 16" />
                </svg>
              </button>
            </div>
            {passErr && (
              <p id={`${id}-pw-err`} className="noc__err" role="alert">
                {passErr}
              </p>
            )}
          </div>

          <button type="submit" className="noc__submit" disabled={status === "busy"}>
            <span>{status === "busy" ? "Signing in…" : "Sign in"}</span>
          </button>

          <div className="noc__or" aria-hidden="true">
            <span>or</span>
          </div>

          <button type="button" className="noc__ghost" onClick={magic}>
            {status === "link" ? "Link sent — check your inbox" : "Email me a sign-in link"}
          </button>
          <p className="noc__sr" aria-live="polite">
            {status === "link" ? "A sign-in link has been sent." : ""}
          </p>
        </form>

        <p className="noc__foot">
          New here? <a href="#create">Create an account</a>
        </p>
      </main>
    </div>
  );
}
