"use client";
import { CornerBracketButton } from "./CornerBracketButton";

const Arrow = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square"><path d="M2.5 8h10M9 4.5 12.5 8 9 11.5" /></svg>;

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  return (
    <div className={`ccbk-demo ccbk-demo--${theme}`}>
      <CornerBracketButton size="lg" theme={theme} icon={<Arrow />}>Launch</CornerBracketButton>
      <CornerBracketButton tone="outline" theme={theme}>View specs</CornerBracketButton>
      <CornerBracketButton size="sm" theme={theme}>Arm</CornerBracketButton>
    </div>
  );
}
