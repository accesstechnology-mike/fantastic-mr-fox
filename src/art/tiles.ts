import {
  INK,
  PAPER,
  PAPER_SHADOW,
  WASH_CLAY,
  WASH_MOSS,
  WASH_NIGHT,
  WASH_RUST,
} from "../data/palette";
import { fillOval, mix, outlineOval, scratchyStroke, wash } from "./ink";

export function drawTile(
  ctx: CanvasRenderingContext2D,
  kind: string,
  size: number,
  rand: () => number,
): void {
  ctx.clearRect(0, 0, size, size);
  const mid = size / 2;
  if (kind === "grass") {
    wash(ctx, mid, mid, size, size, mix(WASH_MOSS, 0xc8d888, 0.35), rand, 5);
    scratchyStroke(ctx, [{ x: 6, y: size - 5 }, { x: 8, y: 10 }], INK, rand, 0.8);
    scratchyStroke(ctx, [{ x: size - 9, y: size - 4 }, { x: size - 7, y: 12 }], INK, rand, 0.8);
    return;
  }
  if (kind === "tall") {
    wash(ctx, mid, mid, size, size, WASH_MOSS, rand, 6);
    scratchyStroke(ctx, [{ x: 6, y: size - 4 }, { x: 8, y: 4 }], INK, rand, 1);
    scratchyStroke(ctx, [{ x: mid, y: size - 3 }, { x: mid + 2, y: 3 }], INK, rand, 1);
    scratchyStroke(ctx, [{ x: size - 8, y: size - 3 }, { x: size - 6, y: 6 }], INK, rand, 1);
    return;
  }
  if (kind === "tree") {
    wash(ctx, mid, mid, size * 0.95, size * 0.95, mix(WASH_MOSS, 0x2a3a20, 0.25), rand, 6);
    scratchyStroke(ctx, [{ x: mid, y: size - 4 }, { x: mid - 1, y: mid }], INK, rand, 1.8);
    scratchyStroke(
      ctx,
      [
        { x: 5, y: size - 8 },
        { x: mid, y: 4 },
        { x: size - 5, y: size - 7 },
      ],
      INK,
      rand,
      1.4,
    );
    return;
  }
  if (kind === "earth") {
    wash(ctx, mid, mid, size, size, WASH_CLAY, rand, 5);
    scratchyStroke(ctx, [{ x: 4, y: 10 }, { x: 12, y: 18 }], INK, rand, 0.7);
    return;
  }
  if (kind === "rock") {
    wash(ctx, mid, mid, size, size, mix(WASH_CLAY, 0x4a4038, 0.4), rand, 4);
    outlineOval(ctx, mid, mid, size * 0.32, size * 0.22, INK, rand, 1.3);
    return;
  }
  if (kind === "floor") {
    wash(ctx, mid, mid, size, size, mix(0xc4a070, PAPER, 0.3), rand, 4);
    scratchyStroke(ctx, [{ x: 2, y: 6 }, { x: size - 2, y: 8 }], INK, rand, 0.8);
    scratchyStroke(ctx, [{ x: 2, y: size - 8 }, { x: size - 2, y: size - 6 }], INK, rand, 0.8);
    return;
  }
  if (kind === "den") {
    wash(ctx, mid, mid, size, size, mix(WASH_CLAY, 0xd2b48c, 0.4), rand, 4);
    return;
  }
  if (kind === "night") {
    wash(ctx, mid, mid, size, size, mix(WASH_NIGHT, 0x3a4a38, 0.35), rand, 4);
    scratchyStroke(ctx, [{ x: 7, y: size - 4 }, { x: 9, y: 12 }], INK, rand, 0.7);
    return;
  }
  if (kind === "surface") {
    wash(ctx, mid, mid, size, size, mix(WASH_NIGHT, WASH_RUST, 0.15), rand, 3);
    return;
  }
  if (kind === "slick") {
    wash(ctx, mid, mid, size, size, mix(0x8a7030, 0x3a3020, 0.3), rand, 5);
    scratchyStroke(ctx, [{ x: 4, y: mid }, { x: size - 4, y: mid + 3 }], INK, rand, 0.8);
    return;
  }
  if (kind === "rubble") {
    wash(ctx, mid, mid, size, size, mix(WASH_CLAY, 0x4a4038, 0.35), rand, 5);
    scratchyStroke(ctx, [{ x: 5, y: 8 }, { x: size - 6, y: size - 7 }], INK, rand, 1.3);
    scratchyStroke(ctx, [{ x: size - 8, y: 10 }, { x: 7, y: size - 6 }], INK, rand, 1.1);
    return;
  }
  if (kind === "hole") {
    wash(ctx, mid, mid, size, size, mix(WASH_CLAY, 0x1a120c, 0.35), rand, 4);
    fillOval(ctx, mid, mid, size * 0.32, size * 0.22, 0x1a120c, rand, 0.92);
    outlineOval(ctx, mid, mid, size * 0.32, size * 0.22, INK, rand, 1.5);
    return;
  }
  wash(ctx, mid, mid, size, size, PAPER_SHADOW, rand, 3);
}
