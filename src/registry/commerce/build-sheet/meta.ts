import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "build-sheet",
  name: "Build Sheet",
  category: "commerce",
  description: "A product configurator that explains itself. Options that don't fit the current build say why on the option; choosing one anyway prints a carbon-copy slip with the cheapest fix ('Switch memory to 16 GB, +$200'), and the order sheet highlights every line that changed while the total counts to its new value.",
  tags: ["configurator", "product", "checkout", "rules", "pricing", "ecommerce", "form"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["BuildSheet.tsx", "build-sheet.css", "rules.ts"],
  dependencies: [],
  prompt:
    "Build a product configurator (a laptop, 'Masar Field 14') whose rules are visible instead of silently disabling options, laid out like an engineering order: the choices on the left and a printed build sheet on the right.\n\nSurface: off-white drafting paper with faint blue rules every 28px, a 12px radius, IBM Plex Sans with IBM Plex Mono for part numbers, prices and labels, a deep ink-blue accent. From 52rem the sheet is a sticky 19rem column; below that it follows the options.\n\nOptions: each group is a fieldset with a small mono uppercase legend ('CHIP', 'MEMORY', 'EXTRAS · choose any') over a grid of option cards (auto-fill, 190px minimum): a native radio or checkbox, the name in semibold, a muted detail line, and a mono price on the right that is relative to the current choice ('Selected', '+$200', '−$150', 'Included'; add-ons show their own price). The selected card gets a 2px accent outline. An option that conflicts with the current build stays clickable but is lightly hatched and shows a rust note in a few words ('Needs 16 GB+', 'Not with touch').\n\nChoosing a conflicting option opens a slip under its group: pale blue carbon paper with a perforated top edge, mono text, the full reason ('Video Pro needs 16 GB of memory or more.'), then the proposed fix as arrow lines with their price effect ('→ Switch memory to 16 GB +$200') and two buttons, 'Keep current' and an accent 'Make both changes'. The fix is the cheapest change to the other side of each broken rule, applied repeatedly until the build is valid, and never undoes what was just chosen; if no valid build exists, the slip says so.\n\nBuild sheet: a white card with a heavy rule under 'BUILD SHEET' and the model code, one dashed-ruled line per chosen part with its SKU under the name and its price right-aligned in mono, a large mono total that counts to each new value, and a full-width 'Place order' button.",
  interaction:
    "Clicking an option applies it at once when it fits. Otherwise the slip appears and takes focus; 'Make both changes' applies the choice and its fix together, 'Keep current' dismisses it. onSubmit(selection, total) may reject: the error shows under the button and the build is kept; success shows the reference.",
  animation:
    "The slip drops in 6px over 260ms; changed lines on the sheet flash a pale highlighter for 1.6s and the changed group's legend turns accent; the total counts up or down over 420ms with an ease-out. Reduced motion or motion={false} applies changes without any of it.",
  a11y:
    "Groups are fieldsets with native radios and checkboxes; conflicting options are aria-disabled but focusable and described by their note. The slip is a labelled group that receives focus. Every applied change and the new total are announced in a polite live region; the order result uses role=status or role=alert.",
  responsive: "Two columns from 52rem with a sticky sheet; below that the sheet follows the options. Option grids reflow by available width.",
  touchFallback: "Every option and slip action is a full tap target; nothing relies on hover.",
  variants: [
    { id: "light", label: "Light", prompt: "Palette for this theme (Light): --bsheet-accent #1f3a8a; --bsheet-accent-ink #ffffff; --bsheet-carbon #e9eefb; --bsheet-carbon-ink #1f3a8a; --bsheet-card #ffffff; --bsheet-grid rgb(31 58 138 / 0.06); --bsheet-ink #1c2230; --bsheet-line rgb(28 34 48 / 0.14); --bsheet-mark #fff0b3; --bsheet-muted #5c6474; --bsheet-paper #fbfaf6; --bsheet-warn #a3341f. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"light\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
    { id: "dark", label: "Dark", prompt: "Palette for this theme (Dark): --bsheet-accent #9db4ff; --bsheet-accent-ink #0f1424; --bsheet-carbon #1f2740; --bsheet-carbon-ink #c4d2ff; --bsheet-card #1d2027; --bsheet-grid rgb(140 170 255 / 0.05); --bsheet-ink #dfe5f1; --bsheet-line rgb(255 255 255 / 0.1); --bsheet-mark #4a4020; --bsheet-muted #98a1b3; --bsheet-paper #16181d; --bsheet-warn #ff9a80. Treat these as the root colour tokens, one value per role, and name them to suit your code. Select it with the theme option set to \"dark\". Keep every dimension, spacing value, state and motion from the brief unchanged, and keep text at 4.5:1 contrast or better on these surfaces." },
  ],
  preview: { bg: "#ecebe5", mode: "fill", frame: [1200, 820] },
};
