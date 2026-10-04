"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Mercury Glass
 * Drops of clear glass drifting over a fine printed pattern, bending it the
 * way a lens does — magnified in the middle, pulled hard at the rim, with a
 * bright edge where the glass is thinnest. The pointer is one more drop:
 * bring it near the others and they neck, merge and pull apart again.
 */

type Props = {
  /** Paper, ink and two band colours of the pattern behind the glass, and the glass tint (hex). */
  colors?: [string, string, string, string, string];
  speed?: number;
  className?: string;
  children?: ReactNode;
};

const BALLS = 6; // five drifting, one for the pointer

const VERT = `attribute vec2 p; varying vec2 v; void main(){ v = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
varying vec2 v;
uniform vec2 uRes;
uniform vec3 uB[${BALLS}]; // xy in aspect space, z = radius
uniform vec3 uPaper, uInk, uBandA, uBandB, uTint;

float field(vec2 p) {
  float f = 0.0;
  for (int i = 0; i < ${BALLS}; i++) { vec2 d = p - uB[i].xy; f += uB[i].z * uB[i].z / (dot(d, d) + 1e-4); }
  return f;
}
vec2 grad(vec2 p) {
  vec2 g = vec2(0.0);
  for (int i = 0; i < ${BALLS}; i++) { vec2 d = p - uB[i].xy; float q = dot(d, d) + 1e-4; g += -2.0 * uB[i].z * uB[i].z * d / (q * q); }
  return g;
}

// The print behind the glass: soft colour bands, fine diagonal hairlines and a dot grid.
vec3 print(vec2 p) {
  float band = 0.5 + 0.5 * sin(p.y * 5.0 + sin(p.x * 2.3) * 1.2);
  vec3 col = mix(uPaper, mix(uBandA, uBandB, band), 0.16 + 0.1 * band);
  float hair = smoothstep(0.9, 1.0, sin((p.x + p.y) * 170.0));
  col = mix(col, uInk, hair * 0.12);
  vec2 g = fract(p * 26.0) - 0.5;
  col = mix(col, uInk, smoothstep(0.085, 0.05, length(g)) * 0.32);
  return col;
}

void main() {
  float a = uRes.x / uRes.y;
  vec2 p = vec2(v.x * a, v.y);
  float f = field(p);
  float inside = smoothstep(0.96, 1.04, f);

  // e = 1/f is 1 at the rim and falls toward each centre; its slope is the lens.
  vec2 g = grad(p);
  // For one drop this is 2d/r², so scaling by ~r/2 makes it 0 at the centre and 1 at the rim.
  vec2 slope = -g / (f * f + 1e-4) * 0.066;
  float steep = clamp(length(slope), 0.0, 1.0);
  // Gentle magnification across the face, pulled hard in the last stretch before the rim.
  vec2 bend = -slope * (0.055 + 0.05 * pow(steep, 4.0));

  vec3 under = print(p);
  vec3 lens = vec3(print(p + bend * 1.04).r, print(p + bend).g, print(p + bend * 0.96).b);
  lens = mix(lens, lens * uTint, 0.1 + 0.4 * steep);

  // Light: a Fresnel rim where the glass is thinnest, and a highlight on the side facing the light.
  float rim = pow(steep, 6.0);
  float spec = pow(max(0.0, dot(normalize(slope + 1e-5), normalize(vec2(-0.6, 0.8)))), 8.0) * smoothstep(0.55, 0.85, steep);
  lens += rim * 0.28 + spec * 0.5;
  lens -= smoothstep(0.9, 1.0, steep) * (1.0 - spec) * 0.18; // a thin dark line right at the edge

  // A soft contact shadow, offset down and right, on the print outside the drops.
  float sh = smoothstep(0.35, 1.0, field(p - vec2(0.018, -0.03))) * (1.0 - inside);
  under *= 1.0 - sh * 0.1;

  vec3 col = mix(under, lens, inside);
  col += (fract(sin(dot(v * uRes, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0 * 2.0;
  gl_FragColor = vec4(col, 1.0);
}`;

const rgb = (hex: string) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255] as const;
};

export function MercuryGlass({ colors = ["#f3efe6", "#1b1a17", "#7c5cc4", "#d9733a", "#dfe9f2"], speed = 1, className = "", children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
    host.prepend(canvas);
    const gl = canvas.getContext("webgl", { antialias: false, powerPreference: "low-power" });
    if (!gl) { canvas.remove(); return; }

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const vs = sh(gl.VERTEX_SHADER, VERT);
    const fs = sh(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return () => canvas.remove();
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    (["uPaper", "uInk", "uBandA", "uBandB", "uTint"] as const).forEach((n, i) => gl.uniform3f(u(n), ...rgb(colors[i])));
    const uB = u("uB");

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = !matchMedia("(hover: hover) and (pointer: fine)").matches;
    const scale = Math.min(devicePixelRatio, coarse ? 0.8 : 1);
    const gap = coarse ? 33 : 16;
    // Each drop orbits its own point on two slow, unrelated sines.
    const drift = [
      { x: 0.22, y: 0.62, ax: 0.1, ay: 0.12, fx: 0.11, fy: 0.07, r: 0.13 },
      { x: 0.55, y: 0.3, ax: 0.14, ay: 0.08, fx: 0.06, fy: 0.09, r: 0.105 },
      { x: 0.78, y: 0.66, ax: 0.08, ay: 0.14, fx: 0.08, fy: 0.05, r: 0.15 },
      { x: 0.4, y: 0.82, ax: 0.16, ay: 0.06, fx: 0.05, fy: 0.1, r: 0.075 },
      { x: 0.9, y: 0.22, ax: 0.07, ay: 0.1, fx: 0.09, fy: 0.06, r: 0.09 },
    ];
    const data = new Float32Array(BALLS * 3);
    const ptr = { x: 0.5, y: 0.5, r: 0, tx: 0.5, ty: 0.5, tr: 0 };
    let raf = 0, last = 0, visible = true;
    const t0 = performance.now();

    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * scale));
      const h = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    const draw = (now: number) => {
      resize();
      const a = canvas.width / canvas.height;
      const t = reduced ? 12 : ((now - t0) / 1000) * speed;
      // Smaller screens get proportionally larger drops, so there are still a few in view.
      const k = a < 1 ? 0.75 : 1;
      drift.forEach((d, i) => {
        data[i * 3] = (d.x + d.ax * Math.sin(t * d.fx * 6.28 + i)) * a;
        data[i * 3 + 1] = d.y + d.ay * Math.cos(t * d.fy * 6.28 + i * 2);
        data[i * 3 + 2] = d.r * k;
      });
      ptr.x += (ptr.tx - ptr.x) * 0.12;
      ptr.y += (ptr.ty - ptr.y) * 0.12;
      ptr.r += (ptr.tr - ptr.r) * 0.08;
      data[15] = ptr.x * a;
      data[16] = ptr.y;
      data[17] = ptr.r;
      gl.uniform2f(u("uRes"), canvas.width, canvas.height);
      gl.uniform3fv(uB, data);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (now: number) => {
      if (!visible || document.hidden) { raf = 0; return; }
      raf = requestAnimationFrame(loop);
      if (now - last < gap) return;
      last = now;
      draw(now);
    };
    const wake = () => { if (!reduced && !raf && visible && !document.hidden) raf = requestAnimationFrame(loop); };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = 1 - (e.clientY - r.top) / r.height;
      const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
      if (inside) { ptr.tx = x; ptr.ty = y; }
      ptr.tr = inside ? 0.085 : 0;
    };

    draw(performance.now());
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); });
    io.observe(host);
    const ro = new ResizeObserver(() => reduced && draw(performance.now()));
    ro.observe(host);
    document.addEventListener("visibilitychange", wake);
    if (!reduced) {
      wake();
      if (!coarse) window.addEventListener("pointermove", onMove, { passive: true });
    }
    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("pointermove", onMove);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, [colors, speed]);

  return (
    <div
      ref={hostRef}
      className={`relative isolate overflow-hidden ${className}`}
      style={{ background: `radial-gradient(${colors[1]}22 1px, transparent 1.5px) 0 0 / 22px 22px, ${colors[0]}` }}
    >
      {children && <div className="relative z-[1] h-full">{children}</div>}
    </div>
  );
}
