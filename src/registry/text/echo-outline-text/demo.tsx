"use client";
import { EchoOutlineText } from "./EchoOutlineText";

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  return (
    <div className={`eotx-demo eotx-demo--${theme}`}>
      <EchoOutlineText text="Signal" theme={theme} />
    </div>
  );
}
