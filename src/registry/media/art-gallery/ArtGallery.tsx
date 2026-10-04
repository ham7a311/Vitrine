"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { paintStudy } from "./studies";
import "./art-gallery.css";

/**
 * Art Gallery
 * An endless wall of framed studies seen through a lens. Drag to travel; the wall pulls back
 * while you drag and settles when you let go. One full-screen fragment shader draws the grid,
 * the barrel distortion, the frames and the captions from two texture atlases.
 */

export type GalleryItem = { title: string; year: string | number };

const DEFAULT_ITEMS: GalleryItem[] = [
  { title: "Salt Line", year: 2026 }, { title: "Low Tide", year: 2025 }, { title: "Dhow at Rest", year: 2024 },
  { title: "Second Light", year: 2026 }, { title: "Wadi Study", year: 2023 }, { title: "Heat Shimmer", year: 2025 },
  { title: "Frankincense", year: 2024 }, { title: "Blue Hour", year: 2026 }, { title: "Ridge No. 4", year: 2023 },
  { title: "Date Palm", year: 2025 }, { title: "Lantern", year: 2024 }, { title: "Monsoon", year: 2026 },
  { title: "Copper Leaf", year: 2022 }, { title: "Quiet Field", year: 2025 }, { title: "Corniche", year: 2024 },
  { title: "Tin Roof", year: 2023 }, { title: "Falaj", year: 2026 }, { title: "Night Market", year: 2025 },
  { title: "Basalt", year: 2022 }, { title: "Pearl Diver", year: 2024 }, { title: "Shade Map", year: 2026 },
  { title: "Old Port", year: 2023 }, { title: "Rose Water", year: 2025 }, { title: "Sand Script", year: 2024 },
  { title: "Last Ferry", year: 2026 },
];

type Theme = "night" | "paper";
const THEMES: Record<Theme, { bg: [number, number, number]; border: [number, number, number, number]; text: string; hover: [number, number, number, number] }> = {
  night: { bg: [0, 0, 0], border: [1, 1, 1, 0.15], text: "#8a8a8a", hover: [1, 1, 1, 0.05] },
  paper: { bg: [0.957, 0.941, 0.91], border: [0.1, 0.09, 0.08, 0.14], text: "#6b655c", hover: [0.1, 0.09, 0.08, 0.04] },
};

const VERT = `attribute vec2 p; varying vec2 vUv; void main(){ vUv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `precision highp float;
uniform vec2 uOffset, uRes, uMouse;
uniform vec4 uBorder, uHover;
uniform vec3 uBg;
uniform float uZoom, uCell, uCount, uAtlas;
uniform sampler2D uImages, uText;
varying vec2 vUv;

vec2 toWorld(vec2 screen) {
  float r = length(screen);
  vec2 d = screen * (1.0 - 0.08 * r * r);
  return d * vec2(uRes.x / uRes.y, 1.0) * uZoom + uOffset;
}

void main() {
  vec2 screen = (vUv - 0.5) * 2.0;
  float radius = length(screen);
  vec2 cellPos = toWorld(screen) / uCell;
  vec2 cellId = floor(cellPos);
  vec2 uv = fract(cellPos);

  vec3 bg = uBg;
  if (uMouse.x >= 0.0) {
    vec2 m = uMouse / uRes * 2.0 - 1.0;
    m.y = -m.y;
    vec2 mCell = floor(toWorld(m) / uCell);
    float h = 1.0 - smoothstep(0.4, 0.7, length(cellId - mCell));
    bg = mix(bg, uHover.rgb, h * uHover.a);
  }

  float lw = 0.005;
  float grid = smoothstep(0.0, lw, uv.x) * smoothstep(0.0, lw, 1.0 - uv.x) * smoothstep(0.0, lw, uv.y) * smoothstep(0.0, lw, 1.0 - uv.y);

  float idx = mod(cellId.x + cellId.y * uAtlas, uCount);
  idx = idx < 0.0 ? idx + uCount : idx;
  vec2 tile = vec2(mod(idx, uAtlas), floor(idx / uAtlas));

  vec3 col = bg;
  vec2 iuv = (uv - 0.2) / 0.6;
  vec2 im = smoothstep(-0.01, 0.01, iuv) * smoothstep(-0.01, 0.01, 1.0 - iuv);
  if (iuv.x >= 0.0 && iuv.x <= 1.0 && iuv.y >= 0.0 && iuv.y <= 1.0) {
    vec2 a = (tile + vec2(iuv.x, 1.0 - iuv.y)) / uAtlas;
    col = mix(col, texture2D(uImages, a).rgb, im.x * im.y);
  }
  if (uv.x >= 0.05 && uv.x <= 0.95 && uv.y >= 0.05 && uv.y <= 0.13) {
    vec2 t = vec2((uv.x - 0.05) / 0.9, 1.0 - (uv.y - 0.05) / 0.08);
    vec4 tc = texture2D(uText, (tile + t) / uAtlas);
    col = mix(col, tc.rgb, tc.a);
  }
  col = mix(col, uBorder.rgb, (1.0 - grid) * uBorder.a);
  float fade = 1.0 - smoothstep(1.2, 1.8, radius);
  gl_FragColor = vec4(mix(uBg, col, fade), 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
  return s;
}

function upload(gl: WebGLRenderingContext, unit: number, src: TexImageSource) {
  const t = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return t;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    if (/^https?:/.test(src)) img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** Square-crop a source into a tile of the atlas. */
function drawCover(ctx: CanvasRenderingContext2D, src: CanvasImageSource & { width: number; height: number }, x: number, y: number, s: number) {
  const k = Math.min(src.width, src.height);
  ctx.drawImage(src, (src.width - k) / 2, (src.height - k) / 2, k, k, x, y, s, s);
}

type Props = {
  /** Your own image URLs. Leave empty to paint generative studies. */
  images?: string[];
  items?: GalleryItem[];
  /** World units per cell; smaller shows more frames. */
  cellSize?: number;
  /** How far the wall pulls back while dragging. */
  zoomLevel?: number;
  theme?: Theme;
  showHint?: boolean;
  motion?: "full" | "reduced";
  label?: string;
  className?: string;
  style?: CSSProperties;
};

export function ArtGallery({ images, items = DEFAULT_ITEMS, cellSize = 0.75, zoomLevel = 1.25, theme = "night", showHint = true, motion = "full", label = "Art gallery", className = "", style }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [moved, setMoved] = useState(false);
  const count = images?.length || items.length;

  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv) return;
    const gl = cv.getContext("webgl", { antialias: true, alpha: false });
    if (!gl) {
      setFailed(true);
      return;
    }
    const reduced = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const T = THEMES[theme];
    let cancelled = false, raf = 0, visible = true;
    const st = { ox: 0, oy: 0, tx: 0, ty: 0, z: 1, tz: 1, vx: 0, vy: 0, mx: -1, my: -1, drag: false, px: 0, py: 0, lastT: 0 };
    const lerp = reduced ? 1 : 0.075;
    const dragZoom = reduced ? 1 : zoomLevel;

    let prog: WebGLProgram;
    const U: Record<string, WebGLUniformLocation | null> = {};
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      gl.useProgram(prog);
    } catch {
      setFailed(true);
      return;
    }
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    for (const n of ["uOffset", "uRes", "uMouse", "uBorder", "uHover", "uBg", "uZoom", "uCell", "uCount", "uAtlas", "uImages", "uText"]) U[n] = gl.getUniformLocation(prog, n);

    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const w = el.clientWidth, h = el.clientHeight;
      cv.width = Math.max(1, Math.round(w * dpr));
      cv.height = Math.max(1, Math.round(h * dpr));
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(U.uRes, cv.width, cv.height);
    };

    const draw = () => {
      gl.uniform2f(U.uOffset, st.ox, st.oy);
      gl.uniform1f(U.uZoom, st.z);
      const dpr = cv.width / Math.max(1, el.clientWidth);
      gl.uniform2f(U.uMouse, st.mx < 0 ? -1 : st.mx * dpr, st.my < 0 ? -1 : st.my * dpr);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const tick = () => {
      raf = 0;
      if (!visible || document.hidden) return;
      if (!st.drag && (st.vx || st.vy)) {
        st.tx += st.vx;
        st.ty += st.vy;
        st.vx *= 0.92;
        st.vy *= 0.92;
        if (Math.abs(st.vx) + Math.abs(st.vy) < 1e-5) st.vx = st.vy = 0;
      }
      st.ox += (st.tx - st.ox) * lerp;
      st.oy += (st.ty - st.oy) * lerp;
      st.z += (st.tz - st.z) * lerp;
      draw();
      const moving = Math.abs(st.tx - st.ox) + Math.abs(st.ty - st.oy) + Math.abs(st.tz - st.z) > 1e-5 || st.vx || st.vy;
      if (moving) raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!raf && !cancelled) raf = requestAnimationFrame(tick);
    };

    const local = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const k = r.width / el.offsetWidth || 1;
      return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k };
    };
    const onDown = (e: PointerEvent) => {
      if (e.button > 0) return;
      el.setPointerCapture(e.pointerId);
      const p = local(e);
      st.drag = true;
      st.px = p.x;
      st.py = p.y;
      st.vx = st.vy = 0;
      st.lastT = performance.now();
      el.dataset.dragging = "";
    };
    const onMove = (e: PointerEvent) => {
      const p = local(e);
      if (e.pointerType === "mouse") {
        st.mx = p.x;
        st.my = p.y;
      }
      if (st.drag) {
        const dx = p.x - st.px, dy = p.y - st.py;
        if (Math.abs(dx) + Math.abs(dy) > 2) {
          st.tz = dragZoom;
          setMoved(true);
        }
        const k = 2 / el.clientHeight;
        st.tx -= dx * k;
        st.ty += dy * k;
        const now = performance.now(), dt = Math.max(1, now - st.lastT);
        st.vx = (-dx * k * 16) / dt;
        st.vy = (dy * k * 16) / dt;
        st.lastT = now;
        st.px = p.x;
        st.py = p.y;
      }
      wake();
    };
    const onUp = () => {
      if (!st.drag) return;
      st.drag = false;
      st.tz = 1;
      delete el.dataset.dragging;
      if (performance.now() - st.lastT > 80 || reduced) st.vx = st.vy = 0;
      wake();
    };
    const onLeave = () => {
      st.mx = st.my = -1;
      wake();
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const k = 2 / el.clientHeight;
      st.tx += e.deltaX * k;
      st.ty -= e.deltaY * k;
      setMoved(true);
      wake();
    };
    const onKey = (e: KeyboardEvent) => {
      const step = cellSize * (e.shiftKey ? 3 : 1);
      const d: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
      const v = d[e.key];
      if (!v) return;
      e.preventDefault();
      st.tx += v[0];
      st.ty += v[1];
      setMoved(true);
      wake();
    };

    // Build the atlases off the first frame, so the loader can paint first.
    const build = async () => {
      const n = count, atlas = Math.ceil(Math.sqrt(n));
      const tileSize = Math.min(384, Math.floor(4096 / atlas));
      const ic = document.createElement("canvas");
      ic.width = ic.height = atlas * tileSize;
      const ictx = ic.getContext("2d")!;
      ictx.fillStyle = "#111";
      ictx.fillRect(0, 0, ic.width, ic.height);
      const loaded = images?.length ? await Promise.all(images.map(loadImage)) : null;
      for (let i = 0; i < n; i++) {
        const x = (i % atlas) * tileSize, y = Math.floor(i / atlas) * tileSize;
        const src = loaded?.[i] ?? paintStudy(i + 1, tileSize, tileSize);
        drawCover(ictx, src, x, y, tileSize);
        if (i % 6 === 5) await new Promise((r) => setTimeout(r));
        if (cancelled) return;
      }
      // Captions: one wide strip per tile; the shader samples it over the caption row.
      const tw = Math.min(1024, Math.floor(4096 / atlas)), th = Math.round(tw / 11.25);
      const tc = document.createElement("canvas");
      tc.width = atlas * tw;
      tc.height = atlas * th;
      const tctx = tc.getContext("2d")!;
      tctx.fillStyle = T.text;
      tctx.textBaseline = "middle";
      tctx.font = `500 ${Math.round(th * 0.42)}px "Geist Mono", ui-monospace, monospace`;
      for (let i = 0; i < n; i++) {
        const it = items[i % items.length] ?? { title: `Study ${i + 1}`, year: "" };
        const x = (i % atlas) * tw, y = Math.floor(i / atlas) * th + th / 2;
        tctx.textAlign = "left";
        tctx.fillText(String(it.title).toUpperCase(), x + 4, y);
        tctx.textAlign = "right";
        tctx.fillText(String(it.year), x + tw - 4, y);
      }
      // The text atlas is laid out in strips but sampled per tile, so stretch it into a square grid.
      const tq = document.createElement("canvas");
      tq.width = tq.height = atlas * 512;
      const tqx = tq.getContext("2d")!;
      tqx.imageSmoothingQuality = "high";
      for (let i = 0; i < atlas * atlas; i++) {
        const cx = i % atlas, cy = Math.floor(i / atlas);
        tqx.drawImage(tc, cx * tw, cy * th, tw, th, cx * 512, cy * 512, 512, 512);
      }
      if (cancelled) return;
      upload(gl, 0, ic);
      upload(gl, 1, tq);
      gl.uniform1i(U.uImages, 0);
      gl.uniform1i(U.uText, 1);
      gl.uniform1f(U.uCount, n);
      gl.uniform1f(U.uAtlas, atlas);
      gl.uniform1f(U.uCell, cellSize);
      gl.uniform3f(U.uBg, ...T.bg);
      gl.uniform4f(U.uBorder, ...T.border);
      gl.uniform4f(U.uHover, ...T.hover);
      size();
      draw();
      setReady(true);
    };

    const ro = new ResizeObserver(() => {
      size();
      draw();
    });
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) wake();
    });
    io.observe(el);
    const onVis = () => !document.hidden && wake();
    const onLost = (e: Event) => {
      e.preventDefault();
      setFailed(true);
    };
    cv.addEventListener("webglcontextlost", onLost);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVis);
    const t = setTimeout(build, 30);

    return () => {
      cancelled = true;
      clearTimeout(t);
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      cv.removeEventListener("webglcontextlost", onLost);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [images, items, cellSize, zoomLevel, theme, motion, count]);

  const list = Array.from({ length: count }, (_, i) => items[i % items.length]);

  return (
    <div
      ref={host}
      className={`ag ag--${theme} ${className}`}
      style={style}
      tabIndex={0}
      role="region"
      aria-roledescription="gallery"
      aria-label={`${label}. Drag, scroll or use the arrow keys to move around.`}
      data-ready={ready ? "" : undefined}
    >
      {failed ? (
        <ul className="ag__fallback" aria-label={label}>
          {list.map((it, i) => (
            <li key={i}>
              <span>{it.title}</span>
              <span>{it.year}</span>
            </li>
          ))}
        </ul>
      ) : (
        <canvas ref={canvas} className="ag__canvas" aria-hidden="true" />
      )}
      {!ready && !failed && (
        <div className="ag__loader" role="status">
          <svg aria-hidden="true" width="0" height="0" className="absolute">
            <filter id="ag-goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b" />
              <feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" />
            </filter>
          </svg>
          <span className="ag__goo" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="ag__sr">Hanging the studies…</span>
        </div>
      )}
      {ready && showHint && <p className="ag__hint" data-gone={moved ? "" : undefined} aria-hidden="true">Drag to explore</p>}
      {!failed && (
        <ul className="ag__sr">
          {list.map((it, i) => (
            <li key={i}>
              {it.title}, {it.year}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
