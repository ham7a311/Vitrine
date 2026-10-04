"use client";

import { useEffect, useState } from "react";
import "./tool-call.css";

/**
 * Tool Call
 * What an assistant does when it reaches for a tool, shown as it happens. Each call is a card:
 * the function name with its arguments, a shimmering status while it runs, then the result —
 * collapsible, so the conversation stays readable. Calls run in order, then the answer arrives.
 */

export type ToolStep = { name: string; args: Record<string, string | number | boolean>; result: string; ms: number; detail?: string[] };

type Props = { steps: ToolStep[]; answer: string; theme?: "paper" | "night"; motion?: "full" | "reduced"; className?: string };

export function ToolCall({ steps, answer, theme = "paper", motion = "full", className = "" }: Props) {
  const [at, setAt] = useState(0);
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const [run, setRun] = useState(0);
  const done = at >= steps.length;

  useEffect(() => {
    const reduced = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return setAt(steps.length);
    setAt(0);
    let i = 0;
    let t: ReturnType<typeof setTimeout>;
    const next = () => {
      t = setTimeout(() => {
        i++;
        setAt(i);
        if (i < steps.length) next();
      }, steps[i].ms);
    };
    next();
    return () => clearTimeout(t);
  }, [run, steps, motion]);

  return (
    <div className={`tc tc--${theme} ${className}`}>
      <ol className="tc__list">
        {steps.map((s, i) => {
          const st = i < at ? "done" : i === at ? "running" : "waiting";
          const isOpen = open[i] ?? false;
          if (st === "waiting") return null;
          return (
            <li key={i} className="tc__card" data-state={st}>
              <button type="button" className="tc__head" aria-expanded={isOpen} disabled={st !== "done"} onClick={() => setOpen((o) => ({ ...o, [i]: !isOpen }))}>
                <span className="tc__icon" aria-hidden="true">
                  {st === "done" ? (
                    <svg viewBox="0 0 16 16"><path d="m3.5 8.5 3 3 6-7" /></svg>
                  ) : (
                    <i className="tc__spin" />
                  )}
                </span>
                <span className="tc__name">
                  <code>{s.name}</code>
                  <span className="tc__args">
                    ({Object.entries(s.args).map(([k, v], j) => (
                      <span key={k}>
                        {j > 0 && ", "}
                        <span className="tc__k">{k}</span>: <span className="tc__v">{typeof v === "string" ? `"${v}"` : String(v)}</span>
                      </span>
                    ))})
                  </span>
                </span>
                <span className="tc__status">{st === "done" ? s.result : "Running…"}</span>
                {st === "done" && (
                  <svg className="tc__chev" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="m5 6 3 3 3-3" />
                  </svg>
                )}
              </button>
              <div className="tc__more" data-open={isOpen ? "" : undefined}>
                <div>
                  <pre className="tc__json">{JSON.stringify(s.args, null, 2)}</pre>
                  {s.detail && (
                    <ul className="tc__detail">
                      {s.detail.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="tc__answer" data-show={done ? "" : undefined} aria-live="polite">
        {done ? answer : ""}
      </p>
      <div className="tc__foot">
        <span>
          {done ? `${steps.length} tool calls · ${(steps.reduce((a, s) => a + s.ms, 0) / 1000).toFixed(1)}s` : `Step ${at + 1} of ${steps.length}`}
        </span>
        <button type="button" onClick={() => setRun((r) => r + 1)} disabled={!done}>
          Run again
        </button>
      </div>
    </div>
  );
}
