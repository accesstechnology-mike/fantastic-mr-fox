import type { TileCh } from "../types";
import type { TileGrid } from "./grid";
import { isDiggable } from "./grid";
import { statsOf } from "./party";
import type { CharacterId } from "../types";

/** Adjacent earth, plus a little extra so a fox at a tile edge still reaches it. */
const DIG_REACH_TILES = 1.25;

export class DigSystem {
  private readonly hp = new Map<string, number>();

  key(tx: number, ty: number): string {
    return `${tx},${ty}`;
  }

  facingTile(x: number, y: number, facing: { x: number; y: number }, grid: TileGrid): { tx: number; ty: number } {
    const aheadX = x + facing.x * (grid.tileSize * 0.7);
    const aheadY = y + facing.y * (grid.tileSize * 0.7);
    return grid.worldToTile(aheadX, aheadY);
  }

  nearestDiggable(
    x: number,
    y: number,
    facing: { x: number; y: number },
    grid: TileGrid,
  ): { tx: number; ty: number } | null {
    const here = grid.worldToTile(x, y);
    let best: { tx: number; ty: number; score: number } | null = null;
    for (let dy = -2; dy <= 2; dy += 1) {
      for (let dx = -2; dx <= 2; dx += 1) {
        const tx = here.tx + dx;
        const ty = here.ty + dy;
        const tile = grid.tile(tx, ty);
        if (!isDiggable(tile)) {
          continue;
        }
        const center = grid.tileCenter(tx, ty);
        const dist = Math.hypot(center.x - x, center.y - y) / grid.tileSize;
        if (dist > DIG_REACH_TILES) {
          continue;
        }
        const align = facing.x * (center.x - x) + facing.y * (center.y - y);
        const score = dist - (align > 0 ? 0.45 : 0);
        if (!best || score < best.score) {
          best = { tx, ty, score };
        }
      }
    }
    return best ? { tx: best.tx, ty: best.ty } : null;
  }

  strike(
    x: number,
    y: number,
    facing: { x: number; y: number },
    grid: TileGrid,
    character: CharacterId,
  ): { tx: number; ty: number; opened: boolean; tile: string } | null {
    const target = this.nearestDiggable(x, y, facing, grid);
    if (!target) {
      return null;
    }
    const { tx, ty } = target;
    const tile = grid.tile(tx, ty);
    if (!isDiggable(tile)) {
      return null;
    }
    const stats = statsOf(character);
    if (tile === "B" && stats.id !== "badger" && stats.dig < 1.8) {
      return { tx, ty, opened: false, tile };
    }
    const id = this.key(tx, ty);
    const need = tile === "B" ? 2.4 : 1.6;
    const next = (this.hp.get(id) ?? 0) + stats.dig * 0.55;
    this.hp.set(id, next);
    if (next >= need) {
      const opened: TileCh = ".";
      grid.setTile(tx, ty, opened);
      return { tx, ty, opened: true, tile };
    }
    return { tx, ty, opened: false, tile };
  }
}
