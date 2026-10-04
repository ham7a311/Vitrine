"use client";

import { useLayoutEffect, useRef, useState, type ButtonHTMLAttributes } from "react";
import "./stitch-button.css";

/**
 * Stitch Button
 * A button sewn from leather or denim, with a running stitch just inside its
 * edge. Point at it and the thread pulls tight, the stitches shortening as
 * the panel lifts; press and the seam puckers. For shops that make things.
 */

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  material?: "leather" | "denim";
  motion?: "full" | "reduced";
};

const INSET = 5;

export function StitchButton({ material = "leather", motion = "full", className = "", children, ...rest }: Props) {
  const btn = useRef<HTMLButtonElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = btn.current!;
    const read = () => setBox({ w: el.offsetWidth, h: el.offsetHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const rect = { x: INSET, y: INSET, width: Math.max(0, box.w - INSET * 2), height: Math.max(0, box.h - INSET * 2), rx: 7 };
  return (
    <button ref={btn} type="button" className={`stb stb--${material} ${className}`} data-motion={motion} {...rest}>
      {box.w > 0 && (
        <svg className="stb__seam" width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} aria-hidden="true">
          {/* Each stitch sits in a slight groove: a dark copy just below the thread. */}
          <rect className="stb__groove" {...rect} />
          <rect className="stb__thread" {...rect} />
        </svg>
      )}
      <span className="stb__label">{children}</span>
    </button>
  );
}
