"use client";
import { DangerButton } from "./DangerButton";

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  return (
    <div className="dgr-demo dgr-demo--{theme}">
      <DangerButton target="atlas-web" label="Delete project" resetMs={2400} theme={theme} />
    </div>
  );
}
