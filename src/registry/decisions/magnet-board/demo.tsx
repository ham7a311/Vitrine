"use client";
import { MagnetBoard, type MagnetItem } from "./MagnetBoard";

const NAMES = ["Aero 13", "Aero 15", "Dhow 14", "Dhow 16 Pro", "Falcon 13", "Falcon X", "Field 14", "Field 16", "Harbour Air", "Harbour 15", "Kestrel 12", "Kestrel 14", "Lantern 13", "Lantern 16", "Minaret 14", "Minaret Studio", "Oryx 13", "Oryx 15", "Palm Lite", "Palm 14", "Quill 12", "Quill 14 Pro", "Sabkha 15", "Wadi 13"];
const LAPTOPS: MagnetItem[] = NAMES.map((label, i) => {
  const h = (i * 37 + 11) % 100, k = (i * 61 + 7) % 100, q = (i * 23 + 41) % 100;
  const weight = Math.round((0.95 + (k / 100) * 1.35) * 100) / 100;
  return {
    id: `l${i}`,
    label,
    values: {
      price: Math.round((650 + h * 17 + (label.includes("Pro") || label.includes("Studio") ? 700 : 0)) / 10) * 10,
      battery: Math.round(7 + (q / 100) * 13 - weight * 1.5),
      weight,
      rating: Math.round((3.3 + ((h + q) % 100) / 60) * 10) / 10,
    },
  };
});

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-8 ${dark ? "bg-[#0e1013]" : "bg-[#e8e3d6]"}`}>
      <div className="w-full max-w-[64rem]">
        <MagnetBoard
          items={LAPTOPS}
          noun="laptops"
          attributes={[
            { key: "price", label: "Price", code: "$", format: (v) => `$${v.toLocaleString("en-US")}` },
            { key: "battery", label: "Battery", code: "Bt", format: (v) => `${v} h` },
            { key: "weight", label: "Weight", code: "Kg", format: (v) => `${v.toFixed(2)} kg` },
            { key: "rating", label: "Rating", code: "★", format: (v) => `${v.toFixed(1)} / 5` },
          ]}
          initialMagnets={[{ key: "battery", x: 0.16, y: 0.2 }, { key: "weight", x: 0.84, y: 0.2, invert: true }, { key: "price", x: 0.5, y: 0.86, invert: true }]}
          theme={dark ? "dark" : "light"}
        />
      </div>
    </div>
  );
}
