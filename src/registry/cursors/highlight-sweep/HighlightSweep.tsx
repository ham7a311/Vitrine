"use client";

import { Fragment, createElement, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import "./highlight-sweep.css";

/**
 * Highlight Sweep
 * A second cursor — not yours — that shows people what matters. It glides
 * in, presses at the start of a line and drags right, and a selection box
 * grows behind the text as it goes: the words turn the accent colour with a
 * crisp edge that travels with the cursor. It lets go and moves on to the
 * next phrase. By default it plays once: every highlight stays, the arrow
 * comes to rest past the last one, and nothing moves again. Pass
 * repeat="forever" to fade and loop instead. Your own pointer is left alone.
 *
 * Wrap text in <SweepText text="…" order={n} />. Mark a phrase inside the
 * text with [[…]] to sweep just that; otherwise the whole text is swept.
 */

type Props = {
  /** Accent (hex): the arrow, the box and the swept text, unless set separately below. */
  color?: string;
  /** "once" sweeps every target in turn, keeps each highlight, and stops for good; "forever" fades each one and loops. */
  repeat?: "once" | "forever";
  /** Older switch for the same thing: true is "forever", false is "once". `repeat` wins when both are given. */
  loop?: boolean;
  /** Box background; defaults to the accent at 16%. */
  fill?: string;
  /** Box edge; defaults to the accent at 48%. */
  ring?: string;
  /** Colour the swept words turn; defaults to the accent. */
  ink?: string;
  /** Arrow fill; defaults to the accent. */
  arrow?: string;
  /** Delay before the first sweep, once in view (ms). */
  startDelay?: number;
  /** Drag speed in px per second. */
  speed?: number;
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

/** Text the cursor can sweep. `order` sets the sweep sequence; "\n" is a line break; [[…]] marks the phrase. */
export function SweepText({ text, order, as = "p", className = "", style }: { text: string; order?: number; as?: keyof HTMLElementTagNameMap; className?: string; style?: CSSProperties }) {
  const marked = text.includes("[[");
  let inside = !marked;
  const rows = text.split("\n");
  return createElement(
    as,
    { className, style, "data-hs-text": order ?? "" },
    rows.map((row, r) => (
      <Fragment key={r}>
        {r > 0 && <br />}
        {row.split(" ").map((raw, i) => {
          let w = raw;
          if (w.startsWith("[[")) { inside = true; w = w.slice(2); }
          let end = false;
          if (w.includes("]]")) { end = true; w = w.replace("]]", ""); }
          const t = inside;
          if (end) inside = false;
          return (
            <Fragment key={i}>
              {i > 0 && " "}
              <span className="hs__w" data-t={t || undefined}>{w}</span>
            </Fragment>
          );
        })}
      </Fragment>
    )),
  );
}

type Line = { words: HTMLElement[]; lefts: number[]; widths: number[]; x: number; y: number; w: number; h: number };
type Step = { ms: number; run: (t: number) => void; done?: () => void };

const PAD_X = 6;
const PAD_Y = 2;
const ARROW = "M5.77 3.24 L28.12 10.61 A3 3 0 0 1 28.07 16.33 L20.61 18.63 A3 3 0 0 0 18.63 20.61 L16.33 28.07 A3 3 0 0 1 10.61 28.12 L3.24 5.77 A2 2 0 0 1 5.77 3.24 Z";

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function HighlightSweep({ color = "#5fd4bf", repeat, loop, fill, ring, ink, arrow, startDelay = 500, speed = 380, motion = "full", className = "", style, children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const underRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(motion === "reduced");
  const forever = repeat ? repeat === "forever" : loop === true;

  useEffect(() => {
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setReduced(motion === "reduced" || rm.matches);
    set();
    rm.addEventListener("change", set);
    return () => rm.removeEventListener("change", set);
  }, [motion]);

  useEffect(() => {
    const host = hostRef.current, under = underRef.current, arr = arrowRef.current;
    if (!host || !under || !arr) return;

    let raf = 0, lastT = 0, visible = false, alive = true, finished = false;
    let steps: Step[] = [], si = 0, el = 0, target = 0;
    // Boxes are numbered across targets, so a kept highlight never shares a box with the next one.
    let boxes: HTMLDivElement[] = [], base = 0;
    const cur = { x: 0, y: 0, o: 0, down: false };

    const scale = () => { const r = host.getBoundingClientRect(); return { r, s: r.width / host.offsetWidth || 1 }; };
    const targets = () =>
      Array.from(host.querySelectorAll<HTMLElement>("[data-hs-text]"))
        .filter((b) => b.dataset.hsText !== "")
        .sort((a, b) => Number(a.dataset.hsText) - Number(b.dataset.hsText));

    /** The visual lines of a target's marked words, in host-local px. */
    const measure = (block: HTMLElement): Line[] => {
      const { r, s } = scale();
      const lines: Line[] = [];
      let L: Line | null = null;
      block.querySelectorAll<HTMLElement>(".hs__w[data-t]").forEach((w) => {
        const b = w.getBoundingClientRect();
        const x0 = (b.left - r.left) / s, y0 = (b.top - r.top) / s, x1 = (b.right - r.left) / s, y1 = (b.bottom - r.top) / s;
        if (!L || Math.abs(y0 - L.y) > (y1 - y0) * 0.5) {
          L = { words: [], lefts: [], widths: [], x: x0, y: y0, w: 0, h: y1 - y0 };
          lines.push(L);
        }
        L.words.push(w);
        L.lefts.push(x0);
        L.widths.push(x1 - x0);
        L.w = x1 - L.x;
        L.h = Math.max(L.h, y1 - L.y);
      });
      return lines;
    };

    const drawArrow = () => {
      arr.style.transform = `translate3d(${cur.x.toFixed(2)}px, ${cur.y.toFixed(2)}px, 0)`;
      arr.style.opacity = cur.o.toFixed(3);
      if (cur.down) arr.dataset.down = ""; else delete arr.dataset.down;
    };
    const box = (i: number) => {
      while (boxes.length <= i) {
        const b = document.createElement("div");
        b.className = "hs__box";
        under.appendChild(b);
        boxes.push(b);
      }
      return boxes[i];
    };
    /** Grow a line's box (box number n) and its words' accent edge to x (host px). */
    const fillLine = (l: Line, n: number, x: number) => {
      const b = box(n);
      const left = l.x - PAD_X;
      const w = Math.max(0, Math.min(l.w + PAD_X * 2, x - left));
      b.style.transform = `translate3d(${left.toFixed(2)}px, ${(l.y - PAD_Y).toFixed(2)}px, 0)`;
      b.style.width = `${w.toFixed(2)}px`;
      b.style.height = `${(l.h + PAD_Y * 2).toFixed(2)}px`;
      b.dataset.on = "";
      l.words.forEach((wd, k) => wd.style.setProperty("--f", `${Math.max(0, Math.min(l.widths[k] + 2, x - l.lefts[k])).toFixed(2)}px`));
    };
    const clearAll = () => {
      boxes.forEach((b) => b.remove());
      boxes = [];
      base = 0;
      host.querySelectorAll<HTMLElement>(".hs__w").forEach((w) => { w.style.removeProperty("--f"); w.removeAttribute("data-fade"); });
    };
    const restAfter = (last: Line) => ({ x: last.x + last.w + PAD_X + 6, y: last.y + last.h + PAD_Y + 10 });

    /** Build the timeline for one target. `cont` means the arrow is already on screen and glides on from where it is. */
    const plan = (block: HTMLElement, cont: boolean, isLast: boolean) => {
      const lines = measure(block);
      if (!lines.length) return [];
      const hostW = host.offsetWidth, hostH = host.offsetHeight;
      const mid = (l: Line) => l.y + l.h * 0.58;
      const first = lines[0], last = lines[lines.length - 1];
      const sx = first.x - 2, sy = mid(first);
      const from = cont ? { x: cur.x, y: cur.y } : { x: Math.min(hostW - 20, sx + 260), y: Math.min(hostH - 10, sy + 170) };
      const ctrl = cont ? { x: (from.x + sx) / 2, y: Math.max(from.y, sy) + 40 } : { x: from.x - 40, y: sy + 30 };
      const endX = last.x + last.w + PAD_X;
      const rest = restAfter(last);
      const away = { x: rest.x + 70, y: rest.y + 60 };
      const at = base;
      const out: Step[] = [];
      out.push({ ms: 900, run: (t) => {
        const e = ease(t);
        cur.x = (1 - e) * (1 - e) * from.x + 2 * (1 - e) * e * ctrl.x + e * e * sx;
        cur.y = (1 - e) * (1 - e) * from.y + 2 * (1 - e) * e * ctrl.y + e * e * sy;
        cur.o = cont ? 1 : Math.min(1, t * 4);
      } });
      out.push({ ms: 160, run: () => { cur.down = true; }, done: () => fillLine(first, at, first.x - PAD_X + 2) });
      lines.forEach((l, i) => {
        const x0 = i === 0 ? sx : l.x - PAD_X;
        const x1 = l.x + l.w + PAD_X;
        const ms = Math.max(i === 0 && lines.length === 1 ? 900 : 520, ((x1 - x0) / speed) * 1000);
        // One continuous drag: ease in on the first line, steady through the middle, ease out on the last.
        const fn = lines.length === 1 ? ease : i === 0 ? (t: number) => t * t * (2 - t) : i === lines.length - 1 ? (t: number) => t * (1 + t - t * t) : (t: number) => t;
        out.push({ ms, run: (t) => {
          const e = fn(t);
          cur.x = lerp(x0, x1, e);
          cur.y = mid(l);
          fillLine(l, at + i, cur.x);
        } });
        if (i < lines.length - 1) {
          const n = lines[i + 1];
          out.push({ ms: 280, run: (t) => {
            const e = easeSine(t);
            cur.x = lerp(x1, n.x - PAD_X, e);
            cur.y = lerp(mid(l), mid(n), e);
            fillLine(l, at + i, x1);
            fillLine(n, at + i + 1, Math.max(n.x - PAD_X, cur.x));
          } });
        }
      });
      out.push({ ms: 140, run: () => { cur.down = false; } });
      const end = { x: endX, y: mid(last) };
      out.push({ ms: 520, run: (t) => { const e = easeOut(t); cur.x = lerp(end.x, rest.x, e); cur.y = lerp(end.y, rest.y, e); }, done: () => { base = at + lines.length; } });
      if (!forever) {
        // Once: the highlight stays. Pause on it, then glide on to the next phrase; after the last, rest for good.
        if (!isLast) out.push({ ms: 900, run: () => {} });
        return out;
      }
      out.push({ ms: 2400, run: () => {} });
      out.push({ ms: 420, run: (t) => {
        boxes.forEach((b) => (b.style.opacity = String(1 - t)));
        if (t > 0) host.querySelectorAll<HTMLElement>(".hs__w").forEach((w) => w.style.getPropertyValue("--f") && w.setAttribute("data-fade", ""));
        const e = ease(t);
        cur.x = lerp(rest.x, away.x, e); cur.y = lerp(rest.y, away.y, e);
        cur.o = 1 - t;
      }, done: clearAll });
      out.push({ ms: 1200, run: () => {} });
      return out;
    };

    const begin = (i: number) => {
      const all = targets();
      if (!all.length) return false;
      if (i >= all.length) {
        if (!forever) return false;
        i = 0;
      }
      const cont = !forever && i > 0;
      target = i;
      if (forever) clearAll();
      steps = plan(all[i], cont, i === all.length - 1);
      si = 0; el = 0;
      return steps.length > 0;
    };

    /** Highlights for targets [0, upto) drawn complete, with the arrow resting past the last of them. */
    const settled = (upto: number) => {
      clearAll();
      const all = targets().slice(0, upto);
      let lastLine: Line | undefined;
      all.forEach((t) => {
        const lines = measure(t);
        lines.forEach((l, i) => fillLine(l, base + i, l.x + l.w + PAD_X));
        base += lines.length;
        lastLine = lines[lines.length - 1] ?? lastLine;
      });
      if (lastLine) { const r = restAfter(lastLine); cur.x = r.x; cur.y = r.y; cur.o = 1; cur.down = false; drawArrow(); }
    };

    const tick = (now: number) => {
      raf = 0;
      if (!alive || finished || !visible || document.hidden) { lastT = 0; return; }
      const dt = lastT ? Math.min(50, now - lastT) : 16;
      lastT = now;
      el += dt;
      while (si < steps.length && el >= steps[si].ms) {
        steps[si].run(1);
        steps[si].done?.();
        el -= steps[si].ms;
        si++;
      }
      if (si >= steps.length) {
        if (!begin(target + 1)) { finished = true; drawArrow(); return; }
      } else steps[si].run(el / steps[si].ms);
      drawArrow();
      raf = requestAnimationFrame(tick);
    };
    const wake = () => { if (!raf && alive && !finished) raf = requestAnimationFrame(tick); };

    if (reduced) {
      // Still frame: the finished state (every phrase when it plays once, the first when it loops).
      const draw = () => settled(forever ? 1 : targets().length);
      draw();
      const ro = new ResizeObserver(draw);
      ro.observe(host);
      document.fonts?.ready.then(() => alive && draw());
      return () => { alive = false; ro.disconnect(); clearAll(); };
    }

    // A short wait before the first sweep, counted only while visible.
    steps = [{ ms: startDelay, run: () => {} }];
    si = 0; el = 0; target = -1;
    cur.o = 0;
    drawArrow();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) wake(); }, { threshold: 0.2 });
    io.observe(host);
    const onVis = () => { if (!document.hidden) wake(); };
    document.addEventListener("visibilitychange", onVis);
    // Reflow: redraw what is already done and start the current target again with fresh measurements.
    let w0 = host.offsetWidth;
    const ro = new ResizeObserver(() => {
      if (host.offsetWidth === w0) return;
      w0 = host.offsetWidth;
      if (finished) return settled(targets().length);
      if (target < 0) return;
      if (forever) { begin(target); cur.o = 0; drawArrow(); return; }
      settled(target);
      begin(target);
      drawArrow();
    });
    ro.observe(host);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      raf = 0;
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      clearAll();
    };
  }, [reduced, forever, startDelay, speed]);

  const vars: Record<string, string> = { "--hs-c": color };
  if (fill) vars["--hs-fill"] = fill;
  if (ring) vars["--hs-ring"] = ring;
  if (ink) vars["--hs-ink"] = ink;
  if (arrow) vars["--hs-arrow"] = arrow;

  return (
    <div ref={hostRef} className={`hs ${className}`} data-motion={motion} style={{ ...style, ...vars }}>
      <div ref={underRef} className="hs__under" aria-hidden="true" />
      <div className="hs__content">{children}</div>
      <div className="hs__layer" aria-hidden="true">
        <div ref={arrowRef} className="hs__arrow">
          <svg viewBox="0 0 32 32" width="26" height="26">
            <path d={ARROW} />
          </svg>
        </div>
      </div>
    </div>
  );
}
