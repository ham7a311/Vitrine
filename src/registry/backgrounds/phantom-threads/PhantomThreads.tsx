"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { hex, runShader } from "./gl";
import "./phantom-threads.css";

/**
 * Phantom Threads
 * Long glowing strands, drawn like a long-exposure light painting: each has a hot core, a wide
 * soft halo and a faint chromatic fringe, sways on two slow waves and carries pulses of light
 * along its length. The pointer warms the strands it passes.
 */
const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uPress;
uniform vec3 uBg; uniform vec3 uBg2; uniform vec3 uGlow; uniform vec3 uCore; uniform float uCount;
float h1(float n){ return fract(sin(n * 91.345) * 47453.5453); }
void main(){
  float aspect = uRes.x / uRes.y;
  vec2 uv = gl_FragCoord.xy / uRes.y;
  float t = uTime;
  vec2 m = uMouse * vec2(aspect, 1.0);
  float warm = 1.0 + uPress * 1.6 * exp(-dot(uv - m, uv - m) / 0.05);
  vec3 acc = vec3(0.0);
  for (int i = 0; i < 30; i++) {
    float fi = float(i);
    if (fi >= uCount) break;
    float s = (fi + 0.5) / uCount;
    float r1 = h1(fi + 1.0), r2 = h1(fi + 7.0), r3 = h1(fi + 13.0);
    float base = mix(-0.25, 1.25, s) * aspect + (r1 - 0.5) * 0.08;
    float lean = 0.32 + (r2 - 0.5) * 0.12;
    float y = uv.y;
    float cx = base + (y - 0.5) * lean
      + sin(y * 1.6 + t * 0.21 + fi * 1.31) * 0.09
      + sin(y * 4.3 - t * 0.33 + fi * 2.17) * 0.022;
    float d = (uv.x - cx) * 0.95;
    float depth = r3 * r3;
    float w = 0.0016 + 0.017 * depth;
    float amp = (0.25 + 0.75 * pow(r2, 1.4)) * mix(1.0, 0.5, depth);
    float pulse = 0.55 + 0.45 * sin(y * 5.0 - t * (0.6 + r1 * 0.6) + fi * 3.0);
    float fade = smoothstep(-0.15, 0.35, y) * smoothstep(1.15, 0.6, y) * 0.6 + 0.4;
    float fo = 0.0009 + w * 0.25;
    float fr = exp(-pow((d - fo) / w, 2.0));
    float fg = exp(-pow(d / w, 2.0));
    float fb = exp(-pow((d + fo) / w, 2.0));
    float halo = exp(-abs(d) / (w * 7.0)) * 0.3 + exp(-abs(d) / 0.08) * 0.06;
    vec3 core = vec3(fr, fg, fb);
    acc += (uCore * core * 0.9 + uGlow * (halo + fg * 0.6)) * amp * pulse * fade;
  }
  acc *= warm;
  vec3 col = mix(uBg, uBg2, smoothstep(0.0, 1.0, gl_FragCoord.y / uRes.y));
  col += vec3(1.0) - exp(-acc * 1.3);
  vec2 q = gl_FragCoord.xy / uRes - 0.5;
  col *= 1.0 - dot(q, q) * 0.6;
  gl_FragColor = vec4(col, 1.0);
}`;

export type ThreadPalette = { ground: string; haze: string; glow: string; core: string };
const DEFAULT: ThreadPalette = { ground: "#06041a", haze: "#130b36", glow: "#7d5cff", core: "#efe8ff" };

export type PhantomThreadsProps = {
  palette?: ThreadPalette;
  /** Number of strands (up to 30). */
  count?: number;
  speed?: number;
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export function PhantomThreads({ palette = DEFAULT, count = 26, speed = 1, motion = "full", className = "", style, children }: PhantomThreadsProps) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv) return;
    const n = Math.max(4, Math.min(30, el.clientWidth < 640 ? Math.round(count * 0.6) : count));
    return runShader(el, cv, {
      frag: FRAG, speed, reduced: motion === "reduced", start: 20, quality: 0.8,
      uniforms: { uCount: n, uBg: hex(palette.ground), uBg2: hex(palette.haze), uGlow: hex(palette.glow), uCore: hex(palette.core) },
      onFail: () => setFailed(true),
    });
  }, [palette, count, speed, motion]);
  return (
    <div ref={host} className={`phth ${className}`} data-fallback={failed ? "" : undefined}
      style={{ ["--phth-ground" as string]: palette.ground, ["--phth-haze" as string]: palette.haze, ["--phth-glow" as string]: palette.glow, ...style }}>
      <canvas ref={canvas} className="phth__canvas" aria-hidden="true" />
      {children && <div className="phth__content">{children}</div>}
    </div>
  );
}

export default PhantomThreads;
