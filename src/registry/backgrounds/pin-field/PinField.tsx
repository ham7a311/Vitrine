"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { hex, runShader } from "./gl";
import "./pin-field.css";

/**
 * Pin Field
 * A pin-art board. Diagonal swells push rows of pins up out of the board; raised pins catch a
 * light from the upper left and throw short shadows down and to the right, so the waves read as
 * relief rather than brightness. The pointer presses a hollow into the pins, with a raised rim.
 */
const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uPress;
uniform float uCols; uniform vec3 uBg; uniform vec3 uLo; uniform vec3 uHi;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h1(i), h1(i + vec2(1, 0)), f.x), mix(h1(i + vec2(0, 1)), h1(i + vec2(1, 1)), f.x), f.y); }
float lift(vec2 uv, float t){
  float a = dot(uv, normalize(vec2(1.0, -0.72)));
  float b = dot(uv, normalize(vec2(0.86, -1.0)));
  float r1 = pow(0.5 + 0.5 * sin(a * 5.2 - t * 0.55), 6.0);
  float r2 = pow(0.5 + 0.5 * sin(b * 3.1 - t * 0.37 + 1.7), 9.0) * 0.8;
  float body = 0.45 + 0.55 * vn(uv * 1.6 + vec2(t * 0.04, -t * 0.03));
  return clamp(max(r1, r2) * body, 0.0, 1.0);
}
void main(){
  float cell = max(uRes.x, uRes.y) / uCols;
  vec2 p = gl_FragCoord.xy;
  vec2 id = floor(p / cell);
  vec2 c = (id + 0.5) * cell;
  vec2 local = p - c;
  vec2 uv = c / uRes.y;
  vec2 m = uMouse * vec2(uRes.x / uRes.y, 1.0);
  float d = length(uv - m);
  float h = lift(uv, uTime);
  h *= 1.0 - uPress * 0.92 * exp(-d * d / 0.018);
  h += uPress * 0.42 * exp(-pow(d - 0.2, 2.0) / 0.0035);
  h = clamp(h, 0.0, 1.0);
  float r = cell * (0.11 + 0.27 * h);
  vec2 off = vec2(0.3, -0.3) * cell * h;
  float aa = 1.0;
  float shadow = (1.0 - smoothstep(r - aa, r + aa * 1.5, length(local - off))) * h * 0.75;
  float head = 1.0 - smoothstep(r - aa, r + aa, length(local));
  vec3 col = uBg;
  col = mix(col, uBg * 0.25, shadow);
  vec3 pin = mix(uLo, uHi, smoothstep(0.0, 0.95, h));
  float rim = smoothstep(r * 0.2, r, length(local + vec2(0.25, -0.25) * r));
  pin *= 1.0 - rim * 0.35 * h;
  float spec = 1.0 - smoothstep(0.0, r * 0.42, length(local - vec2(-0.32, 0.32) * r));
  pin += spec * h * 0.5;
  col = mix(col, pin, head);
  vec2 q = gl_FragCoord.xy / uRes - 0.5;
  col *= 1.0 - dot(q, q) * 0.55;
  gl_FragColor = vec4(col, 1.0);
}`;

export type PinPalette = { ground: string; low: string; high: string };
const DEFAULT: PinPalette = { ground: "#0b0b0d", low: "#2b2b30", high: "#f4f4f2" };

export type PinFieldProps = {
  palette?: PinPalette;
  /** Pins across the longer side. */
  columns?: number;
  speed?: number;
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export function PinField({ palette = DEFAULT, columns = 76, speed = 1, motion = "full", className = "", style, children }: PinFieldProps) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv) return;
    const narrow = el.clientWidth < 640;
    return runShader(el, cv, {
      frag: FRAG, speed, reduced: motion === "reduced", start: 14, follow: 0.14, quality: 1,
      uniforms: { uCols: narrow ? Math.round(columns * 0.6) : columns, uBg: hex(palette.ground), uLo: hex(palette.low), uHi: hex(palette.high) },
      onFail: () => setFailed(true),
    });
  }, [palette, columns, speed, motion]);
  return (
    <div ref={host} className={`pinf ${className}`} data-fallback={failed ? "" : undefined}
      style={{ ["--pinf-ground" as string]: palette.ground, ["--pinf-low" as string]: palette.low, ["--pinf-high" as string]: palette.high, ...style }}>
      <canvas ref={canvas} className="pinf__canvas" aria-hidden="true" />
      {children && <div className="pinf__content">{children}</div>}
    </div>
  );
}

export default PinField;
