"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import "./iris-shutter-button.css";

/**
 * Iris Shutter Button
 * An async-action button with a camera iris for a status light. Pressing it
 * closes six aperture blades and turns them while the work happens; the iris
 * then opens onto a check (success) or half-closes with a jolt (error).
 */

type State = "idle" | "loading" | "success" | "error";

type Props = {
  /** The async work. Resolve for success, reject for error. */
  onAction: () => Promise<unknown>;
  labels?: Partial<Record<State, string>>;
  /** Controlled state, if you'd rather drive it yourself. */
  state?: State;
  /** ms to show success/error before returning to idle. */
  resetAfter?: number;
  className?: string;
  disabled?: boolean;
};

const DEFAULT_LABELS: Record<State, string> = {
  idle: "Capture",
  loading: "Exposing…",
  success: "Saved",
  error: "Try again",
};

const R = 13; // lens radius in the 32×32 viewBox
const APERTURE: Record<State, { r: number; twist: number }> = {
  idle: { r: R, twist: 0 },
  loading: { r: 0.6, twist: 34 },
  success: { r: R, twist: 0 },
  error: { r: R * 0.42, twist: 18 },
};

export function IrisShutterButton({ onAction, labels, state: controlled, resetAfter = 1800, className = "", disabled }: Props) {
  const [internal, setInternal] = useState<State>("idle");
  const state = controlled ?? internal;
  const text = { ...DEFAULT_LABELS, ...labels };
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const uid = useId().replace(/:/g, "");

  useEffect(() => () => clearTimeout(timer.current), []);

  const run = async () => {
    if (state === "loading") return;
    clearTimeout(timer.current);
    setInternal("loading");
    let next: State = "success";
    try {
      await onAction();
    } catch {
      next = "error";
    }
    setInternal(next);
    timer.current = setTimeout(() => setInternal("idle"), resetAfter);
  };

  const { r, twist } = APERTURE[state];
  const style = { "--iris-r": r, "--iris-twist": `${twist}deg` } as CSSProperties;

  return (
    <button
      type="button"
      className={`iris iris--${state} ${className}`}
      onClick={run}
      disabled={disabled}
      aria-busy={state === "loading"}
      data-state={state}
    >
      <span className="iris__lens" aria-hidden="true">
        <svg viewBox="0 0 32 32" style={style}>
          <defs>
            <clipPath id={`iris-clip-${uid}`}>
              <circle cx="16" cy="16" r={R} />
            </clipPath>
            <radialGradient id={`iris-core-${uid}`} cx="40%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#e9e2f6" />
              <stop offset="45%" stopColor="#8f7fc0" />
              <stop offset="100%" stopColor="#1a1225" />
            </radialGradient>
          </defs>
          <circle cx="16" cy="16" r={R} className="iris__glass" fill={`url(#iris-core-${uid})`} />
          <path className="iris__check" d="M10.5 16.4 14.2 20 21.5 12.4" pathLength={1} />
          <g clipPath={`url(#iris-clip-${uid})`}>
            <g className="iris__blades">
              {Array.from({ length: 6 }, (_, i) => (
                <g key={i} transform={`translate(16 16) rotate(${i * 60})`}>
                  <rect className="iris__blade" x={-R - 4} y={-2 * R - 2} width={2 * R + 8} height={2 * R + 2} />
                </g>
              ))}
            </g>
          </g>
          <circle cx="16" cy="16" r={R + 1.25} className="iris__ring" />
        </svg>
      </span>

      <span className="iris__labels">
        {(Object.keys(DEFAULT_LABELS) as State[]).map((k) => (
          <span key={k} className="iris__label" data-on={k === state || undefined} aria-hidden={k !== state}>
            {text[k]}
          </span>
        ))}
      </span>
      <span className="iris__sr" aria-live="polite">
        {state === "idle" ? "" : text[state]}
      </span>
    </button>
  );
}
