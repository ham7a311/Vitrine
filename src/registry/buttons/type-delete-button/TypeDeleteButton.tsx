"use client";
import { useCallback, useEffect, useId, useRef, useState, type RefObject } from "react";
import { matches, next, secondsLeft, type Event, type Phase } from "./danger";
import "./type-delete-button.css";

export type TypeDeleteButtonProps = {
  /** The action's title ("Delete this project"). */
  label?: string;
  /** What is being removed; typed to confirm. */
  target: string;
  /** A sentence about what will be lost. */
  detail?: string;
  /** Do the work; the card shows progress until it settles. */
  onConfirm?: () => Promise<void> | void;
  onUndo?: () => void;
  /** How long the undo stays offered. */
  undoMs?: number;
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
  if (phase === "working") return <span className="tdlb__state"><span className="tdlb__spin" aria-hidden="true" />Deleting {target}…</span>;
  if (phase === "done") {
    return (
      <span className="tdlb__state tdlb__state--done">
        <span className="tdlb__tick"><Tick /></span>
        <span>Deleted <b>{target}</b></span>
        <button ref={undoRef} type="button" className="tdlb__undo" onClick={onUndo}>
          Undo
          <svg viewBox="0 0 18 18" aria-hidden="true" className="tdlb__clock">
            <circle cx="9" cy="9" r="7" />
            <circle cx="9" cy="9" r="7" style={{ strokeDasharray: ring, strokeDashoffset: ring * (1 - Math.max(0, left) / undoMs) }} />
          </svg>
          <span className="tdlb__sr">, {secondsLeft(left)} seconds left</span>
        </button>
      </span>
    );
  }
  if (phase === "gone") return <span className="tdlb__state tdlb__state--gone"><Tick /> {target} was deleted</span>;
  return null;
}

/**
 * Type to Delete
 * A danger-zone card for the things you can't take lightly: the delete button
 * stays off until you type the exact name. Then it shows the work, says it's
 * done, and offers a few seconds to take it back.
 */
export function TypeDeleteButton({ label = "Delete this project", target, detail, onConfirm, onUndo, undoMs = 5000, resetMs, theme = "light", className = "" }: TypeDeleteButtonProps) {
  const id = useId();
  const [typed, setTyped] = useState("");
  const reset = useCallback(() => setTyped(""), []);
  const { phase, send, left, say, undoRef, undo } = useRemoval({ target, onConfirm, onUndo, undoMs, resetMs, onReset: reset });
  const fieldRef = useRef<HTMLInputElement>(null);
  const restore = () => { undo(); requestAnimationFrame(() => fieldRef.current?.focus()); };

  return (
    <div className={`tdlb ${theme === "dark" ? "tdlb--dark" : ""} ${className}`}>
      <section className="tdlb__card" aria-labelledby={`${id}-t`}>
        <h3 id={`${id}-t`}>{label}</h3>
        <p>{detail ?? `This removes ${target} and everything in it.`}</p>
        {phase === "idle" ? (
          <form onSubmit={(e) => { e.preventDefault(); if (matches(typed, target)) send("confirm"); }}>
            <label htmlFor={`${id}-i`}>Type <code>{target}</code> to confirm</label>
            <input ref={fieldRef} id={`${id}-i`} value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" autoCapitalize="off" spellCheck={false} aria-describedby={`${id}-h`} />
            <span id={`${id}-h`} className="tdlb__sr">The delete button turns on when the name matches exactly.</span>
            <div className="tdlb__actions">
              <button type="button" className="tdlb__plain" onClick={() => setTyped("")} disabled={!typed}>Cancel</button>
              <button type="submit" className="tdlb__solid" disabled={!matches(typed, target)}><Bin />{label}</button>
            </div>
          </form>
        ) : <div className="tdlb__after"><Aftermath phase={phase} target={target} left={left} undoMs={undoMs} undoRef={undoRef} onUndo={restore} /></div>}
      </section>
      <span className="tdlb__sr" role="status" aria-live="polite">{say}</span>
    </div>
  );
}
