"use client";

import { FeralTitle } from "./FeralTitle";

export default function Demo({ variant = "blood" }: { variant?: string }) {
  if (variant === "ash") return <FeralTitle colors={["#f1ece2", "#8e8a80"]} blood="#3b3a36" background="#070707" />;
  if (variant === "rust") return <FeralTitle colors={["#d2691e", "#6b2a0c"]} blood="#3d1707" background="#0a0604" />;
  return <FeralTitle />;
}
