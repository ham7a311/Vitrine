"use client";
import { PlatformBadgeSet, type BadgeStyle } from "./PlatformBadges";

// Each style is its own version, on the page it suits best.
const LOOKS: Record<string, { look: BadgeStyle; dark: boolean }> = {
  solid: { look: "solid", dark: false },
  outline: { look: "outline", dark: true },
  light: { look: "light", dark: true },
};

export default function Demo({ variant = "solid" }: { variant?: string }) {
  const { look, dark } = LOOKS[variant] ?? LOOKS.solid;
  return (
    <div className={`pbdg-demo pbdg-demo--${dark ? "dark" : "light"}`}>
      <PlatformBadgeSet look={look} theme={dark ? "dark" : "light"} />
    </div>
  );
}
