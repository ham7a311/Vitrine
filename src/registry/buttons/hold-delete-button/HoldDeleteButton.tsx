"use client";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { holdLevel, next, secondsLeft, type Event, type Phase } from "./danger";
import "./hold-delete-button.css";

export type HoldDeleteButtonProps = {
  /** The verb shown on the button ("Delete project"). */
  label?: string;
  /** What is being removed, named in the messages. */
  target: string;
  /** Do the work; the button shows progress until it settles. */
  onConfirm?: () => Promise<void> | void;
  onUndo?: () => void;
  /** How long the undo stays offered. */
  undoMs?: number;
  /** How long to hold. */
  holdMs?: number;
  /** Return to the start this long after the undo window closes (for demos); omit to stay. */
  resetMs?: number;
  theme?: "light" | "dark";
  className?: string;
};

const Bin = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.5 4.5h11M6 4.5V3h4v1.5M4 4.5l.7 8.5h6.6l.7-8.5M6.6 7v3.6M9.4 7v3.6" /></svg>;
const Tick = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 8.5 3 3 7-7" /></svg>;

// What happens after confirming: the work, the "deleted" message with an undo window, then gone.
function useRemoval({ target, onConfirm, onUndo, undoMs, resetMs, onReset }: { target: string; onConfirm?: () => Promise<void> | void; onUndo?: () => void; undoMs: number; resetMs?: number; onReset?: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [left, setLeft] = useState(undoMs);
  const [say, setSay] = useState("");
  const undoRef = useRef<HTMLButtonElement>(null);
  const send = useCallback((e: Event) => setPhase((p) => next(p, e)), []);

  // Run the work when confirmed, for at least 0.9s so it never flashes.
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
    const t = setTimeout(() => { onReset?.(); send("reset"); }, resetMs);
    return () => clearTimeout(t);
  }, [phase, resetMs, send, target, onReset]);

  const undo = () => { onUndo?.(); setSay(`${target} restored`); send("undo"); };
  return { phase, send, left, say, setSay, undoRef, undo };
}

function Aftermath({ phase, target, left, undoMs, undoRef, onUndo }: { phase: Phase; target: string; left: number; undoMs: number; undoRef: RefObject<HTMLButtonElement | null>; onUndo: () => void }) {
  const ring = 2 * Math.PI * 7;
  if (phase === "working") return <span className="hdlb__state"><span className="hdlb__spin" aria-hidden="true" />Deleting {target}…</span>;
  if (phase === "done") {
    return (
      <span className="hdlb__state hdlb__state--done">
        <span className="hdlb__tick"><Tick /></span>
        <span>Deleted <b>{target}</b></span>
        <button ref={undoRef} type="button" className="hdlb__undo" onClick={onUndo}>
          Undo
          <svg viewBox="0 0 18 18" aria-hidden="true" className="hdlb__clock">
            <circle cx="9" cy="9" r="7" />
            <circle cx="9" cy="9" r="7" style={{ strokeDasharray: ring, strokeDashoffset: ring * (1 - Math.max(0, left) / undoMs) }} />
          </svg>
          <span className="hdlb__sr">, {secondsLeft(left)} seconds left</span>
        </button>
      </span>
    );
  }
  if (phase === "gone") return <span className="hdlb__state hdlb__state--gone"><Tick /> {target} was deleted</span>;
  return null;
}

/**
 * Hold to Delete
 * No dialog: the button itself is the confirmation. A red fill grows while it
 * is held and drains when you let go; only a full hold deletes. Then it shows
 * the work, says it's done, and offers a few seconds to take it back.
 */
export function HoldDeleteButton({ label = "Delete project", target, onConfirm, onUndo, undoMs = 5000, holdMs = 1200, resetMs, theme = "light", className = "" }: HoldDeleteButtonProps) {
  const id = useId();
  const { phase, send, left, say, setSay, undoRef, undo } = useRemoval({ target, onConfirm, onUndo, undoMs, resetMs });
  const startRef = useRef<HTMLButtonElement>(null);
  const holding = useRef(false);
  const levelRef = useRef(0);
  const raf = useRef(0);
  const [level, setLevel] = useState(0);
  const [hint, setHint] = useState("");
  // Under reduced motion the fill is simply on while held, not a gradual sweep.
  const [still, setStill] = useState(false);
  useEffect(() => setStill(matchMedia("(prefers-reduced-motion: reduce)").matches), []);

  // Fill while held, drain when let go, confirm when full.
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
  const key = (e: KeyboardEvent, down: boolean) => {
    if (e.key !== " " && e.key !== "Enter") return;
    e.preventDefault();
    if (down && !e.repeat) press();
    if (!down) release();
  };
  const restore = () => { undo(); setLevel(0); levelRef.current = 0; requestAnimationFrame(() => startRef.current?.focus()); };
  const text = level > 0 ? "Keep holding…" : `Hold to ${label.toLowerCase()}`;

  return (
    <div className={`hdlb ${theme === "dark" ? "hdlb--dark" : ""} ${className}`}>
      {phase === "idle" ? (
        <button
          ref={startRef}
          type="button"
          className="hdlb__btn"
          data-holding={level > 0 || undefined}
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); press(); }}
          onPointerUp={release}
          onPointerCancel={release}
          onKeyDown={(e) => key(e, true)}
          onKeyUp={(e) => key(e, false)}
          onBlur={release}
          onContextMenu={(e) => e.preventDefault()}
          aria-describedby={`${id}-hint`}
        >
          <span className="hdlb__face"><Bin />{text}</span>
          {/* The filled part: a red layer with white text, revealed from the left as the hold grows. */}
          <span className="hdlb__fill" style={{ clipPath: `inset(0 ${(1 - (still ? (level > 0 ? 1 : 0) : level)) * 100}% 0 0)` }} aria-hidden="true">
            <span className="hdlb__face"><Bin />{text}</span>
          </span>
        </button>
      ) : <Aftermath phase={phase} target={target} left={left} undoMs={undoMs} undoRef={undoRef} onUndo={restore} />}
      <span id={`${id}-hint`} className="hdlb__hint" aria-live="polite">{phase === "idle" ? hint : ""}</span>
      <span className="hdlb__sr" role="status" aria-live="polite">{say}</span>
    </div>
  );
}
