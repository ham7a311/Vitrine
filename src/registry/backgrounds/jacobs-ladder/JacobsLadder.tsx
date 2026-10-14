"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { hex, runShader } from "./gl";
import "./jacobs-ladder.css";

/**
 * Jacob's Ladder
 * Two rails rise in a V. An electric arc strikes across their narrow bottom, climbs as the hot air
 * carries it, stretches and bows as the rails part, then snaps and strikes again below. The arc
 * crackles with a new path every strike and leaves a fading trail; a violet column of ionised air
 * glows behind it. The pointer pulls the arc towards it.
 */
const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uPress;
uniform vec3 uBg; uniform vec3 uGlow; uniform vec3 uCore; uniform vec3 uMetal; uniform float uPeriod;
float h1(float n){ return fract(sin(n * 78.233) * 43758.5453); }
float n1(float x){ float i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f); return mix(h1(i), h1(i + 1.0), f); }
float jag(float x, float seed, float t){
  return (n1(x * 9.0 + seed) - 0.5) * 0.5 + (n1(x * 23.0 + seed * 1.7 + floor(t * 18.0)) - 0.5) * 0.35 + (n1(x * 61.0 + seed * 3.1 + floor(t * 30.0)) - 0.5) * 0.15;
}
float half_(float y){ return 0.035 + 0.24 * y; }
float arcY(float x, float phase, float seed, float t, vec2 m){
  float ya = 0.05 + 0.86 * pow(phase, 1.45);
  float hw = half_(ya);
  float u = clamp(x / hw, -1.0, 1.0);
  float bow = (1.0 - u * u) * (0.02 + 0.09 * phase);
  float y = ya + bow + jag(x, seed, t) * (0.024 + 0.04 * phase);
  float pull = uPress * exp(-pow(x - m.x, 2.0) / 0.02) * clamp(m.y - y, -0.12, 0.12) * 0.8;
  return y + pull;
}
void main(){
  float aspect = uRes.x / uRes.y;
  vec2 uv = vec2((gl_FragCoord.x - 0.5 * uRes.x) / uRes.y, gl_FragCoord.y / uRes.y);
  float y01 = gl_FragCoord.y / uRes.y;
  vec2 m = vec2((uMouse.x - 0.5) * aspect, uMouse.y);
  float t = uTime;
  float cyc = t / uPeriod;
  float k = floor(cyc);
  float phase = fract(cyc);
  vec3 col = mix(uBg * 0.6, uBg, y01);

  // ionised column
  float ya = 0.05 + 0.86 * pow(phase, 1.45);
  float column = exp(-abs(uv.x) / 0.16) * (0.08 + 0.22 * exp(-pow(uv.y - ya, 2.0) / 0.03));
  col += uGlow * column;

  // the arc and its fading trail
  float life = smoothstep(0.0, 0.03, phase) * (1.0 - smoothstep(0.93, 1.0, phase));
  float flick = 0.75 + 0.25 * h1(floor(t * 40.0));
  vec3 light = vec3(0.0);
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float ph = phase - fi * 0.018;
    if (ph < 0.0) continue;
    float hw = half_(0.05 + 0.86 * pow(ph, 1.45));
    if (abs(uv.x) > hw) continue;
    float d = abs(uv.y - arcY(uv.x, ph, k * 13.1 + fi * 0.0, t - fi * 0.05, m));
    float wgt = fi == 0.0 ? 1.0 : 0.35 / fi;
    float core = exp(-pow(d / 0.0028, 2.0));
    float glow = exp(-d / 0.012) * 0.7 + exp(-d / 0.06) * 0.2;
    float edge = smoothstep(hw, hw * 0.94, abs(uv.x));
    light += (uCore * core * (fi == 0.0 ? 1.6 : 0.0) + uGlow * glow) * wgt * edge;
    if (i == 0) {
      float d2 = abs(uv.y - arcY(uv.x, ph, k * 13.1 + 5.7, t + 0.37, m) - 0.004);
      light += (uCore * exp(-pow(d2 / 0.0016, 2.0)) * 0.7 + uGlow * exp(-d2 / 0.008) * 0.3) * edge;
    }
  }
  col += light * life * flick;

  // strike flash at the bottom of each cycle
  float flash = exp(-phase * 40.0) * exp(-length(uv - vec2(0.0, 0.05)) / 0.08);
  col += uCore * flash * 1.4;

  // rails: brushed metal catching the arc light
  for (int s = 0; s < 2; s++) {
    float side = s == 0 ? -1.0 : 1.0;
    float rx = side * (half_(uv.y) + 0.004);
    float d = abs(uv.x - rx);
    float body = (1.0 - smoothstep(0.0035, 0.0055, d)) * step(0.0, uv.y) * step(uv.y, 0.98);
    float lit = exp(-pow(uv.y - ya, 2.0) / 0.006) * life;
    vec3 metal = uMetal * (0.35 + 0.25 * sin(uv.y * 80.0) * 0.1) + uGlow * lit * 1.2 + uCore * lit * 0.4;
    col = mix(col, metal, body);
    col += uGlow * exp(-d / 0.01) * lit * 0.25;
  }

  vec2 q = gl_FragCoord.xy / uRes - 0.5;
  col *= 1.0 - dot(q, q) * 0.5;
  col = vec3(1.0) - exp(-col * 1.25);
  gl_FragColor = vec4(col, 1.0);
}`;

export type LadderPalette = { ground: string; glow: string; core: string; metal: string };
const DEFAULT: LadderPalette = { ground: "#0b0716", glow: "#9a6bff", core: "#f6efff", metal: "#8c8a99" };

export type JacobsLadderProps = {
  palette?: LadderPalette;
  /** Seconds from one strike to the next. */
  period?: number;
  speed?: number;
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export function JacobsLadder({ palette = DEFAULT, period = 2.6, speed = 1, motion = "full", className = "", style, children }: JacobsLadderProps) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv) return;
    return runShader(el, cv, {
      // the still frame is mid-climb
      frag: FRAG, speed, reduced: motion === "reduced", start: period * 7.55, quality: 0.85, follow: 0.12,
      uniforms: { uPeriod: period, uBg: hex(palette.ground), uGlow: hex(palette.glow), uCore: hex(palette.core), uMetal: hex(palette.metal) },
      onFail: () => setFailed(true),
    });
  }, [palette, period, speed, motion]);
  return (
    <div ref={host} className={`jlad ${className}`} data-fallback={failed ? "" : undefined}
      style={{ ["--jlad-ground" as string]: palette.ground, ["--jlad-glow" as string]: palette.glow, ...style }}>
      <canvas ref={canvas} className="jlad__canvas" aria-hidden="true" />
      {children && <div className="jlad__content">{children}</div>}
    </div>
  );
}

export default JacobsLadder;
