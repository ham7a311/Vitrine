"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { rgb } from "./halftone";
import "./halftone-rise.css";

/**
 * Halftone Rise
 * A dome of light rising from below the frame, printed as an ordered dither at pixel scale.
 * Pixel density follows the glow, so the rim breaks into grainy speckle and the band near the
 * crest fills into a fine copper check. Slow noise drifts through the print and the pointer warms the dots under it.
 */

export type HalftoneRisePalette = [string, string, string];

const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform float uCell; uniform vec2 uMouse; uniform float uHot;
uniform float uCore; uniform float uRise;
uniform vec3 uC0, uC1, uC2;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++){ v += a * n(p); p = p * 2.07 + 9.3; a *= 0.5; } return v; }
float b2(vec2 a){ a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
float b4(vec2 a){ return b2(0.5 * a) * 0.25 + b2(a); }
float b8(vec2 a){ return b4(0.5 * a) * 0.25 + b2(a); }
void main(){
  vec2 cell = floor(gl_FragCoord.xy / uCell);
  vec2 c = (cell + 0.5) * uCell;
  float aspect = uRes.x / uRes.y;
  vec2 uv = vec2(c.x / uRes.x, 1.0 - c.y / uRes.y);
  // the dome: an ellipse centred just under the bottom edge
  float rx = max(0.86 * aspect, 0.95);
  // portrait frames get a lower dome, so phones keep most of the screen dark
  float rise = uRise * min(1.0, 0.45 + 0.3 * aspect) * (1.0 + 0.02 * sin(uTime * 0.35));
  vec2 e = vec2((uv.x - 0.5) * aspect / rx, (uv.y - 1.0) / rise);
  float d = length(e);
  float rim = pow(smoothstep(1.12, 0.5, d), 1.6);
  float inner = 1.0 - (1.0 - uCore) * smoothstep(0.55, 0.12, d);
  float cov = rim * inner;
  // streaky patches drifting through the print, as in a real halftone of a soft glow
  vec2 q = vec2(uv.x * aspect, uv.y) * 2.4;
  float t = uTime * 0.04;
  float w = fbm(q + vec2(t, -t * 0.6) + 1.3 * fbm(q * 0.7 - t));
  cov *= 0.62 + 0.75 * w;
  // pointer warms the dots near it
  vec2 m = uMouse / uRes.y;
  float pm = exp(-dot(c / uRes.y - m, c / uRes.y - m) * 18.0) * uHot;
  cov += pm * 0.35;
  cov = clamp(cov, 0.0, 1.0);
  // ordered dither at pixel scale: copper pixels against black in Bayer checks and crosses,
  // on a strict lattice, so sparse areas read as an even grid of single pixels
  float thr = b8(cell);
  float on = step(thr, cov * 0.62);
  vec3 ink = mix(uC1, uC2, smoothstep(0.1, 0.8, cov)) * (0.82 + 0.18 * h(cell + 7.1));
  // the gaps between lit pixels warm up too, so the dense band reads as copper, not grey
  vec3 gap = mix(uC0, uC1 * 0.5, smoothstep(0.25, 0.9, cov));
  vec3 col = mix(gap, ink, on);
  gl_FragColor = vec4(col, 1.0);
}`;
const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;

type Props = {
  /** [ground, rim dot, core dot] */
  palette?: HalftoneRisePalette;
  /** CSS px per dither pixel; 0.5 prints at device-pixel scale on retina screens. */
  cell?: number;
  /** How full the middle of the dome stays, 0–1. Lower leaves room for content. */
  core?: number;
  /** Height of the dome as a fraction of the frame. */
  rise?: number;
  speed?: number;
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

const DEFAULT_PALETTE: HalftoneRisePalette = ["#0a0a0b", "#8a4420", "#e8894c"];

export function HalftoneRise({ palette = DEFAULT_PALETTE, cell = 0.5, core = 0.6, rise = 0.68, speed = 1, motion = "full", className = "", style, children }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const key = palette.join();

  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv) return;
    const gl = cv.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return void (el.dataset.fallback = "");
    const reduced = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = !matchMedia("(hover: hover) and (pointer: fine)").matches;
    const mk = (t: number, s: string) => {
      const sh = gl.createShader(t)!;
      gl.shaderSource(sh, s);
      gl.compileShader(sh);
      return sh;
    };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, mk(gl.VERTEX_SHADER, VERT));
    gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return void (el.dataset.fallback = "");
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(pr, n);
    const [uRes, uTime, uCell, uMouse, uHot] = ["uRes", "uTime", "uCell", "uMouse", "uHot"].map(U);
    key.split(",").forEach((c, i) => gl.uniform3f(U(`uC${i}`), ...rgb(c)));
    gl.uniform1f(U("uCore"), Math.min(1, Math.max(0, core)));
    gl.uniform1f(U("uRise"), Math.min(1.2, Math.max(0.2, rise)));

    let raf = 0, visible = true, alive = true, last = 0, t = 0;
    const m = { x: 0, y: 0, tx: 0, ty: 0, s: 0, ts: 0 };
    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      cv.width = Math.max(1, Math.round(el.clientWidth * dpr));
      cv.height = Math.max(1, Math.round(el.clientHeight * dpr));
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(uRes, cv.width, cv.height);
      gl.uniform1f(uCell, Math.max(1, Math.round(cell * dpr)));
    };
    const frame = () => {
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, m.x, m.y);
      gl.uniform1f(uHot, m.s);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const tick = (now: number) => {
      raf = 0;
      if (!alive || !visible || document.hidden) return;
      if (now - last < 32) return void (raf = requestAnimationFrame(tick));
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0.016;
      last = now;
      t += dt * speed;
      m.x += (m.tx - m.x) * 0.08;
      m.y += (m.ty - m.y) * 0.08;
      m.s += (m.ts - m.s) * 0.05;
      frame();
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (reduced) return frame();
      if (!raf && alive) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      m.tx = ((e.clientX - r.left) / r.width) * cv.width;
      m.ty = (1 - (e.clientY - r.top) / r.height) * cv.height;
      if (!m.s) (m.x = m.tx), (m.y = m.ty);
      m.ts = 1;
    };
    const onLeave = () => (m.ts = 0);
    const ro = new ResizeObserver(() => {
      size();
      frame();
    });
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(el);
    const onVis = () => !document.hidden && start();
    document.addEventListener("visibilitychange", onVis);
    if (!coarse) {
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
    }
    t = 30;
    size();
    frame();
    start();
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [key, cell, core, rise, speed, motion]);

  return (
    <div
      ref={host}
      className={`htrs ${className}`}
      style={{ ["--htrs-0" as string]: palette[0], ["--htrs-1" as string]: palette[1], ["--htrs-2" as string]: palette[2], ...style }}
    >
      <canvas ref={canvas} className="htrs__canvas" aria-hidden="true" />
      {children && <div className="htrs__content">{children}</div>}
    </div>
  );
}
