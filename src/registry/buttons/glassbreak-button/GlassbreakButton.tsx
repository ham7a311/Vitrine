import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./glassbreak-button.css";

/**
 * Glassbreak Button
 * A solid plate that fractures from a single impact point on hover / focus:
 * cracks draw outward, the cover dissolves, and six shards drift apart to
 * reveal a gradient underneath. Pure CSS — no JS animation, no randomness.
 */

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children: ReactNode;
  /** The surface the button sits on. "light" = dark glass, "dark" = pale glass. */
  surface?: "light" | "dark";
  size?: "default" | "compact";
  /** Render as a link instead of a button. */
  href?: string;
  /** Show the shattered state permanently (used automatically on touch devices). */
  shattered?: boolean;
  fullWidth?: boolean;
};

const PIECES = [
  "polygon(0 0, 44% 0, 36% 34%, 14% 62%, 0 48%)",
  "polygon(42% 0, 70% 0, 76% 40%, 50% 54%, 34% 32%)",
  "polygon(68% 0, 100% 0, 100% 46%, 80% 36%, 74% 38%)",
  "polygon(0 46%, 16% 60%, 12% 100%, 0 100%)",
  "polygon(14% 58%, 52% 52%, 56% 100%, 10% 100%)",
  "polygon(50% 50%, 78% 36%, 100% 44%, 100% 100%, 54% 100%)",
];

const CRACKS = [
  "M50 52 L36 34 L44 0",
  "M50 52 L76 40 L70 0",
  "M50 52 L16 60 L0 48",
  "M50 52 L56 100",
  "M50 52 L100 46",
  "M36 34 L14 62",
];

export function GlassbreakButton({
  children,
  surface = "light",
  size = "default",
  href,
  shattered,
  fullWidth,
  className = "",
  type = "button",
  ...rest
}: Props) {
  const classes = [
    "gb",
    surface === "light" ? "gb--light" : "gb--dark",
    size === "compact" && "gb--compact",
    shattered && "gb--shattered",
    fullWidth && "gb--full",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      <span className="gb__plate" aria-hidden="true">
        {PIECES.map((clip, i) => (
          <span key={clip} className={`gb__piece gb__piece--${i + 1}`} style={{ clipPath: clip }} />
        ))}
        <span className="gb__cover" />
        <svg className="gb__cracks" viewBox="0 0 100 100" preserveAspectRatio="none">
          {CRACKS.map((d, i) => (
            <path key={d} d={d} pathLength={1} style={{ transitionDelay: `${0.04 + i * 0.045}s` }} />
          ))}
        </svg>
      </span>
      <span className="gb__label">{children}</span>
      <svg className="gb__arrow" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M4 10h12M12 5l5 5-5 5" />
      </svg>
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        {inner}
      </a>
    );
  }

  return (
    <button type={type} className={classes} {...rest}>
      {inner}
    </button>
  );
}
