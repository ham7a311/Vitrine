"use client";
import { useState, type CSSProperties } from "react";
import "./initial-fold.css";

export function InitialFold({ name, folded: initial = true, className = "" }: { name: string; folded?: boolean; className?: string }) {
  const [folded, setFolded] = useState(initial);
  const words = name.split(/\s+/).filter(Boolean);
  return (
    <button type="button" className={`initial-fold ${className}`} data-folded={folded || undefined} aria-pressed={!folded} aria-label={name}
      onMouseEnter={() => setFolded(false)} onMouseLeave={() => setFolded(true)} onFocus={() => setFolded(false)} onBlur={() => setFolded(true)}
      onClick={() => setFolded((f) => !f)}>
      {words.map((w, i) => (
        <span key={i} className="initial-fold__word" aria-hidden="true" style={{ "--i": i } as CSSProperties}>
          <span className="initial-fold__ini">{w[0]}</span>
          <span className="initial-fold__dot">.</span>
          <span className="initial-fold__rest"><span>{w.slice(1)}</span></span>
        </span>
      ))}
    </button>
  );
}
