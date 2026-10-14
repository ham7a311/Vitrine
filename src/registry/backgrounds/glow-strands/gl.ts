/**
 * A full-screen fragment shader on a canvas: DPR-capped, paused offscreen and in hidden tabs,
 * one still frame under reduced motion, a smoothed pointer, and full cleanup.
 */
export type ShaderOptions = {
  frag: string;
  /** Static uniforms set once (vec3 colours as [r, g, b], floats as numbers). */
  uniforms?: Record<string, number | readonly number[]>;
  speed?: number;
  /** Render scale on fine pointers (touch uses 70% of it at ~30fps). */
  quality?: number;
  reduced?: boolean;
  /** Seconds of time to start at, so the still frame is a good one. */
  start?: number;
  /** Pointer easing per frame (0–1). */
  follow?: number;
  onFail?: () => void;
  /** Called before every draw to set uniforms that change between frames, such as layout. */
  frame?: (set: (name: string, v: number | readonly number[]) => void, canvas: HTMLCanvasElement) => void;
};

const VERT = "attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }";

export const hex = (h: string) => {
  const v = parseInt(h.replace("#", ""), 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255] as const;
};

export function runShader(host: HTMLElement, canvas: HTMLCanvasElement, o: ShaderOptions) {
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false, preserveDrawingBuffer: false });
  if (!gl) { o.onFail?.(); return () => {}; }
  const compile = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, o.frag));
  gl.bindAttribLocation(prog, 0, "a");
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { o.onFail?.(); return () => {}; }
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const U = (n: string) => gl.getUniformLocation(prog, n);
  for (const [name, v] of Object.entries(o.uniforms ?? {})) {
    const loc = U(name);
    if (typeof v === "number") gl.uniform1f(loc, v);
    else if (v.length === 2) gl.uniform2f(loc, v[0], v[1]);
    else if (v.length === 3) gl.uniform3f(loc, v[0], v[1], v[2]);
    else if (v.length === 4) gl.uniform4f(loc, v[0], v[1], v[2], v[3]);
  }
  const u = { res: U("uRes"), time: U("uTime"), mouse: U("uMouse"), press: U("uPress") };
  const locs = new Map<string, WebGLUniformLocation | null>();
  const set = (name: string, v: number | readonly number[]) => {
    if (!locs.has(name)) locs.set(name, U(name));
    const loc = locs.get(name)!;
    if (typeof v === "number") gl.uniform1f(loc, v);
    else if (v.length === 2) gl.uniform2f(loc, v[0], v[1]);
    else if (v.length === 3) gl.uniform3f(loc, v[0], v[1], v[2]);
    else if (v.length === 4) gl.uniform4f(loc, v[0], v[1], v[2], v[3]);
    else if (v.length % 4 === 0) gl.uniform4fv(loc, v as number[]);
    else if (v.length % 3 === 0) gl.uniform3fv(loc, v as number[]);
  };

  const reduced = o.reduced || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = !matchMedia("(hover: hover) and (pointer: fine)").matches;
  const follow = o.follow ?? 0.1;
  let raf = 0, visible = true, alive = true, last = 0, t = o.start ?? 10;
  const m = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, p: 0, tp: 0 };

  const size = () => {
    const scale = Math.min(devicePixelRatio || 1, 2) * (o.quality ?? 0.85) * (coarse ? 0.7 : 1);
    canvas.width = Math.max(1, Math.round(host.clientWidth * scale));
    canvas.height = Math.max(1, Math.round(host.clientHeight * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(u.res, canvas.width, canvas.height);
  };
  const draw = () => {
    o.frame?.(set, canvas);
    gl.uniform1f(u.time, t);
    gl.uniform2f(u.mouse, m.x, m.y);
    gl.uniform1f(u.press, m.p);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const tick = (now: number) => {
    raf = 0;
    if (!alive || !visible || document.hidden) return;
    if (coarse && last && now - last < 32) { raf = requestAnimationFrame(tick); return; }
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
    last = now;
    t += dt * (o.speed ?? 1);
    m.x += (m.tx - m.x) * follow; m.y += (m.ty - m.y) * follow; m.p += (m.tp - m.p) * 0.06;
    draw();
    raf = requestAnimationFrame(tick);
  };
  const start = () => { if (reduced) { draw(); return; } if (!raf && alive && visible && !document.hidden) { last = 0; raf = requestAnimationFrame(tick); } };
  const move = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    m.tx = (e.clientX - r.left) / r.width; m.ty = 1 - (e.clientY - r.top) / r.height;
    if (m.p < 0.01) { m.x = m.tx; m.y = m.ty; }
    m.tp = 1;
  };
  const leave = () => { m.tp = 0; };
  const ro = new ResizeObserver(() => { size(); draw(); });
  // lets the host redraw a still frame after its layout changes (reduced motion)
  (host as HTMLElement & { __redraw?: () => void }).__redraw = draw;
  ro.observe(host);
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); });
  io.observe(host);
  const vis = () => { if (!document.hidden) start(); };
  document.addEventListener("visibilitychange", vis);
  if (!coarse && !reduced) { host.addEventListener("pointermove", move); host.addEventListener("pointerleave", leave); }
  const lost = (e: Event) => { e.preventDefault(); cancelAnimationFrame(raf); raf = 0; o.onFail?.(); };
  canvas.addEventListener("webglcontextlost", lost);
  size(); draw(); start();
  return () => {
    alive = false;
    cancelAnimationFrame(raf);
    ro.disconnect(); io.disconnect();
    document.removeEventListener("visibilitychange", vis);
    host.removeEventListener("pointermove", move); host.removeEventListener("pointerleave", leave);
    canvas.removeEventListener("webglcontextlost", lost);
  };
}
