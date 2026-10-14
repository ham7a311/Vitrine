/* Fields borrowed from the backgrounds library, each sampling FC (a zoomed fragment coordinate). */

export type CtaField = "horizon" | "strands" | "plumes" | "shore";

export const FIELDS: Record<CtaField, { frag: string; palette: Record<string, string | number>; quality: number; start: number }> = {
  horizon: { quality: 0.5, start: 30, palette: { sky: "#02040f", band: "#0b2399", glow: "#2f5bff", floor: "#eef2ff" }, frag: `precision highp float;
uniform vec2 uRes; uniform float uZoom;
#define FC (gl_FragCoord.xy * uZoom)
uniform float uTime; uniform vec2 uMouse; uniform float uPress;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(h1(i), h1(i + vec2(1, 0)), f.x), mix(h1(i + vec2(0, 1)), h1(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++){ v += a * vn(p); p = m * p + 3.1; a *= 0.5; } return v; }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }
uniform vec3 uSky; uniform vec3 uBand; uniform vec3 uGlow; uniform vec3 uFloor;
void main(){
  vec2 uv = FC / uRes;
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
  col += (h1(FC + fract(uTime) * 29.0) - 0.5) / 96.0;
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
  shore: { quality: 0.85, start: 30, palette: { top: "#03060f", left: "#2aa4e4", mid: "#3c2f8a", right: "#f2333a" }, frag: `precision highp float;
uniform vec2 uRes; uniform float uZoom;
#define FC (gl_FragCoord.xy * uZoom)
uniform float uTime; uniform vec2 uMouse; uniform float uPress;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(h1(i), h1(i + vec2(1, 0)), f.x), mix(h1(i + vec2(0, 1)), h1(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++){ v += a * vn(p); p = m * p + 3.1; a *= 0.5; } return v; }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }
uniform vec3 uTop; uniform vec3 uLeft; uniform vec3 uMid; uniform vec3 uRight;
vec2 nearest;
vec2 cells(vec2 p){
  vec2 i = floor(p), f = fract(p); float d1 = 8.0, d2 = 8.0;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y));
    vec2 o = vec2(h1(i + g), h1(i + g + 17.0));
    float d = length(g + o - f);
    if (d < d1) { d2 = d1; d1 = d; nearest = i + g + o; } else if (d < d2) d2 = d;
  }
  return vec2(d1, d2);
}
void main(){
  vec2 uv = FC / uRes;
  vec2 p = FC / uRes.y;
  float t = uTime * 0.035;
  float n = fbm(p * 2.0 + vec2(t, -t * 0.4));
  // the bank: high at the left, a long dip, rising again at the right
  float h = 0.2 + 0.4 * smoothstep(0.6, 0.0, uv.x) + 0.14 * smoothstep(0.55, 1.0, uv.x) + (n - 0.5) * 0.22;
  h += 0.12 * exp(-pow((uv.x - uMouse.x) * 4.0, 2.0)) * uPress;
  float body = smoothstep(h + 0.1, h - 0.22, uv.y + (fbm(p * 6.0 + t) - 0.5) * 0.07);
  vec2 c = cells(p * 52.0);
  // crystallised: each little cell takes the cloud's value at its own centre, like pigment drying in flakes
  vec2 pc = nearest / 52.0;
  float cloud = mix(fbm(p * 3.2 + n * 1.4 - vec2(t * 0.6, 0.0)), fbm(pc * 3.2 + n * 1.4 - vec2(t * 0.6, 0.0)), 0.7);
  float mottle = smoothstep(0.0, 0.6, c.x);
  float vein = smoothstep(0.0, 0.08, c.y - c.x);
  float k = uv.x + (n - 0.5) * 0.35;
  vec3 tint = mix(uLeft, uMid, smoothstep(0.22, 0.55, k));
  tint = mix(tint, uRight, smoothstep(0.55, 0.88, k));
  float cl = smoothstep(0.22, 0.74, cloud);
  float b = body * (0.12 + 0.88 * cl * cl) * (0.86 + 0.2 * mottle) * (0.9 + 0.1 * vein);
  // the two hot hearts
  vec2 hl = (uv - vec2(0.07, 0.38)) * vec2(uRes.x / uRes.y, 1.0);
  vec2 hr = (uv - vec2(0.93, 0.18)) * vec2(uRes.x / uRes.y, 1.0);
  b += body * (exp(-dot(hl, hl) * 9.0) + exp(-dot(hr, hr) * 11.0)) * 0.8 * cl;
  vec3 col = uTop * (0.7 + 0.3 * smoothstep(1.0, 0.3, uv.y));
  col += tint * b * 1.1;
  col += mix(tint, vec3(1.0), 0.25) * pow(b, 3.0) * 0.35;
  float grain = h1(FC + fract(uTime * 3.0) * 97.0) - 0.5;
  col += grain * (0.025 + 0.07 * b);
  gl_FragColor = vec4(col, 1.0);
}` },
};
