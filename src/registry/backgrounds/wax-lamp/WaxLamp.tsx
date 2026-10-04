"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Wax Lamp
 * A lava lamp, properly. Blobs of wax warm in the pool at the bottom, grow
 * light enough to rise, cool near the top and sink again, merging and
 * pinching apart on the way like real wax. The shader draws them as one
 * smooth surface with a glossy highlight, a bright rim where the glass
 * catches it and a warm glow inside where the wax is thick. Hold the
 * pointer near a blob and it warms up and lifts.
 */

type Props = {
  theme?: "sunset" | "lagoon" | "mono";
  className?: string;
  children?: ReactNode;
};

const THEMES = {
  sunset: { liquid: ["#12061f", "#3a0d3d", "#8a1f4a"], wax: ["#ff4f1f", "#ff9a3c", "#ffe0a0"], css: "linear-gradient(#12061f, #3a0d3d 60%, #8a1f4a)" },
  lagoon: { liquid: ["#020c16", "#04263a", "#06506a"], wax: ["#00b39b", "#3ff0cf", "#d6fff4"], css: "linear-gradient(#020c16, #04263a 60%, #06506a)" },
  mono: { liquid: ["#08080a", "#141417", "#2a2a30"], wax: ["#a9a6a0", "#e4e1da", "#ffffff"], css: "linear-gradient(#08080a, #141417 60%, #2a2a30)" },
};
const N = 9; // moving blobs
const FIXED = 5; // the pool and the cap

const VERT = `attribute vec2 aPos; void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;
const FRAG = `precision highp float;
uniform vec2 uRes;
uniform vec3 uB[${N + FIXED}];
uniform vec3 uL0; uniform vec3 uL1; uniform vec3 uL2;
uniform vec3 uW0; uniform vec3 uW1; uniform vec3 uW2;
uniform float uTime;

float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 45758.5453); }

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  // Metaball field with compact support (Wyvill's (1 − d²/R²)³, R = 2r), so blobs
  // only join when they really meet; and its analytic gradient.
  float f = 0.0;
  vec2 g = vec2(0.0);
  for (int i = 0; i < ${N + FIXED}; i++) {
    vec3 b = uB[i];
    vec2 d = p - b.xy;
    float R2 = 4.0 * b.z * b.z;
    float q = dot(d, d) / R2;
    if (q < 1.0) {
      float w = 1.0 - q;
      f += w * w * w;
      g += -6.0 * w * w * d / R2;
    }
  }

  // The liquid: dark above, warm near the heat at the bottom, a cylinder of glass darkening its sides.
  vec3 liquid = mix(uL2, uL1, smoothstep(0.0, 0.55, uv.y));
  liquid = mix(liquid, uL0, smoothstep(0.45, 1.0, uv.y));
  float cyl = sin(uv.x * 3.14159);
  liquid *= 0.55 + 0.45 * cyl;
  liquid += uW1 * 0.10 * exp(-uv.y * 5.0) * cyl;
  // Light from the wax glows into the liquid around it.
  liquid += uW0 * 0.22 * smoothstep(0.0, 0.3, f);

  // The wax surface.
  float px = 1.5 / uRes.y;
  float edge = smoothstep(0.3 - length(g) * px, 0.3 + length(g) * px, f);
  vec3 n = normalize(vec3(-g * 0.045, 1.0) + vec3(0.0, 0.0, smoothstep(0.3, 1.0, f) * 1.5));
  vec3 l = normalize(vec3(-0.5, 0.6, 0.8));
  float diff = clamp(dot(n, l), 0.0, 1.0);
  float spec = pow(clamp(dot(reflect(-l, n), vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 28.0);
  float rim = pow(1.0 - n.z, 2.2);
  // Thicker wax (facing us) glows warmer from inside; edges fall to the base colour and catch a rim.
  float thick = smoothstep(0.3, 1.3, f);
  vec3 wax = mix(uW0, uW1, thick * 0.85);
  wax = mix(wax, uW2, pow(thick, 3.0) * 0.28);
  wax *= 0.68 + 0.42 * diff;
  wax += uW2 * rim * 0.45 + vec3(1.0) * spec * 0.4;
  wax *= 0.7 + 0.3 * cyl;

  vec3 col = mix(liquid, wax, edge);
  // A soft vertical highlight on the glass, and a little grain.
  col += vec3(1.0) * 0.05 * exp(-pow((uv.x - 0.2) * 16.0, 2.0));
  col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.025;
  gl_FragColor = vec4(col, 1.0);
}`;

const rgb = (hex: string) => { const v = parseInt(hex.slice(1), 16); return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255]; };

export function WaxLamp({ theme = "sunset", className = "", children }: Props) {
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
    const uRes = U("uRes"), uB = U("uB"), uTime = U("uTime");
    (["L0", "L1", "L2"] as const).forEach((k, i) => gl.uniform3fv(U(`u${k}`), rgb(T.liquid[i])));
    (["W0", "W1", "W2"] as const).forEach((k, i) => gl.uniform3fv(U(`u${k}`), rgb(T.wax[i])));

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = !matchMedia("(hover: hover) and (pointer: fine)").matches;
    const scale = coarse ? 0.5 : 0.75;

    // Wax: position (x across 0…aspect, y up 0…1), radius and temperature.
    type Blob = { x: number; y: number; vx: number; vy: number; r: number; T: number; seed: number };
    let aspect = 1;
    const blobs: Blob[] = Array.from({ length: N }, (_, i) => ({
      x: 0.5, y: Math.random(), vx: 0, vy: 0, r: 0.045 + Math.random() * 0.05, T: Math.random(), seed: i * 1.7,
    }));
    const data = new Float32Array((N + FIXED) * 3);
    const ptr = { x: 0, y: 0, on: 0, to: 0 };
    let raf = 0, visible = true, last = 0, t = 0;

    const resize = () => {
      const w = Math.max(1, Math.round(host.clientWidth * scale)), h = Math.max(1, Math.round(host.clientHeight * scale));
      if (canvas.width === w && canvas.height === h) return;
      const was = aspect;
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
      aspect = w / h;
      blobs.forEach((b) => { b.x = was === 1 && b.x === 0.5 ? (0.25 + Math.random() * 0.5) * aspect : (b.x / was) * aspect; });
    };

    const step = (dt: number) => {
      t += dt;
      ptr.on += (ptr.to - ptr.on) * Math.min(1, dt * 4);
      for (const b of blobs) {
        // Heat in the pool, cooling near the top, a slow pull back to the room's temperature.
        const heat = b.y < 0.2 ? (0.2 - b.y) * 3.2 : 0;
        const cool = b.y > 0.68 ? (b.y - 0.68) * 2.4 : 0;
        b.T += (heat - cool - (b.T - 0.45) * 0.06) * dt;
        if (ptr.on > 0.01) {
          const d = Math.hypot(b.x - ptr.x, b.y - ptr.y);
          b.T += Math.exp(-(d * d) / (2 * 0.12 * 0.12)) * ptr.on * 1.4 * dt;
        }
        b.T = Math.max(0, Math.min(1.2, b.T));
        // Warm wax is lighter than the liquid; cool wax is heavier.
        b.vy += (b.T - 0.5) * 0.32 * dt;
        b.vx += (Math.sin(t * 0.4 + b.seed) * 0.012 + (aspect / 2 - b.x) * 0.004) * dt;
        const drag = Math.exp(-1.4 * dt);
        b.vx *= drag; b.vy *= drag;
        b.x += b.vx * dt; b.y += b.vy * dt;
        const lo = b.r * 0.4, hi = 1 - b.r * 0.4;
        if (b.y < lo) { b.y = lo; b.vy = Math.abs(b.vy) * 0.2; }
        if (b.y > hi) { b.y = hi; b.vy = -Math.abs(b.vy) * 0.2; }
        const wx = Math.min(aspect * 0.12, 0.3);
        if (b.x < wx) b.vx += (wx - b.x) * 0.5 * dt;
        if (b.x > aspect - wx) b.vx -= (b.x - (aspect - wx)) * 0.5 * dt;
      }
      // Blobs push apart gently when they overlap a lot, so they pinch off instead of fusing for good.
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const a = blobs[i], c = blobs[j];
        const dx = c.x - a.x, dy = c.y - a.y, d = Math.hypot(dx, dy) + 1e-4, m = (a.r + c.r) * 0.75;
        if (d < m) {
          const k = ((m - d) / d) * 0.6 * dt;
          a.vx -= dx * k; a.vy -= dy * k; c.vx += dx * k; c.vy += dy * k;
        }
      }
    };

    const draw = () => {
      blobs.forEach((b, i) => { data[i * 3] = b.x; data[i * 3 + 1] = b.y; data[i * 3 + 2] = b.r; });
      // The pool along the bottom and a small cap of wax at the top.
      const fixed = [[aspect * 0.5, -0.13, 0.16], [aspect * 0.28, -0.09, 0.1], [aspect * 0.72, -0.09, 0.1], [aspect * 0.5, 1.06, 0.07], [aspect * 0.38, 1.04, 0.045]];
      fixed.forEach((f, k) => { data[(N + k) * 3] = f[0]; data[(N + k) * 3 + 1] = f[1] + (k < 3 ? Math.sin(t * 0.5 + k) * 0.01 : 0); data[(N + k) * 3 + 2] = f[2]; });
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform3fv(uB, data);
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      if (!visible || document.hidden) { raf = 0; last = 0; return; }
      raf = requestAnimationFrame(loop);
      if (coarse && now - last < 30) return;
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      resize();
      step(dt);
      draw();
    };
    const wake = () => { if (!reduced && !raf && visible && !document.hidden) raf = requestAnimationFrame(loop); };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = 1 - (e.clientY - r.top) / r.height;
      const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
      ptr.to = inside ? 1 : 0;
      if (inside) { ptr.x = x * aspect; ptr.y = y; }
    };
    const onUp = (e: PointerEvent) => { if (e.pointerType === "touch") ptr.to = 0; };

    resize();
    // Settle into a lived-in state first, so it never opens with every blob in a heap.
    for (let k = 0; k < 900; k++) step(0.033);
    draw();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); });
    io.observe(host);
    const ro = new ResizeObserver(() => { if (reduced) { resize(); draw(); } });
    ro.observe(host);
    document.addEventListener("visibilitychange", wake);
    if (!reduced) {
      wake();
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerup", onUp);
    }
    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
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
