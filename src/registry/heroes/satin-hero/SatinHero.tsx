"use client";
import { useEffect, useRef, type ReactNode } from "react";
import "./satin-hero.css";

export type SatinLink = { label: string; href: string };
export type SatinHeroProps = {
  name: string;
  links: SatinLink[];
  /** Two lines read best; each string is one line. */
  headline: string[];
  intro: ReactNode;
  primary: SatinLink;
  secondary?: SatinLink;
  socials?: (SatinLink & { icon: ReactNode })[];
  year?: number;
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

const VERT = "attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }";

// Satin: a height field of soft vertical drapes plus a sweep of folds from the
// top right, lit from the upper left. A tight specular gives the knife-edge
// highlights where folds turn toward the light.
const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec3 uMouse;
uniform vec3 uPaper; uniform vec3 uLight; uniform vec3 uMid; uniform vec3 uDeep; uniform vec3 uSheen;
float field(vec2 p){
  float t = uTime;
  float v = 0.0;
  v += 0.55 * sin(p.x * 3.4 + 0.7 * sin(p.y * 1.4 + t * 0.21) + t * 0.13);
  v += 0.26 * sin(p.x * 5.3 - p.y * 0.9 + 0.8 * sin(p.y * 2.3 - t * 0.17) - t * 0.19);
  vec2 q = p - vec2(uRes.x / uRes.y + 0.15, 1.15);
  float r = length(q);
  float a = atan(q.y, q.x);
  // Creases: ridges rather than waves, so the light catches them in thin lines.
  float k = r * 5.4 + 0.9 * sin(a * 2.4 + t * 0.12) - t * 0.3;
  v += 0.55 * pow(1.0 - abs(sin(k)), 3.0) * smoothstep(2.2, 0.3, r);
  v += 0.22 * sin(k * 0.5 + 1.3) * smoothstep(2.4, 0.5, r);
  vec2 m = p - uMouse.xy;
  float d = dot(m, m);
  v += 0.18 * uMouse.z * exp(-d * 7.0) * sin(d * 18.0 - t * 1.6);
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = vec2(uv.x * uRes.x / uRes.y, uv.y);
  float e = 0.0025;
  float c = field(p);
  vec2 g = vec2(field(p + vec2(e, 0.0)) - c, field(p + vec2(0.0, e)) - c) / e;
  vec3 n = normalize(vec3(-g * 0.1, 1.0));
  vec3 L = normalize(vec3(-0.45, 0.55, 0.7));
  float dif = clamp(dot(n, L), 0.0, 1.0);
  float spec = pow(clamp(dot(n, normalize(L + vec3(0.0, 0.0, 1.0))), 0.0, 1.0), 220.0);
  float soft = pow(clamp(dot(n, normalize(L + vec3(0.0, 0.0, 1.0))), 0.0, 1.0), 18.0);
  vec3 col = mix(uDeep, uMid, smoothstep(0.5, 0.86, dif));
  col = mix(col, uLight, smoothstep(0.78, 1.0, dif) * 0.8);
  col += uSheen * (spec * 1.1 + soft * 0.14);
  // The cloth thins to paper toward the left and bottom edges, as in a lit studio sweep.
  float wash = smoothstep(0.34, 0.0, uv.x) * 0.6 + smoothstep(0.22, 0.0, uv.y) * 0.8;
  col = mix(col, uPaper, clamp(wash, 0.0, 0.92));
  gl_FragColor = vec4(col, 1.0);
}`;

type RGB = [number, number, number];
const hex = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as RGB;
const PALETTES: Record<"light" | "dark", Record<"paper" | "light" | "mid" | "deep" | "sheen", string>> = {
  light: { paper: "#f4f9ff", light: "#d8ecff", mid: "#a8d2fb", deep: "#79aeea", sheen: "#ffffff" },
  dark: { paper: "#070d18", light: "#3c5f8f", mid: "#1d3557", deep: "#0c1830", sheen: "#c9dcf5" },
};

/**
 * Satin Hero
 * A personal hero set on pale draped satin that drifts and catches the light
 * in thin bright streaks. The headline looks pressed into the cloth, and a
 * faint four-column grid runs through it all.
 */
export function SatinHero({ name, links, headline, intro, primary, secondary, socials = [], year, theme = "light", motion = true, className = "" }: SatinHeroProps) {
  const host = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv) return;
    const gl = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return void (el.dataset.fallback = "");
    const still = !motion || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mk = (t: number, s: string) => { const sh = gl.createShader(t)!; gl.shaderSource(sh, s); gl.compileShader(sh); return sh; };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, mk(gl.VERTEX_SHADER, VERT));
    gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, FRAG));
    gl.bindAttribLocation(pr, 0, "p");
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return void (el.dataset.fallback = "");
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(pr, n);
    const pal = PALETTES[theme];
    gl.uniform3f(U("uPaper"), ...hex(pal.paper));
    gl.uniform3f(U("uLight"), ...hex(pal.light));
    gl.uniform3f(U("uMid"), ...hex(pal.mid));
    gl.uniform3f(U("uDeep"), ...hex(pal.deep));
    gl.uniform3f(U("uSheen"), ...hex(pal.sheen));
    const uRes = U("uRes"), uTime = U("uTime"), uMouse = U("uMouse");
    delete el.dataset.fallback;

    const coarse = !matchMedia("(hover: hover) and (pointer: fine)").matches;
    let raf = 0, last = 0, t = 8, visible = true;
    const m = { x: 0, y: 0, z: 0, tz: 0 };
    const size = () => {
      const s = Math.min(devicePixelRatio || 1, 2) * (coarse ? 0.5 : 0.7);
      cv.width = Math.max(1, Math.round(el.clientWidth * s));
      cv.height = Math.max(1, Math.round(el.clientHeight * s));
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(uRes, cv.width, cv.height);
    };
    const frame = () => { gl.uniform1f(uTime, t); gl.uniform3f(uMouse, m.x, m.y, m.z); gl.drawArrays(gl.TRIANGLES, 0, 3); };
    const tick = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0.016;
      last = now;
      t += dt;
      m.z += (m.tz - m.z) * 0.05;
      frame();
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (still) return frame(); if (!raf) { last = 0; raf = requestAnimationFrame(tick); } };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      m.x = ((e.clientX - r.left) / r.height); m.y = 1 - (e.clientY - r.top) / r.height; m.tz = 1;
      if (still) frame();
    };
    const onLeave = () => { m.tz = 0; };
    const ro = new ResizeObserver(() => { size(); frame(); });
    ro.observe(el);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) start(); });
    io.observe(el);
    const onVis = () => { if (!document.hidden) start(); };
    size(); start();
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [theme, motion]);

  return (
    <section ref={host} className={`satn satn--${theme} ${className}`} data-fallback="">
      <canvas ref={canvas} className="satn__cloth" aria-hidden="true" />
      <div className="satn__grid" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <header className="satn__nav">
        <a className="satn__name" href="#">{name}</a>
        <nav aria-label="Main">
          <ol>{links.map((l, i) => <li key={l.label}><a href={l.href}><small aria-hidden="true">{String(i + 1).padStart(2, "0")}</small>{l.label}</a></li>)}</ol>
        </nav>
      </header>
      <div className="satn__main">
        <h1 className="satn__title">{headline.map((l, i) => <span key={i}>{l}</span>)}</h1>
        <p className="satn__intro">{intro}</p>
        <div className="satn__ctas">
          <a className="satn__talk" href={primary.href}>{primary.label}<span aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg></span></a>
          {secondary && <a className="satn__chip" href={secondary.href}>{secondary.label}</a>}
        </div>
      </div>
      <footer className="satn__foot">
        <span>© {year ?? new Date().getFullYear()}</span>
        {socials.length > 0 && <ul>{socials.map((s) => <li key={s.label}><a href={s.href} aria-label={s.label}>{s.icon}</a></li>)}</ul>}
      </footer>
    </section>
  );
}
