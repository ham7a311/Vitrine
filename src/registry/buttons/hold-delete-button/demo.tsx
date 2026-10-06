"use client";
import { HoldDeleteButton } from "./HoldDeleteButton";

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  return (
    <div className="hdlb-demo hdlb-demo--{theme}">
      <HoldDeleteButton target="atlas-web" label="Delete project" resetMs={2400} theme={theme} />
    </div>
  );
}
