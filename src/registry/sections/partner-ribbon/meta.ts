import type { ComponentMeta } from "../../types";
export const meta: ComponentMeta = {
  "slug": "partner-ribbon",
  "name": "Partner Ribbon",
  "category": "sections",
  "description": "A quiet stream of company marks or names, measured to loop without a seam, with the strip itself acting as a quiet pause target.",
  "tags": [
    "partners",
    "clients",
    "collaborators",
    "trusted by",
    "logos",
    "marquee",
    "social proof"
  ],
  "traits": [
    "ambient",
    "hover",
    "keyboard"
  ],
  "source": "original",
  "files": [
    "PartnerRibbon.tsx",
    "partner-ribbon.css"
  ],
  "dependencies": [],
  "prompt": "Build a hairline-framed company-identity ribbon on dark forest green (#142019). A small mono label sits above the strip; there are no separate controls or link directories. Within soft horizontal edge masks, show optically balanced company identities or images at natural proportions with generous spacing. Measure an entire sequence including its trailing gap, repeat enough copies to cover the viewport plus a spare sequence, and move by the exact measured period at a constant pixel-per-second speed. Default to 28px/s desktop and 20px/s on small containers. Re-measure with ResizeObserver, font completion and image load/error, preserving proportional progress. Pause on hover and manual pause; suspend requestAnimationFrame entirely offscreen or when the document is hidden, without a jump when resumed. Animated copies are decorative. The moving strip is a single native button: click, tap, Enter or Space toggles persistent pause with a dynamic accessible action label and visible focus. Give assistive technology a single identity list. No external assets or animation libraries. A missing image falls back to the company label, zero items omit the section and one item stays static. Reduced motion uses one wrapping, unmasked collection, not a duplicated frozen track. Use native controls, visible focus, proper cleanup and fluid layout.",
  "interaction": "Hover pauses temporarily; clicking, tapping, Enter or Space on the moving strip toggles persistent pause. There are no separate visible controls.",
  "animation": "Measured translate3d loop at 28px/s desktop or 20px/s mobile, with phase retained across resize. Offscreen/hidden frame work stops. Reduced motion renders a static list.",
  "a11y": "Decorative copies are aria-hidden; a single accessible identity list remains. The whole moving strip is a labelled native pause target with visible focus. Reduced motion and single-item arrangements are static, without a button.",
  "responsive": "Measured natural-width marks repeat to cover any viewport. Header wraps below 600px; reduced motion uses a fluid wrapping collection. One item is static.",
  "touchFallback": "Tap the moving strip to pause or resume; no visible instruction or secondary control.",
  "variants": [
    {
      "id": "marks",
      "label": "Mixed marks",
      "prompt": "Use eight fictional companies with original inline SVG image marks at mixed natural widths. One leftward row, muted treatment. Keep the single-row arrangement."
    },
    {
      "id": "names",
      "label": "Names only",
      "prompt": "Omit every imageSrc and show eight company names as typographic identities in one leftward row. Use muted treatment. Keep the single-row arrangement."
    },
    {
      "id": "opposing",
      "label": "Opposing rows",
      "prompt": "Use rows={2}: split eight original company symbols into alternating, separate item sets. The first row moves left and the second right; use original colour treatment. The strip itself is the pause target; do not render separate controls or a partner directory."
    }
  ],
  "preview": {
    "bg": "#142019",
    "mode": "fill",
    "frame": [
      1000,
      640
    ]
  },
  "isNew": true
};
