"use client";
import { useRef } from "react";
import { SpendControls } from "./SpendControls";

export default function Demo({ variant = "dark" }: { variant?: string }) {
  const light = variant === "light";
  const saves = useRef(0);
  return (
    <div className={`flex min-h-full w-full justify-center px-4 py-10 ${light ? "bg-[#f6f6f7]" : "bg-[#0b0b0c]"}`}>
      <div className="w-full max-w-[34rem]">
        <SpendControls
          cardName="Software"
          last4="1907"
          theme={light ? "light" : "dark"}
          locale="en-US"
          defaultValue={{ limit: 300_000, period: "month", categories: ["Software"] }}
          categories={["Software", "Advertising", "Travel", "Meals", "Office supplies"]}
          spent={{ day: 18_900, month: 124_000, total: 1_480_350 }}
          // Simulated service: the first save fails so the error path is visible.
          onSave={() => new Promise((resolve, reject) => setTimeout(() => (++saves.current === 1 ? reject(new Error("timeout")) : resolve()), 700))}
        />
      </div>
    </div>
  );
}
