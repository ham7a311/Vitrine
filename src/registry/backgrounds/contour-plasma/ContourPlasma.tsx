"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { hex, runShader } from "./gl";
import "./contour-plasma.css";

/**
 * Contour Plasma
 * The classic plasma field — a few interfering sine waves — slowed right down and quantised into
 * soft contour bands, like a topographic heat map. Each band is a flat step of a four-colour ramp
 * with a hairline at its edge, so the motion reads as calm terraces sliding past each other.
 * The pointer is a gentle warm source that lifts the field around it.
 */
const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uPress; uniform float uBands;
uniform vec3 uC0; uniform vec3 uC1; uniform vec3 uC2; uniform vec3 uC3; uniform vec3 uLine;
vec3 ramp(float x){
  x = clamp(x, 0.0, 1.0);
  if (x < 0.333) return mix(uC0, uC1, x / 0.333);
  if (x < 0.666) return mix(uC1, uC2, (x - 0.333) / 0.333);
  return mix(uC2, uC3, (x - 0.666) / 0.334);
}
float level(vec2 p, float t, vec2 m){
  float v = sin(p.x * 2.1 + t * 0.6);
  v += sin(p.y * 1.7 - t * 0.45);
  v += sin((p.x + p.y) * 1.3 + t * 0.35);
  v += sin(length(p - vec2(0.9 * sin(t * 0.13), 0.7 * cos(t * 0.11))) * 3.2 - t * 0.5);
  return v * 0.125 + 0.5 + uPress * 0.22 * exp(-dot(p - m, p - m) / 0.35);
}
void main(){
  float aspect = uRes.x / uRes.y;
  float k = 2.2 / uRes.y;
  vec2 p = (gl_FragCoord.xy / uRes.y - vec2(aspect * 0.5, 0.5)) * 2.2;
  vec2 m = (uMouse * vec2(aspect, 1.0) - vec2(aspect * 0.5, 0.5)) * 2.2;
  float t = uTime * 0.35;
  float b = level(p, t, m) * uBands;
  // WebGL1 has no fwidth without an extension: measure the change over one pixel instead.
  float w = max(abs(level(p + vec2(k, 0.0), t, m) * uBands - b) + abs(level(p + vec2(0.0, k), t, m) * uBands - b), 0.0005);
  float f = fract(b);
  float edge = 1.0 - smoothstep(0.0, w * 1.5, f) * (1.0 - smoothstep(1.0 - w * 1.5, 1.0, f));
  vec3 col = ramp((floor(b) + 0.5) / uBands);
  col *= 0.94 + 0.12 * f;
  col = mix(col, uLine, edge * 0.55);
  vec2 q = gl_FragCoord.xy / uRes - 0.5;
  col *= 1.0 - dot(q, q) * 0.35;
  gl_FragColor = vec4(col, 1.0);
}`;

export type PlasmaPalette = { stops: [string, string, string, string]; line: string };
const DEFAULT: PlasmaPalette = { stops: ["#14112b", "#4b2a6b", "#c4577a", "#f6c39a"], line: "#0b0918" };

export type ContourPlasmaProps = {
  palette?: PlasmaPalette;
  /** Number of terraces from lowest to highest. */
  bands?: number;
  speed?: number;
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export function ContourPlasma({ palette = DEFAULT, bands = 9, speed = 1, motion = "full", className = "", style, children }: ContourPlasmaProps) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv) return;
    const [c0, c1, c2, c3] = palette.stops.map(hex);
    return runShader(el, cv, {
      frag: FRAG, speed, reduced: motion === "reduced", start: 30, quality: 0.9, follow: 0.06,
      uniforms: { uBands: bands, uC0: c0, uC1: c1, uC2: c2, uC3: c3, uLine: hex(palette.line) },
      onFail: () => setFailed(true),
    });
  }, [palette, bands, speed, motion]);
  const [a, b, c, d] = palette.stops;
  return (
    <div ref={host} className={`cplas ${className}`} data-fallback={failed ? "" : undefined}
      style={{ ["--cplas-a" as string]: a, ["--cplas-b" as string]: b, ["--cplas-c" as string]: c, ["--cplas-d" as string]: d, ...style }}>
      <canvas ref={canvas} className="cplas__canvas" aria-hidden="true" />
      {children && <div className="cplas__content">{children}</div>}
    </div>
  );
}

export default ContourPlasma;
