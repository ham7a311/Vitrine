"use client";
import { SignalTiles, type SignalTile } from "./SignalTiles";

const TILES: SignalTile[] = [
  { title: "Sites built to last", href: "#", icon: "globe" },
  { title: "Careful redesigns", href: "#", icon: "redesign" },
  { title: "Online shops", href: "#", icon: "cart" },
  { title: "Sites you can edit", href: "#", icon: "stack" },
  { title: "Launch pages", href: "#", icon: "send" },
  { title: "Brand systems", href: "#", icon: "puzzle" },
  { title: "Motion and interaction", href: "#", icon: "bolt" },
  { title: "UX strategy", href: "#", icon: "pointer" },
  { title: "Speed tuning", href: "#", icon: "rocket" },
  { title: "Care and support", href: "#", icon: "tools" },
];

export default function Demo({ variant = "dark" }: { variant?: string }) {
  return (
    <div className="min-h-full w-full">
      <SignalTiles
        heading="What the Masar studio makes."
        tiles={TILES}
        primary={{ label: "All services", href: "#" }}
        secondary={{ label: "Start a project", href: "#" }}
        theme={variant === "light" ? "light" : "dark"}
      />
    </div>
  );
}
