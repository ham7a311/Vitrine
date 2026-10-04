"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./prompt-starters.css";

/**
 * Prompt Starters
 * The card is only a title; the composer is where the prompt appears. Pointing
 * at a card types its full prompt into the composer as faint ghost text, so
 * you read the real thing in the place it will live. Clicking commits it.
 */

export type Starter = { title: string; hint: string; prompt: string; icon: string };

type Props = { starters: Starter[]; theme?: "paper" | "night"; className?: string };

export function PromptStarters({ starters, theme = "paper", className = "" }: Props) {
  const [preview, setPreview] = useState<number | null>(null);
  const [typed, setTyped] = useState(0);
  const [text, setText] = useState("");
  const [flash, setFlash] = useState(0);
  const area = useRef<HTMLTextAreaElement>(null);

  // type the ghost preview quickly, character by character
  useEffect(() => {
    if (preview === null) return;
    const full = starters[preview].prompt;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setTyped(full.length); return; }
    setTyped(0);
    let i = 0;
    const id = setInterval(() => { i = Math.min(full.length, i + 3); setTyped(i); if (i >= full.length) clearInterval(id); }, 16);
    return () => clearInterval(id);
  }, [preview, starters]);

  const commit = (i: number) => {
    setText(starters[i].prompt); setPreview(null); setFlash((f) => f + 1);
    requestAnimationFrame(() => { const a = area.current; if (a) { a.focus(); a.setSelectionRange(a.value.length, a.value.length); } });
  };

  const ghost = preview !== null && !text ? starters[preview].prompt.slice(0, typed) : "";

  return (
    <div className={`prompt-starters prompt-starters--${theme} ${className}`}>
      <div className="prompt-starters__composer" data-ghost={ghost ? "" : undefined}>
        <textarea
          ref={area}
          key={flash}
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={ghost ? "" : "Ask anything, or start from one of these…"}
          aria-label="Message"
          data-flash={flash > 0 && text ? "" : undefined}
        />
        {ghost && <p className="prompt-starters__ghost" aria-hidden="true">{ghost}<i /></p>}
        <div className="prompt-starters__bar">
          <span>{text ? `${text.length} characters` : ghost ? "Preview · click to use" : ""}</span>
          <button type="button" disabled={!text.trim()} aria-label="Send">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 15.5v-11M5.5 9L10 4.5 14.5 9" /></svg>
          </button>
        </div>
      </div>

      <ul className="prompt-starters__grid" onMouseLeave={() => setPreview(null)}>
        {starters.map((s, i) => (
          <li key={s.title}>
            <button
              type="button"
              className="prompt-starters__card"
              data-on={preview === i || undefined}
              style={{ "--i": i } as CSSProperties}
              onMouseEnter={() => !text && setPreview(i)}
              onFocus={() => !text && setPreview(i)}
              onBlur={() => setPreview(null)}
              onClick={() => commit(i)}
            >
              <span className="prompt-starters__icon" aria-hidden="true">{s.icon}</span>
              <span className="prompt-starters__title">{s.title}</span>
              <span className="prompt-starters__hint">{s.hint}</span>
            </button>
          </li>
        ))}
      </ul>
      {text && <button type="button" className="prompt-starters__clear" onClick={() => setText("")}>Clear and browse starters</button>}
    </div>
  );
}
