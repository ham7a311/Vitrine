"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "./split-flap-text.css";

/**
 * Split-Flap
 * A departures board that changes its mind the old way. Every character is
 * a real two-leaf cell: to reach a new letter it flips through the drum in
 * order — A, B, C… — each leaf falling over the hinge with the light
 * leaving its face, and lands with a little bounce. Cells start a beat
 * apart, so a change ripples across the board, and only the characters
 * that change move.
 */

type Props = {
  /** Boards to cycle through; each is a list of rows. */
  boards: string[][];
  /** How long each board holds once it has settled (ms). */
  hold?: number;
  title?: string;
  subtitle?: string;
  theme?: "amber" | "white" | "cream";
  motion?: "full" | "reduced";
  className?: string;
};

/** The drum: the order the flaps turn through. */
const DRUM = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:.-/";
const FLIP = 64; // ms per leaf
const LAND = 230; // the last leaf takes longer and bounces

const at = (c: string) => Math.max(0, DRUM.indexOf(c.toUpperCase()));

type Cell = {
  el: HTMLDivElement;
  top: HTMLSpanElement; bottom: HTMLSpanElement; front: HTMLSpanElement; back: HTMLSpanElement; leaf: HTMLDivElement;
  cur: number; to: number; next: number; busy: boolean;
};

export function SplitFlapText({ boards, hold = 3200, title = "Departures", subtitle = "Muscat International", theme = "amber", motion = "full", className = "" }: Props) {
  const rows = boards[0]?.length ?? 0;
  const cols = useMemo(() => Math.max(...boards.flat().map((r) => r.length)), [boards]);
  const pad = (s: string) => s.toUpperCase().padEnd(cols, " ").slice(0, cols);
  const gridRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  pausedRef.current = paused;

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    const still = () => motion === "reduced" || rm.matches;
    const cells: Cell[] = Array.from(grid.querySelectorAll<HTMLDivElement>(".sf__cell")).map((el) => {
      const c = at(el.dataset.c ?? " ");
      return {
        el,
        top: el.querySelector(".sf__top span")!, bottom: el.querySelector(".sf__bottom span")!,
        front: el.querySelector(".sf__front span")!, back: el.querySelector(".sf__back span")!,
        leaf: el.querySelector(".sf__leaf")!,
        cur: c, to: c, next: 0, busy: false,
      };
    });
    const show = (c: Cell, i: number) => { const ch = DRUM[i]; c.top.textContent = ch; c.bottom.textContent = ch; };
    cells.forEach((c) => show(c, c.cur));

    let raf = 0, visible = true, board = 0, settledAt = 0, alive = true;
    const anims = new Set<Animation>();

    /** One leaf: the old letter's top half falls over the hinge and becomes the new letter's bottom half. */
    const flip = (c: Cell, now: number) => {
      const from = c.cur, to = (c.cur + 1) % DRUM.length;
      const last = to === c.to;
      c.busy = true;
      c.top.textContent = DRUM[to];
      c.bottom.textContent = DRUM[from];
      c.front.textContent = DRUM[from];
      c.back.textContent = DRUM[to];
      c.leaf.style.visibility = "visible";
      const d = last ? LAND : FLIP;
      const a = c.leaf.animate(
        last
          ? [{ transform: "rotateX(0deg)" }, { transform: "rotateX(-180deg)", offset: 0.62 }, { transform: "rotateX(-166deg)", offset: 0.8 }, { transform: "rotateX(-180deg)" }]
          : [{ transform: "rotateX(0deg)" }, { transform: "rotateX(-180deg)" }],
        { duration: d, easing: last ? "cubic-bezier(.5,0,.6,1)" : "cubic-bezier(.55,0,.9,.6)" },
      );
      // The light leaves the falling face and arrives on the one coming down.
      const s1 = c.front.parentElement!.animate([{ "--shade": 0 } as Keyframe, { "--shade": 0.55 } as Keyframe], { duration: d * 0.5, fill: "forwards" });
      const s2 = c.back.parentElement!.animate([{ "--shade": 0.5 } as Keyframe, { "--shade": 0 } as Keyframe], { duration: d * 0.6, delay: d * 0.4, fill: "forwards" });
      [a, s1, s2].forEach((x) => anims.add(x));
      a.onfinish = () => {
        [a, s1, s2].forEach((x) => { anims.delete(x); x.cancel(); });
        c.bottom.textContent = DRUM[to];
        c.leaf.style.visibility = "hidden";
        c.busy = false;
      };
      c.cur = to;
      c.next = now + d;
    };

    const target = (b: number) => {
      const now = performance.now();
      const text = boards[b].map(pad).join("");
      cells.forEach((c, i) => {
        const to = at(text[i]);
        if (to === c.to) return;
        c.to = to;
        const r = Math.floor(i / cols), k = i % cols;
        c.next = now + k * 26 + r * 70 + Math.random() * 40;
      });
    };

    const tick = (now: number) => {
      raf = 0;
      if (!alive) return;
      if (pausedRef.current || !visible || document.hidden) return;
      let moving = false;
      for (const c of cells) {
        if (c.cur !== c.to || c.busy) moving = true;
        if (c.cur !== c.to && !c.busy && now >= c.next) flip(c, now);
      }
      if (moving) settledAt = now;
      else if (now - settledAt > hold && boards.length > 1) {
        board = (board + 1) % boards.length;
        setIndex(board);
        target(board);
      }
      raf = requestAnimationFrame(tick);
    };

    let timer = 0;
    const stillLoop = () => {
      // Reduced motion: the board changes in place, no flaps.
      if (pausedRef.current || !visible) { timer = window.setTimeout(stillLoop, 400); return; }
      board = (board + 1) % boards.length;
      setIndex(board);
      const text = boards[board].map(pad).join("");
      cells.forEach((c, i) => { c.cur = c.to = at(text[i]); show(c, c.cur); });
      timer = window.setTimeout(stillLoop, hold + 1200);
    };

    const wake = () => { if (!raf && !still()) raf = requestAnimationFrame(tick); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); });
    io.observe(grid);
    const onVis = () => wake();
    document.addEventListener("visibilitychange", onVis);
    (grid as HTMLDivElement & { __wake?: () => void }).__wake = wake;

    if (still()) timer = window.setTimeout(stillLoop, hold + 1200);
    else { settledAt = performance.now(); wake(); }

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      raf = 0;
      clearTimeout(timer);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      anims.forEach((a) => a.cancel());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boards, cols, hold, motion]);

  useEffect(() => {
    if (!paused) (gridRef.current as (HTMLDivElement & { __wake?: () => void }) | null)?.__wake?.();
  }, [paused]);

  const first = boards[0].map(pad);

  return (
    <section className={`sf sf--${theme} ${className}`} data-motion={motion} aria-label={title}>
      <header className="sf__head">
        <span className="sf__title">{title}</span>
        <span className="sf__sub">{subtitle}</span>
        <button type="button" className="sf__pause" onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
          {paused ? "Resume board" : "Pause board"}
        </button>
      </header>
      <div className="sf__frame" style={{ ["--cols" as string]: cols }}>
        <div ref={gridRef} className="sf__grid" aria-hidden="true">
          {Array.from({ length: rows }, (_, r) => (
            <div key={r} className="sf__row">
              {Array.from({ length: cols }, (_, k) => (
                <div key={k} className="sf__cell" data-c={first[r][k]}>
                  <div className="sf__half sf__top"><span /></div>
                  <div className="sf__half sf__bottom"><span /></div>
                  <div className="sf__leaf">
                    <div className="sf__half sf__front"><span /></div>
                    <div className="sf__half sf__back"><span /></div>
                  </div>
                  <i className="sf__hinge" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* What the board says, for screen readers; not announced on every change. */}
      <ul className="sf__sr">
        {boards[index].map((r, i) => <li key={i}>{r.replace(/\s+/g, " ").trim()}</li>)}
      </ul>
    </section>
  );
}
