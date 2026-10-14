"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { hex, runShader } from "./gl";
import "./glow-strands.css";

/**
 * Glow Strands
 * Six strands of light drift across the dark, each a crisp core in a wide glow;
 * where they cross the light adds up and flares towards white, and the pointer bows them apart.
 */
const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uPress;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(h1(i), h1(i + vec2(1, 0)), f.x), mix(h1(i + vec2(0, 1)), h1(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++){ v += a * vn(p); p = m * p + 3.1; a *= 0.5; } return v; }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }
uniform vec3 uBg; uniform vec3 uC0; uniform vec3 uC1; uniform vec3 uC2; uniform vec3 uC3; uniform vec3 uC4; uniform vec3 uC5;
vec3 pick(int i){ if (i == 0) return uC0; if (i == 1) return uC1; if (i == 2) return uC2; if (i == 3) return uC3; if (i == 4) return uC4; return uC5; }
float curve(float x, float base, float amp, float fr, float sp, float ph, float t){
  return base + amp * sin(x * fr + t * sp + ph) + amp * 0.35 * sin(x * fr * 2.3 - t * sp * 0.7 + ph * 1.7);
}
void main(){
  float asp = uRes.x / uRes.y;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime;
  vec2 m = (uMouse - 0.5) * vec2(asp, 1.0);
  float pull = exp(-pow((p.x - m.x) * 2.2, 2.0)) * uPress;
  vec3 acc = vec3(0.0);
  float cores = 0.0;
  for (int i = 0; i < 6; i++) {
    float k = float(i);
    float base = 0.36 - k * 0.15 + 0.04 * sin(k * 2.1);
    float amp = 0.18 + 0.12 * fract(k * 0.37);
    float fr = 0.95 + 0.6 * fract(k * 0.71);
    float sp = (0.14 + 0.05 * k) * (mod(k, 2.0) < 0.5 ? 1.0 : -1.0);
    float ph = k * 1.9;
    float strength = i == 0 ? 0.35 : (i == 5 ? 0.45 : 1.0);
    float y = curve(p.x, base, amp, fr, sp, ph, t);
    float dy = (curve(p.x + 0.002, base, amp, fr, sp, ph, t) - y) / 0.002;
    y += (y - m.y) * 0.45 * pull * exp(-abs(y - m.y) * 2.0);
    float d = abs(p.y - y) / sqrt(1.0 + dy * dy);
    float core = exp(-d * d / (2.0 * 0.0042 * 0.0042));
    float glow = exp(-d / 0.03) * 0.55 + exp(-d / 0.09) * 0.06;
    acc += pick(i) * (core * 1.6 + glow) * strength;
    cores += core * strength;
  }
  // where strands cross the light adds up and burns towards white
  acc += vec3(smoothstep(0.9, 1.8, cores)) * 0.8;
  vec3 col = uBg + 1.0 - exp(-acc * 1.35);
  col += (h1(gl_FragCoord.xy + fract(t) * 19.0) - 0.5) / 200.0;
  gl_FragColor = vec4(col, 1.0);
}`;

export type GlowStrandsPalette = { bg: string; c0: string; c1: string; c2: string; c3: string; c4: string; c5: string };
const DEFAULT: GlowStrandsPalette = { bg: "#000000", c0: "#3a137a", c1: "#7a2ef5", c2: "#2b8df2", c3: "#a6e4ff", c4: "#f4e2b0", c5: "#4f35c8" };

export type GlowStrandsProps = {
  palette?: GlowStrandsPalette;
  speed?: number;
  motion?: "full" | "reduced";
  /** Soften the bottom edge into the ground colour, with a little blur, so a page can continue below. */
  fade?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

const uniformsFor = (p: GlowStrandsPalette) =>
  Object.fromEntries(Object.entries(p).map(([k, v]) => [`u${k[0].toUpperCase()}${k.slice(1)}`, typeof v === "string" ? hex(v) : v]));

export function GlowStrands({ palette = DEFAULT, speed = 1, motion = "full", fade = false, className = "", style, children }: GlowStrandsProps) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv) return;
    return runShader(el, cv, {
      frag: FRAG, speed, reduced: motion === "reduced", start: 40, quality: 0.75, follow: 0.05,
      uniforms: uniformsFor(palette),
      onFail: () => setFailed(true),
    });
  }, [palette, speed, motion]);
  return (
    <div ref={host} className={`gstrand ${fade ? "gstrand--fade" : ""} ${className}`} data-fallback={failed ? "" : undefined}
      style={{ ["--gstrand-bg" as string]: palette.bg, ["--gstrand-c1" as string]: palette.c1, ["--gstrand-c3" as string]: palette.c3, ...style }}>
      <canvas ref={canvas} className="gstrand__canvas" aria-hidden="true" />
      {children && <div className="gstrand__content">{children}</div>}
    </div>
  );
}

export default GlowStrands;
