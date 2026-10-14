"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { chain, lean, ring, type Tile } from "./domino";
import { nearest, pointAt } from "./perimeter";
import "./domino-run.css";

export type DominoSet = "ivory" | "ebony" | "candy";

export type DominoRunProps = {
  children: ReactNode;
  set?: DominoSet;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  className?: string;
};

const PAD = 30, SPACING = 11, HEIGHT = 15;
type Run = { tiles: Tile[]; dir: 1 | -1; phase: "up" | "down"; n: number; times: number[] };

/**
 * Domino Run
 * Point at the button and a ring of dominoes is set up round it, one after another from where you
 * came in. Leave — or press — and the first one tips: the whole ring goes down in a chain that
 * speeds up as it travels, each tile coming to rest on the next.
 */
export function DominoRun({ children, set = "ivory", onClick, type = "button", className = "" }: DominoRunProps) {
  const btn = useRef<HTMLButtonElement>(null);
  const [run, setRun] = useState<Run | null>(null);
  const count = useRef(0);
  const clear = useRef(0);
  const calm = useRef(false);
  useEffect(() => { calm.current = matchMedia("(prefers-reduced-motion: reduce)").matches; return () => window.clearTimeout(clear.current); }, []);

  const setUp = (x: number, y: number, mx = 0, my = 0) => {
    const b = btn.current!, w = b.offsetWidth, h = b.offsetHeight, r = h / 2;
    const s0 = nearest(w, h, r, x, y), p = pointAt(w, h, r, s0);
    const dir: 1 | -1 = p.tx * mx + p.ty * my < 0 ? -1 : 1;
    const tiles = ring(w, h, r, s0, dir, SPACING);
    window.clearTimeout(clear.current);
    setRun({ tiles, dir, phase: "up", n: ++count.current, times: chain(tiles.length) });
  };
  const knock = () => {
    setRun((r) => {
      if (!r || r.phase === "down") return r;
      window.clearTimeout(clear.current);
      clear.current = window.setTimeout(() => setRun((q) => (q && q.phase === "down" ? null : q)), (calm.current ? 0 : r.times[r.times.length - 1]) + 1400);
      return { ...r, phase: "down" };
    });
  };
  const local = (e: React.PointerEvent<HTMLButtonElement>) => { const b = e.currentTarget.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top }; };

  const tilt = lean(SPACING, HEIGHT);
  return (
    <span className={`drun drun--${set} ${className}`} style={{ ["--dr-pad" as string]: `${PAD}px` } as CSSProperties}>
      <span className="drun__floor" aria-hidden="true">
        {run && run.tiles.map((t) => {
          const last = t.i === run.tiles.length - 1;
          return (
            <span key={`${run.n}-${t.i}`} className="drun__spot" style={{ left: t.x + PAD, top: t.y + PAD, transform: `translate(-50%, -100%) rotate(${t.angle}deg)` }}>
              <span
                className={`drun__tile drun__tile--c${t.i % 5}`} data-down={run.phase === "down" ? "" : undefined}
                style={{
                  ["--up" as string]: `${t.i * 16}ms`, ["--down" as string]: `${run.times[t.i]}ms`,
                  ["--lean" as string]: `${run.dir * (last ? 90 : tilt)}deg`, transformOrigin: run.dir > 0 ? "100% 100%" : "0% 100%",
                } as CSSProperties}
              >
                <i className={`drun__pips drun__pips--${((t.pips[0] - 1) % 3) + 1}`} /><i className={`drun__pips drun__pips--${((t.pips[1] - 1) % 3) + 1}`} />
              </span>
            </span>
          );
        })}
      </span>
      <button ref={btn} type={type} className="drun__btn" onClick={onClick}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") { const p = local(e); setUp(p.x, p.y, e.movementX, e.movementY); } }}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") knock(); }}
        onPointerDown={(e) => { if (e.pointerType !== "mouse") { const p = local(e); setUp(p.x, p.y); window.setTimeout(knock, 1100); } else knock(); }}
        onFocus={(e) => { if (e.currentTarget.matches(":focus-visible")) setUp(e.currentTarget.offsetWidth / 2, 0); }}
        onBlur={knock}>
        {children}
      </button>
    </span>
  );
}

export default DominoRun;
