"use client";
import { useEffect, useRef, useState, useCallback, type RefObject } from "react";
import { next, secondsLeft, type Event, type Phase } from "./danger";
import "./danger-button.css";

export type DangerButtonProps = {
  /** The verb shown on the button ("Delete project"). */
  label?: string;
  /** What is being removed, named in the question and the messages. */
  target: string;
  /** Do the work; the button shows progress until it settles. */
  onConfirm?: () => Promise<void> | void;
  onUndo?: () => void;
  /** How long the undo stays offered. */
  undoMs?: number;
  /** How long the question waits before cancelling itself. */
  askMs?: number;
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
  if (phase === "working") return <span className="dgr__state"><span className="dgr__spin" aria-hidden="true" />Deleting {target}…</span>;
  if (phase === "done") {
    return (
      <span className="dgr__state dgr__state--done">
        <span className="dgr__tick"><Tick /></span>
        <span>Deleted <b>{target}</b></span>
        <button ref={undoRef} type="button" className="dgr__undo" onClick={onUndo}>
          Undo
          <svg viewBox="0 0 18 18" aria-hidden="true" className="dgr__clock">
            <circle cx="9" cy="9" r="7" />
            <circle cx="9" cy="9" r="7" style={{ strokeDasharray: ring, strokeDashoffset: ring * (1 - Math.max(0, left) / undoMs) }} />
          </svg>
          <span className="dgr__sr">, {secondsLeft(left)} seconds left</span>
        </button>
      </span>
    );
  }
  if (phase === "gone") return <span className="dgr__state dgr__state--gone"><Tick /> {target} was deleted</span>;
  return null;
}

/**
 * Danger Button
 * A destructive action that asks in place: the button opens into a short
 * question with a safe Cancel and a red Delete, then shows the work, says
 * it's done, and offers a few seconds to take it back.
 */
export function DangerButton({ label = "Delete project", target, onConfirm, onUndo, undoMs = 5000, askMs = 6000, resetMs, theme = "light", className = "" }: DangerButtonProps) {
  const { phase, send, left, say, setSay, undoRef, undo } = useRemoval({ target, onConfirm, onUndo, undoMs, resetMs });
  const cancelRef = useRef<HTMLButtonElement>(null);
  const startRef = useRef<HTMLButtonElement>(null);
  const askTimer = useRef(0);
  const [paused, setPaused] = useState(false);

  // The question takes focus on its safe answer and cancels itself if left alone.
  useEffect(() => {
    if (phase !== "confirm") return;
    cancelRef.current?.focus();
    setSay(`Delete ${target}? Choose Cancel or Delete.`);
    setPaused(false);
    askTimer.current = window.setTimeout(() => send("cancel"), askMs);
    return () => clearTimeout(askTimer.current);
  }, [phase, askMs, send, target, setSay]);

  // Focus returns to the button whenever the question closes.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (phase === "confirm") wasOpen.current = true;
    else if (phase === "idle" && wasOpen.current) { wasOpen.current = false; startRef.current?.focus(); }
  }, [phase]);
  const cancel = useCallback(() => { send("cancel"); setSay("Cancelled"); }, [send, setSay]);

  return (
    <div className={`dgr ${theme === "dark" ? "dgr--dark" : ""} ${className}`}>
      {phase === "idle" ? (
        <button ref={startRef} type="button" className="dgr__btn" onClick={() => send("ask")} aria-haspopup="true"><Bin />{label}</button>
      ) : phase === "confirm" ? (
        <div className="dgr__ask" role="group" aria-label={`Delete ${target}?`} onKeyDown={(e) => { if (e.key === "Escape") cancel(); }}
          onPointerEnter={() => { clearTimeout(askTimer.current); setPaused(true); }} data-paused={paused || undefined}>
          <span className="dgr__q">Delete <b>{target}</b>?</span>
          <button ref={cancelRef} type="button" className="dgr__plain" onClick={cancel}>Cancel</button>
          <button type="button" className="dgr__solid" onClick={() => send("confirm")}><Bin />Delete</button>
          <span className="dgr__timer" style={{ animationDuration: `${askMs}ms` }} aria-hidden="true" />
        </div>
      ) : <Aftermath phase={phase} target={target} left={left} undoMs={undoMs} undoRef={undoRef} onUndo={undo} />}
      <span className="dgr__sr" role="status" aria-live="polite">{say}</span>
    </div>
  );
}
