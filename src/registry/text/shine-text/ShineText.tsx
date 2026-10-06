"use client";
import type { ElementType, ReactNode } from "react";
import "./shine-text.css";

export type ShineTextProps = {
  as?: ElementType;
  children: ReactNode;
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

/**
 * Shine Text
 * Real, selectable text in brushed metal, with a narrow band of light that
 * crosses the letters every few seconds.
 */
export function ShineText({ as: Tag = "span", children, theme = "light", motion = true, className = "" }: ShineTextProps) {
  return <Tag className={`shnt ${theme === "dark" ? "shnt--dark" : ""} ${motion ? "" : "shnt--still"} ${className}`}>{children}</Tag>;
}
