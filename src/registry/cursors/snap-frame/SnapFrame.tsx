"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import "./snap-frame.css";

/**
 * Snap Frame
 * An adaptive pointer. At rest it is a soft dot; over a control it becomes
 * a highlight in that control's own shape — its size, its corner radius —
 * and the control leans a few pixels toward you while the highlight leans a
 * little further. Over text it turns into an I-beam the height of the type,
 * snapped to the line you are on. Keyboard focus moves the same frame.
 */

type Props = {
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  /** Selector for things the frame should wrap. */
  targets?: string;
  /** Selector for text the beam should read. */
  text?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

const TARGETS = "a[href], button:not(:disabled), [role='button'], [role='tab'], [role='radio'], [role='menuitem'], [data-snap]";
const TEXT = "p, h1, h2, h3, h4, h5, h6, li, blockquote, figcaption, label, input, textarea, [data-snap-text]";
const PAD = 4;
const PULL = 4;

type Spring = { v: number; to: number; vel: number };
const sp = (v: number): Spring => ({ v, to: v, vel: 0 });

export function SnapFrame({ theme = "paper", motion = "full", targets = TARGETS, text = TEXT, className = "", style, children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current, shape = shapeRef.current, layer = layerRef.current;
    if (!host || !shape || !layer) return;
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    const still = () => motion === "reduced" || rm.matches;
    const live = fine.matches;
    if (live) host.dataset.live = "";

    const S = { x: sp(0), y: sp(0), w: sp(16), h: sp(16), r: sp(8) };
    const ptr = { x: 0, y: 0 };
    let mode: "dot" | "frame" | "beam" = "dot";
    let target: HTMLElement | null = null;
    let box = { x: 0, y: 0, w: 0, h: 0, r: 0 }; // the target's untranslated box, host-local
    let inside = false, viaKeys = false, pressed = false, raf = 0, lastT = 0;
    let beam = { cy: 0, h: 18 };
    // Each control that has leaned keeps its own spring until it is home again.
    const leans = new Map<HTMLElement, { x: Spring; y: Spring }>();
    const leanOf = (el: HTMLElement) => {
      let l = leans.get(el);
      if (!l) leans.set(el, (l = { x: sp(0), y: sp(0) }));
      return l;
    };

    const scale = () => {
      const r = host.getBoundingClientRect();
      return { r, s: r.width / host.offsetWidth || 1 };
    };
    const toLocal = (cx: number, cy: number) => {
      const { r, s } = scale();
      return { x: (cx - r.left) / s, y: (cy - r.top) / s };
    };
    const measure = (el: HTMLElement) => {
      const { r, s } = scale();
      const prev = el.style.translate;
      el.style.translate = "";
      const b = el.getBoundingClientRect();
      el.style.translate = prev;
      const cs = getComputedStyle(el);
      const w = b.width / s, h = b.height / s;
      const rad = Math.min(parseFloat(cs.borderTopLeftRadius) || 0, h / 2, w / 2);
      return { x: (b.left - r.left) / s, y: (b.top - r.top) / s, w, h, r: rad };
    };

    const release = () => {
      if (target) {
        const l = leanOf(target);
        l.x.to = 0;
        l.y.to = 0;
        target.style.scale = "";
        target.removeAttribute("data-snapped");
      }
      target = null;
    };

    /** Point every spring at where the shape should be right now. */
    const aim = () => {
      if (mode === "frame" && target) {
        const cx = box.x + box.w / 2, cy = box.y + box.h / 2;
        // How far off-centre the pointer is, -1..1 on each axis.
        const nx = viaKeys ? 0 : Math.max(-1, Math.min(1, (ptr.x - cx) / (box.w / 2)));
        const ny = viaKeys ? 0 : Math.max(-1, Math.min(1, (ptr.y - cy) / (box.h / 2)));
        const k = still() ? 0 : 1;
        // The control leans toward you; the highlight leans a little further.
        const l = leanOf(target);
        l.x.to = nx * PULL * k;
        l.y.to = ny * PULL * 0.7 * k;
        target.style.scale = pressed ? "0.97" : "";
        const press = pressed ? 0.96 : 1;
        S.w.to = (box.w + PAD * 2) * press;
        S.h.to = (box.h + PAD * 2) * press;
        S.r.to = box.r + PAD;
        S.x.to = cx + nx * PULL * 1.7 * k;
        S.y.to = cy + ny * PULL * 1.2 * k;
      } else if (mode === "beam") {
        S.x.to = ptr.x;
        S.y.to = beam.cy;
        S.w.to = 2.5;
        S.h.to = beam.h;
        S.r.to = 1.25;
      } else {
        const d = pressed ? 12 : 16;
        S.x.to = ptr.x;
        S.y.to = ptr.y;
        S.w.to = d;
        S.h.to = d;
        S.r.to = d / 2;
      }
    };
    const draw = () => {
      shape.style.transform = `translate3d(${(S.x.v - S.w.v / 2).toFixed(2)}px, ${(S.y.v - S.h.v / 2).toFixed(2)}px, 0)`;
      shape.style.width = `${Math.max(0, S.w.v).toFixed(2)}px`;
      shape.style.height = `${Math.max(0, S.h.v).toFixed(2)}px`;
      shape.style.borderRadius = `${Math.max(0, S.r.v).toFixed(2)}px`;
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(0.032, lastT ? (now - lastT) / 1000 : 0.016);
      lastT = now;
      let busy = false;
      const springs = Object.values(S);
      for (const s of springs) {
        if (still()) { s.v = s.to; s.vel = 0; continue; }
        // Slightly under-damped so a morph lands with life, but never wobbles.
        const k = 520, c = 2 * 0.86 * Math.sqrt(k);
        s.vel += ((s.to - s.v) * k - s.vel * c) * dt;
        s.v += s.vel * dt;
        if (Math.abs(s.to - s.v) > 0.05 || Math.abs(s.vel) > 0.5) busy = true;
        else { s.v = s.to; s.vel = 0; }
      }
      draw();
      for (const [el, l] of leans) {
        for (const s of [l.x, l.y]) {
          if (still()) { s.v = s.to; s.vel = 0; continue; }
          const k = 380, c = 2 * 0.8 * Math.sqrt(k);
          s.vel += ((s.to - s.v) * k - s.vel * c) * dt;
          s.v += s.vel * dt;
          if (Math.abs(s.to - s.v) > 0.02 || Math.abs(s.vel) > 0.2) busy = true;
          else { s.v = s.to; s.vel = 0; }
        }
        if (l.x.v === 0 && l.y.v === 0 && l.x.to === 0 && l.y.to === 0) {
          el.style.translate = "";
          leans.delete(el);
        } else el.style.translate = `${l.x.v.toFixed(2)}px ${l.y.v.toFixed(2)}px`;
      }
      if (busy && !document.hidden) raf = requestAnimationFrame(tick);
      else lastT = 0;
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const snapAll = () => { for (const s of Object.values(S)) { s.v = s.to; s.vel = 0; } draw(); };

    const setMode = (m: typeof mode) => {
      mode = m;
      layer.dataset.mode = m;
    };

    const resolve = (el: Element | null) => {
      const t = el?.closest<HTMLElement>(targets);
      if (t && host.contains(t) && !t.matches("input, textarea")) {
        if (t !== target) {
          release();
          target = t;
          t.setAttribute("data-snapped", "");
          box = measure(t);
        }
        setMode("frame");
        return;
      }
      release();
      const tx = el?.closest<HTMLElement>(text);
      if (tx && host.contains(tx)) {
        const cs = getComputedStyle(tx);
        const fs = parseFloat(cs.fontSize) || 16;
        const lh = cs.lineHeight === "normal" ? fs * 1.2 : parseFloat(cs.lineHeight) || fs * 1.2;
        const b = measure(tx);
        const top = b.y + (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.borderTopWidth) || 0);
        if (tx.matches("input, textarea")) {
          beam = { cy: tx.matches("input") ? b.y + b.h / 2 : top + (Math.floor(Math.max(0, ptr.y - top) / lh) + 0.5) * lh, h: fs * 1.25 };
        } else {
          // Snap to the line box under the pointer, so the beam sits on the line you would type into.
          const line = Math.max(0, Math.floor((ptr.y - top) / lh));
          beam = { cy: top + (line + 0.5) * lh, h: fs * 1.18 };
        }
        setMode("beam");
        return;
      }
      setMode("dot");
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      const q = toLocal(e.clientX, e.clientY);
      ptr.x = q.x; ptr.y = q.y;
      viaKeys = false;
      const wasOut = !inside;
      inside = true;
      layer.dataset.in = "";
      resolve(e.target as Element);
      aim();
      if (wasOut) snapAll(); // appear where the pointer came in
      else if (mode === "dot") {
        // At rest the dot is the pointer: draw it now rather than a frame late.
        S.x.v = S.x.to; S.y.v = S.y.to; S.x.vel = S.y.vel = 0;
        draw();
      }
      wake();
    };
    const onLeave = () => {
      inside = false;
      pressed = false;
      release();
      setMode("dot");
      delete layer.dataset.in;
    };
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      pressed = true;
      aim();
      wake();
    };
    const onUp = () => {
      if (!pressed) return;
      pressed = false;
      aim();
      wake();
    };
    // Keyboard focus moves the same frame, so Tab feels like pointing.
    const onFocus = (e: FocusEvent) => {
      const el = e.target as HTMLElement;
      if (!el.matches?.(":focus-visible")) return;
      const t = el.closest<HTMLElement>(targets);
      if (!t || !host.contains(t) || t.matches("input, textarea")) return;
      const first = !inside && !layer.dataset.in;
      release();
      target = t;
      t.setAttribute("data-snapped", "");
      box = measure(t);
      viaKeys = true;
      setMode("frame");
      layer.dataset.in = "";
      aim();
      if (first) snapAll();
      wake();
    };
    const onBlur = () => {
      if (!viaKeys) return;
      requestAnimationFrame(() => {
        if (host.contains(document.activeElement) && document.activeElement?.matches(":focus-visible")) return;
        release();
        if (!inside) delete layer.dataset.in;
        setMode("dot");
      });
    };
    // Layout can move under a still pointer (scrolling, resizing): re-measure the target.
    const onScroll = () => {
      if (!target) return;
      box = measure(target);
      aim();
      wake();
    };

    if (live) {
      host.addEventListener("pointermove", onMove, { passive: true });
      host.addEventListener("pointerleave", onLeave);
      host.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);
    }
    host.addEventListener("focusin", onFocus);
    host.addEventListener("focusout", onBlur);
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      release();
      for (const el of leans.keys()) el.style.translate = "";
      leans.clear();
      delete host.dataset.live;
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      host.removeEventListener("focusin", onFocus);
      host.removeEventListener("focusout", onBlur);
      window.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
    };
  }, [motion, targets, text]);

  return (
    <div ref={hostRef} className={`snap-frame snap-frame--${theme} ${className}`} data-motion={motion} style={style}>
      {children}
      <div ref={layerRef} className="snap-frame__layer" aria-hidden="true" data-mode="dot">
        <div ref={shapeRef} className="snap-frame__shape" />
      </div>
    </div>
  );
}
