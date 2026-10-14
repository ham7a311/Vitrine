import { charge } from "./burst";

export type LayerHooks = {
  /** Spawn a burst at (x, y) in canvas pixels with a power of 1–2.2 (click to fully held). */
  burst: (x: number, y: number, power: number) => void;
  /** Draw one frame and return true while anything is still moving. */
  frame: (ctx: CanvasRenderingContext2D, dt: number, w: number, h: number) => boolean;
  /** Colour of the charging ring while the button is held. */
  ring: string;
  /** Under reduced motion: a single soft ring instead of a burst. */
  calm: () => boolean;
};

/**
 * A canvas overlay that turns clicks into bursts: over a host element, or the whole window when
 * `global`. Native cursor untouched. Holding charges a bigger burst (a ring grows while you hold);
 * keyboard clicks burst from the middle of the element. The loop only runs while something moves.
 */
export function attach(host: HTMLElement, canvas: HTMLCanvasElement, global: boolean, hooks: LayerHooks) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  let w = 0, h = 0, dpr = 1, raf = 0, last = 0, busy = false;
  let hold: { x: number; y: number; t: number; id: number } | null = null;
  const calmRings: { x: number; y: number; age: number }[] = [];

  const size = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = global ? window.innerWidth : host.offsetWidth; h = global ? window.innerHeight : host.offsetHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
  };
  // host-local coordinates, corrected if the host is drawn scaled
  const local = (cx: number, cy: number) => {
    if (global) return { x: cx, y: cy };
    const r = host.getBoundingClientRect(), sx = r.width / (host.offsetWidth || 1), sy = r.height / (host.offsetHeight || 1);
    return { x: (cx - r.left) / sx, y: (cy - r.top) / sy };
  };

  const tick = (now: number) => {
    raf = 0;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    busy = hooks.frame(ctx, dt, w, h);
    // the charging ring
    if (hold) {
      const c = charge(now - hold.t);
      if (c > 0) {
        ctx.globalAlpha = 0.25 + c * 0.5; ctx.strokeStyle = hooks.ring; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(hold.x, hold.y, 6 + c * 16, -Math.PI / 2, -Math.PI / 2 + c * Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
    for (let i = calmRings.length - 1; i >= 0; i--) {
      const r = calmRings[i]; r.age += dt;
      ctx.globalAlpha = Math.max(0, 0.5 * (1 - r.age / 0.6)); ctx.strokeStyle = hooks.ring; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(r.x, r.y, 14, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
      if (r.age > 0.6) calmRings.splice(i, 1);
    }
    if (busy || hold || calmRings.length) raf = requestAnimationFrame(tick);
  };
  const run = () => { if (!raf) { last = 0; raf = requestAnimationFrame(tick); } };
  const fire = (x: number, y: number, power: number) => {
    if (hooks.calm()) calmRings.push({ x, y, age: 0 });
    else hooks.burst(x, y, power);
    run();
  };

  const down = (e: PointerEvent) => {
    if (e.button !== 0) return;
    const p = local(e.clientX, e.clientY);
    hold = { ...p, t: performance.now(), id: e.pointerId };
    run();
  };
  const up = (e: PointerEvent) => {
    if (!hold || e.pointerId !== hold.id) return;
    const p = local(e.clientX, e.clientY), held = performance.now() - hold.t;
    hold = null;
    fire(p.x, p.y, 1 + charge(held) * 1.2);
  };
  const cancel = () => { hold = null; };
  // keyboard activation: Enter or Space on a button or link clicks with detail 0
  const click = (e: MouseEvent) => {
    if (e.detail !== 0 || !(e.target instanceof Element)) return;
    const r = e.target.getBoundingClientRect(), p = local(r.left + r.width / 2, r.top + r.height / 2);
    fire(p.x, p.y, 1);
  };

  const target: HTMLElement | Window = global ? window : host;
  target.addEventListener("pointerdown", down as EventListener);
  window.addEventListener("pointerup", up);
  window.addEventListener("pointercancel", cancel);
  target.addEventListener("click", click as EventListener);
  const ro = new ResizeObserver(size);
  if (global) window.addEventListener("resize", size); else ro.observe(host);
  size();
  return () => {
    cancelAnimationFrame(raf); ro.disconnect();
    window.removeEventListener("resize", size);
    target.removeEventListener("pointerdown", down as EventListener);
    window.removeEventListener("pointerup", up);
    window.removeEventListener("pointercancel", cancel);
    target.removeEventListener("click", click as EventListener);
  };
}
