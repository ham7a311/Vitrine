"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { hex, runShader } from "./gl";
import "./pigment-shore.css";

/**
 * Pigment Shore
 * A grainy bank of pigment lies along the bottom edge, one colour bleeding into another
 * across it, mottled like watercolour drying on rough paper; the sky above stays deep and empty.
 */
const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uPress;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(h1(i), h1(i + vec2(1, 0)), f.x), mix(h1(i + vec2(0, 1)), h1(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++){ v += a * vn(p); p = m * p + 3.1; a *= 0.5; } return v; }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }
uniform vec3 uTop; uniform vec3 uLeft; uniform vec3 uMid; uniform vec3 uRight;
vec2 nearest;
vec2 cells(vec2 p){
  vec2 i = floor(p), f = fract(p); float d1 = 8.0, d2 = 8.0;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y));
    vec2 o = vec2(h1(i + g), h1(i + g + 17.0));
    float d = length(g + o - f);
    if (d < d1) { d2 = d1; d1 = d; nearest = i + g + o; } else if (d < d2) d2 = d;
  }
  return vec2(d1, d2);
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = gl_FragCoord.xy / uRes.y;
  float t = uTime * 0.035;
  float n = fbm(p * 2.0 + vec2(t, -t * 0.4));
  // the bank: high at the left, a long dip, rising again at the right
  float h = 0.2 + 0.4 * smoothstep(0.6, 0.0, uv.x) + 0.14 * smoothstep(0.55, 1.0, uv.x) + (n - 0.5) * 0.22;
  h += 0.12 * exp(-pow((uv.x - uMouse.x) * 4.0, 2.0)) * uPress;
  float body = smoothstep(h + 0.1, h - 0.22, uv.y + (fbm(p * 6.0 + t) - 0.5) * 0.07);
  vec2 c = cells(p * 52.0);
  // crystallised: each little cell takes the cloud's value at its own centre, like pigment drying in flakes
  vec2 pc = nearest / 52.0;
  float cloud = mix(fbm(p * 3.2 + n * 1.4 - vec2(t * 0.6, 0.0)), fbm(pc * 3.2 + n * 1.4 - vec2(t * 0.6, 0.0)), 0.7);
  float mottle = smoothstep(0.0, 0.6, c.x);
  float vein = smoothstep(0.0, 0.08, c.y - c.x);
  float k = uv.x + (n - 0.5) * 0.35;
  vec3 tint = mix(uLeft, uMid, smoothstep(0.22, 0.55, k));
  tint = mix(tint, uRight, smoothstep(0.55, 0.88, k));
  float cl = smoothstep(0.22, 0.74, cloud);
  float b = body * (0.12 + 0.88 * cl * cl) * (0.86 + 0.2 * mottle) * (0.9 + 0.1 * vein);
  // the two hot hearts
  vec2 hl = (uv - vec2(0.07, 0.38)) * vec2(uRes.x / uRes.y, 1.0);
  vec2 hr = (uv - vec2(0.93, 0.18)) * vec2(uRes.x / uRes.y, 1.0);
  b += body * (exp(-dot(hl, hl) * 9.0) + exp(-dot(hr, hr) * 11.0)) * 0.8 * cl;
  vec3 col = uTop * (0.7 + 0.3 * smoothstep(1.0, 0.3, uv.y));
  col += tint * b * 1.1;
  col += mix(tint, vec3(1.0), 0.25) * pow(b, 3.0) * 0.35;
  float grain = h1(gl_FragCoord.xy + fract(uTime * 3.0) * 97.0) - 0.5;
  col += grain * (0.025 + 0.07 * b);
  gl_FragColor = vec4(col, 1.0);
}`;

export type PigmentShorePalette = { top: string; left: string; mid: string; right: string };
const DEFAULT: PigmentShorePalette = { top: "#03060f", left: "#2aa4e4", mid: "#3c2f8a", right: "#f2333a" };

export type PigmentShoreProps = {
  palette?: PigmentShorePalette;
  speed?: number;
  motion?: "full" | "reduced";
  /** Soften the bottom edge into the ground colour, with a little blur, so a page can continue below. */
  fade?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

const uniformsFor = (p: PigmentShorePalette) =>
  Object.fromEntries(Object.entries(p).map(([k, v]) => [`u${k[0].toUpperCase()}${k.slice(1)}`, typeof v === "string" ? hex(v) : v]));

export function PigmentShore({ palette = DEFAULT, speed = 1, motion = "full", fade = false, className = "", style, children }: PigmentShoreProps) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv) return;
    return runShader(el, cv, {
      frag: FRAG, speed, reduced: motion === "reduced", start: 30, quality: 0.85, follow: 0.05,
      uniforms: uniformsFor(palette),
      onFail: () => setFailed(true),
    });
  }, [palette, speed, motion]);
  return (
    <div ref={host} className={`pshore ${fade ? "pshore--fade" : ""} ${className}`} data-fallback={failed ? "" : undefined}
      style={{ ["--pshore-top" as string]: palette.top, ["--pshore-left" as string]: palette.left, ["--pshore-right" as string]: palette.right, ...style }}>
      <canvas ref={canvas} className="pshore__canvas" aria-hidden="true" />
      {children && <div className="pshore__content">{children}</div>}
    </div>
  );
}

export default PigmentShore;
