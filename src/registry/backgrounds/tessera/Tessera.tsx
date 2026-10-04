"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Tessera
 * A frosted-glass mosaic. Every Voronoi tile is a pane with its own tilt, so a
 * slow sweeping light catches them one by one; fine frost scatters inside each
 * pane and dark leading runs between them. Near the cursor, panes warm in colour.
 */

type Props = {
  /** [grout, glass, highlight, warm] */
  palette?: [string, string, string, string];
  /** Tiles across the shorter side. */
  density?: number;
  className?: string;
  children?: ReactNode;
};

const VERT = `attribute vec2 p; varying vec2 v; void main(){ v = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
varying vec2 v;
uniform vec2 uRes;
uniform float uTime;
uniform float uDensity;
uniform vec3 uGrout, uGlass, uHi, uWarm;
uniform vec3 uPtr; // xy in uv space, z strength

vec2 h2(vec2 p) { p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return fract(sin(p) * 43758.5453); }
float h1(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }

void main() {
  float aspect = uRes.x / uRes.y;
  vec2 uv = v;
  vec2 p = vec2(uv.x * aspect, uv.y) * uDensity;
  vec2 i = floor(p), f = fract(p);

  // nearest and second-nearest feature points (slowly breathing)
  float f1 = 9.0, f2 = 9.0; vec2 cellId = vec2(0.0), cellPt = vec2(0.0);
  for (int y = -1; y <= 1; y++)
  for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y));
    vec2 o = h2(i + g);
    o = 0.5 + 0.38 * sin(uTime * 0.25 + 6.2831 * o);
    vec2 r = g + o - f;
    float d = dot(r, r);
    if (d < f1) { f2 = f1; f1 = d; cellId = i + g; cellPt = g + o; }
    else if (d < f2) { f2 = d; }
  }
  f1 = sqrt(f1); f2 = sqrt(f2);
  float edge = f2 - f1;

  // each pane has its own tilt → its own normal
  vec2 tilt = (h2(cellId * 1.7) - 0.5) * 1.3;
  vec3 n = normalize(vec3(tilt, 1.0));

  // a light that sweeps slowly across the wall
  float a = uTime * 0.12;
  vec3 L = normalize(vec3(cos(a) * 0.9, sin(a * 0.7) * 0.6, 0.55));
  float diff = max(dot(n, L), 0.0);
  float spec = pow(max(dot(reflect(-L, n), vec3(0.0, 0.0, 1.0)), 0.0), 24.0);

  // frost: fine noise inside each pane
  float frost = h1(floor(uv * uRes / 1.5) + cellId);

  // warmth near the pointer, per pane (use the pane centre so whole tiles change)
  vec2 centreUv = (i + cellPt) / uDensity; centreUv.x /= aspect;
  float warm = uPtr.z * smoothstep(0.32, 0.0, length((centreUv - uPtr.xy) * vec2(aspect, 1.0)));

  vec3 glass = mix(uGlass, uWarm, warm * 0.85);
  vec3 col = glass * (0.18 + 0.55 * diff) + uHi * spec * 0.55 + glass * frost * 0.06;
  col *= 0.85 + 0.15 * h1(cellId); // each pane a slightly different thickness

  // leading between panes
  float lead = smoothstep(0.02, 0.07, edge);
  col = mix(uGrout, col, lead);
  // a faint bevel highlight just inside each edge
  col += uHi * (smoothstep(0.07, 0.03, edge) - smoothstep(0.03, 0.015, edge)) * 0.12 * (0.4 + diff);

  float vig = smoothstep(1.3, 0.35, length((uv - 0.5) * vec2(aspect * 0.8, 1.0)));
  gl_FragColor = vec4(col * vig, 1.0);
}`;

const rgb = (hex: string) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255] as const;
};

export function Tessera({ palette = ["#07050a", "#7f93b8", "#eef3fb", "#c8a0e0"], density = 7, className = "", children }: Props) {
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
    const sh = (t: number, src: string) => {
      const s = gl.createShader(t)!;
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
    const [g, gl2, hi, wm] = palette.map(rgb);
    gl.uniform3f(u("uGrout"), ...g);
    gl.uniform3f(u("uGlass"), ...gl2);
    gl.uniform3f(u("uHi"), ...hi);
    gl.uniform3f(u("uWarm"), ...wm);
    gl.uniform1f(u("uDensity"), density);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = !window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const scale = Math.min(window.devicePixelRatio || 1, 1.5) * (coarse ? 0.6 : 0.8);
    const gap = coarse ? 33 : 16;
    const ptr = { x: 0.5, y: 0.5, s: 0, tx: 0.5, ty: 0.5, ts: 0 };
    let raf = 0, last = 0, visible = true;
    const t0 = performance.now();

    const draw = (now: number) => {
      const w = Math.max(1, Math.round(canvas.clientWidth * scale));
      const h = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      ptr.x += (ptr.tx - ptr.x) * 0.1;
      ptr.y += (ptr.ty - ptr.y) * 0.1;
      ptr.s += (ptr.ts - ptr.s) * 0.05;
      gl.uniform2f(u("uRes"), w, h);
      gl.uniform1f(u("uTime"), reduced ? 4 : (now - t0) / 1000);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [palette.join(), density]);

  return (
    <div ref={hostRef} className={`relative isolate overflow-hidden ${className}`} style={{ background: palette[0] }}>
      {children && <div className="relative z-[1] h-full">{children}</div>}
    </div>
  );
}
