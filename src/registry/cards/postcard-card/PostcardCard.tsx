"use client";

import { useEffect, useId, useState, type CSSProperties, type ReactNode } from "react";
import "./postcard-card.css";

/**
 * Postcard
 * A big-letter postcard: "Greetings from" in script over the town's name in
 * chunky block capitals, each letter filled with the evening sky and
 * standing out from the scene behind. Turn it over and the back writes
 * itself — the message line by line in blue pen — then the postmark comes
 * down on the stamp with a thud and its wavy cancellation lines.
 */

export type Place = {
  name: string;
  scene: ReactNode;
  sky: [string, string, string];
  stamp: ReactNode;
  message: string[];
  to: string[];
  date: string;
};
type Props = { place: Place; motion?: "full" | "reduced"; className?: string };

export function PostcardCard({ place, motion = "full", className = "" }: Props) {
  const id = useId().replace(/:/g, "");
  const [back, setBack] = useState(false);
  const [round, setRound] = useState(0);
  useEffect(() => { if (back) setRound((r) => r + 1); }, [back]);

  return (
    <div className={`pc ${className}`} data-motion={motion}>
      <button type="button" className="pc__btn" onClick={() => setBack((b) => !b)} aria-pressed={back} aria-label={back ? "Turn the postcard to the front" : `Turn the postcard over — greetings from ${place.name}`}>
        <div className="pc__card" key={`c-${back ? round : "f"}`} data-back={back || undefined} style={{ ["--s0" as string]: place.sky[0], ["--s1" as string]: place.sky[1], ["--s2" as string]: place.sky[2], ["--pm" as string]: `${500 + place.message.length * 520 + 300}ms` } as CSSProperties}>
          {/* Front */}
          <div className="pc__face pc__front" aria-hidden={back || undefined}>
            <div className="pc__scene">{place.scene}</div>
            <div className="pc__lettering">
              <span className="pc__greet">Greetings from</span>
              <span className="pc__word">
                <span className="pc__word-shadow">{place.name}</span>
                <span className="pc__word-fill">{place.name}</span>
                <span className="pc__word-line">{place.name}</span>
              </span>
            </div>
            <div className="pc__grain" />
          </div>
          {/* Back */}
          <div className="pc__face pc__back" aria-hidden={!back || undefined} key={`b-${round}`}>
            <div className="pc__msg">
              {place.message.map((l, i) => (
                <p key={i} className="pc__line" style={{ ["--d" as string]: `${500 + i * 520}ms` } as CSSProperties}>{l}</p>
              ))}
            </div>
            <div className="pc__divider" />
            <div className="pc__right">
              <div className="pc__stamp">
                <div className="pc__stamp-art">{place.stamp}</div>
                <span className="pc__stamp-val">200 Bz · Oman</span>
              </div>
              <svg className="pc__postmark" viewBox="0 0 220 120" aria-hidden="true">
                <defs><path id={`${id}-arc`} d="M40 60 a34 34 0 1 1 68 0 a34 34 0 1 1 -68 0" /></defs>
                <circle cx="74" cy="60" r="44" className="pc__pm-ring" />
                <circle cx="74" cy="60" r="30" className="pc__pm-ring pc__pm-ring--in" />
                <text className="pc__pm-text"><textPath href={`#${id}-arc`}>{place.name.toUpperCase()} G.P.O · OMAN ·</textPath></text>
                <text x="74" y="57" className="pc__pm-date">{place.date}</text>
                <text x="74" y="70" className="pc__pm-date pc__pm-date--sm">2026</text>
                {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M118 ${36 + i * 12} q12 -6 24 0 t24 0 t24 0 t24 0`} className="pc__pm-wave" />)}
              </svg>
              <div className="pc__addr">
                {place.to.map((l, i) => <p key={i} className="pc__line pc__line--addr" style={{ ["--d" as string]: `${200 + i * 300}ms` } as CSSProperties}>{l}</p>)}
              </div>
            </div>
          </div>
        </div>
      </button>
      <p className="pc__hint" aria-hidden="true">{back ? "Click to turn it back" : "Click to turn it over"}</p>
    </div>
  );
}
