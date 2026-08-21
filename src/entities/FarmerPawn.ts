import Phaser from "phaser";
import { characterTexture } from "../art/appearance";
import { CHARACTERS } from "../data/characters";
import type { FarmerId, PatrolDef } from "../types";
import { farmerCone, type ConeState } from "../systems/stealth";

export class FarmerPawn {
  readonly sprite: Phaser.GameObjects.Image;
  readonly coneGfx: Phaser.GameObjects.Graphics;
  readonly id: FarmerId;
  private readonly patrol: PatrolDef;
  private waypoint = 0;
  private wait = 0;
  angle = 0;
  alert = 0;

  constructor(scene: Phaser.Scene, patrol: PatrolDef, tileSize: number) {
    this.id = patrol.farmer;
    this.patrol = patrol;
    const start = patrol.waypoints[0];
    if (!start) {
      throw new Error(`Patrol ${patrol.id} has no waypoints`);
    }
    this.sprite = scene.add.image(
      start.x * tileSize + tileSize / 2,
      start.y * tileSize + tileSize / 2,
      characterTexture(patrol.farmer),
    );
    this.sprite.setDepth(19);
    this.sprite.setScale(patrol.farmer === "boggis" ? 1.05 : patrol.farmer === "bean" ? 1.15 : 0.95);
    this.coneGfx = scene.add.graphics();
    this.coneGfx.setDepth(8);
  }

  get x(): number {
    return this.sprite.x;
  }

  get y(): number {
    return this.sprite.y;
  }

  cone(): ConeState {
    const length = CHARACTERS[this.id].coneLength * (1 + this.alert * 0.12);
    const base = farmerCone(this.id, this.x, this.y, this.angle);
    return { ...base, length };
  }

  update(dt: number, tileSize: number, lookout: boolean): void {
    const points = this.patrol.waypoints;
    const target = points[this.waypoint];
    const tx = target.x * tileSize + tileSize / 2;
    const ty = target.y * tileSize + tileSize / 2;
    const dx = tx - this.x;
    const dy = ty - this.y;
    const dist = Math.hypot(dx, dy);
    const speed = this.patrol.speed * (1 + this.alert * 0.15);

    if (this.wait > 0) {
      this.wait -= dt * 1000;
    } else if (dist < 4) {
      this.wait = target.waitMs;
      this.waypoint = (this.waypoint + 1) % points.length;
    } else {
      this.sprite.x += (dx / dist) * speed * dt;
      this.sprite.y += (dy / dist) * speed * dt;
      this.angle = Math.atan2(dy, dx);
    }

    this.drawCone(lookout);
  }

  private drawCone(lookout: boolean): void {
    const cone = this.cone();
    this.coneGfx.clear();
    const alpha = lookout ? 0.28 : 0.1;
    this.coneGfx.fillStyle(0xf0d878, alpha);
    this.coneGfx.beginPath();
    this.coneGfx.moveTo(cone.x, cone.y);
    const steps = 10;
    for (let i = 0; i <= steps; i += 1) {
      const a = cone.angle - cone.halfAngle + (cone.halfAngle * 2 * i) / steps;
      this.coneGfx.lineTo(cone.x + Math.cos(a) * cone.length, cone.y + Math.sin(a) * cone.length);
    }
    this.coneGfx.closePath();
    this.coneGfx.fillPath();
    this.coneGfx.lineStyle(lookout ? 2 : 1, 0x2b2118, lookout ? 0.45 : 0.15);
    this.coneGfx.strokePath();
  }

  destroy(): void {
    this.sprite.destroy();
    this.coneGfx.destroy();
  }
}
