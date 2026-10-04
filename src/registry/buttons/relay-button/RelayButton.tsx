"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import "./relay-button.css";

/**
 * Relay Button
 * An async action whose states ride a vertical reel inside the button:
 * idle → working → done (or failed). The button's width eases to fit each
 * state's label, a hairline along the bottom edge carries the progress, and
 * the reel always moves up for forward progress and down for a reset.
 */

type Phase = "idle" | "working" | "done" | "error";

type Props = {
  labels?: Record<Phase, string>;
  /** Performs the work; report progress 0–1. Resolve true on success. */
  action?: (progress: (p: number) => void) => Promise<boolean>;
  tone?: "bone" | "frost";
  className?: string;
};

const ORDER: Phase[] = ["idle", "working", "done", "error"];

const demoAction = (fail: boolean) => (progress: (p: number) => void) =>
  new Promise<boolean>((resolve) => {
    let p = 0;
    const id = setInterval(() => {
      p = Math.min(1, p + 0.04 + Math.random() * 0.07);
      progress(fail ? Math.min(p, 0.68) : p);
      if (fail && p >= 0.68) { clearInterval(id); resolve(false); }
      if (!fail && p >= 1) { clearInterval(id); setTimeout(() => resolve(true), 180); }
    }, 90);
  });

const DEFAULT_LABELS: Record<Phase, string> = { idle: "Deploy to production", working: "Deploying", done: "Live in 32 regions", error: "Build failed — retry" };

export function RelayButton({
  labels = DEFAULT_LABELS,
  action,
  tone = "bone",
  className = "",
}: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [widths, setWidths] = useState<number[]>([]);
  const measure = useRef<(HTMLSpanElement | null)[]>([]);
  const tries = useRef(0);

  useLayoutEffect(() => {
    const read = () => setWidths(measure.current.map((m) => m?.offsetWidth ?? 0));
    read();
    document.fonts?.ready.then(read);
    // keyed on the text, not the object, so inline label objects don't re-measure every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labels.idle, labels.working, labels.done, labels.error]);

  useEffect(() => {
    if (phase !== "done") return;
    const t = setTimeout(() => { setPhase("idle"); setProgress(0); }, 2600);
    return () => clearTimeout(t);
  }, [phase]);

  const run = async () => {
    if (phase === "working") return;
    setProgress(0);
    setPhase("working");
    tries.current += 1;
    // the demo fails the first attempt so the error state is visible
    const ok = await (action ?? demoAction(tries.current === 1))(setProgress);
    setPhase(ok ? "done" : "error");
  };

  const i = ORDER.indexOf(phase);
  const style = {
    "--rb-w": widths[i] ? `${widths[i]}px` : "auto",
    "--rb-i": i,
    "--rb-p": progress,
  } as CSSProperties;

  return (
    <button type="button" className={`relay-button relay-button--${tone} ${className}`} data-phase={phase} style={style} onClick={run} aria-busy={phase === "working"}>
      <span className="relay-button__window">
        <span className="relay-button__reel">
          {ORDER.map((p) => (
            <span key={p} className="relay-button__row" data-row={p} aria-hidden={p !== phase}>
              {p === "working" && <span className="relay-button__spin" aria-hidden="true" />}
              {p === "done" && (
                <svg className="relay-button__tick" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" /></svg>
              )}
              {p === "error" && <span className="relay-button__bang" aria-hidden="true">!</span>}
              {labels[p]}
              {p === "working" && <span className="relay-button__pct">{Math.round(progress * 100)}%</span>}
            </span>
          ))}
        </span>
      </span>
      <span className="relay-button__rail" aria-hidden="true" />
      {/* invisible copies used to measure each state's natural width */}
      <span className="relay-button__measure" aria-hidden="true">
        {ORDER.map((p, k) => (
          <span key={p} ref={(el) => void (measure.current[k] = el)} className="relay-button__row">
            {p !== "idle" && <span className="relay-button__icon-slot" />}
            {labels[p]}
            {p === "working" && <span className="relay-button__pct">100%</span>}
          </span>
        ))}
      </span>
      <span className="relay-button__sr" aria-live="polite">{phase === "idle" ? "" : labels[phase]}</span>
    </button>
  );
}
