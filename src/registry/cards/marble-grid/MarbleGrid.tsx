"use client";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { hex, runShader } from "./gl";
import { move, origin } from "./grid";
import "./marble-grid.css";

/**
 * Marble Grid
 * A quiet grid of dark feature cards. The card you point at floods with liquid marble in its own
 * colour — swirls of light and shade with dark veins, slowly folding — spreading out from where
 * the pointer came in. One canvas moves from card to card, so there's only ever one WebGL context.
 */
const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec3 uColor; uniform float uSeed;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h1(i), h1(i + vec2(1, 0)), f.x), mix(h1(i + vec2(0, 1)), h1(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++){ v += a * vn(p); p = p * 1.97 + 1.3; a *= 0.47; } return v; }
void main(){
  vec2 p = gl_FragCoord.xy / uRes.y * 0.95 + uSeed;
  float t = uTime * 0.06;
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t * 0.8));
  vec2 r = vec2(fbm(p + 3.6 * q + vec2(1.7, 9.2) + t * 0.5), fbm(p + 3.6 * q + vec2(8.3, 2.8) - t * 0.4));
  float v = fbm(p + 3.2 * r);
  vec3 c = uColor;
  vec3 col = mix(c * 0.22, c * 0.95, smoothstep(0.2, 0.75, v));
  col = mix(col, mix(c, vec3(1.0), 0.55), smoothstep(0.62, 0.92, v) * 0.85);
  // dark veins where the second fold crosses its middle
  float vein = 1.0 - smoothstep(0.004, 0.035, abs(r.x - 0.56));
  vein *= smoothstep(0.25, 0.6, v);
  col = mix(col, c * 0.12, vein * 0.75);
  // soft light from the top left
  vec2 uv = gl_FragCoord.xy / uRes;
  col *= 0.82 + 0.3 * smoothstep(0.0, 1.2, uv.y + (1.0 - uv.x) * 0.4);
  gl_FragColor = vec4(col, 1.0);
}`;

export type MarbleItem = { id: string; title: string; body?: string; icon?: ReactNode; color: string };

export type MarbleGridProps = {
  items: MarbleItem[];
  theme?: "night" | "paper";
  motion?: "full" | "reduced";
  className?: string;
};

export function MarbleGrid({ items, theme = "night", motion = "full", className = "" }: MarbleGridProps) {
  const grid = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [from, setFrom] = useState({ x: 50, y: 50 });
  const [cols, setCols] = useState(3);
  const [failed, setFailed] = useState(false);
  const colour = useRef(items[0]?.color ?? "#7a3fe0");
  const seed = useRef(0);

  useLayoutEffect(() => {
    const el = grid.current;
    if (!el) return;
    const read = () => setCols(getComputedStyle(el).gridTemplateColumns.split(" ").length);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const host = layer.current, cv = canvas.current;
    if (!host || !cv) return;
    return runShader(host, cv, {
      frag: FRAG, reduced: motion === "reduced", quality: 0.8, start: 30,
      frame: (set) => { set("uColor", hex(colour.current)); set("uSeed", seed.current); },
      onFail: () => setFailed(true),
    });
  }, [motion]);

  // move the one canvas under the active card
  useLayoutEffect(() => {
    const host = layer.current, g = grid.current;
    if (active === null || !host || !g) return;
    const c = cards.current[active];
    if (!c) return;
    colour.current = items[active].color;
    seed.current = active * 3.7;
    host.style.left = `${c.offsetLeft}px`;
    host.style.top = `${c.offsetTop}px`;
    host.style.width = `${c.offsetWidth}px`;
    host.style.height = `${c.offsetHeight}px`;
    (host as HTMLDivElement & { __redraw?: () => void }).__redraw?.();
    // restart the flood from the new entry point
    host.classList.remove("mgrid__flood--on");
    void host.offsetWidth;
    host.classList.add("mgrid__flood--on");
  }, [active, cols, items]);
  useEffect(() => {
    const host = layer.current;
    if (active !== null || !host) return;
    host.classList.remove("mgrid__flood--on");
    // shrink the idle layer so the canvas costs nothing while no card is active
    const t = window.setTimeout(() => { host.style.width = "0px"; host.style.height = "0px"; }, 250);
    return () => clearTimeout(t);
  }, [active]);

  const enter = (i: number, point?: { x: number; y: number }) => {
    const c = cards.current[i];
    if (c) setFrom(origin(c.getBoundingClientRect(), point));
    setActive(i);
  };
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = move(i, items.length, cols, e.key);
    if (n !== i) { e.preventDefault(); cards.current[n]?.focus(); }
  };

  return (
    <div className={`mgrid mgrid--${theme} ${active !== null ? "mgrid--live" : ""} ${className}`}>
      <div ref={grid} className="mgrid__grid" onPointerLeave={(e) => { if (e.pointerType === "mouse") setActive(null); }}>
        <div ref={layer} className="mgrid__flood" data-fallback={failed ? "" : undefined}
          style={{ ["--mgrid-x" as string]: `${from.x}%`, ["--mgrid-y" as string]: `${from.y}%`, ["--mgrid-color" as string]: active !== null ? items[active].color : "transparent" }} aria-hidden="true">
          <canvas ref={canvas} />
        </div>
        {items.map((it, i) => (
          <article
            key={it.id}
            ref={(n) => { cards.current[i] = n; }}
            className={`mgrid__card ${active === i ? "mgrid__card--on" : ""}`}
            style={{ ["--mgrid-tint" as string]: it.color }}
            tabIndex={0}
            onPointerEnter={(e) => { if (e.pointerType === "mouse") enter(i, { x: e.clientX, y: e.clientY }); }}
            onFocus={() => enter(i)}
            onBlur={(e) => { if (!grid.current?.contains(e.relatedTarget as Node)) setActive(null); }}
            onClick={() => enter(i)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {it.icon && <span className="mgrid__icon" aria-hidden="true">{it.icon}</span>}
            <h3 className="mgrid__title">{it.title}</h3>
            {it.body && <p className="mgrid__body">{it.body}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}

export default MarbleGrid;
