"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import "./activity-glyphs.css";

/**
 * Activity Glyphs
 * Small marks for what an assistant is doing right now, each drawn to show its job rather than a generic
 * spinner: pages turning while it reads, lines typing while it writes code, chevrons marching at a prompt
 * while a command runs, a pixel grid resolving for an image, bars recomputing for data, an arrow lifting
 * out of a tray for an upload. Each ends with a drawn tick, or a cross and the reason.
 */

export type Activity = "reading" | "writing" | "running" | "image" | "analysing" | "uploading";
export type ActivityState = "active" | "done" | "error";

export const ACTIVITIES: { id: Activity; name: string }[] = [
  { id: "reading", name: "Reading files" },
  { id: "writing", name: "Writing code" },
  { id: "running", name: "Running a command" },
  { id: "image", name: "Generating an image" },
  { id: "analysing", name: "Analysing data" },
  { id: "uploading", name: "Uploading" },
];

/* The order the image's sixteen pixels resolve in, so it never fills row by row. */
const PIXELS = [9, 2, 14, 5, 0, 11, 7, 15, 3, 12, 6, 1, 13, 8, 4, 10];

const v = (o: Record<string, string | number>) => o as CSSProperties;

const GLYPHS: Record<Activity, ReactNode> = {
  reading: (
    <>
      <path className="acgl__page" d="M12 6.4C9.5 5 6.5 4.8 3.5 5.6v13c3-.8 6-.6 8.5.8z" />
      <path className="acgl__page" d="M12 6.4c2.5-1.4 5.5-1.6 8.5-.8v13c-3-.8-6-.6-8.5.8z" />
      <path className="acgl__flip" d="M12 6.4c2.5-1.4 5.5-1.6 8.5-.8v13c-3-.8-6-.6-8.5.8z" />
      <path className="acgl__flip" d="M12 6.4c2.5-1.4 5.5-1.6 8.5-.8v13c-3-.8-6-.6-8.5.8z" style={v({ "--d": "-0.9s" })} />
    </>
  ),
  writing: (
    <>
      <path className="acgl__frame" d="M8 6 3.5 12 8 18M16 6l4.5 6-4.5 6" />
      <line className="acgl__type" x1="9.5" y1="9.5" x2="14.5" y2="9.5" style={v({ "--i": 0 })} />
      <line className="acgl__type" x1="10.5" y1="12.5" x2="13.5" y2="12.5" style={v({ "--i": 1 })} />
      <line className="acgl__type" x1="9.5" y1="15.5" x2="12.5" y2="15.5" style={v({ "--i": 2 })} />
    </>
  ),
  running: (
    <>
      <rect className="acgl__frame" x="2.5" y="4" width="19" height="16" rx="3.5" />
      {[0, 1, 2].map((i) => (
        <path key={i} className="acgl__chev" d="m6 9.5 2.5 2.5L6 14.5" style={v({ "--i": i })} />
      ))}
      <line className="acgl__cursor" x1="13" y1="15.5" x2="17.5" y2="15.5" />
    </>
  ),
  image: (
    <>
      {PIXELS.map((p, i) => (
        <rect key={i} className="acgl__px" x={3.5 + (i % 4) * 4.5} y={3.5 + Math.floor(i / 4) * 4.5} width="3.6" height="3.6" rx="1" style={v({ "--p": p })} />
      ))}
    </>
  ),
  analysing: (
    <>
      <line className="acgl__frame" x1="3" y1="20.5" x2="21" y2="20.5" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} className="acgl__bar" x={4.5 + i * 4.25} y="5" width="2.8" height="13.5" rx="1.2" style={v({ "--i": i })} />
      ))}
    </>
  ),
  uploading: (
    <>
      <path className="acgl__frame" d="M4 14.5v3a2.5 2.5 0 0 0 2.5 2.5h11a2.5 2.5 0 0 0 2.5-2.5v-3" />
      <g className="acgl__lift">
        <path className="acgl__frame" d="M12 15V4.5M7.5 8.5 12 4l4.5 4.5" />
      </g>
      <line className="acgl__fill" x1="7" y1="17" x2="17" y2="17" />
    </>
  ),
};

export type ActivityGlyphProps = {
  activity: Activity;
  state?: ActivityState;
  /** The words beside the glyph, e.g. "Reading 4 files" or, on error, the reason. */
  label: string;
  /** A quieter note after the label: a file name, a count, a time. */
  detail?: string;
  theme?: "dark" | "light";
  className?: string;
};

export function ActivityGlyph({ activity, state = "active", label, detail, theme = "dark", className = "" }: ActivityGlyphProps) {
  const root = useRef<HTMLSpanElement>(null);
  const [paused, setPaused] = useState(false);

  /* Nothing moves where nobody can see it. */
  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let onScreen = true;
    const sync = () => setPaused(!onScreen || document.hidden);
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, []);

  const said = state === "done" ? "done" : state === "error" ? "failed" : "in progress";
  return (
    <span
      ref={root}
      className={`acgl acgl--${theme} ${className}`}
      data-activity={activity}
      data-state={state}
      data-paused={paused || undefined}
      role="status"
      aria-label={`${label}${detail ? `, ${detail}` : ""}, ${said}`}
    >
      <svg key={state} className="acgl__glyph" viewBox="0 0 24 24" aria-hidden="true">
        {state === "active" ? GLYPHS[activity] : state === "done" ? (
          <path className="acgl__tick" pathLength={1} d="M5 12.5 9.8 17 19 7.5" />
        ) : (
          <path className="acgl__cross" pathLength={1} d="M7 7l10 10M17 7 7 17" />
        )}
      </svg>
      <span className="acgl__label" aria-hidden="true">
        {label}
        {detail && <span className="acgl__detail"> · {detail}</span>}
      </span>
    </span>
  );
}
