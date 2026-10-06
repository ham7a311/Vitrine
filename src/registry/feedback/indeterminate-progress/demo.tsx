"use client";
import { IndeterminateProgress } from "./IndeterminateProgress";

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  return (
    <div className={`ipbr-demo ipbr-demo--${theme}`}>
      <IndeterminateProgress theme={theme} label="Connecting to the database" detail="Usually under a minute" />
      <IndeterminateProgress theme={theme} label="Indexing files" striped size="lg" />
      <IndeterminateProgress theme={theme} label="Syncing" size="sm" />
    </div>
  );
}
