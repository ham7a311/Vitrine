"use client";

import { useEffect, useRef, useState } from "react";
import "./command-pill.css";

/**
 * Command Pill
 * The install command sits in a mono pill with a prompt glyph. When it scrolls
 * into view it types itself once. Clicking copies it: the command lifts up
 * and out while "Copied to clipboard" rises into its place, and the copy icon
 * becomes a check — then it all settles back.
 */

type Props = { command: string; prompt?: string; className?: string };

export function CommandPill({ command, prompt = "$", className = "" }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const [typed, setTyped] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const el = ref.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setTyped(command.length); return; }
    let id: ReturnType<typeof setInterval>;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let n = 0;
      id = setInterval(() => { n += 1; setTyped(n); if (n >= command.length) clearInterval(id); }, 38);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); clearInterval(id); };
  }, [command]);

  const copy = async () => {
    try { await navigator.clipboard?.writeText(command); } catch { /* still confirm */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button ref={ref} type="button" className={`command-pill ${className}`} data-copied={copied || undefined} onClick={copy} aria-label={`Copy command: ${command}`}>
      <span className="command-pill__prompt" aria-hidden="true">{prompt}</span>
      <span className="command-pill__stage" aria-hidden="true">
        <span className="command-pill__cmd">
          {command.slice(0, typed)}
          {typed < command.length && <i className="command-pill__caret" />}
          <span className="command-pill__ghost">{command.slice(typed)}</span>
        </span>
        <span className="command-pill__done">Copied to clipboard</span>
      </span>
      <span className="command-pill__icon" aria-hidden="true">
        <svg viewBox="0 0 16 16"><rect x="5.5" y="5.5" width="7" height="7" rx="1.5" /><path d="M10.5 5.5V4A1.5 1.5 0 0 0 9 2.5H4A1.5 1.5 0 0 0 2.5 4v5A1.5 1.5 0 0 0 4 10.5h1.5" /></svg>
        <svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" /></svg>
      </span>
      <span className="command-pill__sr" aria-live="polite">{copied ? "Copied" : ""}</span>
    </button>
  );
}
