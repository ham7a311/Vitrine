import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "alert-callout",
  name: "Alert Callout",
  category: "feedback",
  description: "Inline alerts in four tones (information, success, warning, danger), each with its own mark, a short title, a sentence, the actions that resolve it and a close button that folds the message away smoothly. As tinted boxes, hairline boxes, accent-barred notes or full-width banners.",
  tags: ["alert", "callout", "banner", "notice", "warning", "error", "success", "info", "message", "dismiss"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["AlertCallout.tsx", "alert-callout.css"],
  dependencies: [],
  prompt:
    "Build an inline alert component in four tones, in the single presentation selected below. Inter 14.5px/1.5.\n\nAnatomy: a three-column grid (20px mark, text, an optional close button). Marks are line icons in the tone: a circled i, a circled tick, a triangle with a stroke and dot, and an octagon with a stroke and dot. Text: a 600-weight title, then a muted sentence, then actions: an optional small filled button in the tone (7px radius, page-coloured text) and text links in the tone with a faint underline that firms up on hover.\n\nTones (light / dark), colour then tint then hairline: info #1d4fd8 #eef3ff #c9d8fd / #8db3ff #0f1a30 #22385f; success #13703a #ebf7ef #bfe3cb / #6fdc93 #0e2015 #1f4329; warning #8a5900 #fdf5e1 #f0d9a0 / #f8c45c #241b08 #4d3a14; danger #c0161c #fdeeee #f5c6c7 / #ff8a8d #2a1113 #5a2226. Text #1d1e21 / #e8e9ec, muted #4a4d55 / #b0b3ba.\n\nEntering, it fades down 4px. The close button (28px, labelled 'Dismiss: <title>') folds it away: animate grid-template-rows from 1fr to 0fr with the opacity over 0.26s, then remove it.\n\nShow four examples ('A new version is ready', 'Payment received', 'Your trial ends in 3 days' with 'Add card', 'Deploy failed' with 'View logs' and 'Retry') on a #f7f7f6 panel and a #0b0b0c panel side by side, with a way to bring dismissed ones back.",
  interaction: "Actions are buttons or links; the close button removes the alert after it folds.",
  animation: "A 0.28s entrance and a 0.26s fold on dismiss; none with reduced motion.",
  a11y: "Danger uses role=alert so it's announced at once; the others use role=status. Each close button names the alert it closes, and after a dismissal keyboard focus moves to the neighbouring alert's close button. The mark is decorative; the tone is also in the title.",
  responsive: "Text wraps under the title; banner actions drop to their own line on narrow screens.",
  touchFallback: "28px close targets inside a padded box; nothing relies on hover.",
  variants: [
    { id: "soft", label: "Soft", prompt: "Soft: a 12px-radius box in the tone's tint with a 1px inset hairline in the tone, 14px padding (16px on the left)." },
    { id: "outline", label: "Outline", prompt: "Outline: a 12px-radius box in the page colour with the tone's 1px inset hairline and a barely-there shadow; the tone lives only in the mark, the edge and the actions." },
    { id: "accent", label: "Accent bar", prompt: "Accent bar: a box with a 3px inset bar in the tone down its left side (4px radius on the left, 12px on the right), filled with the tone's tint mixed 70% into the page, 18px left padding, no other edge." },
    { id: "banner", label: "Banner", prompt: "Banner: a full-width strip at the top of the page, square, in the tone's tint with a hairline along the bottom; the mark, title, sentence and actions sit on one line where they fit (actions pushed to the end, dropping to their own line on narrow screens), the close button at the far right, 10px vertical padding. Several banners stack." },
  ],
  preview: { bg: "#f7f7f6", mode: "fill", frame: [1200, 640] },
  isNew: true,
};
