"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { ORBITS, rgb, unit } from "./dawn";
import "./orbit-dawn.css";

/**
 * Orbit Dawn
 * A ringed light rising over a dark horizon: a white-hot inner ring, a broad bright band, thin
 * pink striations and a wide violet halo, under faint orbit lines whose small hollow nodes drift
 * round very slowly. Sparse stars twinkle, thicker near the glow, and a soft haze lies along the
 * horizon where the light meets it.
 */

export type OrbitDawnPalette = [string, string, string, string];

const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform float uUnit; uniform float uLift; uniform vec2 uLean;
uniform vec3 uC0, uC1, uC2, uC3;
uniform float uR[5];
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
float g(float x, float w){ return exp(-x * x / (w * w)); }
void main(){
  vec2 fc = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  float px = 1.0 / uUnit;
  float horizon = uRes.y * 0.88;
  vec2 c = vec2(uRes.x * 0.5, uRes.y * 0.9 + uUnit * 0.02) + uLean * uUnit;
  vec2 p = (fc - c) / uUnit;
  float r = length(p);
  float th = atan(-p.y, p.x);
  float t = uTime;
  float below = step(horizon, fc.y);

  // base: deep night with a faint lift at the top centre
  vec3 col = uC0;
  vec2 tp = (fc - vec2(uRes.x * 0.5, 0.0)) / uUnit;
  col += uC1 * 0.035 * exp(-dot(tp, tp) * 1.6);

  // the dawn ring, layered from the inside out
  float breath = 1.0 + 0.04 * sin(t * 0.5);
  float rr = r / (uLift * breath);
  // streaks run along the arc: slow round the angle, fast across the radius
  float flow = n(vec2(th * 3.0 + t * 0.12, rr * 140.0)) * 0.6 + n(vec2(th * 7.0 - t * 0.2, rr * 260.0)) * 0.4;
  vec3 glow = vec3(0.0);
  glow += uC1 * 0.7 * exp(-max(rr - 0.1, 0.0) / 0.12);                  // violet body and halo
  glow += uC1 * 2.0 * g(rr - 0.2, 0.15);                                // saturated bloom hugging the ring
  glow += uC1 * 0.08 * exp(-rr / 0.45);                                 // wide, dim outer haze
  glow += uC1 * 0.7 * smoothstep(0.13, 0.0, rr);                       // the dome inside the ring
  glow += uC3 * 1.3 * g(rr - 0.112, 0.012);                             // thin white-hot inner ring
  glow += mix(uC2, uC3, 0.5) * 0.55 * g(rr - 0.14, 0.014);              // lilac gap
  glow += uC3 * 1.7 * g(rr - 0.188, 0.042);                             // the broad bright band
  glow += uC3 * 0.35 * exp(-abs(rr - 0.19) / 0.05);                     // its bloom
  float stri = 0.0;
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    float ri = 0.228 + fi * 0.0115;
    stri += g(rr - ri, 0.003 + fi * 0.0004) * (1.0 - fi * 0.14);
  }
  glow += uC2 * stri * (0.25 + 0.6 * flow);                             // thin pink striations
  glow += uC2 * 0.6 * g(rr - 0.245, 0.045);
  col += 1.0 - exp(-glow * 1.15);

  // orbits: hairlines with small hollow nodes that drift round
  float lw = px * 1.1;
  for (int i = 0; i < 5; i++) {
    float R = uR[i];
    float a = 0.08 - float(i) * 0.012;
    col += vec3(0.85, 0.85, 1.0) * a * (1.0 - smoothstep(0.0, lw, abs(r - R)));
    float fi = float(i);
    float drift = (mod(fi, 2.0) > 0.5 ? -1.0 : 1.0) * (0.012 + fi * 0.003);
    for (int k = 0; k < 3; k++) {
      float base = k == 0 ? 0.75 : k == 1 ? 1.55 : 2.37;
      float ang = base + fi * 0.07 + t * drift;
      vec2 q = vec2(cos(ang), -sin(ang)) * R;
      float d = abs(length(p - q) - 0.0084);
      col += vec3(0.85, 0.85, 1.0) * 0.2 * (1.0 - smoothstep(0.0, lw, d));
    }
  }

  // stars: sparse, thicker near the glow, each twinkling on its own clock
  vec2 sg = fc / (uUnit * 0.028);
  vec2 sc = floor(sg);
  float sh = h(sc);
  float near = exp(-r * 2.6);
  float chance = 0.006 + 0.16 * near * near;
  if (sh < chance) {
    vec2 sp = sc + 0.2 + 0.6 * vec2(h(sc + 3.1), h(sc + 7.7));
    float sd = length(sg - sp) * uUnit * 0.028;
    float size = mix(0.6, 1.4, h(sc + 1.9)) * (uUnit / 534.0);
    float tw = 0.55 + 0.45 * sin(t * (0.6 + 1.6 * h(sc + 5.3)) + sh * 40.0);
    col += uC3 * (1.0 - smoothstep(size * 0.6, size * 1.4, sd)) * tw * (0.55 + 0.45 * near);
  }

  // the horizon: a soft line of light, with everything under it seen as through frosted glass
  float hy = (fc.y - horizon) / uUnit;
  float span = exp(-pow(p.x / 0.42, 2.0));
  // under it, the ring is lost in a soft frosted blur
  vec3 frost = uC0 + uC1 * 0.8 * exp(-pow(p.x / 0.5, 2.0)) * exp(-max(hy, 0.0) / 0.2)
    + mix(uC2, uC3, 0.6) * 0.75 * exp(-pow(p.x / 0.3, 2.0)) * exp(-max(hy, 0.0) / 0.06);
  col = mix(col, mix(col * 0.25, frost, 0.85), below);
  col += mix(uC2, uC3, 0.5) * 0.35 * g(hy, 0.016) * span;
  col += uC3 * 0.06 * (1.0 - smoothstep(0.0, px * 1.2, abs(hy))) * exp(-pow(p.x / 0.9, 2.0));
  gl_FragColor = vec4(col, 1.0);
}`;
const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;

type Props = {
  /** [night, glow, fringe, core] */
  palette?: OrbitDawnPalette;
  /** Size of the dawn ring, 0.6–1.6. */
  lift?: number;
  speed?: number;
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

const DEFAULT_PALETTE: OrbitDawnPalette = ["#05031a", "#7239ea", "#ee9cf6", "#fbf6ff"];

export function OrbitDawn({ palette = DEFAULT_PALETTE, lift = 1, speed = 1, motion = "full", className = "", style, children }: Props) {
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
    const [uRes, uTime, uUnit, uLean] = ["uRes", "uTime", "uUnit", "uLean"].map(U);
    key.split(",").forEach((c, i) => gl.uniform3f(U(`uC${i}`), ...rgb(c)));
    gl.uniform1fv(U("uR"), new Float32Array(ORBITS));
    gl.uniform1f(U("uLift"), Math.min(1.6, Math.max(0.6, lift)));

    let raf = 0, visible = true, alive = true, last = 0, t = 0;
    const m = { x: 0, y: 0, tx: 0, ty: 0 };
    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      cv.width = Math.max(1, Math.round(el.clientWidth * dpr));
      cv.height = Math.max(1, Math.round(el.clientHeight * dpr));
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(uRes, cv.width, cv.height);
      gl.uniform1f(uUnit, unit(cv.width, cv.height));
    };
    const frame = () => {
      gl.uniform1f(uTime, t);
      gl.uniform2f(uLean, m.x, m.y);
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
      m.y += (m.ty - m.y) * 0.04;
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
    // The pointer leans the whole sky a hair toward it, for depth.
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      m.tx = ((e.clientX - r.left) / r.width - 0.5) * 0.03;
      m.ty = ((e.clientY - r.top) / r.height - 0.5) * 0.015;
    };
    const onLeave = () => ((m.tx = 0), (m.ty = 0));
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
    t = 12;
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
  }, [key, lift, speed, motion]);

  return (
    <div
      ref={host}
      className={`orbd ${className}`}
      style={{ ["--orbd-0" as string]: palette[0], ["--orbd-1" as string]: palette[1], ["--orbd-2" as string]: palette[2], ["--orbd-3" as string]: palette[3], ...style }}
    >
      <canvas ref={canvas} className="orbd__canvas" aria-hidden="true" />
      {children && <div className="orbd__content">{children}</div>}
    </div>
  );
}
