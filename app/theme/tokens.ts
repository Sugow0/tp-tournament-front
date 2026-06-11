/**
 * Dungeons & Dragons theme palette.
 *
 * Single source of truth for the colours used by JavaScript-driven visuals
 * (the Three.js `ArenaScene`). The CSS custom properties in `app/app.css`
 * mirror these exact values so the canvas and the DOM stay in sync.
 *
 * Aesthetic: a candle-lit tome — warm near-black leather, antique brass,
 * parchment text and heraldic D&D crimson, à la the official D&D store.
 */
export const dndPalette = {
  /* Tome / leather backgrounds (warm near-black) */
  arenaBg: "#0e0b09",
  arenaMid: "#181210",
  arenaSurface: "#221a15",
  arenaElevated: "#2c211a",
  arenaHover: "#392c22",

  /* Antique brass / gold — borders, ornaments, treasure */
  gold: "#c9a44b",
  goldBright: "#ecc972",
  goldDark: "#997a2f",

  /* Heraldic D&D red — primary actions */
  crimson: "#b1121f",
  crimsonDark: "#870d18",

  /* Blood maroon — battle / danger (kept distinct from the primary crimson) */
  blood: "#8c1c13",

  /* Heraldic accents */
  victory: "#3f9d6b",
  magic: "#7c4dbf",
  draw: "#d8932b",

  /* Torch fire — embers and light sources for the arena scene */
  ember: "#e07820",
  torch: "#c85a00",

  /* Parchment text on leather */
  text: "#e8dcc0",
  textMuted: "#a08a68",
  textBright: "#f7eed8",
} as const;

export type DndPalette = typeof dndPalette;
