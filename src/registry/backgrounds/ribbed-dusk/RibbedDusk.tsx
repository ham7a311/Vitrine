"use client";

import { useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import "./ribbed-dusk.css";

/**
 * Ribbed Dusk
 * A soft field of colour seen through ribbed glass. Behind the glass, broad diagonal bands of light drift
 * slowly; each vertical rib shows its own slanted, darkening slice of them, so the bands break into a row of
 * tapered blades. A fine film grain sits over everything.
 */

type Palette = "dusk" | "ember" | "moss";
type Props = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  palette?: Palette;
  /** The width of one rib, in pixels. */
  rib?: number;
  /** How fast the light drifts, 0 to 3. */
  speed?: number;
  motion?: "full" | "still";
};

/** Shadow, deep colour, bright colour, and the pale light that crosses them. */
const PALETTES: Record<Palette, [string, string, string, string]> = {
  dusk: ["#020818", "#0a3f86", "#1c86d6", "#f8c9ad"],
  ember: ["#120406", "#6e1420", "#d2452a", "#ffe2b8"],
  moss: ["#04100c", "#0f4a3c", "#2f9a78", "#eef0c2"],
};

const VERT = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";
const FRAG = `precision highp float;
uniform vec2 uRes;
uniform float uTime, uRibs;
uniform vec3 uC0, uC1, uC2, uC3;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
// The light behind the glass: diagonal bands that bend and drift, with two pools of shadow wandering over them.
float light(vec2 q, float t) {
  // "across" counts the bands, which run from upper left to lower right; "along" runs down a band.
  float across = q.x - q.y * .7, along = q.x * .7 + q.y;
  float v = .5 + .5 * sin(across * 8.2 + sin(along * 2.2 + t * .2) * .9 + t * .15 - 3.1);
  // Blue everywhere, rising to the pale light along the crest of each band.
  v = .46 + .54 * pow(v, 1.35);
  vec2 a = vec2(1.26 + .16 * sin(t * .13), .16 + .12 * cos(t * .11)), b = vec2(.58 + .14 * cos(t * .1 + 1.), .88 + .1 * sin(t * .12 + 2.));
  float pool = exp(-dot(q - a, q - a) / .2) + exp(-dot(q - b, q - b) / .17);
  return v * mix(1., .06, smoothstep(.25, .95, pool));
}
vec3 ramp(float v) {
  vec3 c = mix(uC0, uC1, smoothstep(.16, .44, v));
  c = mix(c, uC2, smoothstep(.4, .66, v));
  return mix(c, uC3, smoothstep(.7, .86, v));
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  uv.y = 1. - uv.y;
  float aspect = uRes.x / uRes.y;
  // Which rib, and how far across it (0 at its left edge).
  float x = uv.x * uRibs, rib = floor(x), f = fract(x);
  // Each rib shows the light at its own middle, pulled further up the scene the further across you look:
  // a band crossing it becomes a slanted blade, and starts again at the next rib.
  vec2 q = vec2((rib + .5) / uRibs * aspect, uv.y - f * .2);
  float v = light(q, uTime);
  // The curve of the rib also dims it toward its right side, most where the light is strong.
  v -= f * (.2 + .34 * v);
  vec3 col = ramp(clamp(v, 0., 1.));
  // A hair of brightness on the rib's lit edge.
  col += uC2 * .05 * smoothstep(.06, 0., f) * smoothstep(.2, .6, v);
  // Film grain.
  col += (hash(gl_FragCoord.xy + fract(uTime) * 61.) - .5) * .055;
  gl_FragColor = vec4(col, 1.);
}`;

const rgb = (hex: string) => { const v = parseInt(hex.slice(1), 16); return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255]; };

export function RibbedDusk({ children, palette = "dusk", rib = 26, speed = 1, motion = "full", className = "", ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = ref.current!, cv = canvas.current!;
    const gl = cv.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;
    const compile = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const at = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(at);
    gl.vertexAttribPointer(at, 2, gl.FLOAT, false, 0, 0);
    const u = (name: string) => gl.getUniformLocation(prog, name);
    PALETTES[palette].forEach((hex, i) => gl.uniform3fv(u(`uC${i}`), rgb(hex)));
    el.dataset.live = "";

    const still = motion === "still" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, last = 0, t = 4, alive = true, visible = true;
    const draw = () => { gl.uniform1f(u("uTime"), t); gl.drawArrays(gl.TRIANGLES, 0, 3); };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2), w = el.offsetWidth, h = el.offsetHeight;
      cv.width = Math.max(1, Math.round(w * dpr));
      cv.height = Math.max(1, Math.round(h * dpr));
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(u("uRes"), cv.width, cv.height);
      // A whole number of ribs, so the last one is never a sliver.
      gl.uniform1f(u("uRibs"), Math.max(6, Math.round(w / Math.max(8, rib))));
      draw();
    };
    const tick = (now: number) => {
      raf = 0;
      if (!alive || !visible || document.hidden) { last = 0; return; }
      if (last) t += (Math.min(now - last, 50) / 1000) * speed;
      last = now;
      draw();
      raf = requestAnimationFrame(tick);
    };
    const wake = () => { if (!still && !raf && alive) raf = requestAnimationFrame(tick); };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) wake(); });
    io.observe(el);
    const onVisible = () => { if (!document.hidden) wake(); };
    document.addEventListener("visibilitychange", onVisible);
    resize();
    wake();
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisible);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      delete el.dataset.live;
    };
  }, [palette, rib, speed, motion]);

  return (
    <div ref={ref} className={`ribd ribd--${palette} ${className}`} {...rest}>
      <canvas ref={canvas} className="ribd__glass" aria-hidden="true" />
      {children && <div className="ribd__content">{children}</div>}
    </div>
  );
}

export default RibbedDusk;
