"use client";
import { WrapCaption, type WrapSlide } from "./WrapCaption";
import { scenes } from "./scenes";

const slides: WrapSlide[] = [
  { id: "a", picture: scenes.train, alt: "A small blue and white train under a snow-capped mountain", place: "Hollin Valley", lines: ["Mount Arden", "Above the fog"] },
  { id: "b", picture: scenes.lighthouse, alt: "A lighthouse on a cliff at dusk, its beam crossing the sky", place: "Saltmere Point", lines: ["Last light", "Keep it burning"] },
  { id: "c", picture: scenes.lake, alt: "A mountain reflected in a still lake under a pink sky", place: "Glass Lake", lines: ["Still water", "Twice the mountain"] },
  { id: "d", picture: scenes.canal, alt: "A canal at night with neon signs reflected in the water", place: "Old Harbour", lines: ["After hours", "Neon on water"] },
];

export default function Demo({ variant = "cobalt" }: { variant?: string }) {
  const accent = variant === "coral" ? "#ef6a4f" : variant === "lime" ? "#b9e05a" : "#4a7be0";
  return (
    <div style={{ minHeight: "100%", display: "grid", alignContent: "center", background: "#09090b" }}>
      <WrapCaption slides={slides} accent={accent} />
    </div>
  );
}
