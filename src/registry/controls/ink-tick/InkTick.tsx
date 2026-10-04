"use client";

import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import "./ink-tick.css";

/**
 * Ink Tick
 * A checkbox ticked with a pen. The tick is drawn in one stroke that bleeds a little into the
 * paper, and the label is struck through by the same hand a beat later. Unticking scrubs the
 * ink away the way it came.
 */

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "children"> & {
  children: ReactNode;
  /** Strike the label through when checked (to-do lists). */
  strike?: boolean;
  ink?: string;
};

export function InkTick({ children, strike = true, ink = "#1d4ed8", checked, defaultChecked, onChange, className = "", id, ...rest }: Props) {
  const auto = useId();
  const inputId = id ?? auto;
  const bleed = `ink-${auto.replace(/:/g, "")}`;
  const [inner, setInner] = useState(!!defaultChecked);
  const on = checked ?? inner;
  return (
    <label className={`ink ${className}`} htmlFor={inputId} style={{ ["--ink" as string]: ink }} data-on={on ? "" : undefined}>
      <input
        id={inputId}
        type="checkbox"
        className="ink__input"
        checked={on}
        onChange={(e) => {
          if (checked === undefined) setInner(e.target.checked);
          onChange?.(e);
        }}
        {...rest}
      />
      <span className="ink__box" aria-hidden="true">
        <svg viewBox="0 0 32 32">
          <defs>
            <filter id={bleed} x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" />
            </filter>
          </defs>
          {/* a hand-drawn box: not quite square, the pen overlaps where it closes */}
          <path className="ink__frame" d="M5.2 6.1C10.8 5.3 20.6 5.2 26.4 5.8 26.9 12.1 27 20.3 26.3 26.2 19.8 26.9 11.3 26.8 5.6 26.1 5 19.6 4.9 12 5.6 5.4" />
          <path className="ink__tick" filter={`url(#${bleed})`} pathLength={1} d="M8.4 16.8C10.2 18.2 12 20.3 13.6 23.1 16.6 16.4 20.9 10.6 27.4 4.6" />
        </svg>
      </span>
      <span className="ink__label">
        {children}
        {strike && (
          <svg className="ink__strike" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
            <path pathLength={1} d="M1 6.4C20 4.2 41 6.8 60 5.1 75 3.8 88 5.6 99 4.4" />
          </svg>
        )}
      </span>
    </label>
  );
}
