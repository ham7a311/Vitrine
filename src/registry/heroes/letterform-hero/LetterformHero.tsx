"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./letterform-hero.css";

/**
 * Letterform Hero
 * A portfolio's first screen where the name is a set of windows. The huge
 * letters are cut out of the page and the work shows through them; pointing
 * at a project below changes the view, which wipes across the letters left to
 * right. Moving the pointer shifts the view a little, like looking through a
 * real window. Who you are and what you've made, in one look.
 */

export type LetterformProject = {
  title: string;
  kind: string;
  year: string;
  href: string;
  /** Any CSS background: `url(/work/vitrine.jpg) center / cover`, or a gradient. */
  cover: string;
};

type Props = {
  /** The word set in the letters. Short works best: a first name or a studio name. */
  word: string;
  /** Full name for the heading's accessible text. */
  name: string;
  role: string;
  note?: string;
  projects: LetterformProject[];
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
};

export function LetterformHero({ word, name, role, note, projects, theme = "night", motion = "full", className = "" }: Props) {
  const [view, setView] = useState({ active: 0, prev: -1 });
  const root = useRef<HTMLElement>(null);
  const user = useRef(false);
  const ruler = useRef<HTMLSpanElement>(null);

  // Fit the word to the width: measure it once at 100px and scale.
  useEffect(() => {
    const el = root.current!, r = ruler.current!;
    const fit = () => {
      const avail = el.querySelector<HTMLElement>(".lfh__name")!.clientWidth;
      const at100 = r.getBoundingClientRect().width;
      if (at100) el.style.setProperty("--lfh-fs", `${Math.min(el.clientHeight * 0.52, (avail / at100) * 100 * 0.995).toFixed(2)}px`);
    };
    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [word]);

  const show = (i: number) => setView((v) => (v.active === i ? v : { active: i, prev: v.active }));

  // Small parallax: the view behind the letters drifts against the pointer.
  useEffect(() => {
    const el = root.current!;
    if (motion === "reduced" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { el.style.setProperty("--lfh-px", `${(-x * 18).toFixed(1)}px`); el.style.setProperty("--lfh-py", `${(-y * 12).toFixed(1)}px`); });
    };
    el.addEventListener("pointermove", move);
    return () => { el.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, [motion]);

  // Without hover (phones), the view changes on its own until the visitor touches the list.
  useEffect(() => {
    if (!window.matchMedia("(hover: none)").matches || motion === "reduced" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => { if (!user.current) setView((v) => ({ active: (v.active + 1) % projects.length, prev: v.active })); }, 4200);
    return () => clearInterval(t);
  }, [projects.length, motion]);

  const current = projects[view.active];

  return (
    <section ref={root} className={`lfh lfh--${theme} ${className}`} data-motion={motion} aria-label="Introduction">
      <div className="lfh__top">
        <p className="lfh__role">{role}</p>
        {note && <p className="lfh__note"><span className="lfh__dot" aria-hidden="true" />{note}</p>}
      </div>

      <div className="lfh__mid">
      <h1 className="lfh__name">
        <span className="lfh__sr">{name}</span>
        <span className="lfh__stack" aria-hidden="true">
          <span className="lfh__layer lfh__layer--ghost">{word}</span>
          {view.prev >= 0 && <span key={`p${view.prev}`} className="lfh__layer" style={{ "--lfh-cover": projects[view.prev].cover } as CSSProperties}>{word}</span>}
          <span key={`a${view.active}`} className="lfh__layer lfh__layer--in" data-first={view.prev < 0 || undefined} style={{ "--lfh-cover": current.cover } as CSSProperties}>{word}</span>
        </span>
      </h1>

      <p className="lfh__caption" aria-hidden="true">
        <span>Through the letters</span>
        <span key={view.active} className="lfh__caption-name">{current.title}, {current.year}</span>
      </p>
      </div>
      <span ref={ruler} className="lfh__ruler" aria-hidden="true">{word}</span>

      <ol className="lfh__list" onPointerDown={() => (user.current = true)}>
        {projects.map((p, i) => (
          <li key={p.title}>
            <a
              href={p.href}
              className="lfh__row"
              data-on={view.active === i || undefined}
              onPointerEnter={() => show(i)}
              onFocus={() => { user.current = true; show(i); }}
            >
              <span className="lfh__n">{String(i + 1).padStart(2, "0")}</span>
              <span className="lfh__title">{p.title}</span>
              <span className="lfh__kind">{p.kind}</span>
              <span className="lfh__year">{p.year}</span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
