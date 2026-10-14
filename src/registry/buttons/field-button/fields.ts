/* Fields borrowed from the backgrounds library, each sampling FC (a zoomed fragment coordinate). */

export type Field = "smoke" | "veins" | "strands" | "velvet" | "sash" | "plumes";

export const FIELDS: Record<Field, { frag: string; palette: Record<string, string | number>; quality: number; start: number }> = {
  smoke: { quality: 0.6, start: 30, palette: { void: "#010209", body: "#323e62", light: "#a3b4dd", cover: 0.29 }, frag: `precision highp float;
uniform vec2 uRes; uniform float uZoom;
#define FC (gl_FragCoord.xy * uZoom)
uniform float uTime; uniform vec2 uMouse; uniform float uPress;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(h1(i), h1(i + vec2(1, 0)), f.x), mix(h1(i + vec2(0, 1)), h1(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++){ v += a * vn(p); p = m * p + 3.1; a *= 0.5; } return v; }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }
uniform vec3 uVoid; uniform vec3 uBody; uniform vec3 uLight; uniform float uCover;
void main(){
  float asp = uRes.x / uRes.y;
  vec2 p = FC / uRes.y * 1.15;
  float t = uTime * 0.035;
  // a slow eddy turns around the pointer
  vec2 m = uMouse * vec2(asp, 1.0) * 1.15;
  vec2 d = p - m;
  p = m + rot(exp(-dot(d, d) * 1.4) * uPress * 1.3) * d;
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t * 0.8));
  vec2 r = vec2(fbm(p + 4.0 * q + vec2(1.7, 9.2) + t * 0.6), fbm(p + 4.0 * q + vec2(8.3, 2.8) - t * 0.5));
  float f = fbm(p + 3.6 * r);
  float smoke = smoothstep(uCover, uCover + 0.32, f);
  // silky strands along the warp, brightest where the smoke is thin
  float silk = pow(1.0 - abs(sin((r.x * 2.0 + q.y) * 14.0)), 10.0);
  float edge = smoothstep(0.0, 0.25, smoke) * smoothstep(1.0, 0.45, smoke);
  vec3 col = mix(uVoid, uBody, smoke);
  col = mix(col, uLight, smoothstep(0.58, 0.95, f) * 0.8);
  col += uLight * silk * (0.06 + 0.22 * edge) * smoke;
  col += (h1(FC + fract(uTime) * 53.0) - 0.5) / 160.0;
  gl_FragColor = vec4(col, 1.0);
}` },
  veins: { quality: 0.75, start: 30, palette: { bg: "#040308", vein: "#5b1ef2", core: "#9e70ff", star: "#e8e6f2" }, frag: `precision highp float;
uniform vec2 uRes; uniform float uZoom;
#define FC (gl_FragCoord.xy * uZoom)
uniform float uTime; uniform vec2 uMouse; uniform float uPress;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(h1(i), h1(i + vec2(1, 0)), f.x), mix(h1(i + vec2(0, 1)), h1(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++){ v += a * vn(p); p = m * p + 3.1; a *= 0.5; } return v; }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }
uniform vec3 uBg; uniform vec3 uVein; uniform vec3 uCore; uniform vec3 uStar;
// three smooth octaves, so the veins bend instead of fraying
float soft(vec2 p){ float v = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 3; i++){ v += a * vn(p); p = m * p + 3.1; a *= 0.5; } return v / 0.875; }
void main(){
  float asp = uRes.x / uRes.y;
  vec2 uv = FC / uRes;
  vec2 p = FC / uRes.y * 3.4;
  float t = uTime * 0.045;
  vec2 w = vec2(soft(p * 0.55 + vec2(t, 0.0)), soft(p * 0.55 + vec2(4.0, -t)));
  float n = soft(p + 1.8 * w + vec2(0.0, t * 0.5));
  float e = abs(n - 0.5);
  float e2 = min(abs(n - 0.32), abs(n - 0.68));
  // some stretches burn bright, others nearly vanish
  float seg = smoothstep(0.25, 0.75, fbm(p * 0.9 - vec2(t * 1.4, t)));
  vec2 m = uMouse * vec2(asp, 1.0) * 3.4;
  float near = exp(-dot(p - m, p - m) * 0.9) * uPress;
  float s = 0.18 + 0.82 * seg + near * 0.9;
  float core = smoothstep(0.012, 0.0, e) * s;
  float glow = (exp(-e * 34.0) * 0.55 + exp(-e * 9.0) * 0.12) * s;
  float faint = (smoothstep(0.01, 0.0, e2) * 0.7 + exp(-e2 * 30.0) * 0.3) * (0.08 + 0.6 * seg);
  vec3 col = uBg + uVein * (glow + faint) + uCore * core;
  // a fine dust of stars, and a few soft out-of-focus ones
  vec2 g = FC / uRes.y * 26.0;
  vec2 id = floor(g), f = fract(g) - 0.5;
  vec2 off = (vec2(h1(id), h1(id + 7.1)) - 0.5) * 0.7;
  float star = step(0.8, h1(id + 3.3)) * smoothstep(0.075, 0.02, length(f - off)) * (0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (0.6 + h1(id) * 1.5) + h1(id + 1.0) * 40.0)));
  col += uStar * star * 0.7;
  for (int i = 0; i < 6; i++) {
    float k = float(i);
    vec2 c = vec2(fract(h1(vec2(k, 1.0)) + uTime * 0.004 * (1.0 + k * 0.3)) * asp, fract(h1(vec2(k, 9.0)) + uTime * 0.002 * (k - 2.5)));
    vec2 dd = FC / uRes.y - c;
    col += uStar * exp(-dot(dd, dd) / 0.00016) * 0.75 * (0.6 + 0.4 * sin(uTime * 0.4 + k));
  }
  col = 1.0 - exp(-col * 1.25);
  gl_FragColor = vec4(col, 1.0);
}` },
  strands: { quality: 0.75, start: 40, palette: { bg: "#000000", c0: "#3a137a", c1: "#7a2ef5", c2: "#2b8df2", c3: "#a6e4ff", c4: "#f4e2b0", c5: "#4f35c8" }, frag: `precision highp float;
uniform vec2 uRes; uniform float uZoom;
#define FC (gl_FragCoord.xy * uZoom)
uniform float uTime; uniform vec2 uMouse; uniform float uPress;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(h1(i), h1(i + vec2(1, 0)), f.x), mix(h1(i + vec2(0, 1)), h1(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++){ v += a * vn(p); p = m * p + 3.1; a *= 0.5; } return v; }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }
uniform vec3 uBg; uniform vec3 uC0; uniform vec3 uC1; uniform vec3 uC2; uniform vec3 uC3; uniform vec3 uC4; uniform vec3 uC5;
vec3 pick(int i){ if (i == 0) return uC0; if (i == 1) return uC1; if (i == 2) return uC2; if (i == 3) return uC3; if (i == 4) return uC4; return uC5; }
float curve(float x, float base, float amp, float fr, float sp, float ph, float t){
  return base + amp * sin(x * fr + t * sp + ph) + amp * 0.35 * sin(x * fr * 2.3 - t * sp * 0.7 + ph * 1.7);
}
void main(){
  float asp = uRes.x / uRes.y;
  vec2 p = (FC - 0.5 * uRes) / uRes.y;
  float t = uTime;
  vec2 m = (uMouse - 0.5) * vec2(asp, 1.0);
  float pull = exp(-pow((p.x - m.x) * 2.2, 2.0)) * uPress;
  vec3 acc = vec3(0.0);
  float cores = 0.0;
  for (int i = 0; i < 6; i++) {
    float k = float(i);
    float base = 0.36 - k * 0.15 + 0.04 * sin(k * 2.1);
    float amp = 0.18 + 0.12 * fract(k * 0.37);
    float fr = 0.95 + 0.6 * fract(k * 0.71);
    float sp = (0.14 + 0.05 * k) * (mod(k, 2.0) < 0.5 ? 1.0 : -1.0);
    float ph = k * 1.9;
    float strength = i == 0 ? 0.35 : (i == 5 ? 0.45 : 1.0);
    float y = curve(p.x, base, amp, fr, sp, ph, t);
    float dy = (curve(p.x + 0.002, base, amp, fr, sp, ph, t) - y) / 0.002;
    y += (y - m.y) * 0.45 * pull * exp(-abs(y - m.y) * 2.0);
    float d = abs(p.y - y) / sqrt(1.0 + dy * dy);
    float core = exp(-d * d / (2.0 * 0.0042 * 0.0042));
    float glow = exp(-d / 0.03) * 0.55 + exp(-d / 0.09) * 0.06;
    acc += pick(i) * (core * 1.6 + glow) * strength;
    cores += core * strength;
  }
  // where strands cross the light adds up and burns towards white
  acc += vec3(smoothstep(0.9, 1.8, cores)) * 0.8;
  vec3 col = uBg + 1.0 - exp(-acc * 1.35);
  col += (h1(FC + fract(t) * 19.0) - 0.5) / 200.0;
  gl_FragColor = vec4(col, 1.0);
}` },
  velvet: { quality: 1.0, start: 30, palette: { bg: "#070405", dye: "#7a1515", grain: 0.14 }, frag: `precision highp float;
uniform vec2 uRes; uniform float uZoom;
#define FC (gl_FragCoord.xy * uZoom)
uniform float uTime; uniform vec2 uMouse; uniform float uPress;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(h1(i), h1(i + vec2(1, 0)), f.x), mix(h1(i + vec2(0, 1)), h1(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++){ v += a * vn(p); p = m * p + 3.1; a *= 0.5; } return v; }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }
uniform vec3 uBg; uniform vec3 uDye; uniform float uGrain;
void main(){
  float asp = uRes.x / uRes.y;
  vec2 uv = FC / uRes;
  vec2 p = (FC - uRes * vec2(0.42, 0.52)) / uRes.y;
  float t = uTime * 0.05;
  // a slow whorl: bands that wind around a point left of centre, bent by soft noise
  vec2 c = (uMouse - vec2(0.42, 0.52)) * vec2(asp, 1.0) * 0.25 * uPress;
  vec2 d = p - c;
  float r = length(d), ang = atan(d.y, d.x);
  float w = (fbm(p * 1.1 + vec2(t, -t * 0.7)) - 0.5) * 3.2;
  float v = sin(r * 7.5 - ang * 1.0 + w - t * 2.0);
  float v2 = sin(p.x * 3.0 + p.y * 2.2 + w * 1.4 + t * 1.5);
  float band = smoothstep(0.05, 1.0, v * 0.75 + v2 * 0.3);
  band *= smoothstep(0.05, 0.3, r) * (0.65 + 0.35 * smoothstep(1.2, 0.3, r));
  vec3 col = mix(uBg, uDye, band * 0.9);
  col *= 1.0 - 0.25 * smoothstep(0.45, 1.0, length(uv - 0.5) * 1.3);
  float g = h1(FC + fract(uTime * 12.0) * vec2(91.7, 37.3)) - 0.5;
  float gc = h1(FC * 1.3 + fract(uTime * 9.0) * vec2(13.1, 77.9)) - 0.5;
  col += g * uGrain * (0.35 + band) + uDye * gc * uGrain * 1.4 * band;
  gl_FragColor = vec4(max(col, 0.0), 1.0);
}` },
  sash: { quality: 0.5, start: 30, palette: { bg: "#031a17", body: "#2a877e", edge: "#9ee6d6", haze: "#eefcf7" }, frag: `precision highp float;
uniform vec2 uRes; uniform float uZoom;
#define FC (gl_FragCoord.xy * uZoom)
uniform float uTime; uniform vec2 uMouse; uniform float uPress;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(h1(i), h1(i + vec2(1, 0)), f.x), mix(h1(i + vec2(0, 1)), h1(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++){ v += a * vn(p); p = m * p + 3.1; a *= 0.5; } return v; }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }
uniform vec3 uBg; uniform vec3 uBody; uniform vec3 uEdge; uniform vec3 uHaze;
void main(){
  float asp = uRes.x / uRes.y;
  vec2 p = (FC - 0.5 * uRes) / uRes.y;
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
  col += (h1(FC + fract(uTime) * 37.0) - 0.5) / 110.0;
  gl_FragColor = vec4(col, 1.0);
}` },
  plumes: { quality: 0.6, start: 200, palette: { bg: "#0a0b06", deep: "#4d1006", mid: "#d4461d", hot: "#ffb07a", spot: "#30320f" }, frag: `precision highp float;
uniform vec2 uRes; uniform float uZoom;
#define FC (gl_FragCoord.xy * uZoom)
uniform float uTime; uniform vec2 uMouse; uniform float uPress;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(h1(i), h1(i + vec2(1, 0)), f.x), mix(h1(i + vec2(0, 1)), h1(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++){ v += a * vn(p); p = m * p + 3.1; a *= 0.5; } return v; }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }
uniform vec3 uBg; uniform vec3 uDeep; uniform vec3 uMid; uniform vec3 uHot; uniform vec3 uSpot;
void main(){
  float asp = uRes.x / uRes.y;
  vec2 p = (FC - 0.5 * uRes) / uRes.y;
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
  col += (h1(FC + fract(uTime) * 61.0) - 0.5) / 128.0;
  gl_FragColor = vec4(col, 1.0);
}` },
};
