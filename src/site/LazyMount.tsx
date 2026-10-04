"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Mounts children when the box nears the viewport and unmounts them once it is
 * far away again — keeps WebGL contexts and animation loops bounded in long grids.
 */
export function LazyMount({
  children,
  className = "",
  near = "200px 0px",
  far = "150% 0px",
}: {
  children: React.ReactNode;
  className?: string;
  near?: string;
  far?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nearObs = new IntersectionObserver(([e]) => e.isIntersecting && setMounted(true), { rootMargin: near });
    const farObs = new IntersectionObserver(([e]) => !e.isIntersecting && setMounted(false), { rootMargin: far });
    nearObs.observe(el);
    farObs.observe(el);
    return () => {
      nearObs.disconnect();
      farObs.disconnect();
    };
  }, [near, far]);

  return (
    <div ref={ref} className={className}>
      {mounted ? children : null}
    </div>
  );
}
