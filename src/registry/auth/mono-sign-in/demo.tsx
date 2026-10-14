"use client";
import { MonoSignIn } from "./MonoSignIn";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
let tries = 0;

export default function Demo({ variant = "paper" }: { variant?: string }) {
  return (
    <div style={{ height: "100%", minHeight: 640, background: variant === "night" ? "#0a0a0a" : "#fff" }}>
      <MonoSignIn
        theme={variant === "night" ? "night" : "paper"}
        brand="plainfield"
        tagline="Notes, plans and decisions for teams who'd rather read than scroll."
        lastUsed="github"
        // The first GitHub attempt pretends the window was closed; the second goes through.
        onProvider={async (p) => { await wait(1400); if (p === "github" && tries++ === 0) throw { reason: "closed" }; }}
        onSignIn={async (_, password) => { await wait(1100); if (password !== "plain-text") throw new Error("wrong"); }}
      />
    </div>
  );
}
