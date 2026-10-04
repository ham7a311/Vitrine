"use client";

import { useEffect, useRef, useState } from "react";

/** Renders children at a fixed design width and scales them down to fit — for page-sized previews. */
export function ScaledFrame({ width, height, children }: { width: number; height: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect;
      setScale(Math.min(w / width, h / height));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, height]);

  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden">
      {scale > 0 && (
        <div
          className="absolute left-1/2 top-1/2"
          style={{ width, height, transform: `translate(-50%, -50%) scale(${scale})`, transformOrigin: "center" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
