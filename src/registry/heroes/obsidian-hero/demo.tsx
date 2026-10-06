"use client";
import { ObsidianHero } from "./ObsidianHero";

// An original line mark: a cube drawn as three nested rhombi.
const Cube = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
    <path d="M24 4 41 14v20L24 44 7 34V14Z" />
    <path d="M24 24 41 14M24 24 7 14M24 24v20" />
    <path d="M24 12.5 32.5 17.5v10L24 32.5l-8.5-5v-10Z" opacity="0.55" />
  </svg>
);

export default function Demo({ variant = "dark" }: { variant?: string }) {
  return (
    <div className="flex min-h-full w-full">
      <ObsidianHero
        className="w-full"
        brand={{ mark: <Cube />, name: "NOOR", sub: "Systems" }}
        links={[{ label: "Services", href: "#", menu: true }, { label: "Results", href: "#" }, { label: "About", href: "#" }, { label: "Joining", href: "#" }]}
        headline={["We shape", "Signal."]}
        tagline="Data and machine learning work. We plan, build and look after the systems behind a team's numbers."
        primary={{ label: "Start a project", href: "#" }}
        cta={{ label: "See the work", href: "#" }}
        theme={variant === "light" ? "light" : "dark"}
      />
    </div>
  );
}
