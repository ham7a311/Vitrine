"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import "./number-match-sign-in.css";

/**
 * Number Match Sign-in
 * Two-step sign-in by number matching, with both screens in view. The
 * laptop shows a number; a moment later the phone beside it lights up with
 * a request and three numbers to choose from. Pick the one on the laptop
 * and a pulse travels from the phone to the screen and you're in; pick the
 * wrong one and a new number is issued. The request expires on a ring.
 */

type Props = {
  product?: string;
  device?: string;
  place?: string;
  /** Seconds before a request expires. */
  ttl?: number;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

type State = "waiting" | "asked" | "approved" | "wrong" | "denied" | "expired";

const pick3 = (n: number) => {
  const set = new Set([n]);
  while (set.size < 3) set.add(10 + Math.floor(Math.random() * 89));
  return [...set].sort(() => Math.random() - 0.5);
};

export function NumberMatchSignIn({ product = "Vitrine", device = "MacBook Air", place = "Muscat, OM", ttl = 60, theme = "paper", motion = "full", className = "" }: Props) {
  const id = useId();
  const [num, setNum] = useState(47);
  const [opts, setOpts] = useState<number[]>([83, 47, 12]);
  const [state, setState] = useState<State>("waiting");
  const [left, setLeft] = useState(ttl);
  const [tries, setTries] = useState(0);
  const [wrongPick, setWrongPick] = useState<number | null>(null);
  const timers = useRef<number[]>([]);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const reduced = () => motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };

  /** Issue a fresh request: new number, new choices, full clock; the phone rings a beat later. */
  const issue = useCallback((first = false) => {
    const n = first ? 47 : 10 + Math.floor(Math.random() * 89);
    setNum(n);
    setOpts(first ? [83, 47, 12] : pick3(n));
    setLeft(ttl);
    setWrongPick(null);
    setState("waiting");
    timers.current.push(window.setTimeout(() => setState("asked"), first ? 1200 : 900));
  }, [ttl]);

  useEffect(() => {
    issue(true);
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, [issue]);

  // The request clock runs while it's open.
  useEffect(() => {
    if (state !== "asked" && state !== "waiting" && state !== "wrong") return;
    if (left <= 0) { setState("expired"); return; }
    const t = window.setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left, state]);

  useEffect(() => {
    if (state === "approved" || state === "denied" || state === "expired") resultRef.current?.focus();
  }, [state]);

  const choose = (n: number) => {
    if (state !== "asked") return;
    if (n === num) { setState("approved"); return; }
    setWrongPick(n);
    setTries((t) => t + 1);
    setState("wrong");
    later(() => issue(), reduced() ? 300 : 1400);
  };

  const ring = Math.max(0, left / ttl);
  const done = state === "approved";
  const end = state === "denied" || state === "expired";

  return (
    <section className={`nm nm--${theme} ${className}`} data-motion={motion} data-state={state} aria-labelledby={`${id}-h`}>
      {/* The screen you're signing in on */}
      <div className="nm__screen">
        <p className="nm__brand"><span aria-hidden="true">◆</span> {product}</p>
        {!done && !end && (
          <div className="nm__step">
            <h2 id={`${id}-h`} className="nm__h">Approve on your phone</h2>
            <p className="nm__p">Open the {product} notification and tap this number.</p>
            <div className="nm__num-wrap">
              <svg viewBox="0 0 120 120" className="nm__ring" aria-hidden="true">
                <circle cx="60" cy="60" r="54" className="nm__ring-bg" />
                <circle cx="60" cy="60" r="54" className="nm__ring-fg" pathLength={1} style={{ strokeDashoffset: 1 - ring }} />
              </svg>
              <span key={num} className="nm__num" aria-live="polite" aria-atomic="true">
                <span className="nm__sr">Your number is </span>{num}
              </span>
            </div>
            <p className="nm__meta" aria-live="polite">
              {state === "wrong" ? "That didn’t match — here’s a new number." : `Expires in ${left}s`}
            </p>
            <button type="button" className="nm__link" onClick={() => setState("denied")}>Use another way to sign in</button>
          </div>
        )}
        {done && (
          <div className="nm__step nm__result">
            <span className="nm__tick" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9" /></svg></span>
            <h2 id={`${id}-h`} ref={resultRef} tabIndex={-1} className="nm__h">Signed in</h2>
            <p className="nm__p">Approved from your phone{tries ? ` after ${tries} retr${tries > 1 ? "ies" : "y"}` : ""}. Welcome back.</p>
            <button type="button" className="nm__btn" onClick={() => { setTries(0); issue(true); }}>Sign out</button>
          </div>
        )}
        {end && (
          <div className="nm__step nm__result">
            <h2 id={`${id}-h`} ref={resultRef} tabIndex={-1} className="nm__h">{state === "expired" ? "Request expired" : "Sign-in stopped"}</h2>
            <p className="nm__p">{state === "expired" ? "Nothing was approved in time. Send a new request when your phone is with you." : "No one is signed in. If this wasn’t you, change your password."}</p>
            <button type="button" className="nm__btn" onClick={() => issue()}>Send a new request</button>
          </div>
        )}
      </div>

      {/* The pulse that crosses from the phone when you approve */}
      <div className="nm__beam" aria-hidden="true"><span /></div>

      {/* The phone in your hand */}
      <div className="nm__phone" role="group" aria-label="Your phone (demo)">
        <div className="nm__glass">
          <div className="nm__island" aria-hidden="true" />
          <p className="nm__clock" aria-hidden="true">9:41</p>
          <div className="nm__note" data-on={state === "asked" || state === "wrong" || undefined} aria-hidden={!(state === "asked" || state === "wrong")}>
            <p className="nm__note-top"><span className="nm__app" aria-hidden="true">◆</span> {product} <span className="nm__now">now</span></p>
            <p className="nm__note-h">Are you trying to sign in?</p>
            <p className="nm__note-p">{device} · {place}</p>
            <p className="nm__note-ask">Tap the number on your screen</p>
            <div className="nm__opts">
              {opts.map((o) => (
                <button
                  key={o}
                  type="button"
                  className="nm__opt"
                  data-wrong={wrongPick === o || undefined}
                  onClick={() => choose(o)}
                  disabled={state !== "asked"}
                  tabIndex={state === "asked" ? 0 : -1}
                >
                  {o}
                </button>
              ))}
            </div>
            <button type="button" className="nm__deny" onClick={() => setState("denied")} disabled={state !== "asked"} tabIndex={state === "asked" ? 0 : -1}>
              No, it’s not me
            </button>
          </div>
          <div className="nm__ok" data-on={done || undefined} aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9" /></svg>
            Approved
          </div>
        </div>
      </div>
    </section>
  );
}
