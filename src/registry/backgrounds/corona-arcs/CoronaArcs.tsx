"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { hex, runShader } from "./gl";
import "./corona-arcs.css";

/**
 * Corona Arcs
 * Soft concentric bands of light rise from a corner and slowly breathe outward,
 * from a dark edge to a hot core, as if the page sat at the rim of a sun.
 */
const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uPress;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(h1(i), h1(i + vec2(1, 0)), f.x), mix(h1(i + vec2(0, 1)), h1(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++){ v += a * vn(p); p = m * p + 3.1; a *= 0.5; } return v; }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }
uniform vec3 uBg; uniform vec3 uDeep; uniform vec3 uMid; uniform vec3 uHot;
void main(){
  float asp = uRes.x / uRes.y;
  vec2 p = gl_FragCoord.xy / uRes.y;
  float t = uTime;
  vec2 c = vec2(-0.25, -1.2) + (uMouse - 0.5) * vec2(0.25, 0.18) * uPress;
  float r = length(p - c) * (1.5 / max(1.3, asp * 0.85));
  r += (fbm(p * 1.4 + vec2(t * 0.03, 0.0)) - 0.5) * 0.09;
  float edge = 2.0 + 0.04 * sin(t * 0.32);
  float env = smoothstep(edge + 0.35, edge - 0.6, r);
  float bands = 0.5 + 0.5 * cos((r * 4.4 - t * 0.1) * 6.2831853 / 2.0);
  bands = pow(bands, 1.4);
  float inner = smoothstep(edge - 0.2, edge - 1.4, r);
  float I = env * (0.3 + 0.68 * bands) + inner * 0.36;
  vec3 col = uBg;
  col = mix(col, uDeep, smoothstep(0.02, 0.32, I));
  col = mix(col, uMid, smoothstep(0.3, 0.72, I));
  col = mix(col, uHot, smoothstep(0.7, 1.15, I));
  col += (h1(gl_FragCoord.xy + fract(t) * 41.0) - 0.5) / 120.0;
  gl_FragColor = vec4(col, 1.0);
}`;

export type CoronaArcsPalette = { bg: string; deep: string; mid: string; hot: string };
const DEFAULT: CoronaArcsPalette = { bg: "#0e0204", deep: "#5a0b1b", mid: "#d6324b", hot: "#ffb4a2" };

export type CoronaArcsProps = {
  palette?: CoronaArcsPalette;
  speed?: number;
  motion?: "full" | "reduced";
  /** Soften the bottom edge into the ground colour, with a little blur, so a page can continue below. */
  fade?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

const uniformsFor = (p: CoronaArcsPalette) =>
  Object.fromEntries(Object.entries(p).map(([k, v]) => [`u${k[0].toUpperCase()}${k.slice(1)}`, typeof v === "string" ? hex(v) : v]));

export function CoronaArcs({ palette = DEFAULT, speed = 1, motion = "full", fade = false, className = "", style, children }: CoronaArcsProps) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv) return;
    return runShader(el, cv, {
      frag: FRAG, speed, reduced: motion === "reduced", start: 30, quality: 0.5, follow: 0.05,
      uniforms: uniformsFor(palette),
      onFail: () => setFailed(true),
    });
  }, [palette, speed, motion]);
  return (
    <div ref={host} className={`corona ${fade ? "corona--fade" : ""} ${className}`} data-fallback={failed ? "" : undefined}
      style={{ ["--corona-bg" as string]: palette.bg, ["--corona-mid" as string]: palette.mid, ...style }}>
      <canvas ref={canvas} className="corona__canvas" aria-hidden="true" />
      {children && <div className="corona__content">{children}</div>}
    </div>
  );
}

export default CoronaArcs;
