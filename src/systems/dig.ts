import type { TileCh } from "../types";
import type { TileGrid } from "./grid";
import { isDiggable } from "./grid";
import { statsOf } from "./party";
import type { CharacterId } from "../types";

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

  strike(
    x: number,
    y: number,
    facing: { x: number; y: number },
    grid: TileGrid,
    character: CharacterId,
  ): { tx: number; ty: number; opened: boolean; tile: string } | null {
    const { tx, ty } = this.facingTile(x, y, facing, grid);
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
