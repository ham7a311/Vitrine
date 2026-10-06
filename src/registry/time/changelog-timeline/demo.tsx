"use client";
import { ChangelogTimeline, type Release } from "./ChangelogTimeline";

const NOW = Date.UTC(2026, 9, 6, 15, 20);
const d = (y: number, mo: number, day: number) => new Date(Date.UTC(y, mo, day, 9));

const RELEASES: Release[] = [
  { version: "v2.4.0", at: d(2026, 9, 5), title: "Shared folders", changes: [
    { tag: "new", text: "Share a folder with your team; everyone sees the same files." },
    { tag: "improved", text: "Search is about three times faster on large workspaces." },
    { tag: "fixed", text: "Exports no longer drop the last row of a table." },
  ] },
  { version: "v2.3.2", at: d(2026, 8, 28), title: "Quieter notifications", changes: [
    { tag: "improved", text: "Mentions are grouped into one digest per hour." },
    { tag: "fixed", text: "Dark mode no longer flashes white on load." },
  ] },
  { version: "v2.3.0", at: d(2026, 8, 14), title: "Arabic and right-to-left layouts", changes: [
    { tag: "new", text: "Full Arabic interface with mirrored layouts." },
    { tag: "new", text: "Hijri dates alongside Gregorian ones." },
  ] },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const theme = variant === "dark" ? "dark" : "light";
  return (
    <div className={`chgl-demo chgl-demo--${theme}`}>
      <ChangelogTimeline releases={RELEASES} now={new Date(NOW)} theme={theme} />
    </div>
  );
}
