"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Silk Field
 * A domain-warped fBm shader that pours light like slow liquid silk, with an
 * optional refracting glass lens that follows the cursor (or drifts on its own).
 * Raw WebGL1, one full-screen triangle, no dependencies. Falls back to a CSS
 * gradient built from the same palette when WebGL is unavailable.
 */

/** Four colours, dark → light: base, deep, accent, highlight. */
export type SilkPalette = [string, string, string, string];

export const SILK_PALETTES = {
  dusk: ["#15130f", "#1d1914", "#3a2d1f", "#7a5c3c"],
  umber: ["#0e0d0b", "#1a1712", "#3a2f22", "#6b5a45"],
  ember: ["#120a06", "#7a2408", "#ff6b00", "#f2c49b"],
  tide: ["#060b14", "#0b2a5c", "#1b6fd4", "#9cc8ff"],
  violet: ["#0c0816", "#3b1a78", "#7c3aed", "#d9c8ff"],
  verdigris: ["#0f0c09", "#2f5550", "#d97843", "#f0dcc2"],
  phosphor: ["#07100a", "#0f3a24", "#3fae6a", "#b9f5b0"],
  graphite: ["#0b0b0c", "#2a2b2e", "#8e9096", "#eef0f3"],
} satisfies Record<string, SilkPalette>;

type Props = {
  palette?: SilkPalette;
  /** "cursor" follows the pointer (drifts on touch), "drift" wanders slowly, "none" is the plain flow. */
  lens?: "cursor" | "drift" | "none";
  /** Lens radius as a fraction of the height. */
  lensRadius?: number;
  /** Overall brightness, 0–1. */
  intensity?: number;
  speed?: number;
  /** Palette crossfade duration in ms when `palette` changes. */
  blendMs?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

const VERTEX = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAGMENT = `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uC0; uniform vec3 uC1; uniform vec3 uC2; uniform vec3 uC3;
uniform vec2 uLens; uniform float uLensR; uniform float uDim; uniform float uLensOn;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 3; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}
vec3 ramp(float t) {
  t = clamp(t, 0.0, 1.0);
  vec3 c = mix(uC0, uC1, smoothstep(0.0, 0.42, t));
  c = mix(c, uC2, smoothstep(0.42, 0.74, t));
  return mix(c, uC3, smoothstep(0.8, 1.0, t));
}
vec3 flow(vec2 uv) {
  vec2 p = uv * vec2(uRes.x / uRes.y, 1.0) * 0.75;
  vec2 q = vec2(fbm(p + vec2(0.0, uTime * 0.035)), fbm(p + vec2(5.2, 1.3) - uTime * 0.03));
  vec2 r = vec2(fbm(p + 1.8 * q + vec2(1.7, 9.2) + uTime * 0.025), fbm(p + 1.8 * q + vec2(8.3, 2.8)));
  float f = fbm(p + 2.0 * r);
  vec3 col = ramp(smoothstep(0.26, 0.8, f));
  float sheen = pow(0.5 + 0.5 * sin(f * 26.0 + r.x * 6.0 + uTime * 0.15), 5.0);
  col += uC2 * sheen * 0.3 + uC3 * pow(sheen, 3.0) * 0.22;
  return col;
}
void main() {
  vec2 uv = vUv; float aspect = uRes.x / uRes.y;
  vec2 d = (uv - uLens) * vec2(aspect, 1.0);
  float r = length(d) / uLensR;
  vec3 col;
  if (uLensOn > 0.5 && r < 1.0) {
    float z = sqrt(1.0 - r * r);
    vec2 n = d / uLensR;
    vec2 bend = n * (1.0 - z) * 0.3 / vec2(aspect, 1.0);
    vec2 mag = uLens + (uv - uLens) * 0.7;
    vec3 a = flow(mag - bend);
    vec3 b = flow(mag - bend * 1.1);
    col = vec3(a.r, mix(a.g, b.g, 0.5), b.b);
    col *= 0.8 + 0.08 * z;
    float rim = smoothstep(0.9, 0.995, r);
    float lit = 0.5 + 0.5 * dot(normalize(n + 1e-4), vec2(-0.6, 0.8));
    col = mix(col, uC3, rim * (0.25 + 0.55 * lit));
    col *= 1.0 - 0.18 * smoothstep(0.6, 1.0, r) * (1.0 - lit);
  } else {
    col = flow(uv);
    if (uLensOn > 0.5) col *= mix(0.82, 1.0, smoothstep(1.0, 1.06, r));
  }
  col += (hash(uv * uRes) - 0.5) * 0.035;
  gl_FragColor = vec4(col * uDim, 1.0);
}`;

const hexToRgb = (hex: string): [number, number, number] => {
  const v = parseInt(hex.replace("#", ""), 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
};

type Field = { setPalette: (p: SilkPalette, ms: number) => void; setActive: (on: boolean) => void; setIntensity: (v: number) => void; dispose: () => void };

function createField(canvas: HTMLCanvasElement, host: HTMLElement, opts: Required<Omit<Props, "className" | "style" | "children" | "blendMs">> & { scale: number; fps: number; still: boolean }): Field | null {
  const gl = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: "low-power" });
  if (!gl) return null;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "compile failed");
    return s;
  };
  let program: WebGLProgram, vs: WebGLShader, fs: WebGLShader;
  try {
    vs = compile(gl.VERTEX_SHADER, VERTEX);
    fs = compile(gl.FRAGMENT_SHADER, FRAGMENT);
    program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("link failed");
  } catch (e) {
    console.error(e);
    return null;
  }
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.useProgram(program);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  const cache = new Map<string, WebGLUniformLocation | null>();
  const u = (name: string) => {
    if (!cache.has(name)) cache.set(name, gl.getUniformLocation(program, name));
    return cache.get(name)!;
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1) * opts.scale;
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width === w && canvas.height === h) return;
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
  };

  const follow = opts.lens === "cursor" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  let from = opts.palette.map(hexToRgb);
  let to = from.map((c) => [...c] as [number, number, number]);
  let blendStart = 0;
  let blendMs = 0;
  const center = { x: 0.62, y: 0.52 };
  const lensPos = { ...center };
  const goal = { ...center };
  let hasPointer = false;
  let active = true;
  let level = opts.intensity;
  let raf = 0;
  let last = 0;
  const start = performance.now();
  const frameGap = 1000 / opts.fps - 1;

  const blendK = (now: number) => {
    const k = blendMs ? Math.min((now - blendStart) / blendMs, 1) : 1;
    return { k, e: k * k * (3 - 2 * k) };
  };

  const frame = (now: number) => {
    raf = 0;
    if (!active || document.hidden) return;
    if (now - last < frameGap) {
      raf = requestAnimationFrame(frame);
      return;
    }
    last = now;
    const t = ((now - start) / 1000) * opts.speed;
    if (!hasPointer || !follow) {
      goal.x = center.x + Math.sin(t * 0.13) * 0.16;
      goal.y = center.y + Math.sin(t * 0.09 + 1.3) * 0.12;
    }
    const lerp = follow && hasPointer ? 0.18 : 0.04;
    lensPos.x += (goal.x - lensPos.x) * lerp;
    lensPos.y += (goal.y - lensPos.y) * lerp;

    resize();
    const { k, e } = blendK(now);
    for (let i = 0; i < 4; i++) {
      const c = from[i].map((v, j) => v + (to[i][j] - v) * e);
      gl.uniform3f(u(`uC${i}`), c[0], c[1], c[2]);
    }
    gl.uniform2f(u("uRes"), canvas.width, canvas.height);
    gl.uniform1f(u("uTime"), opts.still ? 12 : t);
    gl.uniform1f(u("uLensOn"), opts.lens === "none" ? 0 : 1);
    gl.uniform2f(u("uLens"), lensPos.x, lensPos.y);
    gl.uniform1f(u("uLensR"), opts.lensRadius);
    gl.uniform1f(u("uDim"), level);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    const settling = Math.abs(goal.x - lensPos.x) + Math.abs(goal.y - lensPos.y) > 0.001;
    if (!opts.still || k < 1 || settling) raf = requestAnimationFrame(frame);
  };
  const kick = () => {
    if (!raf && active) raf = requestAnimationFrame(frame);
  };

  const onPointerMove = (e: PointerEvent) => {
    const rect = host.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    hasPointer = true;
    goal.x = (e.clientX - rect.left) / rect.width;
    goal.y = 1 - (e.clientY - rect.top) / rect.height;
    kick();
  };
  const onVisibility = () => !document.hidden && kick();
  if (follow) window.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  kick();

  return {
    setPalette(next, ms) {
      const { e } = blendK(performance.now());
      from = from.map((c, i) => c.map((v, j) => v + (to[i][j] - v) * e) as [number, number, number]);
      to = next.map(hexToRgb);
      blendStart = performance.now();
      blendMs = ms;
      kick();
    },
    setActive(on) {
      active = on;
      if (on) kick();
    },
    setIntensity(v) {
      level = v;
      kick();
    },
    dispose() {
      active = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}

export function SilkField({
  palette = SILK_PALETTES.dusk,
  lens = "none",
  lensRadius = 0.34,
  intensity = 0.7,
  speed = 1,
  blendMs = 900,
  className = "",
  style,
  children,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<Field | null>(null);
  const paletteRef = useRef(palette);

  // Create once per lens/lensRadius/speed configuration.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    // A fresh canvas per mount: a context lost on cleanup can never be reused.
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;inset:0;display:block;width:100%;height:100%";
    host.prepend(canvas);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = !window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    const weak = (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) || nav.connection?.saveData;
    const field = createField(canvas, host, {
      palette: paletteRef.current,
      lens: coarse && lens === "cursor" ? "drift" : lens,
      lensRadius,
      intensity,
      speed,
      scale: coarse ? 0.4 : 0.6,
      fps: coarse ? 30 : 60,
      still: reduced || Boolean(coarse && weak),
    });
    if (!field) {
      canvas.remove();
      return;
    }
    fieldRef.current = field;
    const io = new IntersectionObserver(([e]) => field.setActive(e.isIntersecting));
    io.observe(host);
    return () => {
      io.disconnect();
      field.dispose();
      canvas.remove();
      fieldRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lens, lensRadius, speed]);

  // Palette changes crossfade instead of recreating the context.
  const key = palette.join();
  useEffect(() => {
    if (paletteRef.current.join() === key) return;
    paletteRef.current = palette;
    fieldRef.current?.setPalette(palette, blendMs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => fieldRef.current?.setIntensity(intensity), [intensity]);

  const [c0, c1, c2] = palette;
  return (
    <div
      ref={hostRef}
      className={`relative isolate overflow-hidden ${className}`}
      style={{
        // CSS fallback (and first paint) from the same palette
        background: `radial-gradient(60% 70% at 70% 40%, ${c2}55 0%, transparent 60%), radial-gradient(70% 60% at 20% 80%, ${c1} 0%, transparent 70%), ${c0}`,
        ...style,
      }}
    >
      {children && <div className="relative z-[1] h-full">{children}</div>}
    </div>
  );
}
