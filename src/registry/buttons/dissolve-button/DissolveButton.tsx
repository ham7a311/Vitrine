"use client";

import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import "./dissolve-button.css";

/**
 * Dissolve Button
 * Press it and it comes apart: the face breaks into hundreds of small squares that drift up and
 * scatter, then gather again into the finished state. Real work runs while it's in pieces.
 */

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "children"> & {
  children: ReactNode;
  done?: ReactNode;
  colour?: string;
  doneColour?: string;
  /** The work; the button reforms when it resolves. */
  onAction?: () => Promise<unknown> | void;
  motion?: "full" | "reduced";
};

type P = { x: number; y: number; ox: number; oy: number; vx: number; vy: number; s: number; d: number };

export function DissolveButton({ children, done = "Done", colour = "#7c5cff", doneColour = "#16a34a", onAction, motion = "full", className = "", ...rest }: Props) {
  const btn = useRef<HTMLButtonElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"idle" | "apart" | "done">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const run = async () => {
    if (state !== "idle") return;
    const b = btn.current, c = cv.current;
    const reduced = motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!b || !c || reduced) {
      await onAction?.();
      setState("done");
      timer.current = setTimeout(() => setState("idle"), 1800);
      return;
    }
    const W = b.offsetWidth, H = b.offsetHeight, pad = 60, dpr = Math.min(devicePixelRatio || 1, 2);
    c.width = (W + pad * 2) * dpr;
    c.height = (H + pad * 2) * dpr;
    c.style.width = `${W + pad * 2}px`;
    c.style.height = `${H + pad * 2}px`;
    const ctx = c.getContext("2d")!;
    ctx.scale(dpr, dpr);
    const S = 4, R = H / 2, ps: P[] = [];
    for (let y = 0; y < H; y += S)
      for (let x = 0; x < W; x += S) {
        // keep the pill's rounded ends
        const cx = x < R ? R : x > W - R ? W - R : x;
        if (Math.hypot(x + S / 2 - cx, y + S / 2 - R) > R) continue;
        const a = Math.random() * Math.PI * 2;
        ps.push({ x: x + pad, y: y + pad, ox: x + pad, oy: y + pad, vx: Math.cos(a) * (0.6 + Math.random() * 2.4) + (x / W - 0.5) * 1.5, vy: -1.2 - Math.random() * 2.6, s: S - 0.6, d: (x / W) * 140 });
      }
    setState("apart");
    const work = Promise.resolve(onAction?.());
    let back = false, t0 = performance.now(), fill = colour;
    work.then(() => {
      // gather after at least 650ms apart
      setTimeout(() => {
        back = true;
        t0 = performance.now();
        fill = doneColour;
      }, Math.max(0, 650 - (performance.now() - t0)));
    });
    const frame = (now: number) => {
      ctx.clearRect(0, 0, W + pad * 2, H + pad * 2);
      ctx.fillStyle = fill;
      let settled = back;
      for (const p of ps) {
        const t = now - t0 - (back ? 0 : p.d);
        if (!back) {
          if (t > 0) {
            p.vx *= 0.97;
            p.vy = p.vy * 0.97 - 0.02;
            p.x += p.vx;
            p.y += p.vy;
          }
          ctx.globalAlpha = Math.max(0, 1 - Math.max(0, t) / 900);
        } else {
          p.x += (p.ox - p.x) * 0.16;
          p.y += (p.oy - p.y) * 0.16;
          ctx.globalAlpha = Math.min(1, (now - t0) / 260);
          if (Math.abs(p.ox - p.x) + Math.abs(p.oy - p.y) > 0.5) settled = false;
        }
        ctx.fillRect(p.x, p.y, p.s, p.s);
      }
      ctx.globalAlpha = 1;
      if (back && settled) {
        ctx.clearRect(0, 0, W + pad * 2, H + pad * 2);
        setState("done");
        timer.current = setTimeout(() => setState("idle"), 1800);
        return;
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  return (
    <span className={`dsb-wrap ${className}`}>
      <button ref={btn} type="button" className="dsb" data-state={state} style={{ ["--c" as string]: colour, ["--done" as string]: doneColour }} onClick={run} aria-busy={state === "apart"} {...rest}>
        <span className="dsb__label">{state === "done" ? done : children}</span>
      </button>
      <canvas ref={cv} className="dsb__dust" aria-hidden="true" />
      <span className="dsb__sr" role="status">
        {state === "apart" ? "Working…" : state === "done" ? (typeof done === "string" ? done : "Done") : ""}
      </span>
    </span>
  );
}
