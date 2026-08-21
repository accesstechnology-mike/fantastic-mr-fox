import Phaser from "phaser";
import { CHARACTERS } from "../data/characters";
import { ART_SEEDS, INK, PAPER, PAPER_SHADOW, WASH_CLAY, WASH_MOSS, WASH_NIGHT, WASH_RUST } from "../data/palette";
import { CUTSCENES } from "../data/story";
import type { CharacterId, FoodKind } from "../types";
import { hex, inkBlob, mix, rng, scratchyStroke, wash } from "./ink";

function canvasTexture(
  scene: Phaser.Scene,
  key: string,
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D) => void,
): void {
  if (scene.textures.exists(key)) {
    return;
  }
  const canvas = scene.textures.createCanvas(key, width, height);
  if (!canvas) {
    throw new Error(`Could not create texture ${key}`);
  }
  const ctx = canvas.context;
  ctx.clearRect(0, 0, width, height);
  draw(ctx);
  canvas.refresh();
}

function drawCreature(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  washColor: number,
  ink: number,
  seed: number,
  kind: CharacterId,
): void {
  const rand = rng(seed);
  ctx.clearRect(0, 0, w, h);
  const cx = w * 0.5;
  const bodyY = h * 0.62;
  wash(ctx, cx, bodyY, w * 0.55, h * 0.5, washColor, rand, 8);
  wash(ctx, cx, h * 0.28, w * 0.42, h * 0.32, mix(washColor, 0xf7edd4, 0.25), rand, 5);

  if (kind === "bean") {
    scratchyStroke(
      ctx,
      [
        { x: cx, y: h * 0.12 },
        { x: cx - 3, y: h * 0.55 },
        { x: cx + 2, y: h * 0.92 },
      ],
      ink,
      rand,
      2,
    );
    inkBlob(ctx, cx, h * 0.16, 6, washColor, rand);
  } else if (kind === "boggis") {
    wash(ctx, cx, bodyY, w * 0.7, h * 0.55, washColor, rand, 6);
    scratchyStroke(
      ctx,
      [
        { x: w * 0.18, y: h * 0.55 },
        { x: cx, y: h * 0.4 },
        { x: w * 0.82, y: h * 0.58 },
        { x: cx, y: h * 0.88 },
        { x: w * 0.18, y: h * 0.55 },
      ],
      ink,
      rand,
      1.8,
    );
    inkBlob(ctx, cx, h * 0.28, 10, mix(washColor, 0xf0c8a0, 0.4), rand);
  } else if (kind === "bunce") {
    wash(ctx, cx, h * 0.58, w * 0.72, h * 0.42, washColor, rand, 6);
    scratchyStroke(
      ctx,
      [
        { x: w * 0.2, y: h * 0.5 },
        { x: w * 0.8, y: h * 0.5 },
        { x: w * 0.72, y: h * 0.86 },
        { x: w * 0.28, y: h * 0.86 },
        { x: w * 0.2, y: h * 0.5 },
      ],
      ink,
      rand,
      1.7,
    );
    inkBlob(ctx, cx, h * 0.32, 8, mix(washColor, 0xe8d2a8, 0.3), rand);
  } else {
    const snout = kind === "mole" ? 8 : 16;
    scratchyStroke(
      ctx,
      [
        { x: cx - 10, y: h * 0.3 },
        { x: cx, y: h * 0.16 },
        { x: cx + 12, y: h * 0.3 },
        { x: cx + snout, y: h * 0.38 },
      ],
      ink,
      rand,
      1.5,
    );
    scratchyStroke(
      ctx,
      [
        { x: cx - 12, y: h * 0.48 },
        { x: cx - 16, y: h * 0.78 },
        { x: cx + 14, y: h * 0.8 },
        { x: cx + 10, y: h * 0.48 },
      ],
      ink,
      rand,
      1.6,
    );
    if (kind === "mrFox" || kind === "mrsFox" || kind === "smallFox" || kind === "weasel") {
      scratchyStroke(
        ctx,
        [
          { x: w * 0.18, y: h * 0.72 },
          { x: w * 0.08, y: h * 0.5 },
          { x: w * 0.2, y: h * 0.42 },
        ],
        ink,
        rand,
        1.3,
      );
    }
    if (kind === "badger") {
      scratchyStroke(ctx, [{ x: cx - 8, y: h * 0.24 }, { x: cx + 8, y: h * 0.4 }], ink, rand, 2.2);
    }
  }

  ctx.fillStyle = hex(ink);
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.ellipse(cx + 4, h * 0.3, 1.4, 2.2, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawFood(ctx: CanvasRenderingContext2D, kind: FoodKind, seed: number): void {
  const rand = rng(seed);
  const palette: Record<FoodKind, number> = {
    chicken: 0xe8d8b0,
    duck: 0xd8b25a,
    goose: 0xece6d2,
    turkey: 0xa85a32,
    cider: 0xc48a1a,
    ham: 0xc45a5a,
  };
  wash(ctx, 16, 18, 20, 16, palette[kind], rand, 6);
  scratchyStroke(
    ctx,
    [
      { x: 8, y: 16 },
      { x: 16, y: 8 },
      { x: 24, y: 16 },
      { x: 18, y: 26 },
      { x: 10, y: 22 },
    ],
    INK,
    rand,
    1.3,
  );
}

function drawTile(ctx: CanvasRenderingContext2D, kind: string, size: number, seed: number): void {
  const rand = rng(seed);
  if (kind === "grass") {
    wash(ctx, size / 2, size / 2, size, size, mix(WASH_MOSS, 0xc8d888, 0.35), rand, 5);
  } else if (kind === "tall") {
    wash(ctx, size / 2, size / 2, size, size, WASH_MOSS, rand, 6);
    scratchyStroke(ctx, [{ x: 6, y: size - 4 }, { x: 8, y: 6 }], INK, rand, 1);
    scratchyStroke(ctx, [{ x: size - 8, y: size - 3 }, { x: size - 6, y: 8 }], INK, rand, 1);
  } else if (kind === "tree") {
    wash(ctx, size / 2, size / 2, size * 0.9, size * 0.9, mix(WASH_MOSS, 0x2a3a20, 0.2), rand, 6);
    scratchyStroke(
      ctx,
      [
        { x: 4, y: size - 6 },
        { x: size / 2, y: 4 },
        { x: size - 4, y: size - 5 },
      ],
      INK,
      rand,
      1.4,
    );
  } else if (kind === "earth") {
    wash(ctx, size / 2, size / 2, size, size, WASH_CLAY, rand, 5);
  } else if (kind === "rock") {
    wash(ctx, size / 2, size / 2, size, size, mix(WASH_CLAY, 0x4a4038, 0.4), rand, 4);
    scratchyStroke(ctx, [{ x: 4, y: 8 }, { x: size - 3, y: size - 6 }], INK, rand, 1.5);
  } else if (kind === "floor") {
    wash(ctx, size / 2, size / 2, size, size, mix(0xc4a070, PAPER, 0.3), rand, 4);
  } else if (kind === "den") {
    wash(ctx, size / 2, size / 2, size, size, mix(WASH_CLAY, 0xd2b48c, 0.4), rand, 4);
  } else if (kind === "night") {
    wash(ctx, size / 2, size / 2, size, size, mix(WASH_NIGHT, 0x3a4a38, 0.35), rand, 4);
  } else if (kind === "surface") {
    wash(ctx, size / 2, size / 2, size, size, mix(WASH_NIGHT, WASH_RUST, 0.15), rand, 3);
  } else if (kind === "slick") {
    wash(ctx, size / 2, size / 2, size, size, mix(0x8a7030, 0x3a3020, 0.3), rand, 5);
  } else if (kind === "hole") {
    wash(ctx, size / 2, size / 2, size, size, 0x1a120c, rand, 4);
    scratchyStroke(
      ctx,
      [
        { x: 6, y: size / 2 },
        { x: size / 2, y: 6 },
        { x: size - 6, y: size / 2 },
        { x: size / 2, y: size - 6 },
        { x: 6, y: size / 2 },
      ],
      INK,
      rand,
      1.6,
    );
  } else {
    wash(ctx, size / 2, size / 2, size, size, PAPER_SHADOW, rand, 3);
  }
}

function drawPanel(ctx: CanvasRenderingContext2D, art: string, w: number, h: number): void {
  const rand = rng(art.split("").reduce((n, ch) => n + ch.charCodeAt(0), 900));
  wash(ctx, w / 2, h / 2, w, h, PAPER, rand, 10);
  wash(ctx, w * 0.5, h * 0.75, w, h * 0.5, mix(PAPER, WASH_MOSS, 0.2), rand, 6);
  if (art.includes("night") || art.includes("ambush") || art.includes("waiting") || art.includes("shot")) {
    wash(ctx, w / 2, h * 0.28, w, h * 0.55, WASH_NIGHT, rand, 8);
  }
  if (art.includes("boggis")) {
    wash(ctx, w * 0.45, h * 0.6, 90, 80, 0xd4a05a, rand, 6);
  }
  if (art.includes("bunce")) {
    wash(ctx, w * 0.5, h * 0.68, 80, 50, 0x7a8f4a, rand, 5);
  }
  if (art.includes("bean")) {
    scratchyStroke(ctx, [{ x: w * 0.55, y: h * 0.2 }, { x: w * 0.52, y: h * 0.85 }], INK, rand, 2.4);
  }
  if (art.includes("fox") || art.includes("tail") || art.includes("pulled") || art.includes("plan")) {
    wash(ctx, w * 0.4, h * 0.55, 70, 60, WASH_RUST, rand, 6);
  }
  if (art.includes("machine") || art.includes("spade")) {
    scratchyStroke(ctx, [{ x: 40, y: 40 }, { x: w - 40, y: h - 50 }], INK, rand, 3);
    wash(ctx, w * 0.6, h * 0.35, 120, 70, 0x6a6058, rand, 5);
  }
  if (art.includes("chicken")) {
    wash(ctx, w * 0.5, h * 0.5, 140, 70, 0xe8d8b0, rand, 7);
  }
  if (art.includes("store") || art.includes("ham")) {
    wash(ctx, w * 0.5, h * 0.45, 150, 80, 0xc4a070, rand, 6);
  }
  if (art.includes("cider") || art.includes("cellar")) {
    wash(ctx, w * 0.5, h * 0.6, 160, 70, 0xb8860b, rand, 6);
  }
  if (art.includes("feast") || art.includes("dining") || art.includes("toast")) {
    wash(ctx, w * 0.5, h * 0.55, 180, 90, mix(WASH_CLAY, 0xe8c878, 0.3), rand, 8);
  }
  scratchyStroke(
    ctx,
    [
      { x: 18, y: 16 },
      { x: w - 16, y: 20 },
      { x: w - 22, y: h - 18 },
      { x: 20, y: h - 16 },
      { x: 18, y: 16 },
    ],
    INK,
    rand,
    1.8,
  );
}

export function generateAllTextures(scene: Phaser.Scene): void {
  const tile = 32;
  for (const id of Object.keys(CHARACTERS) as CharacterId[]) {
    const stats = CHARACTERS[id];
    canvasTexture(scene, `char-${id}`, 56, 72, (ctx) => {
      drawCreature(ctx, 56, 72, stats.wash, stats.ink, ART_SEEDS[id], id);
    });
    canvasTexture(scene, `portrait-${id}`, 48, 48, (ctx) => {
      drawCreature(ctx, 48, 48, stats.wash, stats.ink, ART_SEEDS[id] + 17, id);
    });
  }

  const foods: FoodKind[] = ["chicken", "duck", "goose", "turkey", "cider", "ham"];
  for (const food of foods) {
    canvasTexture(scene, `food-${food}`, 32, 32, (ctx) => drawFood(ctx, food, ART_SEEDS[food]));
  }

  const tiles: Array<[string, number]> = [
    ["tile-grass", ART_SEEDS.grass],
    ["tile-tall", ART_SEEDS.grass + 3],
    ["tile-tree", ART_SEEDS.tree],
    ["tile-earth", ART_SEEDS.earth],
    ["tile-rock", ART_SEEDS.earth + 9],
    ["tile-floor", ART_SEEDS.earth + 11],
    ["tile-den", ART_SEEDS.earth + 13],
    ["tile-night", ART_SEEDS.hill],
    ["tile-surface", ART_SEEDS.hill + 4],
    ["tile-slick", ART_SEEDS.earth + 21],
    ["tile-hole", ART_SEEDS.hill + 8],
    ["tile-rubble", ART_SEEDS.earth + 27],
  ];
  for (const [key, seed] of tiles) {
    const kind = key.replace("tile-", "");
    canvasTexture(scene, key, tile, tile, (ctx) => drawTile(ctx, kind, tile, seed));
  }

  canvasTexture(scene, "paper-bg", 128, 128, (ctx) => {
    const rand = rng(2211);
    wash(ctx, 64, 64, 128, 128, PAPER, rand, 8);
  });

  const arts = new Set<string>();
  for (const cut of Object.values(CUTSCENES)) {
    for (const panel of cut.panels) {
      arts.add(panel.art);
    }
  }
  for (const art of arts) {
    canvasTexture(scene, art, 880, 360, (ctx) => drawPanel(ctx, art, 880, 360));
  }
}
