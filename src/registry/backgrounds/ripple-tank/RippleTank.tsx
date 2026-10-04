"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Ripple Tank
 * A shallow tank of water with a tiled floor, run as a real wave equation.
 * Move across it and you leave a wake; click and you drop a stone; leave it
 * alone and the odd raindrop falls. The surface bends the floor's grid,
 * gathers light where the waves focus it and catches a highlight on each
 * crest — every ring starts exactly where it was made.
 */

type Props = {
  /** Deep water, shallow water, floor lines, highlight (hex). */
  colors?: [string, string, string, string];
  /** Light-on-dark (false) or dark-on-light (true) shading. */
  light?: boolean;
  /** Idle raindrops. */
  rain?: boolean;
  className?: string;
  children?: ReactNode;
};

const CELL = 5; // CSS px per simulation cell

const VERT = `attribute vec2 p; varying vec2 v; void main(){ v = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
varying vec2 v;
uniform sampler2D uH;
uniform vec2 uTex; // 1 / sim size
uniform vec2 uRes;
uniform vec3 uDeep, uShallow, uLine, uSpec;
uniform float uLight;

// Height is stored in 16 bits: luminance holds the high byte, alpha the low one.
float h(vec2 q) { vec4 t = texture2D(uH, q); return ((t.r * 65280.0 + t.a * 255.0) / 65535.0 - 0.5) / 0.35; }

void main() {
  vec2 q = vec2(v.x, 1.0 - v.y);
  float a = uRes.x / uRes.y;
  float c = h(q);
  float dx = h(q + vec2(uTex.x, 0.0)) - h(q - vec2(uTex.x, 0.0));
  float dy = h(q + vec2(0.0, uTex.y)) - h(q - vec2(0.0, uTex.y));
  float lap = h(q + vec2(uTex.x, 0.0)) + h(q - vec2(uTex.x, 0.0)) + h(q + vec2(0.0, uTex.y)) + h(q - vec2(0.0, uTex.y)) - 4.0 * c;
  vec3 n = normalize(vec3(-dx * 3.0, -dy * 3.0, 1.0));

  // The floor, seen through the surface: a tile grid displaced by the slope.
  vec2 f = (q + n.xy * 0.035) * vec2(a, 1.0) * 9.0;
  vec2 g = abs(fract(f) - 0.5);
  float line = smoothstep(0.47, 0.5, max(g.x, g.y));
  vec3 col = mix(uDeep, uShallow, 0.35 + 0.35 * v.y);
  col = mix(col, uLine, line * 0.55);

  // Light focuses where the surface curves inward, and a highlight sits on each crest.
  float focus = clamp(-lap * 14.0, -0.6, 1.0);
  col += uSpec * focus * 0.22 * (1.0 - uLight * 0.5);
  float spec = pow(max(0.0, dot(n, normalize(vec3(-0.45, 0.55, 0.7)))), 24.0);
  col = mix(col, uSpec, spec * 0.55);
  col *= 1.0 - uLight * clamp(-c * 0.18, 0.0, 0.18);

  // Vignette and dither.
  col *= mix(1.0, smoothstep(1.4, 0.3, length((v - 0.5) * vec2(a * 0.8, 1.0))), 0.6);
  col += (fract(sin(dot(v * uRes, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0 * 2.0;
  gl_FragColor = vec4(col, 1.0);
}`;

const rgb = (hex: string) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255] as const;
};

export function RippleTank({ colors = ["#05070b", "#0f1724", "#2a3a52", "#cfe0ff"], light = false, rain = true, className = "", children }: Props) {
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
    (["uDeep", "uShallow", "uLine", "uSpec"] as const).forEach((n, i) => gl.uniform3f(u(n), ...rgb(colors[i])));
    gl.uniform1f(u("uLight"), light ? 1 : 0);

    // The heightfield lives on the CPU and is uploaded as a smooth-filtered texture each frame.
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.uniform1i(u("uH"), 0);

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = !matchMedia("(hover: hover) and (pointer: fine)").matches;
    const scale = Math.min(devicePixelRatio, coarse ? 0.75 : 1);
    let W = 0, H = 0;
    let cur = new Float32Array(0), prev = new Float32Array(0), bytes = new Uint8Array(0);
    let raf = 0, visible = true, lastRain = 0, lastStep = 0;
    let lastPtr: { x: number; y: number } | null = null;

    const resize = () => {
      const cw = canvas.clientWidth, ch = canvas.clientHeight;
      const w = Math.max(1, Math.round(cw * scale)), h = Math.max(1, Math.round(ch * scale));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
      const nw = Math.max(8, Math.ceil(cw / CELL)), nh = Math.max(8, Math.ceil(ch / CELL));
      if (nw !== W || nh !== H) {
        W = nw; H = nh;
        cur = new Float32Array(W * H); prev = new Float32Array(W * H); bytes = new Uint8Array(W * H * 2);
        gl.uniform2f(u("uTex"), 1 / W, 1 / H);
      }
    };

    /** Push the surface down in a soft disc around a cell. */
    const drop = (cx: number, cy: number, r: number, amp: number) => {
      const R = Math.ceil(r * 2);
      for (let y = Math.max(1, Math.floor(cy - R)); y < Math.min(H - 1, cy + R); y++)
        for (let x = Math.max(1, Math.floor(cx - R)); x < Math.min(W - 1, cx + R); x++) {
          const d2 = (x - cx) ** 2 + (y - cy) ** 2;
          cur[y * W + x] -= amp * Math.exp(-d2 / (r * r));
        }
    };

    // Verlet step of the wave equation with a 9-point Laplacian, which keeps rings round instead of square.
    const step = () => {
      for (let y = 1; y < H - 1; y++) {
        const row = y * W;
        for (let x = 1; x < W - 1; x++) {
          const i = row + x;
          const lap = (4 * (cur[i - 1] + cur[i + 1] + cur[i - W] + cur[i + W]) + cur[i - W - 1] + cur[i - W + 1] + cur[i + W - 1] + cur[i + W + 1] - 20 * cur[i]) / 6;
          prev[i] = (2 * cur[i] - prev[i] + 0.3 * lap) * 0.993;
        }
      }
      const t = prev; prev = cur; cur = t;
    };

    const draw = () => {
      for (let i = 0; i < cur.length; i++) {
        const q = Math.round(Math.max(0, Math.min(1, 0.5 + cur[i] * 0.35)) * 65535);
        bytes[i * 2] = q >> 8;
        bytes[i * 2 + 1] = q & 255;
      }
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE_ALPHA, W, H, 0, gl.LUMINANCE_ALPHA, gl.UNSIGNED_BYTE, bytes);
      gl.uniform2f(u("uRes"), canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      if (!visible || document.hidden) { raf = 0; return; }
      raf = requestAnimationFrame(loop);
      resize();
      if (rain && now - lastRain > 650 + Math.random() * 900) {
        lastRain = now;
        drop(2 + Math.random() * (W - 4), 2 + Math.random() * (H - 4), 1.3, 0.55);
      }
      // A fixed step rate, so the waves travel at the same speed on any display.
      if (!lastStep) lastStep = now;
      let n = 0;
      while (now - lastStep > 8 && n < 5) { step(); lastStep += 8; n++; }
      if (n === 5) lastStep = now;
      draw();
    };
    const wake = () => { if (!reduced && !raf && visible && !document.hidden) { lastStep = 0; raf = requestAnimationFrame(loop); } };

    const cellAt = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) return null;
      return { x: x / CELL, y: y / CELL };
    };
    // A wake along the pointer's path, stronger the faster you move.
    const onMove = (e: PointerEvent) => {
      const c = cellAt(e);
      if (!c) { lastPtr = null; return; }
      if (lastPtr) {
        const dx = c.x - lastPtr.x, dy = c.y - lastPtr.y, len = Math.hypot(dx, dy);
        const steps = Math.min(12, Math.ceil(len / 1.5));
        const amp = Math.min(0.32, 0.05 + len * 0.02);
        for (let s = 1; s <= steps; s++) drop(lastPtr.x + (dx * s) / steps, lastPtr.y + (dy * s) / steps, 1.6, amp / Math.max(1, steps / 3));
      }
      lastPtr = c;
    };
    const onDown = (e: PointerEvent) => { const c = cellAt(e); if (c) drop(c.x, c.y, 2.6, 2.2); };

    resize();
    if (reduced) {
      // One still frame: a few rings, already spread.
      drop(W * 0.3, H * 0.4, 2.6, 2.2); drop(W * 0.68, H * 0.62, 2.6, 2.2); drop(W * 0.55, H * 0.25, 1.6, 1);
      for (let i = 0; i < 150; i++) step();
    } else {
      drop(W * 0.42, H * 0.46, 2.6, 2.2);
    }
    draw();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); });
    io.observe(host);
    const ro = new ResizeObserver(() => { resize(); if (reduced) draw(); });
    ro.observe(host);
    document.addEventListener("visibilitychange", wake);
    if (!reduced) {
      wake();
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
    }
    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      gl.deleteTexture(tex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, [colors, light, rain]);

  return (
    <div
      ref={hostRef}
      className={`relative isolate overflow-hidden ${className}`}
      style={{ background: `linear-gradient(${colors[1]}, ${colors[0]})` }}
    >
      {children && <div className="relative z-[1] h-full">{children}</div>}
    </div>
  );
}
