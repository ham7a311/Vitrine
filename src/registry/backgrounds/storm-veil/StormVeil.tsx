"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { hex, runShader } from "./gl";
import "./storm-veil.css";

/**
 * Storm Veil
 * Smoke rolling through a storm: three layers of warped noise with fine silky strands
 * drawn along the warp, and a slow eddy that turns around the pointer.
 */
const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uPress;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(h1(i), h1(i + vec2(1, 0)), f.x), mix(h1(i + vec2(0, 1)), h1(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++){ v += a * vn(p); p = m * p + 3.1; a *= 0.5; } return v; }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }
uniform vec3 uVoid; uniform vec3 uBody; uniform vec3 uLight; uniform float uCover;
void main(){
  float asp = uRes.x / uRes.y;
  vec2 p = gl_FragCoord.xy / uRes.y * 1.15;
  float t = uTime * 0.035;
  // a slow eddy turns around the pointer
  vec2 m = uMouse * vec2(asp, 1.0) * 1.15;
  vec2 d = p - m;
  p = m + rot(exp(-dot(d, d) * 1.4) * uPress * 1.3) * d;
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t * 0.8));
  vec2 r = vec2(fbm(p + 4.0 * q + vec2(1.7, 9.2) + t * 0.6), fbm(p + 4.0 * q + vec2(8.3, 2.8) - t * 0.5));
  float f = fbm(p + 3.6 * r);
  float smoke = smoothstep(uCover, uCover + 0.32, f);
  // silky strands along the warp, brightest where the smoke is thin
  float silk = pow(1.0 - abs(sin((r.x * 2.0 + q.y) * 14.0)), 10.0);
  float edge = smoothstep(0.0, 0.25, smoke) * smoothstep(1.0, 0.45, smoke);
  vec3 col = mix(uVoid, uBody, smoke);
  col = mix(col, uLight, smoothstep(0.58, 0.95, f) * 0.8);
  col += uLight * silk * (0.06 + 0.22 * edge) * smoke;
  col += (h1(gl_FragCoord.xy + fract(uTime) * 53.0) - 0.5) / 160.0;
  gl_FragColor = vec4(col, 1.0);
}`;

export type StormVeilPalette = { void: string; body: string; light: string; cover: number };
const DEFAULT: StormVeilPalette = { void: "#010209", body: "#323e62", light: "#a3b4dd", cover: 0.29 };

export type StormVeilProps = {
  palette?: StormVeilPalette;
  speed?: number;
  motion?: "full" | "reduced";
  /** Soften the bottom edge into the ground colour, with a little blur, so a page can continue below. */
  fade?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

const uniformsFor = (p: StormVeilPalette) =>
  Object.fromEntries(Object.entries(p).map(([k, v]) => [`u${k[0].toUpperCase()}${k.slice(1)}`, typeof v === "string" ? hex(v) : v]));

export function StormVeil({ palette = DEFAULT, speed = 1, motion = "full", fade = false, className = "", style, children }: StormVeilProps) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv) return;
    return runShader(el, cv, {
      frag: FRAG, speed, reduced: motion === "reduced", start: 30, quality: 0.6, follow: 0.05,
      uniforms: uniformsFor(palette),
      onFail: () => setFailed(true),
    });
  }, [palette, speed, motion]);
  return (
    <div ref={host} className={`sveil ${fade ? "sveil--fade" : ""} ${className}`} data-fallback={failed ? "" : undefined}
      style={{ ["--sveil-void" as string]: palette.void, ["--sveil-body" as string]: palette.body, ...style }}>
      <canvas ref={canvas} className="sveil__canvas" aria-hidden="true" />
      {children && <div className="sveil__content">{children}</div>}
    </div>
  );
}

export default StormVeil;
