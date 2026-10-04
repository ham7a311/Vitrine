"use client";

import { SlattedLight } from "./SlattedLight";

const THEMES: Record<string, [string, string, number]> = {
  afternoon: ["#f1e3c8", "#0b080d", 24],
  moonlight: ["#c9d8f0", "#06080d", 32],
  dusk: ["#f0b8a0", "#0d0709", 18],
};

export default function Demo({ variant = "afternoon" }: { variant?: string }) {
  const [light, room, angle] = THEMES[variant] ?? THEMES.afternoon;
  return (
    <SlattedLight light={light} room={room} angle={angle} className="h-full min-h-full w-full">
      <div className="flex h-full flex-col justify-end p-8">
        <p className="max-w-sm font-serif text-3xl italic leading-tight text-white/85" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
          The quiet hour, just before the lamps come on.
        </p>
      </div>
    </SlattedLight>
  );
}
