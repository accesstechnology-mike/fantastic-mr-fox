import Phaser from "phaser";
import { statsOf } from "./party";
import type { CharacterId } from "../types";

export class NoiseSystem {
  value = 0;

  tick(dt: number, moving: boolean, sneaking: boolean, digging: boolean, character: CharacterId): void {
    const quiet = statsOf(character).quiet;
    const rise = (moving ? (sneaking ? 6 : 18) : 2) * quiet + (digging ? 22 : 0);
    const fall = 12;
    this.value = Phaser.Math.Clamp(this.value + (rise - fall) * dt, 0, 100);
  }

  collapseChance(): number {
    if (this.value < 72) {
      return 0;
    }
    return (this.value - 72) / 140;
  }
}
