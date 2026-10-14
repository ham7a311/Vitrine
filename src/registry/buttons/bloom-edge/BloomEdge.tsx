"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { jitter, spots, vine } from "./bloom";
import { piece, type Flora } from "./growth";
import { length, nearest } from "./perimeter";
import "./bloom-edge.css";

export type BloomEdgeProps = {
  children: ReactNode;
  flora?: Flora;
  /** Stem, main bloom, leaf or branch, and accent colours. */
  colors?: { stem: string; a: string; b: string; c: string };
  tone?: { face: string; label: string };
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  className?: string;
};

const PAD = 30, NS = "http://www.w3.org/2000/svg";
const GROW = 520; // px per second along the edge

/**
 * Bloom Edge
 * Point at the button and a stem grows round it both ways from where you came in, with blossom,
 * ferns or frost unfurling along it — nearest first. Leave and it all wilts back.
 */
export function BloomEdge({ children, flora = "blossom", colors = { stem: "#5d7a4a", a: "#f4a3bf", b: "#7fa86a", c: "#f6d47a" }, tone = { face: "#2b2330", label: "#fdf2f6" }, onClick, type = "button", className = "" }: BloomEdgeProps) {
  const btn = useRef<HTMLButtonElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const live = useRef<SVGGElement | null>(null);
  const calm = useRef(false);
  useEffect(() => { calm.current = matchMedia("(prefers-reduced-motion: reduce)").matches; }, []);

  const size = () => { const b = btn.current!; return { w: b.offsetWidth, h: b.offsetHeight, r: b.offsetHeight / 2 }; };

  const grow = (x: number, y: number) => {
    const root = svg.current; if (!root) return;
    if (live.current) wilt(true);
    const { w, h, r } = size(), L = length(w, h, r), s0 = nearest(w, h, r, x, y);
    root.setAttribute("viewBox", `${-PAD} ${-PAD} ${w + PAD * 2} ${h + PAD * 2}`);
    const g = document.createElementNS(NS, "g");
    root.appendChild(g); live.current = g;
    const still = calm.current;

    for (const dir of [1, -1] as const) {
      const p = document.createElementNS(NS, "path");
      p.setAttribute("d", vine(w, h, r, s0, dir, L / 2, 5));
      p.setAttribute("class", "bedge__stem");
      g.appendChild(p);
      const len = p.getTotalLength?.() ?? L / 2;
      p.style.strokeDasharray = `${len}`;
      if (still) { p.style.strokeDashoffset = "0"; p.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400 }); }
      else p.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: (len / GROW) * 1000, easing: "cubic-bezier(0.3, 0.1, 0.3, 1)", fill: "forwards" });
    }
    for (const s of spots(w, h, r, s0, flora === "frost" ? 15 : 17, 5)) {
      const j = jitter(s.i);
      const outer = document.createElementNS(NS, "g");
      outer.setAttribute("transform", `translate(${s.x.toFixed(1)} ${s.y.toFixed(1)}) rotate(${(s.angle + j * 28).toFixed(1)})`);
      const inner = document.createElementNS(NS, "g");
      inner.setAttribute("class", "bedge__piece");
      inner.innerHTML = piece(flora, s.i, j);
      outer.appendChild(inner); g.appendChild(outer);
      inner.dataset.dist = String(s.dist);
      const delay = still ? 0 : 80 + (s.dist / GROW) * 1000;
      if (still) { inner.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, fill: "forwards" }); continue; }
      inner.animate(flora === "fern"
        ? [{ transform: "rotate(-70deg) scale(0.1)", opacity: 0 }, { transform: "rotate(8deg) scale(1.05)", opacity: 1, offset: 0.7 }, { transform: "rotate(0) scale(1)", opacity: 1 }]
        : [{ transform: "scale(0)", opacity: 0 }, { transform: "scale(1.18)", opacity: 1, offset: 0.65 }, { transform: "scale(1)", opacity: 1 }],
        { duration: flora === "fern" ? 620 : 440, delay, easing: "cubic-bezier(0.3, 0.7, 0.3, 1.2)", fill: "both" });
      // now and then a petal lets go and drifts down
      if (flora === "blossom" && s.i % 3 === 0 && j > 0.2) {
        const petal = document.createElementNS(NS, "ellipse");
        Object.entries({ cx: "0", cy: "-12", rx: "2.4", ry: "3.4", fill: colors.a, class: "bedge__drift" }).forEach(([k, v]) => petal.setAttribute(k, v));
        outer.appendChild(petal);
        petal.animate([{ transform: "translate(0,0) rotate(0)", opacity: 0 }, { opacity: 0.95, offset: 0.1 }, { transform: `translate(${(j * 26).toFixed(0)}px, 34px) rotate(${(j * 240).toFixed(0)}deg)`, opacity: 0 }],
          { duration: 2200, delay: delay + 900 + j * 600, easing: "cubic-bezier(0.4, 0, 0.6, 1)", iterations: Infinity });
      }
      if (flora === "frost" && inner.querySelector(".bedge__glint")) {
        inner.animate([{ opacity: 1 }, { opacity: 0.2 }, { opacity: 1 }], { duration: 1600 + j * 400, delay: delay + 400, iterations: Infinity });
      }
    }
  };

  const wilt = (now = false) => {
    const g = live.current; if (!g) return;
    live.current = null;
    if (now || calm.current) { g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: now ? 120 : 260, fill: "forwards" }).onfinish = () => g.remove(); return; }
    const pieces = Array.from(g.querySelectorAll<SVGGElement>(".bedge__piece"));
    const far = Math.max(1, ...pieces.map((p) => Number(p.dataset.dist)));
    pieces.forEach((p) => {
      p.getAnimations().forEach((a) => a.cancel());
      p.animate([{ transform: "scale(1) rotate(0)", opacity: 1 }, { transform: "scale(0.2) rotate(40deg)", opacity: 0 }],
        { duration: 300, delay: ((far - Number(p.dataset.dist)) / far) * 260, easing: "ease-in", fill: "forwards" });
    });
    g.querySelectorAll(".bedge__drift").forEach((d) => (d as SVGElement).getAnimations().forEach((a) => a.cancel()));
    g.querySelectorAll<SVGPathElement>(".bedge__stem").forEach((p) => {
      const len = Number.parseFloat(p.style.strokeDasharray) || 0;
      p.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: -len }], { duration: 520, delay: 120, easing: "cubic-bezier(0.6, 0, 0.8, 0.4)", fill: "forwards" });
    });
    window.setTimeout(() => g.remove(), 760);
  };

  const at = (e: React.PointerEvent<HTMLButtonElement>) => { const r = e.currentTarget.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] as const; };

  return (
    <span className={`bedge bedge--${flora} ${className}`} style={{ ["--be-stem" as string]: colors.stem, ["--be-a" as string]: colors.a, ["--be-b" as string]: colors.b, ["--be-c" as string]: colors.c, ["--be-face" as string]: tone.face, ["--be-label" as string]: tone.label, ["--be-pad" as string]: `${PAD}px` } as CSSProperties}>
      <svg ref={svg} className="bedge__garden" aria-hidden="true" />
      <button ref={btn} type={type} className="bedge__btn" onClick={onClick}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") grow(...at(e)); }}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") wilt(); }}
        onPointerDown={(e) => { if (e.pointerType !== "mouse") { grow(...at(e)); window.setTimeout(() => wilt(), 2400); } }}
        onFocus={(e) => { if (e.currentTarget.matches(":focus-visible")) { const { w } = size(); grow(w / 2, 0); } }}
        onBlur={() => wilt()}>
        {children}
      </button>
    </span>
  );
}

export default BloomEdge;
