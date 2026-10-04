"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import "./light-curtain.css";

/**
 * Light Curtain
 * A curtain of soft vertical light, like an aurora seen edge-on or a wall of spectrum bars
 * breathing to music nobody else can hear. Streaks drift, swell and fade on their own; the
 * pointer brightens the streaks it passes and pulls them toward it.
 */

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;
const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform float uCols; uniform vec2 uMouse; uniform float uLamp;
uniform vec3 uGlow; uniform vec3 uDeep; uniform vec3 uGround;
float h1(float x){ return fract(sin(x * 127.1) * 43758.5453); }
float n1(float x){ float i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f); return mix(h1(i), h1(i + 1.0), f); }
void main(){
  vec2 p = gl_FragCoord.xy / uRes.y;
  float aspect = uRes.x / uRes.y;
  float t = uTime;
  vec2 m = uMouse / uRes.y;
  // the pointer pulls nearby streaks sideways toward it
  float dx = p.x - m.x;
  float x = p.x - uLamp * 0.06 * dx * exp(-dx * dx / 0.02);
  float u = x / aspect * uCols;
  // streaks: layered 1-D noise across x, each layer drifting and breathing at its own pace
  float s = 0.0;
  s += n1(u * 0.55 + t * 0.05) * 0.55;
  s += n1(u * 1.7 - t * 0.09 + 13.0) * 0.3;
  s += n1(u * 5.3 + t * 0.21 + 41.0) * 0.18;
  s += n1(u * 13.0 - t * 0.35 + 7.0) * 0.08;
  float breathe = 0.65 + 0.35 * sin(t * 0.6 + n1(u * 0.8) * 6.28);
  float streak = pow(clamp(s * 1.2, 0.0, 1.0), 2.5) * breathe;
  // a vertical envelope: brightest through the middle, fading to dark at top and bottom, a little wavy
  float mid = 0.5 + 0.06 * sin(u * 0.7 + t * 0.2);
  float env = exp(-pow((p.y - mid) / 0.62, 2.0));
  float near = uLamp * exp(-dx * dx / 0.012);
  float v = streak * env * (4.2 + near * 3.0);
  vec3 tint = mix(uDeep, uGlow, 0.4 + 0.6 * n1(u * 0.3 + 5.0 + t * 0.03));
  vec3 col = uGround + tint * v + vec3(1.0) * pow(max(v - 0.75, 0.0), 2.0) * 0.5;
  gl_FragColor = vec4(col, 1.0);
}
`;

const rgb = (hex: string) => {
  const v = parseInt(hex.slice(1), 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255] as const;
};

export type LightCurtainPalette = { glow: string; deep: string; ground: string };
const DEFAULT: LightCurtainPalette = { glow: "#ff5fc8", deep: "#7a2bff", ground: "#06030a" };

type Props = { palette?: LightCurtainPalette; columns?: number; speed?: number; motion?: "full" | "reduced"; className?: string; style?: CSSProperties; children?: ReactNode };

export function LightCurtain({ palette = DEFAULT, columns = 16, speed = 1, motion = "full", className = "", style, children }: Props) {
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
    const u = { res: U("uRes"), time: U("uTime"), cols: U("uCols"), mouse: U("uMouse"), lamp: U("uLamp") };
    gl.uniform3f(U("uGlow"), ...rgb(palette.glow));
    gl.uniform3f(U("uDeep"), ...rgb(palette.deep));
    gl.uniform3f(U("uGround"), ...rgb(palette.ground));

    let scale = 1, raf = 0, visible = true, alive = true, last = 0, t = 12;
    const m = { x: 0, y: 0, tx: 0, ty: 0, l: 0, tl: 0 };
    const size = () => {
      scale = Math.min(devicePixelRatio || 1, 2) * (coarse ? 0.6 : 0.85);
      cv.width = Math.max(1, Math.round(el.clientWidth * scale));
      cv.height = Math.max(1, Math.round(el.clientHeight * scale));
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(u.res, cv.width, cv.height);
      // Fewer, bigger tiles on narrow screens.
      gl.uniform1f(u.cols, el.clientWidth < 640 ? Math.max(4, Math.round(columns * 0.55)) : columns);
    };
    const frame = () => {
      gl.uniform1f(u.time, t);
      gl.uniform2f(u.mouse, m.x, m.y);
      gl.uniform1f(u.lamp, m.l);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const tick = (now: number) => {
      raf = 0;
      if (!alive || !visible || document.hidden) return;
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0.016;
      if (coarse && now - last < 33) return void (raf = requestAnimationFrame(tick));
      last = now;
      t += dt * speed;
      m.x += (m.tx - m.x) * 0.12;
      m.y += (m.ty - m.y) * 0.12;
      m.l += (m.tl - m.l) * 0.06;
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
      if (!m.l) {
        m.x = m.tx;
        m.y = m.ty;
      }
      m.tl = 1;
    };
    const onLeave = () => (m.tl = 0);
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
  }, [palette, columns, speed, motion]);

  return (
    <div ref={host} className={`lcu ${className}`} style={{ ["--lcu-glow" as string]: palette.glow, ["--lcu-deep" as string]: palette.deep, ["--lcu-ground" as string]: palette.ground, ...style }}>
      <canvas ref={canvas} className="lcu__canvas" aria-hidden="true" />
      {children && <div className="lcu__content">{children}</div>}
    </div>
  );
}
