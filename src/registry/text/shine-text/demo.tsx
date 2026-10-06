"use client";
import { ShineText } from "./ShineText";

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  return (
    <div className={`shnt-demo shnt-demo--${theme}`}>
      <p className="shnt-demo__eyebrow">Series 2</p>
      <h2>Machined from a <ShineText theme={theme}>single block.</ShineText></h2>
      <p>Brushed metal lettering with a narrow <ShineText theme={theme}>band of light</ShineText> that crosses it every few seconds.</p>
    </div>
  );
}
