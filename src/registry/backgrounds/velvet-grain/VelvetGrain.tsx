"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { hex, runShader } from "./gl";
import "./velvet-grain.css";

/**
 * Velvet Grain
 * Broad, slow swirls of colour on near-black under a heavy, living film grain —
 * the look of a dark velvet photographed on fast film.
 */
const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uPress;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(h1(i), h1(i + vec2(1, 0)), f.x), mix(h1(i + vec2(0, 1)), h1(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++){ v += a * vn(p); p = m * p + 3.1; a *= 0.5; } return v; }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }
uniform vec3 uBg; uniform vec3 uDye; uniform float uGrain;
void main(){
  float asp = uRes.x / uRes.y;
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - uRes * vec2(0.42, 0.52)) / uRes.y;
  float t = uTime * 0.05;
  // a slow whorl: bands that wind around a point left of centre, bent by soft noise
  vec2 c = (uMouse - vec2(0.42, 0.52)) * vec2(asp, 1.0) * 0.25 * uPress;
  vec2 d = p - c;
  float r = length(d), ang = atan(d.y, d.x);
  float w = (fbm(p * 1.1 + vec2(t, -t * 0.7)) - 0.5) * 3.2;
  float v = sin(r * 7.5 - ang * 1.0 + w - t * 2.0);
  float v2 = sin(p.x * 3.0 + p.y * 2.2 + w * 1.4 + t * 1.5);
  float band = smoothstep(0.05, 1.0, v * 0.75 + v2 * 0.3);
  band *= smoothstep(0.05, 0.3, r) * (0.65 + 0.35 * smoothstep(1.2, 0.3, r));
  vec3 col = mix(uBg, uDye, band * 0.9);
  col *= 1.0 - 0.25 * smoothstep(0.45, 1.0, length(uv - 0.5) * 1.3);
  float g = h1(gl_FragCoord.xy + fract(uTime * 12.0) * vec2(91.7, 37.3)) - 0.5;
  float gc = h1(gl_FragCoord.xy * 1.3 + fract(uTime * 9.0) * vec2(13.1, 77.9)) - 0.5;
  col += g * uGrain * (0.35 + band) + uDye * gc * uGrain * 1.4 * band;
  gl_FragColor = vec4(max(col, 0.0), 1.0);
}`;

export type VelvetGrainPalette = { bg: string; dye: string; grain: number };
const DEFAULT: VelvetGrainPalette = { bg: "#070405", dye: "#7a1515", grain: 0.14 };

export type VelvetGrainProps = {
  palette?: VelvetGrainPalette;
  speed?: number;
  motion?: "full" | "reduced";
  /** Soften the bottom edge into the ground colour, with a little blur, so a page can continue below. */
  fade?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

const uniformsFor = (p: VelvetGrainPalette) =>
  Object.fromEntries(Object.entries(p).map(([k, v]) => [`u${k[0].toUpperCase()}${k.slice(1)}`, typeof v === "string" ? hex(v) : v]));

export function VelvetGrain({ palette = DEFAULT, speed = 1, motion = "full", fade = false, className = "", style, children }: VelvetGrainProps) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv) return;
    return runShader(el, cv, {
      frag: FRAG, speed, reduced: motion === "reduced", start: 30, quality: 1.0, follow: 0.05,
      uniforms: uniformsFor(palette),
      onFail: () => setFailed(true),
    });
  }, [palette, speed, motion]);
  return (
    <div ref={host} className={`vgrain ${fade ? "vgrain--fade" : ""} ${className}`} data-fallback={failed ? "" : undefined}
      style={{ ["--vgrain-bg" as string]: palette.bg, ["--vgrain-dye" as string]: palette.dye, ...style }}>
      <canvas ref={canvas} className="vgrain__canvas" aria-hidden="true" />
      {children && <div className="vgrain__content">{children}</div>}
    </div>
  );
}

export default VelvetGrain;
