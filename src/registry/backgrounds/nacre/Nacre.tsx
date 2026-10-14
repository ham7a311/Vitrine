"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { hex, runShader } from "./gl";
import "./nacre.css";

/**
 * Nacre
 * Mother-of-pearl. A layer of nacre a few hundred nanometres thick, flowing slowly in silky
 * folds; its colour is real thin-film interference — each wavelength reinforced or cancelled by
 * the film's thickness and the viewing angle — laid over a pearl base with a soft sheen.
 * The pointer tilts the shell, so the colours slide across it.
 */
const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uPress;
uniform vec3 uBase; uniform vec3 uShade; uniform float uStrength; uniform float uThick; uniform float uFlecks;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h1(i), h1(i + vec2(1, 0)), f.x), mix(h1(i + vec2(0, 1)), h1(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++){ v += a * vn(p); p = p * 1.93 + 1.7; a *= 0.47; } return v; }
float film(vec2 p, float t){
  vec2 q = vec2(fbm(p * 0.9 + vec2(0.0, t * 0.05)), fbm(p * 0.9 + vec2(5.2, -t * 0.04)));
  vec2 r = vec2(fbm(p * 1.1 + q * 2.4 + vec2(1.7, 9.2) + t * 0.03), fbm(p * 1.1 + q * 2.4 + vec2(8.3, 2.8) - t * 0.025));
  return fbm(p * 0.8 + r * 2.0);
}
vec3 interfere(float nm, float cosT){
  // optical path difference for a film of index 1.53, with a half-wave phase flip at the top surface
  float opd = 2.0 * 1.53 * nm * cosT;
  vec3 lambda = vec3(650.0, 532.0, 450.0);
  return 0.5 + 0.5 * cos(6.2831853 * opd / lambda + 3.14159265);
}
void main(){
  float aspect = uRes.x / uRes.y;
  vec2 p = gl_FragCoord.xy / uRes.y * 0.95;
  float t = uTime;
  float f = film(p, t);
  float e = 0.95 / uRes.y;
  float fx = film(p + vec2(e, 0.0), t), fy = film(p + vec2(0.0, e), t);
  vec3 n = normalize(vec3((f - fx) / e * 0.22, (f - fy) / e * 0.22, 1.0));
  vec2 tilt = (uMouse - 0.5) * vec2(aspect, 1.0) * uPress;
  vec3 view = normalize(vec3(-tilt * 0.9 + (gl_FragCoord.xy / uRes - 0.5) * 0.35, 1.0));
  float cosT = clamp(dot(n, view), 0.2, 1.0);
  // fine layered banding along the folds, like stacked nacre platelets
  float nm = uThick + 240.0 * f + 70.0 * sin(f * 26.0 + t * 0.15) + 50.0 * tilt.x;
  vec3 irid = interfere(nm, cosT);
  // nacre reflects only a little of the light as colour: keep the interference low-contrast
  vec3 col = uBase * (1.0 + (irid - 0.5) * uStrength);
  col = mix(col, uShade, smoothstep(0.55, 0.15, f) * 0.25);
  float sheen = pow(max(0.0, dot(reflect(-view, n), normalize(vec3(-0.4, 0.5, 0.8)))), 10.0);
  col += sheen * 0.4;
  col *= 0.93 + 0.07 * n.z;
  if (uFlecks > 0.0) {
    vec2 g = floor(p * 60.0);
    float s = h1(g);
    float flash = step(0.985, s) * pow(0.5 + 0.5 * sin(t * 1.5 + s * 40.0 + tilt.x * 8.0), 8.0);
    col += interfere(uThick + 500.0 * s, 0.9) * flash * uFlecks;
  }
  gl_FragColor = vec4(col, 1.0);
}`;

export type NacrePalette = { base: string; shade: string; strength: number; thickness: number; flecks?: number };
const DEFAULT: NacrePalette = { base: "#f1eef2", shade: "#cfcbdb", strength: 0.38, thickness: 360 };

export type NacreProps = {
  palette?: NacrePalette;
  speed?: number;
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export function Nacre({ palette = DEFAULT, speed = 1, motion = "full", className = "", style, children }: NacreProps) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv) return;
    return runShader(el, cv, {
      frag: FRAG, speed, reduced: motion === "reduced", start: 40, quality: 0.7, follow: 0.05,
      uniforms: { uBase: hex(palette.base), uShade: hex(palette.shade), uStrength: palette.strength, uThick: palette.thickness, uFlecks: palette.flecks ?? 0 },
      onFail: () => setFailed(true),
    });
  }, [palette, speed, motion]);
  return (
    <div ref={host} className={`nacre ${className}`} data-fallback={failed ? "" : undefined}
      style={{ ["--nacre-base" as string]: palette.base, ["--nacre-shade" as string]: palette.shade, ...style }}>
      <canvas ref={canvas} className="nacre__canvas" aria-hidden="true" />
      {children && <div className="nacre__content">{children}</div>}
    </div>
  );
}

export default Nacre;
