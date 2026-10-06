"use client";
import { useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { columnAt, columns } from "./cloud";
import "./column-bloom.css";

export type BloomPartner = { name: string; mark: ReactNode };
export type ColumnBloomProps = {
  /** The name set large in the middle. */
  wordmark: string;
  partners?: BloomPartner[];
  /** Up to about twenty short words, placed around the glow. */
  keywords: string[];
  label?: string;
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

// The skyline: centre, then each pair outward — [width, top %, bottom inset %].
const STEPS: [number, number, number][] = [[2.2, 0, 0], [1, 0, 0], [1, 16, 0], [1, 40, 6], [0.55, 45, 18]];
// Where words sit, as [x %, y %, depth]; depth sets how far they drift with the pointer.
const SPOTS: [number, number, number][] = [
  [8, 3, 0.9], [27, 6, 0.6], [47.5, 12, 0.3], [80, 3, 0.8], [73, 14, 0.5], [88, 17, 0.9], [13, 23, 0.7], [27, 29, 0.4],
  [72, 37, 0.4], [6.5, 38, 1], [19, 46, 0.6], [8, 54, 0.9], [92, 57, 1], [83, 69, 0.7], [37, 80, 0.3], [63, 84, 0.35],
  [10, 84, 0.9], [23, 94, 0.7], [91, 86, 0.8], [57, 96, 0.4],
];

/**
 * Column Bloom
 * A stepped skyline of glowing columns, hottest in the middle and softening
 * outward into the page, with the product name at its heart and the things it
 * does scattered around it, white where they cross the glow and coloured where
 * they sit on paper.
 */
export function ColumnBloom({ wordmark, partners = [], keywords, label = "Overview", theme = "light", motion = true, className = "" }: ColumnBloomProps) {
  const cols = useMemo(() => columns(STEPS), []);
  const [lit, setLit] = useState(-1);
  const root = useRef<HTMLElement>(null);
  const words = keywords.slice(0, SPOTS.length).map((w, i) => {
    const [x, y, d] = SPOTS[i];
    // Softer columns need a wider margin before a word counts as sitting on them.
    const on = columnAt(cols, x, y, 7);
    return { w, x, y, d, on: on >= 0 && cols[on].level >= 2 && (y < cols[on].top + 6 + cols[on].level * 3 || y > 100 - cols[on].bottom - 12) ? -1 : on };
  });

  const onMove = (e: ReactPointerEvent<HTMLElement>) => {
    const el = root.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--cbloom-px", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    el.style.setProperty("--cbloom-py", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
  };
  const onLeave = () => { root.current?.style.setProperty("--cbloom-px", "0"); root.current?.style.setProperty("--cbloom-py", "0"); setLit(-1); };

  return (
    <section ref={root} className={`cbloom cbloom--${theme} ${className}`} data-motion={motion ? undefined : "off"} onPointerMove={onMove} onPointerLeave={onLeave} aria-label={label}>
      <div className="cbloom__glow" aria-hidden="true">
        {cols.map((c, i) => (
          <i
            key={i}
            className="cbloom__col"
            data-level={c.level}
            data-lit={lit === i || undefined}
            style={{ left: `${c.x0}%`, width: `${c.x1 - c.x0 + 0.05}%`, top: `${c.top}%`, bottom: `${c.bottom}%`, "--cbloom-blur": `${c.blur}px`, "--cbloom-delay": `${-((i * 1.7) % 7)}s` } as CSSProperties}
          />
        ))}
        <i className="cbloom__haze" />
        <i className="cbloom__band" />
      </div>

      <div className="cbloom__core">
        <h2 className="cbloom__mark">{wordmark}</h2>
        {partners.length > 0 && (
          <ul className="cbloom__partners" aria-label="Works with">
            {partners.map((p, i) => (
              <li key={p.name}>
                {i > 0 && <span className="cbloom__x" aria-hidden="true">×</span>}
                <span className="cbloom__partner"><span className="cbloom__pmark" aria-hidden="true">{p.mark}</span>{p.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ul className="cbloom__words">
        {words.map(({ w, x, y, d, on }, i) => (
          <li
            key={w}
            className="cbloom__word"
            data-on={on >= 0 || undefined}
            data-tier={i % 3 === 0 ? undefined : i % 3 === 2 ? "3" : "2"}
            style={{ "--cbloom-x": `${x}%`, top: `${y}%`, "--cbloom-hw": `${(w.length * 0.36 + 0.7).toFixed(2)}em`, "--cbloom-d": d, "--cbloom-i": i } as CSSProperties}
            onPointerEnter={() => setLit(on)}
            onPointerLeave={() => setLit(-1)}
          >
            <span>{w}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
