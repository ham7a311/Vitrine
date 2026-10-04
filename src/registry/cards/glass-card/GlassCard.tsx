"use client";

import type { ReactNode } from "react";
import { GlassTiles, type GlassTilesPalette } from "../../backgrounds/glass-tiles/GlassTiles";
import "./glass-card.css";

/**
 * Glass Card
 * A card set into a small wall of glass tiles with light moving behind it — the Glass Tiles
 * background at card scale — with its content on a clear pane at the bottom.
 */

type Props = {
  eyebrow: string;
  title: string;
  price?: string;
  features?: string[];
  action?: ReactNode;
  palette?: GlassTilesPalette;
  className?: string;
};

export function GlassCard({ eyebrow, title, price, features = [], action, palette, className = "" }: Props) {
  return (
    <article className={`gcd ${className}`}>
      <GlassTiles palette={palette} columns={4} className="gcd__tiles" />
      <div className="gcd__pane">
        <p className="gcd__eyebrow">{eyebrow}</p>
        <h3 className="gcd__title">{title}</h3>
        {price && <p className="gcd__price">{price}</p>}
        {features.length > 0 && (
          <ul className="gcd__list">
            {features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        )}
        {action && <div className="gcd__action">{action}</div>}
      </div>
    </article>
  );
}
