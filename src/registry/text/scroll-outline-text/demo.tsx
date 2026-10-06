"use client";
import { ScrollOutlineText } from "./ScrollOutlineText";

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  return <ScrollOutlineText lines={["Every pixel", "earns its", "place."]} theme={theme} />;
}
