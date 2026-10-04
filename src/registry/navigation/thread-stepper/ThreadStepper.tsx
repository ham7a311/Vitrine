"use client";

import { useId, useState } from "react";
import "./thread-stepper.css";

/**
 * Thread Stepper
 * A multi-step progress indicator drawn as a thread through beads. Completing
 * a step pulls the thread taut to the next bead and the finished bead fills;
 * the current bead pulses gently. Steps are buttons, so you can go back.
 */

export type Step = { id: string; title: string; hint?: string };

type Props = { steps: Step[]; current?: number; onChange?: (i: number) => void };

export function ThreadStepper({ steps, current, onChange }: Props) {
  const uid = useId();
  const [inner, setInner] = useState(0);
  const at = current ?? inner;
  const set = (i: number) => {
    if (current === undefined) setInner(i);
    onChange?.(i);
  };
  const pct = steps.length > 1 ? (at / (steps.length - 1)) * 100 : 0;

  return (
    <ol className="thr" style={{ ["--n" as string]: steps.length, ["--p" as string]: `${pct}%` }} aria-label="Progress">
      <span className="thr__rail" aria-hidden="true" />
      <span className="thr__thread" aria-hidden="true" />
      {steps.map((s, i) => {
        const state = i < at ? "done" : i === at ? "current" : "todo";
        return (
          <li key={s.id} className="thr__step" data-state={state}>
            <button
              type="button"
              className="thr__bead"
              aria-current={state === "current" ? "step" : undefined}
              aria-label={`Step ${i + 1}: ${s.title}${state === "done" ? " (completed)" : state === "current" ? " (current)" : ""}`}
              disabled={i > at}
              onClick={() => set(i)}
              aria-describedby={s.hint ? `${uid}-${s.id}` : undefined}
            >
              {state === "done" ? (
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.4 6.6 11.4 12.5 4.8" pathLength={1} /></svg>
              ) : (
                <span aria-hidden="true">{i + 1}</span>
              )}
            </button>
            <span className="thr__title">{s.title}</span>
            {s.hint && <span id={`${uid}-${s.id}`} className="thr__hint">{s.hint}</span>}
          </li>
        );
      })}
    </ol>
  );
}
