"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Light Leak
 * The look of a roll of film that let a little light in. Warm leaks bloom
 * from the edges — hot and pale at the heart, burning to red at the fringe
 * — swell, drift and fade on their own slow clocks. Grain crawls over
 * everything, a speck of dust or a hairline scratch flashes past now and
 * then, and the whole frame weaves very slightly in the gate. It runs at
 * 24 frames a second, like the real thing. Bring the pointer to an edge and
 * light starts to leak in there.
 */

type Props = {
  theme?: "warm" | "cool" | "mono";
  className?: string;
  children?: ReactNode;
};

const THEMES = {
  warm: { base: ["#0a0706", "#1a120d"], hot: "#fff1cf", mid: "#ff9a2e", fringe: "#e5281a", css: "radial-gradient(80% 70% at 30% 40%, #2a1608, #0a0706)" },
  cool: { base: ["#05070b", "#0e1420"], hot: "#f0fbff", mid: "#3fd0ff", fringe: "#c22bd9", css: "radial-gradient(80% 70% at 30% 40%, #0c1a28, #05070b)" },
  mono: { base: ["#070707", "#141414"], hot: "#ffffff", mid: "#cfcac2", fringe: "#5a5650", css: "radial-gradient(80% 70% at 30% 40%, #1c1c1c, #070707)" },
};

const VERT = `attribute vec2 aPos; void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;
const FRAG = `precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uFrame;
uniform vec2 uWeave;
uniform vec3 uB0; uniform vec3 uB1;
uniform vec3 uHot; uniform vec3 uMid; uniform vec3 uFringe;
uniform vec4 uPtr; // x, y, strength, unused

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }

/** One leak: a soft, noise-torn bloom anchored at a, stretched along the edge. */
float leak(vec2 uv, vec2 a, vec2 stretch, float t, float seed){
  vec2 d = (uv - a) / stretch;
  float warp = fbm(uv * 2.2 + vec2(seed, t * 0.05)) - 0.5;
  float r = length(d) + warp * 0.55;
  return exp(-r * r * 2.2);
}

void main(){
  vec2 frag = gl_FragCoord.xy + uWeave;
  vec2 uv = frag / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = uTime;

  // The base: a dark frame, faintly lighter where the subject would be.
  vec3 col = mix(uB0, uB1, smoothstep(1.1, 0.0, length((uv - vec2(0.42, 0.5)) * vec2(1.0, 1.3))));

  // Leaks, each breathing on its own slow clock.
  float l = 0.0;
  l += leak(p, vec2(-0.05, 0.75), vec2(0.5, 0.9), t, 1.0) * smoothstep(0.25, 0.85, fbm(vec2(t * 0.07, 3.0)));
  l += leak(p, vec2(aspect + 0.05, 0.3), vec2(0.45, 0.8), t, 7.0) * smoothstep(0.3, 0.9, fbm(vec2(t * 0.06, 11.0)));
  l += leak(p, vec2(aspect * 0.6, 1.08), vec2(0.9, 0.35), t, 13.0) * smoothstep(0.35, 0.9, fbm(vec2(t * 0.05, 23.0))) * 0.8;
  if (uPtr.z > 0.001) l += leak(p, uPtr.xy, vec2(0.5, 0.5), t, 31.0) * uPtr.z;
  l = clamp(l, 0.0, 1.6);
  // Hot and pale at the heart, through the colour, burning to the fringe at the edge.
  vec3 leakCol = mix(uFringe, uMid, smoothstep(0.05, 0.55, l));
  leakCol = mix(leakCol, uHot, smoothstep(0.75, 1.35, l));
  vec3 lc = leakCol * smoothstep(0.0, 0.6, l) * 1.1;
  col = 1.0 - (1.0 - col) * (1.0 - clamp(lc, 0.0, 1.0)); // screen

  // Gate flicker.
  col *= 0.97 + 0.06 * hash(vec2(uFrame, 1.7));

  // Grain: new every frame, strongest in the mid-tones.
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  float gr = hash(floor(frag / 1.4) + uFrame * 17.0) - 0.5;
  col += gr * (0.07 + 0.08 * (1.0 - abs(lum - 0.45) * 2.0));

  // Now and then, a hairline scratch for a few frames…
  float sc = floor(uFrame / 3.0);
  if (hash(vec2(sc, 5.1)) > 0.86) {
    float x = hash(vec2(sc, 9.3)) + sin(uv.y * 9.0 + sc) * 0.002;
    float line = exp(-pow((uv.x - x) * uRes.x / 0.8, 2.0));
    col += line * 0.22 * (0.6 + 0.4 * noise(vec2(uv.y * 40.0, sc)));
  }
  // …and a speck of dust.
  for (int i = 0; i < 2; i++) {
    float fi = float(i);
    if (hash(vec2(uFrame, 3.0 + fi)) > 0.8) {
      vec2 c = vec2(hash(vec2(uFrame, 11.0 + fi)), hash(vec2(uFrame, 17.0 + fi)));
      vec2 q = (uv - c) * vec2(aspect, 1.0) * uRes.y;
      float s = 1.0 + 2.5 * hash(vec2(uFrame, 23.0 + fi));
      col *= 1.0 - 0.75 * exp(-dot(q, q) / (s * s)) * step(0.5, noise(q * 0.4 + uFrame));
    }
  }

  // Vignette, as in the lens.
  vec2 v = uv - 0.5;
  col *= 1.0 - dot(v, v) * 1.05;
  gl_FragColor = vec4(col, 1.0);
}`;

const rgb = (hex: string) => { const v = parseInt(hex.slice(1), 16); return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255]; };

export function LightLeak({ theme = "warm", className = "", children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const T = THEMES[theme];
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
    host.prepend(canvas);
    const gl = canvas.getContext("webgl", { antialias: false, powerPreference: "low-power" });
    if (!gl) return () => canvas.remove();
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "compile");
      return s;
    };
    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error("link");
    } catch (e) {
      console.error(e);
      canvas.remove();
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(prog, n);
    gl.uniform3fv(U("uB0"), rgb(T.base[0]));
    gl.uniform3fv(U("uB1"), rgb(T.base[1]));
    gl.uniform3fv(U("uHot"), rgb(T.hot));
    gl.uniform3fv(U("uMid"), rgb(T.mid));
    gl.uniform3fv(U("uFringe"), rgb(T.fringe));
    const uRes = U("uRes"), uTime = U("uTime"), uFrame = U("uFrame"), uWeave = U("uWeave"), uPtr = U("uPtr");

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = !matchMedia("(hover: hover) and (pointer: fine)").matches;
    const scale = coarse ? 0.5 : 0.7;
    let raf = 0, visible = true, last = 0, frame = 0, aspect = 1;
    const t0 = performance.now() - 20000; // start a little way into the roll, with leaks already about
    const ptr = { x: 0, y: 0, s: 0, to: 0 };

    const resize = () => {
      const w = Math.max(1, Math.round(host.clientWidth * scale)), h = Math.max(1, Math.round(host.clientHeight * scale));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
      aspect = w / h;
    };
    const draw = (now: number) => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - t0) / 1000);
      gl.uniform1f(uFrame, frame);
      // The gate: a sub-pixel weave, new each frame.
      gl.uniform2f(uWeave, reduced ? 0 : (Math.random() - 0.5) * 0.9, reduced ? 0 : (Math.random() - 0.5) * 0.7);
      gl.uniform4f(uPtr, ptr.x, ptr.y, ptr.s, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (now: number) => {
      if (!visible || document.hidden) { raf = 0; return; }
      raf = requestAnimationFrame(loop);
      if (now - last < 1000 / 24 - 2) return; // 24 frames a second
      last = now;
      frame = (frame + 1) % 100000;
      ptr.s += (ptr.to - ptr.s) * 0.08;
      resize();
      draw(now);
    };
    const wake = () => { if (!reduced && !raf && visible && !document.hidden) raf = requestAnimationFrame(loop); };
    // The pointer near an edge lets light in there: the leak sits on the nearest edge, stronger the closer you are.
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = 1 - (e.clientY - r.top) / r.height;
      const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
      if (!inside) { ptr.to = 0; return; }
      const dl = x, dr = 1 - x, db = y, dt = 1 - y, m = Math.min(dl, dr, db, dt);
      const ex = m === dl ? -0.05 : m === dr ? 1.05 : x, ey = m === db ? -0.05 : m === dt ? 1.05 : y;
      ptr.x = ex * aspect; ptr.y = ey;
      ptr.to = Math.max(0, 1 - m / 0.32) * 0.9;
    };

    resize();
    draw(performance.now());
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); });
    io.observe(host);
    const ro = new ResizeObserver(() => { if (reduced) { resize(); draw(performance.now()); } });
    ro.observe(host);
    document.addEventListener("visibilitychange", wake);
    if (!reduced) { wake(); if (!coarse) window.addEventListener("pointermove", onMove, { passive: true }); }
    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("pointermove", onMove);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, [theme]);

  return (
    <div ref={hostRef} className={`relative isolate overflow-hidden ${className}`} style={{ background: THEMES[theme].css }}>
      {children && <div className="relative z-[1] h-full">{children}</div>}
    </div>
  );
}
