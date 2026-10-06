"use client";
import { CornerCutButton } from "./CornerCutButton";

const Arrow = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square"><path d="M2.5 8h10M9 4.5 12.5 8 9 11.5" /></svg>;
const CUTS = ["one", "two", "all"] as const;

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  return (
    <div className={`ccut-demo ccut-demo--${theme}`}>
      {CUTS.map((cut) => (
        <div key={cut} className="ccut-demo__row">
          <CornerCutButton cut={cut} size="lg" theme={theme} icon={<Arrow />}>Launch</CornerCutButton>
          <CornerCutButton cut={cut} tone="outline" theme={theme}>View specs</CornerCutButton>
          <CornerCutButton cut={cut} size="sm" theme={theme}>Arm</CornerCutButton>
        </div>
      ))}
    </div>
  );
}
