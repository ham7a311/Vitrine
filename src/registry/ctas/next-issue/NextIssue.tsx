"use client";

import { useId, useState, type FormEvent } from "react";
import "./next-issue.css";

/**
 * Next Issue
 * A newsletter sign-up that shows what you'd be signing up for. The last issues
 * sit in a ruled list with their real subject lines and dates, and at the head of
 * it is an empty dashed slot for the next one. Subscribing fills that slot
 * with your name on it.
 */

export type Issue = { no: number; /** ISO date */ date: string; subject: string };

type Props = {
  title: string;
  /** One honest sentence about what it is and how often. */
  blurb: string;
  /** Most recent first. Show three or four. */
  issues: Issue[];
  /** The next issue: its number and the date it will be sent. */
  next: { no: number; date: string };
  /** May return a promise; throw to show the failure. */
  onSubscribe: (email: string) => void | Promise<void>;
  /** What the button says. Say what it does. */
  action?: string;
  theme?: "paper" | "night";
  motion?: "auto" | "reduced";
  className?: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const short = (iso: string) => new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const long = (iso: string) => new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
const pad = (n: number) => String(n).padStart(3, "0");

export function NextIssue({ title, blurb, issues, next, onSubscribe, action = "Send me the next issue", theme = "paper", motion = "auto", className = "" }: Props) {
  const uid = useId();
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (phase !== "idle") return;
    if (!EMAIL.test(email.trim())) return setError("That doesn't look like an address I can write to.");
    setError("");
    setPhase("sending");
    try {
      await onSubscribe(email.trim());
      setPhase("done");
    } catch {
      setError("That didn't go through. Nothing was saved; please try again.");
      setPhase("idle");
    }
  };

  return (
    <section
      className={`next-issue next-issue--${theme} ${className}`}
      data-phase={phase}
      data-motion={motion === "reduced" ? "reduced" : undefined}
      aria-labelledby={`${uid}-t`}
    >
      <div className="next-issue__grid">
      <div className="next-issue__ask">
        <h2 id={`${uid}-t`} className="next-issue__title">{title}</h2>
        <p className="next-issue__blurb">{blurb}</p>

        {phase !== "done" ? (
          <form className="next-issue__form" onSubmit={submit} noValidate>
            <label htmlFor={`${uid}-e`} className="next-issue__label">Email</label>
            <div className="next-issue__row" data-invalid={error ? "" : undefined}>
              <input id={`${uid}-e`} type="email" autoComplete="email" inputMode="email" placeholder="you@company.com" value={email} aria-invalid={!!error} aria-describedby={error ? `${uid}-err` : undefined} onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }} />
              <button type="submit" disabled={phase === "sending"} aria-busy={phase === "sending" || undefined}>{phase === "sending" ? "Adding" : action}</button>
            </div>
            {error && <p id={`${uid}-err`} className="next-issue__error" role="alert">{error}</p>}
          </form>
        ) : (
          <p className="next-issue__done">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 4.8" /></svg>
            <span>
              No. {pad(next.no)} will reach <b>{email.trim()}</b> on {long(next.date)}.{" "}
              <button type="button" onClick={() => { setPhase("idle"); setEmail(""); }}>Use another address</button>
            </span>
          </p>
        )}
      </div>

      <div className="next-issue__proof">
        <p className="next-issue__cap">Recent issues</p>
        <ol className="next-issue__list" aria-label="Recent issues">
          <li className="next-issue__slot" data-filled={phase === "done" || undefined}>
            <span className="next-issue__no">No. {pad(next.no)}</span>
            <span className="next-issue__subject">
              <span className="next-issue__empty">Not written yet. Yours, if you sign up.</span>
              <span className="next-issue__yours">On its way to you</span>
            </span>
            <time className="next-issue__date" dateTime={next.date}>{short(next.date)}</time>
          </li>
          {issues.map((i) => (
            <li key={i.no}>
              <span className="next-issue__no">No. {pad(i.no)}</span>
              <span className="next-issue__subject">{i.subject}</span>
              <time className="next-issue__date" dateTime={i.date}>{short(i.date)}</time>
            </li>
          ))}
        </ol>
      </div>
      </div>
      <p className="next-issue__sr" role="status">{phase === "done" ? `Subscribed. Issue ${next.no} will be sent on ${long(next.date)}.` : ""}</p>
    </section>
  );
}
