"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import "./loupe.css";

/**
 * Loupe
 * A jeweller's glass for dense content. The children are rendered twice:
 * once as the page, and once inside a round lens, scaled and shifted so
 * the point under the pointer stays put. The copy is real DOM, not a
 * picture, so type and vector lines stay sharp at any power. Alt + wheel
 * or the [ and ] keys change the power on a spring; on touch, press and
 * hold, then drag, and the lens rises above your finger.
 */

type Props = {
  children: ReactNode;
  /** Starting magnification. */
  zoom?: number;
  min?: number;
  max?: number;
  /** Lens diameter in CSS px. */
  size?: number;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
};

export function Loupe({ children, zoom = 2.5, min = 1.5, max = 4, size = 200, theme = "paper", motion = "full", className = "", style }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const readRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = hostRef.current, lens = lensRef.current, view = viewRef.current, read = readRef.current;
    if (!host || !lens || !view || !read) return;
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    const still = () => motion === "reduced" || rm.matches;

    const z = { v: zoom, to: zoom, vel: 0 };
    const grow = { v: 0, to: 0, vel: 0 }; // lens scale: 0 hidden → 1 shown
    const at = { x: 0, y: 0 }; // the point being magnified (host-local)
    let lift = 0; // touch: how far above the finger the lens sits
    let raf = 0, lastT = 0, on = false, readTimer = 0;
    let press = 0, touchId = -1, touching = false;
    const start = { x: 0, y: 0 };

    const local = (cx: number, cy: number) => {
      const r = host.getBoundingClientRect();
      const s = r.width / host.offsetWidth || 1;
      return { x: (cx - r.left) / s, y: (cy - r.top) / s };
    };
    const size2 = () => {
      view.style.width = `${host.offsetWidth}px`;
      view.style.height = `${host.offsetHeight}px`;
    };

    const draw = () => {
      const S = size, cx = at.x, cy = at.y - lift;
      lens.style.transform = `translate3d(${cx - S / 2}px, ${cy - S / 2}px, 0) scale(${Math.max(0, grow.v).toFixed(4)})`;
      lens.style.opacity = String(Math.min(1, Math.max(0, grow.v * 1.6)));
      // Keep the magnified point at the lens's centre.
      view.style.transform = `translate3d(${S / 2 - at.x * z.v}px, ${S / 2 - at.y * z.v}px, 0) scale(${z.v.toFixed(4)})`;
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(0.032, lastT ? (now - lastT) / 1000 : 0.016);
      lastT = now;
      let busy = false;
      for (const [s, k, zeta] of [[z, 240, 0.9], [grow, 420, 0.72]] as const) {
        if (still()) { s.v = s.to; s.vel = 0; continue; }
        const c = 2 * zeta * Math.sqrt(k);
        s.vel += ((s.to - s.v) * k - s.vel * c) * dt;
        s.v += s.vel * dt;
        if (Math.abs(s.to - s.v) > 0.0008 || Math.abs(s.vel) > 0.003) busy = true;
        else { s.v = s.to; s.vel = 0; }
      }
      draw();
      if (busy && !document.hidden) raf = requestAnimationFrame(tick);
      else lastT = 0;
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const show = (v: boolean) => {
      on = v;
      grow.to = v ? 1 : 0;
      host.toggleAttribute("data-lens", v);
      wake();
    };
    const setZoom = (next: number) => {
      z.to = Math.round(Math.max(min, Math.min(max, next)) * 4) / 4;
      read.textContent = `${z.to.toFixed(z.to % 1 ? 2 : 1).replace(/0$/, "")}×`;
      read.parentElement!.setAttribute("data-show", "");
      window.clearTimeout(readTimer);
      readTimer = window.setTimeout(() => read.parentElement!.removeAttribute("data-show"), 1200);
      wake();
    };

    // ---- Mouse and pen
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const q = local(e.clientX, e.clientY);
      at.x = q.x; at.y = q.y;
      lift = 0;
      if (!on) { show(true); grow.v = Math.min(grow.v, 0.55); } // ease in from a smaller lens
      draw(); // the lens is the pointer: draw it now
      wake();
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      show(false);
    };
    const onWheel = (e: WheelEvent) => {
      if (!on || !e.altKey) return;
      e.preventDefault();
      setZoom(z.to * (e.deltaY < 0 ? 1.12 : 1 / 1.12));
    };
    const onKey = (e: KeyboardEvent) => {
      if (!on) return;
      if (e.key === "]" || e.key === "+" || e.key === "=") { setZoom(z.to + 0.25); e.preventDefault(); }
      if (e.key === "[" || e.key === "-") { setZoom(z.to - 0.25); e.preventDefault(); }
    };

    // ---- Touch: press and hold, then drag; the lens rises above the finger.
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      touchId = e.pointerId;
      start.x = e.clientX; start.y = e.clientY;
      window.clearTimeout(press);
      press = window.setTimeout(() => {
        touching = true;
        const q = local(start.x, start.y);
        at.x = q.x; at.y = q.y;
        lift = size * 0.62;
        show(true);
        grow.v = 0.4;
      }, 380);
    };
    const onTouchMoveP = (e: PointerEvent) => {
      if (e.pointerId !== touchId) return;
      if (!touching) {
        if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > 8) window.clearTimeout(press); // a scroll, not a hold
        return;
      }
      const q = local(e.clientX, e.clientY);
      at.x = q.x; at.y = q.y;
      draw();
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerId !== touchId) return;
      window.clearTimeout(press);
      touchId = -1;
      if (touching) { touching = false; show(false); }
    };
    // Once the lens is up, the finger drags it instead of scrolling the page.
    const onTouchMove = (e: TouchEvent) => { if (touching) e.preventDefault(); };
    const onContext = (e: Event) => { if (touching) e.preventDefault(); };

    size2();
    draw();
    const ro = new ResizeObserver(size2);
    ro.observe(host);
    if (fine.matches) {
      host.dataset.live = "";
      host.addEventListener("pointermove", onMove, { passive: true });
      host.addEventListener("pointerleave", onLeave);
      host.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("keydown", onKey);
    }
    host.addEventListener("pointerdown", onDown);
    host.addEventListener("pointermove", onTouchMoveP, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    host.addEventListener("touchmove", onTouchMove, { passive: false });
    host.addEventListener("contextmenu", onContext);
    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      window.clearTimeout(press);
      window.clearTimeout(readTimer);
      ro.disconnect();
      delete host.dataset.live;
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointermove", onTouchMoveP);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      host.removeEventListener("touchmove", onTouchMove);
      host.removeEventListener("contextmenu", onContext);
    };
  }, [zoom, min, max, size, motion]);

  return (
    <div ref={hostRef} className={`lp lp--${theme} ${className}`} data-motion={motion} style={{ ...style, ["--lp-size" as string]: `${size}px` }}>
      {children}
      <div ref={lensRef} className="lp__lens" aria-hidden="true">
        {/* The second copy: inert, unreadable to assistive tech, only ever seen through the glass. */}
        <div ref={viewRef} className="lp__view" inert>
          {children}
        </div>
        <span className="lp__rim" />
        <span className="lp__cross" />
        <span className="lp__zoom">
          <span ref={readRef}>{`${zoom}×`}</span>
        </span>
      </div>
    </div>
  );
}
