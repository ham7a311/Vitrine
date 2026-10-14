"use client";
import { KoiPond } from "./KoiPond";
import type { Pond } from "./koi";

const LOOKS: Record<Pond, { ground: string; text: string }> = {
  koi: { ground: "#e6efe9", text: "Visit the garden" },
  goldfish: { ground: "#e7eff7", text: "Feed the fish" },
  night: { ground: "#070b18", text: "Night swim" },
};

export default function Demo({ variant = "koi" }: { variant?: string }) {
  const p = (variant in LOOKS ? variant : "koi") as Pond;
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: 48, background: LOOKS[p].ground }}>
      <KoiPond pond={p}>{LOOKS[p].text}</KoiPond>
    </div>
  );
}
