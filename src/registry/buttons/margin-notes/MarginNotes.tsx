"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { pick, seeded, strokes } from "./notes";
import "./margin-notes.css";

export type MarginNotesProps = {
  children: ReactNode;
  /** How the notes are drawn. */
  pen?: "pencil" | "highlighter" | "chalk";
  /** Ink for each note in turn (one colour is fine). */
  inks?: string[];
  tone?: { face: string; label: string; edge: string };
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  className?: string;
};

const PAD = 96, NS = "http://www.w3.org/2000/svg";

/**
 * Margin Notes
 * Point at the button and an invisible editor marks it up: an arrow aimed at it or a ring round it,
 * then sparkles, an underline, a star or an exclamation — each drawn in a stroke at a time,
 * slightly differently every hover, like notes in a margin.
 */
export function MarginNotes({ children, pen = "pencil", inks = ["#3c3a36"], tone = { face: "#fffdf7", label: "#22201c", edge: "#22201c" }, onClick, type = "button", className = "" }: MarginNotesProps) {
  const btn = useRef<HTMLButtonElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const live = useRef<SVGGElement | null>(null);
  const count = useRef(0);
  const calm = useRef(false);
  useEffect(() => { calm.current = matchMedia("(prefers-reduced-motion: reduce)").matches; }, []);

  const draw = () => {
    const b = btn.current, root = svg.current; if (!b || !root) return;
    erase(true);
    const w = b.offsetWidth, h = b.offsetHeight, n = count.current++;
    root.setAttribute("viewBox", `${-PAD} ${-PAD} ${w + PAD * 2} ${h + PAD * 2}`);
    const g = document.createElementNS(NS, "g");
    root.appendChild(g); live.current = g;
    const r = seeded(n * 31 + 7);
    let t = 60;
    pick(n).forEach((kind, k) => {
      const ink = inks[k % inks.length];
      for (const d of strokes(kind, w, h, r)) {
        const p = document.createElementNS(NS, "path");
        p.setAttribute("d", d);
        p.setAttribute("class", "mnote__stroke");
        p.setAttribute("pathLength", "1");
        p.style.stroke = ink;
        g.appendChild(p);
        if (calm.current) { p.style.strokeDashoffset = "0"; continue; }
        const long = kind === "circle" ? 520 : kind === "arrowLeft" || kind === "arrowRight" ? 300 : kind === "underline" ? 220 : 120;
        p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: long, delay: t, easing: "cubic-bezier(0.45, 0.05, 0.4, 1)", fill: "both" });
        t += long * 0.85;
      }
      t += 60;
    });
    if (calm.current) g.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
  };

  const erase = (now = false) => {
    const g = live.current; if (!g) return;
    live.current = null;
    g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: now ? 90 : 320, fill: "forwards", easing: "ease-in" }).onfinish = () => g.remove();
  };

  return (
    <span className={`mnote mnote--${pen} ${className}`} style={{ ["--mn-face" as string]: tone.face, ["--mn-label" as string]: tone.label, ["--mn-edge" as string]: tone.edge, ["--mn-pad" as string]: `${PAD}px` } as CSSProperties}>
      <svg ref={svg} className="mnote__sheet" aria-hidden="true">
        <defs>
          <filter id="mnote-chalk" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
            <feDisplacementMap in="SourceGraphic" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <button ref={btn} type={type} className="mnote__btn" onClick={onClick}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") draw(); }}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") erase(); }}
        onPointerDown={(e) => { if (e.pointerType !== "mouse") { draw(); window.setTimeout(() => erase(), 2600); } }}
        onFocus={(e) => { if (e.currentTarget.matches(":focus-visible")) draw(); }}
        onBlur={() => erase()}>
        {children}
      </button>
    </span>
  );
}

export default MarginNotes;
