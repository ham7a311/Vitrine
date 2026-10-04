"use client";

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import "./ledger-cylinder.css";

/**
 * Ledger Cylinder
 * A scroll-driven stats section. Giant condensed type is painted onto the
 * inside wall of a cylinder and the camera sits just behind its axis, so as
 * you scroll the ring turns and the side walls loom toward you. Rendering
 * happens only on scroll — there is no idle animation loop.
 */

export type LedgerStat = { value: string; label: string; color: string };

type Props = {
  stats: LedgerStat[];
  /** Mono side notes, e.g. what the team is working on. */
  notes: { label: string; items: string[]; color: string };
  /** Terminal-style status lines, e.g. ["> uptime: 412 days", "> status: shipping"]. */
  status: { lines: string[]; color: string };
  /** Scroll container to track instead of the window (e.g. inside a preview frame). */
  scrollRoot?: RefObject<HTMLElement | null>;
  background?: string;
};

const TRAVEL = 0.88; // share of the scroll spent turning; the rest holds on the last block
const CAM_Z = 0.3; // camera distance behind the cylinder axis
const FONT = "Anton";

const VERTEX = `attribute vec2 aPos; varying vec2 vUv; void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAGMENT = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uStrip;
uniform vec2 uRes;
uniform float uOffset;   // rotation, as a fraction of the ring
uniform float uBand;     // strip height in world units (radius = 1)
uniform float uCamZ;     // camera distance behind the axis
uniform float uTanF;     // tan(vertical half fov)
const float PI = 3.14159265;
void main() {
  vec2 ndc = vUv * 2.0 - 1.0;
  float aspect = uRes.x / uRes.y;
  vec3 ro = vec3(0.0, 0.0, uCamZ);
  vec3 rd = normalize(vec3(ndc.x * aspect * uTanF, ndc.y * uTanF, -1.0));
  float a = rd.x * rd.x + rd.z * rd.z;
  float b = 2.0 * (ro.x * rd.x + ro.z * rd.z);
  float c = ro.x * ro.x + ro.z * ro.z - 1.0;
  float t = (-b + sqrt(max(b * b - 4.0 * a * c, 0.0))) / (2.0 * a);
  vec3 hit = ro + rd * t;
  float phi = atan(hit.x, -hit.z);
  float u = phi / (2.0 * PI) + 0.5 + uOffset;
  float v = hit.y / uBand + 0.5;
  if (u < 0.0 || u > 1.0 || v < 0.0 || v > 1.0) discard;
  vec4 texel = texture2D(uStrip, vec2(u, 1.0 - v));
  float ends = smoothstep(0.0, 0.015, u) * smoothstep(1.0, 0.985, u);
  float fade = 1.0 - smoothstep(1.55, 2.3, abs(phi));
  gl_FragColor = texel * fade * ends;
}`;

/** Largest band that stays inside the viewport at every column (side walls loom largest). */
function fitBand(band: number, aspect: number, tanF: number, camZ: number, margin = 0.9) {
  let limit = Infinity;
  for (let i = 0; i <= 20; i++) {
    const dx = (-1 + (i / 20) * 2) * aspect * tanF;
    const a = dx * dx + 1;
    const b = -2 * camZ;
    const c = camZ * camZ - 1;
    const t = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
    limit = Math.min(limit, 2 * margin * t * tanF);
  }
  return Math.min(band, limit);
}

/** One line of type, horizontally scaled to exactly `width`. */
function fitLine(ctx: CanvasRenderingContext2D, text: string, x: number, baseline: number, size: number, width: number, color: string) {
  ctx.font = `400 ${size}px ${FONT}`;
  const natural = ctx.measureText(text).width || 1;
  ctx.save();
  ctx.translate(x, baseline);
  ctx.scale(width / natural, 1);
  ctx.fillStyle = color;
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

type Block = { head: string; headScale?: number; labels: string[]; color: string };

/** Paint the ring once: each block is a headline over labels stretched to its width. */
function paintStrip(blocks: Block[], height: number) {
  const measure = document.createElement("canvas").getContext("2d")!;
  const bigSize = height * 0.62;
  const gap = height * 0.24;
  const layout = blocks.map((block) => {
    measure.font = `400 ${bigSize}px ${FONT}`;
    const headW = measure.measureText(block.head).width;
    measure.font = `400 ${height * 0.16}px ${FONT}`;
    const labelMin = Math.max(...block.labels.map((l) => measure.measureText(l).width * 0.5), 0);
    return { ...block, width: Math.min(Math.max(headW, labelMin, height * 0.5), height * 1.5) };
  });
  const total = layout.reduce((s, b) => s + b.width + gap, 0);
  const width = Math.min(8192, Math.ceil(total));
  const scale = width / total;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.textBaseline = "alphabetic";
  let x = (gap * scale) / 2;
  const centers: number[] = [];
  for (const block of layout) {
    const w = block.width * scale;
    const headBaseline = height * (block.headScale ? 0.42 : 0.6);
    fitLine(ctx, block.head, x, headBaseline, bigSize * (block.headScale || 1), w, block.color);
    const labelTop = headBaseline + height * 0.02;
    const each = (height - labelTop - height * 0.02) / Math.max(block.labels.length, 1);
    block.labels.forEach((label, i) => {
      fitLine(ctx, label, x, labelTop + each * (i + 1) - each * 0.08, Math.min(each * 0.95, height * 0.2), w, block.color);
    });
    centers.push((x + w / 2) / width);
    x += w + gap * scale;
  }
  return { canvas, centers, aspect: width / height };
}

export function LedgerCylinder({ stats, notes, status, scrollRoot, background = "#0e0d0b" }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [vh, setVh] = useState<number | null>(null);

  // Size the scroll track to the scroll root (window or a custom container).
  useEffect(() => {
    const root = scrollRoot?.current;
    if (!root) return;
    const ro = new ResizeObserver(() => setVh(root.clientHeight));
    ro.observe(root);
    return () => ro.disconnect();
  }, [scrollRoot]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = sectionRef.current;
    const host = hostRef.current;
    if (!section || !host) return;

    const canvas = document.createElement("canvas");
    canvas.className = "ledger__canvas";
    canvas.setAttribute("aria-hidden", "true");
    host.appendChild(canvas);
    const gl = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: "low-power" });
    if (!gl) {
      canvas.remove();
      return;
    }
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      canvas.remove();
      return;
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(program, n);
    const texture = gl.createTexture();

    let disposed = false;
    let raf = 0;
    let visible = false;
    let centers = [0.5];
    let baseBand = 1;
    let lastOffset: number | null = null;
    const scroller: HTMLElement | Window = scrollRoot?.current ?? window;

    const paint = () => {
      const narrow = host.clientWidth < 760;
      const blocks: Block[] = [
        ...stats.map((s) => ({ head: s.value, labels: [s.label.toUpperCase()], color: s.color })),
        { head: notes.label.toUpperCase(), headScale: 0.5, labels: notes.items.map((i) => i.toUpperCase()), color: notes.color },
        { head: status.lines[status.lines.length - 1].toUpperCase(), headScale: 0.42, labels: status.lines.slice(0, -1).map((l) => l.toUpperCase()), color: status.color },
      ];
      const strip = paintStrip(blocks, narrow ? 512 : 1024);
      centers = strip.centers;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, strip.canvas);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1i(u("uStrip"), 0);
      baseBand = ((2 * Math.PI) / strip.aspect) * (narrow ? 1.45 : 1.0); // taller, more condensed on narrow screens
      gl.uniform1f(u("uCamZ"), CAM_Z);
      lastOffset = null;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width === w && canvas.height === h) return false;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      return true;
    };

    const render = () => {
      raf = 0;
      if (disposed || !visible) return;
      const rect = section.getBoundingClientRect();
      const rootTop = scroller instanceof Window ? 0 : scroller.getBoundingClientRect().top;
      const rootH = scroller instanceof Window ? window.innerHeight : scroller.clientHeight;
      const span = Math.max(rect.height - rootH, 1);
      const p = Math.min(Math.max(-(rect.top - rootTop) / span, 0), 1);
      const travel = Math.min(p / TRAVEL, 1);
      const offset = centers[0] + (centers[centers.length - 1] - centers[0]) * travel - 0.5;
      const resized = resize();
      if (!resized && lastOffset !== null && Math.abs(offset - lastOffset) < 1e-5) return;
      lastOffset = offset;
      const aspect = canvas.width / canvas.height;
      const tanF = Math.max(0.7, (aspect < 1 ? 0.9 : 0.62) / aspect);
      gl.uniform2f(u("uRes"), canvas.width, canvas.height);
      gl.uniform1f(u("uTanF"), tanF);
      gl.uniform1f(u("uBand"), fitBand(baseBand, aspect, tanF, CAM_Z));
      gl.uniform1f(u("uOffset"), offset);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) schedule();
      },
      { root: scroller instanceof Window ? null : scroller, rootMargin: "10% 0px" },
    );
    const ro = new ResizeObserver(() => {
      lastOffset = null;
      schedule();
    });

    document.fonts.load(`400 200px ${FONT}`).then(() => {
      if (disposed) return;
      paint();
      setLive(true);
      io.observe(section);
      ro.observe(host);
      scroller.addEventListener("scroll", schedule, { passive: true });
    });

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      scroller.removeEventListener("scroll", schedule);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
      setLive(false);
    };
    // Repaint when content changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(stats), JSON.stringify(notes), JSON.stringify(status), scrollRoot]);

  const style = { background, ...(vh ? { "--ledger-vh": `${vh / 100}px` } : {}) } as CSSProperties;

  return (
    <section ref={sectionRef} className={`ledger ${live ? "ledger--live" : "ledger--static"}`} style={style}>
      <div className="ledger__stage">
        <div ref={hostRef} className="ledger__canvas-host" aria-hidden="true" />
        <div className="ledger__copy">
          <div className="ledger__stats" role="list" aria-label="Highlights">
            {stats.map(({ value, label, color }) => (
              <div key={label} className="ledger__stat" role="listitem" style={{ "--stat-color": color } as CSSProperties}>
                <span className="ledger__value">{value}</span>
                <span className="ledger__label">{label}</span>
              </div>
            ))}
          </div>
          <div className="ledger__notes">
            <div className="ledger__now">
              <span className="ledger__now-label" style={{ color: notes.color }}>
                {notes.label}
              </span>
              <ul className="ledger__now-list">
                {notes.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
            <div className="ledger__status" style={{ color: status.color }}>
              {status.lines.map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
