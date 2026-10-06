"use client";
import { SpotlightText } from "./SpotlightText";

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  return (
    <div className={`sptx-demo sptx-demo--${theme}`}>
      <p className="sptx-demo__eyebrow">Move your pointer</p>
      <h2><SpotlightText theme={theme}>Colour where you are looking.</SpotlightText></h2>
      <p>The letters stay quiet until you come near, then a <SpotlightText theme={theme}>pool of colour</SpotlightText> follows you through them.</p>
    </div>
  );
}
