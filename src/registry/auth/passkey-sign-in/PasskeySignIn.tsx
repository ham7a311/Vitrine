"use client";

import { useState, type CSSProperties } from "react";
import "./passkey-sign-in.css";

/**
 * Passkey Sign-in
 * The fingerprint is the progress indicator. Its ridges are separate paths;
 * while the passkey ceremony runs they draw in from the centre outward, with a
 * soft scan line passing over them. On success the ridges fade as a check
 * draws in their place. On failure they shiver and fade back to faint.
 * Swap `verify` for navigator.credentials.get() in production.
 */

type Phase = "idle" | "scanning" | "ok" | "fail";

type Props = { verify?: () => Promise<boolean>; product?: string; theme?: "night" | "paper"; className?: string };

// concentric, slightly broken arcs — a stylised print, centre first
const RIDGES = [
  "M32 30c1.1 0 2 .9 2 2v6",
  "M28 33.5V32a4 4 0 0 1 8 0v8.5",
  "M24.5 36v-4a7.5 7.5 0 0 1 15 0v3M39.5 39v3.5",
  "M21 38.5V32a11 11 0 0 1 17.6-8.8M42 27a11 11 0 0 1 1 5v9",
  "M18 34v-2a14 14 0 0 1 21.5-11.8M44.8 23.8A14 14 0 0 1 46 32v5",
  "M15.5 29a16.5 16.5 0 0 1 27-11.6M47 22.5A16.5 16.5 0 0 1 48.5 30",
  "M17 20a19 19 0 0 1 30 0",
  "M24 44.5c.8 2.4 2 4.6 3.5 6.5M31 42c.3 3.5 1.4 6.8 3.2 9.6M35.5 45c.6 2 1.4 3.9 2.5 5.6",
];

let tries = 0;
const demoVerify = () => new Promise<boolean>((r) => setTimeout(() => r(++tries !== 1), 2200));

export function PasskeySignIn({ verify = demoVerify, product = "Vitrine", theme = "night", className = "" }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [email, setEmail] = useState(false);

  const start = async () => {
    if (phase === "scanning") return;
    setPhase("scanning");
    const ok = await verify();
    setPhase(ok ? "ok" : "fail");
  };

  const status = {
    idle: "Use Face ID, Touch ID or your security key.",
    scanning: "Waiting for your passkey…",
    ok: "Signed in. Taking you to your workspace.",
    fail: "That didn't go through. Try again, or use email.",
  }[phase];

  return (
    <section className={`passkey-sign-in passkey-sign-in--${theme} ${className}`} data-phase={phase}>
      <button type="button" className="passkey-sign-in__print" onClick={start} aria-label="Sign in with a passkey" disabled={phase === "scanning" || phase === "ok"}>
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <g className="passkey-sign-in__base">
            {RIDGES.map((d, i) => <path key={i} d={d} />)}
          </g>
          <g className="passkey-sign-in__ink">
            {RIDGES.map((d, i) => <path key={i} d={d} pathLength={1} style={{ "--i": i } as CSSProperties} />)}
          </g>
          <path className="passkey-sign-in__check" d="M21 33l7.5 7.5L44 25" pathLength={1} />
        </svg>
        <span className="passkey-sign-in__scan" aria-hidden="true" />
      </button>

      <h2 className="passkey-sign-in__title">{phase === "ok" ? "Welcome back, Hamza" : `Sign in to ${product}`}</h2>
      <p className="passkey-sign-in__status" aria-live="polite">{status}</p>

      <button type="button" className="passkey-sign-in__primary" onClick={start} disabled={phase === "scanning" || phase === "ok"}>
        {phase === "fail" ? "Try again" : phase === "scanning" ? "Verifying…" : phase === "ok" ? "Signed in" : "Continue with passkey"}
      </button>

      <div className="passkey-sign-in__alt" data-open={email || undefined}>
        <button type="button" className="passkey-sign-in__link" onClick={() => setEmail((e) => !e)} aria-expanded={email}>
          {email ? "Hide email sign-in" : "Use email instead"}
        </button>
        <div className="passkey-sign-in__email">
          <div>
            <input type="email" placeholder="you@company.com" aria-label="Email" autoComplete="email" tabIndex={email ? 0 : -1} />
            <button type="button" tabIndex={email ? 0 : -1}>Send link</button>
          </div>
        </div>
      </div>
    </section>
  );
}
