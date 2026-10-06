"use client";
import { BreatheButton } from "./BreatheButton";

const Arrow = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>;

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  return (
    <div className={`brth-demo brth-demo--${theme}`}>
      <BreatheButton theme={theme} label="Start building" icon={<Arrow />} />
    </div>
  );
}
