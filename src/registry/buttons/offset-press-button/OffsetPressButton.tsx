"use client";
import type { ButtonHTMLAttributes } from "react";
import "./offset-press-button.css";
export type OffsetPressButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { accent?: "mint" | "lilac" | "butter"; fullWidth?: boolean };
/** Native button semantics, including form submission when explicitly requested. */
export function OffsetPressButton({ children, accent = "mint", fullWidth = false, className = "", type = "button", ...props }: OffsetPressButtonProps) {
 return <button {...props} type={type} className={`opb opb--${accent} ${fullWidth?"opb--full":""} ${className}`}><span className="opb__face">{children}</span></button>;
}
