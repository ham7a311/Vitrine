"use client";
import { useEffect, useRef, type CSSProperties } from "react";
import { progress, scroller } from "../../media/helix-showcase/helix";
import { lineFills } from "./fill";
import "./scroll-outline-text.css";

export type ScrollOutlineTextProps = {
  /** One string per line; the lines fill one after another as you scroll. */
  lines: string[];
  /** Scroll length of the section, in viewport heights. */
  length?: number;
  theme?: "light" | "dark";
  className?: string;
};

/**
 * Scroll Outline Text
 * Big hairline lettering on a sticky stage that fills with ink line by line as
 * you scroll through the section.
 */
export function ScrollOutlineText({ lines, length = 2.2, theme = "light", className = "" }: ScrollOutlineTextProps) {
  const root = useRef<HTMLElement>(null);

  // Each line's fill follows the reader's progress through the section.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const box = scroller(el), page = box === document.scrollingElement;
    const target: EventTarget = page ? window : box;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const top = r.top - (page ? 0 : box.getBoundingClientRect().top);
      const p = progress(top, r.height, page ? innerHeight : box.clientHeight);
      lineFills(p, lines.length).forEach((f, i) => el.style.setProperty(`--sotx-f${i}`, f.toFixed(4)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    target.addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(raf); target.removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); };
  }, [lines.length]);

  return (
    <section ref={root} className={`sotx ${theme === "dark" ? "sotx--dark" : ""} ${className}`} style={{ height: `${length * 100}svh` }}>
      <div className="sotx__stage">
        <h2 className="sotx__lines">
          {lines.map((l, i) => (
            <span key={i} className="sotx__line" style={{ ["--f" as string]: `var(--sotx-f${i}, 0)` } as CSSProperties}>
              <span className="sotx__outline">{l}</span>
              <span className="sotx__ink" aria-hidden="true">{l}</span>
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
