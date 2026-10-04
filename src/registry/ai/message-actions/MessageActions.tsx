"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import "./message-actions.css";

/**
 * Message Actions
 * The row sits at 55% until the message is hovered or focused. Each action
 * answers in its own way — nothing shares a generic "success" flash:
 *   copy   → the glyph morphs into a check for 1.4s
 *   retry  → turns once; a ‹ 2 / 3 › switcher appears for the versions
 *   up     → fills and pops
 *   down   → a single-line "what went wrong?" row folds open, then thanks you
 */

type Props = { versions: ReactNode[]; theme?: "paper" | "night"; className?: string };

const REASONS = ["Not accurate", "Too long", "Missed the point", "Unsafe"];

export function MessageActions({ versions, theme = "paper", className = "" }: Props) {
  const [v, setV] = useState(0);
  const [count, setCount] = useState(1);
  const [copied, setCopied] = useState(false);
  const [spin, setSpin] = useState(0);
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [asking, setAsking] = useState(false);
  const [thanks, setThanks] = useState(false);
  const [shared, setShared] = useState(false);
  const body = useRef<HTMLDivElement>(null);

  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(body.current?.innerText ?? "");
    } catch {
      /* clipboard can be blocked in iframes — the confirmation still shows */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  const retry = () => {
    setSpin((s) => s + 1);
    const n = Math.min(versions.length, count + 1);
    setCount(n);
    setV(n - 1);
  };
  const up = () => {
    setVote(vote === "up" ? null : "up");
    setAsking(false);
  };
  const down = () => {
    if (vote === "down") {
      setVote(null);
      setAsking(false);
      return;
    }
    setVote("down");
    setAsking(true);
    setThanks(false);
  };
  const reason = () => {
    setAsking(false);
    setThanks(true);
    setTimeout(() => setThanks(false), 2200);
  };
  const share = () => {
    setShared(true);
    setTimeout(() => setShared(false), 1600);
  };

  return (
    <article className={`message-actions message-actions--${theme} ${className}`}>
      <div className="message-actions__who" aria-hidden="true">
        <span>✳︎</span>
      </div>
      <div className="message-actions__main">
        <div ref={body} key={v} className="message-actions__body">
          {versions[v]}
        </div>

        <div className="message-actions__row" role="toolbar" aria-label="Message actions">
          <button type="button" onClick={copy} aria-label={copied ? "Copied" : "Copy"} data-tip={copied ? "Copied" : "Copy"} data-done={copied || undefined}>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <g className="message-actions__copy">
                <rect x="7" y="7" width="9" height="9" rx="2" />
                <path d="M13 7V5.5A1.5 1.5 0 0 0 11.5 4h-6A1.5 1.5 0 0 0 4 5.5v6A1.5 1.5 0 0 0 5.5 13H7" />
              </g>
              <path className="message-actions__check" d="M5 10.5l3.2 3.2L15 6.5" />
            </svg>
          </button>
          <button type="button" onClick={retry} aria-label="Try again" data-tip="Try again" disabled={count >= versions.length}>
            <svg key={spin} viewBox="0 0 20 20" aria-hidden="true" data-spin={spin > 0 || undefined}>
              <path d="M15.5 9.5a5.5 5.5 0 1 1-1.8-4.1M15.5 3.5v3h-3" />
            </svg>
          </button>
          {count > 1 && (
            <span className="message-actions__versions">
              <button type="button" onClick={() => setV((x) => Math.max(0, x - 1))} disabled={v === 0} aria-label="Previous version">
                ‹
              </button>
              <span aria-live="polite">
                {v + 1} / {count}
              </span>
              <button type="button" onClick={() => setV((x) => Math.min(count - 1, x + 1))} disabled={v === count - 1} aria-label="Next version">
                ›
              </button>
            </span>
          )}
          <span className="message-actions__gap" aria-hidden="true" />
          <button type="button" onClick={up} aria-pressed={vote === "up"} aria-label="Good response" data-tip="Good response" data-vote={vote === "up" || undefined}>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M7 9.5V16H4.5V9.5H7Zm0 0 2.6-5.2c.3-.6 1-.9 1.6-.6.6.3.9 1 .7 1.6L11.2 8h3.6c1 0 1.7.9 1.5 1.9l-.9 4.6c-.2.9-.9 1.5-1.8 1.5H7" />
            </svg>
          </button>
          <button type="button" onClick={down} aria-pressed={vote === "down"} aria-label="Bad response" data-tip="Bad response" data-vote={vote === "down" || undefined}>
            <svg viewBox="0 0 20 20" aria-hidden="true" className="message-actions__flip">
              <path d="M7 9.5V16H4.5V9.5H7Zm0 0 2.6-5.2c.3-.6 1-.9 1.6-.6.6.3.9 1 .7 1.6L11.2 8h3.6c1 0 1.7.9 1.5 1.9l-.9 4.6c-.2.9-.9 1.5-1.8 1.5H7" />
            </svg>
          </button>
          <button type="button" onClick={share} aria-label="Share" data-tip={shared ? "Link copied" : "Share"} data-done={shared || undefined}>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M10 12.5V3.5M6.5 7 10 3.5 13.5 7M4.5 11v4a1.5 1.5 0 0 0 1.5 1.5h8a1.5 1.5 0 0 0 1.5-1.5v-4" />
            </svg>
          </button>
        </div>

        <div className="message-actions__ask" data-open={asking || thanks || undefined}>
          <div>
            {thanks ? (
              <p className="message-actions__thanks">Thanks — that helps the next answer.</p>
            ) : (
              <p className="message-actions__q">
                <span>What went wrong?</span>
                {REASONS.map((r, i) => (
                  <button key={r} type="button" onClick={reason} tabIndex={asking ? 0 : -1} style={{ "--i": i } as CSSProperties}>
                    {r}
                  </button>
                ))}
              </p>
            )}
          </div>
        </div>
        <p className="message-actions__sr" aria-live="polite">
          {copied ? "Copied to clipboard" : shared ? "Link copied" : thanks ? "Feedback sent" : ""}
        </p>
      </div>
    </article>
  );
}
