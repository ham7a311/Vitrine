"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import "./glass-blinds.css";

/**
 * Glass Blinds
 * Horizontal slats of glass with light behind them. Each slat is a long lens that squeezes and
 * mirrors the glow, so soft light behind the blinds becomes a bright band along the middle of
 * every slat, dark at the seams. The pointer moves a lamp behind them.
 */

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;
const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform float uCols; uniform vec2 uMouse; uniform float uLamp;
uniform vec3 uGlow; uniform vec3 uDeep; uniform vec3 uGround;
void main(){
  vec2 p = gl_FragCoord.xy / uRes.y;
  float aspect = uRes.x / uRes.y;
  float t = uTime;
  float rows = uCols;
  float h = 1.0 / rows;
  float id = floor(p.y / h);
  float s = fract(p.y / h) - 0.5;
  float centre = (id + 0.5) * h;
  // the light behind: two broad glows drifting across, and a lamp under the pointer
  vec2 m = uMouse / uRes.y;
  float bend = pow(abs(s) * 2.0, 1.5);
  // cylinder lens: look through a squeezed, mirrored slice of what's behind
  vec2 look = vec2(p.x, centre - s * h * 1.7);
  vec2 c1 = vec2(aspect * (0.5 + 0.32 * sin(t * 0.11)), 0.62 + 0.18 * sin(t * 0.07));
  vec2 c2 = vec2(aspect * (0.5 + 0.38 * cos(t * 0.08 + 2.0)), 0.3 + 0.15 * cos(t * 0.1));
  vec2 d1 = (look - c1) * vec2(0.55, 1.6), d2 = (look - c2) * vec2(0.6, 1.8), dm = (look - m) * vec2(1.2, 2.2);
  float L = exp(-dot(d1, d1) / 0.08) + 0.8 * exp(-dot(d2, d2) / 0.06) + 1.3 * uLamp * exp(-dot(dm, dm) / 0.03);
  // each slat is brightest along its middle and falls into shadow at the seams
  float body = pow(cos(3.14159 * s), 0.7);
  float seam = smoothstep(0.46, 0.5, abs(s));
  vec3 col = uGround + uDeep * (0.45 + L * 1.1) * body + uGlow * L * body * (0.55 + 0.45 * (1.0 - bend));
  col += vec3(1.0) * pow(max(L * body - 0.9, 0.0), 2.0) * 0.5;
  col = mix(col, uGround * 0.3, seam);
  gl_FragColor = vec4(col, 1.0);
}
`;

const rgb = (hex: string) => {
  const v = parseInt(hex.slice(1), 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255] as const;
};

export type GlassBlindsPalette = { glow: string; deep: string; ground: string };
const DEFAULT: GlassBlindsPalette = { glow: "#8f9bff", deep: "#3a3fd6", ground: "#020208" };

type Props = { palette?: GlassBlindsPalette; columns?: number; speed?: number; motion?: "full" | "reduced"; className?: string; style?: CSSProperties; children?: ReactNode };

export function GlassBlinds({ palette = DEFAULT, columns = 8, speed = 1, motion = "full", className = "", style, children }: Props) {
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
    <div ref={host} className={`gbl ${className}`} style={{ ["--gbl-glow" as string]: palette.glow, ["--gbl-deep" as string]: palette.deep, ["--gbl-ground" as string]: palette.ground, ...style }}>
      <canvas ref={canvas} className="gbl__canvas" aria-hidden="true" />
      {children && <div className="gbl__content">{children}</div>}
    </div>
  );
}
