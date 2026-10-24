import { preload } from "react-dom";
import { PANE_POSES } from "./pane-poses";

export type PanePose = keyof typeof PANE_POSES;

const srcSet = (pose: PanePose, ext: "avif" | "webp") => PANE_POSES[pose].widths.map((w) => `/mascot/${pose}-${w}.${ext} ${w}w`).join(", ");

/**
 * Pane, Vitrine's resident, as a responsive picture. The render keeps its dark backdrop (the glow and the glass edges
 * live in those pixels); each place that shows Pane blends it in with a mask. Always decorative: alt is empty.
 */
export function Pane({ pose, sizes, priority = false, className }: { pose: PanePose; sizes: string; priority?: boolean; className?: string }) {
  const { widths, aspect } = PANE_POSES[pose];
  const w = widths[widths.length - 1];
  // Only the hero's pose is preloaded, and only as AVIF: every browser this site supports decodes it.
  if (priority) preload(`/mascot/${pose}-${widths[0]}.avif`, { as: "image", type: "image/avif", imageSrcSet: srcSet(pose, "avif"), imageSizes: sizes, fetchPriority: "high" });
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet(pose, "avif")} sizes={sizes} />
      <img
        src={`/mascot/${pose}-${widths[0]}.webp`}
        srcSet={srcSet(pose, "webp")}
        sizes={sizes}
        width={w}
        height={Math.round(w / aspect)}
        alt=""
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        draggable={false}
      />
    </picture>
  );
}
