"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { rgb, spherePoints } from "./globe";
import "./ember-globe.css";

/**
 * Ember Globe
 * A slowly turning sphere drawn in thousands of points of light: the upper half glows like
 * embers, from a hot cap at the pole down to scattered amber sparks, the lower half is cool
 * white, and the equator thins to almost nothing between them. Points twinkle, and a fine
 * pointer tips the globe toward it.
 */

/** [hot pole, ember, spark, cool half] */
export type EmberGlobePalette = [string, string, string, string];

const VERT = `attribute vec3 aPos; attribute float aSeed;
uniform float uTime; uniform vec2 uTilt; uniform float uScale; uniform vec2 uRes; uniform float uDpr; uniform float uSize;
uniform vec3 uHot, uEmber, uSpark, uCool;
varying vec3 vCol; varying float vA;
void main(){
  float a = uTime * 0.12;
  vec3 p = aPos;
  // turn round the vertical axis, then tip toward the viewer
  p = vec3(p.x * cos(a) + p.z * sin(a), p.y, -p.x * sin(a) + p.z * cos(a));
  float tx = 0.32 + uTilt.y;
  p = vec3(p.x, p.y * cos(tx) - p.z * sin(tx), p.y * sin(tx) + p.z * cos(tx));
  float ty = uTilt.x;
  p = vec3(p.x * cos(ty) + p.z * sin(ty), p.y, -p.x * sin(ty) + p.z * cos(ty));
  float persp = 1.0 / (1.0 + p.z * 0.18);
  vec2 xy = p.xy * persp * uScale;
  gl_Position = vec4(xy / (uRes * 0.5), 0.0, 1.0);
  float y = aPos.y;
  // colour by latitude: hot cap, ember, sparks near the equator; the lower half is cool
  vec3 warm = mix(uSpark, uEmber, smoothstep(0.05, 0.4, y + (aSeed - 0.5) * 0.25));
  warm = mix(warm, uHot, smoothstep(0.62, 0.96, y));
  vCol = y > 0.0 ? warm : uCool;
  float tw = 0.55 + 0.45 * sin(uTime * (1.2 + aSeed * 2.6) + aSeed * 60.0);
  float lat = smoothstep(0.02, 0.55, abs(y));
  float back = 0.55 + 0.45 * smoothstep(-0.9, 0.4, -p.z);
  vA = tw * mix(0.32, 1.0, lat) * back * (y > 0.0 ? 1.05 - 0.35 * smoothstep(0.8, 1.0, y) : 0.6);
  gl_PointSize = uSize * uDpr * (0.55 + aSeed * 0.9) * persp * (uScale / 260.0);
}`;
const FRAG = `precision mediump float;
varying vec3 vCol; varying float vA;
void main(){
  vec2 d = gl_PointCoord - 0.5;
  float r = dot(d, d);
  float a = smoothstep(0.25, 0.04, r) * vA;
  gl_FragColor = vec4(vCol * a, a);
}`;

type Props = {
  palette?: EmberGlobePalette;
  /** Number of points. */
  count?: number;
  /** Sphere radius as a fraction of the smaller side. */
  radius?: number;
  speed?: number;
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

const DEFAULT: EmberGlobePalette = ["#ffae8a", "#ff7428", "#f0bd3a", "#e6e9ee"];

export function EmberGlobe({ palette = DEFAULT, count = 12000, radius = 0.34, speed = 1, motion = "full", className = "", style, children }: Props) {
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
    gl.bindAttribLocation(pr, 0, "aPos");
    gl.bindAttribLocation(pr, 1, "aSeed");
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return void (el.dataset.fallback = "");
    gl.useProgram(pr);
    const { pos, seeds } = spherePoints(count);
    const buf = (data: Float32Array, loc: number, size: number) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    };
    buf(pos, 0, 3);
    buf(seeds, 1, 1);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.clearColor(0, 0, 0, 1);
    const U = (n: string) => gl.getUniformLocation(pr, n);
    const [uTime, uTilt, uScale, uRes, uDpr, uSize] = ["uTime", "uTilt", "uScale", "uRes", "uDpr", "uSize"].map(U);
    const cols = key.split(",");
    ["uHot", "uEmber", "uSpark", "uCool"].forEach((n, i) => gl.uniform3f(U(n), ...rgb(cols[i])));
    gl.uniform1f(uSize, 2.3);

    let raf = 0, visible = true, alive = true, last = 0, t = 0;
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      cv.width = Math.max(1, Math.round(el.clientWidth * dpr));
      cv.height = Math.max(1, Math.round(el.clientHeight * dpr));
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(uRes, cv.width, cv.height);
      gl.uniform1f(uDpr, dpr);
      gl.uniform1f(uScale, Math.min(cv.width, cv.height) * radius);
    };
    const frame = () => {
      gl.uniform1f(uTime, t);
      gl.uniform2f(uTilt, tilt.x, tilt.y);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, count);
    };
    const tick = (now: number) => {
      raf = 0;
      if (!alive || !visible || document.hidden) return;
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0.016;
      last = now;
      t += dt * speed;
      tilt.x += (tilt.tx - tilt.x) * 0.05;
      tilt.y += (tilt.ty - tilt.y) * 0.05;
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
      tilt.tx = ((e.clientX - r.left) / r.width - 0.5) * 0.7;
      tilt.ty = ((e.clientY - r.top) / r.height - 0.5) * 0.5;
    };
    const onLeave = () => ((tilt.tx = 0), (tilt.ty = 0));
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
    t = 6;
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
  }, [key, count, radius, speed, motion]);

  return (
    <div
      ref={host}
      className={`emgl ${className}`}
      style={{ ["--emgl-hot" as string]: palette[0], ["--emgl-ember" as string]: palette[1], ["--emgl-cool" as string]: palette[3], ...style }}
    >
      <canvas ref={canvas} className="emgl__canvas" aria-hidden="true" />
      {children && <div className="emgl__content">{children}</div>}
    </div>
  );
}
