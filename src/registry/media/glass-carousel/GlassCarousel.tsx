"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { paintStudy } from "../art-gallery/studies";
import "./glass-carousel.css";

/**
 * Glass Carousel
 * An endless row of portrait panels seen through a liquid glass lens in the middle. The row is
 * drawn into a texture, then a second shader bends it: the rim swirls and splits into colour,
 * a soft white bloom sits in the centre and a thin blue ring shimmers round the edge.
 * Click the centred panel to bring it forward; the rest fall away.
 */

export type CarouselItem = { title: string; image?: string };

const DEFAULT_ITEMS: CarouselItem[] = [
  { title: "Salt Line" }, { title: "Monsoon" }, { title: "Second Light" }, { title: "Falaj" },
  { title: "Night Market" }, { title: "Copper Leaf" }, { title: "Blue Hour" }, { title: "Last Ferry" },
];

const PANEL_ASPECT = 3 / 4;

// ---------- shaders ----------
const QUAD_VS = `attribute vec2 a; uniform vec4 uRect; uniform vec2 uView; varying vec2 vUv;
void main(){ vUv = vec2(a.x, 1.0 - a.y); vec2 px = uRect.xy + (a - 0.5) * uRect.zw; gl_Position = vec4(px / (uView * 0.5), 0.0, 1.0); }`;
const QUAD_FS = `precision mediump float; uniform sampler2D uTex; uniform vec4 uTile; uniform float uAlpha; varying vec2 vUv;
void main(){ vec4 c = texture2D(uTex, uTile.xy + vUv * uTile.zw); gl_FragColor = vec4(c.rgb, c.a * uAlpha); }`;
const LENS_VS = `attribute vec2 a; varying vec2 vUv; void main(){ vUv = a; gl_Position = vec4(a * 2.0 - 1.0, 0.0, 1.0); }`;
const LENS_FS = `precision highp float;
#define PI 3.14159265
uniform sampler2D uScene; uniform vec2 uRes; uniform vec2 uRadius; uniform float uFx; uniform float uTime; uniform float uShimmer; uniform vec3 uRing;
varying vec2 vUv;
void main(){
  vec2 px = vUv * uRes;
  vec2 c = uRes * 0.5;
  vec2 off = px - c;
  vec2 p = off / uRadius;
  float nd = length(p);
  vec3 base = texture2D(uScene, vUv).rgb;
  if (nd > 1.0 || uFx < 0.001) { gl_FragColor = vec4(base, 1.0); return; }
  vec2 rd = normalize(off + 1e-4);
  vec2 td = vec2(-rd.y, rd.x);
  float ang = atan(p.y, p.x);
  float rim = smoothstep(0.58, 1.0, nd);
  float wave = sin(ang * 2.0) * 0.55 + sin(ang) * 0.25;
  float R = (uRadius.x + uRadius.y) * 0.5;
  vec2 bent = px + td * wave * rim * R * 0.32 * uFx;
  vec2 disp = off * 11.0 * 0.004 * smoothstep(0.55, 1.0, nd) * uFx;
  vec3 col = vec3(0.0), w = vec3(0.0);
  for (int i = 0; i < 16; i++) {
    float t = float(i) / 15.0;
    vec3 s = texture2D(uScene, (bent + disp * (t - 0.5)) / uRes).rgb;
    vec3 k = vec3(exp(-pow(t / 0.38, 2.0)), exp(-pow((t - 0.5) / 0.38, 2.0)), exp(-pow((t - 1.0) / 0.38, 2.0)));
    col += s * k; w += k;
  }
  col /= max(w, vec3(0.001));
  col *= mix(0.91, 1.0, smoothstep(0.0, 0.38, nd));
  float r2 = nd * nd * 0.25;
  float gs = 0.12;
  col += vec3(exp(-r2 / gs) + exp(-r2 / (gs * 7.0)) * 0.18) * 0.07 * uFx;
  float dC = nd * 0.5;
  float ring = exp(-pow((dC - 0.49) / 0.014, 2.0)) * 1.6;
  ring *= mix(1.0, sin(ang * 12.0 + uTime * 3.5) * 0.12 + 0.88, uShimmer);
  float aura = exp(-pow((dC - 0.49) / 0.084, 2.0)) * 0.25;
  col += uRing * (ring + aura) * uFx;
  col += vec3(exp(-pow((dC - 0.488) / 0.003, 2.0)) * 1.4) * uFx;
  float a = smoothstep(1.0, 0.93, nd);
  gl_FragColor = vec4(mix(base, col, a), 1.0);
}`;

function program(gl: WebGLRenderingContext, vs: string, fs: string) {
  const mk = (t: number, s: string) => {
    const sh = gl.createShader(t)!;
    gl.shaderSource(sh, s);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) ?? "shader");
    return sh;
  };
  const p = gl.createProgram()!;
  gl.attachShader(p, mk(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error("link");
  return p;
}

// ---------- tiny tween engine ----------
type Ease = (t: number) => number;
const E = {
  out3: (t: number) => 1 - (1 - t) ** 3,
  out4: (t: number) => 1 - (1 - t) ** 4,
  inOut3: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
  expoInOut: (t: number) => (t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? 2 ** (20 * t - 10) / 2 : (2 - 2 ** (-20 * t + 10)) / 2),
};
type Tween = { get: () => number; set: (v: number) => void; from?: number; to: number; start: number; dur: number; ease: Ease; done?: () => void };

function hexRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export type GlassCarouselProps = {
  items?: CarouselItem[];
  /** Target panel height in px; scaled down to 52% of a shorter container. */
  panelHeight?: number;
  gap?: number;
  theme?: "white" | "night";
  /** Play the rise-and-grow intro (skipped under reduced motion). */
  entry?: boolean;
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
  onActiveChange?: (index: number) => void;
};

export function GlassCarousel({ items = DEFAULT_ITEMS, panelHeight = 450, gap = 12, theme = "white", entry = true, motion = "full", className = "", style, onActiveChange }: GlassCarouselProps) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const engine = useRef<{ next: () => void; prev: () => void; close: () => void } | null>(null);
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);
  const [shown, setShown] = useState(!entry);
  const [failed, setFailed] = useState(false);
  const [fallbackImgs, setFallbackImgs] = useState<string[]>([]);
  const labelId = useId();
  const cb = useRef(onActiveChange);
  cb.current = onActiveChange;
  const bg = theme === "night" ? "#0b0b0c" : "#ffffff";

  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv || !items.length) return;
    const gl = cv.getContext("webgl", { antialias: true, alpha: false, premultipliedAlpha: false });
    const reduced = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!gl) {
      setFailed(true);
      setFallbackImgs(items.map((it, i) => it.image ?? paintStudy(i * 2 + 5, 360, 480).toDataURL("image/jpeg", 0.85)));
      return;
    }
    let qp: WebGLProgram, lp: WebGLProgram;
    try {
      qp = program(gl, QUAD_VS, QUAD_FS);
      lp = program(gl, LENS_VS, LENS_FS);
    } catch {
      setFailed(true);
      return;
    }
    const N = items.length;
    const [br, bgc, bb] = hexRgb(bg);

    // Unit quad shared by both passes.
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), gl.STATIC_DRAW);
    const U = (p: WebGLProgram, n: string) => gl.getUniformLocation(p, n);
    const uq = { rect: U(qp, "uRect"), view: U(qp, "uView"), tex: U(qp, "uTex"), tile: U(qp, "uTile"), alpha: U(qp, "uAlpha") };
    const ul = { scene: U(lp, "uScene"), res: U(lp, "uRes"), radius: U(lp, "uRadius"), fx: U(lp, "uFx"), time: U(lp, "uTime"), shimmer: U(lp, "uShimmer"), ring: U(lp, "uRing") };

    // Atlas of panels (4 columns).
    const cols = Math.min(4, N), rows = Math.ceil(N / cols), TW = 420, TH = 560;
    const atlasCanvas = document.createElement("canvas");
    atlasCanvas.width = cols * TW;
    atlasCanvas.height = rows * TH;
    const actx = atlasCanvas.getContext("2d")!;
    const atlas = gl.createTexture();
    const pushAtlas = () => {
      gl.bindTexture(gl.TEXTURE_2D, atlas);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlasCanvas);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };
    items.forEach((it, i) => {
      const x = (i % cols) * TW, y = Math.floor(i / cols) * TH;
      if (it.image) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const s = Math.max(TW / img.width, TH / img.height);
          actx.drawImage(img, x + (TW - img.width * s) / 2, y + (TH - img.height * s) / 2, img.width * s, img.height * s);
          pushAtlas();
        };
        img.src = it.image;
      }
      actx.drawImage(paintStudy(i * 2 + 5, TW, TH), x, y);
    });
    pushAtlas();
    const tileOf = (i: number) => [(i % cols) / cols, Math.floor(i / cols) / rows, 1 / cols, 1 / rows] as const;

    // Offscreen target for pass one.
    const fb = gl.createFramebuffer();
    const fbTex = gl.createTexture();
    let W = 1, H = 1, dpr = 1, PANEL_H = panelHeight;
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = Math.max(1, el.clientWidth);
      H = Math.max(1, el.clientHeight);
      PANEL_H = Math.max(120, Math.min(panelHeight, Math.round(H * 0.52)));
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      gl.bindTexture(gl.TEXTURE_2D, fbTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, cv.width, cv.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fbTex, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };
    resize();

    // ---------- state ----------
    const slot = () => PANEL_ASPECT * PANEL_H + gap;
    const total = () => slot() * N;
    let scroll = 0, target = 0, velocity = 0, energy = 0, prev = 0, lastInput = 0, snapped = true, lastCenter = -1;
    let dragging = false, dragX = 0, dragDist = 0, dragVel = 0, dragT = 0, suppress = false, dragType = "mouse";
    let hover = false, pmx = -1, pmy = -1, inside = false;
    const focus = { on: false, fx: entry && !reduced ? 0 : 1, scale: 1, index: -1 };
    const drop = new Float32Array(N * 7);
    const rise = new Float32Array(N * 7).fill(entry && !reduced ? 0 : 1);
    const grow = new Float32Array(N * 7).fill(entry && !reduced ? 0 : 1);
    let entering = entry && !reduced;
    const tweens: Tween[] = [];
    const tween = (get: () => number, set: (v: number) => void, to: number, dur: number, delay: number, ease: Ease, done?: () => void) =>
      tweens.push({ get, set, to, start: performance.now() + delay * 1000, dur: dur * 1000, ease, done });

    const nearest = (v: number) => Math.round(v / slot());
    const centreOf = (k: number) => k * slot();
    const srcOf = (k: number) => ((k % N) + N) % N;
    // Per-panel animation state is keyed by absolute slot, so it survives scrolling.
    const M = N * 7;
    const slotOf = (k: number) => ((k % M) + M) % M;

    type Drawn = { k: number; src: number; x: number; y: number; w: number; h: number; slotIdx: number };
    let drawn: Drawn[] = [];
    const layout = () => {
      drawn = [];
      const s = slot();
      const shrink = 1 - 0.25 * energy;
      const first = Math.floor((scroll - W / 2) / s) - 1, last = Math.ceil((scroll + W / 2) / s) + 1;
      const kc = nearest(scroll);
      for (let k = first; k <= last; k++) {
        const slotIdx = slotOf(k);
        const src = srcOf(k);
        let h = PANEL_H * shrink;
        let x = k * s - scroll;
        let y = 0;
        if (focus.on && k === focus.index) h *= focus.scale;
        else y = -(drop[slotIdx] || 0) * H * 1.4;
        if (entering || grow[slotIdx] < 1) {
          // During the intro, pack panels round the centre by their current heights.
          const gh = (j: number) => 80 + (PANEL_H - 80) * grow[slotOf(j)];
          let off = 0;
          const di = k - kc;
          for (let j = 0; j < Math.abs(di); j++) {
            const a = kc + Math.sign(di) * j, b = a + Math.sign(di);
            off += Math.sign(di) * ((PANEL_ASPECT * gh(a) + PANEL_ASPECT * gh(b)) / 2 + gap);
          }
          x = off + (kc * s - scroll);
          h = gh(k);
          y = -H * 0.9 * (1 - rise[slotIdx]);
        }
        const w = h * PANEL_ASPECT;
        if (x + w / 2 < -W / 2 - 20 || x - w / 2 > W / 2 + 20) continue;
        drawn.push({ k, src, x, y, w, h, slotIdx });
      }
    };

    const centred = () => drawn.reduce<Drawn | null>((b, d) => (!b || Math.abs(d.x) < Math.abs(b.x) ? d : b), null);
    const hit = (mx: number, my: number) => {
      const x = mx - W / 2, y = H / 2 - my;
      return drawn.find((d) => Math.abs(x - d.x) <= d.w / 2 && Math.abs(y - d.y) <= d.h / 2) ?? null;
    };

    // ---------- render ----------
    const render = (now: number) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.viewport(0, 0, cv.width, cv.height);
      gl.clearColor(br, bgc, bb, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(qp);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      const la = gl.getAttribLocation(qp, "a");
      gl.enableVertexAttribArray(la);
      gl.vertexAttribPointer(la, 2, gl.FLOAT, false, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, atlas);
      gl.uniform1i(uq.tex, 0);
      gl.uniform2f(uq.view, W, H);
      for (const d of drawn) {
        gl.uniform4f(uq.rect, d.x, d.y, d.w, d.h);
        gl.uniform4f(uq.tile, ...tileOf(d.src));
        gl.uniform1f(uq.alpha, 1);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      gl.disable(gl.BLEND);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.useProgram(lp);
      const lla = gl.getAttribLocation(lp, "a");
      gl.enableVertexAttribArray(lla);
      gl.vertexAttribPointer(lla, 2, gl.FLOAT, false, 0, 0);
      gl.bindTexture(gl.TEXTURE_2D, fbTex);
      gl.uniform1i(ul.scene, 0);
      gl.uniform2f(ul.res, cv.width, cv.height);
      const lensH = PANEL_H * 0.5 * 0.985, lensW = Math.min(W * 0.46, PANEL_H * PANEL_ASPECT * 0.5 * 1.32);
      gl.uniform2f(ul.radius, lensW * dpr, lensH * dpr);
      gl.uniform1f(ul.fx, focus.fx);
      gl.uniform1f(ul.time, now / 1000);
      gl.uniform1f(ul.shimmer, reduced ? 0 : 1);
      gl.uniform3f(ul.ring, 0, 0.616, 1);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    // ---------- loop ----------
    let raf = 0, visible = true, alive = true;
    const tick = (now: number) => {
      raf = 0;
      if (!alive || !visible || document.hidden) return;
      for (let i = tweens.length - 1; i >= 0; i--) {
        const t = tweens[i];
        if (now < t.start) continue;
        if (t.from === undefined) t.from = t.get();
        const k = Math.min(1, (now - t.start) / Math.max(1, t.dur));
        t.set(t.from + (t.to - t.from) * t.ease(k));
        if (k >= 1) {
          tweens.splice(i, 1);
          t.done?.();
        }
      }
      if (!dragging) {
        target += velocity;
        velocity *= 0.865;
        if (Math.abs(velocity) < 0.05) velocity = 0;
        if (!snapped && !focus.on && performance.now() - lastInput > 120) {
          target = centreOf(nearest(scroll));
          snapped = true;
        }
      }
      const follow = dragging && dragType !== "mouse" ? 0.22 : reduced ? 0.28 : snapped ? 0.05 : 0.09;
      scroll += (target - scroll) * follow;
      const speed = Math.abs(scroll - prev);
      prev = scroll;
      const n = Math.min(1, speed / 60);
      energy += (n - energy) * (n > energy ? 0.25 : 0.06);
      layout();
      const c = srcOf(nearest(scroll));
      if (c !== lastCenter) {
        lastCenter = c;
        setActive(c);
        cb.current?.(c);
      }
      if (inside && dragType === "mouse" && !dragging) {
        const h = !focus.on && !entering && !!hit(pmx, pmy);
        if (h !== hover) {
          hover = h;
          el.dataset.hover = h ? "" : "x";
          if (!h) delete el.dataset.hover;
        }
      }
      render(now);
      raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!raf && alive) raf = requestAnimationFrame(tick);
    };

    // ---------- focus ----------
    const ranked = (fromK: number) =>
      drawn.filter((d) => d.k !== fromK).map((d) => ({ d, r: Math.abs(d.k - fromK) })).sort((a, b) => a.r - b.r);
    const open = () => {
      const c = centred();
      if (!c || focus.on) return;
      focus.on = true;
      focus.index = c.k;
      target = centreOf(c.k);
      tween(() => focus.fx, (v) => (focus.fx = v), 0, 0.85, 0, E.out3);
      tween(() => focus.scale, (v) => (focus.scale = v), 1.18, 0.9, 0, E.out3);
      for (const { d, r } of ranked(c.k)) tween(() => drop[d.slotIdx], (v) => (drop[d.slotIdx] = v), 1, 0.7, (r - 1) * 0.06, E.out4);
      setFocused(true);
      wake();
    };
    const close = () => {
      if (!focus.on) return;
      const list = ranked(focus.index).reverse();
      tween(() => focus.fx, (v) => (focus.fx = v), 1, 0.68, 0, E.inOut3);
      tween(() => focus.scale, (v) => (focus.scale = v), 1, 0.76, 0, E.out3, () => {
        focus.on = false;
      });
      const maxR = list[0]?.r ?? 0;
      for (const { d, r } of list) tween(() => drop[d.slotIdx], (v) => (drop[d.slotIdx] = v), 0, 0.6, (maxR - r) * 0.042, E.out4);
      setFocused(false);
      wake();
    };
    const step = (dir: number) => {
      if (focus.on || entering) return;
      velocity = 0;
      target = centreOf(nearest(scroll) + dir);
      snapped = true;
      lastInput = performance.now();
      wake();
    };
    engine.current = { next: () => step(1), prev: () => step(-1), close };

    // ---------- intro ----------
    if (entering) {
      layout();
      const vis = drawn.map((d) => d.slotIdx);
      const spread = 0.07 * Math.max(vis.length - 1, 1);
      let riseEnd = 0;
      vis.forEach((s) => {
        const at = 0.5 + Math.random() * spread;
        riseEnd = Math.max(riseEnd, at + 1);
        tween(() => rise[s], (v) => (rise[s] = v), 1, 1, at, E.out3);
      });
      const growStart = riseEnd + 0.25;
      tween(() => focus.fx, (v) => (focus.fx = v), 1, 1.4, growStart, E.inOut3);
      const maxR = Math.max(...drawn.map((d) => Math.abs(d.k - nearest(scroll))));
      let growEnd = growStart;
      for (const d of drawn) {
        const at = growStart + (maxR - Math.abs(d.k - nearest(scroll))) * 0.085;
        growEnd = Math.max(growEnd, at + 2.15);
        tween(() => grow[d.slotIdx], (v) => (grow[d.slotIdx] = v), 1, 2.15, at, E.expoInOut);
      }
      setTimeout(() => {
        rise.fill(1);
        grow.fill(1);
        entering = false;
        setShown(true);
      }, growEnd * 1000 + 30);
    }

    // ---------- input ----------
    const local = (e: PointerEvent | MouseEvent) => {
      const r = el.getBoundingClientRect();
      const k = r.width / el.offsetWidth || 1;
      return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k };
    };
    const onWheel = (e: WheelEvent) => {
      if (focus.on || entering) return;
      e.preventDefault();
      target += (e.deltaY || e.deltaX) * 1.4;
      lastInput = performance.now();
      snapped = false;
      wake();
    };
    const onDown = (e: PointerEvent) => {
      suppress = false;
      if (focus.on || entering || (e.pointerType === "mouse" && e.button !== 0)) return;
      dragging = true;
      dragType = e.pointerType || "mouse";
      cv.setPointerCapture(e.pointerId);
      dragX = local(e).x;
      dragDist = 0;
      dragVel = 0;
      dragT = performance.now();
      velocity = 0;
      snapped = false;
      el.dataset.dragging = "";
      wake();
    };
    const onMove = (e: PointerEvent) => {
      const p = local(e);
      pmx = p.x;
      pmy = p.y;
      inside = true;
      if (cursor.current && e.pointerType === "mouse") cursor.current.style.translate = `${p.x}px ${p.y}px`;
      if (dragging) {
        const sens = dragType === "mouse" ? 1.6 : 1;
        const dx = p.x - dragX;
        dragX = p.x;
        dragDist += Math.abs(dx);
        target -= dx * sens;
        dragVel = dragVel * 0.6 - dx * sens * 0.4;
        dragT = lastInput = performance.now();
      }
      wake();
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      delete el.dataset.dragging;
      velocity = performance.now() - dragT > 90 ? 0 : dragVel;
      lastInput = performance.now();
      suppress = dragDist > (dragType === "mouse" ? 6 : 12);
      wake();
    };
    const onLeave = () => {
      inside = false;
      hover = false;
      delete el.dataset.hover;
    };
    const onClick = (e: MouseEvent) => {
      if (suppress) return void (suppress = false);
      if (focus.on || entering) return;
      const p = local(e);
      const h = hit(p.x, p.y);
      if (!h) return;
      const c = centred();
      if (c && h.k === c.k) return open();
      velocity = 0;
      target = centreOf(h.k);
      snapped = true;
      wake();
    };
    cv.addEventListener("wheel", onWheel, { passive: false });
    cv.addEventListener("pointerdown", onDown);
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerup", onUp);
    cv.addEventListener("pointercancel", onUp);
    cv.addEventListener("pointerleave", onLeave);
    cv.addEventListener("click", onClick);
    const ro = new ResizeObserver(() => {
      resize();
      target = scroll = centreOf(nearest(scroll));
      wake();
    });
    ro.observe(el);
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible) wake();
    });
    io.observe(el);
    const onVis = () => !document.hidden && wake();
    document.addEventListener("visibilitychange", onVis);
    wake();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      cv.removeEventListener("wheel", onWheel);
      cv.removeEventListener("pointerdown", onDown);
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerup", onUp);
      cv.removeEventListener("pointercancel", onUp);
      cv.removeEventListener("pointerleave", onLeave);
      cv.removeEventListener("click", onClick);
      engine.current = null;
    };
  }, [items, panelHeight, gap, bg, entry, motion]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") engine.current?.next();
    else if (e.key === "ArrowLeft") engine.current?.prev();
    else if (e.key === "Escape") engine.current?.close();
    else return;
    e.preventDefault();
  };

  const current = items[active] ?? items[0];
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      ref={host}
      className={`gc gc--${theme} ${className}`}
      style={{ background: bg, ...style }}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-labelledby={labelId}
      onKeyDown={onKeyDown}
      data-shown={shown ? "" : undefined}
      data-focused={focused ? "" : undefined}
    >
      <p id={labelId} className="gc__sr">
        Project carousel. Use the left and right arrow keys to move, and Escape to close a focused project.
      </p>
      <p className="gc__sr" aria-live="polite">
        {current?.title}, {pad(active + 1)} of {pad(items.length)}
        {focused ? ", focused" : ""}
      </p>
      {failed ? (
        <ul className="gc__fallback">
          {items.map((it, i) => (
            <li key={it.title}>
              {fallbackImgs[i] && <img src={fallbackImgs[i]} alt="" />}
              <span>{it.title}</span>
            </li>
          ))}
        </ul>
      ) : (
        <canvas ref={canvas} className="gc__canvas" aria-hidden="true" />
      )}
      <p className="gc__title" aria-hidden="true">
        {current?.title}
      </p>
      <p className="gc__count" aria-hidden="true">
        {pad(active + 1)}/{pad(items.length)}
      </p>
      <div ref={cursor} className="gc__cursor" aria-hidden="true">
        View
      </div>
      <button type="button" className="gc__close" onClick={() => engine.current?.close()} tabIndex={focused ? 0 : -1}>
        Close
      </button>
    </div>
  );
}
