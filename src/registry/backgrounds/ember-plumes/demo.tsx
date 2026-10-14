"use client";
import { EmberPlumes, type EmberPlumesPalette } from "./EmberPlumes";

const P: Record<string, EmberPlumesPalette> = {
  coral: { bg: "#0a0b06", deep: "#4d1006", mid: "#d4461d", hot: "#ffb07a", spot: "#30320f" },
  orchid: { bg: "#09060d", deep: "#3c0c3e", mid: "#c2409c", hot: "#ffb6e8", spot: "#1f1632" },
  citrine: { bg: "#0a0805", deep: "#4a2a05", mid: "#df931d", hot: "#ffe6a2", spot: "#2c2612" },
};

export default function Demo({ variant = "coral" }: { variant?: string }) {
  return <EmberPlumes palette={P[variant] ?? P.coral} fade className="h-full min-h-full w-full" />;
}
