"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { FIELDS, type Field } from "./fields";
import { hex, runShader } from "./gl";
import "./field-button.css";

export type FieldButtonProps = {
  children: ReactNode;
  /** Which background lives inside the button. */
  field?: Field;
  /** How much of the field shows: higher shows more of it, smaller. */
  zoom?: number;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  motion?: "full" | "reduced";
  className?: string;
};

const uniformsFor = (p: Record<string, string | number>) =>
  Object.fromEntries(Object.entries(p).map(([k, v]) => [`u${k[0].toUpperCase()}${k.slice(1)}`, typeof v === "string" ? hex(v) : v]));

/**
 * Field Button
 * A pill with a living background inside it — smoke, veins, strands of light, grain, a blade of
 * light or plumes — drifting quietly at rest. Point at it and the field wakes: it quickens,
 * brightens and turns towards the pointer, under a thin rim of glass.
 */
export function FieldButton({ children, field = "smoke", zoom = 3.2, onClick, type = "button", motion = "full", className = "" }: FieldButtonProps) {
  const btn = useRef<HTMLButtonElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const awake = useRef(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = btn.current, cv = canvas.current;
    if (!el || !cv) return;
    const f = FIELDS[field];
    let rate = 1;
    return runShader(el, cv, {
      frag: f.frag, uniforms: uniformsFor(f.palette), quality: Math.max(0.9, f.quality), start: f.start, follow: 0.08, zoom,
      reduced: motion === "reduced",
      // ease between a slow drift and an awake pace
      rate: () => (rate += ((awake.current ? 3 : 0.6) - rate) * 0.04),
      onFail: () => setFailed(true),
    });
  }, [field, zoom, motion]);

  return (
    <button ref={btn} type={type} className={`fbtn fbtn--${field} ${className}`} data-fallback={failed ? "" : undefined} onClick={onClick}
      onPointerEnter={() => { awake.current = true; }} onPointerLeave={() => { awake.current = false; }}
      onFocus={() => { awake.current = true; }} onBlur={() => { awake.current = false; }}
      style={{ ["--fb-bg" as string]: String(Object.values(FIELDS[field].palette)[0]) } as CSSProperties}>
      <canvas ref={canvas} className="fbtn__field" aria-hidden="true" />
      <span className="fbtn__scrim" aria-hidden="true" />
      <span className="fbtn__label">{children}</span>
    </button>
  );
}

export default FieldButton;
