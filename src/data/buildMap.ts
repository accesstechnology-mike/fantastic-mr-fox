import type { TileCh } from "../types";

export function makeRows(width: number, height: number, fill: TileCh): string[] {
  return Array.from({ length: height }, () => fill.repeat(width));
}

export function put(rows: string[], x: number, y: number, ch: TileCh): void {
  const row = rows[y];
  if (!row || x < 0 || y < 0 || x >= row.length) {
    return;
  }
  rows[y] = row.slice(0, x) + ch + row.slice(x + 1);
}

export function fillRect(
  rows: string[],
  x: number,
  y: number,
  w: number,
  h: number,
  ch: TileCh,
): void {
  for (let row = y; row < y + h; row += 1) {
    for (let col = x; col < x + w; col += 1) {
      put(rows, col, row, ch);
    }
  }
}

export function strokeRect(
  rows: string[],
  x: number,
  y: number,
  w: number,
  h: number,
  ch: TileCh,
): void {
  for (let col = x; col < x + w; col += 1) {
    put(rows, col, y, ch);
    put(rows, col, y + h - 1, ch);
  }
  for (let row = y; row < y + h; row += 1) {
    put(rows, x, row, ch);
    put(rows, x + w - 1, row, ch);
  }
}

export function stampPatch(
  rows: string[],
  cx: number,
  cy: number,
  radius: number,
  ch: TileCh,
  skip: TileCh[] = ["#", "+", "R"],
): void {
  for (let row = cy - radius; row <= cy + radius; row += 1) {
    for (let col = cx - radius; col <= cx + radius; col += 1) {
      const dx = col - cx;
      const dy = row - cy;
      if (dx * dx + dy * dy > radius * radius) {
        continue;
      }
      const here = rows[row]?.[col] as TileCh | undefined;
      if (!here || skip.includes(here)) {
        continue;
      }
      put(rows, col, row, ch);
    }
  }
}

export function normalizeRows(raw: string): string[] {
  const lines = raw.replace(/^\n/, "").replace(/\n$/, "").split("\n");
  const width = Math.max(...lines.map((line) => line.length));
  if (width <= 0) {
    throw new Error("Level layout is empty");
  }
  return lines.map((line) => line.padEnd(width, " "));
}
