"use client";
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import "./quickstart-checklist.css";

export type QuickstartStep = {
  id: string;
  title: string;
  body: ReactNode;
  /** A primary action for this step, e.g. opening a dialog. */
  action?: { label: string; onClick: () => void };
};
export type QuickstartChecklistProps = {
  title?: string;
  steps: QuickstartStep[];
  /** Remember finished steps across visits under this key. */
  storageKey?: string;
  onComplete?: () => void;
  theme?: "light" | "dark";
  className?: string;
};

/**
 * Quickstart Checklist
 * Onboarding as a short stack of numbered cards. The next unfinished step is
 * open; marking it done stamps it, folds it away and opens the one after.
 * A segmented bar keeps count.
 */
export function QuickstartChecklist({ title = "Get set up", steps, storageKey, onComplete, theme = "light", className = "" }: QuickstartChecklistProps) {
  const id = useId();
  const [done, setDone] = useState<string[]>([]);
  const [open, setOpen] = useState<string | null>(steps[0]?.id ?? null);
  const heads = useRef(new Map<string, HTMLButtonElement>());
  const reported = useRef(false);

  useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
      if (Array.isArray(saved)) {
        const valid = saved.filter((s) => steps.some((x) => x.id === s));
        setDone(valid);
        setOpen(steps.find((s) => !valid.includes(s.id))?.id ?? null);
        reported.current = valid.length === steps.length;
      }
    } catch { /* storage unavailable or corrupt */ }
  }, [storageKey, steps]);

  const save = (next: string[]) => {
    setDone(next);
    if (storageKey) try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* storage unavailable */ }
    if (next.length === steps.length && !reported.current) { reported.current = true; onComplete?.(); }
    if (next.length < steps.length) reported.current = false;
  };
  const finish = (stepId: string) => {
    const next = [...done.filter((d) => d !== stepId), stepId];
    save(next);
    const following = steps.find((s) => !next.includes(s.id));
    setOpen(following?.id ?? null);
    requestAnimationFrame(() => heads.current.get(following?.id ?? stepId)?.focus());
  };
  const undo = (stepId: string) => { save(done.filter((d) => d !== stepId)); setOpen(stepId); };

  const count = done.length;
  return (
    <section className={`qstart qstart--${theme} ${className}`} aria-labelledby={`${id}-title`}>
      <header className="qstart__head">
        <h3 id={`${id}-title`} className="qstart__title">{title}</h3>
        <p className="qstart__count" aria-live="polite">{count === steps.length ? "All done" : `${count} of ${steps.length} done`}</p>
      </header>
      <div className="qstart__bar" role="progressbar" aria-label="Setup progress" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={count} style={{ "--n": steps.length } as CSSProperties}>
        {steps.map((s) => <span key={s.id} data-done={done.includes(s.id) || undefined} />)}
      </div>
      <ol className="qstart__steps">
        {steps.map((step, i) => {
          const isDone = done.includes(step.id);
          const isOpen = open === step.id;
          return (
            <li key={step.id} className="qstart__step" data-done={isDone || undefined} data-open={isOpen || undefined}>
              <h4 className="qstart__step-head">
                <button
                  ref={(el) => { if (el) heads.current.set(step.id, el); else heads.current.delete(step.id); }}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`${id}-${step.id}`}
                  onClick={() => setOpen(isOpen ? null : step.id)}
                >
                  <span className="qstart__num" aria-hidden="true">{isDone ? "✓" : String(i + 1).padStart(2, "0")}</span>
                  <span className="qstart__name">{step.title}</span>
                  {isDone && <span className="qstart__stamp">Done</span>}
                  <svg className="qstart__chev" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4" /></svg>
                </button>
              </h4>
              <div id={`${id}-${step.id}`} className="qstart__body" hidden={!isOpen}>
                <div className="qstart__copy">{step.body}</div>
                <div className="qstart__actions">
                  {step.action && <button type="button" className="qstart__btn qstart__btn--primary" onClick={step.action.onClick}>{step.action.label}</button>}
                  {isDone
                    ? <button type="button" className="qstart__btn" onClick={() => undo(step.id)}>Mark as not done</button>
                    : <button type="button" className="qstart__btn" onClick={() => finish(step.id)}>Mark as done</button>}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
