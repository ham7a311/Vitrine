"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import "./caliper.css";

/**
 * Caliper
 * A measuring cursor for design specs. Hairlines run the full width and
 * height of the frame through the pointer, with live X/Y readouts on the
 * edges. Hover anything marked data-measure and it is outlined with its
 * size, and red lines run from each edge to its frame with the distance in
 * pixels — the way a design tool shows spacing. Drag to measure between two
 * points; click to drop a pin and every move shows the distance from it.
 * Hold Shift to snap to the 8px grid.
 */

type Props = {
  theme?: "blueprint" | "paper";
  motion?: "full" | "reduced";
  /** Grid used when Shift is held. */
  grid?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

type Box = { x: number; y: number; w: number; h: number };

export function Caliper({ theme = "blueprint", motion = "full", grid = 8, className = "", style, children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const host = hostRef.current, layer = layerRef.current, live = liveRef.current;
    if (!host || !layer || !live) return;
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    host.dataset.live = "";
    const q = <T extends Element>(s: string) => layer.querySelector<T>(s)!;
    const vx = q<HTMLDivElement>(".cl__vx"), hy = q<HTMLDivElement>(".cl__hy");
    const rx = q<HTMLSpanElement>(".cl__rx"), ry = q<HTMLSpanElement>(".cl__ry");
    const box = q<HTMLDivElement>(".cl__box"), size = q<HTMLSpanElement>(".cl__size");
    const reds = [...layer.querySelectorAll<HTMLDivElement>(".cl__red")];
    const dim = q<SVGSVGElement>(".cl__dim"), dimLine = q<SVGLineElement>(".cl__dim line"), dimT1 = q<SVGLineElement>(".cl__t1"), dimT2 = q<SVGLineElement>(".cl__t2");
    const dimLabel = q<HTMLSpanElement>(".cl__dlabel");
    const pinEl = q<HTMLDivElement>(".cl__pin"), pinLabel = q<HTMLSpanElement>(".cl__pin span");
    const snapEl = q<HTMLSpanElement>(".cl__snap");

    const ptr = { x: 0, y: 0, cx: 0, cy: 0 };
    let shift = false, down: { x: number; y: number } | null = null, dragged = false;
    let pin: { x: number; y: number } | null = null;
    let measure: { a: { x: number; y: number }; b: { x: number; y: number } } | null = null;
    let target: Element | null = null;

    const scale = () => {
      const r = host.getBoundingClientRect();
      return { r, s: r.width / host.offsetWidth || 1 };
    };
    const toBox = (el: Element): Box => {
      const { r, s } = scale();
      const b = el.getBoundingClientRect();
      return { x: (b.left - r.left) / s, y: (b.top - r.top) / s, w: b.width / s, h: b.height / s };
    };
    const snap = (v: number) => (shift ? Math.round(v / grid) * grid : v);
    const fmt = (v: number) => (Math.round(v * 10) / 10).toString().replace(/\.0$/, "");

    const at = (x: number, y: number) => ({ x: snap(x), y: snap(y) });

    const drawDim = () => {
      const m = measure ?? (pin ? { a: pin, b: at(ptr.x, ptr.y) } : null);
      if (!m) { dim.removeAttribute("data-on"); dimLabel.removeAttribute("data-on"); return; }
      const { a, b } = m;
      const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy);
      if (len < 2) { dim.removeAttribute("data-on"); dimLabel.removeAttribute("data-on"); return; }
      dim.setAttribute("data-on", "");
      dim.toggleAttribute("data-live", !measure);
      dimLine.setAttribute("x1", String(a.x)); dimLine.setAttribute("y1", String(a.y));
      dimLine.setAttribute("x2", String(b.x)); dimLine.setAttribute("y2", String(b.y));
      // End ticks square to the line, like a dimension on a drawing.
      const nx = (-dy / len) * 6, ny = (dx / len) * 6;
      dimT1.setAttribute("x1", String(a.x - nx)); dimT1.setAttribute("y1", String(a.y - ny));
      dimT1.setAttribute("x2", String(a.x + nx)); dimT1.setAttribute("y2", String(a.y + ny));
      dimT2.setAttribute("x1", String(b.x - nx)); dimT2.setAttribute("y1", String(b.y - ny));
      dimT2.setAttribute("x2", String(b.x + nx)); dimT2.setAttribute("y2", String(b.y + ny));
      let deg = (Math.atan2(-dy, dx) * 180) / Math.PI;
      if (deg < 0) deg += 360;
      dimLabel.textContent = `${fmt(len)} px · ${Math.round(deg)}°`;
      dimLabel.style.transform = `translate3d(${(a.x + b.x) / 2}px, ${(a.y + b.y) / 2}px, 0) translate(-50%, -150%)`;
      dimLabel.setAttribute("data-on", "");
    };

    const drawTarget = () => {
      const t = target;
      if (!t || down) {
        box.removeAttribute("data-on");
        reds.forEach((r) => r.removeAttribute("data-on"));
        return;
      }
      const b = toBox(t);
      box.style.transform = `translate3d(${b.x}px, ${b.y}px, 0)`;
      box.style.width = `${b.w}px`;
      box.style.height = `${b.h}px`;
      box.setAttribute("data-on", "");
      size.textContent = `${fmt(b.w)} × ${fmt(b.h)}`;
      // Redlines run from each edge out to the frame the element sits in.
      const frameEl = t.parentElement?.closest("[data-measure-frame], [data-measure]") ?? host;
      const f = toBox(frameEl);
      const gaps = [
        { side: "t", d: b.y - f.y, x: b.x + b.w / 2, y: f.y, len: b.y - f.y, v: true },
        { side: "b", d: f.y + f.h - (b.y + b.h), x: b.x + b.w / 2, y: b.y + b.h, len: f.y + f.h - (b.y + b.h), v: true },
        { side: "l", d: b.x - f.x, x: f.x, y: b.y + b.h / 2, len: b.x - f.x, v: false },
        { side: "r", d: f.x + f.w - (b.x + b.w), x: b.x + b.w, y: b.y + b.h / 2, len: f.x + f.w - (b.x + b.w), v: false },
      ];
      gaps.forEach((g, i) => {
        const el = reds[i];
        if (g.d < 0.5) { el.removeAttribute("data-on"); return; }
        el.dataset.v = g.v ? "1" : "0";
        el.style.transform = `translate3d(${g.x}px, ${g.y}px, 0)`;
        el.style.setProperty("--len", `${g.len}px`);
        el.querySelector("span")!.textContent = fmt(g.d);
        el.setAttribute("data-on", "");
      });
    };

    const draw = () => {
      const p = at(ptr.x, ptr.y);
      vx.style.transform = `translate3d(${p.x}px, 0, 0)`;
      hy.style.transform = `translate3d(0, ${p.y}px, 0)`;
      rx.textContent = `x ${fmt(p.x)}`;
      ry.textContent = `y ${fmt(p.y)}`;
      rx.style.transform = `translate3d(${p.x}px, 0, 0) translateX(-50%)`;
      ry.style.transform = `translate3d(0, ${p.y}px, 0) translateY(-50%)`;
      layer.style.setProperty("--cl-x", `${ptr.x}px`);
      layer.style.setProperty("--cl-y", `${ptr.y}px`);
      snapEl.toggleAttribute("data-on", shift);
      layer.toggleAttribute("data-snap", shift);
      if (pin) {
        pinEl.style.transform = `translate3d(${pin.x}px, ${pin.y}px, 0)`;
        pinEl.setAttribute("data-on", "");
        pinLabel.textContent = `${fmt(pin.x)}, ${fmt(pin.y)}`;
      } else pinEl.removeAttribute("data-on");
      drawTarget();
      drawDim();
    };

    const local = (e: PointerEvent | MouseEvent) => {
      const { r, s } = scale();
      return { x: (e.clientX - r.left) / s, y: (e.clientY - r.top) / s };
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const p = local(e);
      ptr.x = p.x; ptr.y = p.y; ptr.cx = e.clientX; ptr.cy = e.clientY;
      shift = e.shiftKey;
      layer.dataset.in = "";
      const t = (e.target as Element).closest?.("[data-measure]");
      target = t && host.contains(t) ? t : null;
      if (down) {
        const b = at(p.x, p.y);
        if (Math.hypot(b.x - down.x, b.y - down.y) > 3) dragged = true;
        if (dragged) measure = { a: down, b };
      }
      draw();
    };
    const onLeave = () => {
      delete layer.dataset.in;
      target = null;
      if (!down) draw();
    };
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || e.pointerType === "touch") return;
      // Real controls inside the spec still work; measuring starts on everything else.
      if ((e.target as Element).closest("button, a, input, textarea, select, label, [role='button']")) return;
      shift = e.shiftKey;
      down = at(local(e).x, local(e).y);
      dragged = false;
      measure = null;
      host.setPointerCapture(e.pointerId);
      e.preventDefault(); // no text selection while measuring
      draw();
    };
    const onUp = (e: PointerEvent) => {
      if (!down) return;
      const end = at(local(e).x, local(e).y);
      if (dragged) {
        measure = { a: down, b: end };
        const len = Math.hypot(end.x - down.x, end.y - down.y);
        live.textContent = `Measured ${fmt(len)} pixels`;
      } else {
        // A click without a drag drops a pin; a click on the pin lifts it.
        if (pin && Math.hypot(pin.x - end.x, pin.y - end.y) < 8) {
          pin = null;
          live.textContent = "Pin removed";
        } else {
          pin = end;
          live.textContent = `Pin at ${fmt(end.x)}, ${fmt(end.y)}`;
        }
        measure = null;
      }
      down = null;
      draw();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Shift" && layer.dataset.in !== undefined) {
        shift = e.type === "keydown";
        draw();
      }
      if (e.key === "Escape" && e.type === "keydown" && (pin || measure)) {
        pin = null;
        measure = null;
        live.textContent = "Cleared";
        draw();
      }
    };
    const onScroll = () => { if (layer.dataset.in !== undefined) draw(); };

    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);
    host.addEventListener("pointerup", onUp);
    host.addEventListener("pointercancel", onUp);
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      delete host.dataset.live;
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointerup", onUp);
      host.removeEventListener("pointercancel", onUp);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
      window.removeEventListener("scroll", onScroll, { capture: true });
    };
  }, [grid, motion]);

  return (
    <div ref={hostRef} className={`cl cl--${theme} ${className}`} data-motion={motion} style={{ ...style, ["--cl-grid" as string]: `${grid}px` }}>
      {children}
      <div ref={layerRef} className="cl__layer" aria-hidden="true">
        <div className="cl__gridsnap" />
        <div className="cl__box">
          <span className="cl__size" />
        </div>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="cl__red">
            <span />
          </div>
        ))}
        <svg className="cl__dim">
          <line />
          <line className="cl__t1" />
          <line className="cl__t2" />
        </svg>
        <span className="cl__dlabel" />
        <div className="cl__pin">
          <span />
        </div>
        <div className="cl__vx" />
        <div className="cl__hy" />
        <span className="cl__rx" />
        <span className="cl__ry" />
        <span className="cl__snap">Snap {grid}</span>
      </div>
      <p ref={liveRef} className="cl__sr" role="status" aria-live="polite" />
    </div>
  );
}
