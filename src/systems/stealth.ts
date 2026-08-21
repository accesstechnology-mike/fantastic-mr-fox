import Phaser from "phaser";
import { CHARACTERS } from "../data/characters";
import type { CharacterId, FarmerId } from "../types";
import { coverBonus, type TileGrid } from "./grid";
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
  if (dist > cone.length || dist < 10) {
    return dist < 18;
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
  const stats = statsOf(character);
  const { tx, ty } = grid.worldToTile(px, py);
  const grass = coverBonus(grid.tile(tx, ty));
  const sneak = sneaking ? 0.34 : 0;
  const quiet = 1 - (1 - stats.quiet) * 0.35;
  const dist = Math.hypot(px - cone.x, py - cone.y);
  const fade = 1 - (dist / cone.length) * 0.35;
  const seen = (1 - stats.stealth - grass - sneak) * quiet * fade;
  return Math.max(0, seen);
}

export function spottedThreshold(alert: number): number {
  return Math.max(0.28, 0.46 - alert * 0.06);
}
