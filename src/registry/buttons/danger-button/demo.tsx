"use client";
import { DangerButton } from "./DangerButton";

const MODES = ["inline", "hold", "type"] as const;

export default function Demo({ variant = "inline" }: { variant?: string }) {
  const mode = (MODES as readonly string[]).includes(variant) ? (variant as (typeof MODES)[number]) : "inline";
  const props = {
    mode,
    target: "atlas-web",
    label: mode === "type" ? "Delete this project" : "Delete project",
    detail: "This removes atlas-web, its 14 deployments, every domain and all of its environment variables.",
    resetMs: 2400,
  };
  return (
    <div className="dgr-demo">
      <div className="dgr-demo__panel dgr-demo__panel--light"><DangerButton {...props} /></div>
      <div className="dgr-demo__panel dgr-demo__panel--dark"><DangerButton {...props} theme="dark" /></div>
    </div>
  );
}
