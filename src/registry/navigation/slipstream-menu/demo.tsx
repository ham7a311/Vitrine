"use client";
import { SlipstreamMenu } from "./SlipstreamMenu";
import { scenes } from "./scenes";

export default function Demo({ variant = "night" }: { variant?: string }) {
  const paper = variant === "paper";
  return (
    <div style={{ minHeight: "100%", display: "grid", alignContent: "center", background: paper ? "#f2f1ec" : "#060606" }}>
      <SlipstreamMenu
        theme={paper ? "paper" : "night"}
        label="Places"
        onNavigate={(_, e) => e.preventDefault()}
        items={[
          { label: "Saltmere", href: "#saltmere", pictures: [scenes.lighthouse, scenes.canal] },
          { label: "Hollin Valley", href: "#hollin", pictures: [scenes.train, scenes.dawn] },
          { label: "Glass Lake", href: "#glass", pictures: [scenes.lake, scenes.blossom] },
          { label: "Old Harbour", href: "#harbour", pictures: [scenes.neon, scenes.noodle] },
        ]}
      />
    </div>
  );
}
