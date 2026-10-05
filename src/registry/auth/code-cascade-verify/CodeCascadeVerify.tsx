"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import "./code-cascade-verify.css";

/**
 * Code Cascade Verify
 * Six cells for a one-time code. Paste it and the digits drop in one after
 * another; get it wrong and a damped wave runs out along the row from the
 * cell you were typing in; get it right and the digits roll up and away.
 * The resend button counts down as a thin line round its own edge.
 */

type Props = {
  /** Where the code was sent, already masked: "h•••@tryvitrine.dev". */
  sentTo: string;
  length?: number;
  /** Resolve true when the code is right. */
  verify: (code: string) => Promise<boolean>;
  onResend?: () => Promise<void>;
  /** Called once, after `verify` resolves true. */
  onVerified?: (code: string) => void;
  changeEmailHref?: string;
  /** Seconds before another code can be sent. */
  cooldown?: number;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

type Phase = "typing" | "checking" | "wrong" | "ok";

export function CodeCascadeVerify({ sentTo, length = 6, verify, onResend, onVerified, changeEmailHref, cooldown = 30, theme = "night", motion = "full", className = "" }: Props) {
  const uid = useId().replace(/:/g, "");
  const input = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState("");
  // When each digit arrived relative to the last change, so a paste cascades in.
  const [delays, setDelays] = useState<number[]>([]);
  const [phase, setPhase] = useState<Phase>("typing");
  const [origin, setOrigin] = useState(0);
  const [waves, setWaves] = useState(0);
  const [focused, setFocused] = useState(false);
  const [left, setLeft] = useState(cooldown);
  const [sent, setSent] = useState(0);
  const [note, setNote] = useState("");
  const pending = useRef(false);
  const clearTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [resending, setResending] = useState(false);
  useEffect(() => () => clearTimeout(clearTimer.current), []);

  // Resend countdown.
  useEffect(() => {
    setLeft(cooldown);
    const t0 = Date.now();
    const id = setInterval(() => {
      const l = Math.max(0, cooldown - Math.floor((Date.now() - t0) / 1000));
      setLeft(l);
      if (!l) clearInterval(id);
    }, 250);
    return () => clearInterval(id);
  }, [cooldown, sent]);

  const change = (raw: string) => {
    if (phase === "checking" || phase === "ok") return;
    const next = raw.replace(/\D/g, "").slice(0, length);
    const added = next.length - code.length;
    // Keep the delays of digits already there; new ones arrive 70ms apart.
    setDelays(Array.from({ length: next.length }, (_, i) => (i < code.length && next[i] === code[i] ? delays[i] ?? 0 : added > 1 ? (i - code.length) * 70 : 0)));
    setCode(next);
    if (phase === "wrong") setPhase("typing");
    if (next.length === length) check(next, Math.max(0, next.length - 1));
  };

  const check = async (value: string, from: number) => {
    if (pending.current) return;
    pending.current = true;
    clearTimeout(clearTimer.current);
    setPhase("checking");
    setNote("Checking the code…");
    let ok = false;
    try { ok = await verify(value); }
    catch { setPhase("typing"); setCode(""); setNote("We could not verify the code. Please try again."); return; }
    finally { pending.current = false; }
    if (ok) {
      setPhase("ok");
      setNote("Verified. Signing you in.");
      onVerified?.(value);
      return;
    }
    setOrigin(from);
    setWaves((w) => w + 1);
    setPhase("wrong");
    setNote("That code didn't match. Check the latest email — each code works for 10 minutes.");
    clearTimer.current = setTimeout(() => {
      setCode((c) => (c === value ? "" : c));
      setDelays([]);
      input.current?.focus();
    }, 900);
  };

  const resend = async () => {
    if (left > 0 || pending.current || !onResend) return;
    pending.current = true; setResending(true); clearTimeout(clearTimer.current);
    try {
      await onResend();
      setSent((s) => s + 1); setCode(""); setDelays([]); setPhase("typing");
      setNote(`A new code is on its way to ${sentTo}.`);
      input.current?.focus();
    } catch { setNote("A new code could not be sent. Please try again."); }
    finally { pending.current = false; setResending(false); }
  };

  const at = Math.min(code.length, length - 1);
  const p = cooldown > 0 ? left / cooldown : 0;

  return (
    <section className={`ccv ccv--${theme} ${className}`} data-motion={motion} data-phase={phase}>
      <h2 className="ccv__title">Check your email</h2>
      <p className="ccv__sub">Enter the {length}-digit code we sent to <strong>{sentTo}</strong>.</p>

      <div className="ccv__cells" data-wave={phase === "wrong" ? (waves % 2 ? "a" : "b") : undefined}>
        <label className="ccv__sr" htmlFor={`${uid}-code`}>One-time code</label>
        <input
          ref={input}
          id={`${uid}-code`}
          className="ccv__input"
          value={code}
          onChange={(e) => change(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d*"
          maxLength={length}
          aria-describedby={`${uid}-note`}
          aria-invalid={phase === "wrong" || undefined}
          readOnly={phase === "checking" || phase === "ok" || resending}
        />
        {Array.from({ length }, (_, i) => {
          const d = code[i];
          return (
            <span
              key={i}
              className="ccv__cell"
              aria-hidden="true"
              data-filled={d !== undefined || undefined}
              data-active={(focused && phase === "typing" && i === at) || undefined}
              style={{ "--i": i, "--o": Math.abs(i - origin), "--dir": i < origin ? -1 : 1 } as CSSProperties}
            >
              {d !== undefined && <span key={`${i}${d}`} className="ccv__digit" style={{ "--dl": `${delays[i] ?? 0}ms` } as CSSProperties}>{d}</span>}
              {i === at && <span className="ccv__caret" />}
            </span>
          );
        })}
        {phase === "ok" && (
          <span className="ccv__ok" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} /></svg>
            Verified
          </span>
        )}
      </div>

      <p id={`${uid}-note`} className="ccv__note" role={phase === "wrong" ? "alert" : "status"}>
        {note || "The code is in an email from Vitrine. It can take a minute to arrive."}
      </p>

      <div className="ccv__foot">
        {onResend && <button
          type="button"
          disabled={resending || phase === "checking" || phase === "ok"}
          className="ccv__resend"
          onClick={resend}
          aria-disabled={left > 0 || undefined}
          data-ready={left === 0 || undefined}
          style={{ "--p": p } as CSSProperties}
        >
          <span className="ccv__ring" aria-hidden="true" />
          <span>{left > 0 ? `Resend code in 0:${String(left).padStart(2, "0")}` : "Resend code"}</span>
        </button>}
        {changeEmailHref && <a className="ccv__alt" href={changeEmailHref}>Use a different email</a>}
      </div>
    </section>
  );
}
