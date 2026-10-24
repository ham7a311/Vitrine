// Makes Pane's web images from the originals in design/mascot/. Run by hand when a pose changes, then commit the output:
//   node --experimental-strip-types --no-warnings scripts/build-mascot.mts
// It only crops and resizes. The dark background stays: Pane's glow and translucent edges live in those pixels, and the
// page blends it in with a mask. Never runs during the app's build. sharp comes with Next, so it isn't a dependency of ours.
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync, statSync } from "node:fs";

const sharp = createRequire(import.meta.url)("sharp");
const SRC = "design/mascot", OUT = "public/mascot";

/** Fixed crops in the 1672×941 originals: the character, plus room for its glow and floor light. */
const POSES = {
  present: { left: 440, top: 180, width: 910, height: 761 },
  peek: { left: 400, top: 420, width: 890, height: 521 },
  idle: { left: 470, top: 190, width: 730, height: 751 },
  wave: { left: 380, top: 40, width: 890, height: 901 },
  carry: { left: 400, top: 60, width: 840, height: 881 },
  study: { left: 500, top: 100, width: 700, height: 841 },
  // Upside down: the crop starts at the hips (the legs stay hidden behind the section above) and ends under the hands.
  hang: { left: 505, top: 190, width: 660, height: 640 },
  // Seated with the star: the whole figure and the soft light where he sits.
  star: { left: 700, top: 140, width: 860, height: 801 },
  // Footer peek: head and the top of the shoulders; the rest is hidden by the footer's rule.
  "footer-peek": { left: 510, top: 210, width: 620, height: 562 },
} as const;

mkdirSync(OUT, { recursive: true });
const manifest: Record<string, { widths: number[]; aspect: number }> = {};
for (const [pose, crop] of Object.entries(POSES)) {
  const widths = [640, crop.width];
  for (const w of widths) {
    const base = sharp(`${SRC}/${pose}.png`).extract(crop).resize({ width: w, kernel: "lanczos3" });
    await base.clone().avif({ quality: 72, effort: 9, chromaSubsampling: "4:4:4" }).toFile(`${OUT}/${pose}-${w}.avif`);
    await base.clone().webp({ quality: 88, effort: 6, smartSubsample: true }).toFile(`${OUT}/${pose}-${w}.webp`);
    console.log(`${pose}-${w}: avif ${Math.round(statSync(`${OUT}/${pose}-${w}.avif`).size / 1024)} KB, webp ${Math.round(statSync(`${OUT}/${pose}-${w}.webp`).size / 1024)} KB`);
  }
  manifest[pose] = { widths, aspect: +(crop.width / crop.height).toFixed(4) };
}
writeFileSync(
  "src/site/pane-poses.ts",
  `// Written by scripts/build-mascot.mts. Do not edit by hand.\nexport const PANE_POSES = ${JSON.stringify(manifest, null, 2)} as const;\n`,
);
