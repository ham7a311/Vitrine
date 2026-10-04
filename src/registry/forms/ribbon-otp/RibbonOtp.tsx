"use client";

import { useEffect, useId, useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import "./ribbon-otp.css";

/**
 * Ribbon OTP
 * A one-time-code input as a single ribbon divided into cells. A frost cursor
 * travels between cells, digits drop in with a small settle, and completing
 * the code sweeps a light along the whole ribbon.
 */

type Props = {
  length?: number;
  onComplete?: (code: string) => void;
  /** Return true if the code is correct — drives the success / error state. */
  verify?: (code: string) => boolean | Promise<boolean>;
  label?: string;
};

export function RibbonOtp({ length = 6, onComplete, verify, label = "Verification code" }: Props) {
  const id = useId();
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [vals, setVals] = useState<string[]>(() => Array(length).fill(""));
  const [state, setState] = useState<"idle" | "ok" | "bad">("idle");

  const focusAt = (i: number) => refs.current[Math.max(0, Math.min(length - 1, i))]?.focus();

  useEffect(() => {
    const code = vals.join("");
    if (code.length !== length || vals.some((v) => !v)) return setState("idle");
    onComplete?.(code);
    if (!verify) return setState("ok");
    Promise.resolve(verify(code)).then((ok) => {
      setState(ok ? "ok" : "bad");
      if (!ok) setTimeout(() => { setVals(Array(length).fill("")); setState("idle"); focusAt(0); }, 700);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vals]);

  const set = (i: number, v: string) => setVals((a) => a.map((x, j) => (j === i ? v : x)));

  const onKey = (i: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (vals[i]) set(i, "");
      else { set(Math.max(0, i - 1), ""); focusAt(i - 1); }
    } else if (e.key === "ArrowLeft") { e.preventDefault(); focusAt(i - 1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); focusAt(i + 1); }
  };

  const onInput = (i: number, raw: string) => {
    const d = raw.replace(/\D/g, "");
    if (!d) return;
    set(i, d[d.length - 1]);
    focusAt(i + 1);
  };

  const onPaste = (e: ClipboardEvent) => {
    const d = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!d) return;
    e.preventDefault();
    setVals(Array.from({ length }, (_, i) => d[i] ?? ""));
    focusAt(Math.min(d.length, length - 1));
  };

  return (
    <div className="otp" data-state={state} role="group" aria-labelledby={`${id}-l`}>
      <p id={`${id}-l`} className="otp__label">{label}</p>
      <div className="otp__ribbon" onPaste={onPaste}>
        {vals.map((v, i) => (
          <input
            key={i}
            ref={(el) => void (refs.current[i] = el)}
            className="otp__cell"
            style={{ ["--i" as string]: i }}
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            maxLength={2}
            value={v}
            aria-label={`Digit ${i + 1} of ${length}`}
            data-filled={v ? "" : undefined}
            onChange={(e) => onInput(i, e.target.value)}
            onKeyDown={onKey(i)}
            onFocus={(e) => e.target.select()}
          />
        ))}
        <span className="otp__sweep" aria-hidden="true" />
      </div>
      <p className="otp__status" aria-live="polite">
        {state === "ok" ? "Code accepted." : state === "bad" ? "That code didn’t match — try again." : ""}
      </p>
    </div>
  );
}
