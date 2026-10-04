"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import "./dither-flow.css";

/**
 * Dither Flow
 * Slow folds of satin light, printed in four tones with an ordered dither on a coarse pixel
 * grid — the crunch of a one-bit screen with the softness of silk. The pointer stirs a slow
 * swirl into the folds.
 */

export type DitherFlowPalette = [string, string, string, string];

const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform float uCell; uniform vec2 uMouse; uniform float uStir;
uniform vec3 uC0, uC1, uC2, uC3;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 3; i++){ v += a * n(p); p = p * 2.03 + 11.7; a *= 0.5; } return v; }
float bayer4(vec2 c){
  vec2 m = mod(c, 4.0);
  int i = int(m.x + m.y * 4.0);
  // 4x4 Bayer, row-major
  float b[16];
  b[0]=0.;b[1]=8.;b[2]=2.;b[3]=10.;b[4]=12.;b[5]=4.;b[6]=14.;b[7]=6.;b[8]=3.;b[9]=11.;b[10]=1.;b[11]=9.;b[12]=15.;b[13]=7.;b[14]=13.;b[15]=5.;
  float r = 0.0;
  for (int k = 0; k < 16; k++) if (k == i) r = b[k];
  return (r + 0.5) / 16.0;
}
float field(vec2 p, float t){
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 1.7 * q + vec2(1.7, 9.2) + 0.5 * t), fbm(p + 1.7 * q + vec2(8.3, 2.8)));
  return fbm(p + 1.5 * r);
}
void main(){
  vec2 cell = floor(gl_FragCoord.xy / uCell);
  vec2 uv = (cell * uCell + 0.5 * uCell) / uRes.y;
  vec2 p = uv * 0.75;
  // stir: a slow rotation round the pointer, strongest close in
  vec2 m = uMouse / uRes.y * 0.75;
  vec2 d = p - m;
  float ang = uStir * exp(-dot(d, d) * 6.0) * 1.4;
  p = m + mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * d;
  float t = uTime * 0.03;
  // The field is a height map of folded cloth: light it, so ridges catch thin highlights.
  float e = 0.004;
  float h0 = field(p, t);
  float hx = field(p + vec2(e, 0.0), t), hy = field(p + vec2(0.0, e), t);
  vec3 nrm = normalize(vec3((h0 - hx) / e * 0.09, (h0 - hy) / e * 0.09, 1.0) * vec3(9.0, 9.0, 1.0));
  vec3 L = normalize(vec3(-0.55, 0.45, 0.7));
  float diff = max(dot(nrm, L), 0.0);
  float spec = pow(max(dot(reflect(-L, nrm), vec3(0.0, 0.0, 1.0)), 0.0), 36.0);
  float b = pow(diff, 4.6) * 0.95 + spec * 0.85;
  b *= smoothstep(0.3, 0.56, h0 + 0.08);
  b = clamp(b, 0.0, 1.0);
  // four tones, ordered-dithered between neighbours
  float lv = b * 3.0;
  float base = floor(lv);
  float tone = base + step(bayer4(cell), lv - base);
  vec3 col = tone < 0.5 ? uC0 : tone < 1.5 ? uC1 : tone < 2.5 ? uC2 : uC3;
  gl_FragColor = vec4(col, 1.0);
}`;
const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;

const rgb = (hex: string) => {
  const v = parseInt(hex.slice(1), 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255] as const;
};

type Props = {
  /** [ground, body, light, crest] */
  palette?: DitherFlowPalette;
  /** CSS px per pixel. */
  cell?: number;
  speed?: number;
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

const DEFAULT_PALETTE: DitherFlowPalette = ["#09090b", "#4b2bff", "#a996ff", "#ffffff"];

export function DitherFlow({ palette = DEFAULT_PALETTE, cell = 2, speed = 1, motion = "full", className = "", style, children }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

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
    const [uRes, uTime, uCell, uMouse, uStir] = ["uRes", "uTime", "uCell", "uMouse", "uStir"].map(U);
    palette.forEach((c, i) => gl.uniform3f(U(`uC${i}`), ...rgb(c)));

    let dpr = 1, raf = 0, visible = true, alive = true, last = 0, t = 0;
    const m = { x: 0, y: 0, tx: 0, ty: 0, s: 0, ts: 0 };
    const size = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      cv.width = Math.max(1, Math.round(el.clientWidth * dpr));
      cv.height = Math.max(1, Math.round(el.clientHeight * dpr));
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(uRes, cv.width, cv.height);
      gl.uniform1f(uCell, Math.max(1, Math.round(cell * dpr)));
      if (!m.tx) m.x = m.tx = cv.width * 0.6;
      if (!m.ty) m.y = m.ty = cv.height * 0.5;
    };
    const frame = () => {
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, m.x, m.y);
      gl.uniform1f(uStir, m.s);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const tick = (now: number) => {
      raf = 0;
      if (!alive || !visible || document.hidden) return;
      // ~30fps is plenty for a slow field, and halves the GPU cost.
      if (now - last < (coarse ? 40 : 32)) return void (raf = requestAnimationFrame(tick));
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0.016;
      last = now;
      t += dt * speed;
      m.x += (m.tx - m.x) * 0.06;
      m.y += (m.ty - m.y) * 0.06;
      m.s += (m.ts - m.s) * 0.04;
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
    t = 40;
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
  }, [palette, cell, speed, motion]);

  return (
    <div
      ref={host}
      className={`dfl ${className}`}
      style={{ ["--dfl-0" as string]: palette[0], ["--dfl-1" as string]: palette[1], ["--dfl-2" as string]: palette[2], ...style }}
    >
      <canvas ref={canvas} className="dfl__canvas" aria-hidden="true" />
      {children && <div className="dfl__content">{children}</div>}
    </div>
  );
}
