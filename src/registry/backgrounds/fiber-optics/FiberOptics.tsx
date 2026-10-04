"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import "./fiber-optics.css";

/**
 * Fiber Optics
 * A sheaf of optical fibres fanning up from one bundle, each glowing faintly along its length
 * and carrying pulses of light that bloom at its tip. The pointer warms the fibres it passes.
 */

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;
const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform float uCols; uniform vec2 uMouse; uniform float uLamp;
uniform vec3 uGlow; uniform vec3 uDeep; uniform vec3 uGround;
float hash(float n){ return fract(sin(n * 91.345) * 47453.5453); }
void main(){
  vec2 p = gl_FragCoord.xy / uRes.y;
  float aspect = uRes.x / uRes.y;
  float t = uTime;
  vec2 m = uMouse / uRes.y;
  vec3 col = uGround;
  float N = uCols;
  for (int i = 0; i < 48; i++){
    float fi = float(i);
    if (fi >= N) break;
    float k = (fi + 0.5) / N;
    float hk = hash(fi + 3.0);
    // from a bundle at the bottom centre, fanning out as it rises
    float tipY = 0.62 + 0.3 * hash(fi + 11.0);
    float y = clamp(p.y / tipY, 0.0, 1.0);
    float spread = (k - 0.5) * aspect * 1.05;
    float x = aspect * 0.5 + spread * pow(y, 0.8) + 0.03 * sin(p.y * 3.0 + t * 0.4 + fi) * y;
    float d = abs(p.x - x);
    if (p.y > tipY + 0.05) continue;
    vec3 c = mix(uDeep * 1.6, uGlow, hk);
    float near = uLamp * exp(-dot(p - m, p - m) / 0.02);
    float body = exp(-d * d / 0.0000035) * (0.16 + near * 0.8) * step(p.y, tipY);
    float ph = fract(p.y / tipY * 0.8 - t * (0.18 + 0.12 * hk) - hk);
    float pulse = exp(-pow((ph - 0.5) / 0.035, 2.0)) * step(p.y, tipY);
    float halo = exp(-d * d / 0.00006) * pulse * 0.9;
    vec2 tip = vec2(aspect * 0.5 + spread + 0.03 * sin(tipY * 3.0 + t * 0.4 + fi), tipY);
    float tipGlow = exp(-dot(p - tip, p - tip) / 0.00012) * (0.6 + 0.4 * sin(t * 1.5 + fi)) + exp(-dot(p - tip, p - tip) / 0.002) * 0.12;
    col += c * (body + halo + tipGlow) + vec3(1.0) * pulse * exp(-d * d / 0.000004) * 0.5;
  }
  // the bundle itself, a dark collar at the bottom
  col *= 1.0 - 0.8 * exp(-pow((p.x - aspect * 0.5) / 0.06, 2.0)) * smoothstep(0.08, 0.0, p.y);
  gl_FragColor = vec4(col, 1.0);
}
`;

const rgb = (hex: string) => {
  const v = parseInt(hex.slice(1), 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255] as const;
};

export type FiberOpticsPalette = { glow: string; deep: string; ground: string };
const DEFAULT: FiberOpticsPalette = { glow: "#7fd8ff", deep: "#2a3f9a", ground: "#03050c" };

type Props = { palette?: FiberOpticsPalette; columns?: number; speed?: number; motion?: "full" | "reduced"; className?: string; style?: CSSProperties; children?: ReactNode };

export function FiberOptics({ palette = DEFAULT, columns = 40, speed = 1, motion = "full", className = "", style, children }: Props) {
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
    <div ref={host} className={`fop ${className}`} style={{ ["--fop-glow" as string]: palette.glow, ["--fop-deep" as string]: palette.deep, ["--fop-ground" as string]: palette.ground, ...style }}>
      <canvas ref={canvas} className="fop__canvas" aria-hidden="true" />
      {children && <div className="fop__content">{children}</div>}
    </div>
  );
}
