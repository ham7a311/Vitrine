"use client";

import { Fragment, createElement, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import "./highlight-cursor.css";

/**
 * Highlight Cursor
 * A coloured arrow that highlights the line of text it is on. The line sits
 * in a rounded box — a dark wash of the accent with a hairline accent edge —
 * and its words take the accent colour, like a selection made by someone
 * pointing at what matters. Move between lines and the box springs from
 * one to the next; leave the text and it lets go.
 *
 * Wrap text in <Highlight text="…" /> so it can be measured line by line.
 */

type Props = {
  /** Accent (hex): the arrow, the box and the lit text. */
  color?: string;
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

type Line = { words: HTMLElement[]; x: number; y: number; w: number; h: number };
type Spring = { v: number; to: number; vel: number };

const PAD_X = 5;
const PAD_Y = 2;
const FIELDS = "input, textarea, select, [contenteditable='true'], [contenteditable='']";
/** The arrow: every corner rounded (tip 2, outer corners 3, notch 3). Tip apex at (3.73, 3.73). */
const ARROW = "M5.77 3.24 L28.12 10.61 A3 3 0 0 1 28.07 16.33 L20.61 18.63 A3 3 0 0 0 18.63 20.61 L16.33 28.07 A3 3 0 0 1 10.61 28.12 L3.24 5.77 A2 2 0 0 1 5.77 3.24 Z";

/** Text the cursor can highlight. Newlines in `text` become line breaks. */
export function Highlight({ text, as = "p", className = "", style }: { text: string; as?: keyof HTMLElementTagNameMap; className?: string; style?: CSSProperties }) {
  const rows = text.split("\n");
  return createElement(
    as,
    { className, style, "data-hc-text": "" },
    rows.map((row, r) => (
      <Fragment key={r}>
        {r > 0 && <br />}
        {row.split(" ").map((w, i) => (
          <Fragment key={i}>
            {i > 0 && " "}
            <span className="hc__w">{w}</span>
          </Fragment>
        ))}
      </Fragment>
    )),
  );
}

export function HighlightCursor({ color = "#5fd4bf", motion = "full", className = "", style, children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current, box = boxRef.current, layer = layerRef.current, arr = arrowRef.current;
    if (!host || !box || !layer || !arr) return;
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    const still = () => motion === "reduced" || rm.matches;
    if (fine) host.dataset.live = "";

    const S: Record<"x" | "y" | "w" | "h", Spring> = { x: { v: 0, to: 0, vel: 0 }, y: { v: 0, to: 0, vel: 0 }, w: { v: 0, to: 0, vel: 0 }, h: { v: 0, to: 0, vel: 0 } };
    let lines: Line[] = [];
    let lit: Line | null = null;
    let shown = false, raf = 0, lastT = 0;

    const scale = () => {
      const r = host.getBoundingClientRect();
      return { r, s: r.width / host.offsetWidth || 1 };
    };

    /** Group every highlightable word into lines by its top edge, and measure each line's box. */
    const measure = () => {
      const { r, s } = scale();
      const prev = lit?.words[0] ?? null;
      lines = [];
      host.querySelectorAll<HTMLElement>("[data-hc-text]").forEach((block) => {
        let cur: Line | null = null;
        let top = NaN;
        block.querySelectorAll<HTMLElement>(".hc__w").forEach((w) => {
          const b = w.getBoundingClientRect();
          const t = Math.round(w.offsetTop);
          if (!cur || Math.abs(t - top) > 2) {
            cur = { words: [], x: 0, y: 0, w: 0, h: 0 };
            lines.push(cur);
            top = t;
          }
          const x0 = (b.left - r.left) / s, y0 = (b.top - r.top) / s, x1 = (b.right - r.left) / s, y1 = (b.bottom - r.top) / s;
          const L = cur as Line;
          const first = L.words.length === 0;
          const right = first ? x1 : Math.max(L.x + L.w, x1), bottom = first ? y1 : Math.max(L.y + L.h, y1);
          L.x = first ? x0 : Math.min(L.x, x0);
          L.y = first ? y0 : Math.min(L.y, y0);
          L.w = right - L.x;
          L.h = bottom - L.y;
          L.words.push(w);
        });
      });
      // Keep the same line lit across a re-measure.
      if (prev) {
        const again = lines.find((l) => l.words.includes(prev)) ?? null;
        if (again) light(again, false);
      }
    };

    const aim = (l: Line) => {
      S.x.to = l.x - PAD_X;
      S.y.to = l.y - PAD_Y;
      S.w.to = l.w + PAD_X * 2;
      S.h.to = l.h + PAD_Y * 2;
    };
    const draw = () => {
      box.style.transform = `translate3d(${S.x.v.toFixed(2)}px, ${S.y.v.toFixed(2)}px, 0)`;
      box.style.width = `${Math.max(0, S.w.v).toFixed(2)}px`;
      box.style.height = `${Math.max(0, S.h.v).toFixed(2)}px`;
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(0.032, lastT ? (now - lastT) / 1000 : 0.016);
      lastT = now;
      let busy = false;
      for (const s of Object.values(S)) {
        if (still()) { s.v = s.to; s.vel = 0; continue; }
        const k = 560, c = 2 * 0.88 * Math.sqrt(k);
        s.vel += ((s.to - s.v) * k - s.vel * c) * dt;
        s.v += s.vel * dt;
        if (Math.abs(s.to - s.v) > 0.05 || Math.abs(s.vel) > 0.5) busy = true;
        else { s.v = s.to; s.vel = 0; }
      }
      draw();
      if (busy && !document.hidden) raf = requestAnimationFrame(tick);
      else lastT = 0;
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const light = (l: Line | null, animate = true) => {
      if (l === lit && animate) return;
      lit?.words.forEach((w) => w.removeAttribute("data-lit"));
      lit = l;
      if (!l) {
        box.removeAttribute("data-on");
        shown = false;
        return;
      }
      l.words.forEach((w) => w.setAttribute("data-lit", ""));
      aim(l);
      if (!shown || !animate) {
        // First line: appear in place rather than flying in from the last one.
        for (const s of Object.values(S)) { s.v = s.to; s.vel = 0; }
        draw();
      }
      shown = true;
      box.setAttribute("data-on", "");
      wake();
    };

    /** The line under a point — with a little slack around each line so the box doesn't flicker between them. */
    const lineAt = (x: number, y: number) => {
      let best: Line | null = null, bestD = Infinity;
      for (const l of lines) {
        const dx = Math.max(l.x - PAD_X - x, 0, x - (l.x + l.w + PAD_X));
        const dy = Math.max(l.y - PAD_Y - y, 0, y - (l.y + l.h + PAD_Y));
        const d = Math.hypot(dx, dy * 1.5);
        if (d < bestD) { bestD = d; best = l; }
      }
      return bestD <= 26 ? best : null;
    };

    const local = (e: PointerEvent) => {
      const { r, s } = scale();
      return { x: (e.clientX - r.left) / s, y: (e.clientY - r.top) / s };
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const q = local(e);
      arr.style.transform = `translate3d(${q.x}px, ${q.y}px, 0)`;
      const field = e.target instanceof Element && e.target.closest(FIELDS);
      if (field) delete layer.dataset.in;
      else layer.dataset.in = "";
      light(field ? null : lineAt(q.x, q.y));
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      delete layer.dataset.in;
      light(null);
    };
    // Touch: tap a line to highlight it; tap elsewhere to let go.
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      const q = local(e);
      light(lineAt(q.x, q.y));
    };

    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(host);
    let alive = true;
    document.fonts?.ready.then(() => alive && measure());
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      raf = 0;
      ro.disconnect();
      lit?.words.forEach((w) => w.removeAttribute("data-lit"));
      delete host.dataset.live;
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
    };
  }, [motion]);

  return (
    <div ref={hostRef} className={`hc ${className}`} data-motion={motion} style={{ ...style, ["--hc-c" as string]: color }}>
      {/* The box sits behind the text, like a selection. */}
      <div className="hc__under" aria-hidden="true">
        <div ref={boxRef} className="hc__box" />
      </div>
      <div className="hc__content">{children}</div>
      <div ref={layerRef} className="hc__layer" aria-hidden="true">
        <div ref={arrowRef} className="hc__arrow">
          <svg viewBox="0 0 32 32" width="26" height="26">
            <path d={ARROW} />
          </svg>
        </div>
      </div>
    </div>
  );
}
