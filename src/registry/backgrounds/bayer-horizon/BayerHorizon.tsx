"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Bayer Horizon
 * A continuous sky (glow at the horizon, a sun, a far ridge, a darker ground
 * with the sun's reflection) quantised to three colours through an 8×8 Bayer
 * matrix at a chunky pixel size. Static by default — it renders once and
 * again on resize. `setting` lets the sun sink over a few minutes.
 */

type Props = {
  children?: ReactNode;
  /** [ground, mid, light] */
  palette?: [string, string, string];
  /** Dither cell size in CSS pixels. */
  pixel?: number;
  /** Sun height above the horizon, −0.1 … 0.4. */
  sun?: number;
  /** When true the sun slowly sets and rises again (≈3 min cycle). */
  setting?: boolean;
  className?: string;
};

const VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
const FS = `precision highp float;
uniform vec2 res; uniform float px; uniform float sunY; uniform vec3 c0, c1, c2;
float b2(vec2 a){ a = floor(a); return fract(a.x / 2. + a.y * a.y * .75); }
float b4(vec2 a){ return b2(.5 * a) * .25 + b2(a); }
float b8(vec2 a){ return b4(.5 * a) * .25 + b2(a); }
float h(float x){ return fract(sin(x * 127.1) * 43758.5453); }
float n(float x){ float i = floor(x), f = fract(x); f = f * f * (3. - 2. * f); return mix(h(i), h(i + 1.), f); }
void main(){
  vec2 cell = floor(gl_FragCoord.xy / px);
  vec2 uv = (cell * px + .5 * px) / res;
  float ar = res.x / res.y;
  float horizon = .34;
  float ridge = horizon + .035 * n(uv.x * 5.) + .018 * n(uv.x * 13. + 4.) - .02;
  vec2 sp = vec2(.64, horizon + sunY);
  vec2 d = (uv - sp) * vec2(ar, 1.);
  float r = length(d);
  float v;
  if (uv.y > ridge) {
    float up = (uv.y - horizon) / (1. - horizon);
    v = .72 * exp(-up * 3.2) + .1;                       // sky: bright at the horizon
    v += .42 * exp(-r * 9.) + .26 * exp(-r * 2.8);          // sun halo
    v += smoothstep(.052, .046, r);                         // sun disc
    v *= smoothstep(-.12, .08, sunY) * .7 + .3;              // the whole sky dims as it sets
  } else {
    float down = (ridge - uv.y) / ridge;
    v = .22 * exp(-down * 4.);                              // ground haze
    float streak = exp(-abs((uv.x - sp.x) * ar) * 18.) * exp(-down * 2.5);
    v += streak * .75 * smoothstep(-.1, .1, sunY) * (.6 + .4 * sin(uv.y * 240.));
    if (uv.y > ridge - .012) v *= .35;                       // the ridge line itself stays dark
  }
  v = clamp(v, 0., 1.);
  float t = b8(cell);
  float q = floor(v * 2. + t);
  vec3 col = q < .5 ? c0 : (q < 1.5 ? c1 : c2);
  gl_FragColor = vec4(col, 1.);
}`;

const hex = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16) / 255);

export function BayerHorizon({ children, palette = ["#0b080d", "#3a2748", "#e6d6f2"], pixel = 3, sun = 0.07, setting = false, className = "" }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const box = wrap.current!, canvas = cv.current!;
    const gl = canvas.getContext("webgl", { antialias: false, preserveDrawingBuffer: true });
    if (!gl) return;
    const sh = (t: number, s: string) => { const o = gl.createShader(t)!; gl.shaderSource(o, s); gl.compileShader(o); return o; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog); gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (k: string) => gl.getUniformLocation(prog, k);
    ["c0", "c1", "c2"].forEach((k, i) => gl.uniform3fv(U(k), hex(palette[i])));

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dpr = 1, raf = 0, visible = true, sunY = sun, t0 = performance.now();
    const render = () => {
      gl.uniform2f(U("res"), canvas.width, canvas.height);
      gl.uniform1f(U("px"), Math.max(1, Math.round(pixel * dpr)));
      gl.uniform1f(U("sunY"), sunY);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(2, Math.floor(box.clientWidth * dpr));
      canvas.height = Math.max(2, Math.floor(box.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      render();
    };
    // the setting sun only needs a new frame every so often — it moves a pixel at a time
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      const k = ((now - t0) / 180000) % 1;
      const next = sun - 0.17 * (0.5 - 0.5 * Math.cos(k * Math.PI * 2));
      if (Math.abs(next - sunY) > 0.0015) { sunY = next; render(); }
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(box);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting)); io.observe(box);
    if (setting && !reduce) raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [palette, pixel, sun, setting]);

  return (
    <div ref={wrap} className={className} style={{ position: "relative", isolation: "isolate", width: "100%", height: "100%", minHeight: 280, background: palette[0] }}>
      <canvas ref={cv} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", imageRendering: "pixelated" }} />
      {children && <div style={{ position: "relative", zIndex: 1, height: "100%" }}>{children}</div>}
    </div>
  );
}
