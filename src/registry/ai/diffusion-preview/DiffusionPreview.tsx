"use client";

import { useEffect, useRef, useState } from "react";
import { paintStudy } from "../../media/art-gallery/studies";
import "./diffusion-preview.css";

/**
 * Diffusion Preview
 * Image generation shown the way it actually happens: four candidates start as coloured noise
 * and resolve over the steps — blotchy shapes first, then edges, then grain — with the step
 * count and seed alongside. Pick one to see it large; generate again for new seeds.
 */

type Props = { prompt?: string; steps?: number; theme?: "paper" | "night"; motion?: "full" | "reduced"; className?: string };

const SIZE = 320;

function noise(seed: number, res: number) {
  const c = document.createElement("canvas");
  c.width = c.height = res;
  const x = c.getContext("2d")!;
  const img = x.createImageData(res, res);
  let a = seed * 9301 + 49297;
  const r = () => ((a = (a * 233280 + 1) % 2147483647) / 2147483647);
  for (let i = 0; i < res * res; i++) {
    img.data[i * 4] = r() * 255;
    img.data[i * 4 + 1] = r() * 255;
    img.data[i * 4 + 2] = r() * 255;
    img.data[i * 4 + 3] = 255;
  }
  x.putImageData(img, 0, 0);
  return c;
}

/** One frame of "denoising": the target, blurred less as k rises, under noise that fades out. */
function frame(ctx: CanvasRenderingContext2D, target: HTMLCanvasElement, coarse: HTMLCanvasElement, fine: HTMLCanvasElement, k: number) {
  const s = ctx.canvas.width;
  const a = Math.pow(k, 1.1);
  ctx.globalAlpha = 1;
  ctx.filter = `blur(${((1 - a) * 22).toFixed(1)}px) saturate(${(0.6 + a * 0.4).toFixed(2)})`;
  ctx.drawImage(target, 0, 0, s, s);
  ctx.filter = "none";
  ctx.imageSmoothingEnabled = true;
  ctx.globalAlpha = Math.max(0, 1 - a * 1.3) * 0.72;
  ctx.drawImage(coarse, 0, 0, s, s);
  ctx.imageSmoothingEnabled = false;
  ctx.globalAlpha = (1 - a) * 0.36;
  ctx.drawImage(fine, 0, 0, s, s);
  ctx.globalAlpha = 1;
  ctx.imageSmoothingEnabled = true;
}

export function DiffusionPreview({ prompt = "Bold abstract print, overlapping shapes, risograph grain, four colourways", steps = 30, theme = "paper", motion = "full", className = "" }: Props) {
  const canvases = useRef<(HTMLCanvasElement | null)[]>([]);
  const big = useRef<HTMLCanvasElement>(null);
  const [step, setStep] = useState(0);
  const [pick, setPick] = useState(0);
  const [round, setRound] = useState(0);
  const seeds = [0, 1, 2, 3].map((i) => 4127 + round * 17 + i * 5);
  const targets = useRef<HTMLCanvasElement[]>([]);

  useEffect(() => {
    const reduced = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    targets.current = seeds.map((sd) => paintStudy(sd % 997, SIZE, SIZE));
    const coarse = seeds.map((sd) => noise(sd, 12));
    const fine = seeds.map((sd) => noise(sd + 1, 96));
    let k = reduced ? steps : 0;
    let t: ReturnType<typeof setTimeout>;
    const paint = () => {
      canvases.current.forEach((c, i) => {
        if (!c) return;
        // each candidate runs a little behind the one before
        const ki = Math.max(0, Math.min(1, (k - i * 1.5) / (steps - 4.5)));
        frame(c.getContext("2d")!, targets.current[i], coarse[i], fine[i], ki);
      });
      const b = big.current;
      if (b) frame(b.getContext("2d")!, targets.current[pick], coarse[pick], fine[pick], Math.max(0, Math.min(1, (k - pick * 1.5) / (steps - 4.5))));
      setStep(Math.min(steps, Math.round(k)));
    };
    const tick = () => {
      k += 1;
      paint();
      if (k < steps) t = setTimeout(tick, 85);
    };
    paint();
    if (!reduced) t = setTimeout(tick, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, steps, motion]);

  // redraw the large view when the pick changes after generation
  useEffect(() => {
    const b = big.current, src = canvases.current[pick];
    if (b && src && step >= steps) b.getContext("2d")!.drawImage(src, 0, 0, b.width, b.height);
  }, [pick, step, steps]);

  const done = step >= steps;
  return (
    <div className={`dfp dfp--${theme} ${className}`}>
      <div className="dfp__prompt">
        <p>{prompt}</p>
        <button type="button" onClick={() => setRound((r) => r + 1)} disabled={!done}>
          {done ? "Generate again" : "Generating…"}
        </button>
      </div>
      <div className="dfp__stage">
        <canvas ref={big} width={SIZE * 2} height={SIZE * 2} className="dfp__big" role="img" aria-label={done ? `Generated image ${pick + 1} of 4 for: ${prompt}` : "Image generating"} />
        <div className="dfp__side">
          <div className="dfp__grid" role="radiogroup" aria-label="Candidates">
            {seeds.map((sd, i) => (
              <button key={sd} type="button" role="radio" aria-checked={pick === i} aria-label={`Candidate ${i + 1}, seed ${sd}`} className="dfp__thumb" onClick={() => setPick(i)}>
                <canvas
                  ref={(c) => {
                    canvases.current[i] = c;
                  }}
                  width={SIZE}
                  height={SIZE}
                />
              </button>
            ))}
          </div>
          <dl className="dfp__meta">
            <div>
              <dt>Step</dt>
              <dd aria-live="polite">
                {step} / {steps}
              </dd>
            </div>
            <div>
              <dt>Seed</dt>
              <dd>{seeds[pick]}</dd>
            </div>
            <div>
              <dt>Sampler</dt>
              <dd>Euler a</dd>
            </div>
          </dl>
          <div className="dfp__bar" aria-hidden="true">
            <i style={{ width: `${(step / steps) * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
