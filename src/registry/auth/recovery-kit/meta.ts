import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "recovery-kit",
  name: "Recovery Kit",
  category: "auth",
  description: "Backup codes handled properly: ten single-use codes in a mono grid with the used ones struck out, copy, download and print, and a new set on demand — the old codes visibly strike through before the fresh ones settle in. Continue only unlocks once you've said they're saved.",
  tags: ["recovery codes", "backup codes", "2fa", "mfa", "security", "account recovery", "download", "copy", "onboarding"],
  traits: ["click", "keyboard"],
  source: "original",
  isNew: true,
  files: ["RecoveryKit.tsx", "recovery-kit.css", "codes.ts"],
  dependencies: [],
  prompt:
    "Build a recovery-codes panel. Props: codes [{code, used}], account, issued (words), onRegenerate() → Promise of new codes, onContinue and theme.\n\nCodes look like 'k7m2-9fqa': two groups of four from an alphabet without look-alikes (no 0, o, 1, l or i).\n\nA card (560px max, 22px corners): a key in a rounded square, 'Save your recovery codes', and a line with how many are left and when they were issued ('8 of 10 left · issued 12 March 2026'). Then the codes in a recessed well, two columns, each with a muted two-digit index and the code in mono (select-all on click); used codes are muted with a line through them (a pseudo-element scaled from 0 to 1) and a small 'USED' label.\n\nActions in one row: Copy (writes a text file's worth to the clipboard and swaps to a tick and 'Copied' for 2s), Download (a .txt named after the account, built from a Blob), Print (a small window with the codes in a <pre>, or a message if it's blocked), and on the right 'New codes', which swaps in place for 'Old codes stop working.' Keep these / Make new codes. Making new codes strikes through every current code in turn (40ms apart) while it waits, then the fresh list fades and un-blurs in, staggered, and the issued date reads 'just now'. A failure leaves the old codes in place and says they still work.\n\nAt the bottom a custom checkbox row 'I've saved these codes somewhere safe' (a real checkbox under a drawn box that fills green with a tick) unlocks a full-width Continue; making new codes clears the tick. Every outcome is announced in a status region. Two themes; one column below 440px; reduced motion removes the strikes and the stagger.",
  interaction: "Copy, download or print the codes; make a new set (confirm first); tick that you've saved them to continue.",
  animation: "Lines strike through old codes one by one over about 600ms; new codes fade and un-blur in, staggered by 35ms; Copied shows for 2s. Reduced motion removes the motion.",
  a11y: "A section labelled by its heading; the codes are an ordered list with real text; used codes say so in words. Actions are real buttons; the confirm is a labelled group with focus on the destructive choice. The checkbox is a real input. Outcomes are announced in a status region.",
  responsive: "Two columns of codes, one below 440px; actions wrap.",
  touchFallback: "Nothing depends on hover; codes can be selected with a tap.",
  variants: [
    { id: "night", label: "Night", prompt: "Palette for this theme (Night): --rk-accent #f1f2f5; --rk-card #15161b; --rk-danger #ff8475; --rk-good #6fe0a5; --rk-ink #f1f2f5; --rk-line rgba(255, 255, 255, 0.09); --rk-muted #9da1ab; --rk-on-accent #0e0f13; --rk-well #0e0f13. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"night\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "paper", label: "Paper", prompt: "Palette for this theme (Paper): --rk-accent #15171c; --rk-card #ffffff; --rk-danger #b42318; --rk-good #12804c; --rk-ink #15171c; --rk-line rgba(18, 20, 24, 0.1); --rk-muted #5b5f69; --rk-on-accent #ffffff; --rk-well #f5f5f1. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"paper\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#0a0b0e", mode: "fill", frame: [1280, 860] },
};
