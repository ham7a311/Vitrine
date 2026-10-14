"use client";
import { useEffect, useId, useRef, useState } from "react";
import { arrivals, caret, clean } from "./code";
import "./tumbler-code.css";

export type TumblerResult = { ok: true } | { ok: false; reason?: string; /** The slot that's wrong, if the host knows. */ at?: number };

export type TumblerCodeProps = {
  length?: number;
  label?: string;
  /** Checks a complete code. */
  onComplete?: (code: string) => Promise<TumblerResult>;
  theme?: "night" | "paper";
  className?: string;
};

/**
 * Tumbler Code
 * A one-time code input built like a lock: each digit drops into its slot like a tumbler pin
 * setting, a caret slides between slots, a paste fills them in a quick ripple, and a right code
 * locks the row. A wrong one shakes only the slot that's wrong, when the host can say which.
 */
export function TumblerCode({ length = 6, label = "Verification code", onComplete, theme = "night", className = "" }: TumblerCodeProps) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [fresh, setFresh] = useState<{ slots: number[]; batch: boolean; n: number }>({ slots: [], batch: false, n: 0 });
  const [focused, setFocused] = useState(false);
  const [state, setState] = useState<"idle" | "checking" | "ok" | "error">("idle");
  const [wrong, setWrong] = useState<number | null>(null);
  const [msg, setMsg] = useState("");

  const update = (raw: string) => {
    if (state === "checking" || state === "ok") return;
    const next = clean(raw, length);
    const changed = arrivals(value, next);
    setFresh((f) => ({ slots: changed, batch: changed.length > 1, n: f.n + 1 }));
    setValue(next);
    if (state === "error") { setState("idle"); setWrong(null); setMsg(""); }
  };

  useEffect(() => {
    if (value.length !== length || state !== "idle") return;
    let live = true;
    setState("checking"); setMsg("Checking…");
    (onComplete?.(value) ?? Promise.resolve<TumblerResult>({ ok: true })).then((r) => {
      if (!live) return;
      if (r.ok) { setState("ok"); setMsg("Code accepted."); input.current?.blur(); }
      else {
        setState("error"); setWrong(r.at ?? null); setMsg(r.reason ?? "That code didn't work. Try again.");
        // clear from the wrong slot (or everything) so the next try starts in the right place
        window.setTimeout(() => { if (live) { setValue((v) => (r.at !== undefined ? v.slice(0, r.at) : "")); input.current?.focus(); } }, 650);
      }
    }).catch(() => { if (live) { setState("error"); setMsg("Couldn't check the code. Try again."); } });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const at = caret(value, length);
  return (
    <div className={`tumb tumb--${theme} ${className}`} data-state={state}>
      <label htmlFor={`${id}-in`} className="tumb__label">{label}</label>
      <div className="tumb__row" onClick={() => input.current?.focus()}>
        <input
          ref={input}
          id={`${id}-in`}
          className="tumb__input"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={length}
          value={value}
          aria-describedby={`${id}-msg`}
          aria-invalid={state === "error" || undefined}
          readOnly={state === "checking" || state === "ok"}
          onChange={(e) => update(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {Array.from({ length }, (_, i) => {
          const ch = value[i];
          const arriving = fresh.slots.includes(i);
          return (
            <span key={i} className={`tumb__slot ${ch ? "tumb__slot--set" : ""} ${wrong === i || (state === "error" && wrong === null) ? "tumb__slot--wrong" : ""} ${focused && i === at && state !== "ok" ? "tumb__slot--active" : ""}`} aria-hidden="true">
              {ch && <span key={`${fresh.n}-${i}-${ch}`} className={`tumb__digit ${arriving ? "tumb__digit--in" : ""}`} style={{ animationDelay: arriving && fresh.batch ? `${fresh.slots.indexOf(i) * 45}ms` : "0ms" }}>{ch}</span>}
              <i className="tumb__pin" />
            </span>
          );
        })}
        <span className="tumb__caret" aria-hidden="true" style={{ ["--tumb-at" as string]: at, ["--tumb-n" as string]: length, opacity: focused && state !== "ok" && state !== "checking" ? 1 : 0 }} />
        <span className="tumb__lock" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="10" rx="2.5" /><path className="tumb__shackle" d="M8 11V7.5a4 4 0 0 1 8 0V11" /></svg>
        </span>
      </div>
      <p id={`${id}-msg`} className="tumb__msg" role="status">{msg}</p>
    </div>
  );
}

export default TumblerCode;
