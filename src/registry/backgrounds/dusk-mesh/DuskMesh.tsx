"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Dusk Mesh
 * The soft mesh gradient, done properly. Five colour points drift on slow,
 * unrelated paths and are blended by distance, then warped so the blend
 * folds like silk; fine grain and dithering keep it from banding. The colour
 * nearest your pointer leans toward it on a spring, so the light seems to
 * follow you around the room.
 */

type Props = {
  /** Base plus five colour points (hex). */
  colors?: [string, string, string, string, string, string];
  /** Film grain strength, 0–1. */
  grain?: number;
  speed?: number;
  className?: string;
  children?: ReactNode;
};

const VERT = `attribute vec2 p; varying vec2 v; void main(){ v = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
varying vec2 v;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uP[5];
uniform vec3 uC[5];
uniform vec3 uBase;

void main() {
  float a = uRes.x / uRes.y;
  vec2 p = vec2(v.x * a, v.y);
  float t = uTime;
  // Fold the space a little, so the blend between colours bends like cloth.
  p += 0.06 * vec2(sin(p.y * 3.1 + t * 0.21), cos(p.x * 2.7 - t * 0.17));
  p += 0.03 * vec2(sin(p.y * 6.3 - t * 0.33), cos(p.x * 5.9 + t * 0.29));

  vec3 sum = uBase * 0.35;
  float wsum = 0.35;
  for (int i = 0; i < 5; i++) {
    vec2 d = p - vec2(uP[i].x * a, uP[i].y);
    float w = 1.0 / pow(dot(d, d) + 0.02, 1.6);
    sum += uC[i] * w;
    wsum += w;
  }
  vec3 col = sum / wsum;

  // Dither by one step so long gradients don't band.
  col += (fract(sin(dot(v * uRes + t, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0 * 2.0;
  gl_FragColor = vec4(col, 1.0);
}`;

const rgb = (hex: string) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

// A tileable grain texture, drawn in CSS above the canvas so it stays crisp at any render scale.
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 1.4 -0.2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")`;

export function DuskMesh({ colors = ["#1a1226", "#e8774f", "#f2b880", "#7b5ea7", "#2e3a87", "#f04f6b"], grain = 0.5, speed = 1, className = "", children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
    host.prepend(canvas);
    const gl = canvas.getContext("webgl", { antialias: false, powerPreference: "low-power" });
    if (!gl) { canvas.remove(); return; }

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const vs = sh(gl.VERTEX_SHADER, VERT);
    const fs = sh(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return () => canvas.remove();
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    gl.uniform3f(u("uBase"), ...(rgb(colors[0]) as [number, number, number]));
    gl.uniform3fv(u("uC"), new Float32Array(colors.slice(1).flatMap(rgb)));

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = !matchMedia("(hover: hover) and (pointer: fine)").matches;
    // A smooth field: half resolution is plenty, the grain above it stays crisp.
    const scale = 0.5;
    const gap = coarse ? 40 : 24;
    const home = [
      { x: 0.18, y: 0.78, ax: 0.12, ay: 0.1, fx: 0.031, fy: 0.023 },
      { x: 0.78, y: 0.82, ax: 0.1, ay: 0.12, fx: 0.019, fy: 0.027 },
      { x: 0.62, y: 0.38, ax: 0.16, ay: 0.12, fx: 0.023, fy: 0.017 },
      { x: 0.16, y: 0.22, ax: 0.1, ay: 0.14, fx: 0.027, fy: 0.021 },
      { x: 0.92, y: 0.2, ax: 0.08, ay: 0.1, fx: 0.017, fy: 0.029 },
    ];
    // Each point's pull toward the pointer, on its own spring.
    const lean = home.map(() => ({ x: 0, y: 0, vx: 0, vy: 0 }));
    const pts = new Float32Array(10);
    const ptr = { x: 0.5, y: 0.5, on: false };
    let raf = 0, last = 0, lastT = 0, visible = true;
    const t0 = performance.now();

    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * scale));
      const h = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
    };
    const draw = (now: number) => {
      resize();
      const t = reduced ? 30 : ((now - t0) / 1000) * speed * 6.28;
      const dt = Math.min(0.05, lastT ? (now - lastT) / 1000 : 0.016);
      lastT = now;
      const a = canvas.width / canvas.height;
      // The nearest point leans toward the pointer; the rest settle home.
      let near = -1, best = Infinity;
      if (ptr.on) home.forEach((h, i) => {
        const x = h.x + h.ax * Math.sin(t * h.fx + i), y = h.y + h.ay * Math.cos(t * h.fy + i * 1.7);
        const d = ((x - ptr.x) * a) ** 2 + (y - ptr.y) ** 2;
        if (d < best) { best = d; near = i; }
      });
      home.forEach((h, i) => {
        const bx = h.x + h.ax * Math.sin(t * h.fx + i), by = h.y + h.ay * Math.cos(t * h.fy + i * 1.7);
        const l = lean[i];
        const tx = i === near ? (ptr.x - bx) * 0.55 : 0, ty = i === near ? (ptr.y - by) * 0.55 : 0;
        l.vx += ((tx - l.x) * 26 - l.vx * 7) * dt;
        l.vy += ((ty - l.y) * 26 - l.vy * 7) * dt;
        l.x += l.vx * dt;
        l.y += l.vy * dt;
        pts[i * 2] = bx + l.x;
        pts[i * 2 + 1] = by + l.y;
      });
      gl.uniform2f(u("uRes"), canvas.width, canvas.height);
      gl.uniform1f(u("uTime"), t);
      gl.uniform2fv(u("uP"), pts);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (now: number) => {
      if (!visible || document.hidden) { raf = 0; lastT = 0; return; }
      raf = requestAnimationFrame(loop);
      if (now - last < gap) return;
      last = now;
      draw(now);
    };
    const wake = () => { if (!reduced && !raf && visible && !document.hidden) raf = requestAnimationFrame(loop); };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = 1 - (e.clientY - r.top) / r.height;
      ptr.on = x >= 0 && x <= 1 && y >= 0 && y <= 1;
      if (ptr.on) { ptr.x = x; ptr.y = y; }
    };

    draw(performance.now());
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); });
    io.observe(host);
    const ro = new ResizeObserver(() => reduced && draw(performance.now()));
    ro.observe(host);
    document.addEventListener("visibilitychange", wake);
    if (!reduced) {
      wake();
      if (!coarse) window.addEventListener("pointermove", onMove, { passive: true });
    }
    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("pointermove", onMove);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, [colors, speed]);

  return (
    <div
      ref={hostRef}
      className={`relative isolate overflow-hidden ${className}`}
      style={{ background: `radial-gradient(60% 60% at 20% 25%, ${colors[1]}, transparent), radial-gradient(60% 60% at 80% 20%, ${colors[2]}, transparent), radial-gradient(70% 70% at 60% 75%, ${colors[3]}, transparent), ${colors[0]}` }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]" style={{ backgroundImage: GRAIN, opacity: grain * 0.55, mixBlendMode: "overlay" }} />
      {children && <div className="relative z-[2] h-full">{children}</div>}
    </div>
  );
}
