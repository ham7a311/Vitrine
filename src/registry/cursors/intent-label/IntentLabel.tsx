"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import "./intent-label.css";

/**
 * Intent Label
 * The cursor tells you what a click will do before you click. Over anything
 * marked data-intent it grows from a dot into a pill carrying that action —
 * "View case study", "Play reel · 0:42", "Drag", "Copy email" — and the
 * pill's width springs to fit each new label as you move between things.
 * Dragging nudges its arrows the way you're pulling; a playing reel draws
 * its progress along the pill's lower edge.
 *
 * Mark targets with:
 *   data-intent="Label"           the action, in a few words
 *   data-intent-icon="view|play|pause|drag|external|copy|check"
 *   data-intent-progress="0.4"    optional 0–1, drawn along the pill
 *   data-intent-drag              this element is dragged sideways
 */

type Props = {
  theme?: "night" | "paper";
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

const ICONS: Record<string, string> = {
  view: "M5 11L11 5M6 5h5v5",
  play: "M5.5 4.2v7.6L12 8z",
  pause: "M5.5 4.5v7M10.5 4.5v7",
  drag: "M5.5 5L2.5 8l3 3M10.5 5l3 3-3 3",
  external: "M9 3h4v4M13 3L7.5 8.5M11 9.5V13H3V5h3.5",
  copy: "M5.5 5.5h7v7h-7zM3.5 10.5v-7h7",
  check: "M3.5 8.5l3 3 6-7",
};
const FIELDS = "input, textarea, select, [contenteditable='true'], [contenteditable='']";

export function IntentLabel({ theme = "night", motion = "full", className = "", style, children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const slotRefs = [useRef<HTMLSpanElement>(null), useRef<HTMLSpanElement>(null)];

  useEffect(() => {
    const host = hostRef.current, layer = layerRef.current, pill = pillRef.current, meas = measureRef.current;
    const slots = slotRefs.map((r) => r.current);
    if (!host || !layer || !pill || !meas || !slots[0] || !slots[1]) return;
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    const still = () => motion === "reduced" || rm.matches;
    const live = fine.matches;
    if (live) host.dataset.live = "";

    const p = { x: 0, y: 0, vx: 0, t: 0 };
    const W = { v: 10, to: 10, vel: 0 }; // pill width
    const H = { v: 10, to: 10, vel: 0 }; // pill height
    let tilt = 0, raf = 0, lastT = 0, inside = false, viaKeys = false, active = 0, down = false, dragging = false, lastDragX = 0;
    let target: HTMLElement | null = null;
    let key = ""; // label + icon currently shown

    const local = (cx: number, cy: number) => {
      const r = host.getBoundingClientRect();
      const s = r.width / host.offsetWidth || 1;
      return { x: (cx - r.left) / s, y: (cy - r.top) / s, s, r };
    };
    const place = () => {
      pill.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) rotate(${tilt.toFixed(2)}deg)`;
      pill.style.width = `${W.v.toFixed(2)}px`;
      pill.style.height = `${H.v.toFixed(2)}px`;
    };

    const icon = (name: string) =>
      ICONS[name] ? `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="${ICONS[name]}"/></svg>` : "";
    const escape = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

    /** Show a label: write it into the idle slot, cross-fade, and spring the width to fit. */
    const show = (label: string | null, ico: string) => {
      const k = label ? `${label}|${ico}` : "";
      if (k === key) return;
      key = k;
      if (!label) {
        layer.dataset.mode = "dot";
        W.to = H.to = down ? 8 : 10;
        slots.forEach((s) => s!.removeAttribute("data-on"));
        wake();
        return;
      }
      const html = `${icon(ico)}<span>${escape(label)}</span>`;
      meas.innerHTML = html;
      const cur = slots[active]!;
      // Same action, new detail (a countdown ticking): rewrite in place rather than cross-fading.
      if (layer.dataset.mode === "pill" && cur.dataset.icon === ico && cur.dataset.head === label.split(" · ")[0]) {
        cur.innerHTML = html;
        W.to = Math.ceil(meas.offsetWidth) + 30;
        wake();
        return;
      }
      layer.dataset.mode = "pill";
      active ^= 1;
      const next = slots[active]!, prev = slots[active ^ 1]!;
      next.innerHTML = html;
      next.dataset.icon = ico;
      next.dataset.head = label.split(" · ")[0];
      next.setAttribute("data-on", "");
      prev.removeAttribute("data-on");
      W.to = Math.ceil(meas.offsetWidth) + 30;
      H.to = 40;
      wake();
    };

    const progress = (el: HTMLElement | null) => {
      const v = el?.dataset.intentProgress;
      pill.style.setProperty("--il-p", v ? String(Math.max(0, Math.min(1, +v))) : "0");
      pill.toggleAttribute("data-progress", !!v);
    };

    const resolve = (el: Element | null) => {
      if (el instanceof Element && el.closest(FIELDS)) {
        target = null;
        delete layer.dataset.in;
        return;
      }
      if (inside) layer.dataset.in = "";
      const t = el instanceof Element ? el.closest<HTMLElement>("[data-intent]") : null;
      target = t && host.contains(t) ? t : null;
      if (target) show(target.dataset.intent || "", target.dataset.intentIcon || "view");
      else show(null, "");
      progress(target);
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(0.032, lastT ? (now - lastT) / 1000 : 0.016);
      lastT = now;
      let busy = false;
      for (const s of [W, H]) {
        if (still()) { s.v = s.to; s.vel = 0; continue; }
        const k = 340, c = 2 * 0.78 * Math.sqrt(k);
        s.vel += ((s.to - s.v) * k - s.vel * c) * dt;
        s.v += s.vel * dt;
        if (Math.abs(s.to - s.v) > 0.05 || Math.abs(s.vel) > 0.5) busy = true;
        else { s.v = s.to; s.vel = 0; }
      }
      // The pill leans into horizontal travel like something carried, then rights itself.
      const lean = still() || layer.dataset.mode !== "pill" || now - p.t > 70 ? 0 : Math.max(-7, Math.min(7, p.vx / 220));
      tilt += (lean - tilt) * Math.min(1, dt * 10);
      if (Math.abs(tilt - lean) > 0.05 || Math.abs(tilt) > 0.05) busy = true;
      place();
      if (busy && !document.hidden) raf = requestAnimationFrame(tick);
      else lastT = 0;
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const q = local(e.clientX, e.clientY);
      const now = performance.now();
      if (inside && !viaKeys) p.vx = p.vx * 0.6 + ((q.x - p.x) / Math.max(1, now - p.t)) * 1000 * 0.4;
      p.x = q.x; p.y = q.y; p.t = now;
      viaKeys = false;
      if (!inside) {
        inside = true;
        p.vx = 0;
        layer.dataset.in = "";
      }
      if (dragging) {
        const dx = e.clientX - lastDragX;
        if (Math.abs(dx) > 0.5) pill.dataset.dir = dx < 0 ? "l" : "r";
        lastDragX = e.clientX;
      } else resolve(e.target as Element);
      place();
      wake();
    };
    const onLeave = () => {
      if (dragging) return;
      inside = false;
      delete layer.dataset.in;
      show(null, "");
    };
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      down = true;
      layer.dataset.down = "";
      if (target?.hasAttribute("data-intent-drag")) {
        dragging = true;
        lastDragX = e.clientX;
        pill.dataset.drag = "";
      }
      if (layer.dataset.mode === "dot") W.to = H.to = 8;
      wake();
    };
    const onUp = (e: PointerEvent) => {
      if (!down) return;
      down = false;
      delete layer.dataset.down;
      if (dragging) {
        dragging = false;
        delete pill.dataset.drag;
        delete pill.dataset.dir;
      }
      const over = document.elementFromPoint(e.clientX, e.clientY);
      if (over && host.contains(over)) resolve(over);
      else onLeave();
      if (layer.dataset.mode === "dot") W.to = H.to = 10;
      wake();
    };

    // Keyboard: the label appears beside the focused element, so the action is never pointer-only.
    const onFocus = (e: FocusEvent) => {
      const el = e.target as HTMLElement;
      if (!el.matches?.(":focus-visible")) return;
      const t = el.closest<HTMLElement>("[data-intent]");
      if (!t || !host.contains(t)) return;
      const { r, s } = local(0, 0);
      const b = t.getBoundingClientRect();
      viaKeys = true;
      target = t;
      show(t.dataset.intent || "", t.dataset.intentIcon || "view");
      progress(t);
      W.v = W.to; H.v = H.to; // no grow-in from nothing at a distant spot
      p.x = (b.right - r.left) / s - W.to / 2 - 10;
      p.y = (b.bottom - r.top) / s - 30;
      p.vx = 0;
      layer.dataset.in = "";
      place();
      wake();
    };
    const onBlur = () => {
      if (!viaKeys) return;
      requestAnimationFrame(() => {
        const a = document.activeElement;
        if (a && host.contains(a) && a.matches(":focus-visible") && a.closest("[data-intent]")) return;
        viaKeys = false;
        if (!inside) delete layer.dataset.in;
        show(null, "");
      });
    };

    // Labels and progress may change while you hover (a reel playing, "Copied"): follow them.
    const mo = new MutationObserver((list) => {
      if (!target) return;
      for (const m of list) {
        if (m.target !== target) continue;
        if (m.attributeName === "data-intent-progress") progress(target);
        else show(target.dataset.intent || "", target.dataset.intentIcon || "view");
      }
    });
    mo.observe(host, { subtree: true, attributes: true, attributeFilter: ["data-intent", "data-intent-icon", "data-intent-progress"] });

    if (live) {
      host.addEventListener("pointermove", onMove, { passive: true });
      host.addEventListener("pointerleave", onLeave);
      host.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    }
    host.addEventListener("focusin", onFocus);
    host.addEventListener("focusout", onBlur);
    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      mo.disconnect();
      delete host.dataset.live;
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      host.removeEventListener("focusin", onFocus);
      host.removeEventListener("focusout", onBlur);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motion]);

  return (
    <div ref={hostRef} className={`il il--${theme} ${className}`} data-motion={motion} style={style}>
      {children}
      <div ref={layerRef} className="il__layer" aria-hidden="true" data-mode="dot">
        <div ref={pillRef} className="il__pill">
          <span ref={slotRefs[0]} className="il__slot" />
          <span ref={slotRefs[1]} className="il__slot" />
          <span className="il__bar" />
        </div>
        <span ref={measureRef} className="il__slot il__measure" />
      </div>
    </div>
  );
}
