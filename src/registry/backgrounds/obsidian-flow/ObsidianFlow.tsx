"use client";
import { useEffect, useRef, type ReactNode } from "react";
import "./obsidian-flow.css";

export type ObsidianFlowProps = {
  theme?: "light" | "dark";
  /** Strength of the reflections, 0.4 (matte) to 1.6 (wet). */
  gloss?: number;
  /** The faint square grid over the liquid. */
  grid?: boolean;
  /** Ripples follow a fine pointer. */
  cursor?: boolean;
  motion?: boolean;
  /** Optional content laid over the liquid. */
  children?: ReactNode;
  className?: string;
};

const VERT = "attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }";

// Obsidian: domain-warped noise read as a height field of glossy black liquid,
// lit by one cold key light and a dim studio wash. Small, many swirls.
const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec3 uMouse;
uniform vec3 uBase; uniform vec3 uRefl; uniform vec3 uHot; uniform float uLight; uniform float uGloss;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; } return v; }
float height(vec2 p){
  float t = uTime * 0.06;
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 3.2 * q + vec2(1.7, 9.2) + t * 0.7), fbm(p + 3.2 * q + vec2(8.3, 2.8) - t * 0.5));
  float h = fbm(p + 3.6 * r);
  vec2 m = p - uMouse.xy;
  h += 0.05 * uMouse.z * sin(length(m) * 26.0 - uTime * 3.0) * exp(-dot(m, m) * 5.0);
  return h;
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = vec2(uv.x * uRes.x / uRes.y, uv.y) * 1.5;
  float e = 0.004;
  float c = height(p);
  vec2 g = vec2(height(p + vec2(e, 0.0)) - c, height(p + vec2(0.0, e)) - c) / e;
  vec3 n = normalize(vec3(-g * 0.32, 1.0));
  vec3 v = vec3(0.0, 0.0, 1.0);
  vec3 L = normalize(vec3(0.35, 0.55, 0.75));
  float spec = pow(max(dot(reflect(-L, n), v), 0.0), 22.0);
  float sheen = pow(max(dot(reflect(-L, n), v), 0.0), 4.0);
  float fres = pow(1.0 - max(n.z, 0.0), 2.0);
  vec3 col = uBase;
  col += uRefl * (sheen * 0.42 + fres * 1.25) * uGloss;
  col += uHot * spec * 0.7 * uGloss;
  // Liquid settles darker toward the floor of the frame.
  col *= mix(1.0, smoothstep(-0.1, 0.6, uv.y), 1.0 - uLight * 0.6);
  gl_FragColor = vec4(col, 1.0);
}`;

type RGB = [number, number, number];
const hex = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as RGB;
const PAL = {
  dark: { base: "#07090c", refl: "#2b3a4c", hot: "#9fb4cc", light: 0 },
  light: { base: "#c9cfd6", refl: "#f4f7fa", hot: "#ffffff", light: 1 },
};

/**
 * Obsidian Flow
 * A pool of black liquid that slowly folds and catches cold light, under a
 * faint square grid. A background only: no text of its own.
 */
export function ObsidianFlow({ theme = "dark", gloss = 1, grid = true, cursor = true, motion = true, children, className = "" }: ObsidianFlowProps) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv) return;
    const gl = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return void (el.dataset.fallback = "");
    const still = !motion || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mk = (t: number, s: string) => { const sh = gl.createShader(t)!; gl.shaderSource(sh, s); gl.compileShader(sh); return sh; };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, mk(gl.VERTEX_SHADER, VERT));
    gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, FRAG));
    gl.bindAttribLocation(pr, 0, "p");
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return void (el.dataset.fallback = "");
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(pr, n);
    const pal = PAL[theme];
    gl.uniform3f(U("uBase"), ...hex(pal.base));
    gl.uniform3f(U("uRefl"), ...hex(pal.refl));
    gl.uniform3f(U("uHot"), ...hex(pal.hot));
    gl.uniform1f(U("uLight"), pal.light);
    gl.uniform1f(U("uGloss"), Math.min(1.6, Math.max(0.4, gloss)));
    const uRes = U("uRes"), uTime = U("uTime"), uMouse = U("uMouse");
    delete el.dataset.fallback;

    const coarse = !matchMedia("(hover: hover) and (pointer: fine)").matches;
    let raf = 0, last = 0, t = 20, visible = true, aspect = 1;
    const m = { x: 0, y: 0, z: 0, tz: 0 };
    const size = () => {
      const s = Math.min(devicePixelRatio || 1, 2) * (coarse ? 0.45 : 0.6);
      cv.width = Math.max(1, Math.round(el.clientWidth * s));
      cv.height = Math.max(1, Math.round(el.clientHeight * s));
      aspect = el.clientWidth / Math.max(1, el.clientHeight);
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(uRes, cv.width, cv.height);
    };
    const frame = () => { gl.uniform1f(uTime, t); gl.uniform3f(uMouse, m.x, m.y, m.z); gl.drawArrays(gl.TRIANGLES, 0, 3); };
    const tick = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0.016;
      // Touch devices draw at about 30fps.
      if (coarse && last && now - last < 33) return void (raf = requestAnimationFrame(tick));
      last = now;
      t += dt;
      m.z += (m.tz - m.z) * 0.04;
      frame();
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (still) return frame(); if (!raf) { last = 0; raf = requestAnimationFrame(tick); } };
    const onMove = (e: PointerEvent) => {
      if (!cursor || e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      m.x = ((e.clientX - r.left) / r.width) * aspect * 1.5; m.y = (1 - (e.clientY - r.top) / r.height) * 1.5; m.tz = 1;
    };
    const onLeave = () => { m.tz = 0; };
    const ro = new ResizeObserver(() => { size(); frame(); });
    ro.observe(el);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) start(); });
    io.observe(el);
    const onVis = () => { if (!document.hidden) start(); };
    size(); start();
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [theme, motion, gloss, cursor]);

  return (
    <div ref={host} className={`obsf obsf--${theme} ${className}`} data-fallback="">
      <canvas ref={canvas} className="obsf__pool" aria-hidden="true" />
      {grid && <div className="obsf__grid" aria-hidden="true" />}
      {children && <div className="obsf__content">{children}</div>}
    </div>
  );
}
