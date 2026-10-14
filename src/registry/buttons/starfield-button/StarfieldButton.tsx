"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { lines, sky } from "./stars";
import { nearest } from "./perimeter";
import "./starfield-button.css";

export type StarfieldButtonProps = {
  children: ReactNode;
  /** Star, bright star and line colours, and the button's face and label. */
  palette?: { star: string; bright: string; line: string; face: string; label: string };
  /** How many stars ring the button. */
  count?: number;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  className?: string;
};

const PAD = 32, NS = "http://www.w3.org/2000/svg";

/**
 * Starfield Button
 * A night-sky pill. Point at it and stars blink on just outside its edge, nearest first, then fine
 * lines join them into a constellation that slowly drifts; a press sends a shooting star across it.
 */
export function StarfieldButton({ children, palette = { star: "#f4f1ff", bright: "#ffd88a", line: "rgba(214, 206, 255, 0.55)", face: "#0f1230", label: "#f4f1ff" }, count = 18, onClick, type = "button", className = "" }: StarfieldButtonProps) {
  const btn = useRef<HTMLButtonElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const live = useRef<SVGGElement | null>(null);
  const calm = useRef(false);
  useEffect(() => { calm.current = matchMedia("(prefers-reduced-motion: reduce)").matches; }, []);
  const size = () => { const b = btn.current!; return { w: b.offsetWidth, h: b.offsetHeight, r: b.offsetHeight / 2 }; };

  const show = (x: number, y: number) => {
    const root = svg.current; if (!root) return;
    hide(true);
    const { w, h, r } = size(), s0 = nearest(w, h, r, x, y), still = calm.current;
    root.setAttribute("viewBox", `${-PAD} ${-PAD} ${w + PAD * 2} ${h + PAD * 2}`);
    const g = document.createElementNS(NS, "g");
    g.setAttribute("class", "sfield__sky");
    g.style.transformOrigin = `${w / 2}px ${h / 2}px`;
    root.appendChild(g); live.current = g;
    const stars = sky(w, h, r, s0, count);
    const far = Math.max(...stars.map((s) => s.dist));
    const at = (d: number) => 60 + (d / far) * 520;

    for (const [a, b] of lines(stars)) {
      const l = document.createElementNS(NS, "line");
      Object.entries({ x1: a.x, y1: a.y, x2: b.x, y2: b.y }).forEach(([k, v]) => l.setAttribute(k, v.toFixed(1)));
      l.setAttribute("class", "sfield__line");
      g.appendChild(l);
      const len = Math.hypot(b.x - a.x, b.y - a.y);
      l.style.strokeDasharray = `${len}`;
      if (still) { l.style.strokeDashoffset = "0"; continue; }
      l.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 380, delay: at(Math.max(a.dist, b.dist)) + 260, easing: "ease-out", fill: "both" });
    }
    for (const s of stars) {
      const c = document.createElementNS(NS, "g");
      c.setAttribute("transform", `translate(${s.x.toFixed(1)} ${s.y.toFixed(1)})`);
      const glow = s.bright ? `<circle r="${(s.size * 3.2).toFixed(1)}" fill="${palette.bright}" opacity="0.18"/>` : "";
      const spike = s.bright ? `<path d="M0 ${-s.size * 3.4}V${s.size * 3.4}M${-s.size * 3.4} 0H${s.size * 3.4}" stroke="${palette.bright}" stroke-width="0.6" opacity="0.8"/>` : "";
      c.innerHTML = `<g class="sfield__star">${glow}${spike}<circle r="${s.size.toFixed(2)}" fill="${s.bright ? palette.bright : palette.star}"/></g>`;
      g.appendChild(c);
      const star = c.firstElementChild as SVGGElement;
      if (still) continue;
      star.animate([{ transform: "scale(0)", opacity: 0 }, { transform: "scale(1.8)", opacity: 1, offset: 0.4 }, { transform: "scale(1)", opacity: 1 }], { duration: 420, delay: at(s.dist), easing: "ease-out", fill: "both" });
      star.animate([{ opacity: 1 }, { opacity: 0.35 }, { opacity: 1 }], { duration: 1800 + s.size * 900, delay: at(s.dist) + 600, iterations: Infinity, easing: "ease-in-out" });
    }
    if (still) g.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400 });
    else g.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(5deg)" }], { duration: 14000, delay: 900, iterations: Infinity, direction: "alternate", easing: "ease-in-out" });
  };

  const hide = (now = false) => {
    const g = live.current; if (!g) return;
    live.current = null;
    g.animate([{ opacity: 1, filter: "blur(0)" }, { opacity: 0, filter: "blur(2px)" }], { duration: now ? 100 : 380, fill: "forwards", easing: "ease-in" }).onfinish = () => g.remove();
  };

  const shoot = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (calm.current) return;
    const b = btn.current!, el = document.createElement("i");
    el.className = "sfield__shoot";
    b.appendChild(el);
    const w = b.offsetWidth, h = b.offsetHeight, y0 = h * (0.2 + Math.random() * 0.25);
    el.animate([{ transform: `translate(${w * 0.1}px, ${y0}px) rotate(18deg) scaleX(0.2)`, opacity: 0 }, { opacity: 1, offset: 0.2 }, { transform: `translate(${w * 0.9}px, ${y0 + h * 0.35}px) rotate(18deg) scaleX(1)`, opacity: 0 }],
      { duration: 520, easing: "cubic-bezier(0.3, 0, 0.6, 1)" }).onfinish = () => el.remove();
    void e;
  };

  const at = (e: React.PointerEvent<HTMLButtonElement>) => { const r = e.currentTarget.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] as const; };
  return (
    <span className={`sfield ${className}`} style={{ ["--sf-face" as string]: palette.face, ["--sf-label" as string]: palette.label, ["--sf-line" as string]: palette.line, ["--sf-star" as string]: palette.star, ["--sf-bright" as string]: palette.bright, ["--sf-pad" as string]: `${PAD}px` } as CSSProperties}>
      <svg ref={svg} className="sfield__night" aria-hidden="true" />
      <button ref={btn} type={type} className="sfield__btn" onClick={onClick}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") show(...at(e)); }}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") hide(); }}
        onPointerDown={(e) => { shoot(e); if (e.pointerType !== "mouse") { show(...at(e)); window.setTimeout(() => hide(), 2600); } }}
        onFocus={(e) => { if (e.currentTarget.matches(":focus-visible")) show(size().w / 2, 0); }}
        onBlur={() => hide()}>
        <span className="sfield__dust" aria-hidden="true" />
        <span className="sfield__label">{children}</span>
      </button>
    </span>
  );
}

export default StarfieldButton;
