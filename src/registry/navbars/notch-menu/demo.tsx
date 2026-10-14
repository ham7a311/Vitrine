"use client";
import { NotchMenu } from "./NotchMenu";

export default function Demo({ variant = "cobalt" }: { variant?: string }) {
  const glow = variant === "violet" ? "#6b3fe0" : variant === "ember" ? "#d4561f" : "#2f5fd6";
  return (
    <div style={{ minHeight: "100%", padding: "clamp(16px, 4vw, 48px) clamp(12px, 6vw, 96px) 0", background: "#000" }}>
      <NotchMenu
        glow={glow}
        label="Site"
        hint="Point at the notch"
        links={[
          { title: "Tour", sub: "A two-minute look at every part", href: "#tour" },
          { title: "Showcase", sub: "Things people made with it", href: "#showcase" },
          { title: "Pricing", sub: "Free to start, fair to grow", href: "#pricing" },
        ]}
        cta={{ label: "Get started", href: "#start" }}
        onNavigate={(_, e) => e.preventDefault()}
      />
    </div>
  );
}
