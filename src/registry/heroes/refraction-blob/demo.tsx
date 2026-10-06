"use client";
import { RefractionBlob } from "./RefractionBlob";

// An original mark: a ring with a folded corner of light.
const Mark = () => (
  <svg viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2.6" />
    <path d="M16 30c3 3.4 13 3.4 16 0" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    <path d="M17 18.5v3.5M31 18.5v3.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    <path d="M38 12a20 20 0 0 1 4 12" stroke="currentColor" strokeOpacity="0.35" strokeWidth="5" strokeLinecap="round" />
  </svg>
);

export default function Demo({ variant = "light" }: { variant?: string }) {
  return (
    <RefractionBlob
      name="Rami Nasser"
      label="Product designer"
      logo={<Mark />}
      links={[{ label: "Work", href: "#", current: true }, { label: "Lab", href: "#" }, { label: "About", href: "#" }, { label: "CV", href: "#" }]}
      tagline="I make hard things feel kind."
      more={{ label: "More about me", href: "#" }}
      theme={variant === "dark" ? "dark" : "light"}
    />
  );
}
