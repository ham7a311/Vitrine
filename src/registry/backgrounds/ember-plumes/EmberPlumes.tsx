"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { hex, runShader } from "./gl";
import "./ember-plumes.css";

/**
 * Ember Plumes
 * Feathery plumes of fire-coloured smoke curl in from the sides and leave the middle dark,
 * each one a streak of noise stretched along a slowly turning flow.
 */
const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uPress;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(h1(i), h1(i + vec2(1, 0)), f.x), mix(h1(i + vec2(0, 1)), h1(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++){ v += a * vn(p); p = m * p + 3.1; a *= 0.5; } return v; }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }
uniform vec3 uBg; uniform vec3 uDeep; uniform vec3 uMid; uniform vec3 uHot; uniform vec3 uSpot;
void main(){
  float asp = uRes.x / uRes.y;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime * 0.05;
  // the pointer parts the plumes
  vec2 m = (uMouse - 0.5) * vec2(asp, 1.0);
  vec2 dm = p - m;
  p += normalize(dm + 1e-4) * exp(-dot(dm, dm) * 5.0) * uPress * 0.14;
  // the plumes live at the sides and the top corners; the middle stays dark
  float side = abs(p.x) / (0.5 * asp);
  float rag = fbm(p * 1.3 + vec2(t * 0.7, -t * 0.5));
  float mask = smoothstep(0.42, 1.0, side + (rag - 0.5) * 0.85 + max(0.0, p.y) * 0.4 * side);
  // a long exposure: clumps of smoke, each smeared along a slowly turning flow
  vec2 wp = p + 0.55 * vec2(fbm(p * 0.9 + vec2(t, 2.0)), fbm(p * 0.9 + vec2(5.0, -t))) ;
  float ang = (fbm(p * 0.6 + vec2(-t * 0.4, t * 0.3) + 11.0) - 0.5) * 4.5 + sign(p.x) * 1.1 + 0.6;
  vec2 dir = vec2(cos(ang), sin(ang));
  float acc = 0.0, rim = 0.0;
  for (int k = 0; k < 8; k++) {
    float s = float(k) / 7.0 - 0.5;
    vec2 sp = wp + dir * s * 0.24 + dir.yx * vec2(-1.0, 1.0) * s * s * 0.12;
    float v = smoothstep(0.36, 0.6, fbm(sp * 2.3 + vec2(0.0, t * 1.2)));
    acc += v;
    // the slope across the smear lights one side of every petal and shades the other
    rim += v * s;
  }
  acc /= 8.0; rim /= 2.0;
  // fine filaments along the flow
  vec2 q = rot(-ang) * wp;
  float hair = fbm(vec2(q.x * 1.2 - t * 2.0, q.y * 14.0));
  float d = mask * (0.3 + 0.9 * acc * acc) * (0.86 + 0.28 * hair) * 1.22;
  d *= 1.0 + clamp(rim * 2.2, -0.55, 0.9);
  vec3 col = uBg;
  // olive, out-of-focus light in the dark middle
  float spot = smoothstep(0.55, 0.85, fbm(p * 3.2 + vec2(3.0, t * 0.5))) * (1.0 - mask);
  col = mix(col, uSpot, spot * 0.5);
  col = mix(col, uDeep, smoothstep(0.03, 0.26, d));
  col = mix(col, uMid, smoothstep(0.24, 0.66, d));
  col = mix(col, uHot, smoothstep(0.66, 1.15, d) * 0.85);
  col = mix(col, uHot, smoothstep(0.06, 0.32, rim) * mask * acc * 0.75);
  col *= 1.0 - 0.2 * smoothstep(0.6, 1.4, length(p * vec2(0.8, 1.2)));
  col += (h1(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) / 128.0;
  gl_FragColor = vec4(col, 1.0);
}`;

export type EmberPlumesPalette = { bg: string; deep: string; mid: string; hot: string; spot: string };
const DEFAULT: EmberPlumesPalette = { bg: "#0a0b06", deep: "#4d1006", mid: "#d4461d", hot: "#ffb07a", spot: "#30320f" };

export type EmberPlumesProps = {
  palette?: EmberPlumesPalette;
  speed?: number;
  motion?: "full" | "reduced";
  /** Soften the bottom edge into the ground colour, with a little blur, so a page can continue below. */
  fade?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

const uniformsFor = (p: EmberPlumesPalette) =>
  Object.fromEntries(Object.entries(p).map(([k, v]) => [`u${k[0].toUpperCase()}${k.slice(1)}`, typeof v === "string" ? hex(v) : v]));

export function EmberPlumes({ palette = DEFAULT, speed = 1, motion = "full", fade = false, className = "", style, children }: EmberPlumesProps) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv) return;
    return runShader(el, cv, {
      frag: FRAG, speed, reduced: motion === "reduced", start: 200, quality: 0.6, follow: 0.05,
      uniforms: uniformsFor(palette),
      onFail: () => setFailed(true),
    });
  }, [palette, speed, motion]);
  return (
    <div ref={host} className={`eplume ${fade ? "eplume--fade" : ""} ${className}`} data-fallback={failed ? "" : undefined}
      style={{ ["--eplume-bg" as string]: palette.bg, ...style }}>
      <canvas ref={canvas} className="eplume__canvas" aria-hidden="true" />
      {children && <div className="eplume__content">{children}</div>}
    </div>
  );
}

export default EmberPlumes;
