/** Quentin Blake–inspired paper, ink, and wash. Original palette, not a film still. */
export const PAPER = 0xf4e6c4;
export const PAPER_SHADOW = 0xe2d0a4;
export const INK = 0x2b2118;
export const INK_SOFT = 0x4a3b2a;
export const WASH_RUST = 0xc45a28;
export const WASH_CREAM = 0xf7edd4;
export const WASH_NIGHT = 0x24324a;
export const WASH_MOSS = 0x5a7a46;
export const WASH_CLAY = 0x8a5a3a;
export const WASH_CIDER = 0xb8860b;
export const WASH_BLOOD = 0x8a2a1a;
export const LETTERBOX = 0x1a140e;

export const FARM_WASH: Record<"boggis" | "bunce" | "bean", number> = {
  boggis: 0xd4a05a,
  bunce: 0x7a8f4a,
  bean: 0x6a5a78,
};

export const ART_SEEDS = {
  mrFox: 10411,
  mrsFox: 10429,
  smallFox: 10433,
  badger: 10453,
  mole: 10459,
  rabbit: 10463,
  weasel: 10477,
  boggis: 10487,
  bunce: 10499,
  bean: 10501,
  chicken: 10513,
  duck: 10529,
  goose: 10531,
  turkey: 10559,
  cider: 10567,
  ham: 10589,
  tree: 10601,
  grass: 10607,
  earth: 10613,
  hill: 10627,
} as const;
