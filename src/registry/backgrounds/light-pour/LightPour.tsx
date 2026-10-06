"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { beamX, rgb } from "./pour";
import "./light-pour.css";

/**
 * Light Pour
 * A single shaft of light pours from the top of the frame like a stream of liquid: a hairline
 * of white at the top that widens as it falls, then flares out into a bright pool when it meets
 * the floor, the colour running sideways along the bottom. Glints fall down the shaft, smoke
 * drifts in the dark, and a fine dot grid and film grain catch the light.
 */

export type LightPourPalette = [string, string, string, string];

const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform float uX; uniform float uFlare; uniform float uDpr;
uniform vec3 uC0, uC1, uC2, uC3;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ v += a * n(p); p = p * 2.02 + 7.1; a *= 0.5; } return v; }
float g(float x, float w){ return exp(-x * x / (w * w)); }
void main(){
  vec2 fc = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  float H = uRes.y;
  vec2 p = fc / H;                       // y down, in heights
  float aspect = uRes.x / H;
  float t = uTime;
  float bx = uX * aspect;
  float dx = p.x - bx;
  float d = abs(dx);
  float f = max(1.0 - p.y, 0.0);         // height above the floor
  float side = step(0.0, dx);            // 1 on the right of the beam

  // the stream: a hyperbola, hairline at the top, flaring into the floor
  float w = 0.0045 * uFlare / (f + 0.015);
  float flow = 0.8 + 0.2 * n(vec2(dx / w * 1.5, p.y * 7.0 - t * 1.6)) + 0.08 * sin(t * 2.3 + p.y * 3.0);
  vec3 col = uC0;

  // smoke: slow, cold clouds in the dark; the far right falls away to black
  vec2 q = p * 1.5 + vec2(t * 0.012, -t * 0.006);
  float sm = fbm(q + 0.8 * fbm(q * 1.3 - t * 0.01));
  float smokeMask = smoothstep(aspect * 0.97, aspect * 0.8, p.x) * (0.55 + 0.45 * smoothstep(0.0, 0.5, p.y));
  col += mix(vec3(0.1, 0.11, 0.15), uC1 * 0.2, 0.3) * smoothstep(0.3, 0.8, sm) * smokeMask * 1.8;

  // blue body of light around the stream: widening with depth
  float halo = exp(-d / (w * 4.0 + 0.035)) * (0.35 + 0.65 * smoothstep(0.0, 0.9, p.y));
  col += uC1 * halo * 0.95;
  col += uC1 * 0.32 * exp(-d / (w * 9.0 + 0.12)) * smoothstep(0.15, 1.0, p.y);
  // a cloud of blue light that hangs just right of the stream, near the top
  vec2 cl = (p - vec2(bx + 0.12, 0.2)) / vec2(0.16, 0.1);
  col += uC1 * 0.35 * exp(-dot(cl, cl)) * (0.7 + 0.6 * sm);
  // a wide mass of blue at the lower right and lower left
  vec2 lr = (p - vec2(bx + 0.42, 0.8)) / vec2(0.42, 0.32);
  col += uC1 * 0.28 * exp(-dot(lr, lr)) * (0.6 + 0.8 * sm);
  vec2 ll = (p - vec2(0.12 * aspect, 1.02)) / vec2(0.45, 0.2);
  col += uC1 * 0.55 * exp(-dot(ll, ll));

  // the core itself
  float core = g(d, w * 0.9) * flow;
  col += uC3 * core * 2.2;
  col += mix(uC3, uC1, 0.5) * g(d, w * 2.2) * 0.45 * flow;

  // the bell: the stream's skirt fills with light that cools from white to the halo colour,
  // edged by a few thin streamlines that follow the flare
  float lower = smoothstep(0.62, 0.05, f);
  float bell = smoothstep(w * 2.9, w * 1.1, d) * lower;
  col += mix(mix(uC3, uC1, 0.35), mix(uC1, uC2, side * 0.6), smoothstep(w * 1.1, w * 2.8, d)) * bell * 0.85;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float m = 2.75 + fi * 0.55 + fi * fi * 0.25;
    float lw = (1.0 + fi * 0.35) / H * uDpr;
    float line = g(d - w * m, lw + w * 0.03);
    vec3 lc = mix(mix(uC1, uC3, 0.6), mix(uC2, uC3, 0.5), side);
    col += lc * line * lower * (0.9 - fi * 0.25) * (0.75 + 0.25 * flow);
  }
  // violet runs into the right of the pool
  col += uC2 * 0.75 * exp(-max(dx, 0.0) / 0.35) * smoothstep(0.0, 1.0, side) * exp(-f / 0.12) * smoothstep(w * 1.2, w * 3.0, d);

  // the pool: light spreading along the floor, rippling outward
  float pool = exp(-f / 0.022) * exp(-d / (0.32 + 0.04 * sin(t * 0.7)));
  float ripple = 0.85 + 0.15 * sin(d * 60.0 - t * 2.2);
  col += mix(uC3, uC1, smoothstep(0.05, 0.6, d)) * pool * 1.6 * ripple;
  col += uC3 * exp(-f / 0.008) * exp(-d / 0.55) * 0.8;

  // glints falling down the stream
  vec2 gp = vec2(dx, p.y - t * 0.11) * (H / (2.5 * uDpr));
  vec2 gc = floor(gp);
  float gh = h(gc);
  float near = exp(-d / (w * 2.5 + 0.04));
  if (gh < 0.03 + 0.4 * near) {
    vec2 sp = gc + 0.5 + 0.35 * (vec2(h(gc + 1.3), h(gc + 4.1)) - 0.5);
    float sd = length(gp - sp);
    float tw = 0.5 + 0.5 * sin(t * 6.0 * h(gc + 2.2) + gh * 30.0);
    col += mix(uC1, uC3, 0.6) * (1.0 - smoothstep(0.08, 0.22, sd)) * near * tw * 1.1;
  }

  // fine dot grid that only shows where light falls on it
  vec2 dg = mod(fc, 3.0 * uDpr) - 1.5 * uDpr;
  float dotm = 1.0 - smoothstep(0.35 * uDpr, 0.75 * uDpr, length(dg));
  float lit = clamp(halo + 0.4 * exp(-dot(lr, lr)) + 0.4 * exp(-dot(ll, ll)), 0.0, 1.0);
  col += uC1 * dotm * lit * 0.04;

  col = 1.0 - exp(-col * 1.25);
  // film grain
  col += (h(fc + fract(t) * 91.0) - 0.5) * 0.035;
  gl_FragColor = vec4(col, 1.0);
}`;
const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;

type Props = {
  /** [dark, halo, accent, core] */
  palette?: LightPourPalette;
  /** Where the stream falls, 0–1 across the frame. */
  x?: number;
  /** How wide the stream spreads as it reaches the floor, 0.5–2. */
  flare?: number;
  speed?: number;
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

const DEFAULT_PALETTE: LightPourPalette = ["#05060c", "#3f63ff", "#9a62ff", "#f3f6ff"];

export function LightPour({ palette = DEFAULT_PALETTE, x = 0.574, flare = 1, speed = 1, motion = "full", className = "", style, children }: Props) {
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
    const [uRes, uTime, uX, uDpr] = ["uRes", "uTime", "uX", "uDpr"].map(U);
    key.split(",").forEach((c, i) => gl.uniform3f(U(`uC${i}`), ...rgb(c)));
    gl.uniform1f(U("uFlare"), Math.min(2, Math.max(0.5, flare)));

    let raf = 0, visible = true, alive = true, last = 0, t = 0;
    const m = { x, tx: x };
    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      cv.width = Math.max(1, Math.round(el.clientWidth * dpr));
      cv.height = Math.max(1, Math.round(el.clientHeight * dpr));
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(uRes, cv.width, cv.height);
      gl.uniform1f(uDpr, dpr);
    };
    const frame = () => {
      gl.uniform1f(uTime, t);
      gl.uniform1f(uX, m.x);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const tick = (now: number) => {
      raf = 0;
      if (!alive || !visible || document.hidden) return;
      if (now - last < 30) return void (raf = requestAnimationFrame(tick));
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0.016;
      last = now;
      t += dt * speed;
      m.x += (m.tx - m.x) * 0.04;
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
      m.tx = beamX(x, (e.clientX - r.left) / r.width);
    };
    const onLeave = () => (m.tx = x);
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
    t = 8;
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
  }, [key, x, flare, speed, motion]);

  return (
    <div
      ref={host}
      className={`lpor ${className}`}
      style={{ ["--lpor-0" as string]: palette[0], ["--lpor-1" as string]: palette[1], ["--lpor-2" as string]: palette[2], ["--lpor-3" as string]: palette[3], ...style }}
    >
      <canvas ref={canvas} className="lpor__canvas" aria-hidden="true" />
      {children && <div className="lpor__content">{children}</div>}
    </div>
  );
}
