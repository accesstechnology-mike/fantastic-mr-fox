import Phaser from "phaser";
import { CHARACTERS } from "../data/characters";
import { ART_SEEDS } from "../data/palette";
import { CUTSCENES } from "../data/story";
import type { CharacterId, FoodKind } from "../types";
import { drawCharacterSprite, drawFoodSprite, drawPortrait } from "./figures";
import { rng } from "./ink";
import { drawNamedPanel, PANEL_DRAWERS } from "./panels";
import { drawTile } from "./tiles";

function canvasTexture(
  scene: Phaser.Scene,
  key: string,
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D) => void,
): void {
  if (scene.textures.exists(key)) {
    scene.textures.remove(key);
  }
  const canvas = scene.textures.createCanvas(key, width, height);
  if (!canvas) {
    throw new Error(`Could not create texture ${key}`);
  }
  draw(canvas.context);
  canvas.refresh();
}

export function generateAllTextures(scene: Phaser.Scene): void {
  const tile = 32;
  for (const id of Object.keys(CHARACTERS) as CharacterId[]) {
    const seed = ART_SEEDS[id];
    canvasTexture(scene, `char-${id}`, 80, 96, (ctx) => {
      drawCharacterSprite(ctx, 80, 96, id, rng(seed), { tail: true });
    });
    canvasTexture(scene, `portrait-${id}`, 64, 64, (ctx) => {
      drawPortrait(ctx, 64, 64, id, rng(seed + 17), { tail: true });
    });
  }

  canvasTexture(scene, "char-mrFox-notail", 80, 96, (ctx) => {
    drawCharacterSprite(ctx, 80, 96, "mrFox", rng(ART_SEEDS.mrFox + 3), { tail: false });
  });
  canvasTexture(scene, "portrait-mrFox-notail", 64, 64, (ctx) => {
    drawPortrait(ctx, 64, 64, "mrFox", rng(ART_SEEDS.mrFox + 21), { tail: false });
  });

  const foods: FoodKind[] = ["chicken", "duck", "goose", "turkey", "cider", "ham"];
  for (const food of foods) {
    canvasTexture(scene, `food-${food}`, 36, 36, (ctx) => drawFoodSprite(ctx, food, 36, 36, rng(ART_SEEDS[food])));
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
    canvasTexture(scene, key, tile, tile, (ctx) => drawTile(ctx, kind, tile, rng(seed)));
  }

  canvasTexture(scene, "paper-bg", 128, 128, (ctx) => {
    drawTile(ctx, "den", 128, rng(2211));
  });

  const arts = new Set<string>();
  for (const cut of Object.values(CUTSCENES)) {
    for (const panel of cut.panels) {
      arts.add(panel.art);
    }
  }
  for (const art of arts) {
    if (!PANEL_DRAWERS[art]) {
      throw new Error(`Cutscene panel "${art}" has no book illustration`);
    }
    canvasTexture(scene, art, 900, 400, (ctx) => drawNamedPanel(ctx, art, 900, 400));
  }
}
