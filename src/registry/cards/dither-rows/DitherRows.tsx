"use client";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { hex, runShader } from "./gl";
import { next } from "./rows";
import "./dither-rows.css";

/**
 * Dither Rows
 * A quiet feature list. The row you point at lights up on an ordered-dither colour field that
 * slides between rows like a selection, and its round icon turns solid. One canvas, moved with
 * the selection, draws the field.
 */
const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec3 uColor; uniform float uCell; uniform float uSeed;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h1(i), h1(i + vec2(1, 0)), f.x), mix(h1(i + vec2(0, 1)), h1(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ v += a * vn(p); p = p * 2.02 + 3.7; a *= 0.5; } return v; }
float bayer2(vec2 a){ a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
float bayer4(vec2 a){ return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a){ return bayer4(0.5 * a) * 0.25 + bayer2(a); }
void main(){
  vec2 p = gl_FragCoord.xy;
  float t = uTime * 0.05;
  vec2 q = p / (uRes.y * 1.4) * vec2(0.7, 1.0) + uSeed;
  vec2 w = vec2(fbm(q + vec2(t, -t * 0.7)), fbm(q + vec2(4.1, 1.7) - t * 0.6));
  float v = fbm(q * 1.5 + w * 1.8 + vec2(t * 0.4, 0.0));
  float x = gl_FragCoord.x / uRes.x;
  // quieter on the left, where the title sits
  v = smoothstep(0.22, 0.8, v) * mix(0.45, 1.1, smoothstep(0.0, 0.85, x));
  float level = clamp(floor(v * 3.5 + bayer8(floor(p / uCell)) - 0.35), 0.0, 3.0);
  vec3 c = uColor;
  vec3 col = level < 0.5 ? c * 0.12 : level < 1.5 ? c * 0.42 : level < 2.5 ? c : mix(c, vec3(1.0), 0.5);
  gl_FragColor = vec4(col, 1.0);
}`;

export type DitherRow = { id: string; title: string; body?: string; icon?: ReactNode; color: string };

export type DitherRowsProps = {
  rows: DitherRow[];
  defaultActive?: number;
  /** Dither cell size in CSS pixels. */
  cell?: number;
  theme?: "night" | "paper";
  motion?: "full" | "reduced";
  className?: string;
};

export function DitherRows({ rows, defaultActive = 0, cell = 2, theme = "night", motion = "full", className = "" }: DitherRowsProps) {
  const list = useRef<HTMLDivElement>(null);
  const band = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const items = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(Math.min(defaultActive, rows.length - 1));
  const [failed, setFailed] = useState(false);
  const colour = useRef(rows[0]?.color ?? "#2f5bd8");

  useEffect(() => {
    const host = band.current, cv = canvas.current;
    if (!host || !cv) return;
    return runShader(host, cv, {
      frag: FRAG, reduced: motion === "reduced", quality: 1, start: 9,
      frame: (set, c) => { set("uColor", hex(colour.current)); set("uCell", Math.max(1, Math.round(cell * (c.width / Math.max(1, host.clientWidth))))); set("uSeed", 0); },
      onFail: () => setFailed(true),
    });
  }, [cell, motion]);

  // slide the band to the active row
  useLayoutEffect(() => {
    const host = band.current, row = items.current[active];
    if (!host || !row) return;
    colour.current = rows[active].color;
    host.style.transform = `translateY(${row.offsetTop}px)`;
    host.style.height = `${row.offsetHeight}px`;
    (host as HTMLDivElement & { __redraw?: () => void }).__redraw?.();
  }, [active, rows]);
  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const ro = new ResizeObserver(() => { const row = items.current[active], host = band.current; if (row && host) { host.style.transform = `translateY(${row.offsetTop}px)`; host.style.height = `${row.offsetHeight}px`; } });
    ro.observe(el);
    return () => ro.disconnect();
  }, [active]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = next(i, rows.length, e.key);
    if (n !== i) { e.preventDefault(); setActive(n); items.current[n]?.focus(); }
  };

  return (
    <div ref={list} className={`drows drows--${theme} ${className}`} role="listbox" aria-label="Features" aria-activedescendant={undefined}>
      <div ref={band} className="drows__band" data-fallback={failed ? "" : undefined} style={{ ["--drows-color" as string]: rows[active]?.color }} aria-hidden="true">
        <canvas ref={canvas} />
      </div>
      {rows.map((r, i) => {
        const on = i === active;
        return (
          <div
            key={r.id}
            ref={(n) => { items.current[i] = n; }}
            role="option"
            aria-selected={on}
            tabIndex={on ? 0 : -1}
            className={`drows__row ${on ? "drows__row--on" : ""}`}
            style={{ ["--drows-tint" as string]: r.color }}
            onPointerEnter={(e) => { if (e.pointerType === "mouse") setActive(i); }}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
          >
            <div className="drows__text">
              <h3 className="drows__title">{r.title}</h3>
              {r.body && <p className="drows__body">{r.body}</p>}
            </div>
            {r.icon && <span className="drows__icon" aria-hidden="true">{r.icon}</span>}
          </div>
        );
      })}
    </div>
  );
}

export default DitherRows;
