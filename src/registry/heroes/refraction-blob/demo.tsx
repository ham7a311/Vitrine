"use client";
import { RefractionBlob } from "./RefractionBlob";

export default function Demo({ variant = "light" }: { variant?: string }) {
  return (
    <RefractionBlob
      name="Rami Nasser"
      label="Design engineer"
      mark="RN"
      links={[{ label: "Work", href: "#", current: true }, { label: "Lab", href: "#" }, { label: "About", href: "#" }, { label: "CV", href: "#" }]}
      contact={{ label: "Say hello", href: "#" }}
      status="Available for work"
      tagline="Calm software for busy people, from first sketch to shipped code."
      theme={variant === "dark" ? "dark" : "light"}
    />
  );
}
