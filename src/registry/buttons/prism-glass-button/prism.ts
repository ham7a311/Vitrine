/*
 * Prism glass: a slab of clear glass whose thick edge works as a lens. At two opposite corners the edge shows
 * ink split into colours: one colour against the outer edge, a solid core, another colour within. Nothing is
 * drawn on the face, so the slab sits on any background. When it moves, the two fringes travel round the rim
 * at a steady pace, and that is the only motion. One small WebGL program, no React; `attachPrism` adds the
 * sizing and the loop.
 */

export type PrismPalette = "spectrum" | "aurora" | "solar";

/** Four stops each, from the inner fringe to the outer one. */
export const PALETTES: Record<PrismPalette, [string, string, string, string]> = {
  spectrum: ["#3fd8ff", "#1a34ff", "#ff2aa0", "#ff4530"],
  aurora: ["#7dffc8", "#00b8a4", "#7a52ff", "#ff86dc"],
  solar: ["#ffe45a", "#ff8a1f", "#e3245f", "#7a2bd0"],
};

export type PrismShape = {
  /** Corner radius, the width of the flat rim, and how far in from the edge the lens reaches: CSS pixels. */
  radius: number;
  rim: number;
  depth: number;
  /** Clear space the canvas keeps round the slab, for its shadow and outer shell. */
  margin: number;
};

export type PrismOptions = {
  dark: boolean;
  palette: PrismPalette;
  /** One settled frame, with the fringes at the top-right and bottom-left corners. */
  still?: boolean;
  /** Seconds for the fringes to travel once round the rim. */
  lap?: number;
  /** Leave out the soft shadow light glass casts: for a slab that is the page itself. */
  flat?: boolean;
  /**
   * "full" draws every edge line. "outer" keeps the outer edge (and its highlight, and the dark glass's outer
   * shell) but leaves out the rim band and the inner bevel. "none" leaves out all of them. Nothing else changes.
   */
  lines?: "full" | "outer" | "none";
  /** A faint white lift over the face, 0…1: lets dark glass without lines still read as a shape on black. */
  face?: number;
  shape(width: number, height: number): PrismShape;
};

export type PrismHandle = { destroy(): void };

const VERT = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";

const FRAG = `precision highp float;
uniform vec2 uRes, uHalf, uLean;
uniform float uRad, uRim, uDepth, uShell, uDark, uPx, uShadow, uOuter, uInner, uFace;
uniform vec3 uInk, uC0, uC1, uC2, uC3;

float box(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r;
}
float line(float d, float at, float w) { return 1. - smoothstep(0., w, abs(d - at)); }
vec3 pal(float f) {
  f *= 3.;
  return f < 1. ? mix(uC0, uC1, f) : f < 2. ? mix(uC1, uC2, f - 1.) : mix(uC2, uC3, f - 2.);
}
void over(inout vec4 acc, vec3 c, float a) { acc = vec4(acc.rgb * (1. - a) + c * a, acc.a * (1. - a) + a); }

void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) - uRes * .5;
  float d = box(p, uHalf, uRad);
  vec2 n = normalize(vec2(box(p + vec2(1., 0.), uHalf, uRad) - box(p - vec2(1., 0.), uHalf, uRad), box(p + vec2(0., 1.), uHalf, uRad) - box(p - vec2(0., 1.), uHalf, uRad)) + 1e-5);
  float facing = dot(n, normalize(vec2(-1., -1.)));

  // The lens: strongest at the two corners the slab leans along, thinning away along the edges from them.
  float m = min(uHalf.x, uHalf.y);
  vec2 span = min(uHalf, vec2(m * 1.7));
  vec2 corner = clamp((abs(p) - uHalf + span) / span, 0., 1.) * sign(p);
  float lean = smoothstep(.76, 1., abs(dot(normalize(corner + 1e-5), uLean)));

  // What it shows there is ink split into colours: one colour against the outer edge, a solid core,
  // another colour within, fading into the face. The thin tails are colour alone.
  float thick = pow(lean, 1.7) * (.86 + .14 * sin(dot(corner, vec2(5.3, 3.9)) + uLean.x * 2.));
  float s = clamp(-d / uDepth, 0., 4.) / max(thick, 1e-3);
  float hit = smoothstep(1., .5, s) * smoothstep(0., .1, thick);
  float core = smoothstep(.16, .36, s) * smoothstep(.68, .46, s) * smoothstep(.2, .55, thick);
  vec3 hue = pal(1. - smoothstep(0., .86, s));


  vec4 acc = vec4(0.);
  // The edge lines. The outer ones (the edge itself and its highlight) follow uOuter; the inner ones (the rim
  // band and the bevel) follow uInner. Switching them off changes nothing else.
  float rim = smoothstep(uRim + uPx, uRim - uPx, -d) * uInner;
  float outer = line(d, -uPx, uPx * 1.6) * uOuter, inner = line(d, -uRim, uPx * 1.8) * uInner;
  // Dark glass with no lines gets a faint lift over its face, so the slab still reads on black.
  over(acc, vec3(1.), uFace);
  over(acc, vec3(1.), rim * mix(.1, .03, uDark));
  over(acc, mix(hue, uInk, core), hit);
  if (uDark > .5) {
    over(acc, vec3(1.), min(outer * (.2 + .22 * abs(facing)) + line(d, -uPx * 2.5, uPx * 5.) * .05 * uOuter, 1.));
    over(acc, vec3(1.), inner * (.07 + .09 * max(-facing, 0.)));
  } else {
    over(acc, vec3(1.), line(d, -uPx * 3., uPx * 2.4) * .7 * (.35 + .65 * max(facing, 0.)) * uOuter);
    over(acc, vec3(0.), outer * .1);
    over(acc, vec3(0.), inner * (.035 + .075 * max(facing, 0.)));
    over(acc, vec3(1.), line(d, -uRim - uPx * 2.2, uPx * 2.) * .5 * max(-facing, 0.) * uInner);
  }

  float inside = clamp(.5 - d / uPx, 0., 1.);
  vec4 halo;
  if (uDark > .5) {
    // A second, fainter shell outside the first, visible only on its flanks.
    float d2 = box(p, uHalf + uShell, uRad + uShell);
    float a = (line(d2, 0., uPx * 1.8) * .26 + line(d2, 0., uPx * 9.) * .07) * smoothstep(.74, .98, abs(n.x)) * uOuter;
    // A soft glow just outside the edge, stronger when the face is lifted.
    a += exp(-max(d, 0.) / (uDepth * (.1 + uFace * 1.6))) * (.1 + uFace * 2.2);
    halo = vec4(vec3(.82, .86, 1.) * a, a);
  } else {
    // A soft shadow, a little below the slab.
    float ds = box(p - vec2(0., uDepth * .14), uHalf, uRad);
    halo = vec4(0., 0., 0., exp(-max(ds, 0.) / (uDepth * .22)) * .13 * uShadow);
  }
  gl_FragColor = acc * inside + halo * (1. - inside);
}`;

type Program = {
  resize(width: number, height: number, shape: PrismShape, dpr: number): void;
  render(lean: [number, number]): void;
  destroy(): void;
};

/** "#rrggbb" to [r, g, b] 0…1. */
export function rgb(hex: string): [number, number, number] {
  const v = parseInt(hex.replace("#", "").padEnd(6, "0").slice(0, 6), 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
}

function createProgram(canvas: HTMLCanvasElement, dark: boolean, palette: PrismPalette, flat: boolean, lines: "full" | "outer" | "none", face: number): Program | null {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, antialias: false, alpha: true });
  if (!gl) return null;
  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT), fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const at = gl.getAttribLocation(prog, "a");
  gl.enableVertexAttribArray(at);
  gl.vertexAttribPointer(at, 2, gl.FLOAT, false, 0, 0);
  const u = (name: string) => gl.getUniformLocation(prog, name);
  gl.uniform1f(u("uDark"), dark ? 1 : 0);
  gl.uniform1f(u("uShadow"), flat ? 0 : 1);
  gl.uniform1f(u("uOuter"), lines === "none" ? 0 : 1);
  gl.uniform1f(u("uInner"), lines === "full" ? 1 : 0);
  gl.uniform1f(u("uFace"), face);
  gl.uniform3fv(u("uInk"), rgb(dark ? "#f7f7fa" : "#08080a"));
  PALETTES[palette].forEach((hex, i) => gl.uniform3fv(u(`uC${i}`), rgb(hex)));
  const U = { res: u("uRes"), half: u("uHalf"), lean: u("uLean"), rad: u("uRad"), rim: u("uRim"), depth: u("uDepth"), shell: u("uShell"),  px: u("uPx") };

  return {
    resize(width, height, shape, dpr) {
      canvas.width = Math.round((width + shape.margin * 2) * dpr);
      canvas.height = Math.round((height + shape.margin * 2) * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(U.res, canvas.width, canvas.height);
      gl.uniform2f(U.half, (width / 2) * dpr, (height / 2) * dpr);
      gl.uniform1f(U.rad, shape.radius * dpr);
      gl.uniform1f(U.rim, shape.rim * dpr);
      gl.uniform1f(U.depth, shape.depth * dpr);
      gl.uniform1f(U.shell, Math.min(shape.depth * 0.5, shape.margin * 0.78) * dpr);
      gl.uniform1f(U.px, dpr);
    },
    render(lean) {
      const k = Math.hypot(lean[0], lean[1]) || 1;
      gl.uniform2f(U.lean, lean[0] / k, lean[1] / k);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    // The context is left alone: under React's double-run effects, losing it here would kill the second mount.
    destroy() {
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    },
  };
}

/** The corners the lens favours at rest: top right and bottom left. */
const REST: [number, number] = [0.707, -0.707];

/**
 * Put a prism slab over `host`, drawn on `canvas` (a child of it). Sets `data-glass` on the host while the
 * glass is drawing, so plain CSS can stand in when WebGL is missing. Returns null in that case.
 */
export function attachPrism(host: HTMLElement, canvas: HTMLCanvasElement, options: PrismOptions): PrismHandle | null {
  const program = createProgram(canvas, options.dark, options.palette, !!options.flat, options.lines ?? "full", options.face ?? 0);
  if (!program) return null;
  const still = options.still || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const speed = (Math.PI * 2) / Math.max(1, options.lap ?? 7);
  // How far the fringes have travelled. It only advances while they are on screen, so they pick up where they left off.
  let angle = 0, last = 0, raf = 0, alive = true, visible = true;
  const lean = (): [number, number] => [REST[0] * Math.cos(angle) - REST[1] * Math.sin(angle), REST[0] * Math.sin(angle) + REST[1] * Math.cos(angle)];

  const layout = () => {
    const w = host.offsetWidth, h = host.offsetHeight;
    if (!w || !h) return;
    const shape = options.shape(w, h);
    program.resize(w, h, shape, Math.min(window.devicePixelRatio || 1, 2));
    canvas.style.inset = `${-shape.margin}px`;
    canvas.style.width = `${w + shape.margin * 2}px`;
    canvas.style.height = `${h + shape.margin * 2}px`;
    host.dataset.glass = "";
    program.render(lean());
  };

  const tick = (now: number) => {
    raf = 0;
    if (!alive || !visible || document.hidden) { last = 0; return; }
    // A steady pace, whatever the frame rate; a long gap (a dropped tab) does not jump ahead.
    if (last) angle += Math.min(now - last, 50) / 1000 * speed;
    last = now;
    program.render(lean());
    raf = requestAnimationFrame(tick);
  };
  const wake = () => {
    if (!still && !raf && alive) raf = requestAnimationFrame(tick);
  };

  const ro = new ResizeObserver(layout);
  ro.observe(host);
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) wake(); });
  io.observe(host);
  const onVisible = () => { if (!document.hidden) wake(); };
  document.addEventListener("visibilitychange", onVisible);
  layout();
  wake();

  return {
    destroy() {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisible);
      program.destroy();
      delete host.dataset.glass;
    },
  };
}
