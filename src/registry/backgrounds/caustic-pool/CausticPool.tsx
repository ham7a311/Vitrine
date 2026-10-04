"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Caustic Pool
 * Light refracted through moving water, falling on the floor of a dark pool.
 * Two layers of animated cellular noise are turned into thin bright filaments
 * (the edges between cells), multiplied together and split slightly by colour —
 * the web of light you see at the bottom of a pool at night.
 */

type Props = {
  /** Light colour (hex). */
  tint?: string;
  /** Deep water colour (hex). */
  depth?: string;
  speed?: number;
  className?: string;
  children?: ReactNode;
};

const VERT = `attribute vec2 p; varying vec2 v; void main(){ v = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
varying vec2 v;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uTint;
uniform vec3 uDepth;
uniform vec3 uPtr; // xy in uv, z = strength

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

// distance to the nearest cell edge (F2 - F1), with drifting feature points
float edges(vec2 p, float t) {
  vec2 i = floor(p), f = fract(p);
  float f1 = 8.0, f2 = 8.0;
  for (int y = -1; y <= 1; y++)
  for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y));
    vec2 o = hash2(i + g);
    o = 0.5 + 0.42 * sin(t + 6.2831 * o);
    float d = length(g + o - f);
    if (d < f1) { f2 = f1; f1 = d; } else if (d < f2) { f2 = d; }
  }
  return f2 - f1;
}

float caustic(vec2 uv, float t) {
  // a slow swell bends the whole floor pattern
  uv += 0.06 * vec2(sin(uv.y * 2.3 + t * 0.7), cos(uv.x * 1.9 - t * 0.6));
  float a = edges(uv * 3.1, t * 0.9);
  float b = edges(uv * 4.7 + 13.0, -t * 0.7);
  float la = pow(1.0 - smoothstep(0.0, 0.16, a), 3.0);
  float lb = pow(1.0 - smoothstep(0.0, 0.2, b), 3.0);
  return la * 0.75 + lb * 0.5 + la * lb * 1.4;
}

void main() {
  vec2 uv = v;
  float aspect = uRes.x / uRes.y;
  vec2 q = vec2(uv.x * aspect, uv.y);
  float t = uTime;

  // the cursor is a hand in the water: a lens of calm, magnified light
  vec2 d = (uv - uPtr.xy) * vec2(aspect, 1.0);
  float r = length(d);
  float lens = uPtr.z * exp(-r * r * 18.0);
  q -= d * lens * 0.35;

  // chromatic split: sample each channel at a hair's offset
  float cr = caustic(q + vec2(0.0035, 0.0), t);
  float cg = caustic(q, t);
  float cb = caustic(q - vec2(0.0035, 0.0), t);
  vec3 light = vec3(cr, cg, cb) * uTint;

  // depth: brighter near the top (shallows), darker and bluer toward the bottom, vignette
  float shallow = smoothstep(-0.2, 1.1, uv.y);
  float vig = smoothstep(1.25, 0.25, length((uv - 0.5) * vec2(aspect * 0.9, 1.1)));
  vec3 col = uDepth * (0.7 + 0.5 * shallow);
  col += light * (0.35 + 0.65 * shallow) * vig * (1.0 + lens * 0.8);
  col += (fract(sin(dot(uv * uRes, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.02;
  gl_FragColor = vec4(col, 1.0);
}`;

const rgb = (hex: string) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255] as const;
};

export function CausticPool({ tint = "#b9d4f0", depth = "#050a12", speed = 1, className = "", children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
    host.prepend(canvas);
    const gl = canvas.getContext("webgl", { antialias: false, powerPreference: "low-power" });
    if (!gl) return () => canvas.remove();

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const vs = sh(gl.VERTEX_SHADER, VERT);
    const fs = sh(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return () => canvas.remove();
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    gl.uniform3f(u("uTint"), ...rgb(tint));
    gl.uniform3f(u("uDepth"), ...rgb(depth));

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = !window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const scale = coarse ? 0.45 : 0.65;
    const gap = coarse ? 33 : 16;
    const ptr = { x: 0.5, y: 0.5, s: 0, tx: 0.5, ty: 0.5, ts: 0 };
    let raf = 0, last = 0, visible = true;
    const t0 = performance.now();

    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * scale));
      const h = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    const draw = (now: number) => {
      resize();
      ptr.x += (ptr.tx - ptr.x) * 0.08;
      ptr.y += (ptr.ty - ptr.y) * 0.08;
      ptr.s += (ptr.ts - ptr.s) * 0.06;
      gl.uniform2f(u("uRes"), canvas.width, canvas.height);
      gl.uniform1f(u("uTime"), reduced ? 7 : ((now - t0) / 1000) * 0.55 * speed);
      gl.uniform3f(u("uPtr"), ptr.x, ptr.y, ptr.s);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden || now - last < gap) return;
      last = now;
      draw(now);
    };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = 1 - (e.clientY - r.top) / r.height;
      const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
      if (inside) {
        ptr.tx = x;
        ptr.ty = y;
      }
      ptr.ts = inside ? 1 : 0;
    };

    draw(performance.now());
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(host);
    if (!reduced) {
      raf = requestAnimationFrame(loop);
      if (!coarse) window.addEventListener("pointermove", onMove, { passive: true });
    }
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, [tint, depth, speed]);

  return (
    <div ref={hostRef} className={`relative isolate overflow-hidden ${className}`} style={{ background: depth }}>
      {children && <div className="relative z-[1] h-full">{children}</div>}
    </div>
  );
}
