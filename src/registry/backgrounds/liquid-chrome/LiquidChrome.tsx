"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import "./liquid-chrome.css";

/**
 * Liquid Chrome
 * A pool of molten metal that slowly folds over itself and mirrors a studio of soft coloured
 * lights. The surface is a moving height field; each point reflects the room, so the colour
 * bands slide and pinch as the metal flows. The pointer drops a ripple into it.
 */

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;
const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform float uCols; uniform vec2 uMouse; uniform float uLamp;
uniform vec3 uGlow; uniform vec3 uDeep; uniform vec3 uGround;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h1(i), h1(i + vec2(1, 0)), f.x), mix(h1(i + vec2(0, 1)), h1(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++){ v += a * vn(p); p = p * 2.02 + 7.3; a *= 0.5; } return v; }
float height(vec2 p, float t){
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
  return fbm(p + 1.8 * q + vec2(0.3 * t, 0.0));
}
vec3 room(vec3 r){
  // soft studio: two coloured walls, a bright strip light overhead and a dark floor
  float up = r.y;
  vec3 c = mix(uGround * 1.2, uDeep, smoothstep(-0.6, 0.3, up));
  c = mix(c, uGlow, smoothstep(0.1, 0.7, r.x * 0.6 + up * 0.5) * 0.85);
  c += vec3(1.0) * exp(-pow((up - 0.62) / 0.05, 2.0)) * 1.1;
  c += vec3(1.0) * exp(-pow((r.x + 0.55) / 0.04, 2.0)) * smoothstep(-0.2, 0.6, up) * 0.6;
  return c;
}
void main(){
  vec2 p = gl_FragCoord.xy / uRes.y * (uCols / 4.0);
  float t = uTime * 0.05;
  vec2 m = uMouse / uRes.y * (uCols / 4.0);
  float e = 0.003;
  float d = length(p - m);
  float rip = uLamp * 0.03 * sin(d * 34.0 - uTime * 5.0) * exp(-d * 3.5);
  float h0 = height(p, t) + rip;
  float hx = height(p + vec2(e, 0.0), t) + uLamp * 0.03 * sin(length(p + vec2(e, 0.0) - m) * 34.0 - uTime * 5.0) * exp(-length(p + vec2(e, 0.0) - m) * 3.5);
  float hy = height(p + vec2(0.0, e), t) + uLamp * 0.03 * sin(length(p + vec2(0.0, e) - m) * 34.0 - uTime * 5.0) * exp(-length(p + vec2(0.0, e) - m) * 3.5);
  vec3 n = normalize(vec3((h0 - hx) / e * 0.55, (h0 - hy) / e * 0.55, 1.0));
  vec3 r = reflect(vec3(0.0, 0.0, -1.0), n);
  vec3 col = room(r);
  float fres = pow(1.0 - n.z, 2.0);
  col = mix(col * 0.92, vec3(1.0), fres * 0.15);
  // a little darkening in the folds
  col *= 0.75 + 0.25 * smoothstep(0.2, 0.8, h0);
  gl_FragColor = vec4(col, 1.0);
}
`;

const rgb = (hex: string) => {
  const v = parseInt(hex.slice(1), 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255] as const;
};

export type LiquidChromePalette = { glow: string; deep: string; ground: string };
const DEFAULT: LiquidChromePalette = { glow: "#b9a6ff", deep: "#2b2f45", ground: "#0b0c10" };

type Props = { palette?: LiquidChromePalette; columns?: number; speed?: number; motion?: "full" | "reduced"; className?: string; style?: CSSProperties; children?: ReactNode };

export function LiquidChrome({ palette = DEFAULT, columns = 4, speed = 1, motion = "full", className = "", style, children }: Props) {
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
    <div ref={host} className={`lch ${className}`} style={{ ["--lch-glow" as string]: palette.glow, ["--lch-deep" as string]: palette.deep, ["--lch-ground" as string]: palette.ground, ...style }}>
      <canvas ref={canvas} className="lch__canvas" aria-hidden="true" />
      {children && <div className="lch__content">{children}</div>}
    </div>
  );
}
