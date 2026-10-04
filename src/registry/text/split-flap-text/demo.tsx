"use client";

import { SplitFlapText } from "./SplitFlapText";

const BOARDS = [
  ["WY 903  SALALAH    14:05", "WY 645  DUBAI      14:20", "QR 1135 DOHA       14:45", "SV 891  RIYADH     15:10"],
  ["WY 903  SALALAH  GATE A4", "WY 645  DUBAI      14:20", "QR 1135 DOHA     GATE B2", "SV 891  RIYADH     15:10"],
  ["WY 903  SALALAH BOARDING", "WY 645  DUBAI    DELAYED", "QR 1135 DOHA     GATE B2", "SV 891  RIYADH   ON TIME"],
];

const PAGE: Record<string, string> = { amber: "#070708", white: "#0a0b0c", cream: "#efe9dc" };

export default function Demo({ variant = "amber" }: { variant?: string }) {
  const theme = (["amber", "white", "cream"].includes(variant) ? variant : "amber") as "amber" | "white" | "cream";
  return (
    <div className="flex min-h-full w-full items-center justify-center px-4 py-12 sm:px-8" style={{ background: PAGE[theme] }}>
      <SplitFlapText boards={BOARDS} theme={theme} className="w-full max-w-[900px]" />
    </div>
  );
}
