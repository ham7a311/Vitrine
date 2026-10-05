"use client";
import { PageHeader, type PageCover } from "./PageHeader";

// An original flat illustration: layered ridges at dusk, tall enough to reposition.
const ridges = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice">
<rect width="1200" height="900" fill="#f1dcc0"/>
<circle cx="860" cy="250" r="70" fill="#f7ecd9"/>
<path d="M0 420 L140 330 L260 380 L400 270 L520 350 L660 290 L800 360 L930 300 L1060 370 L1200 320 V900 H0Z" fill="#e3b98f"/>
<path d="M0 520 L120 450 L250 500 L380 420 L520 480 L650 430 L790 500 L920 450 L1060 510 L1200 460 V900 H0Z" fill="#c98b62"/>
<path d="M0 620 L160 560 L300 610 L460 540 L600 600 L760 550 L900 610 L1050 570 L1200 620 V900 H0Z" fill="#9c5e43"/>
<path d="M0 730 L200 680 L380 720 L560 670 L740 720 L920 680 L1100 730 L1200 710 V900 H0Z" fill="#5e3a2e"/>
</svg>`;
const COVERS: PageCover[] = [
  { id: "ridges", label: "Ridges at dusk", image: `data:image/svg+xml,${encodeURIComponent(ridges)}` },
  { id: "sand", label: "Sand", color: "#e9dfcf" },
  { id: "sea", label: "Sea glass", color: "#cfe3e1" },
  { id: "ink", label: "Ink", color: "#2f3437" },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`min-h-full w-full ${dark ? "bg-[#191919]" : "bg-white"}`}>
      <PageHeader
        theme={dark ? "dark" : "light"}
        covers={COVERS}
        defaultValue={{ icon: "🗺️", title: "Masar field survey, Jebel Akhdar", cover: "ridges", coverY: 55, status: "doing", owner: "Hamza Al-Bulushi", due: "2026-10-22", tags: ["Research", "Maps"] }}
        statuses={[{ id: "todo", label: "Not started", color: "gray" }, { id: "doing", label: "In progress", color: "blue" }, { id: "blocked", label: "Blocked", color: "red" }, { id: "done", label: "Done", color: "green" }]}
        people={["Hamza Al-Bulushi", "Layla Al-Harthy", "Omar Said", "Salma Rashid"]}
        tagOptions={[{ id: "research", label: "Research", color: "purple" }, { id: "maps", label: "Maps", color: "blue" }, { id: "fieldwork", label: "Fieldwork", color: "orange" }, { id: "q4", label: "Q4", color: "gray" }]}
      />
      <div className={`mx-auto w-full max-w-[46rem] px-4 pb-12 pt-5 text-[15px] leading-[1.6] sm:px-12 ${dark ? "text-[#9b9a97]" : "text-[#787774]"}`} style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        Three days on the plateau mapping the old terrace paths. Click any property to edit it in place.
      </div>
    </div>
  );
}
