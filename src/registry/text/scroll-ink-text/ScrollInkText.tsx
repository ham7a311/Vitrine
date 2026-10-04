"use client";

import { Fragment, useEffect, useMemo, useRef } from "react";
import "./scroll-ink-text.css";

/**
 * Scroll Ink
 * A statement you read at the speed you scroll. The words wait in faint
 * ink and darken one after another as you go, a few words of soft edge
 * ahead of the reading point; the phrases that matter take the accent and
 * are underlined by hand the moment you reach them. At the end, a quiet
 * sign-off.
 *
 * Mark accent phrases in `text` with {{…}}.
 */

type Props = {
  text: string;
  signoff?: string;
  kicker?: string;
  theme?: "night" | "paper";
  motion?: "full" | "reduced";
  className?: string;
};

type Word = { w: string; mark: number; j: number; n: number };

const FADE = 5; // words of soft edge ahead of the reading point

export function ScrollInkText({ text, signoff, kicker = "Why we built Vitrine", theme = "night", motion = "full", className = "" }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Words, with which accent phrase (if any) each belongs to and its place in it.
  const words = useMemo(() => {
    const out: Word[] = [];
    let mark = -1, marks = 0;
    const parts = text.split(/(\{\{|\}\})/);
    let inside = false;
    for (const part of parts) {
      if (part === "{{") { inside = true; mark = marks++; continue; }
      if (part === "}}") { inside = false; continue; }
      const ws = part.split(/\s+/).filter(Boolean);
      const start = out.length;
      ws.forEach((w) => out.push({ w, mark: inside ? mark : -1, j: 0, n: 0 }));
      if (inside) for (let k = start; k < out.length; k++) { out[k].j = k - start; out[k].n = out.length - start; }
    }
    return out;
  }, [text]);

  useEffect(() => {
    const root = rootRef.current, sc = scrollRef.current, stage = stageRef.current;
    if (!root || !sc || !stage) return;
    const spans = Array.from(stage.querySelectorAll<HTMLElement>(".si__w"));
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    const still = motion === "reduced" || rm.matches;
    const N = spans.length;
    let raf = 0;

    const paint = () => {
      raf = 0;
      const max = sc.scrollHeight - sc.clientHeight;
      const p = still ? 1 : max > 0 ? Math.min(1, sc.scrollTop / (max * 0.9)) : 1;
      const head = p * (N + FADE + 3); // +3: room for the last phrase's underline to finish
      spans.forEach((s, i) => {
        const ink = Math.max(0, Math.min(1, (head - i) / FADE));
        s.style.setProperty("--ink", ink.toFixed(3));
        const wd = words[i];
        if (wd.mark >= 0) {
          // The underline runs along the phrase word by word once its last word is fully inked.
          const lastI = i - wd.j + wd.n - 1;
          const phrase = Math.max(0, Math.min(1, (head - lastI - FADE) / 2.2));
          const u = Math.max(0, Math.min(1, phrase * wd.n - wd.j));
          s.style.setProperty("--u", u.toFixed(3));
          s.toggleAttribute("data-lit", ink >= 0.999);
        }
      });
      root.style.setProperty("--p", p.toFixed(4));
      root.toggleAttribute("data-done", p >= 0.995);
      root.toggleAttribute("data-started", p > 0.02);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint); };
    paint();
    sc.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(onScroll);
    ro.observe(sc);
    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      sc.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [words, motion]);

  return (
    <section ref={rootRef} className={`si si--${theme} ${className}`} data-motion={motion} aria-label={kicker}>
      <div ref={scrollRef} className="si__scroll" tabIndex={0} aria-label={`${kicker} — scroll to read`}>
        <div className="si__track">
          <div ref={stageRef} className="si__stage">
            <div className="si__col">
            <p className="si__kicker" aria-hidden="true">{kicker}</p>
            <p className="si__text">
              {words.map((wd, i) => {
                // Inside a phrase the space travels with the word, so the underline runs unbroken.
                const joined = wd.mark >= 0 && wd.j < wd.n - 1;
                return (
                  <Fragment key={i}>
                    {i > 0 && !(words[i - 1].mark >= 0 && words[i - 1].j < words[i - 1].n - 1) && " "}
                    <span className="si__w" data-mark={wd.mark >= 0 || undefined}>{joined ? wd.w + " " : wd.w}</span>
                  </Fragment>
                );
              })}
            </p>
            {signoff && <p className="si__sign">{signoff}</p>}
            </div>
          </div>
        </div>
      </div>
      <div className="si__hint" aria-hidden="true">
        <span>Scroll</span>
        <svg viewBox="0 0 12 18"><path d="M6 1v15M1.5 11.5 6 16l4.5-4.5" /></svg>
      </div>
      <div className="si__rail" aria-hidden="true"><i /></div>
    </section>
  );
}
