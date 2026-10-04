"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import "./mercury-segments.css";

/**
 * Mercury Segments
 * The thumb is three blobs inside an SVG goo filter (blur + alpha threshold):
 * the body, whose leading edge moves first, and two droplets on longer
 * durations. As they separate and catch up they pinch off and re-merge.
 * Labels sit above the filtered layer so the text stays crisp.
 */

export type Segment = { id: string; label: string };

type Props = { segments: Segment[]; value?: string; onChange?: (id: string) => void; label?: string; tint?: string; className?: string };

export function MercurySegments({ segments, value, onChange, label = "View", tint = "#c9d3de", className = "" }: Props) {
  const uid = useId().replace(/:/g, "");
  const [active, setActive] = useState(value ?? segments[0].id);
  const [box, setBox] = useState<{ l: number; w: number } | null>(null);
  const [dir, setDir] = useState(1);
  const [ready, setReady] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const btns = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => { if (value) setActive(value); }, [value]);

  const measure = () => {
    const b = btns.current[active], w = wrap.current;
    if (!b || !w) return;
    const r = b.getBoundingClientRect(), p = w.getBoundingClientRect();
    setBox({ l: r.left - p.left, w: r.width });
  };
  useLayoutEffect(measure, [active]);
  useEffect(() => {
    const ro = new ResizeObserver(measure);
    if (wrap.current) ro.observe(wrap.current);
    const id = requestAnimationFrame(() => setReady(true));
    return () => { ro.disconnect(); cancelAnimationFrame(id); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const pick = (id: string) => {
    if (id === active) return;
    const ids = segments.map((s) => s.id);
    setDir(ids.indexOf(id) > ids.indexOf(active) ? 1 : -1);
    setActive(id);
    onChange?.(id);
  };

  const onKey = (e: KeyboardEvent) => {
    const ids = segments.map((s) => s.id), i = ids.indexOf(active), n = ids.length;
    let j = i;
    if (e.key === "ArrowRight") j = (i + 1) % n;
    else if (e.key === "ArrowLeft") j = (i - 1 + n) % n;
    else if (e.key === "Home") j = 0;
    else if (e.key === "End") j = n - 1;
    else return;
    e.preventDefault();
    pick(ids[j]);
    btns.current[ids[j]]?.focus();
  };

  const style = {
    "--ms-tint": tint,
    "--ms-l": `${box?.l ?? 0}px`,
    "--ms-w": `${box?.w ?? 0}px`,
    "--ms-lead": dir > 0 ? "0ms" : "110ms",
    "--ms-trail": dir > 0 ? "110ms" : "0ms",
  } as CSSProperties;

  return (
    <div ref={wrap} className={`mercury-segments ${className}`} style={style} data-ready={ready || undefined} role="radiogroup" aria-label={label} onKeyDown={onKey}>
      <svg width="0" height="0" aria-hidden="true" className="mercury-segments__defs">
        <filter id={`${uid}-goo`}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
          <feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="g" />
          <feComposite in="SourceGraphic" in2="g" operator="atop" />
        </filter>
      </svg>
      {box && (
        <div className="mercury-segments__pool" style={{ filter: `url(#${uid}-goo)` }} aria-hidden="true">
          <span className="mercury-segments__body" />
          <span className="mercury-segments__drop mercury-segments__drop--a" />
          <span className="mercury-segments__drop mercury-segments__drop--b" />
        </div>
      )}
      {box && <span className="mercury-segments__sheen" aria-hidden="true" />}
      {segments.map((s) => (
        <button
          key={s.id}
          ref={(el) => void (btns.current[s.id] = el)}
          type="button"
          role="radio"
          aria-checked={s.id === active}
          tabIndex={s.id === active ? 0 : -1}
          className="mercury-segments__opt"
          onClick={() => pick(s.id)}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
