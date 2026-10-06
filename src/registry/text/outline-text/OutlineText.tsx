"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { progress, scroller } from "../../media/helix-showcase/helix";
import { lineFills } from "./fill";
import "./outline-text.css";

export type OutlineTextProps = {
  /** hover: words fill as you point at them; scroll: lines fill as you scroll; echo: stacked outlines that follow the pointer; marquee: rows of outline and solid words sliding past. */
  effect?: "hover" | "scroll" | "echo" | "marquee";
  /** One string per line (hover, scroll), the word (echo), or the words of the rows (marquee). */
  lines: string[];
  /** Scroll length of the section in viewport heights (scroll only). */
  length?: number;
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

const ECHOES = 5;

/**
 * Outline Text
 * Big hairline lettering that fills with ink: word by word under the
 * pointer, line by line with the scroll, as a stack of outlines that lean
 * away from the pointer, or in rows of outline and solid words sliding past.
 */
export function OutlineText({ effect = "hover", lines, length = 2.2, theme = "light", motion = true, className = "" }: OutlineTextProps) {
  const root = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);
  const cls = `otxt otxt--${effect} ${theme === "dark" ? "otxt--dark" : ""} ${motion ? "" : "otxt--still"} ${className}`;

  // Hover: the words fill once in sequence when the headline first comes into view.
  useEffect(() => {
    const el = root.current;
    if (!el || effect !== "hover") return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [effect]);

  // Scroll: each line's fill follows the reader's progress through the section.
  useEffect(() => {
    const el = root.current;
    if (!el || effect !== "scroll") return;
    const box = scroller(el), page = box === document.scrollingElement;
    const target: EventTarget = page ? window : box;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const top = r.top - (page ? 0 : box.getBoundingClientRect().top);
      const p = progress(top, r.height, page ? innerHeight : box.clientHeight);
      lineFills(p, lines.length).forEach((f, i) => el.style.setProperty(`--otxt-f${i}`, f.toFixed(4)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    target.addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(raf); target.removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); };
  }, [effect, lines.length]);

  // Echo: the outlines lean away from the pointer, and sway slowly when it's away.
  useEffect(() => {
    const el = root.current;
    if (!el || effect !== "echo") return;
    const still = !motion || matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, hover = false, t = 0, last = 0;
    const set = (x: number, y: number) => { el.style.setProperty("--otxt-dx", `${x.toFixed(2)}px`); el.style.setProperty("--otxt-dy", `${y.toFixed(2)}px`); };
    const sway = (now: number) => {
      raf = 0;
      if (hover) return;
      t += last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      set(6 + 3 * Math.sin(t * 0.8), 6 + 3 * Math.cos(t * 0.6));
      raf = requestAnimationFrame(sway);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
      hover = true; cancelAnimationFrame(raf); raf = 0;
      // Away from the pointer, further the closer it is to the edge.
      set(-nx * 26, -ny * 26);
    };
    const leave = () => { hover = false; last = 0; if (!still) { if (!raf) raf = requestAnimationFrame(sway); } else set(6, 6); };
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting && !still && !hover) { if (!raf) raf = requestAnimationFrame(sway); } else { cancelAnimationFrame(raf); raf = 0; } });
    set(6, 6);
    io.observe(el);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { cancelAnimationFrame(raf); io.disconnect(); el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, [effect, motion]);

  if (effect === "scroll") {
    return (
      <section ref={root} className={cls} style={{ height: `${length * 100}svh` }}>
        <div className="otxt__stage">
          <h2 className="otxt__lines">
            {lines.map((l, i) => (
              <span key={i} className="otxt__line" style={{ ["--f" as string]: `var(--otxt-f${i}, 0)` } as CSSProperties}>
                <span className="otxt__outline">{l}</span>
                <span className="otxt__ink" aria-hidden="true">{l}</span>
              </span>
            ))}
          </h2>
        </div>
      </section>
    );
  }

  if (effect === "echo") {
    const word = lines.join(" ");
    return (
      <section ref={root} className={cls} aria-label={word}>
        <div className="otxt__echo" aria-hidden="true">
          {Array.from({ length: ECHOES }, (_, k) => (
            <span key={k} className="otxt__ghost" style={{ ["--k" as string]: ECHOES - k } as CSSProperties}>{word}</span>
          ))}
          <span className="otxt__front">{word}</span>
        </div>
      </section>
    );
  }

  if (effect === "marquee") {
    const half = Math.ceil(lines.length / 2);
    const rows = [lines.slice(0, half), lines.slice(half)];
    return (
      <section ref={root} className={cls} aria-label={lines.join(", ")}>
        {rows.map((row, r) => (
          <div key={r} className={`otxt__row otxt__row--${r ? "back" : "fwd"}`} aria-hidden="true">
            <div className="otxt__track">
              {[0, 1].map((copy) => (
                <span key={copy} className="otxt__run">
                  {row.map((w, i) => <span key={i} className={(i + r) % 2 ? "otxt__solid" : "otxt__hollow"}>{w}<i>✦</i></span>)}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>
    );
  }

  let n = 0;
  return (
    <section ref={root} className={cls} data-seen={seen || undefined}>
      <h2 className="otxt__words">
        {lines.map((l, i) => (
          <span key={i} className="otxt__wline">
            {l.split(" ").map((w, j) => (
              <span key={j} className="otxt__w" data-text={w} style={{ ["--i" as string]: n++ } as CSSProperties}>{w}</span>
            ))}
          </span>
        ))}
      </h2>
    </section>
  );
}
