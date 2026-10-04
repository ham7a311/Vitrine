"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import "./glass-tiles.css";

/**
 * Glass Tiles
 * A wall of thick rounded glass tiles with light moving behind it. Each tile refracts the light
 * through its bevel, so a passing beam becomes a bright line hugging the tile's inner edge —
 * the light seems to live inside the glass. The pointer carries a lamp behind the wall.
 */

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;
const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform float uCols; uniform vec2 uMouse; uniform float uLamp;
uniform vec3 uGlow; uniform vec3 uDeep; uniform vec3 uGround;

// The light behind the glass: a few slow beams and soft pools, in screen units (y 0..1).
float light(vec2 p){
  float t = uTime;
  float v = 0.0;
  for (int i = 0; i < 3; i++){
    float fi = float(i);
    float y = 0.5 + 0.32 * sin(p.x * (0.9 + fi * 0.35) + t * (0.21 + fi * 0.07) + fi * 2.1) + 0.12 * sin(p.x * 2.7 - t * 0.3 + fi);
    v += exp(-pow((p.y - y) / 0.02, 2.0)) * (1.0 - fi * 0.18);
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
  float size = aspect / uCols;
  vec2 id = floor(p / size);
  vec2 q = (fract(p / size) - 0.5) * 2.0;            // -1..1 inside a tile
  // A squircle (|x|^9 + |y|^9)^(1/9): rounded corners and a normal with no creases on the diagonals.
  vec2 aq = abs(q);
  float sq = pow(pow(aq.x, 9.0) + pow(aq.y, 9.0), 1.0 / 9.0);
  float d = sq - 0.955;                                // leaves a thin grout
  if (d > 0.0) { gl_FragColor = vec4(uGround * 0.6, 1.0); return; }
  // Bevel: the outer part of the tile bends light inwards.
  float edge = clamp(1.0 + d / 0.55, 0.0, 1.0);
  vec2 g = normalize(sign(q) * pow(aq + 1e-4, vec2(8.0)));
  float bend = pow(edge, 2.2);
  vec2 centre = (id + 0.5) * size;
  // Through the face the light is sampled almost straight; through the bevel it is pulled from across the tile.
  vec2 look = centre + q * size * 0.5 * (1.0 - 0.55 * bend) - g * bend * size * 0.9;
  float L = light(look);
  // Frosted face: dim and soft; bevel: bright, a sharp line where the beam is caught.
  float face = light(centre + q * size * 0.32) * 0.3;
  float rim = L * pow(edge, 1.5) * 3.2;
  float fres = pow(edge, 8.0) * 0.08;
  vec3 col = uGround + uDeep * (face + 0.04) + uGlow * (rim + face * 0.6) + vec3(1.0) * pow(max(rim - 1.2, 0.0), 2.0) * 0.35 + fres;
  // a faint inner gradient so each tile reads as a thick block
  col *= 0.85 + 0.15 * (0.5 + 0.5 * q.y);
  gl_FragColor = vec4(col, 1.0);
}`;

const rgb = (hex: string) => {
  const v = parseInt(hex.slice(1), 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255] as const;
};

export type GlassTilesPalette = { glow: string; deep: string; ground: string };
const DEFAULT: GlassTilesPalette = { glow: "#c25cff", deep: "#3a1a8a", ground: "#07040e" };

type Props = { palette?: GlassTilesPalette; columns?: number; speed?: number; motion?: "full" | "reduced"; className?: string; style?: CSSProperties; children?: ReactNode };

export function GlassTiles({ palette = DEFAULT, columns = 8, speed = 1, motion = "full", className = "", style, children }: Props) {
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
    <div ref={host} className={`gt ${className}`} style={{ ["--gt-glow" as string]: palette.glow, ["--gt-deep" as string]: palette.deep, ["--gt-ground" as string]: palette.ground, ...style }}>
      <canvas ref={canvas} className="gt__canvas" aria-hidden="true" />
      {children && <div className="gt__content">{children}</div>}
    </div>
  );
}
