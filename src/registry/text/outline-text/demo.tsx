"use client";
import { OutlineText } from "./OutlineText";

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  return (
    <div className={`otxt-demo otxt-demo--${theme}`}>
      <div>
        <p className="otxt-demo__hint">Point at a word</p>
        <OutlineText lines={["Quiet tools", "for loud ideas"]} theme={theme} />
      </div>
    </div>
  );
}
