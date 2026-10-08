"use client";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { graticule, project, turnTo, type Place } from "./globe";
import "./globe-search.css";

/**
 * Globe Search
 * "Searching the web", drawn as a small wireframe globe that turns while the assistant looks things up.
 * Each result lands as a ping at the place it came from; when the search is done the globe slows and
 * settles facing the last result, and the count stops. The results open underneath.
 */

export type GlobeResult = { title: string; site: string; place: Place };

export type GlobeSearchProps = {
  query: string;
  results: GlobeResult[];
  /** How many results have come in so far. */
  found: number;
  state: "searching" | "done";
  /** Globe size in pixels. */
  size?: number;
  theme?: "dark" | "light";
  className?: string;
};

type GlobeProps = { size: number; spinning: boolean; pings: Place[]; settle?: Place; theme?: "dark" | "light" };

/** The globe on its own: a turning graticule with pings where results came from. */
export function Globe({ size, spinning, pings, settle, theme = "dark" }: GlobeProps) {
  const uid = useId().replace(/:/g, "");
  const root = useRef<SVGSVGElement>(null);
  const near = useRef<SVGPathElement>(null);
  const far = useRef<SVGPathElement>(null);
  const dots = useRef<SVGGElement>(null);
  const live = useRef({ spinning, pings, settle });
  live.current = { spinning, pings, settle };
  const wake = useRef<() => void>(() => {});

  const R = 46;
  const C = 50;
  const step = size < 32 ? 45 : 30;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let spin = 20;
    let raf = 0;
    let last = 0;
    let onScreen = true;

    const paint = () => {
      const g = graticule(spin, R, C, step);
      near.current?.setAttribute("d", g.near);
      far.current?.setAttribute("d", g.far);
      const kids = dots.current?.children;
      live.current.pings.forEach((p, i) => {
        const k = kids?.[i] as SVGGElement | undefined;
        if (!k) return;
        const q = project(p.lat, p.lon, spin);
        k.setAttribute("transform", `translate(${(C + q.x * R).toFixed(2)} ${(C - q.y * R).toFixed(2)})`);
        k.style.opacity = q.z > 0.05 ? String(Math.min(1, 0.35 + q.z)) : "0";
      });
    };
    const tick = (t: number) => {
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 1 / 60;
      last = t;
      const { spinning: on, settle: to } = live.current;
      let moving = true;
      if (reduce) {
        if (to) spin = to.lon;
        moving = false;
      } else if (on) {
        spin = (spin + 34 * dt) % 360;
      } else if (to) {
        const d = turnTo(spin, to.lon);
        spin += d * Math.min(1, dt * 2.6);
        moving = Math.abs(d) > 0.05;
      } else moving = false;
      paint();
      if (moving && onScreen && !document.hidden) raf = requestAnimationFrame(tick);
      else { raf = 0; last = 0; }
    };
    const go = () => { if (!raf) raf = requestAnimationFrame(tick); };
    wake.current = go;
    const io = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen) go(); else { cancelAnimationFrame(raf); raf = 0; }
    });
    io?.observe(el);
    const vis = () => (document.hidden ? (cancelAnimationFrame(raf), (raf = 0)) : go());
    document.addEventListener("visibilitychange", vis);
    go();
    return () => { io?.disconnect(); document.removeEventListener("visibilitychange", vis); cancelAnimationFrame(raf); };
  }, [step]);

  useEffect(() => wake.current(), [spinning, pings.length, settle]);

  return (
    <svg ref={root} className={`glbs__globe glbs--${theme}`} viewBox="0 0 100 100" width={size} height={size} aria-hidden="true" data-small={size < 32 || undefined}>
      <defs>
        <radialGradient id={`${uid}-g`} cx="38%" cy="32%" r="70%">
          <stop offset="0" stopColor="var(--glbs-sea-hi)" />
          <stop offset="1" stopColor="var(--glbs-sea)" />
        </radialGradient>
      </defs>
      <circle cx={C} cy={C} r={R} fill={`url(#${uid}-g)`} />
      <path ref={far} className="glbs__far" />
      <path ref={near} className="glbs__near" />
      <circle cx={C} cy={C} r={R} className="glbs__rim" />
      <g ref={dots}>
        {pings.map((_, i) => (
          <g key={i} className="glbs__ping" style={{ opacity: 0 }}>
            <circle r={size < 32 ? 14 : 9} className="glbs__ring" />
            <circle r={size < 32 ? 6.5 : 3.4} className="glbs__dot" />
          </g>
        ))}
      </g>
    </svg>
  );
}

export function GlobeSearch({ query, results, found, state, size = 22, theme = "dark", className = "" }: GlobeSearchProps) {
  const uid = useId();
  const [open, setOpen] = useState(false);
  const shown = results.slice(0, found);
  const done = state === "done";
  const last = shown[shown.length - 1]?.place;

  return (
    <div className={`glbs glbs--${theme} ${className}`} data-state={state} style={{ ["--glbs-size" as string]: `${size}px` } as CSSProperties}>
      <div className="glbs__line">
        <Globe size={size} spinning={!done} pings={shown.map((r) => r.place)} settle={done ? last : undefined} theme={theme} />
        <p className="glbs__text">
          <span className="glbs__verb">{done ? "Searched the web" : "Searching the web"}</span>
          <span className="glbs__query">{query}</span>
        </p>
        {done ? (
          <button type="button" className="glbs__count" aria-expanded={open} aria-controls={`${uid}-list`} onClick={() => setOpen((o) => !o)}>
            {found} result{found === 1 ? "" : "s"}
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4.5 6.5 3.5 3.5 3.5-3.5" /></svg>
          </button>
        ) : (
          <span className="glbs__count" data-live>
            <b key={found}>{found}</b> found
          </span>
        )}
      </div>
      {done && open && (
        <ol id={`${uid}-list`} className="glbs__list">
          {shown.map((r, i) => (
            <li key={i}>
              <span className="glbs__fav" aria-hidden="true">{r.site.replace(/^www\./, "")[0]}</span>
              <span className="glbs__title">{r.title}</span>
              <span className="glbs__site">{r.site}</span>
            </li>
          ))}
        </ol>
      )}
      <p className="glbs__sr" role="status" aria-live="polite">
        {done ? `Searched the web for ${query}: ${found} results.` : `Searching the web for ${query}.`}
      </p>
    </div>
  );
}
