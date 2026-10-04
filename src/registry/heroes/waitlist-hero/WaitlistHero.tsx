"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import "./waitlist-hero.css";

/**
 * Waitlist Hero
 * A launch hero whose sign-up works like a ticket dispenser: join, and a
 * numbered stub feeds out of the form with your place in line, the digits
 * rolling to it, and how long the wait really is. The confirmation is the
 * thing you came for, so it's the most designed part of the page.
 */

type Props = {
  eyebrow?: string;
  headline: ReactNode;
  sub?: ReactNode;
  /** People already waiting. */
  ahead: number;
  /** How many are let in each week, used to estimate the wait. */
  perWeek: number;
  /** Called with the email; resolve to the visitor's place in line. Defaults to `ahead + 1` after a short wait. */
  onJoin?: (email: string) => Promise<number>;
  /** Where a shared link points; the visitor's code is appended. */
  shareBase?: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const fmt = (n: number) => n.toLocaleString("en-US");

function Reels({ value, run }: { value: number; run: boolean }) {
  const chars = fmt(value).split("");
  let d = 0;
  return (
    <span className="wlh__reels" aria-hidden="true">
      {chars.map((c, i) =>
        /\d/.test(c) ? (
          <span key={i} className="wlh__reel" style={{ "--d": run ? Number(c) : 0, "--i": d++ } as CSSProperties}>
            {Array.from({ length: 10 }, (_, k) => <span key={k}>{k}</span>)}
          </span>
        ) : (
          <span key={i} className="wlh__comma">{c}</span>
        ),
      )}
    </span>
  );
}

export function WaitlistHero({ eyebrow, headline, sub, ahead, perWeek, onJoin, shareBase = "https://tryvitrine.dev/beta", theme = "night", motion = "full", className = "" }: Props) {
  const uid = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<"idle" | "joining" | "joined">("idle");
  const [place, setPlace] = useState(0);
  const [run, setRun] = useState(false);
  const [copied, setCopied] = useState(false);
  const stub = useRef<HTMLHeadingElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phase !== "joined") return;
    stub.current?.focus({ preventScroll: true });
    const t = setTimeout(() => setRun(true), 380);
    return () => clearTimeout(t);
  }, [phase]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (phase !== "idle") return;
    const v = email.trim();
    if (!v) return setError("Enter your email so we can let you in."), input.current?.focus();
    if (!EMAIL.test(v)) return setError("That doesn't look like an email address. Check for a missing @ or dot."), input.current?.focus();
    setError("");
    setPhase("joining");
    try {
      const n = onJoin ? await onJoin(v) : await new Promise<number>((r) => setTimeout(() => r(ahead + 1), 900));
      setPlace(n);
      setPhase("joined");
    } catch {
      setPhase("idle");
      setError("We couldn't add you just now. Your email is still here; try again in a moment.");
    }
  };

  const weeks = Math.max(1, Math.ceil((place - 1) / perWeek));
  const code = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 10) || "friend";
  const link = `${shareBase}?ref=${code}`;

  const copy = async () => {
    try { await navigator.clipboard.writeText(link); } catch { /* the link is visible to copy by hand */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className={`wlh wlh--${theme} ${className}`} data-motion={motion} data-phase={phase} aria-label="Introduction">
      <div className="wlh__inner">
        {eyebrow && <p className="wlh__eyebrow"><span className="wlh__pip" aria-hidden="true" />{eyebrow}</p>}
        <h1 className="wlh__headline">{headline}</h1>
        {sub && <p className="wlh__sub">{sub}</p>}

        <div className="wlh__dispenser">
          <form className="wlh__form" onSubmit={submit} noValidate>
            <label htmlFor={`${uid}-email`} className="wlh__sr">Work email</label>
            <input
              ref={input}
              id={`${uid}-email`}
              className="wlh__input"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              disabled={phase !== "idle"}
              aria-invalid={!!error || undefined}
              aria-describedby={`${uid}-hint`}
              onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
            />
            <button className="wlh__btn" type="submit" disabled={phase !== "idle"}>
              <span className="wlh__btn-label" data-on={phase === "idle" || undefined}>Join the waitlist</span>
              <span className="wlh__btn-label" data-on={phase === "joining" || undefined} aria-hidden={phase !== "joining"}>Joining…</span>
              <span className="wlh__btn-label" data-on={phase === "joined" || undefined} aria-hidden={phase !== "joined"}>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" /></svg>Joined
              </span>
            </button>
          </form>
          <p id={`${uid}-hint`} className="wlh__hint" data-error={!!error || undefined} aria-live="polite">
            {error || `${fmt(ahead)} people ahead of you · ${fmt(perWeek)} let in every Monday`}
          </p>

          <div className="wlh__slot" aria-hidden={phase !== "joined"}>
            <div className="wlh__ticket" inert={phase !== "joined"}>
              <div className="wlh__ticket-main">
                <h2 ref={stub} tabIndex={-1} className="wlh__place">
                  <span className="wlh__place-label">Your place in line</span>
                  <span className="wlh__number">
                    <span className="wlh__hash" aria-hidden="true">#</span>
                    {place > 0 && <Reels value={place} run={run} />}
                    <span className="wlh__sr">number {fmt(place)}</span>
                  </span>
                </h2>
                <p className="wlh__eta">
                  About {weeks} {weeks === 1 ? "week" : "weeks"} at {fmt(perWeek)} a week. We&rsquo;ll email <strong>{email.trim()}</strong> the day you&rsquo;re in.
                </p>
              </div>
              <div className="wlh__ticket-stub">
                <p className="wlh__stub-label">Move up 100 places</p>
                <p className="wlh__stub-copy">for each friend who joins with your link.</p>
                <button type="button" className="wlh__copy" onClick={copy}>
                  <span className="wlh__link">{link.replace(/^https?:\/\//, "")}</span>
                  <span className="wlh__copy-state" aria-live="polite">{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
