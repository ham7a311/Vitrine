"use client";

import { Kintsugi } from "./Kintsugi";

const COPY = {
  ink: ["Restoration", "Broken well, mended better", "Ceramics repaired by hand in Kyoto since 1961"],
  celadon: ["The repair shop", "Bring us the pieces", "Bowls, cups and plates, back in use within three weeks"],
  oxblood: ["Autumn sale", "Seconds, and proud of it", "Kiln-marked pieces at half price until 30 November"],
} as const;

export default function Demo({ variant = "ink" }: { variant?: string }) {
  const palette = (variant in COPY ? variant : "ink") as keyof typeof COPY;
  const [eyebrow, title, note] = COPY[palette];
  return (
    <Kintsugi palette={palette}>
      <div className="flex h-full min-h-[inherit] flex-col justify-end gap-3 px-7 py-12 sm:px-16 sm:py-16">
        <p className="m-0 text-[12px] font-medium uppercase tracking-[0.14em] opacity-70">{eyebrow}</p>
        <h2 className="m-0 max-w-[13ch] text-[clamp(2rem,6vw,3.6rem)] leading-[1.02] tracking-[-0.03em]" style={{ fontFamily: '"Newsreader", Georgia, serif', fontWeight: 500 }}>{title}</h2>
        <p className="m-0 max-w-[36ch] text-[15px] opacity-75">{note}</p>
      </div>
    </Kintsugi>
  );
}
