"use client";
import { useLayoutEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { clip, CUTS, outline } from "./notch";
import "./corner-cut-button.css";

export type CornerCutButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  /** one: the bottom-right corner; two: opposite corners; all: every corner; brackets: square, with four corner brackets that close in. */
  cut?: "one" | "two" | "all" | "brackets";
  tone?: "solid" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  theme?: "light" | "dark";
  children: ReactNode;
};

const CUT_PX = { sm: 7, md: 11, lg: 14 };
const STROKE = 1.5;

/**
 * Corner Cut Button
 * Chamfered buttons with a true border: the outline is drawn to the exact
 * measured shape, so the cut edges are as crisp as the straight ones. Or
 * four brackets that close in on the corners.
 */
export function CornerCutButton({ cut = "one", tone = "solid", size = "md", icon, theme = "light", className = "", children, style, ...rest }: CornerCutButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [box, setBox] = useState<[number, number] | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || cut === "brackets") return;
    const ro = new ResizeObserver(() => setBox([el.offsetWidth, el.offsetHeight]));
    ro.observe(el);
    return () => ro.disconnect();
  }, [cut]);

  const cls = `ccut ccut--${cut} ccut--${tone} ccut--${size} ${theme === "dark" ? "ccut--dark" : ""} ${className}`;
  if (cut === "brackets") {
    return (
      <button ref={ref} type="button" className={cls} style={style} {...rest}>
        <span className="ccut__corners" aria-hidden="true"><i /><i /><i /><i /></span>
        <span className="ccut__label">{children}{icon && <span className="ccut__icon" aria-hidden="true">{icon}</span>}</span>
      </button>
    );
  }
  const corners = CUTS[cut], c = CUT_PX[size];
  return (
    <button ref={ref} type="button" className={cls} style={{ ...style, ["--ccut-c" as string]: `${c}px` }} {...rest}>
      {/* The fill is clipped to the cut shape; the button itself isn't, so its focus ring still shows. */}
      <span className="ccut__shape" style={{ clipPath: clip(corners) }} aria-hidden="true"><span className="ccut__sweep" /></span>
      {box && (
        <svg className="ccut__edge" width={box[0]} height={box[1]} viewBox={`0 0 ${box[0]} ${box[1]}`} aria-hidden="true">
          <polygon points={outline(box[0], box[1], c, corners, STROKE / 2)} strokeWidth={STROKE} />
        </svg>
      )}
      <span className="ccut__label">{children}{icon && <span className="ccut__icon" aria-hidden="true">{icon}</span>}</span>
    </button>
  );
}
