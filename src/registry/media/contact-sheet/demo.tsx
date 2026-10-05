"use client";
import { ContactSheet, type SheetFrame } from "./ContactSheet";
import { scene, sceneTitle } from "./scenes";

const FRAMES: SheetFrame[] = Array.from({ length: 16 }, (_, i) => ({ id: `f${i}`, src: scene(i), alt: sceneTitle(i), title: sceneTitle(i) }));

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`min-h-full w-full px-4 py-8 ${dark ? "bg-[#101215]" : "bg-[#d9dde2]"}`}>
      <div className="mx-auto w-full max-w-[64rem]">
        <ContactSheet frames={FRAMES} roll="12" defaultMarks={{ f2: { circle: true, stars: 4 }, f5: { reject: true }, f9: { circle: true, stars: 2 } }} theme={dark ? "dark" : "light"} />
      </div>
    </div>
  );
}
