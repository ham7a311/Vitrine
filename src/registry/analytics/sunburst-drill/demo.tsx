"use client";

import { SunburstDrill, type Node } from "./SunburstDrill";

const DATA: Node = {
  name: "All trips",
  children: [
    { name: "Stays", children: [
      { name: "Hotels", children: [{ name: "Al Bustan", value: 1840 }, { name: "Alila Jabal Akhdar", value: 1320 }, { name: "Shangri-La", value: 980 }] },
      { name: "Camps", children: [{ name: "Desert Nights", value: 720 }, { name: "1000 Nights", value: 460 }] },
      { name: "Rentals", children: [{ name: "Sifah villa", value: 610 }, { name: "Muscat Hills flat", value: 340 }] },
    ] },
    { name: "Food", children: [
      { name: "Restaurants", children: [{ name: "Bait Al Luban", value: 620 }, { name: "Kargeen", value: 410 }, { name: "Shuwa Grill", value: 260 }] },
      { name: "Cafés", children: [{ name: "Café Barbera", value: 240 }, { name: "Seeb Coffee", value: 150 }] },
      { name: "Groceries", children: [{ name: "Lulu", value: 330 }, { name: "Carrefour", value: 180 }] },
    ] },
    { name: "Activities", children: [
      { name: "Tours", children: [{ name: "Dhow cruise", value: 540 }, { name: "Wahiba 4×4", value: 480 }] },
      { name: "Diving", children: [{ name: "Daymaniyat dive", value: 620 }] },
      { name: "Entry", children: [{ name: "Opera House", value: 210 }, { name: "Nizwa Fort", value: 40 }] },
    ] },
    { name: "Transport", children: [
      { name: "Car hire", children: [{ name: "Dollar", value: 690 }, { name: "Sixt", value: 240 }] },
      { name: "Fuel", children: [{ name: "Shell", value: 210 }, { name: "Oman Oil", value: 170 }] },
      { name: "Flights", children: [{ name: "SalamAir MCT–SLL", value: 380 }] },
    ] },
    { name: "Shopping", children: [
      { name: "Souq", children: [{ name: "Mutrah souq", value: 420 }, { name: "Nizwa souq", value: 190 }] },
      { name: "Gifts", children: [{ name: "Amouage", value: 360 }] },
    ] },
  ],
};

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className="flex min-h-full w-full items-center justify-center px-4 py-10" style={{ background: dark ? "#0d0d0d" : "#f9f9f7" }}>
      <SunburstDrill data={DATA} theme={dark ? "dark" : "light"} />
    </div>
  );
}
