"use client";
import { PinDrop } from "./PinDrop";

export default function Demo({ variant = "paper" }: { variant?: string }) {
  const night = variant === "night";
  return (
    <div className={`flex min-h-full w-full items-center justify-center p-8 ${night ? "bg-[#0e0f13] text-[#efeff3]" : "bg-[#f1efe9] text-[#17181c]"}`} style={{ fontFamily: '"Hanken Grotesk", ui-sans-serif, system-ui' }}>
      <div className={`w-full max-w-sm overflow-hidden rounded-[20px] ${night ? "bg-[#17181d]" : "bg-white shadow-[0_20px_40px_-24px_rgb(0_0_0/0.35)]"}`}>
        {/* a tiny drawn map instead of a photo */}
        <svg viewBox="0 0 320 120" className="block w-full" aria-hidden="true">
          <rect width="320" height="120" fill={night ? "#1f2229" : "#e9ecef"} />
          <path d="M0 78 C70 64 120 96 190 80 S290 54 320 62" fill="none" stroke={night ? "#2c4a66" : "#b9d4ea"} strokeWidth="18" />
          <path d="M40 0 L76 120 M150 0 L132 120 M0 34 L320 22 M230 0 L262 120" fill="none" stroke={night ? "#2a2e37" : "#ffffff"} strokeWidth="6" />
          <circle cx="146" cy="52" r="5" fill={night ? "#ff6a52" : "#e2462f"} />
        </svg>
        <div className="flex items-end justify-between gap-4 p-5">
          <div>
            <p className="text-[16px] font-semibold">Café Ondina</p>
            <p className={`mt-1 text-[13px] ${night ? "text-[#a3a4ad]" : "text-[#5e5f66]"}`}>Bakery · Rua das Gaivotas 12 · open till 19:00</p>
          </div>
        </div>
        <div className="px-5 pb-5">
          <PinDrop place="Café Ondina" list="Lisbon, May" theme={night ? "night" : "paper"} />
        </div>
      </div>
    </div>
  );
}
