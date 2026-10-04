"use client";

import { HalftoneCta } from "./HalftoneCta";

export default function Demo({ variant = "dark" }: { variant?: string }) {
  const light = variant === "light";
  return (
    <div className="flex min-h-full w-full items-center justify-center p-5 sm:p-10" style={{ background: light ? "#f3f0ea" : "#0c0b0a" }}>
      <HalftoneCta
        className="w-full max-w-5xl"
        theme={light ? "light" : "dark"}
        badge="Curious how it works?"
        heading={
          <>
            See the whole system,
            <br />
            start to finish.
          </>
        }
        subtext="A calm walkthrough of how Northstar plans, builds and ships — from the first sketch to the last review."
        action={{ href: "#tour", label: "Take the tour" }}
      />
    </div>
  );
}
