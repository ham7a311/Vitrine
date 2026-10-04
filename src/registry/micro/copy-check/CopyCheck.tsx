"use client";

import { useEffect, useRef, useState } from "react";
import "./copy-check.css";

/**
 * Copy Check
 * A copy button that answers: the two sheets of the clipboard slide together and fold into a
 * tick, the label rolls from "Copy" to "Copied", and after a moment it all rolls back.
 */

type Props = { text: string; label?: string; doneLabel?: string; className?: string };

export function CopyCheck({ text, label = "Copy", doneLabel = "Copied", className = "" }: Props) {
  const [done, setDone] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);
  const copy = async () => {
    // Confirm straight away; the write itself can take a moment (or wait on a permission).
    setDone(true);
    clearTimeout(t.current);
    t.current = setTimeout(() => setDone(false), 1800);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
  };
  return (
    <button type="button" className={`cc ${className}`} data-done={done ? "" : undefined} onClick={copy}>
      <svg className="cc__icon" viewBox="0 0 24 24" aria-hidden="true">
        <rect className="cc__back" x="8.5" y="3.5" width="12" height="13" rx="2.5" />
        <rect className="cc__front" x="3.5" y="7.5" width="12" height="13" rx="2.5" />
        <path className="cc__tick" pathLength={1} d="M5.5 12.6l4.2 4.2L18.6 7.4" />
      </svg>
      <span className="cc__label">
        <span className="cc__reel">
          <span>{label}</span>
          <span aria-hidden={!done}>{doneLabel}</span>
        </span>
      </span>
      <span className="cc__sr" role="status">
        {done ? `${doneLabel} to clipboard` : ""}
      </span>
    </button>
  );
}
