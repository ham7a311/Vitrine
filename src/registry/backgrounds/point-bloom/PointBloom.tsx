"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { bloomPoints, rgb, SHELLS } from "./bloom";
import "./point-bloom.css";

/**
 * Point Bloom
 * Four nested shells of fine points, each warped by slow noise into a lumpy, petal-like form and
 * turning at its own pace, so the layers slide past each other like folded membranes. Drawn
 * additively, the edges of every shell gather into bright rims while the middle stays dark,
 * dusted with loose points. A fine pointer pushes the cloud open around it.
 */

/** [rim, membrane, dust] */
export type PointBloomPalette = [string, string, string];

const VERT = `attribute vec3 aDir; attribute vec2 aMeta;
uniform float uTime; uniform float uScale; uniform vec2 uRes; uniform float uDpr; uniform vec3 uPtr;
uniform float uShells[4];
varying float vA; varying float vDust;
float wave(vec3 p, float t){
  return sin(p.x * 2.1 + t * 0.9) * 0.5 + sin(p.y * 2.7 - t * 0.7 + p.z * 1.3) * 0.32 + sin(p.z * 3.3 + t * 0.5 + p.x * 1.7) * 0.22
    + sin((p.x + p.y) * 4.6 - t * 1.1) * 0.12;
}
mat3 rotY(float a){ float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
mat3 rotX(float a){ float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }
void main(){
  float sh = aMeta.x;
  float seed = aMeta.y;
  float t = uTime;
  vec3 p;
  if (sh < -0.5) {
    p = rotY(t * 0.05) * aDir;
    vDust = 1.0;
  } else {
    vDust = 0.0;
    float k = sh + 1.0;
    float base = sh < 0.5 ? uShells[0] : sh < 1.5 ? uShells[1] : sh < 2.5 ? uShells[2] : uShells[3];
    // each shell is a sphere pushed in and out by its own slow wave, turning at its own pace
    vec3 d = rotX(0.4 * k + t * 0.03 * k) * rotY(t * (0.06 + 0.035 * k) * (mod(sh, 2.0) < 0.5 ? 1.0 : -1.0)) * aDir;
    float n = wave(d * (1.0 + 0.25 * k) + k * 3.1, t * 0.35 + k);
    p = d * base * (1.0 + 0.26 * n);
  }
  // a fine pointer pushes nearby points outward
  vec2 sp = p.xy;
  vec2 dv = sp - uPtr.xy;
  float push = uPtr.z * 0.16 * exp(-dot(dv, dv) * 9.0);
  p.xy += normalize(sp + 1e-4) * push;
  float persp = 1.0 / (1.0 + p.z * 0.22);
  gl_Position = vec4(p.xy * persp * uScale / (uRes * 0.5), 0.0, 1.0);
  float facing = 1.0 - abs(normalize(p).z);
  vA = vDust > 0.5 ? 0.75 + 0.25 * sin(t * (0.8 + seed * 2.0) + seed * 40.0) : (0.01 + 0.9 * pow(facing, 2.4)) * (0.6 + 0.4 * seed);
  gl_PointSize = (vDust > 0.5 ? 2.4 : 2.0) * uDpr * persp * (uScale / 300.0);
}`;
const FRAG = `precision mediump float;
uniform vec3 uRim, uMem, uDust;
varying float vA; varying float vDust;
void main(){
  vec2 d = gl_PointCoord - 0.5;
  float a = smoothstep(0.25, 0.05, dot(d, d)) * vA;
  vec3 c = vDust > 0.5 ? uDust : mix(uMem, uRim, clamp(vA * 1.6, 0.0, 1.0));
  gl_FragColor = vec4(c * a, a);
}`;

type Props = {
  palette?: PointBloomPalette;
  /** Points per shell (four shells). */
  density?: number;
  /** Size as a fraction of the smaller side. */
  radius?: number;
  speed?: number;
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

const DEFAULT: PointBloomPalette = ["#ffffff", "#9a9a9a", "#ffffff"];

export function PointBloom({ palette = DEFAULT, density = 20000, radius = 0.44, speed = 1, motion = "full", className = "", style, children }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const key = palette.join();

  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv) return;
    const gl = cv.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false });
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
    gl.bindAttribLocation(pr, 0, "aDir");
    gl.bindAttribLocation(pr, 1, "aMeta");
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return void (el.dataset.fallback = "");
    gl.useProgram(pr);
    const per = coarse ? Math.round(density * 0.6) : density;
    const { pos, meta, count } = bloomPoints(per);
    const buf = (data: Float32Array, loc: number, size: number) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    };
    buf(pos, 0, 3);
    buf(meta, 1, 2);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.clearColor(0, 0, 0, 1);
    const U = (n: string) => gl.getUniformLocation(pr, n);
    const [uTime, uScale, uRes, uDpr, uPtr] = ["uTime", "uScale", "uRes", "uDpr", "uPtr"].map(U);
    gl.uniform1fv(U("uShells"), new Float32Array(SHELLS));
    const cols = key.split(",");
    ["uRim", "uMem", "uDust"].forEach((n, i) => gl.uniform3f(U(n), ...rgb(cols[i])));

    let raf = 0, visible = true, alive = true, last = 0, t = 0;
    const ptr = { x: 0, y: 0, s: 0, ts: 0 };
    let scale = 1;
    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      cv.width = Math.max(1, Math.round(el.clientWidth * dpr));
      cv.height = Math.max(1, Math.round(el.clientHeight * dpr));
      gl.viewport(0, 0, cv.width, cv.height);
      scale = Math.min(cv.width, cv.height) * radius;
      gl.uniform2f(uRes, cv.width, cv.height);
      gl.uniform1f(uDpr, dpr);
      gl.uniform1f(uScale, scale);
    };
    const frame = () => {
      gl.uniform1f(uTime, t);
      gl.uniform3f(uPtr, ptr.x, ptr.y, ptr.s);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, count);
    };
    const tick = (now: number) => {
      raf = 0;
      if (!alive || !visible || document.hidden) return;
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0.016;
      last = now;
      t += dt * speed;
      ptr.s += (ptr.ts - ptr.s) * 0.06;
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
      const dpr = cv.width / r.width;
      // pointer in the cloud's own units (1 = shell radius)
      ptr.x = ((e.clientX - r.left - r.width / 2) * dpr) / scale;
      ptr.y = (-(e.clientY - r.top - r.height / 2) * dpr) / scale;
      ptr.ts = 1;
    };
    const onLeave = () => (ptr.ts = 0);
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
    t = 4;
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
  }, [key, density, radius, speed, motion]);

  return (
    <div ref={host} className={`ptbl ${className}`} style={{ ["--ptbl-rim" as string]: palette[0], ["--ptbl-mem" as string]: palette[1], ...style }}>
      <canvas ref={canvas} className="ptbl__canvas" aria-hidden="true" />
      {children && <div className="ptbl__content">{children}</div>}
    </div>
  );
}
