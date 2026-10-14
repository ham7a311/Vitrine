"use client";
import { DaylightAtlas, type Teammate } from "./DaylightAtlas";

const TEAM: Teammate[] = [
  { name: "Amara Okafor", city: "Lagos", lon: 3.38, lat: 6.52, offset: 1 },
  { name: "Elin Strand", city: "Tromsø", lon: 18.96, lat: 69.65, offset: 2 },
  { name: "Ravi Menon", city: "Pune", lon: 73.86, lat: 18.52, offset: 5.5 },
  { name: "Kenji Arai", city: "Osaka", lon: 135.5, lat: 34.69, offset: 9 },
  { name: "Tui Parata", city: "Wellington", lon: 174.78, lat: -41.29, offset: 13 },
  { name: "Lucía Ferro", city: "Montevideo", lon: -56.16, lat: -34.9, offset: -3 },
  { name: "Marcus Hale", city: "Denver", lon: -104.99, lat: 39.74, offset: -6 },
];

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div style={{ minHeight: "100%", display: "grid", placeItems: "center", padding: "28px 16px", background: paper ? "#efece4" : "#07080c" }}>
      <DaylightAtlas people={TEAM} theme={paper ? "paper" : "night"} />
    </div>
  );
}
