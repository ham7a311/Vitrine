"use client";
import { TypeDeleteButton } from "./TypeDeleteButton";

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  return (
    <div className="tdlb-demo tdlb-demo--{theme}">
      <TypeDeleteButton target="atlas-web" label="Delete this project" detail="This removes atlas-web, its 14 deployments, every domain and all of its environment variables." resetMs={2400} theme={theme} />
    </div>
  );
}
