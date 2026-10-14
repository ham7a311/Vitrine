"use client";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { hex, runShader } from "./gl";
import { pack, step } from "./accordion";
import "./dither-accordion.css";

/**
 * Dither Accordion
 * Tall panels on slow, ordered-dither colour fields — a warped noise field quantised through an
 * 8×8 Bayer matrix into four tones of each panel's colour, darkening towards the foot so text
 * reads. One panel is open with its title and line; the rest show their names on end.
 * One canvas draws every panel, clipped to their rounded rectangles as they resize.
 */
const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime;
uniform vec4 uRects[6]; uniform vec3 uCols[6]; uniform float uCount; uniform vec3 uGround; uniform float uCell; uniform float uRadius;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h1(i), h1(i + vec2(1, 0)), f.x), mix(h1(i + vec2(0, 1)), h1(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ v += a * vn(p); p = p * 2.02 + 3.7; a *= 0.5; } return v; }
float bayer2(vec2 a){ a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
float bayer4(vec2 a){ return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a){ return bayer4(0.5 * a) * 0.25 + bayer2(a); }
float box(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
void main(){
  vec2 p = gl_FragCoord.xy;
  vec3 col = uGround;
  for (int i = 0; i < 6; i++) {
    if (float(i) >= uCount) break;
    vec4 r = uRects[i];
    float d = box(p - (r.xy + r.zw * 0.5), r.zw * 0.5, uRadius);
    if (d > 1.0) continue;
    vec3 c = uCols[i];
    float t = uTime * 0.05;
    vec2 q = p / (uRes.y * 0.55) + vec2(float(i) * 5.3, float(i) * 2.1);
    vec2 w = vec2(fbm(q + vec2(t, -t * 0.7)), fbm(q + vec2(4.1, 1.7) - t * 0.6));
    float v = fbm(q * 1.4 + w * 1.8 + vec2(t * 0.4, 0.0));
    float ly = (p.y - r.y) / r.w;
    v = smoothstep(0.22, 0.78, v) * mix(0.3, 1.08, smoothstep(0.0, 0.85, ly));
    vec2 cell = floor(p / uCell);
    float level = clamp(floor(v * 3.5 + bayer8(cell) - 0.35), 0.0, 3.0);
    vec3 tone = level < 0.5 ? c * 0.14 : level < 1.5 ? c * 0.48 : level < 2.5 ? c : mix(c, vec3(1.0), 0.55);
    col = mix(col, tone, clamp(0.5 - d, 0.0, 1.0));
  }
  gl_FragColor = vec4(col, 1.0);
}`;

export type DitherPanel = { id: string; title: string; body?: string; color: string; icon?: ReactNode };

export type DitherAccordionProps = {
  panels: DitherPanel[];
  /** Panel row height on wide screens. */
  height?: number;
  /** Index open at first. */
  defaultOpen?: number;
  /** Size of one dither cell in CSS pixels. */
  cell?: number;
  theme?: "night" | "paper";
  motion?: "full" | "reduced";
  className?: string;
};

export function DitherAccordion({ panels, height = 520, defaultOpen = 0, cell = 2, theme = "night", motion = "full", className = "" }: DitherAccordionProps) {
  const row = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const buttons = useRef<(HTMLElement | null)[]>([]);
  const [open, setOpen] = useState(Math.min(defaultOpen, panels.length - 1));
  const [failed, setFailed] = useState(false);
  const [vertical, setVertical] = useState(false);
  const list = panels.slice(0, 6);

  useLayoutEffect(() => {
    const el = row.current;
    if (!el) return;
    const check = () => setVertical(el.getBoundingClientRect().width < 640);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = row.current, cv = canvas.current;
    if (!el || !cv) return;
    const ground = getComputedStyle(el).getPropertyValue("--dacc-ground").trim() || "#000000";
    const cols = list.flatMap((p) => hex(p.color));
    return runShader(el, cv, {
      frag: FRAG, reduced: motion === "reduced", quality: 1, start: 12,
      uniforms: { uGround: hex(ground), uCount: list.length, uRadius: 22 * Math.min(devicePixelRatio || 1, 2) * (matchMedia("(hover: hover) and (pointer: fine)").matches ? 1 : 0.7) },
      frame: (set, c) => {
        const box = el.getBoundingClientRect();
        const scale = c.width / Math.max(1, box.width);
        const rects = buttons.current.slice(0, list.length).map((b) => b?.getBoundingClientRect() ?? { left: 0, top: 0, width: 0, height: 0 });
        set("uRects", pack(rects, box, scale));
        set("uCols", [...cols, ...new Array(18 - cols.length).fill(0)]);
        set("uCell", Math.max(1, Math.round(cell * scale)));
      },
      onFail: () => setFailed(true),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panels, cell, motion]);

  // a still frame needs redrawing when the open panel changes
  useEffect(() => { (row.current as (HTMLDivElement & { __redraw?: () => void }) | null)?.__redraw?.(); }, [open, vertical]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const next = step(i, list.length, e.key, vertical);
    if (next !== i) { e.preventDefault(); setOpen(next); buttons.current[next]?.focus(); }
  };

  return (
    <div className={`dacc dacc--${theme} ${className}`}>
      <div ref={row} className={`dacc__row ${vertical ? "dacc__row--v" : ""}`} style={{ height: vertical ? undefined : height }} data-fallback={failed ? "" : undefined}>
        <canvas ref={canvas} className="dacc__canvas" aria-hidden="true" />
        {list.map((p, i) => {
          const on = i === open;
          return (
            <section
              key={p.id}
              ref={(n) => { buttons.current[i] = n; }}
              className={`dacc__panel ${on ? "dacc__panel--on" : ""}`}
              style={{ ["--dacc-color" as string]: p.color }}
              tabIndex={on ? 0 : -1}
              role="button"
              aria-expanded={on}
              aria-label={on ? undefined : p.title}
              onPointerEnter={(e) => { if (e.pointerType === "mouse") setOpen(i); }}
              onFocus={() => setOpen(i)}
              onClick={() => setOpen(i)}
              onKeyDown={(e) => onKey(e, i)}
            >
              {p.icon && <span className="dacc__icon" aria-hidden="true">{p.icon}</span>}
              <span className="dacc__side" aria-hidden="true">{p.title}</span>
              <div className="dacc__text" aria-hidden={!on}>
                <h3 className="dacc__title">{p.title}</h3>
                {p.body && <p className="dacc__body">{p.body}</p>}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default DitherAccordion;
