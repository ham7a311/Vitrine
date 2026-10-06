"use client";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { holdLevel, matches, next, secondsLeft, type Event, type Phase } from "./danger";
import "./danger-button.css";

export type DangerButtonProps = {
  /** inline: asks in place; hold: press and hold to confirm; type: type the name to confirm. */
  mode?: "inline" | "hold" | "type";
  /** The verb shown on the button ("Delete project"). */
  label?: string;
  /** What is being removed; typed to confirm in type mode. */
  target: string;
  /** A sentence of consequences for type mode. */
  detail?: string;
  /** Do the work; the button shows progress until it settles. */
  onConfirm?: () => Promise<void> | void;
  onUndo?: () => void;
  /** How long the undo stays offered. */
  undoMs?: number;
  /** How long to hold in hold mode. */
  holdMs?: number;
  /** How long the question waits before cancelling itself in inline mode. */
  askMs?: number;
  /** Return to the start this long after the undo window closes (for demos); omit to stay. */
  resetMs?: number;
  theme?: "light" | "dark";
  className?: string;
};

const Bin = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.5 4.5h11M6 4.5V3h4v1.5M4 4.5l.7 8.5h6.6l.7-8.5M6.6 7v3.6M9.4 7v3.6" /></svg>;
const Tick = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 8.5 3 3 7-7" /></svg>;

/**
 * Danger Button
 * One destructive action with the right amount of friction: ask in place,
 * hold to confirm, or type the name. Then it shows the work, says it's done,
 * and offers a few seconds to take it back.
 */
export function DangerButton({ mode = "inline", label = "Delete project", target, detail, onConfirm, onUndo, undoMs = 5000, holdMs = 1200, askMs = 6000, resetMs, theme = "light", className = "" }: DangerButtonProps) {
  const id = useId();
  const [phase, setPhase] = useState<Phase>("idle");
  const [left, setLeft] = useState(undoMs);
  const [typed, setTyped] = useState("");
  const [level, setLevel] = useState(0);
  const [hint, setHint] = useState("");
  const [say, setSay] = useState("");
  const [paused, setPaused] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const startRef = useRef<HTMLButtonElement>(null);
  const undoRef = useRef<HTMLButtonElement>(null);
  const holding = useRef(false);
  const levelRef = useRef(0);
  const askTimer = useRef(0);
  const send = useCallback((e: Event) => setPhase((p) => next(p, e)), []);

  // Run the work when confirmed.
  useEffect(() => {
    if (phase !== "working") return;
    setSay(`Deleting ${target}`);
    let live = true;
    const min = new Promise((r) => setTimeout(r, 900));
    Promise.all([Promise.resolve(onConfirm?.()), min]).then(() => { if (live) send("finished"); });
    return () => { live = false; };
  }, [phase, onConfirm, send, target]);

  // Done: count the undo window down, then close it.
  useEffect(() => {
    if (phase !== "done") return;
    setSay(`${target} deleted. Undo is available for ${secondsLeft(undoMs)} seconds.`);
    undoRef.current?.focus();
    const t0 = performance.now();
    const iv = setInterval(() => {
      const rem = undoMs - (performance.now() - t0);
      setLeft(rem);
      if (rem <= 0) { clearInterval(iv); send("expire"); }
    }, 100);
    setLeft(undoMs);
    return () => clearInterval(iv);
  }, [phase, undoMs, send, target]);

  useEffect(() => {
    if (phase === "gone") setSay(`${target} deleted`);
    if (phase !== "gone" || resetMs == null) return;
    const t = setTimeout(() => { setTyped(""); send("reset"); }, resetMs);
    return () => clearTimeout(t);
  }, [phase, resetMs, send, target]);

  // Inline: the question takes focus on its safe answer and cancels itself if left alone.
  useEffect(() => {
    if (phase !== "confirm" || mode !== "inline") return;
    cancelRef.current?.focus();
    setSay(`Delete ${target}? Choose Cancel or Delete.`);
    setPaused(false);
    askTimer.current = window.setTimeout(() => send("cancel"), askMs);
    return () => clearTimeout(askTimer.current);
  }, [phase, mode, askMs, send, target]);

  const undo = () => { onUndo?.(); setSay(`${target} restored`); send("undo"); setLevel(0); levelRef.current = 0; requestAnimationFrame(() => startRef.current?.focus()); };
  const cancel = () => { send("cancel"); setSay("Cancelled"); requestAnimationFrame(() => startRef.current?.focus()); };

  // Hold: fill while held, drain when let go, confirm when full.
  const still = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const raf = useRef(0);
  const loop = useCallback(() => {
    let prev = performance.now();
    const tick = (now: number) => {
      const lv = holdLevel(levelRef.current, now - prev, holding.current, holdMs);
      prev = now;
      levelRef.current = lv;
      setLevel(lv);
      if (lv >= 1) { holding.current = false; levelRef.current = 0; setLevel(0); setHint(""); send("confirm"); return void (raf.current = 0); }
      if (lv <= 0 && !holding.current) return void (raf.current = 0);
      raf.current = requestAnimationFrame(tick);
    };
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  }, [holdMs, send]);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  const press = () => { if (phase !== "idle") return; holding.current = true; setHint(""); loop(); };
  const release = () => {
    if (!holding.current) return;
    holding.current = false;
    if (levelRef.current > 0 && levelRef.current < 1) setHint("Keep holding to confirm");
    loop();
  };
  const holdKey = (e: KeyboardEvent, down: boolean) => {
    if (e.key !== " " && e.key !== "Enter") return;
    e.preventDefault();
    if (down && !e.repeat) press();
    if (!down) release();
  };

  const ring = 2 * Math.PI * 7;
  const rest = (
    <>
      {phase === "working" && <span className="dgr__state"><span className="dgr__spin" aria-hidden="true" />Deleting {target}…</span>}
      {phase === "done" && (
        <span className="dgr__state dgr__state--done">
          <span className="dgr__tick"><Tick /></span>
          <span>Deleted <b>{target}</b></span>
          <button ref={undoRef} type="button" className="dgr__undo" onClick={undo}>
            Undo
            <svg viewBox="0 0 18 18" aria-hidden="true" className="dgr__clock">
              <circle cx="9" cy="9" r="7" />
              <circle cx="9" cy="9" r="7" style={{ strokeDasharray: ring, strokeDashoffset: ring * (1 - Math.max(0, left) / undoMs) }} />
            </svg>
            <span className="dgr__sr">, {secondsLeft(left)} seconds left</span>
          </button>
        </span>
      )}
      {phase === "gone" && <span className="dgr__state dgr__state--gone"><Tick /> {target} was deleted</span>}
    </>
  );

  return (
    <div className={`dgr dgr--${theme} dgr--${mode} ${className}`}>
      {mode === "type" ? (
        <section className="dgr__card" aria-labelledby={`${id}-t`}>
          <h3 id={`${id}-t`}>{label}</h3>
          <p>{detail ?? `This removes ${target} and everything in it.`}</p>
          {phase === "idle" || phase === "confirm" ? (
            <form onSubmit={(e) => { e.preventDefault(); if (matches(typed, target)) send("confirm"); }}>
              <label htmlFor={`${id}-i`}>Type <code>{target}</code> to confirm</label>
              <input id={`${id}-i`} value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" autoCapitalize="off" spellCheck={false} aria-describedby={`${id}-h`} />
              <span id={`${id}-h`} className="dgr__sr">The delete button turns on when the name matches exactly.</span>
              <div className="dgr__actions">
                <button type="button" className="dgr__plain" onClick={() => setTyped("")} disabled={!typed}>Cancel</button>
                <button ref={startRef} type="submit" className="dgr__solid" disabled={!matches(typed, target)}><Bin />{label}</button>
              </div>
            </form>
          ) : <div className="dgr__after">{rest}</div>}
        </section>
      ) : phase === "idle" ? (
        mode === "hold" ? (
          <button
            ref={startRef}
            type="button"
            className="dgr__btn dgr__btn--hold"
            data-holding={level > 0 || undefined}
            onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); press(); }}
            onPointerUp={release}
            onPointerCancel={release}
            onKeyDown={(e) => holdKey(e, true)}
            onKeyUp={(e) => holdKey(e, false)}
            onBlur={release}
            onContextMenu={(e) => e.preventDefault()}
            aria-describedby={`${id}-hint`}
          >
            <span className="dgr__face"><Bin />{level > 0 ? "Keep holding…" : `Hold to ${label.toLowerCase()}`}</span>
            {/* The filled part: a red layer with white text, revealed from the left as the hold grows. */}
            <span className="dgr__fill" style={{ clipPath: `inset(0 ${(1 - (still ? (level > 0 ? 1 : 0) : level)) * 100}% 0 0)` }} aria-hidden="true">
              <span className="dgr__face"><Bin />{level > 0 ? "Keep holding…" : `Hold to ${label.toLowerCase()}`}</span>
            </span>
          </button>
        ) : (
          <button ref={startRef} type="button" className="dgr__btn" onClick={() => send("ask")} aria-haspopup="true"><Bin />{label}</button>
        )
      ) : phase === "confirm" && mode === "inline" ? (
        <div className="dgr__ask" role="group" aria-label={`Delete ${target}?`} onKeyDown={(e) => { if (e.key === "Escape") cancel(); }}
          onPointerEnter={() => { clearTimeout(askTimer.current); setPaused(true); }} data-paused={paused || undefined}>
          <span className="dgr__q">Delete <b>{target}</b>?</span>
          <button ref={cancelRef} type="button" className="dgr__plain" onClick={cancel}>Cancel</button>
          <button type="button" className="dgr__solid" onClick={() => send("confirm")}><Bin />Delete</button>
          <span className="dgr__timer" style={{ animationDuration: `${askMs}ms` }} aria-hidden="true" />
        </div>
      ) : rest}
      {mode === "hold" && <span id={`${id}-hint`} className="dgr__hint" aria-live="polite">{phase === "idle" ? hint : ""}</span>}
      <span className="dgr__sr" role="status" aria-live="polite">{say}</span>
    </div>
  );
}
