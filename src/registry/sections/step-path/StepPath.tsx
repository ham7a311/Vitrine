"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import "./step-path.css";

/**
 * Step Path
 * One continuous line connects the steps. Its drawn length is tied to scroll
 * position, so reading down the section literally draws the path. Each step
 * knows where along the line it sits; when the line passes it, its node fills
 * and its copy comes up to full contrast.
 */

export type PathStep = { title: string; body: string; meta?: string };

type Props = { steps: PathStep[]; scrollRef?: RefObject<HTMLElement | null>; accent?: string; className?: string };

export function StepPath({ steps, scrollRef, accent = "#b9cce4", className = "" }: Props) {
  const wrap = useRef<HTMLOListElement>(null);
  const [p, setP] = useState(0);
  const [marks, setMarks] = useState<number[]>([]);

  // where each node sits along the rail (0..1)
  useLayoutEffect(() => {
    const el = wrap.current!;
    const read = () => {
      const h = el.offsetHeight || 1;
      setMarks(Array.from(el.querySelectorAll<HTMLElement>(".step-path__node")).map((n) => (n.offsetTop + n.offsetHeight / 2) / h));
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [steps]);

  useEffect(() => {
    const root = scrollRef?.current ?? null;
    const target: HTMLElement | Window = root ?? window;
    let raf = 0;
    const read = () => {
      raf = 0;
      const r = wrap.current!.getBoundingClientRect();
      const vh = root ? root.getBoundingClientRect() : { top: 0, height: window.innerHeight };
      // the line's tip tracks a point 60% down the viewport
      const tip = vh.top + vh.height * 0.6;
      setP(Math.max(0, Math.min(1, (tip - r.top) / r.height)));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(read); };
    read();
    target.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { target.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [scrollRef]);

  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const prog = reduce ? 1 : p;

  return (
    <ol ref={wrap} className={`step-path ${className}`} style={{ "--sp-accent": accent, "--sp-p": prog } as CSSProperties}>
      <span className="step-path__rail" aria-hidden="true"><span className="step-path__ink" /></span>
      {steps.map((s, i) => {
        const reached = prog >= (marks[i] ?? 1) - 0.005;
        return (
          <li key={s.title} className="step-path__step" data-reached={reached || undefined}>
            <span className="step-path__node" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <div className="step-path__copy">
              {s.meta && <p className="step-path__meta">{s.meta}</p>}
              <h3 className="step-path__title">{s.title}</h3>
              <p className="step-path__body">{s.body}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
