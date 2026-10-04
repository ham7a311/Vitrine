"use client";

import { useRef, useState } from "react";
import "./branch-switcher.css";

/**
 * Branch Switcher
 * Editing a message doesn't overwrite it — it starts a branch. Step between versions with the
 * pager under the message; the question and its answer slide together in the direction you
 * moved, and a small tree shows where you are among the branches.
 */

export type Version = { prompt: string; answer: string };

type Props = { versions: Version[]; reply?: (prompt: string) => string; theme?: "paper" | "night"; className?: string };

export function BranchSwitcher({ versions: initial, reply = () => "Here's a version that takes that into account.", theme = "paper", className = "" }: Props) {
  const [versions, setVersions] = useState(initial);
  const [at, setAt] = useState(initial.length - 1);
  const [dir, setDir] = useState<1 | -1>(1);
  const [beat, setBeat] = useState(0);
  const [editing, setEditing] = useState(false);
  const draft = useRef<HTMLTextAreaElement>(null);
  const go = (n: number) => {
    if (n < 0 || n >= versions.length || n === at) return;
    setDir(n > at ? 1 : -1);
    setAt(n);
    setBeat((b) => b + 1);
  };
  const save = () => {
    const p = draft.current?.value.trim();
    setEditing(false);
    if (!p || p === versions[at].prompt) return;
    setVersions((v) => [...v, { prompt: p, answer: reply(p) }]);
    setDir(1);
    setAt(versions.length);
    setBeat((b) => b + 1);
  };
  const v = versions[at];
  return (
    <div className={`bs bs--${theme} ${className}`}>
      <div className="bs__thread" data-dir={dir > 0 ? "next" : "prev"}>
        <div className="bs__user bs__anim" key={`u${beat}`}>
          {editing ? (
            <form
              className="bs__edit"
              onSubmit={(e) => {
                e.preventDefault();
                save();
              }}
            >
              <textarea ref={draft} defaultValue={v.prompt} rows={3} aria-label="Edit your message" autoFocus />
              <div>
                <button type="button" onClick={() => setEditing(false)}>
                  Cancel
                </button>
                <button type="submit" className="bs__primary">
                  Save as new branch
                </button>
              </div>
            </form>
          ) : (
            <p className="bs__bubble">{v.prompt}</p>
          )}
        </div>
        <div className="bs__tools">
          {!editing && (
            <button type="button" className="bs__icon" onClick={() => setEditing(true)} aria-label="Edit message">
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10.5 2.8 13.2 5.5 6 12.7 3 13l.3-3Z" /></svg>
            </button>
          )}
          <nav className="bs__pager" aria-label="Message versions">
            <button type="button" onClick={() => go(at - 1)} disabled={at === 0} aria-label="Previous version">
              ‹
            </button>
            <span aria-live="polite">
              {at + 1} / {versions.length}
            </span>
            <button type="button" onClick={() => go(at + 1)} disabled={at === versions.length - 1} aria-label="Next version">
              ›
            </button>
          </nav>
          <svg className="bs__tree" viewBox={`0 0 ${versions.length * 18 + 8} 30`} aria-hidden="true">
            <path d={`M4 4 V12 ${versions.map((_, i) => `M4 12 C4 20 ${8 + i * 18} 16 ${8 + i * 18} 24`).join(" ")}`} />
            {versions.map((_, i) => (
              <circle key={i} cx={8 + i * 18} cy={24} r={i === at ? 4.2 : 3} data-on={i === at ? "" : undefined} onClick={() => go(i)} />
            ))}
            <circle cx="4" cy="4" r="2.6" className="bs__root" />
          </svg>
        </div>
        <div className="bs__answer bs__anim" key={`a${beat}`}>
          <span className="bs__avatar" aria-hidden="true" />
          <p>{v.answer}</p>
        </div>
      </div>
    </div>
  );
}
