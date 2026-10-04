"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import "./wet-ink.css";

/**
 * Wet Ink
 * Autosave you can see. Text written since the last confirmed save is wet ink,
 * a little bluer and glossy. When the server confirms, it dries, in the order it
 * was written. Whatever failed to save stays wet, so what is at risk is never a
 * guess. The status line always says the same thing in words.
 */

type Span = { s: number; e: number; rev: number; at: number; failed?: boolean };
type Drying = { s: number; e: number; rank: number };

type Props = {
  value: string;
  onChange?: (value: string) => void;
  /** Persist the text. Resolve to dry the ink; throw to keep it wet. */
  save: (value: string) => Promise<void>;
  label: string;
  /** Wait after the last keystroke before saving. */
  delay?: number;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  rows?: number;
};

/** Apply an edit (common prefix / suffix diff) to the wet spans. */
function rebase(spans: Span[], before: string, after: string, rev: number, at: number): Span[] {
  let p = 0;
  const max = Math.min(before.length, after.length);
  while (p < max && before[p] === after[p]) p++;
  let q = 0;
  while (q < max - p && before[before.length - 1 - q] === after[after.length - 1 - q]) q++;
  const removedEnd = before.length - q; // old range [p, removedEnd) replaced
  const inserted = after.length - q - p;
  const delta = after.length - before.length;
  const out: Span[] = [];
  for (const sp of spans) {
    if (sp.e <= p) out.push(sp);
    else if (sp.s >= removedEnd) out.push({ ...sp, s: sp.s + delta, e: sp.e + delta });
    else {
      // The edit cuts into this span: keep what survives on either side.
      if (sp.s < p) out.push({ ...sp, e: p });
      if (sp.e > removedEnd) out.push({ ...sp, s: p + inserted, e: sp.e + delta });
    }
  }
  if (inserted > 0) out.push({ s: p, e: p + inserted, rev, at });
  // Merge touching spans so a run of typing is one stroke.
  out.sort((a, b) => a.s - b.s);
  const merged: Span[] = [];
  for (const sp of out) {
    if (sp.e <= sp.s) continue;
    const prev = merged[merged.length - 1];
    if (prev && sp.s <= prev.e) merged[merged.length - 1] = { ...prev, e: Math.max(prev.e, sp.e), rev: Math.max(prev.rev, sp.rev), at: Math.min(prev.at, sp.at), failed: prev.failed || sp.failed };
    else merged.push(sp);
  }
  return merged;
}

export function WetInk({ value, onChange, save, label, delay = 900, theme = "paper", motion = "full", rows = 8 }: Props) {
  const [text, setText] = useState(value);
  const [spans, setSpans] = useState<Span[]>([]);
  const [drying, setDrying] = useState<Drying[]>([]);
  const [state, setState] = useState<"saved" | "waiting" | "saving" | "failed">("saved");
  const [savedAt, setSavedAt] = useState<string>("");
  const rev = useRef(0);
  const textRef = useRef(text);
  const spansRef = useRef(spans);
  const timer = useRef<number | undefined>(undefined);
  const inflight = useRef(false);
  const area = useRef<HTMLTextAreaElement>(null);
  const uid = useId();
  textRef.current = text;
  spansRef.current = spans;

  const run = useCallback(async () => {
    if (inflight.current) return;
    const snapshot = textRef.current;
    const snapRev = rev.current;
    if (!spansRef.current.length) return;
    inflight.current = true;
    setState("saving");
    try {
      await save(snapshot);
      // Everything written up to the snapshot dries, oldest first; newer strokes stay wet.
      const dried = spansRef.current.filter((s) => s.rev <= snapRev).sort((a, b) => a.at - b.at);
      setDrying(dried.map((s, rank) => ({ s: s.s, e: s.e, rank })));
      setSpans((cur) => cur.filter((s) => s.rev > snapRev));
      window.setTimeout(() => setDrying([]), 900 + dried.length * 90);
      setSavedAt(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
      inflight.current = false;
      setState(spansRef.current.some((s) => s.rev > snapRev) ? "waiting" : "saved");
      if (spansRef.current.some((s) => s.rev > snapRev)) {
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(run, delay);
      }
    } catch {
      inflight.current = false;
      setSpans((cur) => cur.map((s) => (s.rev <= snapRev ? { ...s, failed: true } : s)));
      setState("failed");
    }
  }, [save, delay]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onInput = (next: string) => {
    const before = textRef.current;
    rev.current += 1;
    setText(next);
    onChange?.(next);
    setSpans((cur) => rebase(cur, before, next, rev.current, performance.now()));
    setState("waiting");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(run, delay);
  };

  const retry = () => {
    setSpans((cur) => cur.map((s) => ({ ...s, failed: false })));
    window.clearTimeout(timer.current);
    run();
    area.current?.focus();
  };

  // Keep the textarea as tall as its text.
  const mirror = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (area.current && mirror.current) area.current.style.height = `${mirror.current.offsetHeight}px`;
  }, [text, drying]);

  // Cut the text into runs: dry, wet, failed, drying.
  const cuts = new Set<number>([0, text.length]);
  spans.forEach((s) => (cuts.add(Math.max(0, s.s)), cuts.add(Math.min(text.length, s.e))));
  drying.forEach((s) => (cuts.add(Math.max(0, s.s)), cuts.add(Math.min(text.length, s.e))));
  const points = [...cuts].sort((a, b) => a - b);
  const runs = points.slice(0, -1).map((a, i) => {
    const b = points[i + 1];
    const w = spans.find((s) => s.s <= a && s.e >= b);
    const d = drying.find((s) => s.s <= a && s.e >= b);
    return { a, b, kind: w ? (w.failed ? "failed" : "wet") : d ? "drying" : "dry", rank: d?.rank ?? 0 };
  });

  const count = spans.length;
  const status =
    state === "failed"
      ? `${count} ${count === 1 ? "edit" : "edits"} not saved`
      : state === "saving"
        ? "Saving…"
        : state === "waiting"
          ? "Writing…"
          : savedAt
            ? `All changes saved · ${savedAt}`
            : "All changes saved";

  return (
    <div className={`wet-ink wet-ink--${theme}`} data-state={state} data-motion={motion}>
      <label className="wet-ink__label" htmlFor={`${uid}-a`}>
        {label}
      </label>
      <div className="wet-ink__field" style={{ ["--wi-rows" as string]: rows }}>
        <div ref={mirror} className="wet-ink__mirror" aria-hidden="true">
          {runs.map((r) => (
            <span key={`${r.a}-${r.b}`} className={`wet-ink__run wet-ink__run--${r.kind}`} style={r.kind === "drying" ? { animationDelay: `${r.rank * 90}ms` } : undefined}>
              {text.slice(r.a, r.b)}
            </span>
          ))}
          {"​\n"}
        </div>
        <textarea id={`${uid}-a`} ref={area} className="wet-ink__input" value={text} spellCheck={false} onChange={(e) => onInput(e.target.value)} aria-describedby={`${uid}-s`} />
      </div>
      <div className="wet-ink__bar">
        <p id={`${uid}-s`} className="wet-ink__status" role="status" aria-live="polite">
          <span className="wet-ink__dot" aria-hidden="true" />
          {status}
        </p>
        {state === "failed" && (
          <button type="button" className="wet-ink__retry" onClick={retry}>
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
