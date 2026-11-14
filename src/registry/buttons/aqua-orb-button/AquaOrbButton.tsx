import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import "./aqua-orb-button.css";

/**
 * Aqua Orb Button
 * A round, glossy button like a drop of tinted glass set in a white ring: pale at the rim, deeper toward the
 * middle, with a fine line of colour along its lower edge. It deepens on hover and its icon lifts; pressing
 * pushes it in.
 */

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** The icon. Defaults to an upward arrow. Give the button an aria-label. */
  children?: ReactNode;
  tone?: "sky" | "mint" | "rose";
  /** Diameter in pixels. */
  size?: number;
};

const ARROW = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 19.5V5M5.5 11.2 12 4.7l6.5 6.5" />
  </svg>
);

export function AquaOrbButton({ children = ARROW, tone = "sky", size = 40, className = "", style, ...rest }: Props) {
  return (
    <button type="button" className={`aquaorb aquaorb--${tone} ${className}`} style={{ ["--aquaorb-size" as string]: `${size}px`, ...style } as CSSProperties} {...rest}>
      <span className="aquaorb__face" aria-hidden="true" />
      <span className="aquaorb__icon">{children}</span>
    </button>
  );
}

export default AquaOrbButton;
