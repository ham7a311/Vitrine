"use client";
import { useRef, useState, type ReactNode } from "react";
import "./alert-callout.css";

export type AlertTone = "info" | "success" | "warning" | "danger";
export type AlertCalloutProps = {
  tone?: AlertTone;
  /** soft: tinted box; outline: hairline box; accent: a coloured bar on the left; banner: a full-width strip. */
  look?: "soft" | "outline" | "accent" | "banner";
  title: string;
  children?: ReactNode;
  /** Buttons or links under the text (inline at the end in a banner). */
  actions?: ReactNode;
  /** Show a close button; called once the alert has collapsed. */
  onDismiss?: () => void;
  theme?: "light" | "dark";
  className?: string;
};

const ICONS: Record<AlertTone, ReactNode> = {
  info: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="10" cy="10" r="7.5" /><path d="M10 9v4.5M10 6.4v.1" strokeLinecap="round" strokeWidth="1.9" /></svg>,
  success: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="10" cy="10" r="7.5" /><path d="m6.8 10.2 2.2 2.2 4.3-4.6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>,
  warning: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="M10 2.8 18 16.6H2Z" /><path d="M10 8v3.8M10 14.1v.1" strokeLinecap="round" strokeWidth="1.9" /></svg>,
  danger: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="M6.9 2.5h6.2l4.4 4.4v6.2l-4.4 4.4H6.9l-4.4-4.4V6.9Z" /><path d="M10 6.4v4.4M10 13.4v.1" strokeLinecap="round" strokeWidth="1.9" /></svg>,
};

/**
 * Alert Callout
 * Inline messages in four tones: information, success, warning and danger.
 * A clear mark, a short title, a sentence, the actions that resolve it, and
 * a close button that folds the message away smoothly.
 */
export function AlertCallout({ tone = "info", look = "soft", title, children, actions, onDismiss, theme = "light", className = "" }: AlertCalloutProps) {
  const [closing, setClosing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = () => {
    if (closing) return;
    setClosing(true);
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Keep keyboard users in place: focus moves to the neighbouring alert's close button, if there is one.
    const me = ref.current;
    const near = [me?.nextElementSibling, me?.previousElementSibling].find((el) => el?.classList.contains("alrt"));
    window.setTimeout(() => {
      if (me?.contains(document.activeElement)) near?.querySelector<HTMLElement>(".alrt__close")?.focus();
      onDismiss?.();
    }, still ? 0 : 260);
  };
  return (
    <div ref={ref} className={`alrt alrt--${tone} alrt--${look} ${theme === "dark" ? "alrt--dark" : ""} ${className}`} data-closing={closing || undefined}
      role={tone === "danger" ? "alert" : "status"}>
      <div className="alrt__fold">
        <div className="alrt__box">
          <span className="alrt__icon" aria-hidden="true">{ICONS[tone]}</span>
          <div className="alrt__text">
            <p className="alrt__title">{title}</p>
            {children && <div className="alrt__body">{children}</div>}
            {actions && <div className="alrt__actions">{actions}</div>}
          </div>
          {onDismiss && (
            <button type="button" className="alrt__close" onClick={close} aria-label={`Dismiss: ${title}`}>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="m4.5 4.5 7 7M11.5 4.5l-7 7" /></svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
