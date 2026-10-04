"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import "./agent-run.css";

/**
 * Agent Run
 * An agent's work as a list of tool calls that fill in as they happen. Each
 * step has a verb glyph (read / search / edit / run), a target in mono, and a
 * status that turns from a spinner into a tick. Steps with output (a diff, a
 * test run) can be opened in place; the run ends in a one-paragraph summary.
 */

export type AgentStep = {
  kind: "read" | "search" | "edit" | "run" | "think";
  label: string;
  target?: string;
  meta?: string;
  ms: number;
  detail?: ReactNode;
};

type Props = { task: string; steps: AgentStep[]; summary: string; className?: string };

const GLYPH: Record<AgentStep["kind"], ReactNode> = {
  read: <path d="M4 3.5h6l3 3v9H4zM10 3.5v3h3" />,
  search: <><circle cx="8.5" cy="8.5" r="4.5" /><path d="M12 12l3.5 3.5" /></>,
  edit: <path d="M4 14.5l1-3.5 7.5-7.5 2.5 2.5-7.5 7.5-3.5 1ZM11 5l2.5 2.5" />,
  run: <path d="M6 4.5v11l9-5.5-9-5.5Z" />,
  think: <><circle cx="10" cy="10" r="6" /><path d="M10 6.5v3.5l2.5 1.5" /></>,
};

export function AgentRun({ task, steps, summary, className = "" }: Props) {
  const [at, setAt] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const [run, setRun] = useState(0);
  const done = at >= steps.length;

  useEffect(() => {
    setAt(0);
    setOpen(null);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setAt(steps.length); return; }
    let i = 0;
    let t: ReturnType<typeof setTimeout>;
    const next = () => {
      if (i >= steps.length) return;
      t = setTimeout(() => { i += 1; setAt(i); next(); }, steps[i].ms);
    };
    next();
    return () => clearTimeout(t);
  }, [run, steps]);

  const total = steps.reduce((a, s) => a + s.ms, 0);

  return (
    <section className={`agent-run ${className}`} aria-label="Agent run">
      <header className="agent-run__head">
        <span className="agent-run__avatar" aria-hidden="true">◆</span>
        <p className="agent-run__task">{task}</p>
        <span className="agent-run__status" data-done={done || undefined}>
          {done ? `Done · ${(total / 1000).toFixed(1)}s` : `Step ${at + 1} of ${steps.length}`}
        </span>
      </header>

      <ol className="agent-run__steps">
        {steps.map((s, i) => {
          const state = i < at ? "done" : i === at ? "active" : "queued";
          const expandable = !!s.detail && state === "done";
          return (
            <li key={i} className="agent-run__step" data-state={state} style={{ "--i": i } as CSSProperties}>
              <button
                type="button"
                className="agent-run__row"
                disabled={!expandable}
                aria-expanded={expandable ? open === i : undefined}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <svg className="agent-run__glyph" viewBox="0 0 20 20" aria-hidden="true">{GLYPH[s.kind]}</svg>
                <span className="agent-run__label">{s.label}</span>
                {s.target && <code className="agent-run__target">{s.target}</code>}
                {s.meta && <span className="agent-run__meta">{s.meta}</span>}
                <span className="agent-run__state" aria-label={state}>
                  {state === "active" ? <i className="agent-run__spin" /> : state === "done" ? (
                    <svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" /></svg>
                  ) : null}
                </span>
              </button>
              {s.detail && (
                <div className="agent-run__detail" data-open={open === i || undefined}>
                  <div>{s.detail}</div>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="agent-run__summary" data-on={done || undefined} aria-live="polite">
        <div>
          {done && (
            <>
              <p>{summary}</p>
              <button type="button" onClick={() => setRun((r) => r + 1)}>Run again</button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
