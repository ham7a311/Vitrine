"use client";

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import "./glass-lens-switch.css";

/**
 * Glass Lens Switch
 * A segmented control whose selection is a drop of glass. Choose an option
 * and the lens slides to it on a spring, stretching as it moves and settling
 * with a small wobble; whatever is under it is magnified, so the words swell
 * as the lens passes over them. You can also drag the lens and let go.
 */

export type LensOption = { id: string; label: string };

type Props = {
  options: LensOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  label: string;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

type Slot = { x: number; w: number };

export function GlassLensSwitch({ options, value, defaultValue, onChange, label, theme = "night", motion = "full", className = "" }: Props) {
  const [inner, setInner] = useState(defaultValue ?? options[0].id);
  const current = value ?? inner;
  const index = Math.max(0, options.findIndex((o) => o.id === current));
  const track = useRef<HTMLDivElement>(null);
  const lens = useRef<HTMLSpanElement>(null);
  const mag = useRef<HTMLSpanElement>(null);
  const opts = useRef<(HTMLButtonElement | null)[]>([]);
  const slots = useRef<Slot[]>([]);
  const [ready, setReady] = useState(false);
  const s = useRef({ x: 0, w: 0, vx: 0, vw: 0, tx: 0, tw: 0, raf: 0, drag: null as null | { id: number; start: number; grab: number; moved: boolean } });

  const reduced = () => motion === "reduced" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const paint = () => {
    const st = s.current, el = lens.current, m = mag.current;
    if (!el || !m) return;
    const v = Math.abs(st.vx);
    const sx = 1 + Math.min(0.24, v / 2400), sy = 1 - Math.min(0.14, v / 4000);
    el.style.width = `${st.w}px`;
    // The labels on the track hide wherever the lens is, so only the magnified copy shows through it.
    track.current?.style.setProperty("--lx", `${st.x}px`);
    track.current?.style.setProperty("--lw", `${st.w}px`);
    el.style.transform = `translateX(${st.x}px) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`;
    // The magnified copy lines up with the track and is scaled about the lens centre.
    m.style.transform = `translateX(${-st.x}px)`;
    m.style.transformOrigin = `${st.w / 2}px 50%`;
    m.style.scale = "1.14";
  };

  const loop = () => {
    if (s.current.raf) return;
    let last = performance.now();
    const tick = (now: number) => {
      const st = s.current;
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const k = 520, c = 30;
      st.vx += (-(st.x - st.tx) * k - st.vx * c) * dt;
      st.vw += (-(st.w - st.tw) * k - st.vw * c) * dt;
      st.x += st.vx * dt;
      st.w += st.vw * dt;
      paint();
      const still = Math.abs(st.x - st.tx) < 0.2 && Math.abs(st.vx) < 2 && Math.abs(st.w - st.tw) < 0.2 && !st.drag;
      if (still) { st.x = st.tx; st.w = st.tw; st.vx = st.vw = 0; paint(); st.raf = 0; return; }
      st.raf = requestAnimationFrame(tick);
    };
    s.current.raf = requestAnimationFrame(tick);
  };

  const aim = (i: number, jump = false) => {
    const slot = slots.current[i];
    if (!slot) return;
    const st = s.current;
    st.tx = slot.x; st.tw = slot.w;
    if (jump || reduced()) { st.x = slot.x; st.w = slot.w; st.vx = st.vw = 0; paint(); return; }
    loop();
  };

  useLayoutEffect(() => {
    const measure = () => {
      slots.current = opts.current.map((b) => ({ x: b?.offsetLeft ?? 0, w: b?.offsetWidth ?? 0 }));
      opts.current.forEach((b) => b?.style.setProperty("--bx", `${b.offsetLeft}px`));
      aim(index, true);
      setReady(true);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track.current!);
    return () => ro.disconnect();
  }, [options.length]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (!s.current.drag) aim(index); }, [index]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => { cancelAnimationFrame(s.current.raf); s.current.raf = 0; }, []);

  const choose = (i: number) => {
    const id = options[i].id;
    if (value === undefined) setInner(id);
    onChange?.(id);
    aim(i);
  };
  const onKey = (e: KeyboardEvent, i: number) => {
    const n = options.length;
    const to = e.key === "ArrowRight" || e.key === "ArrowDown" ? (i + 1) % n : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : null;
    if (to === null) return;
    e.preventDefault();
    choose(to);
    opts.current[to]?.focus();
  };

  // Dragging: press on the lens's option and move; the lens follows and snaps to the nearest option on release.
  const nearest = (x: number) => {
    let best = 0, d = Infinity;
    slots.current.forEach((sl, i) => { const dd = Math.abs(sl.x + sl.w / 2 - x); if (dd < d) { d = dd; best = i; } });
    return best;
  };
  const down = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const r = track.current!.getBoundingClientRect();
    const px = e.clientX - r.left;
    const st = s.current;
    if (px < st.x || px > st.x + st.w) return; // only the lens itself is draggable
    st.drag = { id: e.pointerId, start: px, grab: px - st.x, moved: false };
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const st = s.current, dr = st.drag;
    if (!dr || dr.id !== e.pointerId) return;
    const r = track.current!.getBoundingClientRect();
    const px = e.clientX - r.left;
    if (!dr.moved && Math.abs(px - dr.start) < 4) return;
    if (!dr.moved) { dr.moved = true; track.current!.setPointerCapture(e.pointerId); track.current!.dataset.drag = ""; }
    const last = slots.current[slots.current.length - 1];
    st.tx = Math.max(slots.current[0].x, Math.min(last.x + last.w - st.w, px - dr.grab));
    st.tw = slots.current[nearest(st.tx + st.w / 2)].w;
    loop();
  };
  const up = (e: PointerEvent<HTMLDivElement>) => {
    const st = s.current, dr = st.drag;
    if (!dr || dr.id !== e.pointerId) return;
    st.drag = null;
    delete track.current!.dataset.drag;
    if (dr.moved) {
      const i = nearest(st.tx + st.w / 2);
      choose(i);
      opts.current[i]?.focus({ preventScroll: true });
    }
  };

  return (
    <div className={`gls gls--${theme} ${className}`} data-motion={motion}>
      <div
        ref={track}
        className="gls__track"
        role="radiogroup"
        aria-label={label}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onClickCapture={(e) => { if (track.current!.dataset.drag !== undefined) e.stopPropagation(); }}
      >
        {options.map((o, i) => (
          <button
            key={o.id}
            ref={(el) => void (opts.current[i] = el)}
            type="button"
            role="radio"
            aria-checked={o.id === current}
            tabIndex={o.id === current ? 0 : -1}
            className="gls__opt"
            onClick={() => choose(i)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {o.label}
          </button>
        ))}
        <span ref={lens} className="gls__lens" data-ready={ready || undefined} aria-hidden="true">
          <span ref={mag} className="gls__mag">
            {options.map((o) => <span key={o.id} className="gls__opt gls__opt--mag">{o.label}</span>)}
          </span>
        </span>
      </div>
    </div>
  );
}
