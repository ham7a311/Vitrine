"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import "./glass-ribbons.css";

/**
 * Glass Ribbons
 * Wide ribbons of glass waving slowly in front of moving light. Each ribbon is a long
 * cylindrical lens: it squeezes and mirrors the light behind it, so beams break into bright
 * lines along the ribbon's shoulders as the ribbons sway.
 */

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;
const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform float uCols; uniform vec2 uMouse; uniform float uLamp;
uniform vec3 uGlow; uniform vec3 uDeep; uniform vec3 uGround;
float light(vec2 p){
  float t = uTime;
  float v = 0.0;
  for (int i = 0; i < 3; i++){
    float fi = float(i);
    float y = 0.5 + 0.32 * sin(p.x * (0.9 + fi * 0.35) + t * (0.21 + fi * 0.07) + fi * 2.1) + 0.12 * sin(p.x * 2.7 - t * 0.3 + fi);
    v += exp(-pow((p.y - y) / 0.022, 2.0)) * (1.0 - fi * 0.18);
  }
  for (int i = 0; i < 3; i++){
    float fi = float(i);
    vec2 c = vec2(0.5 * uRes.x / uRes.y + 0.6 * sin(t * 0.13 + fi * 2.4), 0.5 + 0.35 * cos(t * 0.11 + fi * 1.7));
    v += exp(-dot(p - c, p - c) / 0.05) * 0.35;
  }
  vec2 m = uMouse / uRes.y;
  v += exp(-dot(p - m, p - m) / 0.012) * 1.2 * uLamp;
  return v;
}
void main(){
  vec2 p = gl_FragCoord.xy / uRes.y;
  float aspect = uRes.x / uRes.y;
  float w = aspect / uCols;
  float t = uTime;
  // ribbons sway: their centre line bends with height and time
  float bendAt = 0.18 * sin(p.y * 2.1 + t * 0.35) + 0.06 * sin(p.y * 5.3 - t * 0.5);
  float u = (p.x + bendAt) / w;
  float id = floor(u);
  float s = fract(u) - 0.5;
  float gap = smoothstep(0.47, 0.5, abs(s));
  vec2 centre = vec2((id + 0.5) * w - bendAt, p.y);
  // cylinder lens: sample a mirrored, squeezed slice slightly wider than the ribbon
  float bend = pow(abs(s) * 2.0, 1.6);
  vec2 look = vec2(centre.x - s * w * 1.9, p.y + 0.04 * s * s);
  float L = light(look);
  float face = light(vec2(centre.x + s * w * 0.4, p.y)) * 0.25;
  float shoulder = exp(-pow((abs(s) - 0.36) / 0.05, 2.0));
  vec3 col = uGround + uDeep * (0.06 + face) + uGlow * (L * (0.3 + 2.2 * bend) + face * 0.5) + vec3(1.0) * shoulder * 0.05;
  col += vec3(1.0) * pow(max(L * bend * 2.2 - 1.0, 0.0), 2.0) * 0.4;
  col *= 0.86 + 0.14 * cos(3.14159 * s);
  col = mix(col, uGround * 0.5, gap);
  gl_FragColor = vec4(col, 1.0);
}
`;

const rgb = (hex: string) => {
  const v = parseInt(hex.slice(1), 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255] as const;
};

export type GlassRibbonsPalette = { glow: string; deep: string; ground: string };
const DEFAULT: GlassRibbonsPalette = { glow: "#c25cff", deep: "#3a1a8a", ground: "#07040e" };

type Props = { palette?: GlassRibbonsPalette; columns?: number; speed?: number; motion?: "full" | "reduced"; className?: string; style?: CSSProperties; children?: ReactNode };

export function GlassRibbons({ palette = DEFAULT, columns = 7, speed = 1, motion = "full", className = "", style, children }: Props) {
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
    <div ref={host} className={`grb ${className}`} style={{ ["--grb-glow" as string]: palette.glow, ["--grb-deep" as string]: palette.deep, ["--grb-ground" as string]: palette.ground, ...style }}>
      <canvas ref={canvas} className="grb__canvas" aria-hidden="true" />
      {children && <div className="grb__content">{children}</div>}
    </div>
  );
}
