"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { hex, runShader } from "./gl";
import "./light-sash.css";

/**
 * Light Sash
 * One wide blade of light crosses the frame on a diagonal, like a long-exposure sweep:
 * a pale hot edge, a soft coloured body and a haze beyond it; the pointer turns the blade.
 */
const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uPress;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(h1(i), h1(i + vec2(1, 0)), f.x), mix(h1(i + vec2(0, 1)), h1(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++){ v += a * vn(p); p = m * p + 3.1; a *= 0.5; } return v; }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }
uniform vec3 uBg; uniform vec3 uBody; uniform vec3 uEdge; uniform vec3 uHaze;
void main(){
  float asp = uRes.x / uRes.y;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime * 0.05;
  float th = 0.6 + (uMouse.x - 0.5) * 0.35 * uPress - (uMouse.y - 0.5) * 0.15 * uPress;
  vec2 dir = vec2(cos(th), sin(th));
  float along = dot(p, dir);
  float s = dot(p - vec2(0.2 * asp, -0.08), vec2(-dir.y, dir.x));
  s += 0.05 * sin(along * 2.2 + uTime * 0.22) + (fbm(vec2(along * 0.6, s * 1.6) + vec2(t, 0.0)) - 0.5) * 0.22;
  // long-exposure streaks running along the blade
  float streak = fbm(vec2(along * 0.45 - t * 2.0, s * 9.0));
  float upper = exp(-pow((s - 0.5) / 0.22, 2.0));
  float body = exp(-pow((s - 0.16) / 0.17, 2.0));
  float gap = exp(-pow((s + 0.06) / 0.07, 2.0));
  vec3 col = uBg * (0.85 + 0.3 * smoothstep(1.0, -0.4, s));
  col = mix(col, uBody * 0.55, upper * 0.6 * (0.7 + 0.6 * streak));
  col = mix(col, uBody, body * 0.9 * (0.75 + 0.5 * streak));
  col = mix(col, uEdge, smoothstep(-0.02, -0.26, s) * 0.85);
  col = mix(col, mix(uBody, uBg, 0.3), gap * 0.35);
  col = mix(col, uHaze, smoothstep(-0.2, -0.62, s) * 0.95);
  col *= 0.9 + 0.1 * smoothstep(-0.9, 0.6, along);
  col += (h1(gl_FragCoord.xy + fract(uTime) * 37.0) - 0.5) / 110.0;
  gl_FragColor = vec4(col, 1.0);
}`;

export type LightSashPalette = { bg: string; body: string; edge: string; haze: string };
const DEFAULT: LightSashPalette = { bg: "#031a17", body: "#2a877e", edge: "#9ee6d6", haze: "#eefcf7" };

export type LightSashProps = {
  palette?: LightSashPalette;
  speed?: number;
  motion?: "full" | "reduced";
  /** Soften the bottom edge into the ground colour, with a little blur, so a page can continue below. */
  fade?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

const uniformsFor = (p: LightSashPalette) =>
  Object.fromEntries(Object.entries(p).map(([k, v]) => [`u${k[0].toUpperCase()}${k.slice(1)}`, typeof v === "string" ? hex(v) : v]));

export function LightSash({ palette = DEFAULT, speed = 1, motion = "full", fade = false, className = "", style, children }: LightSashProps) {
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
    <div ref={host} className={`lsash ${fade ? "lsash--fade" : ""} ${className}`} data-fallback={failed ? "" : undefined}
      style={{ ["--lsash-bg" as string]: palette.bg, ["--lsash-body" as string]: palette.body, ["--lsash-haze" as string]: palette.haze, ...style }}>
      <canvas ref={canvas} className="lsash__canvas" aria-hidden="true" />
      {children && <div className="lsash__content">{children}</div>}
    </div>
  );
}

export default LightSash;
