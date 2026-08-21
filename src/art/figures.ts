import { CHARACTERS } from "../data/characters";
import { INK, WASH_CIDER, WASH_CLAY, WASH_CREAM, WASH_MOSS, WASH_NIGHT } from "../data/palette";
import type { CharacterId, FoodKind } from "../types";
import {
  fillOval,
  fillPoly,
  hex,
  inkDot,
  mix,
  outlineOval,
  scratchyStroke,
  wash,
} from "./ink";

export interface FigureOpts {
  facing?: 1 | -1;
  tail?: boolean;
  pose?: "stand" | "run" | "sit" | "dig" | "toast";
}

function dirOf(opts?: FigureOpts): 1 | -1 {
  return opts?.facing ?? 1;
}

function foxWash(kind: "mrFox" | "mrsFox" | "smallFox"): number {
  return CHARACTERS[kind].wash;
}

export function drawFox(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  rand: () => number,
  kind: "mrFox" | "mrsFox" | "smallFox",
  opts: FigureOpts = {},
): void {
  const d = dirOf(opts);
  const tail = opts.tail !== false;
  const cub = kind === "smallFox";
  const vixen = kind === "mrsFox";
  const s = size / 56;
  const rust = foxWash(kind);
  const cream = mix(WASH_CREAM, rust, cub ? 0.08 : 0.12);
  const ink = CHARACTERS[kind].ink;
  const pose = opts.pose ?? "stand";
  const lean = pose === "run" ? 6 * s * d : pose === "dig" ? 8 * s * d : 0;
  const bodyX = cx + lean;
  const bodyY = cy + 4 * s;
  const hipX = bodyX - 8 * s * d;
  const hipY = bodyY + 2 * s;

  if (tail) {
    const tipX = hipX - 22 * s * d;
    const tipY = hipY - (vixen ? 10 : 14) * s;
    wash(ctx, (hipX + tipX) / 2, (hipY + tipY) / 2, 28 * s, 16 * s, rust, rand, 6);
    fillOval(ctx, (hipX + tipX) / 2, (hipY + tipY) / 2 - 2 * s, 14 * s, 7 * s, rust, rand, 0.88);
    fillOval(ctx, tipX, tipY, 6 * s, 4.2 * s, cream, rand, 0.8);
    scratchyStroke(
      ctx,
      [
        { x: hipX, y: hipY },
        { x: hipX - 10 * s * d, y: hipY - 8 * s },
        { x: tipX + 4 * s * d, y: tipY + 2 * s },
        { x: tipX, y: tipY },
      ],
      ink,
      rand,
      1.6 * s,
    );
    scratchyStroke(
      ctx,
      [
        { x: hipX, y: hipY + 3 * s },
        { x: hipX - 12 * s * d, y: hipY + 1 * s },
        { x: tipX + 2 * s * d, y: tipY + 6 * s },
      ],
      ink,
      rand,
      1.15 * s,
    );
  } else {
    scratchyStroke(
      ctx,
      [
        { x: hipX, y: hipY },
        { x: hipX - 5 * s * d, y: hipY + 1 * s },
      ],
      ink,
      rand,
      1.8 * s,
    );
    inkDot(ctx, hipX - 4 * s * d, hipY + 1 * s, 1.4 * s, ink, rand);
  }

  wash(ctx, bodyX, bodyY, 26 * s, 18 * s, rust, rand, 5);
  fillOval(ctx, bodyX, bodyY, 13 * s, 8.5 * s, rust, rand, 0.94);
  fillOval(ctx, bodyX + 4 * s * d, bodyY + 1 * s, 7 * s, 5.5 * s, cream, rand, 0.72);
  outlineOval(ctx, bodyX, bodyY, 13 * s, 8.5 * s, ink, rand, 1.45 * s);

  const rear = pose === "sit" ? 2 * s : 11 * s;
  const front = pose === "sit" ? 6 * s : 11 * s;
  scratchyStroke(
    ctx,
    [
      { x: bodyX - 6 * s * d, y: bodyY + 6 * s },
      { x: bodyX - 8 * s * d, y: bodyY + rear },
      { x: bodyX - 4 * s * d, y: bodyY + rear + 1 * s },
    ],
    ink,
    rand,
    1.35 * s,
  );
  scratchyStroke(
    ctx,
    [
      { x: bodyX - 2 * s * d, y: bodyY + 7 * s },
      { x: bodyX - 1 * s * d, y: bodyY + rear },
    ],
    ink,
    rand,
    1.25 * s,
  );
  scratchyStroke(
    ctx,
    [
      { x: bodyX + 7 * s * d, y: bodyY + 6 * s },
      { x: bodyX + 10 * s * d, y: bodyY + front },
      { x: bodyX + 13 * s * d, y: bodyY + front },
    ],
    ink,
    rand,
    1.3 * s,
  );
  scratchyStroke(
    ctx,
    [
      { x: bodyX + 4 * s * d, y: bodyY + 7 * s },
      { x: bodyX + 6 * s * d, y: bodyY + front },
    ],
    ink,
    rand,
    1.2 * s,
  );

  const headX = bodyX + 12 * s * d;
  const headY = bodyY - 10 * s;
  wash(ctx, headX, headY, 16 * s, 14 * s, rust, rand, 4);
  fillOval(ctx, headX, headY, 7.2 * s, 6 * s, rust, rand, 0.95);
  fillPoly(
    ctx,
    [
      { x: headX + 2 * s * d, y: headY - 1 * s },
      { x: headX + 15 * s * d, y: headY + 2 * s },
      { x: headX + 3 * s * d, y: headY + 5 * s },
    ],
    rust,
    rand,
    0.94,
  );
  fillPoly(
    ctx,
    [
      { x: headX + 6 * s * d, y: headY + 0.5 * s },
      { x: headX + 15 * s * d, y: headY + 2 * s },
      { x: headX + 6 * s * d, y: headY + 4 * s },
    ],
    cream,
    rand,
    0.85,
  );
  scratchyStroke(
    ctx,
    [
      { x: headX - 4 * s * d, y: headY },
      { x: headX + 2 * s * d, y: headY - 4 * s },
      { x: headX + 8 * s * d, y: headY - 1 * s },
      { x: headX + 15 * s * d, y: headY + 2 * s },
      { x: headX + 7 * s * d, y: headY + 5.5 * s },
      { x: headX - 2 * s * d, y: headY + 4 * s },
    ],
    ink,
    rand,
    1.4 * s,
  );

  const earBack = [
    { x: headX - 2 * s * d, y: headY - 4 * s },
    { x: headX - 1 * s * d, y: headY - 14 * s },
    { x: headX + 4 * s * d, y: headY - 5 * s },
  ];
  const earFront = [
    { x: headX + 2 * s * d, y: headY - 5 * s },
    { x: headX + 6 * s * d, y: headY - 13 * s },
    { x: headX + 8 * s * d, y: headY - 4 * s },
  ];
  fillPoly(ctx, earBack, rust, rand, 0.95);
  fillPoly(ctx, earFront, rust, rand, 0.95);
  fillPoly(
    ctx,
    [
      { x: earFront[0].x + 1 * s * d, y: earFront[0].y },
      { x: earFront[1].x, y: earFront[1].y + 3 * s },
      { x: earFront[2].x - 1 * s * d, y: earFront[2].y },
    ],
    mix(0xe8a090, rust, 0.35),
    rand,
    0.8,
  );
  scratchyStroke(ctx, [...earBack, earBack[0]], ink, rand, 1.2 * s);
  scratchyStroke(ctx, [...earFront, earFront[0]], ink, rand, 1.2 * s);

  inkDot(ctx, headX + 4 * s * d, headY - 1 * s, (cub ? 1.5 : 1.7) * s, ink, rand);
  ctx.fillStyle = hex(0xf7edd4);
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.arc(headX + 4.6 * s * d, headY - 1.5 * s, 0.55 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  inkDot(ctx, headX + 15 * s * d, headY + 2 * s, 1.5 * s, ink, rand);

  for (const lift of [-3, 0, 3]) {
    scratchyStroke(
      ctx,
      [
        { x: headX + 11 * s * d, y: headY + 2 * s },
        { x: headX + 20 * s * d, y: headY + lift * s },
      ],
      ink,
      rand,
      0.7 * s,
    );
  }
}

export function drawBadger(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  rand: () => number,
  opts: FigureOpts = {},
): void {
  const d = dirOf(opts);
  const s = size / 56;
  const ink = CHARACTERS.badger.ink;
  const grey = CHARACTERS.badger.wash;
  wash(ctx, cx, cy + 2 * s, 30 * s, 20 * s, grey, rand, 5);
  fillOval(ctx, cx, cy + 3 * s, 15 * s, 9 * s, grey, rand, 0.95);
  outlineOval(ctx, cx, cy + 3 * s, 15 * s, 9 * s, ink, rand, 1.6 * s);
  scratchyStroke(ctx, [{ x: cx - 8 * s * d, y: cy + 8 * s }, { x: cx - 10 * s * d, y: cy + 14 * s }], ink, rand, 2 * s);
  scratchyStroke(ctx, [{ x: cx + 8 * s * d, y: cy + 8 * s }, { x: cx + 11 * s * d, y: cy + 14 * s }], ink, rand, 2 * s);
  const hx = cx + 12 * s * d;
  const hy = cy - 6 * s;
  fillOval(ctx, hx, hy, 8 * s, 6.5 * s, mix(grey, 0xf0ebe0, 0.45), rand, 0.95);
  fillPoly(
    ctx,
    [
      { x: hx - 6 * s * d, y: hy - 5 * s },
      { x: hx + 2 * s * d, y: hy + 1 * s },
      { x: hx - 5 * s * d, y: hy + 6 * s },
    ],
    ink,
    rand,
    0.88,
  );
  scratchyStroke(
    ctx,
    [
      { x: hx - 5 * s, y: hy - 2 * s },
      { x: hx + 10 * s * d, y: hy + 2 * s },
      { x: hx - 3 * s, y: hy + 5 * s },
    ],
    ink,
    rand,
    1.5 * s,
  );
  inkDot(ctx, hx + 2 * s * d, hy, 1.5 * s, ink, rand);
  inkDot(ctx, hx + 9 * s * d, hy + 2 * s, 1.4 * s, ink, rand);
}

export function drawMole(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  rand: () => number,
  opts: FigureOpts = {},
): void {
  const d = dirOf(opts);
  const s = size / 40;
  const ink = CHARACTERS.mole.ink;
  const fur = CHARACTERS.mole.wash;
  wash(ctx, cx, cy, 18 * s, 12 * s, fur, rand, 4);
  fillOval(ctx, cx, cy, 9 * s, 6 * s, fur, rand, 0.96);
  outlineOval(ctx, cx, cy, 9 * s, 6 * s, ink, rand, 1.2 * s);
  fillPoly(
    ctx,
    [
      { x: cx + 6 * s * d, y: cy - 1 * s },
      { x: cx + 14 * s * d, y: cy + 1 * s },
      { x: cx + 6 * s * d, y: cy + 3 * s },
    ],
    mix(0xd4a090, fur, 0.25),
    rand,
    0.9,
  );
  scratchyStroke(ctx, [{ x: cx + 6 * s * d, y: cy }, { x: cx + 14 * s * d, y: cy + 1 * s }], ink, rand, 1.1 * s);
  inkDot(ctx, cx + 14 * s * d, cy + 1 * s, 1.2 * s, mix(0xe8b0a0, 0xc87868, 0.3), rand);
  scratchyStroke(
    ctx,
    [
      { x: cx + 7 * s * d, y: cy + 3 * s },
      { x: cx + 13 * s * d, y: cy + 7 * s },
      { x: cx + 8 * s * d, y: cy + 8 * s },
    ],
    ink,
    rand,
    1.4 * s,
  );
  scratchyStroke(
    ctx,
    [
      { x: cx - 6 * s * d, y: cy + 3 * s },
      { x: cx - 11 * s * d, y: cy + 7 * s },
    ],
    ink,
    rand,
    1.3 * s,
  );
}

export function drawRabbit(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  rand: () => number,
  opts: FigureOpts = {},
): void {
  const d = dirOf(opts);
  const s = size / 52;
  const ink = CHARACTERS.rabbit.ink;
  const fur = CHARACTERS.rabbit.wash;
  wash(ctx, cx, cy + 4 * s, 18 * s, 16 * s, fur, rand, 4);
  fillOval(ctx, cx, cy + 6 * s, 9 * s, 8 * s, fur, rand, 0.94);
  outlineOval(ctx, cx, cy + 6 * s, 9 * s, 8 * s, ink, rand, 1.3 * s);
  fillOval(ctx, cx - 8 * s * d, cy + 8 * s, 3.2 * s, 2.6 * s, mix(fur, 0xf7f0e4, 0.5), rand, 0.9);
  const hx = cx + 6 * s * d;
  const hy = cy - 4 * s;
  fillOval(ctx, hx, hy, 5.5 * s, 5 * s, fur, rand, 0.95);
  outlineOval(ctx, hx, hy, 5.5 * s, 5 * s, ink, rand, 1.15 * s);
  scratchyStroke(
    ctx,
    [
      { x: hx - 1 * s * d, y: hy - 4 * s },
      { x: hx - 2 * s * d, y: hy - 18 * s },
      { x: hx + 1 * s * d, y: hy - 4 * s },
    ],
    ink,
    rand,
    1.2 * s,
  );
  scratchyStroke(
    ctx,
    [
      { x: hx + 2 * s * d, y: hy - 3 * s },
      { x: hx + 4 * s * d, y: hy - 16 * s },
      { x: hx + 5 * s * d, y: hy - 3 * s },
    ],
    ink,
    rand,
    1.15 * s,
  );
  fillPoly(
    ctx,
    [
      { x: hx - 1 * s * d, y: hy - 5 * s },
      { x: hx - 2 * s * d, y: hy - 16 * s },
      { x: hx + 1 * s * d, y: hy - 5 * s },
    ],
    mix(0xe8a090, fur, 0.4),
    rand,
    0.55,
  );
  inkDot(ctx, hx + 2 * s * d, hy - 0.5 * s, 1.3 * s, ink, rand);
  scratchyStroke(ctx, [{ x: hx + 4 * s * d, y: hy + 1 * s }, { x: hx + 8 * s * d, y: hy + 2 * s }], ink, rand, 1 * s);
}

export function drawWeasel(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  rand: () => number,
  opts: FigureOpts = {},
): void {
  const d = dirOf(opts);
  const s = size / 48;
  const ink = CHARACTERS.weasel.ink;
  const fur = CHARACTERS.weasel.wash;
  wash(ctx, cx, cy + 2 * s, 28 * s, 10 * s, fur, rand, 4);
  scratchyStroke(
    ctx,
    [
      { x: cx - 18 * s * d, y: cy + 6 * s },
      { x: cx - 8 * s * d, y: cy },
      { x: cx + 6 * s * d, y: cy + 2 * s },
      { x: cx + 16 * s * d, y: cy - 2 * s },
    ],
    ink,
    rand,
    1.5 * s,
  );
  scratchyStroke(
    ctx,
    [
      { x: cx - 16 * s * d, y: cy + 9 * s },
      { x: cx + 4 * s * d, y: cy + 8 * s },
      { x: cx + 16 * s * d, y: cy + 3 * s },
    ],
    ink,
    rand,
    1.25 * s,
  );
  fillOval(ctx, cx + 14 * s * d, cy - 3 * s, 5 * s, 3.6 * s, fur, rand, 0.94);
  outlineOval(ctx, cx + 14 * s * d, cy - 3 * s, 5 * s, 3.6 * s, ink, rand, 1.1 * s);
  inkDot(ctx, cx + 15 * s * d, cy - 4 * s, 1.1 * s, ink, rand);
  inkDot(ctx, cx + 19 * s * d, cy - 2 * s, 1 * s, ink, rand);
  scratchyStroke(
    ctx,
    [
      { x: cx - 16 * s * d, y: cy + 6 * s },
      { x: cx - 24 * s * d, y: cy + 2 * s },
      { x: cx - 22 * s * d, y: cy - 2 * s },
    ],
    ink,
    rand,
    1.15 * s,
  );
}

function drawGun(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  length: number,
  angle: number,
  rand: () => number,
): void {
  const x2 = x + Math.cos(angle) * length;
  const y2 = y + Math.sin(angle) * length;
  scratchyStroke(ctx, [{ x, y }, { x: x2, y: y2 }], INK, rand, 2.1);
  scratchyStroke(
    ctx,
    [
      { x, y },
      { x: x - Math.cos(angle + 1.2) * 8, y: y - Math.sin(angle + 1.2) * 8 },
    ],
    INK,
    rand,
    2.4,
  );
}

export function drawBoggis(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  rand: () => number,
  opts: FigureOpts = {},
): void {
  const d = dirOf(opts);
  const s = size / 64;
  const ink = CHARACTERS.boggis.ink;
  const coat = CHARACTERS.boggis.wash;
  wash(ctx, cx, cy + 4 * s, 36 * s, 28 * s, coat, rand, 6);
  fillOval(ctx, cx, cy + 6 * s, 18 * s, 14 * s, coat, rand, 0.95);
  outlineOval(ctx, cx, cy + 6 * s, 18 * s, 14 * s, ink, rand, 1.7 * s);
  scratchyStroke(ctx, [{ x: cx - 8 * s, y: cy + 16 * s }, { x: cx - 10 * s, y: cy + 24 * s }], ink, rand, 1.6 * s);
  scratchyStroke(ctx, [{ x: cx + 8 * s, y: cy + 16 * s }, { x: cx + 11 * s, y: cy + 24 * s }], ink, rand, 1.6 * s);
  fillOval(ctx, cx, cy - 10 * s, 7 * s, 6.5 * s, mix(coat, 0xf0c8a0, 0.45), rand, 0.95);
  outlineOval(ctx, cx, cy - 10 * s, 7 * s, 6.5 * s, ink, rand, 1.3 * s);
  fillPoly(
    ctx,
    [
      { x: cx - 8 * s, y: cy - 14 * s },
      { x: cx + 8 * s, y: cy - 14 * s },
      { x: cx + 7 * s, y: cy - 11 * s },
      { x: cx - 7 * s, y: cy - 11 * s },
    ],
    mix(0x6a3a28, coat, 0.3),
    rand,
    0.9,
  );
  scratchyStroke(ctx, [{ x: cx - 8 * s, y: cy - 14 * s }, { x: cx + 8 * s, y: cy - 14 * s }], ink, rand, 1.5 * s);
  inkDot(ctx, cx - 2 * s * d, cy - 11 * s, 1.2 * s, ink, rand);
  inkDot(ctx, cx + 3 * s * d, cy - 11 * s, 1.2 * s, ink, rand);
  scratchyStroke(ctx, [{ x: cx - 2 * s, y: cy - 7 * s }, { x: cx + 3 * s, y: cy - 7 * s }], ink, rand, 1.1 * s);
  drawGun(ctx, cx + 16 * s * d, cy + 2 * s, 22 * s, d > 0 ? -0.15 : Math.PI + 0.15, rand);
}

export function drawBunce(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  rand: () => number,
  opts: FigureOpts = {},
): void {
  const d = dirOf(opts);
  const s = size / 56;
  const ink = CHARACTERS.bunce.ink;
  const coat = CHARACTERS.bunce.wash;
  wash(ctx, cx, cy + 6 * s, 28 * s, 20 * s, coat, rand, 5);
  fillOval(ctx, cx, cy + 8 * s, 14 * s, 10 * s, coat, rand, 0.95);
  outlineOval(ctx, cx, cy + 8 * s, 14 * s, 10 * s, ink, rand, 1.55 * s);
  scratchyStroke(ctx, [{ x: cx - 5 * s, y: cy + 16 * s }, { x: cx - 6 * s, y: cy + 20 * s }], ink, rand, 1.7 * s);
  scratchyStroke(ctx, [{ x: cx + 5 * s, y: cy + 16 * s }, { x: cx + 7 * s, y: cy + 20 * s }], ink, rand, 1.7 * s);
  fillOval(ctx, cx, cy - 4 * s, 6.5 * s, 5.8 * s, mix(coat, 0xe8d2a8, 0.4), rand, 0.95);
  outlineOval(ctx, cx, cy - 4 * s, 6.5 * s, 5.8 * s, ink, rand, 1.25 * s);
  fillPoly(
    ctx,
    [
      { x: cx - 7 * s, y: cy - 8 * s },
      { x: cx + 6 * s, y: cy - 9 * s },
      { x: cx + 5 * s, y: cy - 6 * s },
      { x: cx - 6 * s, y: cy - 5 * s },
    ],
    mix(0x3a4a28, coat, 0.4),
    rand,
    0.9,
  );
  inkDot(ctx, cx - 2 * s * d, cy - 5 * s, 1.15 * s, ink, rand);
  inkDot(ctx, cx + 2.5 * s * d, cy - 5 * s, 1.15 * s, ink, rand);
  scratchyStroke(ctx, [{ x: cx - 1 * s, y: cy - 1 * s }, { x: cx + 2 * s, y: cy - 0.5 * s }], ink, rand, 1.2 * s);
  drawGun(ctx, cx + 12 * s * d, cy + 4 * s, 16 * s, d > 0 ? 0.05 : Math.PI - 0.05, rand);
}

export function drawBean(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  rand: () => number,
  opts: FigureOpts = {},
): void {
  const d = dirOf(opts);
  const s = size / 72;
  const ink = CHARACTERS.bean.ink;
  const coat = CHARACTERS.bean.wash;
  wash(ctx, cx, cy, 10 * s, 36 * s, coat, rand, 4);
  scratchyStroke(ctx, [{ x: cx, y: cy - 22 * s }, { x: cx - 2 * s, y: cy + 18 * s }], ink, rand, 2.1 * s);
  scratchyStroke(ctx, [{ x: cx - 4 * s, y: cy + 18 * s }, { x: cx - 6 * s, y: cy + 28 * s }], ink, rand, 1.4 * s);
  scratchyStroke(ctx, [{ x: cx + 1 * s, y: cy + 18 * s }, { x: cx + 4 * s, y: cy + 28 * s }], ink, rand, 1.4 * s);
  fillOval(ctx, cx + 1 * s * d, cy - 20 * s, 4.2 * s, 5 * s, mix(coat, 0xd8c4a8, 0.4), rand, 0.94);
  outlineOval(ctx, cx + 1 * s * d, cy - 20 * s, 4.2 * s, 5 * s, ink, rand, 1.2 * s);
  scratchyStroke(
    ctx,
    [
      { x: cx + 3 * s * d, y: cy - 19 * s },
      { x: cx + 11 * s * d, y: cy - 17 * s },
    ],
    ink,
    rand,
    1.3 * s,
  );
  fillPoly(
    ctx,
    [
      { x: cx - 5 * s, y: cy - 26 * s },
      { x: cx + 6 * s, y: cy - 27 * s },
      { x: cx + 5 * s, y: cy - 23 * s },
      { x: cx - 4 * s, y: cy - 23 * s },
    ],
    mix(0x2a2430, coat, 0.35),
    rand,
    0.92,
  );
  inkDot(ctx, cx + 1 * s * d, cy - 21 * s, 1.05 * s, ink, rand);
  scratchyStroke(ctx, [{ x: cx - 1 * s, y: cy - 16 * s }, { x: cx + 2 * s, y: cy - 16 * s }], ink, rand, 0.9 * s);
  drawGun(ctx, cx + 3 * s * d, cy - 8 * s, 28 * s, d > 0 ? -0.35 : Math.PI + 0.35, rand);
}

export function drawFigure(
  ctx: CanvasRenderingContext2D,
  kind: CharacterId,
  cx: number,
  cy: number,
  size: number,
  rand: () => number,
  opts: FigureOpts = {},
): void {
  if (kind === "mrFox" || kind === "mrsFox" || kind === "smallFox") {
    drawFox(ctx, cx, cy, size, rand, kind, opts);
    return;
  }
  if (kind === "badger") {
    drawBadger(ctx, cx, cy, size, rand, opts);
    return;
  }
  if (kind === "mole") {
    drawMole(ctx, cx, cy, size, rand, opts);
    return;
  }
  if (kind === "rabbit") {
    drawRabbit(ctx, cx, cy, size, rand, opts);
    return;
  }
  if (kind === "weasel") {
    drawWeasel(ctx, cx, cy, size, rand, opts);
    return;
  }
  if (kind === "boggis") {
    drawBoggis(ctx, cx, cy, size, rand, opts);
    return;
  }
  if (kind === "bunce") {
    drawBunce(ctx, cx, cy, size, rand, opts);
    return;
  }
  drawBean(ctx, cx, cy, size, rand, opts);
}

export function drawCharacterSprite(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  kind: CharacterId,
  rand: () => number,
  opts: FigureOpts = {},
): void {
  ctx.clearRect(0, 0, w, h);
  const size = kind === "bean" ? h * 0.78 : kind === "mole" ? h * 0.48 : h * 0.7;
  drawFigure(ctx, kind, w * 0.5, h * 0.56, size, rand, { facing: 1, tail: opts.tail, pose: opts.pose });
}

export function drawPortrait(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  kind: CharacterId,
  rand: () => number,
  opts: FigureOpts = {},
): void {
  ctx.clearRect(0, 0, w, h);
  wash(ctx, w / 2, h / 2, w, h, mix(WASH_CREAM, CHARACTERS[kind].wash, 0.18), rand, 4);
  const size = kind === "bean" ? h * 1.15 : kind === "boggis" ? h * 0.95 : h * 1.05;
  drawFigure(ctx, kind, w * 0.46, h * 0.62, size, rand, { facing: 1, tail: opts.tail, pose: "stand" });
}

export function drawChicken(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  rand: () => number,
): void {
  const s = size / 28;
  wash(ctx, cx, cy, 16 * s, 12 * s, 0xe8d8b0, rand, 3);
  fillOval(ctx, cx, cy, 7 * s, 5 * s, 0xe8d8b0, rand, 0.94);
  outlineOval(ctx, cx, cy, 7 * s, 5 * s, INK, rand, 1.1 * s);
  fillPoly(
    ctx,
    [
      { x: cx + 6 * s, y: cy - 1 * s },
      { x: cx + 12 * s, y: cy + 1 * s },
      { x: cx + 6 * s, y: cy + 2 * s },
    ],
    0xe0a030,
    rand,
    0.95,
  );
  fillPoly(
    ctx,
    [
      { x: cx - 1 * s, y: cy - 5 * s },
      { x: cx + 1 * s, y: cy - 9 * s },
      { x: cx + 3 * s, y: cy - 5 * s },
    ],
    0xc43a2a,
    rand,
    0.92,
  );
  inkDot(ctx, cx + 3 * s, cy - 1 * s, 0.9 * s, INK, rand);
  scratchyStroke(ctx, [{ x: cx - 2 * s, y: cy + 4 * s }, { x: cx - 3 * s, y: cy + 8 * s }], INK, rand, 1 * s);
  scratchyStroke(ctx, [{ x: cx + 2 * s, y: cy + 4 * s }, { x: cx + 3 * s, y: cy + 8 * s }], INK, rand, 1 * s);
}

export function drawDuck(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  rand: () => number,
): void {
  const s = size / 28;
  fillOval(ctx, cx, cy, 8 * s, 4.5 * s, 0xd8b25a, rand, 0.94);
  outlineOval(ctx, cx, cy, 8 * s, 4.5 * s, INK, rand, 1.1 * s);
  fillOval(ctx, cx + 7 * s, cy - 3 * s, 3.2 * s, 2.8 * s, 0xd8b25a, rand, 0.94);
  fillPoly(
    ctx,
    [
      { x: cx + 9 * s, y: cy - 3 * s },
      { x: cx + 15 * s, y: cy - 2 * s },
      { x: cx + 9 * s, y: cy - 1 * s },
    ],
    0xe07a20,
    rand,
    0.95,
  );
  inkDot(ctx, cx + 8 * s, cy - 4 * s, 0.85 * s, INK, rand);
}

export function drawGoose(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  rand: () => number,
): void {
  const s = size / 32;
  fillOval(ctx, cx, cy + 2 * s, 9 * s, 5 * s, 0xece6d2, rand, 0.94);
  outlineOval(ctx, cx, cy + 2 * s, 9 * s, 5 * s, INK, rand, 1.15 * s);
  scratchyStroke(
    ctx,
    [
      { x: cx + 6 * s, y: cy },
      { x: cx + 8 * s, y: cy - 8 * s },
      { x: cx + 11 * s, y: cy - 9 * s },
    ],
    INK,
    rand,
    1.3 * s,
  );
  fillPoly(
    ctx,
    [
      { x: cx + 11 * s, y: cy - 10 * s },
      { x: cx + 16 * s, y: cy - 9 * s },
      { x: cx + 11 * s, y: cy - 8 * s },
    ],
    0xe0a030,
    rand,
    0.95,
  );
  inkDot(ctx, cx + 10 * s, cy - 10 * s, 0.8 * s, INK, rand);
}

export function drawTurkey(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  rand: () => number,
): void {
  const s = size / 32;
  wash(ctx, cx - 4 * s, cy, 16 * s, 14 * s, 0xa85a32, rand, 4);
  fillOval(ctx, cx, cy + 2 * s, 7 * s, 5 * s, 0xa85a32, rand, 0.94);
  for (let i = 0; i < 5; i += 1) {
    const a = -0.8 + i * 0.4;
    scratchyStroke(
      ctx,
      [
        { x: cx - 4 * s, y: cy },
        { x: cx - 14 * s + Math.cos(a) * 2, y: cy - 8 * s + Math.sin(a) * 8 },
      ],
      INK,
      rand,
      1.1 * s,
    );
  }
  fillPoly(
    ctx,
    [
      { x: cx + 6 * s, y: cy },
      { x: cx + 11 * s, y: cy + 4 * s },
      { x: cx + 6 * s, y: cy + 3 * s },
    ],
    0xc43a2a,
    rand,
    0.9,
  );
  inkDot(ctx, cx + 5 * s, cy - 1 * s, 0.85 * s, INK, rand);
}

export function drawCiderJug(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  rand: () => number,
): void {
  const s = size / 28;
  wash(ctx, cx, cy, 12 * s, 16 * s, WASH_CIDER, rand, 3);
  fillOval(ctx, cx, cy + 2 * s, 6 * s, 8 * s, WASH_CIDER, rand, 0.92);
  outlineOval(ctx, cx, cy + 2 * s, 6 * s, 8 * s, INK, rand, 1.2 * s);
  scratchyStroke(ctx, [{ x: cx + 6 * s, y: cy - 2 * s }, { x: cx + 10 * s, y: cy }, { x: cx + 6 * s, y: cy + 4 * s }], INK, rand, 1.3 * s);
  fillOval(ctx, cx, cy - 6 * s, 3.2 * s, 2 * s, mix(WASH_CLAY, WASH_CIDER, 0.3), rand, 0.9);
  outlineOval(ctx, cx, cy - 6 * s, 3.2 * s, 2 * s, INK, rand, 1 * s);
}

export function drawHam(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  rand: () => number,
): void {
  const s = size / 28;
  fillOval(ctx, cx, cy, 8 * s, 5.5 * s, 0xc45a5a, rand, 0.94);
  outlineOval(ctx, cx, cy, 8 * s, 5.5 * s, INK, rand, 1.15 * s);
  fillOval(ctx, cx + 7 * s, cy, 2.4 * s, 1.8 * s, 0xf0e0c8, rand, 0.9);
  outlineOval(ctx, cx + 7 * s, cy, 2.4 * s, 1.8 * s, INK, rand, 0.9 * s);
}

export function drawFoodSprite(
  ctx: CanvasRenderingContext2D,
  kind: FoodKind,
  w: number,
  h: number,
  rand: () => number,
): void {
  ctx.clearRect(0, 0, w, h);
  const cx = w / 2;
  const cy = h / 2 + 2;
  if (kind === "chicken") {
    drawChicken(ctx, cx, cy, 26, rand);
    return;
  }
  if (kind === "duck") {
    drawDuck(ctx, cx, cy, 26, rand);
    return;
  }
  if (kind === "goose") {
    drawGoose(ctx, cx, cy, 28, rand);
    return;
  }
  if (kind === "turkey") {
    drawTurkey(ctx, cx, cy, 28, rand);
    return;
  }
  if (kind === "cider") {
    drawCiderJug(ctx, cx, cy, 26, rand);
    return;
  }
  drawHam(ctx, cx, cy, 26, rand);
}

export function drawTree(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  h: number,
  rand: () => number,
): void {
  scratchyStroke(ctx, [{ x, y }, { x: x - 2, y: y - h * 0.55 }], INK, rand, 2.2);
  wash(ctx, x, y - h * 0.7, h * 0.7, h * 0.55, WASH_MOSS, rand, 5);
  scratchyStroke(
    ctx,
    [
      { x: x - h * 0.28, y: y - h * 0.45 },
      { x: x, y: y - h },
      { x: x + h * 0.3, y: y - h * 0.42 },
    ],
    INK,
    rand,
    1.6,
  );
}

export function drawFarmhouse(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  washColor: number,
  rand: () => number,
): void {
  wash(ctx, x + w / 2, y + h * 0.55, w, h, washColor, rand, 5);
  fillPoly(
    ctx,
    [
      { x, y: y + h * 0.38 },
      { x: x + w, y: y + h * 0.38 },
      { x: x + w, y: y + h },
      { x, y: y + h },
    ],
    mix(washColor, 0xd8c4a0, 0.25),
    rand,
    0.88,
  );
  fillPoly(
    ctx,
    [
      { x: x - 6, y: y + h * 0.4 },
      { x: x + w / 2, y },
      { x: x + w + 6, y: y + h * 0.4 },
    ],
    mix(WASH_CLAY, washColor, 0.35),
    rand,
    0.9,
  );
  scratchyStroke(
    ctx,
    [
      { x, y: y + h * 0.38 },
      { x: x + w, y: y + h * 0.38 },
      { x: x + w, y: y + h },
      { x, y: y + h },
      { x, y: y + h * 0.38 },
    ],
    INK,
    rand,
    1.5,
  );
  scratchyStroke(
    ctx,
    [
      { x: x - 6, y: y + h * 0.4 },
      { x: x + w / 2, y },
      { x: x + w + 6, y: y + h * 0.4 },
    ],
    INK,
    rand,
    1.6,
  );
  scratchyStroke(
    ctx,
    [
      { x: x + w * 0.42, y: y + h * 0.55 },
      { x: x + w * 0.42, y: y + h },
      { x: x + w * 0.6, y: y + h },
      { x: x + w * 0.6, y: y + h * 0.55 },
    ],
    INK,
    rand,
    1.2,
  );
}

export function drawHole(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  rand: () => number,
): void {
  wash(ctx, cx, cy, rx * 2.2, ry * 2.2, mix(WASH_CLAY, WASH_NIGHT, 0.4), rand, 4);
  fillOval(ctx, cx, cy, rx, ry, 0x1a120c, rand, 0.92);
  outlineOval(ctx, cx, cy, rx, ry, INK, rand, 1.8);
}

export function drawBarrel(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  rand: () => number,
): void {
  const s = size / 36;
  fillOval(ctx, cx, cy, 10 * s, 13 * s, mix(WASH_CIDER, WASH_CLAY, 0.35), rand, 0.92);
  outlineOval(ctx, cx, cy, 10 * s, 13 * s, INK, rand, 1.4 * s);
  scratchyStroke(ctx, [{ x: cx - 9 * s, y: cy - 4 * s }, { x: cx + 9 * s, y: cy - 4 * s }], INK, rand, 1.2 * s);
  scratchyStroke(ctx, [{ x: cx - 9 * s, y: cy + 5 * s }, { x: cx + 9 * s, y: cy + 5 * s }], INK, rand, 1.2 * s);
}

export function drawSpade(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  h: number,
  rand: () => number,
): void {
  scratchyStroke(ctx, [{ x, y }, { x: x + 3, y: y - h }], INK, rand, 2);
  fillPoly(
    ctx,
    [
      { x: x - 7, y: y - 4 },
      { x: x + 10, y: y - 2 },
      { x: x + 2, y: y + 10 },
    ],
    mix(0x6a6058, WASH_CLAY, 0.3),
    rand,
    0.9,
  );
  scratchyStroke(ctx, [{ x: x - 7, y: y - 4 }, { x: x + 10, y: y - 2 }, { x: x + 2, y: y + 10 }, { x: x - 7, y: y - 4 }], INK, rand, 1.3);
}

export function drawMachine(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  rand: () => number,
): void {
  wash(ctx, x + w / 2, y + h / 2, w, h, 0x6a6058, rand, 5);
  fillPoly(
    ctx,
    [
      { x, y: y + h * 0.3 },
      { x: x + w * 0.7, y: y + h * 0.15 },
      { x: x + w, y: y + h * 0.55 },
      { x: x + w * 0.2, y: y + h },
    ],
    mix(0x6a6058, INK, 0.15),
    rand,
    0.88,
  );
  scratchyStroke(
    ctx,
    [
      { x, y: y + h * 0.3 },
      { x: x + w * 0.7, y: y + h * 0.15 },
      { x: x + w, y: y + h * 0.55 },
      { x: x + w * 0.2, y: y + h },
      { x, y: y + h * 0.3 },
    ],
    INK,
    rand,
    2.2,
  );
  outlineOval(ctx, x + w * 0.28, y + h * 0.72, 10, 10, INK, rand, 1.6);
  outlineOval(ctx, x + w * 0.62, y + h * 0.78, 8, 8, INK, rand, 1.5);
}
