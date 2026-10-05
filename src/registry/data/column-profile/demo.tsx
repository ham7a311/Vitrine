"use client";
import { ColumnProfile } from "./ColumnProfile";
import type { ProfileColumn } from "./profile";

// A seeded, repeatable sample: 400 fictional bike rides around Muscat.
function rides() {
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const stations = ["Mutrah Corniche", "Qurum Beach", "Al Mouj Marina", "Ruwi Centre", "Seeb Souq", "Bawshar Dunes"];
  const weights = [0.32, 0.25, 0.18, 0.12, 0.09, 0.04];
  const pick = () => { let r = rand(), i = 0; while (r > weights[i] && i < weights.length - 1) r -= weights[i++]; return stations[i]; };
  return Array.from({ length: 400 }, (_, i) => {
    const minutes = Math.round((6 + -Math.log(1 - rand()) * 11) * 10) / 10;
    const dayOffset = Math.floor(rand() * 30);
    return {
      ride_id: 1000 + i,
      station: pick(),
      minutes: rand() < 0.04 ? null : minutes,
      started_on: new Date(Date.UTC(2026, 8, 1 + dayOffset)).toISOString().slice(0, 10),
      member: rand() < 0.62,
      promo_code: rand() < 0.81 ? null : ["RAMADAN", "SUMMER", "FIRSTRIDE"][Math.floor(rand() * 3)],
    };
  });
}
const ROWS = rides();
const COLUMNS: ProfileColumn[] = [
  { name: "ride_id", kind: "number" },
  { name: "station", kind: "text" },
  { name: "minutes", kind: "number" },
  { name: "started_on", kind: "date" },
  { name: "member", kind: "boolean" },
  { name: "promo_code", kind: "text" },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`flex min-h-full w-full justify-center px-4 py-10 sm:px-8 ${dark ? "bg-[#1f1f1f]" : "bg-[#f4efea]"}`}>
      <div className="w-full max-w-[60rem]">
        <ColumnProfile table="muscat_bikes.rides" columns={COLUMNS} rows={ROWS} theme={dark ? "dark" : "light"} locale="en-GB" />
      </div>
    </div>
  );
}
