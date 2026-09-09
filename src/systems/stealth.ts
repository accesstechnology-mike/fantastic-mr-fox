import Phaser from "phaser";
import { CHARACTERS } from "../data/characters";
import type { CharacterId, FarmerId } from "../types";
import { blocksSight, coverBonus, type TileGrid } from "./grid";
import { statsOf } from "./party";

export interface ConeState {
  x: number;
  y: number;
  angle: number;
  length: number;
  halfAngle: number;
}

export function farmerCone(id: FarmerId, x: number, y: number, angle: number): ConeState {
  const stats = CHARACTERS[id];
  return {
    x,
    y,
    angle,
    length: stats.coneLength,
    halfAngle: Phaser.Math.DegToRad(stats.coneAngle / 2),
  };
}

export function pointInCone(px: number, py: number, cone: ConeState): boolean {
  const dx = px - cone.x;
  const dy = py - cone.y;
  const dist = Math.hypot(dx, dy);
  if (dist > cone.length) {
    return false;
  }
  if (dist < 18) {
    return true;
  }
  const bearing = Math.atan2(dy, dx);
  let delta = bearing - cone.angle;
  while (delta > Math.PI) {
    delta -= Math.PI * 2;
  }
  while (delta < -Math.PI) {
    delta += Math.PI * 2;
  }
  return Math.abs(delta) <= cone.halfAngle;
}

export function hasLineOfSight(
  grid: TileGrid,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
): boolean {
  const dist = Math.hypot(toX - fromX, toY - fromY);
  if (dist < 8) {
    return true;
  }
  const steps = Math.max(2, Math.ceil(dist / (grid.tileSize * 0.35)));
  for (let i = 1; i < steps; i += 1) {
    const t = i / steps;
    const x = fromX + (toX - fromX) * t;
    const y = fromY + (toY - fromY) * t;
    if (blocksSight(grid.tileWorld(x, y))) {
      return false;
    }
  }
  return true;
}

/**
 * How clearly a lantern has the fox. Stealth and sneak trim the edges;
 * they do not make an open lantern harmless.
 */
export function visibilityOf(
  px: number,
  py: number,
  sneaking: boolean,
  character: CharacterId,
  grid: TileGrid,
  cone: ConeState,
): number {
  if (!pointInCone(px, py, cone)) {
    return 0;
  }
  if (!hasLineOfSight(grid, cone.x, cone.y, px, py)) {
    return 0;
  }
  const stats = statsOf(character);
  const { tx, ty } = grid.worldToTile(px, py);
  const cover = coverBonus(grid.tile(tx, ty));
  const sneak = sneaking ? 0.32 : 0;
  const sly = stats.stealth * 0.25;
  const dist = Math.hypot(px - cone.x, py - cone.y);
  const fade = 1 - (dist / Math.max(cone.length, 1)) * 0.3;
  return Math.max(0, (1 - cover - sneak - sly) * fade);
}

export function spottedThreshold(alert: number): number {
  return Math.max(0.28, 0.42 - alert * 0.05);
}
