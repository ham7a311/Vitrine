"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { paintStudy } from "../../media/art-gallery/studies";
import { dither, grayOf } from "../../media/dither-portrait/dither";
import "./dither-card.css";

/**
 * Dither Card
 * A project card whose picture waits as a coarse one-bit print. Point at it (or focus it) and
 * the print resolves: the dots get finer step by step, then the colour comes through, while the
 * meta line types itself in. Leaving drops it back to the print.
 */

const STEPS = [6, 4, 3, 2, 1];

type Props = {
  title: string;
  meta: string;
  year: string;
  href?: string;
  /** Image URL; defaults to a generated study. */
  image?: string;
  seed?: number;
  theme?: "paper" | "night";
  motion?: "full" | "reduced";
  className?: string;
  style?: CSSProperties;
};

export function DitherCard({ title, meta, year, href = "#", image, seed = 4, theme = "paper", motion = "full", className = "", style }: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const prints = useRef<HTMLCanvasElement[]>([]);
  const [colour, setColour] = useState<string>("");
  const [step, setStep] = useState(0);
  const [on, setOn] = useState(false);
  const [typed, setTyped] = useState(0);
  const ink = theme === "night" ? [242, 239, 233] : [22, 20, 18];
  const paper = theme === "night" ? [17, 16, 15] : [239, 233, 220];

  // Prepare one print per cell size up front, so stepping is instant.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    let alive = true;
    const make = (src: CanvasImageSource) => {
      if (!alive) return;
      const W = 720, H = 540;
      const full = document.createElement("canvas");
      full.width = W;
      full.height = H;
      const fx = full.getContext("2d")!;
      const sw = (src as HTMLCanvasElement).width, sh = (src as HTMLCanvasElement).height, k = Math.max(W / sw, H / sh);
      fx.drawImage(src, (W - sw * k) / 2, (H - sh * k) / 2, sw * k, sh * k);
      setColour(full.toDataURL("image/jpeg", 0.9));
      prints.current = STEPS.map((c) => {
        const cw = Math.ceil(W / (c * 2)), chh = Math.ceil(H / (c * 2));
        const mask = dither(grayOf(full, cw, chh, 1.15), cw, chh, "atkinson");
        const p = document.createElement("canvas");
        p.width = cw;
        p.height = chh;
        const px = p.getContext("2d")!;
        const img = px.createImageData(cw, chh);
        for (let i = 0; i < cw * chh; i++) {
          const v = mask[i] ? ink : paper;
          img.data.set([v[0], v[1], v[2], 255], i * 4);
        }
        px.putImageData(img, 0, 0);
        return p;
      });
      setStep(0);
      paintStep(0);
    };
    if (image) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => make(img);
      img.src = image;
    } else make(paintStudy(seed, 900, 675));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, seed, theme]);

  const paintStep = (i: number) => {
    const cv = canvas.current, p = prints.current[i];
    if (!cv || !p) return;
    cv.width = p.width;
    cv.height = p.height;
    cv.getContext("2d")!.drawImage(p, 0, 0);
  };

  // Step through the prints while active; step back down when not.
  useEffect(() => {
    const reduced = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setStep(on ? STEPS.length : 0);
      if (!on) paintStep(0);
      setTyped(on ? meta.length : 0);
      return;
    }
    const id = setInterval(() => {
      setStep((s) => {
        const n = on ? Math.min(STEPS.length, s + 1) : Math.max(0, s - 1);
        if (n < STEPS.length) paintStep(n);
        if (n === s) clearInterval(id);
        return n;
      });
    }, on ? 95 : 60);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, motion]);

  useEffect(() => {
    if (!on) {
      setTyped(0);
      return;
    }
    const reduced = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return setTyped(meta.length);
    const id = setInterval(() => setTyped((t) => (t >= meta.length ? (clearInterval(id), t) : t + 1)), 22);
    return () => clearInterval(id);
  }, [on, meta, motion]);

  return (
    <a
      href={href}
      className={`dc dc--${theme} ${className}`}
      style={style}
      onPointerEnter={() => setOn(true)}
      onPointerLeave={() => setOn(false)}
      onFocus={() => setOn(true)}
      onBlur={() => setOn(false)}
      onClick={(e) => href === "#" && e.preventDefault()}
      data-on={on ? "" : undefined}
    >
      <div ref={frame} className="dc__frame">
        <canvas ref={canvas} className="dc__print" aria-hidden="true" />
        {colour && <img className="dc__colour" src={colour} alt="" data-show={step >= STEPS.length ? "" : undefined} />}
        <span className="dc__steps" aria-hidden="true">
          {step >= STEPS.length ? "COLOUR" : `1-BIT · ${STEPS[step]}PX`}
        </span>
      </div>
      <div className="dc__body">
        <div className="dc__row">
          <h3 className="dc__title">{title}</h3>
          <span className="dc__year">{year}</span>
        </div>
        <p className="dc__meta">
          <span className="dc__sr">{meta}</span>
          <span aria-hidden="true">
            {meta.slice(0, on ? typed : meta.length)}
            {on && typed < meta.length && <span className="dc__caret" />}
          </span>
        </p>
        <span className="dc__cta" aria-hidden="true">
          Read the case study <span>→</span>
        </span>
      </div>
    </a>
  );
}
