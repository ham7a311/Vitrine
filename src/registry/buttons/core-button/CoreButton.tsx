"use client";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import "./core-button.css";

export type CoreVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success" | "warning" | "link";
export type CoreButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  variant?: CoreVariant;
  size?: "sm" | "md" | "lg";
  /** An icon before the label. */
  icon?: ReactNode;
  /** An icon after the label (an arrow, a chevron). */
  trailing?: ReactNode;
  /** Shows a spinner in place of the content and holds the button's width. */
  loading?: boolean;
  theme?: "light" | "dark";
  /** For an icon-only button, pass the icon as children and an aria-label. */
  children?: ReactNode;
};

/**
 * Core Button
 * The everyday button, done properly: three sizes, icons on either side,
 * an icon-only square, a loading state that keeps its width and announces
 * itself, a disabled state, a clear focus ring and a small press.
 */
export const CoreButton = forwardRef<HTMLButtonElement, CoreButtonProps>(function CoreButton(
  { variant = "primary", size = "md", icon, trailing, loading = false, theme = "light", disabled, className = "", children, onClick, type = "button", ...rest },
  ref,
) {
  const iconOnly = !icon && !trailing && typeof children !== "string" && typeof children !== "number";
  return (
    <button
      ref={ref}
      type={type}
      className={`cbtn cbtn--${variant} cbtn--${size} ${theme === "dark" ? "cbtn--dark" : ""} ${iconOnly ? "cbtn--icon" : ""} ${className}`}
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      data-loading={loading || undefined}
      onClick={(e) => { if (loading) { e.preventDefault(); return; } onClick?.(e); }}
      {...rest}
    >
      <span className="cbtn__body">
        {icon && <span className="cbtn__icon" aria-hidden="true">{icon}</span>}
        {iconOnly ? <span className="cbtn__icon" aria-hidden="true">{children}</span> : <span className="cbtn__label">{children}</span>}
        {trailing && <span className="cbtn__icon cbtn__icon--end" aria-hidden="true">{trailing}</span>}
      </span>
      {loading && <span className="cbtn__spin" aria-hidden="true" />}
    </button>
  );
});
