"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { hex, runShader } from "./gl";
import "./blue-hour.css";

/**
 * Blue Hour
 * The last light over a horizon: ink sky, a saturated band of colour standing in soft
 * shafts that sway and gather towards the pointer, and a pale haze along the floor.
 */
const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uPress;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(h1(i), h1(i + vec2(1, 0)), f.x), mix(h1(i + vec2(0, 1)), h1(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++){ v += a * vn(p); p = m * p + 3.1; a *= 0.5; } return v; }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }
uniform vec3 uSky; uniform vec3 uBand; uniform vec3 uGlow; uniform vec3 uFloor;
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  float t = uTime * 0.05;
  float x = uv.x * asp;
  // the shafts gather towards the pointer
  float mx = uMouse.x * asp;
  x += (mx - x) * 0.3 * exp(-pow((x - mx) * 1.6, 2.0)) * uPress;
  float sh = vn(vec2(x * 2.4 - t * 1.4, 0.5)) * 0.62 + vn(vec2(x * 5.5 + t, 7.0)) * 0.38;
  sh = smoothstep(0.15, 0.85, sh);
  float h = 0.3 + 0.11 * sh + 0.03 * sin(uv.x * 3.0 + uTime * 0.2);
  float y = uv.y + (vn(vec2(x * 9.0, uv.y * 3.0 - t)) - 0.5) * 0.02;
  float band = smoothstep(h + 0.42, h - 0.04, y);
  float glow = smoothstep(h + 0.02, h - 0.17, y);
  float floorL = pow(smoothstep(0.33, 0.04, y), 1.7);
  vec3 col = uSky;
  col = mix(col, uBand, band * (0.3 + 0.7 * sh));
  col = mix(col, uGlow, glow * (0.55 + 0.45 * sh));
  col = mix(col, uFloor, floorL * 0.97);
  col += uGlow * exp(-pow((uMouse.x - uv.x) * asp * 2.0, 2.0)) * band * 0.15 * uPress;
  col += (h1(gl_FragCoord.xy + fract(uTime) * 29.0) - 0.5) / 96.0;
  gl_FragColor = vec4(col, 1.0);
}`;

export type BlueHourPalette = { sky: string; band: string; glow: string; floor: string };
const DEFAULT: BlueHourPalette = { sky: "#02040f", band: "#0b2399", glow: "#2f5bff", floor: "#eef2ff" };

export type BlueHourProps = {
  palette?: BlueHourPalette;
  speed?: number;
  motion?: "full" | "reduced";
  /** Soften the bottom edge into the ground colour, with a little blur, so a page can continue below. */
  fade?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

const uniformsFor = (p: BlueHourPalette) =>
  Object.fromEntries(Object.entries(p).map(([k, v]) => [`u${k[0].toUpperCase()}${k.slice(1)}`, typeof v === "string" ? hex(v) : v]));

export function BlueHour({ palette = DEFAULT, speed = 1, motion = "full", fade = false, className = "", style, children }: BlueHourProps) {
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
    <div ref={host} className={`bhour ${fade ? "bhour--fade" : ""} ${className}`} data-fallback={failed ? "" : undefined}
      style={{ ["--bhour-sky" as string]: palette.sky, ["--bhour-glow" as string]: palette.glow, ["--bhour-floor" as string]: palette.floor, ...style }}>
      <canvas ref={canvas} className="bhour__canvas" aria-hidden="true" />
      {children && <div className="bhour__content">{children}</div>}
    </div>
  );
}

export default BlueHour;
