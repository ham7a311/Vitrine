import { ImageResponse } from "next/og";
import { site } from "@/site.config";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The shared social card. Every page inherits it unless it defines its own. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px", background: "radial-gradient(90% 80% at 20% 0%, #2a1d33 0%, #0b080d 60%)", color: "#efe8dc" }}>
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, textTransform: "uppercase", color: "#b9cce4" }}>React components · prompts · skills</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 168, lineHeight: 1, letterSpacing: -6, fontFamily: "serif" }}>{site.name}</div>
          <div style={{ marginTop: 24, fontSize: 40, color: "#a7a1ab", fontFamily: "serif", fontStyle: "italic" }}>{site.tagline}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#a7a1ab" }}>
          <span>{site.domain}</span>
          <span style={{ color: "#efe8dc" }}>Chosen for how they move, react and feel</span>
        </div>
      </div>
    ),
    size,
  );
}
