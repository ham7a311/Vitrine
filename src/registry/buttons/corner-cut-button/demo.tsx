"use client";
import { CornerCutButton } from "./CornerCutButton";

const Arrow = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square"><path d="M2.5 8h10M9 4.5 12.5 8 9 11.5" /></svg>;
const CUTS = ["one", "two", "all", "brackets"] as const;

export default function Demo({ variant = "one" }: { variant?: string }) {
  const cut = (CUTS as readonly string[]).includes(variant) ? (variant as (typeof CUTS)[number]) : "one";
  const panel = (theme: "light" | "dark") => (
    <div className={`ccut-demo__panel ccut-demo__panel--${theme}`}>
      <CornerCutButton cut={cut} size="lg" theme={theme} icon={<Arrow />}>Launch</CornerCutButton>
      <CornerCutButton cut={cut} tone="outline" theme={theme}>View specs</CornerCutButton>
      <CornerCutButton cut={cut} size="sm" theme={theme}>Arm</CornerCutButton>
    </div>
  );
  return <div className="ccut-demo">{panel("light")}{panel("dark")}</div>;
}
