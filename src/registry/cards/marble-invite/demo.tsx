"use client";
import { MarbleInvite, type InvitePalette } from "./MarbleInvite";

const P: Record<string, InvitePalette> = {
  cobalt: { deep: "#071a4a", mid: "#2a63e0", light: "#a9c6ff" },
  ember: { deep: "#3a0b05", mid: "#d2491d", light: "#ffc29a" },
  jade: { deep: "#032b22", mid: "#118a63", light: "#9be6c6" },
};

export default function Demo({ variant = "cobalt" }: { variant?: string }) {
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: "clamp(16px, 5vw, 56px)", background: "#000" }}>
      <div style={{ width: "min(100%, 420px)" }}>
        <MarbleInvite palette={P[variant] ?? P.cobalt} title={"Late\nShift"} date="Thursday, November 6" detail="8 PM · The Roundhouse"
          onSend={() => new Promise((ok) => setTimeout(ok, 700))} />
      </div>
    </div>
  );
}
