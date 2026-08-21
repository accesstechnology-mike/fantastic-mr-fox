import Phaser from "phaser";
import { TOASTS } from "../data/dialogue";
import { farmerLevel } from "../data/levels";
import { FARMER_MODE } from "../data/story";
import { WASH_NIGHT } from "../data/palette";
import { Actor } from "../entities/Actor";
import { TileGrid } from "../systems/grid";
import { cycleParty, playableNow, slotCharacter, statsOf } from "../systems/party";
import { farmerCone, visibilityOf } from "../systems/stealth";
import type { CharacterId, FarmerId } from "../types";
import { PictureBookHud } from "../ui/PictureBookHud";

interface FoxBit {
  actor: Actor;
  carrying: boolean;
  target: { x: number; y: number };
  hiddenUntil: number;
}

export class FarmerModeScene extends Phaser.Scene {
  private grid!: TileGrid;
  private player!: Actor;
  private foxes: FoxBit[] = [];
  private foods: Phaser.GameObjects.Image[] = [];
  private holes: Array<{ x: number; y: number }> = [];
  private hud!: PictureBookHud;
  private coneGfx!: Phaser.GameObjects.Graphics;
  private escapes = 0;
  private finished = false;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;

  constructor() {
    super("FarmerMode");
  }

  create(): void {
    const level = farmerLevel;
    this.grid = new TileGrid(level.rows, level.tileSize);
    this.escapes = 0;
    this.finished = false;
    this.foxes = [];
    this.foods = [];
    this.cameras.main.setBackgroundColor("#ead9b2");

    const ground = this.add.renderTexture(0, 0, this.grid.width * this.grid.tileSize, this.grid.height * this.grid.tileSize).setOrigin(0);
    for (let ty = 0; ty < this.grid.height; ty += 1) {
      for (let tx = 0; tx < this.grid.width; tx += 1) {
        const ch = this.grid.tile(tx, ty);
        if (ch === " ") {
          continue;
        }
        const key = ch === "#" ? "tile-tree" : ch === "," ? "tile-tall" : ch === "+" ? "tile-hole" : ch === "_" ? "tile-floor" : "tile-night";
        ground.draw(key, tx * this.grid.tileSize, ty * this.grid.tileSize);
      }
    }

    const allowed = playableNow(level.allowed);
    const startId = (allowed[0] ?? "boggis") as FarmerId;
    const spawn = this.grid.tileCenter(level.spawn.x, level.spawn.y);
    this.player = new Actor(this, startId, spawn.x, spawn.y);

    this.holes = this.grid.findTiles("+").map((tile) => this.grid.tileCenter(tile.tx, tile.ty));
    if (this.holes.length === 0) {
      throw new Error("Farmer mode map is missing hole tiles");
    }

    for (const food of level.foods) {
      const pos = this.grid.tileCenter(food.x, food.y);
      this.foods.push(this.add.image(pos.x, pos.y, `food-${food.kind}`).setDepth(11));
    }

    this.spawnFox("mrFox");
    this.spawnFox("smallFox");

    this.coneGfx = this.add.graphics().setDepth(8);
    this.add
      .rectangle(
        (this.grid.width * this.grid.tileSize) / 2,
        (this.grid.height * this.grid.tileSize) / 2,
        this.grid.width * this.grid.tileSize,
        this.grid.height * this.grid.tileSize,
        WASH_NIGHT,
        0.32,
      )
      .setDepth(14);

    this.hud = new PictureBookHud(this);
    this.hud.setChapter(level.title, level.ink);
    this.hud.refreshParty(this, level.allowed, this.player.id);

    const kb = this.input.keyboard;
    if (!kb) {
      throw new Error("Keyboard input is required");
    }
    this.keys = {
      left: kb.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: kb.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      up: kb.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      down: kb.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      a: kb.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      d: kb.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      w: kb.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      s: kb.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      shift: kb.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
      lb: kb.addKey(Phaser.Input.Keyboard.KeyCodes.OPEN_BRACKET),
      rb: kb.addKey(Phaser.Input.Keyboard.KeyCodes.CLOSED_BRACKET),
    };
    kb.on("keydown", (event: KeyboardEvent) => {
      if (event.key >= "1" && event.key <= "9") {
        this.switchTo(slotCharacter(Number(event.key) - 1));
      }
    });

    this.cameras.main.setBounds(0, 0, this.grid.width * this.grid.tileSize, this.grid.height * this.grid.tileSize);
    this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
  }

  update(_t: number, dtMs: number): void {
    if (this.finished) {
      return;
    }
    const dt = dtMs / 1000;
    this.hud.update(this);
    this.moveFarmer(dt);
    this.drawCone();
    this.updateFoxes(dt);
    this.hud.setObjective(`Foxes home ${this.escapes} / ${FARMER_MODE.foxEscapesToEnd}. The tunnels are not yours.`);
  }

  private spawnFox(id: CharacterId): void {
    const hole = this.holes[Math.floor(Math.random() * this.holes.length)];
    const actor = new Actor(this, id, hole.x, hole.y);
    actor.sprite.setDepth(18);
    this.foxes.push({
      actor,
      carrying: false,
      target: this.nearestFood(hole.x, hole.y) ?? hole,
      hiddenUntil: 0,
    });
  }

  private nearestFood(x: number, y: number): { x: number; y: number } | null {
    const live = this.foods.filter((food) => food.visible);
    if (live.length === 0) {
      return this.holes[0] ?? null;
    }
    return live.reduce((best, food) => {
      const d = Phaser.Math.Distance.Between(x, y, food.x, food.y);
      const bd = Phaser.Math.Distance.Between(x, y, best.x, best.y);
      return d < bd ? { x: food.x, y: food.y } : best;
    }, { x: live[0].x, y: live[0].y });
  }

  private nearestHole(x: number, y: number): { x: number; y: number } {
    return this.holes.reduce((best, hole) => {
      const d = Phaser.Math.Distance.Between(x, y, hole.x, hole.y);
      const bd = Phaser.Math.Distance.Between(x, y, best.x, best.y);
      return d < bd ? hole : best;
    });
  }

  private moveFarmer(dt: number): void {
    if (Phaser.Input.Keyboard.JustDown(this.keys.lb) || Phaser.Input.Keyboard.JustDown(this.keys.rb)) {
      const next = cycleParty(this.player.id, farmerLevel.allowed, Phaser.Input.Keyboard.JustDown(this.keys.rb) ? 1 : -1);
      this.switchTo(next);
    }
    let mx = 0;
    let my = 0;
    if (this.keys.left.isDown || this.keys.a.isDown) {
      mx -= 1;
    }
    if (this.keys.right.isDown || this.keys.d.isDown) {
      mx += 1;
    }
    if (this.keys.up.isDown || this.keys.w.isDown) {
      my -= 1;
    }
    if (this.keys.down.isDown || this.keys.s.isDown) {
      my += 1;
    }
    if (mx === 0 && my === 0) {
      return;
    }
    const sneak = this.keys.shift.isDown;
    const stats = this.player.stats;
    const speed = sneak ? stats.sneakSpeed : stats.speed;
    const len = Math.hypot(mx, my) || 1;
    const nx = this.player.x + (mx / len) * speed * dt;
    const ny = this.player.y + (my / len) * speed * dt;
    if (this.grid.bodyFits(nx, this.player.y, stats)) {
      this.player.sprite.x = nx;
    }
    if (this.grid.bodyFits(this.player.x, ny, stats)) {
      this.player.sprite.y = ny;
    }
    this.player.facing = { x: mx, y: my };
  }

  private switchTo(id: CharacterId | null): void {
    if (!id || !farmerLevel.allowed.includes(id) || !playableNow(farmerLevel.allowed).includes(id)) {
      return;
    }
    this.player.apply(id);
    this.hud.refreshParty(this, farmerLevel.allowed, id);
  }

  private drawCone(): void {
    const angle = Math.atan2(this.player.facing.y, this.player.facing.x || 0.01);
    const cone = farmerCone(this.player.id as FarmerId, this.player.x, this.player.y, angle);
    this.coneGfx.clear();
    this.coneGfx.fillStyle(0xf0d878, 0.22);
    this.coneGfx.beginPath();
    this.coneGfx.moveTo(cone.x, cone.y);
    for (let i = 0; i <= 12; i += 1) {
      const a = cone.angle - cone.halfAngle + (cone.halfAngle * 2 * i) / 12;
      this.coneGfx.lineTo(cone.x + Math.cos(a) * cone.length, cone.y + Math.sin(a) * cone.length);
    }
    this.coneGfx.closePath();
    this.coneGfx.fillPath();
  }

  private updateFoxes(dt: number): void {
    const angle = Math.atan2(this.player.facing.y, this.player.facing.x || 0.01);
    const cone = farmerCone(this.player.id as FarmerId, this.player.x, this.player.y, angle);
    for (const fox of this.foxes) {
      if (this.time.now < fox.hiddenUntil) {
        fox.actor.sprite.setVisible(false);
        continue;
      }
      fox.actor.sprite.setVisible(true);
      const vis = visibilityOf(fox.actor.x, fox.actor.y, true, fox.actor.id, this.grid, cone);
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, fox.actor.x, fox.actor.y);
      if (vis > 0.38 && dist < 36) {
        this.hud.say(this, TOASTS.caughtFox, 3200);
        fox.carrying = false;
        const hole = this.holes[Math.floor(Math.random() * this.holes.length)];
        fox.actor.setPos(hole.x, hole.y);
        fox.hiddenUntil = this.time.now + 1600;
        fox.target = this.nearestFood(hole.x, hole.y) ?? hole;
        continue;
      }

      const dx = fox.target.x - fox.actor.x;
      const dy = fox.target.y - fox.actor.y;
      const len = Math.hypot(dx, dy) || 1;
      const speed = FARMER_MODE.foxSpeed * dt;
      const stats = statsOf(fox.actor.id);
      const nx = fox.actor.x + (dx / len) * speed;
      const ny = fox.actor.y + (dy / len) * speed;
      if (this.grid.bodyFits(nx, fox.actor.y, stats)) {
        fox.actor.sprite.x = nx;
      }
      if (this.grid.bodyFits(fox.actor.x, ny, stats)) {
        fox.actor.sprite.y = ny;
      }

      if (Phaser.Math.Distance.Between(fox.actor.x, fox.actor.y, fox.target.x, fox.target.y) < 18) {
        if (!fox.carrying) {
          const food = this.foods.find((item) => item.visible && Phaser.Math.Distance.Between(item.x, item.y, fox.actor.x, fox.actor.y) < 22);
          if (food) {
            food.setVisible(false);
            fox.carrying = true;
            fox.target = this.nearestHole(fox.actor.x, fox.actor.y);
          } else {
            fox.target = this.nearestFood(fox.actor.x, fox.actor.y) ?? this.holes[0];
          }
        } else {
          this.escapes += 1;
          this.hud.say(this, TOASTS.foxGone, 2400);
          fox.carrying = false;
          const other = this.holes.filter((hole) => hole !== fox.target);
          const dest = other[Math.floor(Math.random() * other.length)] ?? this.holes[0];
          fox.actor.setPos(dest.x, dest.y);
          fox.hiddenUntil = this.time.now + FARMER_MODE.holeSafeMs;
          fox.target = this.nearestFood(dest.x, dest.y) ?? dest;
          if (this.escapes >= FARMER_MODE.foxEscapesToEnd) {
            this.endWatch();
          }
        }
      }
    }
  }

  private endWatch(): void {
    this.finished = true;
    this.hud.say(this, "They still have the hill. You still have the wait.", 4200);
    this.time.delayedCall(2200, () => this.scene.start("Menu"));
  }
}
