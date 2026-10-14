"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { hex, runShader } from "./gl";
import "./neon-veins.css";

/**
 * Neon Veins
 * Thin glowing veins wander through the dark — the contour lines of slowly warping noise —
 * under a fine dust of stars and a few soft, out-of-focus lights.
 */
const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uPress;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(h1(i), h1(i + vec2(1, 0)), f.x), mix(h1(i + vec2(0, 1)), h1(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++){ v += a * vn(p); p = m * p + 3.1; a *= 0.5; } return v; }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }
uniform vec3 uBg; uniform vec3 uVein; uniform vec3 uCore; uniform vec3 uStar;
// three smooth octaves, so the veins bend instead of fraying
float soft(vec2 p){ float v = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 3; i++){ v += a * vn(p); p = m * p + 3.1; a *= 0.5; } return v / 0.875; }
void main(){
  float asp = uRes.x / uRes.y;
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = gl_FragCoord.xy / uRes.y * 3.4;
  float t = uTime * 0.045;
  vec2 w = vec2(soft(p * 0.55 + vec2(t, 0.0)), soft(p * 0.55 + vec2(4.0, -t)));
  float n = soft(p + 1.8 * w + vec2(0.0, t * 0.5));
  float e = abs(n - 0.5);
  float e2 = min(abs(n - 0.32), abs(n - 0.68));
  // some stretches burn bright, others nearly vanish
  float seg = smoothstep(0.25, 0.75, fbm(p * 0.9 - vec2(t * 1.4, t)));
  vec2 m = uMouse * vec2(asp, 1.0) * 3.4;
  float near = exp(-dot(p - m, p - m) * 0.9) * uPress;
  float s = 0.18 + 0.82 * seg + near * 0.9;
  float core = smoothstep(0.012, 0.0, e) * s;
  float glow = (exp(-e * 34.0) * 0.55 + exp(-e * 9.0) * 0.12) * s;
  float faint = (smoothstep(0.01, 0.0, e2) * 0.7 + exp(-e2 * 30.0) * 0.3) * (0.08 + 0.6 * seg);
  vec3 col = uBg + uVein * (glow + faint) + uCore * core;
  // a fine dust of stars, and a few soft out-of-focus ones
  vec2 g = gl_FragCoord.xy / uRes.y * 26.0;
  vec2 id = floor(g), f = fract(g) - 0.5;
  vec2 off = (vec2(h1(id), h1(id + 7.1)) - 0.5) * 0.7;
  float star = step(0.8, h1(id + 3.3)) * smoothstep(0.075, 0.02, length(f - off)) * (0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (0.6 + h1(id) * 1.5) + h1(id + 1.0) * 40.0)));
  col += uStar * star * 0.7;
  for (int i = 0; i < 6; i++) {
    float k = float(i);
    vec2 c = vec2(fract(h1(vec2(k, 1.0)) + uTime * 0.004 * (1.0 + k * 0.3)) * asp, fract(h1(vec2(k, 9.0)) + uTime * 0.002 * (k - 2.5)));
    vec2 dd = gl_FragCoord.xy / uRes.y - c;
    col += uStar * exp(-dot(dd, dd) / 0.00016) * 0.75 * (0.6 + 0.4 * sin(uTime * 0.4 + k));
  }
  col = 1.0 - exp(-col * 1.25);
  gl_FragColor = vec4(col, 1.0);
}`;

export type NeonVeinsPalette = { bg: string; vein: string; core: string; star: string };
const DEFAULT: NeonVeinsPalette = { bg: "#040308", vein: "#5b1ef2", core: "#9e70ff", star: "#e8e6f2" };

export type NeonVeinsProps = {
  palette?: NeonVeinsPalette;
  speed?: number;
  motion?: "full" | "reduced";
  /** Soften the bottom edge into the ground colour, with a little blur, so a page can continue below. */
  fade?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

const uniformsFor = (p: NeonVeinsPalette) =>
  Object.fromEntries(Object.entries(p).map(([k, v]) => [`u${k[0].toUpperCase()}${k.slice(1)}`, typeof v === "string" ? hex(v) : v]));

export function NeonVeins({ palette = DEFAULT, speed = 1, motion = "full", fade = false, className = "", style, children }: NeonVeinsProps) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv) return;
    return runShader(el, cv, {
      frag: FRAG, speed, reduced: motion === "reduced", start: 30, quality: 0.75, follow: 0.05,
      uniforms: uniformsFor(palette),
      onFail: () => setFailed(true),
    });
  }, [palette, speed, motion]);
  return (
    <div ref={host} className={`nveins ${fade ? "nveins--fade" : ""} ${className}`} data-fallback={failed ? "" : undefined}
      style={{ ["--nveins-bg" as string]: palette.bg, ["--nveins-vein" as string]: palette.vein, ...style }}>
      <canvas ref={canvas} className="nveins__canvas" aria-hidden="true" />
      {children && <div className="nveins__content">{children}</div>}
    </div>
  );
}

export default NeonVeins;
