"use client";
import { useRef } from "react";
import { BuildSheet, type BuildGroup, type Rule } from "./BuildSheet";

const GROUPS: BuildGroup[] = [
  { id: "chip", label: "Chip", options: [
    { id: "std", label: "Standard", price: 0, sku: "MF14-C1", detail: "8-core, quiet under load" },
    { id: "pro", label: "Pro", price: 300, sku: "MF14-C2", detail: "12-core, two external displays" },
  ] },
  { id: "memory", label: "Memory", options: [
    { id: "8", label: "8 GB", price: 0, sku: "MF14-M08" },
    { id: "16", label: "16 GB", price: 200, sku: "MF14-M16" },
    { id: "32", label: "32 GB", price: 600, sku: "MF14-M32" },
  ] },
  { id: "storage", label: "Storage", options: [
    { id: "512", label: "512 GB", price: 0, sku: "MF14-S05" },
    { id: "1t", label: "1 TB", price: 200, sku: "MF14-S10" },
    { id: "2t", label: "2 TB", price: 600, sku: "MF14-S20" },
  ] },
  { id: "finish", label: "Display finish", options: [
    { id: "gloss", label: "Gloss", price: 0, sku: "MF14-DG", detail: "Deeper blacks indoors" },
    { id: "matte", label: "Matte", price: 150, sku: "MF14-DM", detail: "Readable in the sun" },
  ] },
  { id: "extras", label: "Extras", multiple: true, options: [
    { id: "touch", label: "Touch layer", price: 250, sku: "MF14-XT" },
    { id: "stylus", label: "Stylus", price: 99, sku: "MF14-XS" },
    { id: "video", label: "Video Pro", price: 199, sku: "MF14-XV", detail: "Colour grading suite" },
    { id: "care", label: "Three-year care", price: 149, sku: "MF14-XC" },
  ] },
];
const RULES: Rule[] = [
  { if: { group: "extras", option: "video" }, requires: { group: "memory", options: ["16", "32"] }, reason: "Video Pro needs 16 GB of memory or more.", short: "Needs 16 GB+" },
  { if: { group: "storage", option: "2t" }, requires: { group: "chip", options: ["pro"] }, reason: "2 TB storage needs the Pro chip's second controller.", short: "Needs Pro chip" },
  { if: { group: "finish", option: "matte" }, excludes: [{ group: "extras", option: "touch" }], reason: "The touch layer can't be laminated onto the matte finish.", short: "Not with touch" },
  { if: { group: "extras", option: "stylus" }, requires: { group: "extras", options: ["touch"] }, reason: "The stylus works through the touch layer.", short: "Needs touch layer" },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  const n = useRef(0);
  return (
    <div className={`min-h-full w-full px-4 py-8 ${dark ? "bg-[#0f1013]" : "bg-[#ecebe5]"}`}>
      <div className="mx-auto w-full max-w-[62rem]">
        <BuildSheet
          product="Masar Field 14"
          model="MF14 · REV C"
          groups={GROUPS}
          rules={RULES}
          defaultSelection={{ chip: ["std"], memory: ["8"], storage: ["512"], finish: ["matte"], extras: ["care"] }}
          basePrice={1199}
          locale="en-US"
          theme={dark ? "dark" : "light"}
          // Simulated checkout: the first attempt fails so the error path is visible.
          onSubmit={() => new Promise((resolve, reject) => setTimeout(() => (++n.current === 1 ? reject(new Error("The payment service didn't answer. Nothing was charged; try again.")) : resolve({ reference: "MF14-7Q2K" })), 700))}
        />
      </div>
    </div>
  );
}
