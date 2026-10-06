"use client";
import type { HTMLAttributes } from "react";
import { STATUS, type Mark, type Status } from "./status";
import "./status-badge.css";

export type { Status } from "./status";
export type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  status: Status;
  /** soft: tinted pill; outline: hairline pill; solid: filled pill; dot: just the mark and the word. */
  look?: "soft" | "outline" | "solid" | "dot";
  size?: "sm" | "md";
  /** Override the word ("Shipped" instead of "Confirmed"). */
  label?: string;
  theme?: "light" | "dark";
};

function MarkIcon({ mark }: { mark: Mark }) {
  switch (mark) {
    case "pulse": return <span className="stbg__pulse" />;
    case "dot": return <span className="stbg__dot" />;
    case "ring": return <span className="stbg__dot stbg__dot--ring" />;
    case "minus": return <span className="stbg__dot stbg__dot--minus" />;
    case "moon": return <svg viewBox="0 0 12 12"><path d="M10 7.6A4.3 4.3 0 0 1 4.4 2 4.3 4.3 0 1 0 10 7.6Z" fill="currentColor" /></svg>;
    case "check": return <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m2.5 6.3 2.3 2.2 4.7-5" /></svg>;
    case "spin": return <span className="stbg__spin" />;
    case "cross": return <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="m3.3 3.3 5.4 5.4M8.7 3.3 3.3 8.7" /></svg>;
    case "alert": return <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><path d="M6 1.6 11 10.4H1Z" /><path d="M6 5v2.3M6 8.8v.1" strokeLinecap="round" /></svg>;
    case "spark": return <svg viewBox="0 0 12 12"><path d="M6 1c.3 2.6 1.4 3.7 4 4-2.6.3-3.7 1.4-4 4-.3-2.6-1.4-3.7-4-4 2.6-.3 3.7-1.4 4-4Z" fill="currentColor" /></svg>;
  }
}

/**
 * Status Badge
 * Small, quiet pills for the states a product shows all day: live, presence,
 * confirmed, pending, cancelled, warning, failed, beta and new. Colour is
 * never the only signal; every state has its own mark and word.
 */
export function StatusBadge({ status, look = "soft", size = "md", label, theme = "light", className = "", ...rest }: StatusBadgeProps) {
  const s = STATUS[status];
  return (
    <span className={`stbg stbg--${look} stbg--${s.tone} stbg--${size} ${theme === "dark" ? "stbg--dark" : ""} ${className}`} data-status={status} {...rest}>
      <span className="stbg__mark" aria-hidden="true"><MarkIcon mark={s.mark} /></span>
      {label ?? s.label}
    </span>
  );
}
