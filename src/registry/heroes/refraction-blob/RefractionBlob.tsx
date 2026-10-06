"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { progress, scroller } from "../../media/helix-showcase/helix";
import { approach, baseline, direction, lens, spinTarget } from "./blob";
import "./refraction-blob.css";

export type RefractionBlobProps = {
  name: string;
  /** A short line seen through the glass, above the name. */
  label: string;
  logo: ReactNode;
  links: { label: string; href: string; current?: boolean }[];
  tagline: string;
  more: { label: string; href: string };
  /** Scroll length of the section, in viewport heights. */
  length?: number;
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

const VERT = "attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }";

// A lumpy glass drop, raymarched: a sphere pushed in and out by two octaves of
// 3D noise that turn with the scroll. Where the ray hits, the text behind is
// read through the surface normal (bent, slightly magnified, faintly split
// into colour), clouded a little, darkened at the rim and lit with a soft
// highlight. Everywhere else the canvas stays clear so the real text shows.
const FRAG = `
precision highp float;
uniform vec2 uRes; uniform vec3 uLens; uniform mat3 uRot; uniform vec3 uFlow;
uniform sampler2D uText; uniform vec3 uPaper; uniform vec3 uMilk; uniform float uDark;
float hash(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float noise(vec3 x){
  vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}
float sdf(vec3 q){
  vec3 r = uRot * q;
  float d = noise(r * 1.7 + uFlow) * 0.12 + noise(r * 3.6 - uFlow * 1.4) * 0.04;
  return length(q) - 0.96 + d;
}
vec3 normal(vec3 q){
  const vec2 k = vec2(1.0, -1.0); const float h = 0.004;
  return normalize(k.xyy * sdf(q + k.xyy * h) + k.yyx * sdf(q + k.yyx * h) + k.yxy * sdf(q + k.yxy * h) + k.xxx * sdf(q + k.xxx * h));
}
void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 p = (frag - uLens.xy) / uLens.z;
  if (dot(p, p) > 1.25) { gl_FragColor = vec4(0.0); return; }
  vec3 ro = vec3(p, 2.0), rd = vec3(0.0, 0.0, -1.0);
  float t = 0.0, dmin = 1e3; bool hit = false;
  for (int i = 0; i < 56; i++) {
    float d = sdf(ro + rd * t);
    dmin = min(dmin, d);
    if (d < 0.0015) { hit = true; break; }
    t += d * 0.85;
    if (t > 4.0) break;
  }
  float aa = 1.6 / uLens.z;
  float cover = hit ? 1.0 : 1.0 - smoothstep(0.0, aa, dmin);
  if (cover <= 0.0) { gl_FragColor = vec4(0.0); return; }
  vec3 n = normal(ro + rd * t);
  float edge = pow(1.0 - clamp(n.z, 0.0, 1.0), 2.0);
  // Look through the glass: magnified toward the centre and bent by the slope.
  vec2 bend = -n.xy * (0.05 + 0.22 * edge) * uLens.z;
  vec2 base = uLens.xy + (frag - uLens.xy) * 0.93;
  float r = texture2D(uText, (base + bend * 1.00) / uRes).r;
  float g = texture2D(uText, (base + bend * 1.015) / uRes).g;
  float b = texture2D(uText, (base + bend * 1.03) / uRes).b;
  vec3 col = vec3(r, g, b);
  // Milky body, deeper at the rim; a darker ring where the glass turns away.
  col = mix(col, uMilk, 0.1 + 0.3 * edge);
  col *= mix(1.0, 0.78 + 0.1 * uDark, pow(edge, 2.2));
  vec3 L = normalize(vec3(-0.5, 0.6, 0.75));
  vec3 refl = reflect(-L, n);
  float spec = pow(max(refl.z, 0.0), 70.0) * 0.95 + pow(max(refl.z, 0.0), 9.0) * 0.08;
  float rim = pow(edge, 4.0) * 0.18;
  col += vec3(spec + rim * (1.0 - uDark));
  gl_FragColor = vec4(col * cover, cover);
}`;

type RGB = [number, number, number];
const hex = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as RGB;
const PAL = {
  light: { paper: "#ffffff", milk: "#f4f4f2", dark: 0 },
  dark: { paper: "#0c0c0d", milk: "#1c1c1f", dark: 1 },
};

function rotation(a: number, b: number) {
  const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
  // Ry(a) · Rx(b), column-major.
  return new Float32Array([ca, 0, -sa, sa * sb, cb, ca * sb, sa * cb, -sb, ca * cb]);
}

/**
 * Refraction Blob
 * A personal hero on a quiet ruled page: a large name, and in front of it a
 * lumpy drop of glass that reads the name through itself, bending and
 * magnifying it. Scrolling turns the drop; scroll back and it turns the
 * other way, and it keeps drifting in whichever way you last went.
 */
export function RefractionBlob({ name, label, logo, links, tagline, more, length = 2, theme = "light", motion = true, className = "" }: RefractionBlobProps) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const sec = section.current, st = stage.current, cv = canvas.current;
    if (!sec || !st || !cv) return;
    const gl = cv.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: true });
    if (!gl) return void (st.dataset.fallback = "");
    const still = !motion || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mk = (type: number, src: string) => { const sh = gl.createShader(type)!; gl.shaderSource(sh, src); gl.compileShader(sh); return sh; };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, mk(gl.VERTEX_SHADER, VERT));
    gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, FRAG));
    gl.bindAttribLocation(pr, 0, "p");
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return void (st.dataset.fallback = "");
    delete st.dataset.fallback;
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(pr, n);
    const pal = PAL[theme];
    gl.uniform3f(U("uPaper"), ...hex(pal.paper));
    gl.uniform3f(U("uMilk"), ...hex(pal.milk));
    gl.uniform1f(U("uDark"), pal.dark);
    gl.uniform1i(U("uText"), 0);
    const u = { res: U("uRes"), lens: U("uLens"), rot: U("uRot"), flow: U("uFlow") };

    // The text behind the glass, painted from the real elements so the two always line up.
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const paper = document.createElement("canvas");
    let scale = 1;
    const paint = () => {
      const box = st.getBoundingClientRect();
      paper.width = cv.width; paper.height = cv.height;
      const c = paper.getContext("2d")!;
      c.setTransform(scale, 0, 0, scale, 0, 0);
      c.fillStyle = pal.paper; c.fillRect(0, 0, box.width, box.height);
      st.querySelectorAll<HTMLElement>("[data-rblob-ink]").forEach((el) => {
        const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
        c.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        (c as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = cs.letterSpacing === "normal" ? "0px" : cs.letterSpacing;
        c.fillStyle = cs.color; c.textBaseline = "alphabetic";
        const m = c.measureText(el.textContent ?? "");
        const asc = m.fontBoundingBoxAscent ?? parseFloat(cs.fontSize) * 0.8, desc = m.fontBoundingBoxDescent ?? parseFloat(cs.fontSize) * 0.2;
        c.textAlign = "left";
        c.fillText(el.textContent ?? "", r.left - box.left, baseline(r.top - box.top, r.height, asc, desc));
      });
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, paper);
    };

    let raf = 0, prev = 0, visible = true, alive = true;
    let p0 = -1, dir: 1 | -1 = 1, spin = 0.6, speed = 0, flow = 0;
    const size = () => {
      scale = Math.min(devicePixelRatio || 1, 1.5);
      cv.width = Math.max(1, Math.round(st.clientWidth * scale));
      cv.height = Math.max(1, Math.round(st.clientHeight * scale));
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(u.res, cv.width, cv.height);
      paint();
    };
    const pos = () => {
      const box = scroller(sec), page = box === document.scrollingElement;
      const r = sec.getBoundingClientRect();
      return progress(r.top - (page ? 0 : box.getBoundingClientRect().top), r.height, page ? innerHeight : box.clientHeight);
    };
    const draw = (p: number) => {
      const L = lens(st.clientWidth, st.clientHeight, p);
      gl.uniform3f(u.lens, L.x * scale, cv.height - L.y * scale, L.r * scale);
      gl.uniformMatrix3fv(u.rot, false, rotation(spin, spin * 0.37 + 0.4));
      gl.uniform3f(u.flow, flow * 0.6, flow * 0.25, -flow * 0.4);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      st.dataset.dir = dir > 0 ? "down" : "up";
    };
    const tick = (now: number) => {
      raf = 0;
      if (!alive || !visible || document.hidden) return;
      const dt = prev ? Math.min(0.05, (now - prev) / 1000) : 0.016;
      prev = now;
      const p = pos();
      const v = p0 < 0 ? 0 : (p - p0) / dt;
      p0 = p;
      dir = direction(dir, v);
      // Scroll pushes the spin; the push eases off and leaves a slow drift the same way.
      speed = approach(speed, spinTarget(dir, v), dt, 3);
      spin += speed * dt;
      flow += speed * 0.35 * dt;
      draw(p);
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!raf && alive) { prev = 0; raf = requestAnimationFrame(tick); } };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !still) start(); });
    io.observe(sec);
    const onVis = () => { if (!document.hidden && !still) start(); };
    document.addEventListener("visibilitychange", onVis);
    const ro = new ResizeObserver(() => { size(); draw(pos()); });
    ro.observe(st);
    size(); draw(pos());
    document.fonts?.ready.then(() => { if (alive) { paint(); draw(pos()); } });
    if (!still) start();
    return () => { alive = false; cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, [theme, motion]);

  return (
    <section ref={section} className={`rblob rblob--${theme} ${className}`} style={{ height: `${length * 100}svh` }}>
      <div ref={stage} className="rblob__stage" data-fallback="">
        <div className="rblob__frame" aria-hidden="true"><i /><i /><i /></div>
        <header className="rblob__nav">
          <a className="rblob__logo" href="#" aria-label="Home">{logo}</a>
          <nav aria-label="Main">
            <ul>{links.map((l) => <li key={l.label}><a href={l.href} aria-current={l.current ? "page" : undefined}>{l.label}</a></li>)}</ul>
          </nav>
        </header>
        <h1 className="rblob__hero">
          <span className="rblob__label" data-rblob-ink>{label}</span>
          <span className="rblob__name" data-rblob-ink>{name}</span>
        </h1>
        <div className="rblob__lens" aria-hidden="true" />
        <canvas ref={canvas} className="rblob__glass" aria-hidden="true" />
        <p className="rblob__about">
          <span>{tagline}</span>
          <a href={more.href}>{more.label}<span aria-hidden="true">→</span></a>
        </p>
      </div>
    </section>
  );
}
