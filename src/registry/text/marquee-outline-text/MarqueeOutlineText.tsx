"use client";
import "./marquee-outline-text.css";

export type MarqueeOutlineTextProps = {
  /** The words, split between two rows; they alternate hairline and solid. */
  words: string[];
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

/**
 * Marquee Outline Text
 * Two rows of big words sliding past each other in opposite directions,
 * alternating hairline and solid, with a small star between them.
 */
export function MarqueeOutlineText({ words, theme = "light", motion = true, className = "" }: MarqueeOutlineTextProps) {
  const half = Math.ceil(words.length / 2);
  const rows = [words.slice(0, half), words.slice(half)];
  return (
    <section className={`motx ${theme === "dark" ? "motx--dark" : ""} ${motion ? "" : "motx--still"} ${className}`} aria-label={words.join(", ")}>
      {rows.map((row, r) => (
        <div key={r} className={`motx__row motx__row--${r ? "back" : "fwd"}`} aria-hidden="true">
          <div className="motx__track">
            {[0, 1].map((copy) => (
              <span key={copy} className="motx__run">
                {row.map((w, i) => <span key={i} className={(i + r) % 2 ? "motx__solid" : "motx__hollow"}>{w}<i>✦</i></span>)}
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
