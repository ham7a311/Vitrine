"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Fluted Glass
 * Slow colour seen through a panel of reeded glass. Each vertical reed is a
 * small cylindrical lens: it squeezes and mirrors the strip of colour behind
 * it, catches a thin highlight on one shoulder and falls into shadow at the
 * groove, with a faint split into colour at its edges. Move the pointer and a
 * warm light slides along behind the reeds, breaking into strips as it goes.
 */

type Props = {
  /** Base, three drifting colours, and the pointer's warm light (hex). */
  colors?: [string, string, string, string, string];
  /** Width of one reed in CSS pixels. */
  reed?: number;
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
uniform float uN;
uniform vec3 uBase, uC1, uC2, uC3, uWarm;
uniform vec3 uPtr; // xy in uv, z = strength

float blob(vec2 p, vec2 c, float r) { vec2 d = p - c; return exp(-dot(d, d) / (r * r)); }

// The colour behind the glass, in aspect-corrected space.
vec3 field(vec2 p, float a, float t) {
  vec3 col = uBase;
  col = mix(col, uC1, 0.9 * blob(p, vec2(a * (0.28 + 0.16 * sin(t * 0.31)), 0.68 + 0.16 * cos(t * 0.23)), 0.42));
  col = mix(col, uC2, 0.85 * blob(p, vec2(a * (0.72 + 0.14 * cos(t * 0.27)), 0.42 + 0.2 * sin(t * 0.19)), 0.46));
  col = mix(col, uC3, 0.75 * blob(p, vec2(a * (0.5 + 0.3 * sin(t * 0.17 + 2.0)), 0.12 + 0.12 * sin(t * 0.29)), 0.38));
  col = mix(col, uWarm, uPtr.z * 0.95 * blob(p, vec2(uPtr.x * a, uPtr.y), 0.24));
  return col;
}

void main() {
  float a = uRes.x / uRes.y;
  float t = uTime;
  float x = v.x * uN;
  float cell = floor(x);
  float s = fract(x) - 0.5; // -0.5 .. 0.5 across one reed

  // Each reed is a cylinder lens: it shows a squeezed, mirrored slice a little wider than itself.
  float xs = (cell + 0.5 - s * 1.8) / uN;
  float ys = v.y + s * s * 0.05;
  float ch = s * 0.006;
  vec3 col = vec3(
    field(vec2((xs + ch) * a, ys), a, t).r,
    field(vec2(xs * a, ys), a, t).g,
    field(vec2((xs - ch) * a, ys), a, t).b
  );

  // Rounded shading across the reed, a crisp highlight on one shoulder, a dark groove between reeds.
  col *= 0.8 + 0.2 * cos(s * 3.14159);
  col += 0.16 * smoothstep(0.07, 0.0, abs(s + 0.31)) * (0.6 + 0.4 * v.y);
  col += 0.05 * smoothstep(0.22, 0.0, abs(s - 0.26));
  col *= mix(1.0, 0.62, smoothstep(0.44, 0.5, abs(s)));

  // Soft vignette and dither against banding.
  col *= smoothstep(1.35, 0.35, length((v - 0.5) * vec2(a * 0.75, 1.0)));
  col += (fract(sin(dot(v * uRes, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0 * 2.0;
  gl_FragColor = vec4(col, 1.0);
}`;

const rgb = (hex: string) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255] as const;
};

export function FlutedGlass({ colors = ["#140c08", "#d9733a", "#8a3b2a", "#f0b37a", "#ffd7a0"], reed = 54, speed = 1, className = "", children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
    host.prepend(canvas);
    const gl = canvas.getContext("webgl", { antialias: false, powerPreference: "low-power" });
    if (!gl) { canvas.remove(); return; }

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
    (["uBase", "uC1", "uC2", "uC3", "uWarm"] as const).forEach((n, i) => gl.uniform3f(u(n), ...rgb(colors[i])));

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = !matchMedia("(hover: hover) and (pointer: fine)").matches;
    // Reeds need crisp edges, so this renders closer to full resolution than most.
    const scale = Math.min(devicePixelRatio, coarse ? 1 : 1.25);
    const gap = coarse ? 33 : 16;
    const ptr = { x: 0.6, y: 0.5, s: 0, tx: 0.6, ty: 0.5, ts: 0 };
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
      ptr.x += (ptr.tx - ptr.x) * 0.06;
      ptr.y += (ptr.ty - ptr.y) * 0.06;
      ptr.s += (ptr.ts - ptr.s) * 0.05;
      gl.uniform2f(u("uRes"), canvas.width, canvas.height);
      gl.uniform1f(u("uN"), Math.max(6, canvas.clientWidth / reed));
      gl.uniform1f(u("uTime"), reduced ? 4 : ((now - t0) / 1000) * speed);
      gl.uniform3f(u("uPtr"), ptr.x, ptr.y, ptr.s);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    // Only ask for frames while on screen and the tab is visible.
    const loop = (now: number) => {
      if (!visible || document.hidden) { raf = 0; return; }
      raf = requestAnimationFrame(loop);
      if (now - last < gap) return;
      last = now;
      draw(now);
    };
    const wake = () => { if (!reduced && !raf && visible && !document.hidden) raf = requestAnimationFrame(loop); };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = 1 - (e.clientY - r.top) / r.height;
      const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
      if (inside) { ptr.tx = x; ptr.ty = y; }
      ptr.ts = inside ? 1 : 0;
    };

    draw(performance.now());
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); });
    io.observe(host);
    const ro = new ResizeObserver(() => reduced && draw(performance.now()));
    ro.observe(host);
    document.addEventListener("visibilitychange", wake);
    if (!reduced) {
      wake();
      if (!coarse) window.addEventListener("pointermove", onMove, { passive: true });
    }
    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("pointermove", onMove);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, [colors, reed, speed]);

  return (
    <div
      ref={hostRef}
      className={`relative isolate overflow-hidden ${className}`}
      style={{ background: `radial-gradient(60% 70% at 35% 35%, ${colors[1]}, transparent), radial-gradient(50% 60% at 75% 60%, ${colors[2]}, transparent), ${colors[0]}` }}
    >
      {children && <div className="relative z-[1] h-full">{children}</div>}
    </div>
  );
}
