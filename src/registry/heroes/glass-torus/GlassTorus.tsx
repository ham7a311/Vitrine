"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./glass-torus.css";

/**
 * Glass Torus
 * A ring of thick glass turning slowly in front of huge type. The type is drawn to a texture;
 * a raymarched torus refracts it, splitting red, green and blue a little, so the letters seen
 * through the glass bend, flip and fringe. Drag to spin it.
 */

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;
const FRAG = `precision highp float;
uniform vec2 uRes; uniform sampler2D uText; uniform mat3 uRot; uniform vec3 uTint; uniform float uIor; uniform float uDisp; uniform float uRefl;

float sdTorus(vec3 p){ vec2 q = vec2(length(p.xz) - 0.62, p.y); return length(q) - 0.21; }
float map(vec3 p){ return sdTorus(uRot * p); }
vec3 normal(vec3 p){
  vec2 e = vec2(0.0015, 0.0);
  return normalize(vec3(map(p + e.xyy) - map(p - e.xyy), map(p + e.yxy) - map(p - e.yxy), map(p + e.yyx) - map(p - e.yyx)));
}
// soft studio: a bright strip overhead and a dim floor, for reflections
vec3 env(vec3 d){
  float top = smoothstep(0.2, 0.95, d.y);
  float side = pow(max(0.0, abs(d.x)), 6.0) * 0.6;
  return vec3(0.04) + vec3(1.0) * (top * 1.1 + side) ;
}
vec3 behind(vec2 uv){ return texture2D(uText, clamp(uv, 0.0, 1.0)).rgb; }

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec3 ro = vec3(0.0, 0.0, 3.2);
  vec3 rd = normalize(vec3(p * 1.5, -2.2));
  float t = 0.0, d = 1.0;
  for (int i = 0; i < 72; i++){ d = map(ro + rd * t); if (d < 0.0008 || t > 6.0) break; t += d; }
  vec3 col = behind(uv);
  if (d < 0.002){
    vec3 pos = ro + rd * t;
    vec3 n = normal(pos);
    float fres = pow(1.0 - max(dot(-rd, n), 0.0), 3.0);
    // Refract through the front face; the exit offset bends the type behind, a little more for blue.
    vec3 c;
    for (int k = 0; k < 3; k++){
      float ior = uIor + (float(k) - 1.0) * uDisp;
      vec3 r = refract(rd, n, 1.0 / ior);
      vec2 off = r.xy * 0.55 + n.xy * 0.12;
      float s = k == 0 ? behind(uv + off * vec2(uRes.y / uRes.x, 1.0)).r : k == 1 ? behind(uv + off * vec2(uRes.y / uRes.x, 1.0)).g : behind(uv + off * vec2(uRes.y / uRes.x, 1.0)).b;
      if (k == 0) c.r = s; else if (k == 1) c.g = s; else c.b = s;
    }
    c *= uTint;
    vec3 refl = env(reflect(rd, n));
    vec3 L = normalize(vec3(-0.4, 0.8, 0.6));
    float spec = pow(max(dot(reflect(-L, n), -rd), 0.0), 60.0);
    col = mix(c, refl, clamp(fres * uRefl + 0.04, 0.0, 1.0)) + spec * 0.9;
    // a dark core so the ring reads as solid glass even over black
    col += uTint * 0.02;
  }
  gl_FragColor = vec4(col, 1.0);
}`;

function rotation(yaw: number, pitch: number, roll: number) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch), cr = Math.cos(roll), sr = Math.sin(roll);
  // R = Rz(roll) · Rx(pitch) · Ry(yaw), column-major for WebGL
  const ry = [cy, 0, -sy, 0, 1, 0, sy, 0, cy];
  const rx = [1, 0, 0, 0, cp, sp, 0, -sp, cp];
  const rz = [cr, sr, 0, -sr, cr, 0, 0, 0, 1];
  const mul = (a: number[], b: number[]) => {
    const o = new Array(9).fill(0);
    for (let c = 0; c < 3; c++) for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) o[c * 3 + r] += a[k * 3 + r] * b[c * 3 + k];
    return o;
  };
  return new Float32Array(mul(rz, mul(rx, ry)));
}

export type TorusLook = { tint: [number, number, number]; ior: number; dispersion: number; reflect: number; ink: string; ground: string };

type Props = {
  lines?: string[];
  look?: TorusLook;
  motion?: "full" | "reduced";
  label?: string;
  className?: string;
  style?: CSSProperties;
};

const SMOKE: TorusLook = { tint: [0.82, 0.83, 0.87], ior: 1.45, dispersion: 0.03, reflect: 1, ink: "#ffffff", ground: "#000000" };

export function GlassTorus({ lines = ["GLASS", "ICON"], look = SMOKE, motion = "full", label, className = "", style }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(true);
  const [failed, setFailed] = useState(false);
  const ctl = useRef<{ play: (on: boolean) => void; reset: () => void } | null>(null);
  const linesKey = lines.join("\n");

  useEffect(() => {
    const el = host.current, cv = canvas.current;
    if (!el || !cv) return;
    const gl = cv.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return setFailed(true);
    const reduced = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = !matchMedia("(hover: hover) and (pointer: fine)").matches;
    const mk = (t: number, s: string) => {
      const sh = gl.createShader(t)!;
      gl.shaderSource(sh, s);
      gl.compileShader(sh);
      return sh;
    };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, mk(gl.VERTEX_SHADER, VERT));
    gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return setFailed(true);
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(pr, n);
    const u = { res: U("uRes"), text: U("uText"), rot: U("uRot") };
    gl.uniform3f(U("uTint"), ...look.tint);
    gl.uniform1f(U("uIor"), look.ior);
    gl.uniform1f(U("uDisp"), look.dispersion);
    gl.uniform1f(U("uRefl"), look.reflect);

    const tex = gl.createTexture();
    const textCanvas = document.createElement("canvas");
    const paintText = () => {
      const w = cv.width, h = cv.height;
      textCanvas.width = w;
      textCanvas.height = h;
      const x = textCanvas.getContext("2d")!;
      x.fillStyle = look.ground;
      x.fillRect(0, 0, w, h);
      x.fillStyle = look.ink;
      x.textAlign = "center";
      x.textBaseline = "middle";
      const ls = linesKey.split("\n");
      let size = Math.min(h / (ls.length * 1.02), w * 0.3);
      x.font = `800 ${size}px "Geist", "Hanken Grotesk", "Helvetica Neue", Arial, sans-serif`;
      const widest = Math.max(...ls.map((l) => x.measureText(l).width));
      if (widest > w * 0.86) {
        size *= (w * 0.86) / widest;
        x.font = `800 ${size}px "Geist", "Hanken Grotesk", "Helvetica Neue", Arial, sans-serif`;
      }
      ls.forEach((l, i) => x.fillText(l, w / 2, h / 2 + (i - (ls.length - 1) / 2) * size * 0.94));
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1i(u.text, 0);
    };

    const st = { yaw: 0.9, pitch: 0.18, vyaw: 0, vpitch: 0, drag: false, px: 0, py: 0, playing: true, raf: 0, last: 0, alive: true, visible: true };
    const size = () => {
      const k = Math.min(devicePixelRatio || 1, 2) * (coarse ? 0.55 : 0.8);
      cv.width = Math.max(1, Math.round(el.clientWidth * k));
      cv.height = Math.max(1, Math.round(el.clientHeight * k));
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(u.res, cv.width, cv.height);
      paintText();
    };
    const frame = () => {
      gl.uniformMatrix3fv(u.rot, false, rotation(st.yaw, st.pitch, Math.PI / 2 - 0.25));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const tick = (now: number) => {
      st.raf = 0;
      if (!st.alive || !st.visible || document.hidden) return;
      const dt = st.last ? Math.min(0.05, (now - st.last) / 1000) : 0.016;
      st.last = now;
      if (!st.drag) {
        st.yaw += st.vyaw * dt;
        st.pitch += st.vpitch * dt;
        st.vyaw *= Math.pow(0.12, dt);
        st.vpitch *= Math.pow(0.12, dt);
        if (st.playing) st.yaw += dt * 0.45;
        st.pitch += (0.18 - st.pitch) * Math.min(1, dt * 0.8);
      }
      frame();
      const moving = st.playing || st.drag || Math.abs(st.vyaw) + Math.abs(st.vpitch) > 0.01 || Math.abs(0.18 - st.pitch) > 0.002;
      if (moving) st.raf = requestAnimationFrame(tick);
      else st.last = 0;
    };
    const wake = () => {
      if (!st.raf && st.alive) st.raf = requestAnimationFrame(tick);
    };
    ctl.current = {
      play: (on) => {
        st.playing = on;
        wake();
      },
      reset: () => {
        st.yaw = 0.9;
        st.pitch = 0.18;
        st.vyaw = st.vpitch = 0;
        frame();
        wake();
      },
    };
    if (reduced) {
      st.playing = false;
      setPlaying(false);
    }
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      cv.setPointerCapture(e.pointerId);
      st.drag = true;
      st.px = e.clientX;
      st.py = e.clientY;
      st.vyaw = st.vpitch = 0;
      el.dataset.dragging = "";
      wake();
    };
    const onMove = (e: PointerEvent) => {
      if (!st.drag) return;
      const dx = e.clientX - st.px, dy = e.clientY - st.py;
      st.px = e.clientX;
      st.py = e.clientY;
      st.yaw += dx * 0.008;
      st.pitch += dy * 0.008;
      st.vyaw = dx * 0.5;
      st.vpitch = dy * 0.5;
      frame();
    };
    const onUp = () => {
      st.drag = false;
      delete el.dataset.dragging;
      wake();
    };
    cv.addEventListener("pointerdown", onDown);
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerup", onUp);
    cv.addEventListener("pointercancel", onUp);
    const ro = new ResizeObserver(() => {
      size();
      frame();
    });
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => {
      st.visible = e.isIntersecting;
      if (st.visible) wake();
    });
    io.observe(el);
    const onVis = () => !document.hidden && wake();
    document.addEventListener("visibilitychange", onVis);
    document.fonts.ready.then(() => st.alive && (paintText(), frame()));
    size();
    frame();
    wake();
    return () => {
      st.alive = false;
      cancelAnimationFrame(st.raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      cv.removeEventListener("pointerdown", onDown);
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerup", onUp);
      cv.removeEventListener("pointercancel", onUp);
    };
  }, [linesKey, look, motion]);

  const fullscreen = () => {
    const el = host.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  return (
    <div ref={host} className={`gtor ${className}`} style={{ background: look.ground, color: look.ink, ...style }}>
      {failed ? (
        <p className="gtor__fallback">
          {lines.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </p>
      ) : (
        <canvas ref={canvas} className="gtor__canvas" role="img" aria-label={label ?? `${lines.join(" ")}, seen through a turning glass ring`} />
      )}
      <h1 className="gtor__sr">{lines.join(" ")}</h1>
      <div className="gtor__bar gtor__bar--l">
        <button type="button" className="gtor__btn" onClick={fullscreen} aria-label="Toggle full screen">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 15v5h-5M4 4l6 6M20 20l-6-6" /></svg>
        </button>
      </div>
      <div className="gtor__bar gtor__bar--r">
        <button
          type="button"
          className="gtor__btn"
          aria-pressed={!playing}
          aria-label={playing ? "Pause rotation" : "Play rotation"}
          onClick={() => {
            const next = !playing;
            setPlaying(next);
            ctl.current?.play(next);
          }}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z" /></svg>
          )}
        </button>
        <button type="button" className="gtor__btn" aria-label="Reset the ring" onClick={() => ctl.current?.reset()}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4" /></svg>
        </button>
      </div>
    </div>
  );
}
