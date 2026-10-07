import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  slug: "schema-drop",
  name: "Schema Drop",
  category: "forms",
  description: "Drop a CSV and see the table it will become: safe column names, a type inferred for each column (and editable), a preview of the first rows, and one button to create it.",
  tags: ["upload", "csv", "import", "schema", "data", "dropzone"],
  traits: ["click", "keyboard"],
  source: "original",
  files: ["SchemaDrop.tsx", "csv.ts", "schema-drop.css"],
  dependencies: [],
  prompt:
    "Build a CSV-to-table importer in a playful-technical, diagrammatic style: warm off-white page #f4efea, white panels, ink #383838, 2px ink borders, 2px corners, flat hard shadows, DM Mono uppercase labels and buttons, Inter light body.\n\nEmpty state: a dashed 2px drop zone with a line-drawn file icon, 'DROP A CSV TO MAKE A TABLE', a muted note that nothing leaves the browser until you create it, a yellow #ffde00 'CHOOSE A FILE' button (a real file input stretched invisibly over it), and optional 'or try rides.csv · stations.csv' sample links underlined in sky blue. Dragging over turns the zone pale yellow with a solid border and a 4px hard shadow.\n\nParse in the browser with an RFC 4180 parser (quoted fields with commas, doubled quotes and newlines; CRLF; delimiter sniffed from , ; tab |). Infer each column's narrowest type from up to 500 values, ignoring nulls (empty, NULL, NA, N/A, NaN, None): BOOLEAN (true/false/yes/no/t/f), BIGINT (up to 18 digits), DOUBLE, DATE (valid calendar dates), TIMESTAMP, else VARCHAR. Snake-case headers into safe names, de-duplicating repeats.\n\nLoaded state: a bordered card with a hard shadow. Header strip: file name, '7 rows · 7 columns', and 'CHANGE FILE'. A table-name field (validated: lowercase letters, numbers, underscores, starting with a letter; invalid shows a coral border and coral hard shadow). A columns table: mono name, a type select with a 6px colour bar inside its left edge (numbers sky, dates teal, booleans yellow, text coral), null percentage, and sample values (hidden under 34rem). A scrolling preview of the first five rows. Footer: yellow 'CREATE TABLE' → 'CREATING…' → a teal success note 'Created rides_2026_09 with 7 rows.' and 'LOAD ANOTHER FILE'; failures show a coral note and 'TRY AGAIN'.",
  interaction:
    "Drop a file or choose one; files over maxBytes or not CSV-like are refused with a reason. Types can be overridden per column. onCreate receives { name, columns, rows } and its promise drives the pending, success and failure states; nothing is created twice while pending.",
  animation: "Only state colour changes and the 2px hover lift on buttons, over 120–140ms. Reduced motion removes the transitions.",
  a11y:
    "The file input is real and keyboard-focusable inside its visible label. Problems use role=alert and success uses role=status. The table-name field is described by its rule and marked aria-invalid; each type select is labelled 'Type for ride_id'. The columns table has a caption and row headers; the preview region is focusable and labelled.",
  responsive: "The card is fluid; the sample column hides under 34rem and the preview scrolls horizontally.",
  touchFallback: "Choose a file through the native picker; drag and drop is optional.",
  variants: [
    { id: "light", label: "Light", prompt: "Light theme: page #f4efea, panels #ffffff, ink, borders and hard shadows #383838, muted #6f6a64, faint #a39e97, rules rgb(56 56 56 / 0.14), yellow #ffde00, sky #6fc2ff, teal #16aa98, coral #ff9538, drag-over #fff6b8, error #ffe1d6/#b33a12, success #d8f3ee/#0d6b60." },
    { id: "dark", label: "Dark", prompt: "Dark theme: page #1f1f1f, panels #2a2927, ink and borders #f4efea with #000000 hard shadows, muted #b9b2a9, faint #7d776f, rules rgb(244 239 234 / 0.14), drag-over #3b3720, error #3d2a22/#ffb391, success #1e3a35/#7fe0d1; yellow buttons keep ink text." },
  ],
  preview: { bg: "#f4efea", mode: "fill", frame: [900, 760] },
};
