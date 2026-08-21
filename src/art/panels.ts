import {
  FARM_WASH,
  INK,
  PAPER,
  PAPER_SHADOW,
  WASH_BLOOD,
  WASH_CIDER,
  WASH_CLAY,
  WASH_CREAM,
  WASH_MOSS,
  WASH_NIGHT,
  WASH_RUST,
} from "../data/palette";
import {
  drawBarrel,
  drawChicken,
  drawCiderJug,
  drawDuck,
  drawFarmhouse,
  drawFigure,
  drawGoose,
  drawHam,
  drawHole,
  drawMachine,
  drawSpade,
  drawTree,
  drawTurkey,
} from "./figures";
import { inkFrame, mix, paperPage, rng, scratchyStroke, wash } from "./ink";

function page(ctx: CanvasRenderingContext2D, w: number, h: number, seed: number): () => number {
  const rand = rng(seed);
  paperPage(ctx, w, h, PAPER, PAPER_SHADOW, rand);
  return rand;
}

function ground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  y: number,
  color: number,
  rand: () => number,
): void {
  wash(ctx, w / 2, (y + h) / 2, w, h - y, color, rand, 8);
  scratchyStroke(ctx, [{ x: 20, y }, { x: w - 18, y: y + 6 }], INK, rand, 1.4);
}

function nightSky(ctx: CanvasRenderingContext2D, w: number, h: number, rand: () => number): void {
  wash(ctx, w / 2, h * 0.28, w, h * 0.62, WASH_NIGHT, rand, 10);
  wash(ctx, w * 0.78, h * 0.16, 90, 70, mix(WASH_NIGHT, 0xf0e0b0, 0.25), rand, 4);
}

function hill(ctx: CanvasRenderingContext2D, w: number, h: number, rand: () => number): void {
  wash(ctx, w / 2, h * 0.72, w, h * 0.55, mix(WASH_MOSS, WASH_CLAY, 0.25), rand, 8);
  scratchyStroke(
    ctx,
    [
      { x: 16, y: h * 0.78 },
      { x: w * 0.3, y: h * 0.52 },
      { x: w * 0.55, y: h * 0.58 },
      { x: w * 0.82, y: h * 0.48 },
      { x: w - 12, y: h * 0.7 },
    ],
    INK,
    rand,
    1.8,
  );
}

function finish(ctx: CanvasRenderingContext2D, w: number, h: number, rand: () => number): void {
  inkFrame(ctx, w, h, INK, rand, 12);
}

function farms(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const rand = page(ctx, w, h, 44011);
  nightSky(ctx, w, h, rand);
  hill(ctx, w, h, rand);
  drawFarmhouse(ctx, 70, 118, 150, 110, FARM_WASH.boggis, rand);
  drawFarmhouse(ctx, 360, 128, 140, 100, FARM_WASH.bunce, rand);
  drawFarmhouse(ctx, 640, 108, 170, 120, FARM_WASH.bean, rand);
  drawChicken(ctx, 110, 250, 22, rand);
  drawChicken(ctx, 150, 258, 20, rand);
  drawDuck(ctx, 400, 248, 22, rand);
  drawGoose(ctx, 450, 240, 26, rand);
  drawTurkey(ctx, 700, 246, 26, rand);
  drawBarrel(ctx, 760, 250, 28, rand);
  drawTree(ctx, 300, 250, 90, rand);
  drawTree(ctx, 560, 260, 80, rand);
  finish(ctx, w, h, rand);
}

function boggisYard(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const rand = page(ctx, w, h, 44029);
  wash(ctx, w / 2, h * 0.3, w, h * 0.6, mix(PAPER, FARM_WASH.boggis, 0.18), rand, 6);
  ground(ctx, w, h, 230, mix(WASH_MOSS, FARM_WASH.boggis, 0.2), rand);
  drawFarmhouse(ctx, 90, 80, 220, 160, FARM_WASH.boggis, rand);
  drawFigure(ctx, "boggis", 560, 210, 150, rand, { facing: -1 });
  for (const [x, y] of [
    [300, 250],
    [340, 268],
    [390, 248],
    [440, 270],
    [500, 256],
    [700, 260],
    [740, 248],
  ] as Array<[number, number]>) {
    drawChicken(ctx, x, y, 24, rand);
  }
  finish(ctx, w, h, rand);
}

function bunceYard(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const rand = page(ctx, w, h, 44041);
  wash(ctx, w / 2, h * 0.3, w, h * 0.6, mix(PAPER, FARM_WASH.bunce, 0.16), rand, 6);
  ground(ctx, w, h, 236, mix(WASH_MOSS, FARM_WASH.bunce, 0.25), rand);
  drawFarmhouse(ctx, 520, 70, 230, 170, FARM_WASH.bunce, rand);
  drawFigure(ctx, "bunce", 280, 230, 120, rand, { facing: 1 });
  drawDuck(ctx, 140, 260, 28, rand);
  drawDuck(ctx, 190, 272, 26, rand);
  drawGoose(ctx, 360, 250, 34, rand);
  drawGoose(ctx, 410, 268, 30, rand);
  drawDuck(ctx, 470, 258, 24, rand);
  finish(ctx, w, h, rand);
}

function beanYard(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const rand = page(ctx, w, h, 44053);
  wash(ctx, w / 2, h * 0.28, w, h * 0.55, mix(PAPER, FARM_WASH.bean, 0.16), rand, 6);
  ground(ctx, w, h, 240, mix(WASH_CLAY, FARM_WASH.bean, 0.2), rand);
  drawFarmhouse(ctx, 80, 70, 200, 170, FARM_WASH.bean, rand);
  drawFigure(ctx, "bean", 500, 175, 210, rand, { facing: -1 });
  drawTurkey(ctx, 300, 255, 32, rand);
  drawTurkey(ctx, 350, 270, 28, rand);
  drawBarrel(ctx, 640, 250, 40, rand);
  drawBarrel(ctx, 690, 258, 36, rand);
  drawCiderJug(ctx, 740, 250, 30, rand);
  finish(ctx, w, h, rand);
}

function foxHill(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const rand = page(ctx, w, h, 44059);
  nightSky(ctx, w, h, rand);
  hill(ctx, w, h, rand);
  drawTree(ctx, 120, 250, 130, rand);
  drawTree(ctx, 200, 270, 90, rand);
  drawTree(ctx, 760, 255, 120, rand);
  drawHole(ctx, 430, 250, 48, 22, rand);
  drawFigure(ctx, "mrFox", 520, 230, 120, rand, { facing: 1, pose: "stand" });
  finish(ctx, w, h, rand);
}

function ambush(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const rand = page(ctx, w, h, 44071);
  nightSky(ctx, w, h, rand);
  ground(ctx, w, h, 220, mix(WASH_MOSS, WASH_NIGHT, 0.35), rand);
  drawHole(ctx, 430, 250, 40, 18, rand);
  drawFigure(ctx, "boggis", 180, 210, 130, rand, { facing: 1 });
  drawFigure(ctx, "bunce", 320, 230, 100, rand, { facing: 1 });
  drawFigure(ctx, "bean", 700, 175, 200, rand, { facing: -1 });
  finish(ctx, w, h, rand);
}

function shot(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const rand = page(ctx, w, h, 44087);
  nightSky(ctx, w, h, rand);
  ground(ctx, w, h, 230, mix(WASH_MOSS, WASH_NIGHT, 0.3), rand);
  drawFigure(ctx, "boggis", 150, 210, 120, rand, { facing: 1 });
  wash(ctx, 360, 140, 120, 80, mix(0xf0e0a0, WASH_BLOOD, 0.15), rand, 5);
  scratchyStroke(ctx, [{ x: 220, y: 180 }, { x: 400, y: 120 }], INK, rand, 2.4);
  drawFigure(ctx, "mrFox", 560, 200, 110, rand, { facing: 1, pose: "run" });
  finish(ctx, w, h, rand);
}

function tail(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const rand = page(ctx, w, h, 44089);
  nightSky(ctx, w, h, rand);
  ground(ctx, w, h, 210, mix(WASH_MOSS, WASH_CLAY, 0.2), rand);
  drawHole(ctx, 620, 230, 36, 16, rand);
  wash(ctx, 300, 250, 70, 28, WASH_RUST, rand, 4);
  scratchyStroke(
    ctx,
    [
      { x: 250, y: 255 },
      { x: 280, y: 240 },
      { x: 330, y: 248 },
      { x: 360, y: 238 },
    ],
    INK,
    rand,
    2,
  );
  wash(ctx, 250, 248, 20, 16, WASH_CREAM, rand, 2);
  scratchyStroke(ctx, [{ x: 620, y: 220 }, { x: 700, y: 180 }], INK, rand, 1.2);
  finish(ctx, w, h, rand);
}

function pulled(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const rand = page(ctx, w, h, 44101);
  wash(ctx, w / 2, h / 2, w, h, mix(WASH_CLAY, WASH_NIGHT, 0.25), rand, 10);
  ground(ctx, w, h, 260, WASH_CLAY, rand);
  drawFigure(ctx, "mrFox", 520, 150, 130, rand, { facing: -1, pose: "run", tail: false });
  drawFigure(ctx, "mrsFox", 360, 230, 100, rand, { facing: 1 });
  drawFigure(ctx, "smallFox", 300, 250, 70, rand, { facing: 1 });
  drawFigure(ctx, "smallFox", 420, 255, 64, rand, { facing: 1 });
  drawFigure(ctx, "smallFox", 250, 248, 60, rand, { facing: 1 });
  drawFigure(ctx, "smallFox", 390, 268, 58, rand, { facing: 1 });
  scratchyStroke(ctx, [{ x: 400, y: 210 }, { x: 490, y: 170 }], INK, rand, 1.6);
  finish(ctx, w, h, rand);
}

function spades(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const rand = page(ctx, w, h, 44111);
  wash(ctx, w / 2, h * 0.25, w, h * 0.5, mix(PAPER, WASH_NIGHT, 0.12), rand, 6);
  hill(ctx, w, h, rand);
  drawFigure(ctx, "boggis", 200, 220, 120, rand, { facing: 1 });
  drawFigure(ctx, "bunce", 400, 235, 100, rand, { facing: 1 });
  drawFigure(ctx, "bean", 640, 175, 190, rand, { facing: -1 });
  drawSpade(ctx, 280, 250, 70, rand);
  drawSpade(ctx, 460, 260, 64, rand);
  drawSpade(ctx, 580, 255, 80, rand);
  finish(ctx, w, h, rand);
}

function machines(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const rand = page(ctx, w, h, 44129);
  wash(ctx, w / 2, h * 0.22, w, h * 0.45, mix(PAPER, WASH_NIGHT, 0.18), rand, 6);
  ground(ctx, w, h, 250, mix(WASH_CLAY, 0x4a4038, 0.3), rand);
  drawMachine(ctx, 80, 80, 280, 180, rand);
  drawMachine(ctx, 420, 70, 300, 190, rand);
  drawTree(ctx, 760, 250, 40, rand);
  scratchyStroke(ctx, [{ x: 300, y: 240 }, { x: 360, y: 200 }, { x: 400, y: 250 }], INK, rand, 2);
  drawFigure(ctx, "bean", 780, 200, 140, rand, { facing: -1 });
  finish(ctx, w, h, rand);
}

function starving(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const rand = page(ctx, w, h, 44131);
  wash(ctx, w / 2, h / 2, w, h, mix(WASH_CLAY, WASH_NIGHT, 0.3), rand, 10);
  ground(ctx, w, h, 250, WASH_CLAY, rand);
  drawFigure(ctx, "badger", 160, 230, 110, rand, { facing: 1 });
  drawFigure(ctx, "mole", 320, 250, 70, rand, { facing: 1 });
  drawFigure(ctx, "rabbit", 470, 230, 100, rand, { facing: 1 });
  drawFigure(ctx, "weasel", 640, 240, 90, rand, { facing: 1 });
  finish(ctx, w, h, rand);
}

function plan(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const rand = page(ctx, w, h, 44149);
  wash(ctx, w / 2, h / 2, w, h, mix(WASH_CLAY, WASH_CREAM, 0.2), rand, 8);
  ground(ctx, w, h, 255, WASH_CLAY, rand);
  drawFigure(ctx, "mrFox", 400, 200, 130, rand, { facing: 1, tail: false, pose: "toast" });
  drawFigure(ctx, "mrsFox", 240, 230, 100, rand, { facing: 1 });
  drawFigure(ctx, "badger", 560, 230, 110, rand, { facing: -1 });
  drawFigure(ctx, "smallFox", 320, 255, 70, rand, { facing: 1 });
  finish(ctx, w, h, rand);
}

function digFarms(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const rand = page(ctx, w, h, 44159);
  wash(ctx, w / 2, h * 0.22, w, h * 0.4, mix(PAPER, WASH_NIGHT, 0.1), rand, 5);
  drawFarmhouse(ctx, 80, 40, 140, 90, FARM_WASH.boggis, rand);
  drawFarmhouse(ctx, 370, 36, 130, 88, FARM_WASH.bunce, rand);
  drawFarmhouse(ctx, 640, 32, 150, 92, FARM_WASH.bean, rand);
  scratchyStroke(ctx, [{ x: 20, y: 160 }, { x: w - 16, y: 168 }], INK, rand, 1.8);
  wash(ctx, w / 2, 250, w, 160, WASH_CLAY, rand, 8);
  scratchyStroke(
    ctx,
    [
      { x: 80, y: 230 },
      { x: 200, y: 250 },
      { x: 400, y: 240 },
      { x: 620, y: 255 },
      { x: 800, y: 245 },
    ],
    INK,
    rand,
    2,
  );
  drawFigure(ctx, "mrFox", 240, 270, 80, rand, { facing: 1, tail: false, pose: "dig" });
  drawFigure(ctx, "badger", 500, 268, 80, rand, { facing: 1, pose: "dig" });
  finish(ctx, w, h, rand);
}

function chickenDoor(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const rand = page(ctx, w, h, 44171);
  wash(ctx, w / 2, 80, w, 140, mix(0xc4a070, PAPER, 0.2), rand, 6);
  for (let x = 40; x < w - 40; x += 70) {
    scratchyStroke(ctx, [{ x, y: 20 }, { x: x + 8, y: 150 }], INK, rand, 1.3);
  }
  scratchyStroke(ctx, [{ x: 20, y: 150 }, { x: w - 18, y: 158 }], INK, rand, 1.8);
  wash(ctx, w / 2, 250, w, 170, WASH_CLAY, rand, 7);
  drawHole(ctx, 440, 210, 50, 16, rand);
  drawFigure(ctx, "mrFox", 500, 250, 90, rand, { facing: 1, tail: false });
  drawChicken(ctx, 180, 90, 28, rand);
  drawChicken(ctx, 260, 100, 26, rand);
  drawChicken(ctx, 620, 88, 30, rand);
  finish(ctx, w, h, rand);
}

function chickens(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const rand = page(ctx, w, h, 44179);
  wash(ctx, w / 2, h / 2, w, h, mix(0xe8d8b0, PAPER, 0.25), rand, 8);
  ground(ctx, w, h, 240, mix(WASH_CLAY, 0xc4a070, 0.3), rand);
  for (const [x, y] of [
    [120, 160],
    [200, 190],
    [280, 150],
    [360, 200],
    [460, 155],
    [540, 195],
    [640, 160],
    [720, 200],
  ] as Array<[number, number]>) {
    drawChicken(ctx, x, y, 30, rand);
  }
  drawFigure(ctx, "mrFox", 400, 250, 100, rand, { facing: 1, tail: false, pose: "stand" });
  drawFigure(ctx, "smallFox", 300, 270, 70, rand, { facing: 1 });
  finish(ctx, w, h, rand);
}

function storeDoor(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const rand = page(ctx, w, h, 44191);
  wash(ctx, w / 2, h / 2, w, h, mix(0xc4a070, WASH_CLAY, 0.2), rand, 8);
  for (let x = 80; x < 800; x += 90) {
    scratchyStroke(ctx, [{ x, y: 30 }, { x, y: 80 }], INK, rand, 2);
    if (x % 180 === 80) {
      drawDuck(ctx, x, 110, 26, rand);
    } else {
      drawGoose(ctx, x, 108, 30, rand);
    }
  }
  ground(ctx, w, h, 230, WASH_CLAY, rand);
  drawFigure(ctx, "mrFox", 360, 240, 100, rand, { facing: 1, tail: false });
  drawFigure(ctx, "badger", 520, 235, 110, rand, { facing: -1 });
  finish(ctx, w, h, rand);
}

function hams(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const rand = page(ctx, w, h, 44201);
  wash(ctx, w / 2, h / 2, w, h, mix(0xc4a070, PAPER, 0.15), rand, 7);
  drawHam(ctx, 180, 90, 40, rand);
  drawHam(ctx, 280, 80, 44, rand);
  drawHam(ctx, 390, 95, 38, rand);
  drawDuck(ctx, 520, 90, 32, rand);
  drawGoose(ctx, 640, 85, 36, rand);
  ground(ctx, w, h, 230, WASH_CLAY, rand);
  drawFigure(ctx, "badger", 400, 230, 130, rand, { facing: 1 });
  drawFigure(ctx, "mrFox", 560, 235, 100, rand, { facing: -1, tail: false });
  finish(ctx, w, h, rand);
}

function cellarDoor(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const rand = page(ctx, w, h, 44203);
  wash(ctx, w / 2, 70, w, 120, mix(WASH_NIGHT, WASH_CLAY, 0.2), rand, 6);
  ground(ctx, w, h, 150, mix(WASH_CLAY, WASH_CIDER, 0.2), rand);
  drawHole(ctx, 200, 170, 36, 14, rand);
  drawFigure(ctx, "mrFox", 280, 200, 90, rand, { facing: 1, tail: false });
  drawBarrel(ctx, 480, 230, 50, rand);
  drawBarrel(ctx, 560, 240, 46, rand);
  drawBarrel(ctx, 640, 228, 52, rand);
  drawBarrel(ctx, 730, 246, 44, rand);
  finish(ctx, w, h, rand);
}

function cider(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const rand = page(ctx, w, h, 44207);
  wash(ctx, w / 2, h / 2, w, h, mix(WASH_CIDER, WASH_NIGHT, 0.25), rand, 8);
  for (let i = 0; i < 6; i += 1) {
    drawBarrel(ctx, 90 + i * 80, 120, 42, rand);
    drawBarrel(ctx, 120 + i * 80, 230, 40, rand);
  }
  drawCiderJug(ctx, 700, 250, 40, rand);
  drawFigure(ctx, "mrFox", 400, 250, 100, rand, { facing: 1, tail: false });
  finish(ctx, w, h, rand);
}

function smallest(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const rand = page(ctx, w, h, 44221);
  wash(ctx, w / 2, h / 2, w, h, mix(WASH_CLAY, WASH_CREAM, 0.25), rand, 8);
  ground(ctx, w, h, 250, WASH_CLAY, rand);
  drawFigure(ctx, "mrFox", 340, 190, 150, rand, { facing: 1, tail: false, pose: "toast" });
  drawFigure(ctx, "smallFox", 520, 240, 90, rand, { facing: -1 });
  finish(ctx, w, h, rand);
}

function dining(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const rand = page(ctx, w, h, 44249);
  wash(ctx, w / 2, h / 2, w, h, mix(WASH_CLAY, 0xe8c878, 0.18), rand, 8);
  scratchyStroke(ctx, [{ x: 160, y: 220 }, { x: 720, y: 220 }], INK, rand, 2.2);
  scratchyStroke(ctx, [{ x: 180, y: 200 }, { x: 180, y: 280 }], INK, rand, 1.6);
  scratchyStroke(ctx, [{ x: 700, y: 200 }, { x: 700, y: 280 }], INK, rand, 1.6);
  drawFigure(ctx, "badger", 220, 200, 90, rand, { facing: 1 });
  drawFigure(ctx, "mole", 320, 220, 60, rand, { facing: 1 });
  drawFigure(ctx, "rabbit", 560, 200, 85, rand, { facing: -1 });
  drawFigure(ctx, "weasel", 650, 210, 75, rand, { facing: -1 });
  drawFigure(ctx, "mrsFox", 440, 195, 90, rand, { facing: 1 });
  finish(ctx, w, h, rand);
}

function feast(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const rand = page(ctx, w, h, 44257);
  wash(ctx, w / 2, h / 2, w, h, mix(WASH_CLAY, 0xe8c878, 0.28), rand, 9);
  scratchyStroke(ctx, [{ x: 140, y: 200 }, { x: 740, y: 208 }], INK, rand, 2.4);
  drawChicken(ctx, 250, 175, 28, rand);
  drawDuck(ctx, 330, 170, 28, rand);
  drawGoose(ctx, 410, 168, 32, rand);
  drawTurkey(ctx, 500, 172, 30, rand);
  drawHam(ctx, 580, 176, 28, rand);
  drawCiderJug(ctx, 660, 170, 30, rand);
  drawFigure(ctx, "mrFox", 200, 250, 100, rand, { facing: 1, tail: false });
  drawFigure(ctx, "badger", 360, 255, 95, rand, { facing: 1 });
  drawFigure(ctx, "rabbit", 520, 250, 90, rand, { facing: -1 });
  drawFigure(ctx, "smallFox", 640, 260, 70, rand, { facing: -1 });
  finish(ctx, w, h, rand);
}

function toast(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const rand = page(ctx, w, h, 44263);
  wash(ctx, w / 2, h / 2, w, h, mix(WASH_CLAY, WASH_CREAM, 0.22), rand, 8);
  ground(ctx, w, h, 250, WASH_CLAY, rand);
  drawFigure(ctx, "mrFox", 440, 180, 150, rand, { facing: 1, tail: false, pose: "toast" });
  drawCiderJug(ctx, 500, 150, 24, rand);
  drawFigure(ctx, "mrsFox", 260, 230, 100, rand, { facing: 1 });
  drawFigure(ctx, "badger", 620, 230, 110, rand, { facing: -1 });
  drawFigure(ctx, "smallFox", 180, 250, 70, rand, { facing: 1 });
  finish(ctx, w, h, rand);
}

function waiting(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const rand = page(ctx, w, h, 44279);
  nightSky(ctx, w, h, rand);
  ground(ctx, w, h, 220, mix(WASH_CLAY, WASH_NIGHT, 0.25), rand);
  drawHole(ctx, 440, 240, 42, 18, rand);
  drawFigure(ctx, "boggis", 200, 210, 130, rand, { facing: 1 });
  drawFigure(ctx, "bunce", 340, 230, 100, rand, { facing: 1 });
  drawFigure(ctx, "bean", 680, 175, 200, rand, { facing: -1 });
  finish(ctx, w, h, rand);
}

function rain(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const rand = page(ctx, w, h, 44281);
  nightSky(ctx, w, h, rand);
  ground(ctx, w, h, 230, mix(WASH_CLAY, 0x4a4038, 0.35), rand);
  for (let i = 0; i < 28; i += 1) {
    const x = 30 + (i * 31) % (w - 60);
    const y = 20 + ((i * 47) % 200);
    scratchyStroke(ctx, [{ x, y }, { x: x + 4, y: y + 18 }], INK, rand, 0.8);
  }
  drawHole(ctx, 420, 250, 36, 14, rand);
  drawFigure(ctx, "boggis", 260, 220, 110, rand, { facing: 1 });
  drawFigure(ctx, "bean", 620, 180, 170, rand, { facing: -1 });
  finish(ctx, w, h, rand);
}

function credits(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const rand = page(ctx, w, h, 44293);
  nightSky(ctx, w, h, rand);
  hill(ctx, w, h, rand);
  drawHole(ctx, 440, 230, 40, 16, rand);
  drawFigure(ctx, "boggis", 180, 215, 120, rand, { facing: 1 });
  drawFigure(ctx, "bunce", 320, 230, 95, rand, { facing: 1 });
  drawFigure(ctx, "bean", 700, 175, 190, rand, { facing: -1 });
  drawFigure(ctx, "mrFox", 470, 300, 40, rand, { facing: 1, tail: false });
  finish(ctx, w, h, rand);
}

export const PANEL_DRAWERS: Record<string, (ctx: CanvasRenderingContext2D, w: number, h: number) => void> = {
  "panel-farms": farms,
  "panel-boggis": boggisYard,
  "panel-bunce": bunceYard,
  "panel-bean": beanYard,
  "panel-fox-hill": foxHill,
  "panel-ambush": ambush,
  "panel-shot": shot,
  "panel-tail": tail,
  "panel-pulled": pulled,
  "panel-spades": spades,
  "panel-machines": machines,
  "panel-starving": starving,
  "panel-plan": plan,
  "panel-dig-farms": digFarms,
  "panel-chicken-door": chickenDoor,
  "panel-chickens": chickens,
  "panel-store-door": storeDoor,
  "panel-hams": hams,
  "panel-cellar-door": cellarDoor,
  "panel-cider": cider,
  "panel-smallest": smallest,
  "panel-dining": dining,
  "panel-feast": feast,
  "panel-toast": toast,
  "panel-waiting": waiting,
  "panel-rain": rain,
  "panel-credits": credits,
};

export function drawNamedPanel(
  ctx: CanvasRenderingContext2D,
  art: string,
  w: number,
  h: number,
): void {
  const drawer = PANEL_DRAWERS[art];
  if (!drawer) {
    throw new Error(`No picture-book drawing for cutscene art "${art}"`);
  }
  drawer(ctx, w, h);
}
