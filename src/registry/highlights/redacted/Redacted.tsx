"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { bar, mergeLines, type Box } from "./bars";
import "./redacted.css";

/**
 * Redacted
 * Words blacked out with a marker, one rough bar per line. Press and hold
 * (or hold Space) to peek: the bars pull back to the right and the words show,
 * lightly marked as declassified; let go and the marker sweeps over them again.
 * A page can open them all at once, one after another.
 */

type Props = {
  children: ReactNode;
  /** Open from outside, e.g. a "declassify" control. */
  revealed?: boolean;
  /** Position in the sequence when everything opens at once (staggers the reveal). */
  order?: number;
  theme?: "paper" | "night";
  className?: string;
};

export function Redacted({ children, revealed = false, order = 0, theme = "paper", className = "" }: Props) {
  const text = useRef<HTMLSpanElement>(null);
  const origin = useRef<HTMLSpanElement>(null);
  const [lines, setLines] = useState<Box[]>([]);
  const [fs, setFs] = useState(16);
  const [held, setHeld] = useState(false);
  const [seed, setSeed] = useState(1);

  useLayoutEffect(() => {
    const el = text.current, o = origin.current;
    if (!el || !o) return;
    const read = () => {
      const base = o.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(el);
      const next = mergeLines(Array.from(range.getClientRects(), (r) => ({ x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height })));
      setLines((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
      setFs(parseFloat(window.getComputedStyle(el).fontSize) || 16);
      setSeed(Array.from(el.textContent ?? "").reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7));
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el.closest("p, h1, h2, h3, h4, li, blockquote, div") ?? document.body);
    window.addEventListener("resize", read);
    let alive = true;
    document.fonts?.ready.then(() => alive && read());
    return () => { alive = false; ro.disconnect(); window.removeEventListener("resize", read); };
  }, [children]);

  // Letting go anywhere (or the window losing focus) closes a peek.
  useEffect(() => {
    if (!held) return;
    const up = () => setHeld(false);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("blur", up);
    return () => { window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up); window.removeEventListener("blur", up); };
  }, [held]);

  const open = revealed || held;
  const key = (e: KeyboardEvent, down: boolean) => {
    if (e.key !== " " && e.key !== "Enter") return;
    e.preventDefault();
    if (down && e.repeat) return;
    setHeld(down);
  };

  return (
    <span
      className={`redact redact--${theme} ${className}`}
      data-open={open || undefined}
      role="button"
      tabIndex={0}
      aria-pressed={open}
      style={{ ["--order" as string]: revealed ? order : 0 } as CSSProperties}
      onPointerDown={(e) => { e.preventDefault(); setHeld(true); }}
      onKeyDown={(e) => key(e, true)}
      onKeyUp={(e) => key(e, false)}
      onBlur={() => setHeld(false)}
    >
      <span ref={origin} className="redact__origin" aria-hidden="true" />
      {!open && <span className="redact__sr">Redacted: </span>}
      <span ref={text} className="redact__text">{children}</span>
      <svg className="redact__ink" aria-hidden="true">
        {lines.map((b, k) => (
          <path key={k} className="redact__bar" d={bar(b, fs, seed + k * 13)} style={{ ["--k" as string]: k } as CSSProperties} />
        ))}
      </svg>
    </span>
  );
}

export default Redacted;
