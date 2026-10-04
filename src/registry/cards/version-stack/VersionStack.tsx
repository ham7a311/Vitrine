"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type WheelEvent } from "react";
import "./version-stack.css";

/**
 * Version Stack
 * The depth of the stack is the amount of history. Sheet i sits at depth
 * (i − current): 0 is the front, 1–3 peek out below it, deeper ones wait
 * hidden at depth 3, and negative ones have been lifted away. Drag the front
 * sheet up to go back in time, down to come forward; wheel and arrow keys too.
 */

export type Note = { kind: "Added" | "Fixed" | "Changed"; text: string };
export type Version = { version: string; date: string; title: string; notes: Note[] };

type Props = { versions: Version[]; accent?: string; className?: string };

export function VersionStack({ versions, accent = "#b9cce4", className = "" }: Props) {
  const [at, setAt] = useState(0);
  const [drag, setDrag] = useState(0);
  const start = useRef<{ y: number; t: number } | null>(null);
  const wheelLock = useRef(0);
  const n = versions.length;

  const go = (i: number) => setAt(Math.max(0, Math.min(n - 1, i)));

  const onKey = (e: KeyboardEvent) => {
    const map: Record<string, number> = { ArrowDown: at + 1, PageDown: at + 1, ArrowUp: at - 1, PageUp: at - 1, Home: 0, End: n - 1 };
    if (e.key in map) { e.preventDefault(); go(map[e.key]); }
  };
  const onWheel = (e: WheelEvent) => {
    const now = performance.now();
    if (now < wheelLock.current || Math.abs(e.deltaY) < 8) return;
    wheelLock.current = now + 420;
    go(at + (e.deltaY > 0 ? 1 : -1));
  };
  const down = (e: PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    start.current = { y: e.clientY, t: performance.now() };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const move = (e: PointerEvent) => {
    if (!start.current) return;
    const d = e.clientY - start.current.y;
    // rubber-band at either end of history
    const edge = (d < 0 && at === n - 1) || (d > 0 && at === 0);
    setDrag(edge ? d * 0.25 : d);
  };
  const up = (e: PointerEvent) => {
    if (!start.current) return;
    const d = e.clientY - start.current.y, v = d / Math.max(1, performance.now() - start.current.t);
    start.current = null;
    setDrag(0);
    if (d < -70 || v < -0.5) go(at + 1);
    else if (d > 70 || v > 0.5) go(at - 1);
  };

  return (
    <div className={`version-stack ${className}`} style={{ "--vs-accent": accent } as CSSProperties}>
      <div
        className="version-stack__deck"
        role="region"
        aria-roledescription="stack"
        aria-label={`Release notes, showing ${versions[at].version}`}
        tabIndex={0}
        onKeyDown={onKey}
        onWheel={onWheel}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        data-dragging={drag !== 0 || undefined}
      >
        {versions.map((v, i) => {
          const depth = i - at;
          const d = Math.max(-1, Math.min(3, depth));
          const lift = depth === 0 ? Math.min(0, drag) : 0;
          return (
            <article
              key={v.version}
              className="version-stack__sheet"
              data-depth={depth < 0 ? "gone" : depth > 3 ? "deep" : depth}
              aria-hidden={depth !== 0}
              style={{ "--d": d, "--lift": `${lift}px`, "--back": depth === -1 && drag > 0 ? Math.min(1, drag / 140) : 0, zIndex: n - i } as CSSProperties}
            >
              <header className="version-stack__head">
                <span className="version-stack__tag">{v.version}</span>
                <time className="version-stack__date">{v.date}</time>
              </header>
              <h3 className="version-stack__title">{v.title}</h3>
              <ul className="version-stack__notes">
                {v.notes.map((nt, k) => (
                  <li key={k}><span data-kind={nt.kind}>{nt.kind}</span>{nt.text}</li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      <div className="version-stack__rail">
        <button type="button" onClick={() => go(at - 1)} disabled={at === 0} aria-label="Newer version">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 10l4-4 4 4" /></svg>
        </button>
        <ol className="version-stack__gauge" aria-label="Versions">
          {versions.map((v, i) => (
            <li key={v.version}>
              <button type="button" aria-current={i === at ? "step" : undefined} aria-label={v.version} onClick={() => go(i)} data-past={i < at || undefined} />
            </li>
          ))}
        </ol>
        <button type="button" onClick={() => go(at + 1)} disabled={at === n - 1} aria-label="Older version">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4" /></svg>
        </button>
      </div>
      <p className="version-stack__sr" aria-live="polite">{versions[at].version} — {versions[at].title}</p>
    </div>
  );
}
