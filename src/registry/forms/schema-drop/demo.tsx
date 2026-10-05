"use client";
import { useRef } from "react";
import { SchemaDrop, type NewTable } from "./SchemaDrop";

const RIDES = `Ride ID,Station,Started at,Minutes,Member,Bike type,Note
1001,"Mutrah Corniche",2026-09-01 07:12,18.5,true,electric,
1002,Qurum Beach,2026-09-01 07:40,22,false,classic,"windy, slow return"
1003,Al Mouj Marina,2026-09-01 08:05,NA,true,electric,
1004,Ruwi Centre,2026-09-01 08:31,9.25,true,classic,
1005,Seeb Souq,2026-09-01 09:02,11,false,electric,"left at ""wrong"" dock"
1006,Mutrah Corniche,2026-09-01 09:20,31.5,true,classic,
1007,Bawshar Dunes,2026-09-01 10:44,7,false,classic,`;
const STATIONS = `station_id;name;opened;docks;lat;lon
MCT-01;Mutrah Corniche;2023-11-02;24;23.6175;58.5644
MCT-02;Qurum Beach;2023-11-02;30;23.6216;58.4781
MCT-07;Al Mouj Marina;2024-03-18;20;23.6302;58.2802`;

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  const tries = useRef(0);
  // Simulated service: the first create fails, so the retry path is visible.
  const create = (t: NewTable) => new Promise<void>((resolve, reject) => setTimeout(() => (++tries.current === 1 ? reject(new Error(`Catalog error: the workspace is still waking up. Try again in a moment.`)) : resolve()), 800 + t.rows.length));
  return (
    <div className={`flex min-h-full w-full justify-center px-4 py-10 sm:px-8 ${dark ? "bg-[#1f1f1f]" : "bg-[#f4efea]"}`}>
      <div className="w-full max-w-[48rem]">
        <SchemaDrop onCreate={create} samples={[{ label: "rides.csv", name: "rides_2026_09.csv", text: RIDES }, { label: "stations.csv", name: "stations.csv", text: STATIONS }]} theme={dark ? "dark" : "light"} locale="en-GB" />
      </div>
    </div>
  );
}
