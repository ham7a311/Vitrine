"use client";

import { useState } from "react";
import "./context-meter.css";

/**
 * Context Meter
 * How full the model's context window is, and with what. One bar split into what's using it —
 * instructions, files, conversation, tool results — that grows as things are added, warns as it
 * nears the limit, and squeezes the conversation into a short summary when you compact it.
 */

export type Segment = { id: string; label: string; tokens: number; colour: string };

type Props = { limit?: number; initial?: Segment[]; theme?: "paper" | "night"; className?: string };

const DEFAULT: Segment[] = [
  { id: "system", label: "Instructions", tokens: 2100, colour: "#8b93a3" },
  { id: "files", label: "Files", tokens: 38400, colour: "#2a78d6" },
  { id: "chat", label: "Conversation", tokens: 61200, colour: "#eb6834" },
  { id: "tools", label: "Tool results", tokens: 9800, colour: "#1baf7a" },
];

const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}k` : String(n));

export function ContextMeter({ limit = 200000, initial = DEFAULT, theme = "paper", className = "" }: Props) {
  const [segs, setSegs] = useState(initial);
  const [hover, setHover] = useState<string | null>(null);
  const [compacting, setCompacting] = useState(false);
  const used = segs.reduce((a, s) => a + s.tokens, 0);
  const pct = used / limit;
  const level = pct > 0.9 ? "full" : pct > 0.75 ? "warn" : "ok";
  const add = (id: string, n: number) => setSegs((x) => x.map((s) => (s.id === id ? { ...s, tokens: s.tokens + n } : s)));
  const compact = () => {
    setCompacting(true);
    setTimeout(() => {
      setSegs((x) => x.map((s) => (s.id === "chat" ? { ...s, label: "Summary", tokens: Math.round(s.tokens * 0.08) } : s.id === "tools" ? { ...s, tokens: Math.round(s.tokens * 0.2) } : s)));
      setCompacting(false);
    }, 650);
  };
  const focusSeg = segs.find((s) => s.id === hover);

  return (
    <div className={`cm cm--${theme} ${className}`} data-level={level}>
      <div className="cm__top">
        <div>
          <p className="cm__eyebrow">Context window</p>
          <p className="cm__num">
            <strong>{fmt(used)}</strong> / {fmt(limit)} tokens
          </p>
        </div>
        <p className="cm__pct" aria-hidden="true">
          {Math.round(pct * 100)}%
        </p>
      </div>
      <div
        className="cm__bar"
        role="meter"
        aria-label="Context used"
        aria-valuemin={0}
        aria-valuemax={limit}
        aria-valuenow={used}
        aria-valuetext={`${Math.round(pct * 100)}% used: ${segs.map((s) => `${s.label} ${fmt(s.tokens)}`).join(", ")}`}
        data-compacting={compacting ? "" : undefined}
      >
        {segs.map((s) => (
          <span
            key={s.id}
            className="cm__seg"
            data-dim={hover && hover !== s.id ? "" : undefined}
            style={{ width: `${(s.tokens / limit) * 100}%`, background: s.colour }}
            onPointerEnter={() => setHover(s.id)}
            onPointerLeave={() => setHover(null)}
          />
        ))}
        <span className="cm__limit" style={{ left: "90%" }} aria-hidden="true" />
      </div>
      <p className="cm__hint" aria-live="polite">
        {focusSeg ? `${focusSeg.label}: ${fmt(focusSeg.tokens)} tokens (${Math.round((focusSeg.tokens / used) * 100)}% of what's used)` : level === "full" ? "Almost full — older turns will be dropped soon. Compact to keep going." : level === "warn" ? "Getting full. Compacting will summarise the conversation." : "Plenty of room."}
      </p>
      <ul className="cm__legend">
        {segs.map((s) => (
          <li key={s.id} onPointerEnter={() => setHover(s.id)} onPointerLeave={() => setHover(null)}>
            <i style={{ background: s.colour }} aria-hidden="true" />
            <span>{s.label}</span>
            <span className="cm__t">{fmt(s.tokens)}</span>
          </li>
        ))}
      </ul>
      <div className="cm__actions">
        <button type="button" onClick={() => add("files", 24000)}>
          + Attach report.pdf
        </button>
        <button type="button" onClick={() => add("chat", 18000)}>
          + Long reply
        </button>
        <button type="button" className="cm__compact" onClick={compact} disabled={compacting || segs.find((s) => s.id === "chat")!.tokens < 8000}>
          Compact
        </button>
      </div>
    </div>
  );
}
