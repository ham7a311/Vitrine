"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import "./consent-sign-in.css";

/**
 * Consent Sign-in
 * A split sign-in page: an atmospheric left panel with a drifting constellation,
 * a hand-drawn divider, and a single-column OAuth form whose providers stay
 * disabled until the privacy checkbox is ticked. Sketch rules draw themselves on mount.
 */

export type Provider = { id: string; label: string; icon: ReactNode };

type Props = {
  brand: string;
  panelHeading: ReactNode;
  panelLead: string;
  panelFooter: string;
  title: string;
  subtitle: string;
  providers: Provider[];
  consentLabel: ReactNode;
  backHref?: string;
  onContinue?: (providerId: string) => void;
};

/* ——— Ambient constellation (canvas, ~30fps, pauses offscreen) ——— */
function NodeField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const SPEED = 0.12;
    const COLOR = [243, 180, 95];
    const NODE_A = 0.5;
    const LINE_A = 0.28;
    let width = 0;
    let height = 0;
    let nodes: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    let frame = 0;
    let last = 0;
    let visible = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = Array.from({ length: 20 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        r: 1.6 + Math.random() * 1.8,
      }));
    };

    const step = () => {
      const link = Math.min(148, Math.max(96, width * 0.12));
      for (const n of nodes) {
        n.vx *= 0.992;
        n.vy *= 0.992;
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        n.x = Math.min(width, Math.max(0, n.x));
        n.y = Math.min(height, Math.max(0, n.y));
      }
      ctx.clearRect(0, 0, width, height);
      const [r, g, b] = COLOR;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const c = nodes[j];
          const dist = Math.hypot(a.x - c.x, a.y - c.y);
          if (dist > link) continue;
          ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - dist / link) * LINE_A})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(c.x, c.y);
          ctx.stroke();
        }
      }
      ctx.fillStyle = `rgba(${r},${g},${b},${NODE_A})`;
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (!visible || document.hidden || now - last < 32) return;
      last = now;
      step();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="csi-nodes" aria-hidden="true" />;
}

/* ——— Hand-drawn rules ——— */
const RULES = {
  vertical: "M20 0 C 8 7, 33 14, 12 25 C 2 36, 37 47, 16 58 C 4 70, 34 82, 11 91 C 6 96, 26 98, 20 100",
  top: "M0 12 C 7 4, 14 21, 24 9 C 35 1, 46 22, 58 10 C 70 2, 82 20, 91 8 C 96 4, 99 14, 100 12",
  bottom: "M0 12 C 6 20, 15 3, 27 14 C 38 23, 49 4, 61 13 C 73 21, 84 5, 93 16 C 97 20, 99 10, 100 12",
};

function SketchRule({ kind }: { kind: keyof typeof RULES }) {
  const vertical = kind === "vertical";
  return (
    <svg
      aria-hidden="true"
      className={vertical ? "csi-rule csi-rule--vertical" : "csi-rule"}
      viewBox={vertical ? "0 0 40 100" : "0 0 100 24"}
      preserveAspectRatio="none"
    >
      <path d={RULES[kind]} pathLength={1} className="csi-rule__stroke" />
    </svg>
  );
}

export function ConsentSignIn({ brand, panelHeading, panelLead, panelFooter, title, subtitle, providers, consentLabel, backHref = "#", onContinue }: Props) {
  const [consented, setConsented] = useState(false);
  const consentId = useId();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => e.preventDefault();

  const BackLink = ({ className = "" }: { className?: string }) => (
    <a href={backHref} className={`csi-back ${className}`}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      Back to home
    </a>
  );

  return (
    <div className="csi">
      <div className="csi-layout">
        <aside className="csi-panel">
          <div className="csi-panel__backdrop" aria-hidden="true" />
          <NodeField />
          <div className="csi-panel__top">
            <BackLink />
          </div>
          <div className="csi-panel__body">
            <h2 className="csi-panel__heading">{panelHeading}</h2>
            <p className="csi-panel__lead">{panelLead}</p>
          </div>
          <p className="csi-panel__footer">{panelFooter}</p>
        </aside>

        <SketchRule kind="vertical" />

        <div className="csi-main">
          <div className="csi-main__top">
            <BackLink className="csi-back--mobile" />
          </div>
          <div className="csi-main__center">
            <form autoComplete="off" onSubmit={onSubmit} className="csi-form" aria-label={title}>
              <SketchRule kind="top" />
              <p className="csi-eyebrow">Sign in</p>
              <h1 className="csi-title">{title}</h1>
              <p className="csi-subtitle">{subtitle}</p>

              <div className="csi-providers">
                {providers.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    disabled={!consented}
                    aria-describedby={!consented ? `${consentId}-hint` : undefined}
                    onClick={() => consented && onContinue?.(p.id)}
                    className="csi-provider"
                  >
                    {p.icon}
                    {p.label}
                  </button>
                ))}
              </div>
              <p id={`${consentId}-hint`} className="csi-sr">
                Accept the privacy notice below to enable sign-in.
              </p>

              <label htmlFor={consentId} className="csi-consent">
                <input id={consentId} type="checkbox" checked={consented} onChange={(e) => setConsented(e.target.checked)} className="csi-consent__input" />
                <span aria-hidden="true" className="csi-consent__box">
                  <svg viewBox="0 0 24 24">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span className="csi-consent__text">{consentLabel}</span>
              </label>

              <div className="csi-form__bottom">
                <SketchRule kind="bottom" />
              </div>
              <p className="csi-brand">{brand}</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
