import type { CharacterStats, TileCh } from "../types";
import { canEnter } from "./party";

export const WALKABLE = new Set<string>([
  ".",
  ",",
  "+",
  "D",
  "_",
  "~",
  "T",
  "H",
  "s",
  "m",
  "w",
]);

export const SEE_THROUGH = new Set<string>([".", ",", "+", "D", "_", "~", "T", "H", "s", "m", "w", "=", "%"]);

export function isDeath(tile: string): boolean {
  return tile === "^";
}

export function blocksSight(tile: string): boolean {
  return !SEE_THROUGH.has(tile) && tile !== "^";
}

export function isDiggable(tile: string): boolean {
  return tile === "%" || tile === "B";
}

export function blocksWalk(tile: string, stats: CharacterStats): boolean {
  if (WALKABLE.has(tile)) {
    return !canEnter(tile, stats.squeeze);
  }
  if (tile === "B") {
    return stats.id !== "badger";
  }
  return true;
}

export function coverBonus(tile: string): number {
  if (tile === ",") {
    return 0.28;
  }
  if (tile === "s" || tile === "w" || tile === "m") {
    return 0.18;
  }
  return 0;
}

export function slippery(tile: string): boolean {
  return tile === "~";
}

export class TileGrid {
  readonly width: number;
  readonly height: number;
  readonly tileSize: number;
  cells: string[][];

  constructor(rows: string[], tileSize: number) {
    this.height = rows.length;
    this.width = rows[0]?.length ?? 0;
    this.tileSize = tileSize;
    this.cells = rows.map((row) => row.split(""));
    if (this.width === 0 || this.height === 0) {
      throw new Error("Level grid has no tiles");
    }
  }

  inBounds(tx: number, ty: number): boolean {
    return tx >= 0 && ty >= 0 && tx < this.width && ty < this.height;
  }

  tile(tx: number, ty: number): TileCh {
    if (!this.inBounds(tx, ty)) {
      return " ";
    }
    return this.cells[ty][tx] as TileCh;
  }

  setTile(tx: number, ty: number, ch: TileCh): void {
    if (!this.inBounds(tx, ty)) {
      return;
    }
    this.cells[ty][tx] = ch;
  }

  worldToTile(x: number, y: number): { tx: number; ty: number } {
    return {
      tx: Math.floor(x / this.tileSize),
      ty: Math.floor(y / this.tileSize),
    };
  }

  tileCenter(tx: number, ty: number): { x: number; y: number } {
    return {
      x: tx * this.tileSize + this.tileSize / 2,
      y: ty * this.tileSize + this.tileSize / 2,
    };
  }

  tileWorld(tx: number, ty: number): string {
    const { tx: x, ty: y } = this.worldToTile(tx, ty);
    return this.tile(x, y);
  }

  blockedWorld(x: number, y: number, stats: CharacterStats): boolean {
    const { tx, ty } = this.worldToTile(x, y);
    return blocksWalk(this.tile(tx, ty), stats);
  }

  bodyFits(x: number, y: number, stats: CharacterStats): boolean {
    const hx = stats.bodyW * 0.38;
    const hy = stats.bodyH * 0.32;
    const points = [
      [x - hx, y - hy],
      [x + hx, y - hy],
      [x - hx, y + hy],
      [x + hx, y + hy],
      [x, y],
    ];
    return points.every(([px, py]) => !this.blockedWorld(px, py, stats) && !isDeath(this.tileWorld(px, py)));
  }

  onDeath(x: number, y: number): boolean {
    const { tx, ty } = this.worldToTile(x, y);
    return isDeath(this.tile(tx, ty));
  }

  findTiles(ch: string): Array<{ tx: number; ty: number }> {
    const found: Array<{ tx: number; ty: number }> = [];
    for (let ty = 0; ty < this.height; ty += 1) {
      for (let tx = 0; tx < this.width; tx += 1) {
        if (this.cells[ty][tx] === ch) {
          found.push({ tx, ty });
        }
      }
    }
    return found;
  }
}
