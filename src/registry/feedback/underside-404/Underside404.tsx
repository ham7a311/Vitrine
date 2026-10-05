"use client";
import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import type { RecoveryLink } from "../recovery";
import "./underside-404.css";

export type IndexEntry = RecoveryLink & { /** Shown after the dot leader, like a page number. */ folio?: string };
export type Underside404Props = {
  title?: string;
  description?: string;
  /** Printed on the back of the sheet as an index. */
  entries: IndexEntry[];
  home?: RecoveryLink;
  theme?: "paper" | "night";
  motion?: "auto" | "reduced";
  className?: string;
};

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Underside 404
 * A blank sheet with one corner turned up. Turning the page — by dragging that
 * corner or with the button — reveals the back, printed as an index of the
 * places that do exist. Blank front, useful back.
 */
export function Underside404({ title = "This page is blank.", description = "Nothing was ever printed on it. The way back is on the other side.", entries, home, theme = "paper", motion = "auto", className = "" }: Underside404Props) {
  const id = useId();
  const sheet = useRef<HTMLDivElement>(null);
  const turnButton = useRef<HTMLButtonElement>(null);
  const backButton = useRef<HTMLButtonElement>(null);
  const firstEntry = useRef<HTMLAnchorElement>(null);
  const drag = useRef<{ x: number; width: number; pointer: number } | null>(null);
  const moved = useRef(false);
  const [turned, setTurned] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
    if (!moved.current) return;
    (turned ? firstEntry.current ?? backButton.current : turnButton.current)?.focus({ preventScroll: true });
  }, [turned]);

  const turn = (next: boolean) => { moved.current = true; setTurned(next); };

  const start = (e: ReactPointerEvent<HTMLSpanElement>) => {
    if (turned || !sheet.current) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, width: sheet.current.getBoundingClientRect().width, pointer: e.pointerId };
    setProgress(0);
  };
  const move = (e: ReactPointerEvent<HTMLSpanElement>) => {
    const d = drag.current;
    if (!d || d.pointer !== e.pointerId) return;
    setProgress(clamp((d.x - e.clientX) / (d.width * 0.9)));
  };
  const end = (e: ReactPointerEvent<HTMLSpanElement>) => {
    const d = drag.current;
    if (!d || d.pointer !== e.pointerId) return;
    drag.current = null;
    const p = progress ?? 0;
    setProgress(null);
    // A small tap on the corner turns the page too.
    if (p > 0.35 || Math.abs(d.x - e.clientX) < 4) turn(true);
  };

  const turnAmount = progress ?? (turned ? 1 : 0);

  return (
    <section className={`us404 us404--${theme} ${className}`} data-motion={motion} aria-labelledby={`${id}-title`}>
      <div className="us404__stage">
        <div ref={sheet} className="us404__sheet" data-turned={turned} data-dragging={progress !== null || undefined} style={{ "--us-turn": turnAmount } as CSSProperties}>
          <div className="us404__face us404__front" inert={turned}>
            <p className="us404__meta"><span>No. 404</span><span>Recto</span></p>
            <div className="us404__body">
              <h1 id={`${id}-title`} className="us404__title">{title}</h1>
              <p className="us404__description">{description}</p>
            </div>
            <button ref={turnButton} type="button" className="us404__turn" aria-expanded={turned} aria-controls={`${id}-back`} onClick={() => turn(true)}>
              Turn the page over <span aria-hidden="true">↶</span>
            </button>
          </div>
          <span className="us404__corner" aria-hidden="true" onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end} />
          <div id={`${id}-back`} className="us404__face us404__back" inert={!turned}>
            <p className="us404__meta"><span>Index</span><span>Verso</span></p>
            <nav aria-label="Site index">
              <ol className="us404__index">
                {entries.map((entry, i) => (
                  <li key={`${entry.href}-${i}`}>
                    <a ref={i === 0 ? firstEntry : undefined} href={entry.href}>
                      <span className="us404__label">{entry.label}</span>
                      <span className="us404__leader" aria-hidden="true" />
                      <span className="us404__folio">{entry.folio ?? String(i + 1)}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <div className="us404__backfoot">
              <button ref={backButton} type="button" className="us404__return" onClick={() => turn(false)}><span aria-hidden="true">↷</span> Turn back</button>
              {home && <a className="us404__home" href={home.href}>{home.label}</a>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
