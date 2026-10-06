"use client";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { DEFAULT_HELIX, front, liftFor, progress, scroller, spring, strip } from "./helix";
import { atlas, CELL, single, type Project } from "./mockups";
import "./helix-showcase.css";

export type { Project } from "./mockups";
export type HelixShowcaseProps = {
  projects: Project[];
  brand: { mark: ReactNode; name: string };
  links: { label: string; href: string }[];
  cta: { label: string; href: string };
  /** Scroll length of the section, in viewport heights. */
  length?: number;
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

const SEGMENTS = 28;
// Cards come to the front from this index to count − EDGE, so there are always cards above and below.
const EDGE = 3;

const BG_VERT = "attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }";
const BG_FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform float uLight; uniform float uLift;
uniform vec3 uBg0; uniform vec3 uBg1; uniform vec3 uLine; uniform vec3 uCore;
float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
// One glowing wave line: a soft halo and a thin bright core.
float wave(vec2 p, float k, float ph, float amp, float off, float tilt){
  float y = off + p.x * tilt + amp * sin(p.x * k + ph) + amp * 0.38 * sin(p.x * k * 2.1 - ph * 1.4);
  float d = abs(p.y - y);
  return exp(-d * d * 5200.0) * 0.85 + exp(-d * d * 260.0) * 0.16 + exp(-d * 38.0) * 0.08;
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = vec2(uv.x * uRes.x / uRes.y, uv.y);
  float t = uTime * 0.08;
  vec3 col = mix(uBg1, uBg0, smoothstep(0.0, 1.1, length(uv - vec2(0.55, 0.5))));
  float w = 0.0;
  float s = uLift * 0.05;
  w += wave(p, 3.1, t + s, 0.16, 0.30, 0.12);
  w += wave(p, 2.4, -t * 1.2 + 1.7 - s, 0.22, 0.62, -0.08);
  w += wave(p, 4.2, t * 0.8 + 3.1, 0.08, 0.86, 0.05) * 0.7;
  w += wave(p, 1.8, -t * 0.7 + 4.4 + s, 0.28, 0.12, 0.18) * 0.8;
  w += wave(p.yx * vec2(1.0, 0.8), 3.4, t * 0.9 + 2.2, 0.12, 0.9, 0.0) * 0.55;
  // Finer filaments that run alongside the main lines.
  w += wave(p, 3.0, t * 1.05 + 0.35 + s, 0.17, 0.33, 0.12) * 0.45;
  w += wave(p, 2.5, -t * 1.15 + 1.95 - s, 0.21, 0.58, -0.08) * 0.4;
  w += wave(p, 5.3, t * 0.6 + 5.0, 0.06, 0.46, 0.22) * 0.35;
  // On dark the lines add light; on the light scene they tint the paper blue instead.
  col = mix(col + uLine * w, mix(col, uLine, clamp(w * 0.45, 0.0, 0.55)), uLight);
  col += uCore * pow(clamp(w - 0.55, 0.0, 1.0), 2.0) * 0.8;
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.035;
  gl_FragColor = vec4(col, 1.0);
}`;

const CARD_VERT = `
attribute vec2 aUV;
uniform float uIndex; uniform float uLift; uniform float uStep; uniform float uPitch; uniform float uR; uniform float uArc; uniform float uH;
uniform mat3 uTilt; uniform mat4 uProj; uniform vec3 uShift; uniform vec2 uCell; uniform vec2 uCellSize;
varying vec2 vUV; varying vec2 vLocal; varying float vFace; varying float vDepth; varying float vY;
void main(){
  float turn = -uLift / uPitch * uStep;
  float a = uIndex * uStep + turn + (aUV.x - 0.5) * uArc;
  float y = -uIndex * uPitch + uLift + (aUV.y - 0.5) * uH;
  vec3 p = uTilt * vec3(uR * sin(a), y, uR * cos(a)) + uShift;
  vec3 n = uTilt * vec3(sin(a), 0.0, cos(a));
  gl_Position = uProj * vec4(p, 1.0);
  vUV = uCell + vec2(aUV.x, 1.0 - aUV.y) * uCellSize;
  vLocal = aUV;
  vFace = n.z;
  vDepth = p.z;
  vY = gl_Position.y / gl_Position.w;
}`;
const CARD_FRAG = `
precision highp float;
uniform sampler2D uAtlas; uniform float uAspect; uniform vec3 uFog; uniform float uLight;
varying vec2 vUV; varying vec2 vLocal; varying float vFace; varying float vDepth; varying float vY;
void main(){
  // Rounded corners in card space.
  vec2 q = (vLocal - 0.5) * vec2(uAspect, 1.0);
  vec2 b = vec2(uAspect, 1.0) * 0.5 - 0.035;
  float d = length(max(abs(q) - b, 0.0)) - 0.035;
  float edge = 1.0 - smoothstep(-0.006, 0.0, d);
  if (edge <= 0.0) discard;
  vec3 c = texture2D(uAtlas, vUV).rgb;
  float lit = gl_FrontFacing ? 0.62 + 0.38 * clamp(vFace, 0.0, 1.0) : 0.4 + 0.12 * clamp(-vFace, 0.0, 1.0);
  c *= lit;
  // A thin rim of light along the card edge.
  c += smoothstep(-0.018, -0.002, d) * 0.18;
  // Further cards sink into the background.
  float fog = clamp((-vDepth - 5.6) / 5.0, 0.0, 0.7);
  c = mix(c, uFog, fog);
  float fade = 1.0 - smoothstep(0.82, 1.08, abs(vY));
  gl_FragColor = vec4(c, edge * fade);
}`;

type RGB = [number, number, number];
const hex = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as RGB;
const PAL = {
  dark: { bg0: "#010206", bg1: "#030b1e", line: "#2463ff", core: "#a9c8ff", fog: "#02060f", light: 0 },
  light: { bg0: "#f3f6fb", bg1: "#dfe8f6", line: "#3b6ef0", core: "#ffffff", fog: "#e9eff8", light: 1 },
};

function perspective(fov: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fov / 2), nf = 1 / (near - far);
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
}
function tilt(ax: number, az: number) {
  const cx = Math.cos(ax), sx = Math.sin(ax), cz = Math.cos(az), sz = Math.sin(az);
  // Rz · Rx, column-major.
  return new Float32Array([cz, sz, 0, -sz * cx, cz * cx, sx, sz * sx, -cz * sx, cx]);
}

/**
 * Helix Showcase
 * A portfolio as a spiral of curved project cards wound round an invisible
 * column, over a dark field of glowing wave lines. Scrolling turns the
 * spiral like a screw: cards rise out of the top while the next ones come up
 * into view from below.
 */
export function HelixShowcase({ projects, brand, links, cta, length = 4, theme = "dark", motion = true, className = "" }: HelixShowcaseProps) {
  const id = useId();
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState(theme);
  const [current, setCurrent] = useState(EDGE);
  const [fallback, setFallback] = useState<string[] | null>(null);
  const count = Math.min(projects.length, CELL.cols * Math.floor(CELL.size / CELL.h));
  const H = { ...DEFAULT_HELIX, count };
  const first = Math.min(EDGE, count - 1), last = Math.max(first, count - 1 - EDGE);

  useEffect(() => setMode(theme), [theme]);

  useEffect(() => {
    const sec = section.current, st = stage.current, cv = canvas.current;
    if (!sec || !st || !cv) return;
    const gl = cv.getContext("webgl", { antialias: true, alpha: false, premultipliedAlpha: false });
    const fail = () => setFallback(projects.slice(0, count).map((p, i) => single(p, i + 1)));
    if (!gl) return fail();
    const still = !motion || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mk = (t: number, s: string) => { const sh = gl.createShader(t)!; gl.shaderSource(sh, s); gl.compileShader(sh); return sh; };
    const program = (v: string, f: string, attr: string) => {
      const pr = gl.createProgram()!;
      gl.attachShader(pr, mk(gl.VERTEX_SHADER, v)); gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, f));
      gl.bindAttribLocation(pr, 0, attr); gl.linkProgram(pr);
      return gl.getProgramParameter(pr, gl.LINK_STATUS) ? pr : null;
    };
    const bg = program(BG_VERT, BG_FRAG, "p"), cards = program(CARD_VERT, CARD_FRAG, "aUV");
    if (!bg || !cards) return fail();
    setFallback(null);

    const tri = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, tri);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const mesh = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, mesh);
    gl.bufferData(gl.ARRAY_BUFFER, strip(SEGMENTS), gl.STATIC_DRAW);
    const verts = SEGMENTS * 6;

    const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas(projects.slice(0, count)));
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    const aniso = gl.getExtension("EXT_texture_filter_anisotropic");
    if (aniso) gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, 8);

    const Ub = (n: string) => gl.getUniformLocation(bg, n), Uc = (n: string) => gl.getUniformLocation(cards, n);
    const pal = PAL[mode];
    gl.useProgram(bg);
    gl.uniform3f(Ub("uBg0"), ...hex(pal.bg0)); gl.uniform3f(Ub("uBg1"), ...hex(pal.bg1));
    gl.uniform3f(Ub("uLine"), ...hex(pal.line)); gl.uniform3f(Ub("uCore"), ...hex(pal.core)); gl.uniform1f(Ub("uLight"), pal.light);
    gl.useProgram(cards);
    gl.uniform1f(Uc("uStep"), H.step); gl.uniform1f(Uc("uPitch"), H.pitch); gl.uniform1f(Uc("uR"), H.radius);
    gl.uniform1f(Uc("uArc"), H.arc); gl.uniform1f(Uc("uH"), H.height); gl.uniform1f(Uc("uAspect"), (H.arc * H.radius) / H.height);
    gl.uniform2f(Uc("uCellSize"), CELL.w / CELL.size, CELL.h / CELL.size);
    gl.uniform3f(Uc("uFog"), ...hex(pal.fog)); gl.uniform1i(Uc("uAtlas"), 0);
    const u = { res: Ub("uRes"), time: Ub("uTime"), blift: Ub("uLift"), index: Uc("uIndex"), lift: Uc("uLift"), cell: Uc("uCell"), proj: Uc("uProj"), tilt: Uc("uTilt"), shift: Uc("uShift") };

    let raf = 0, prev = 0, t = 0, visible = true, lift = liftFor(first, H), vel = 0, shown = -1, narrow = false;
    const size = () => {
      const s = Math.min(devicePixelRatio || 1, 2);
      cv.width = Math.max(1, Math.round(st.clientWidth * s));
      cv.height = Math.max(1, Math.round(st.clientHeight * s));
      gl.viewport(0, 0, cv.width, cv.height);
      narrow = st.clientWidth < 720;
      const aspect = st.clientWidth / Math.max(1, st.clientHeight);
      gl.useProgram(bg); gl.uniform2f(u.res, cv.width, cv.height);
      gl.useProgram(cards);
      gl.uniformMatrix4fv(u.proj, false, perspective(narrow ? 0.9 : 0.66, aspect, 0.1, 60));
      gl.uniformMatrix3fv(u.tilt, false, tilt(0.2, narrow ? -0.12 : -0.26));
      gl.uniform3f(u.shift, narrow ? 0 : 0.7, 0, narrow ? -10.6 : -8.6);
    };
    const target = () => {
      const r = sec.getBoundingClientRect();
      // Measure against whatever actually scrolls: the page, or a scrolling container around it.
      const box = scroller(sec);
      const top = box === document.scrollingElement ? 0 : box.getBoundingClientRect().top;
      const p = progress(r.top - top, r.height, box === document.scrollingElement ? innerHeight : box.clientHeight);
      return liftFor(first + p * (last - first), H);
    };
    const draw = () => {
      gl.disable(gl.BLEND);
      gl.useProgram(bg);
      gl.bindBuffer(gl.ARRAY_BUFFER, tri); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1f(u.time, t); gl.uniform1f(u.blift, lift);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(cards);
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1f(u.lift, lift);
      // Back to front, so nearer cards cover the ones behind.
      const turn = (-lift / H.pitch) * H.step;
      const order = Array.from({ length: count }, (_, i) => i).filter((i) => Math.abs(-i * H.pitch + lift) < 4.2).sort((a, b) => Math.cos(a * H.step + turn) - Math.cos(b * H.step + turn));
      for (const i of order) {
        gl.uniform1f(u.index, i);
        gl.uniform2f(u.cell, ((i % CELL.cols) * CELL.w) / CELL.size, (Math.floor(i / CELL.cols) * CELL.h) / CELL.size);
        gl.drawArrays(gl.TRIANGLES, 0, verts);
      }
      const f = Math.min(last, Math.max(first, front(lift, H)));
      if (f !== shown) { shown = f; setCurrent(f); }
    };
    const tick = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const dt = prev ? Math.min(0.05, (now - prev) / 1000) : 0.016;
      prev = now;
      if (!still) t += dt;
      const goal = target();
      if (still) { lift = goal; vel = 0; } else [lift, vel] = spring(lift, vel, goal, dt, 7);
      draw();
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!raf) { prev = 0; raf = requestAnimationFrame(tick); } };
    const ro = new ResizeObserver(() => { size(); draw(); });
    ro.observe(st);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) start(); });
    io.observe(sec);
    const onVis = () => { if (!document.hidden) start(); };
    document.addEventListener("visibilitychange", onVis);
    size(); lift = target(); draw(); start();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener("visibilitychange", onVis); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects, mode, motion, count]);

  // Keys step the page to the scroll position that brings the next or previous card to the front.
  const go = (i: number) => {
    const sec = section.current;
    if (!sec) return;
    const k = Math.min(last, Math.max(first, i));
    const box = scroller(sec);
    const page = box === document.scrollingElement;
    const top = sec.getBoundingClientRect().top - (page ? 0 : box.getBoundingClientRect().top) + box.scrollTop;
    const run = sec.offsetHeight - (page ? innerHeight : box.clientHeight);
    const still = !motion || matchMedia("(prefers-reduced-motion: reduce)").matches;
    box.scrollTo({ top: top + (last === first ? 0 : ((k - first) / (last - first)) * run), behavior: still ? "auto" : "smooth" });
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (["ArrowDown", "ArrowRight", "PageDown"].includes(e.key)) { e.preventDefault(); go(current + 1); }
    else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); go(current - 1); }
    else if (e.key === "Home") { e.preventDefault(); go(first); }
    else if (e.key === "End") { e.preventDefault(); go(last); }
  };

  const p = projects[current];
  return (
    <section ref={section} className={`hlx hlx--${mode} ${className}`} style={{ height: fallback ? "auto" : `${length * 100}svh` }} aria-labelledby={`${id}-t`}>
      <div ref={stage} className="hlx__stage" data-fallback={fallback ? true : undefined}>
        <canvas ref={canvas} className="hlx__canvas" aria-hidden="true" />
        <header className="hlx__nav">
          <a className="hlx__brand" href="#"><span aria-hidden="true">{brand.mark}</span>{brand.name}</a>
          <nav aria-label="Main" className="hlx__links">
            <ul>{links.map((l, i) => <li key={l.label}><a href={l.href} aria-current={i === 0 ? "page" : undefined}>{l.label}</a></li>)}</ul>
          </nav>
          <div className="hlx__end">
            <button type="button" aria-pressed={mode === "dark"} aria-label="Dark theme" className="hlx__mode" onClick={() => setMode((m) => (m === "dark" ? "light" : "dark"))}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                {mode === "dark"
                  ? <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
                  : <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" /></>}
              </svg>
            </button>
            <a className="hlx__cta" href={cta.href}>{cta.label}<span aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 11 11 5M6 5h5v5" /></svg></span></a>
          </div>
        </header>

        <h2 id={`${id}-t`} className="hlx__sr">Selected work</h2>
        {!fallback && (
          <div
            className="hlx__focus"
            tabIndex={0}
            role="group"
            aria-roledescription="carousel"
            aria-label={`Selected work, ${projects.length} projects. Arrow keys move between them.`}
            onKeyDown={onKey}
          >
            {p && (
              <a className="hlx__caption" href={p.href} tabIndex={-1}>
                <span>{String(current + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
                <strong>{p.title}</strong>
                <em>{p.kind}</em>
              </a>
            )}
            <p className="hlx__sr" aria-live="polite">{p ? `${p.title}, ${p.kind}` : ""}</p>
          </div>
        )}
        {!fallback && <p className="hlx__hint" aria-hidden="true"><span>Scroll</span><i /></p>}
        {fallback && (
          <ul className="hlx__grid">
            {projects.slice(0, count).map((q, i) => (
              <li key={q.title}><a href={q.href}><img src={fallback[i]} alt="" /><strong>{q.title}</strong><em>{q.kind}</em></a></li>
            ))}
          </ul>
        )}
      </div>
      <ol className="hlx__sr">
        {projects.slice(0, count).map((q) => <li key={q.title}><a href={q.href} tabIndex={-1}>{q.title}, {q.kind}</a></li>)}
      </ol>
    </section>
  );
}
