"use client";
import { ProviderStack } from "./ProviderStack";

let attempts = 0;
// Fictional product mark: a folded square.
const Mark = <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h10l6 6v10H4Z" fill="currentColor" /><path d="M14 4v6h6" fill="none" stroke="var(--ps-card)" strokeWidth="1.6" strokeLinejoin="round" /></svg>;

export default function Demo({ variant = "night" }: { variant?: string }) {
  return (
    <ProviderStack
      theme={variant === "paper" ? "paper" : "night"}
      app={{ name: "Foldline", mark: Mark }}
      lastUsed="google"
      // The first attempt pretends the window was closed; after that it signs in.
      onProvider={(_, signal) => new Promise((resolve, reject) => {
        const t = setTimeout(() => (attempts++ === 0 ? reject({ reason: "closed" }) : resolve("Mara")), 2400);
        signal.addEventListener("abort", () => clearTimeout(t));
      })}
      onEmail={() => {}}
    />
  );
}
