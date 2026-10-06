"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createDrone, type Drone } from "./drone";
import "./obsidian-hero.css";

export type ObsidianLink = { label: string; href: string; menu?: boolean };
export type ObsidianHeroProps = {
  brand: { mark: ReactNode; name: string; sub?: string };
  links: ObsidianLink[];
  /** First line is set hairline-thin, second line heavy. */
  headline: [string, string];
  tagline: string;
  primary: { label: string; href: string };
  cta: { label: string; href: string };
  /** Offer the ambient sound switch. */
  sound?: boolean;
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

const VERT = "attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }";

// Obsidian: domain-warped noise read as a height field of glossy black liquid,
// lit by one cold key light and a dim studio wash. Small, many swirls.
const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec3 uMouse;
uniform vec3 uBase; uniform vec3 uRefl; uniform vec3 uHot; uniform float uLight;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; } return v; }
float height(vec2 p){
  float t = uTime * 0.06;
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 3.2 * q + vec2(1.7, 9.2) + t * 0.7), fbm(p + 3.2 * q + vec2(8.3, 2.8) - t * 0.5));
  float h = fbm(p + 3.6 * r);
  vec2 m = p - uMouse.xy;
  h += 0.05 * uMouse.z * sin(length(m) * 26.0 - uTime * 3.0) * exp(-dot(m, m) * 5.0);
  return h;
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = vec2(uv.x * uRes.x / uRes.y, uv.y) * 1.5;
  float e = 0.004;
  float c = height(p);
  vec2 g = vec2(height(p + vec2(e, 0.0)) - c, height(p + vec2(0.0, e)) - c) / e;
  vec3 n = normalize(vec3(-g * 0.32, 1.0));
  vec3 v = vec3(0.0, 0.0, 1.0);
  vec3 L = normalize(vec3(0.35, 0.55, 0.75));
  float spec = pow(max(dot(reflect(-L, n), v), 0.0), 22.0);
  float sheen = pow(max(dot(reflect(-L, n), v), 0.0), 4.0);
  float fres = pow(1.0 - max(n.z, 0.0), 2.0);
  vec3 col = uBase;
  col += uRefl * (sheen * 0.42 + fres * 1.25);
  col += uHot * spec * 0.7;
  // Liquid settles darker toward the floor of the frame.
  col *= mix(1.0, smoothstep(-0.1, 0.6, uv.y), 1.0 - uLight * 0.6);
  gl_FragColor = vec4(col, 1.0);
}`;

type RGB = [number, number, number];
const hex = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as RGB;
const PAL = {
  dark: { base: "#07090c", refl: "#2b3a4c", hot: "#9fb4cc", light: 0 },
  light: { base: "#c9cfd6", refl: "#f4f7fa", hot: "#ffffff", light: 1 },
};

/**
 * Obsidian Hero
 * A dark studio hero over a pool of black liquid that slowly folds and
 * catches cold light, under a faint grid. A hairline-thin line of type sits
 * over a heavy one, and a sound switch plays a quiet ambient bed.
 */
export function ObsidianHero({ brand, links, headline, tagline, primary, cta, sound = true, theme = "dark", motion = true, className = "" }: ObsidianHeroProps) {
  const host = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const wave = useRef<SVGPolylineElement>(null);
  const drone = useRef<Drone | null>(null);
  const [on, setOn] = useState(false);

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
    const pal = PAL[theme];
    gl.uniform3f(U("uBase"), ...hex(pal.base));
    gl.uniform3f(U("uRefl"), ...hex(pal.refl));
    gl.uniform3f(U("uHot"), ...hex(pal.hot));
    gl.uniform1f(U("uLight"), pal.light);
    const uRes = U("uRes"), uTime = U("uTime"), uMouse = U("uMouse");
    delete el.dataset.fallback;

    const coarse = !matchMedia("(hover: hover) and (pointer: fine)").matches;
    let raf = 0, last = 0, t = 20, visible = true, aspect = 1;
    const m = { x: 0, y: 0, z: 0, tz: 0 };
    const size = () => {
      const s = Math.min(devicePixelRatio || 1, 2) * (coarse ? 0.45 : 0.6);
      cv.width = Math.max(1, Math.round(el.clientWidth * s));
      cv.height = Math.max(1, Math.round(el.clientHeight * s));
      aspect = el.clientWidth / Math.max(1, el.clientHeight);
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(uRes, cv.width, cv.height);
    };
    const frame = () => { gl.uniform1f(uTime, t); gl.uniform3f(uMouse, m.x, m.y, m.z); gl.drawArrays(gl.TRIANGLES, 0, 3); };
    const tick = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0.016;
      if (coarse && last && now - last < 33) return void (raf = requestAnimationFrame(tick));
      last = now;
      t += dt;
      m.z += (m.tz - m.z) * 0.04;
      frame();
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (still) return frame(); if (!raf) { last = 0; raf = requestAnimationFrame(tick); } };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      m.x = ((e.clientX - r.left) / r.width) * aspect * 1.5; m.y = (1 - (e.clientY - r.top) / r.height) * 1.5; m.tz = 1;
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

  // The sound line is flat while off and draws the live waveform while on.
  useEffect(() => {
    if (!on) { wave.current?.setAttribute("points", "0,6 140,6"); return; }
    const buf = new Uint8Array(128);
    let raf = 0;
    const draw = () => {
      drone.current?.level(buf);
      const pts: string[] = [];
      for (let i = 0; i < 48; i++) pts.push(`${((i / 47) * 140).toFixed(1)},${(6 + ((buf[i * 2] - 128) / 128) * 22).toFixed(1)}`);
      wave.current?.setAttribute("points", pts.join(" "));
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    const hide = () => { if (document.hidden) { drone.current?.stop(); setOn(false); } };
    document.addEventListener("visibilitychange", hide);
    return () => { cancelAnimationFrame(raf); document.removeEventListener("visibilitychange", hide); };
  }, [on]);
  useEffect(() => () => { drone.current?.close(); drone.current = null; }, []);

  const toggle = async () => {
    if (!drone.current) drone.current = createDrone();
    if (!drone.current) return;
    if (on) { drone.current.stop(); setOn(false); }
    else { await drone.current.start(); setOn(true); }
  };

  return (
    <section ref={host} className={`obsd obsd--${theme} ${className}`} data-fallback="">
      <canvas ref={canvas} className="obsd__pool" aria-hidden="true" />
      <div className="obsd__grid" aria-hidden="true" />
      <header className="obsd__nav">
        <a className="obsd__brand" href="#">
          <span className="obsd__mark" aria-hidden="true">{brand.mark}</span>
          <span className="obsd__wordmark"><strong>{brand.name}</strong>{brand.sub && <small>{brand.sub}</small>}</span>
        </a>
        <nav aria-label="Main">
          <ul>
            {links.map((l) => (
              <li key={l.label}>
                <a href={l.href}>{l.label}{l.menu && <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="obsd__right">
          {sound && (
            <button type="button" className="obsd__sound" aria-pressed={on} onClick={toggle}>
              <span className="obsd__sound-row"><span>Sound</span><span>{on ? "On" : "Off"}</span></span>
              <svg viewBox="0 -8 140 28" aria-hidden="true" preserveAspectRatio="none">
                <path d="M0.5 2V10M139.5 2V10" />
                <polyline ref={wave} points="0,6 140,6" />
              </svg>
            </button>
          )}
          <a className="obsd__start" href={primary.href}>{primary.label}<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" /></svg></a>
        </div>
      </header>

      <div className="obsd__main">
        <h1 className="obsd__title"><span className="obsd__thin">{headline[0]}</span><span className="obsd__heavy">{headline[1]}</span></h1>
        <p className="obsd__tag">{tagline}</p>
        <a className="obsd__cta" href={cta.href}>{cta.label}<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" /></svg></a>
      </div>
    </section>
  );
}
