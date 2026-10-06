"use client";
import type { ElementType, ReactNode } from "react";
import "./gradient-text.css";

export type GradientTextProps = {
  as?: ElementType;
  children: ReactNode;
  theme?: "light" | "dark";
  motion?: boolean;
  className?: string;
};

/**
 * Gradient Text
 * Real, selectable text filled with an aurora: a wide gradient of teal, blue,
 * violet, pink and orange that drifts slowly through the letters.
 */
export function GradientText({ as: Tag = "span", children, theme = "light", motion = true, className = "" }: GradientTextProps) {
  return <Tag className={`grdt ${theme === "dark" ? "grdt--dark" : ""} ${motion ? "" : "grdt--still"} ${className}`}>{children}</Tag>;
}
