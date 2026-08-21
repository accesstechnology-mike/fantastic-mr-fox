import Phaser from "phaser";
import { characterTexture } from "../art/appearance";
import type { CharacterId, CharacterStats } from "../types";
import { statsOf } from "../systems/party";

export class Actor {
  readonly sprite: Phaser.GameObjects.Image;
  id: CharacterId;
  facing = { x: 0, y: 1 };

  constructor(scene: Phaser.Scene, id: CharacterId, x: number, y: number) {
    this.id = id;
    this.sprite = scene.add.image(x, y, characterTexture(id));
    this.sprite.setDepth(20);
    this.apply(id);
  }

  get x(): number {
    return this.sprite.x;
  }

  get y(): number {
    return this.sprite.y;
  }

  get stats(): CharacterStats {
    return statsOf(this.id);
  }

  apply(id: CharacterId): void {
    this.id = id;
    this.sprite.setTexture(characterTexture(id));
    const tall = this.stats.bodyH / 28;
    this.sprite.setScale(0.72 * Math.min(1.2, tall + 0.12));
  }

  setPos(x: number, y: number): void {
    this.sprite.setPosition(x, y);
  }

  destroy(): void {
    this.sprite.destroy();
  }
}
