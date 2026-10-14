"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { hex, runShader } from "./gl";
import "./iron-bloom.css";

/**
 * Iron Bloom
 * A pool of black magnetic fluid. At rest its glossy surface slowly flows and catches thin white
 * reflections. A magnet — wandering on its own, or under the pointer — pulls a crown of sharp
 * spikes up out of it in a hexagonal pattern, the way real ferrofluid stands up in a field.
 */
const FRAG = `precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uPress;
uniform vec3 uBase; uniform vec3 uLight; uniform vec3 uTint; uniform float uIris;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h1(i), h1(i + vec2(1, 0)), f.x), mix(h1(i + vec2(0, 1)), h1(i + vec2(1, 1)), f.x), f.y); }
vec3 CAM = vec3(0.0, 1.05, -2.2);
vec3 rayDir(vec2 frag){
  vec2 uv = (frag - 0.5 * uRes) / uRes.y;
  vec3 fw = normalize(vec3(0.0, -0.42, 1.0));
  vec3 rt = normalize(cross(vec3(0.0, 1.0, 0.0), fw));
  vec3 up = cross(fw, rt);
  return normalize(fw * 1.35 + uv.x * rt + uv.y * up);
}
vec2 magnet(float t){
  vec2 wander = vec2(0.42 * sin(t * 0.19) + 0.12 * sin(t * 0.47), 0.75 + 0.28 * cos(t * 0.15));
  vec3 rd = rayDir(uMouse * uRes);
  float k = rd.y < -0.01 ? -CAM.y / rd.y : 8.0;
  vec2 hit = (CAM + rd * k).xz;
  hit.y = clamp(hit.y, -0.4, 3.0);
  return mix(wander, hit, uPress);
}
float H(vec2 p, float t, vec2 mg){
  float flow = 0.035 * (sin(p.x * 2.3 + t * 0.4 + sin(p.y * 1.7 - t * 0.3)) + sin(p.y * 2.9 - t * 0.35 + sin(p.x * 1.3)))
    + 0.03 * vn(p * 3.0 + vec2(t * 0.15, -t * 0.1));
  vec2 d = p - mg;
  float r2 = dot(d, d);
  float field = exp(-r2 / 0.2);
  float ang = t * 0.04;
  mat2 R = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
  vec2 s = R * d * 21.0;
  float g = cos(s.x) + cos(dot(s, vec2(-0.5, 0.8660254))) + cos(dot(s, vec2(-0.5, -0.8660254)));
  float spike = pow(max(0.0, (g + 1.5) / 4.5), 5.0);
  float mound = exp(-r2 / 0.3) * 0.12;
  return flow * (1.0 - field * 0.8) + mound + spike * field * 0.3;
}
vec3 env(vec3 r){
  float boxes = 0.0;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    boxes += exp(-pow((r.y - (0.25 + fi * 0.22)) / (0.03 + fi * 0.012), 2.0)) * smoothstep(0.9, 0.2, abs(r.x - 0.15 + fi * 0.2)) * (1.0 - fi * 0.25);
  }
  float key = pow(max(0.0, dot(r, normalize(vec3(-0.5, 0.65, 0.5)))), 50.0);
  return uLight * (boxes * 1.1 + key * 2.4) + uTint * smoothstep(-0.2, 0.6, r.y) * 0.25;
}
void main(){
  float t = uTime;
  vec2 mg = magnet(t);
  vec3 rd = rayDir(gl_FragCoord.xy);
  vec3 col = uBase;
  float dist = 0.0;
  bool hit = false;
  vec3 pos;
  for (int i = 0; i < 110; i++) {
    pos = CAM + rd * dist;
    float h = pos.y - H(pos.xz, t, mg);
    if (h < 0.002) { hit = true; break; }
    dist += max(0.004, h * 0.32);
    if (dist > 9.0) break;
  }
  if (hit) {
    vec2 e = vec2(0.004, 0.0);
    vec3 n = normalize(vec3(H(pos.xz - e.xy, t, mg) - H(pos.xz + e.xy, t, mg), 2.0 * e.x, H(pos.xz - e.yx, t, mg) - H(pos.xz + e.yx, t, mg)));
    vec3 r = reflect(rd, n);
    float fres = 0.04 + 0.96 * pow(1.0 - max(0.0, dot(-rd, n)), 5.0);
    vec3 spec = env(r) * (0.35 + 0.65 * fres);
    vec3 iris = 0.5 + 0.5 * cos(6.2831 * (n.x * 1.5 + n.z * 1.2 + vec3(0.0, 0.33, 0.67)));
    spec *= mix(vec3(1.0), iris * 1.5, uIris);
    col = uBase + spec;
    col = mix(col, uBase, smoothstep(3.0, 8.5, dist));
  }
  vec2 q = gl_FragCoord.xy / uRes - 0.5;
  col *= 1.0 - dot(q, q) * 0.6;
  gl_FragColor = vec4(col, 1.0);
}`;

export type BloomPalette = { base: string; light: string; tint: string; iridescent?: boolean };
const DEFAULT: BloomPalette = { base: "#050506", light: "#f2f2f4", tint: "#30303a" };

export type IronBloomProps = {
  palette?: BloomPalette;
  speed?: number;
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export function IronBloom({ palette = DEFAULT, speed = 1, motion = "full", className = "", style, children }: IronBloomProps) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv) return;
    return runShader(el, cv, {
      frag: FRAG, speed, reduced: motion === "reduced", start: 8, quality: 0.6, follow: 0.05,
      uniforms: { uBase: hex(palette.base), uLight: hex(palette.light), uTint: hex(palette.tint), uIris: palette.iridescent ? 1 : 0 },
      onFail: () => setFailed(true),
    });
  }, [palette, speed, motion]);
  return (
    <div ref={host} className={`irbl ${className}`} data-fallback={failed ? "" : undefined}
      style={{ ["--irbl-base" as string]: palette.base, ["--irbl-light" as string]: palette.light, ...style }}>
      <canvas ref={canvas} className="irbl__canvas" aria-hidden="true" />
      {children && <div className="irbl__content">{children}</div>}
    </div>
  );
}

export default IronBloom;
