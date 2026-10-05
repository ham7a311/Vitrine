"use client";
import { ExplodedView, type ExplodedPart } from "./ExplodedView";

// An original drawing of a small desk lamp, in a 480 × 520 sheet.
const PARTS: ExplodedPart[] = [
  {
    id: "shade", name: "Shade", detail: "Spun aluminium, 120 mm mouth, matte inside",
    dir: [40, -46], anchor: [352, 206],
    shape: <><path className="xview__s" d="M306 170 L338 158 L392 238 L330 262 Z" /><path className="xview__d" d="M316 176 L376 246" /><circle className="xview__s" cx={318} cy={180} r={6} /></>,
  },
  {
    id: "bulb", name: "LED bulb", detail: "E14, 4.5 W, 2700 K warm white",
    dir: [44, 30], anchor: [366, 256],
    shape: <><rect className="xview__s" x={352} y={232} width={14} height={12} rx={2} transform="rotate(-20 359 238)" /><circle className="xview__glass" cx={366} cy={256} r={16} /><path className="xview__d" d="M360 256 q6 -8 12 0" /></>,
  },
  {
    id: "upper", name: "Upper arm", detail: "Steel tube, 160 mm, internal cable run",
    dir: [-10, -42], anchor: [254, 230],
    shape: <><path className="xview__rod" d="M190 280 L318 180" /><path className="xview__rod-in" d="M190 280 L318 180" /></>,
  },
  {
    id: "elbow", name: "Elbow joint", detail: "Friction hinge with a hand-turned brass knob",
    dir: [-66, -14], anchor: [190, 280],
    shape: <><circle className="xview__s" cx={190} cy={280} r={13} /><circle className="xview__s" cx={190} cy={280} r={4} /><rect className="xview__s" x={166} y={274} width={10} height={12} rx={2} /></>,
  },
  {
    id: "lower", name: "Lower arm", detail: "Steel tube, 170 mm, counter-sprung",
    dir: [-46, 4], anchor: [215, 358],
    shape: <><path className="xview__rod" d="M240 436 L190 280" /><path className="xview__rod-in" d="M240 436 L190 280" /></>,
  },
  {
    id: "switch", name: "Rocker switch", detail: "Rated 2 A, on the base so it can be found in the dark",
    dir: [50, 26], anchor: [303, 451],
    shape: <><rect className="xview__s" x={296} y={445} width={15} height={11} rx={3} /><path className="xview__d" d="M300 450 H307" /></>,
  },
  {
    id: "base", name: "Base", detail: "Cast iron, 1.2 kg, cork underside",
    dir: [0, 40], anchor: [240, 456],
    shape: <><rect className="xview__s" x={160} y={440} width={160} height={28} rx={13} /><ellipse className="xview__s" cx={240} cy={440} rx={68} ry={9} /><path className="xview__d" d="M172 462 H308" /></>,
  },
];

export default function Demo({ variant = "light" }: { variant?: string }) {
  const dark = variant === "dark";
  return (
    <div className={`min-h-full w-full px-4 py-8 ${dark ? "bg-[#0a0e12]" : "bg-[#e4e8ec]"}`}>
      <div className="mx-auto w-full max-w-[62rem]">
        <ExplodedView title="Qalam desk lamp, model DL-2" parts={PARTS} viewBox={[480, 520]} theme={dark ? "dark" : "light"} />
      </div>
    </div>
  );
}
