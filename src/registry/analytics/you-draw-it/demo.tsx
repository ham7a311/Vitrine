"use client";
import { YouDrawIt } from "./YouDrawIt";

// Fictional: Masar's weekly active teams, monthly averages for 2026.
const DATA = [
  ["Jan", 410], ["Feb", 455], ["Mar", 520], ["Apr", 575], ["May", 590], ["Jun", 540], ["Jul", 470], ["Aug", 485], ["Sep", 640], ["Oct", 720], ["Nov", 760], ["Dec", 700],
].map(([x, y]) => ({ x: x as string, y: y as number }));

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`flex min-h-full w-full items-center justify-center px-4 py-10 ${dark ? "bg-[#0c0c0b]" : "bg-[#e7e3da]"}`}>
      <div className="w-full max-w-[46rem]">
        <YouDrawIt
          question="Masar's weekly active teams grew all spring. What do you think happened next?"
          data={DATA}
          known={5}
          yDomain={[0, 900]}
          xLabel="Month"
          theme={dark ? "dark" : "light"}
        />
      </div>
    </div>
  );
}
