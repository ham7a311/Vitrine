"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import "./focus-lock.css";

/**
 * Focus Lock
 * A word found the way a camera finds focus: four viewfinder brackets hunt in
 * from wide while the word is soft, then lock onto it — a small overshoot, a
 * flash in the accent colour — as the word snaps sharp. Point at it and the
 * brackets hunt and lock again.
 */

type Props = {
  children: ReactNode;
  /** Colour of the brackets once locked. */
  color?: string;
  /** Wait before hunting (ms). */
  delay?: number;
  theme?: "night" | "paper";
  className?: string;
};

type Phase = "idle" | "hunt" | "lock";

export function FocusLock({ children, color, delay = 200, theme = "night", className = "" }: Props) {
  const root = useRef<HTMLSpanElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<number[]>([]);

  const after = (ms: number, fn: () => void) => { timers.current.push(window.setTimeout(fn, ms)); };
  const clear = () => { timers.current.forEach((t) => window.clearTimeout(t)); timers.current = []; };

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setPhase("lock"); return; }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      after(delay, () => setPhase("hunt"));
      after(delay + 460, () => setPhase("lock"));
    }, { threshold: 0.8 });
    io.observe(el);
    return () => { io.disconnect(); clear(); };
  }, [delay]);

  // Pointing at a locked word makes the camera hunt and lock again.
  const refocus = () => {
    if (phase !== "lock" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    clear();
    setPhase("hunt");
    after(320, () => setPhase("lock"));
  };

  return (
    <span
      ref={root}
      className={`focuslock focuslock--${theme} ${className}`}
      data-phase={phase}
      style={color ? ({ ["--lock" as string]: color } as CSSProperties) : undefined}
      onPointerEnter={refocus}
    >
      <span className="focuslock__word">{children}</span>
      <span className="focuslock__frame" aria-hidden="true">
        <i className="focuslock__c focuslock__c--tl" />
        <i className="focuslock__c focuslock__c--tr" />
        <i className="focuslock__c focuslock__c--br" />
        <i className="focuslock__c focuslock__c--bl" />
      </span>
    </span>
  );
}

export default FocusLock;
