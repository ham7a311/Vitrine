"use client";
import { GradientText } from "./GradientText";

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  return (
    <div className={`grdt-demo grdt-demo--${theme}`}>
      <p className="grdt-demo__eyebrow">Launch week</p>
      <h2>Make the thing <GradientText theme={theme}>everyone remembers.</GradientText></h2>
      <p>Gradients that move as <GradientText theme={theme}>slowly</GradientText> as a sky, through text you can still select, copy and read aloud.</p>
    </div>
  );
}
