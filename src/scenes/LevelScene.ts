import Phaser from "phaser";
import { WASH_NIGHT } from "../data/palette";
import { abilityInk, INVITE_LINES, MEET_LINES, TOASTS } from "../data/dialogue";
import { levelById } from "../data/levels";
import { STEAL_RULE } from "../data/story";
import { Actor } from "../entities/Actor";
import { FarmerPawn } from "../entities/FarmerPawn";
import { CarrySystem, type CarriedFood } from "../systems/carry";
import { DigSystem } from "../systems/dig";
import { finishChapter } from "../systems/flow";
import { isDeath, TileGrid } from "../systems/grid";
import { NoiseSystem } from "../systems/noise";
import { cycleParty, playableNow, slotCharacter, statsOf } from "../systems/party";
import { getSave, patchSave, unlockCharacters } from "../systems/save";
import { spottedThreshold, visibilityOf } from "../systems/stealth";
import type { CharacterId, FarmId, FoodDef, LevelDef, SceneKey } from "../types";
import { PictureBookHud } from "../ui/PictureBookHud";

const TILE_KEY: Record<string, string> = {
  "#": "tile-tree",
  ".": "tile-grass",
  ",": "tile-tall",
  "=": "tile-floor",
  "+": "tile-hole",
  "^": "tile-surface",
  "%": "tile-earth",
  R: "tile-rock",
  s: "tile-den",
  m: "tile-den",
  w: "tile-den",
  D: "tile-den",
  _: "tile-floor",
  "~": "tile-slick",
  B: "tile-rubble",
  T: "tile-floor",
  H: "tile-den",
};

function ambientTile(ch: string, ambient: LevelDef["ambient"]): string {
  if (ambient === "night" && ch === ".") {
    return "tile-night";
  }
  if (ambient !== "night" && ch === "#") {
    return "tile-rock";
  }
  if (ambient === "tunnel" && ch === ".") {
    return "tile-den";
  }
  return TILE_KEY[ch] ?? "tile-grass";
}

interface FoodBit {
  def: FoodDef;
  sprite: Phaser.GameObjects.Image;
}

interface NpcBit {
  id: "badger" | "mole" | "rabbit" | "weasel" | "mrsFox" | "family";
  x: number;
  y: number;
  label: string;
  sprite: Phaser.GameObjects.Image;
}

export class LevelScene extends Phaser.Scene {
  protected levelId: string;
  protected chapterId: string;
  protected level!: LevelDef;
  protected grid!: TileGrid;
  protected ground!: Phaser.GameObjects.RenderTexture;
  protected player!: Actor;
  protected farmers: FarmerPawn[] = [];
  protected foods: FoodBit[] = [];
  protected npcs: NpcBit[] = [];
  protected carry = new CarrySystem();
  protected dig = new DigSystem();
  protected noise = new NoiseSystem();
  protected hud!: PictureBookHud;
  protected keys!: {
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    a: Phaser.Input.Keyboard.Key;
    d: Phaser.Input.Keyboard.Key;
    w: Phaser.Input.Keyboard.Key;
    s: Phaser.Input.Keyboard.Key;
    shift: Phaser.Input.Keyboard.Key;
    e: Phaser.Input.Keyboard.Key;
    space: Phaser.Input.Keyboard.Key;
    lb: Phaser.Input.Keyboard.Key;
    rb: Phaser.Input.Keyboard.Key;
  };
  protected sneaking = false;
  protected digging = false;
  protected stunned = 0;
  protected finished = false;
  protected alert = 0;
  protected collapseY = -1;
  protected route!: Phaser.GameObjects.Graphics;
  protected dark!: Phaser.GameObjects.Rectangle;
  protected carriedIcon!: Phaser.GameObjects.Image;
  private stampImage!: Phaser.GameObjects.Image;
  private interactLatch = false;
  private digAcc = 0;

  constructor(key: SceneKey, levelId: string, chapterId: string) {
    super(key);
    this.levelId = levelId;
    this.chapterId = chapterId;
  }

  create(): void {
    this.level = levelById(this.levelId);
    this.grid = new TileGrid(this.level.rows, this.level.tileSize);
    this.carry = new CarrySystem();
    this.dig = new DigSystem();
    this.noise = new NoiseSystem();
    this.farmers = [];
    this.foods = [];
    this.npcs = [];
    this.finished = false;
    this.alert = 0;
    this.collapseY = this.level.collapseY;
    this.cameras.main.setBackgroundColor("#ead9b2");

    this.drawGround();
    this.spawnActors();
    this.bindKeys();
    this.hud = new PictureBookHud(this);
    this.hud.setChapter(this.level.title, this.level.ink);
    this.refreshPartyHud();
    this.route = this.add.graphics().setDepth(7);
    this.dark = this.add
      .rectangle(
        (this.grid.width * this.grid.tileSize) / 2,
        (this.grid.height * this.grid.tileSize) / 2,
        this.grid.width * this.grid.tileSize,
        this.grid.height * this.grid.tileSize,
        WASH_NIGHT,
        this.shade(),
      )
      .setDepth(15);
    this.carriedIcon = this.add.image(0, 0, "food-chicken").setVisible(false).setDepth(21).setScale(0.7);

    this.cameras.main.setBounds(0, 0, this.grid.width * this.grid.tileSize, this.grid.height * this.grid.tileSize);
    this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
    this.cameras.main.setZoom(1);

    if (this.chapterId === "shovels") {
      this.time.addEvent({
        delay: 2400,
        loop: true,
        callback: () => this.advanceCollapse(),
      });
    }
  }

  private shade(): number {
    const vision = statsOf(this.player.id).darkVision;
    return Math.max(0.04, this.level.darkness * (1 - vision * 0.72));
  }

  private drawGround(): void {
    const w = this.grid.width * this.grid.tileSize;
    const h = this.grid.height * this.grid.tileSize;
    if (this.ground) {
      this.ground.destroy();
    }
    this.stampImage = this.make.image({ key: "tile-grass", add: false });
    this.stampImage.setOrigin(0);
    this.ground = this.add.renderTexture(0, 0, w, h).setOrigin(0).setDepth(1);
    for (let ty = 0; ty < this.grid.height; ty += 1) {
      for (let tx = 0; tx < this.grid.width; tx += 1) {
        const ch = this.grid.tile(tx, ty);
        if (ch === " ") {
          continue;
        }
        this.stamp(tx, ty, ch);
      }
    }
  }

  private stamp(tx: number, ty: number, ch: string): void {
    const key = ambientTile(ch, this.level.ambient);
    const x = tx * this.grid.tileSize;
    const y = ty * this.grid.tileSize;
    this.stampImage.setTexture(key).setDisplaySize(this.grid.tileSize, this.grid.tileSize);
    this.ground.draw(this.stampImage, x, y);
  }

  private restamp(tx: number, ty: number, ch: string): void {
    this.stamp(tx, ty, ch);
  }

  private spawnActors(): void {
    const start = this.snapOpen(this.level.spawn.x, this.level.spawn.y);
    const forced = this.level.forceCharacter;
    const allowed = playableNow(this.level.allowed);
    const startId = forced && allowed.includes(forced) ? forced : (allowed[0] ?? "mrFox");
    const c = this.grid.tileCenter(start.tx, start.ty);
    this.player = new Actor(this, startId, c.x, c.y);

    for (const patrol of this.level.patrols) {
      const farmer = new FarmerPawn(this, patrol, this.grid.tileSize);
      this.farmers.push(farmer);
    }
    for (const food of this.level.foods) {
      this.spawnFood(food);
    }
    for (const npc of this.level.npcs) {
      const open = this.snapOpen(npc.x, npc.y);
      const pos = this.grid.tileCenter(open.tx, open.ty);
      const texture = npc.id === "family" ? "char-smallFox" : `char-${npc.id === "mrsFox" ? "mrsFox" : npc.id}`;
      const sprite = this.add.image(pos.x, pos.y, texture).setDepth(12).setScale(0.7);
      this.npcs.push({ ...npc, x: open.tx, y: open.ty, sprite });
    }
    for (const cub of this.level.cubs) {
      const open = this.snapOpen(cub.x, cub.y);
      const pos = this.grid.tileCenter(open.tx, open.ty);
      this.add.image(pos.x, pos.y, "char-smallFox").setDepth(12).setScale(0.48);
    }
  }

  private spawnFood(def: FoodDef): void {
    const pos = this.grid.tileCenter(def.x, def.y);
    const sprite = this.add.image(pos.x, pos.y, `food-${def.kind}`).setDepth(11);
    this.foods.push({ def, sprite });
  }

  private snapOpen(x: number, y: number): { tx: number; ty: number } {
    const stats = statsOf("mrFox");
    const queue = [{ tx: x, ty: y }];
    const seen = new Set<string>();
    while (queue.length) {
      const cur = queue.shift();
      if (!cur) {
        break;
      }
      const key = `${cur.tx},${cur.ty}`;
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      const ch = this.grid.tile(cur.tx, cur.ty);
      if (!this.grid.blockedWorld(cur.tx * this.grid.tileSize + 2, cur.ty * this.grid.tileSize + 2, stats) && !isDeath(ch)) {
        return cur;
      }
      queue.push(
        { tx: cur.tx + 1, ty: cur.ty },
        { tx: cur.tx - 1, ty: cur.ty },
        { tx: cur.tx, ty: cur.ty + 1 },
        { tx: cur.tx, ty: cur.ty - 1 },
      );
      if (seen.size > 80) {
        break;
      }
    }
    return { tx: x, ty: y };
  }

  private bindKeys(): void {
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
      e: kb.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      space: kb.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      lb: kb.addKey(Phaser.Input.Keyboard.KeyCodes.OPEN_BRACKET),
      rb: kb.addKey(Phaser.Input.Keyboard.KeyCodes.CLOSED_BRACKET),
    };
    kb.on("keydown", (event: KeyboardEvent) => {
      const num = event.key;
      if (num >= "1" && num <= "9") {
        this.trySwitch(slotCharacter(Number(num) - 1));
      }
      if (num === "0") {
        this.trySwitch(slotCharacter(9));
      }
    });
  }

  update(_t: number, dtMs: number): void {
    if (this.finished) {
      return;
    }
    const dt = dtMs / 1000;
    this.hud.update(this);
    this.stunned = Math.max(0, this.stunned - dt);
    this.handleSwitch();
    this.movePlayer(dt);
    this.handleDig(dt);
    this.handleInteract();
    this.updateFarmers(dt);
    this.noise.tick(dt, this.isMoving(), this.sneaking, this.digging, this.player.id);
    this.maybeCollapseNoise();
    this.dark.setAlpha(this.shade());
    this.drawRoute();
    this.syncCarryIcon();
    this.refreshObjective();
    this.checkWin();
    if (this.grid.onDeath(this.player.x, this.player.y)) {
      this.fail(TOASTS.surface);
    }
  }

  private isMoving(): boolean {
    return (
      this.keys.left.isDown ||
      this.keys.a.isDown ||
      this.keys.right.isDown ||
      this.keys.d.isDown ||
      this.keys.up.isDown ||
      this.keys.w.isDown ||
      this.keys.down.isDown ||
      this.keys.s.isDown
    );
  }

  private movePlayer(dt: number): void {
    if (this.stunned > 0) {
      return;
    }
    this.sneaking = this.keys.shift.isDown;
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
    this.player.facing = { x: mx, y: my };
    const stats = this.player.stats;
    let speed = this.sneaking ? stats.sneakSpeed : stats.speed;
    const tile = this.grid.tileWorld(this.player.x, this.player.y);
    if (tile === "~") {
      speed *= 1.15;
      mx += this.player.facing.x * 0.15;
    }
    const len = Math.hypot(mx, my) || 1;
    const nx = this.player.x + (mx / len) * speed * dt;
    const ny = this.player.y + (my / len) * speed * dt;
    if (this.grid.bodyFits(nx, this.player.y, stats)) {
      this.player.sprite.x = nx;
    }
    if (this.grid.bodyFits(this.player.x, ny, stats)) {
      this.player.sprite.y = ny;
    }
    this.maybeUnlockSmall();
  }

  private handleDig(dt: number): void {
    this.digging = this.keys.space.isDown || this.keys.d.isDown;
    if (!this.digging) {
      this.digAcc = 0;
      return;
    }
    this.digAcc += dt;
    if (this.digAcc < 0.16) {
      return;
    }
    this.digAcc = 0;
    const hit = this.dig.strike(this.player.x, this.player.y, this.player.facing, this.grid, this.player.id);
    if (hit?.opened) {
      this.restamp(hit.tx, hit.ty, ".");
    }
  }

  private handleInteract(): void {
    const down = this.keys.e.isDown;
    if (!down) {
      this.interactLatch = false;
      return;
    }
    if (this.interactLatch) {
      return;
    }
    this.interactLatch = true;
    if (this.tryTakeFood()) {
      return;
    }
    if (this.tryDeposit()) {
      return;
    }
    this.tryTalk();
  }

  private tryTakeFood(): boolean {
    const reach = this.grid.tileSize * 0.85;
    const near = this.foods.find((food) => Phaser.Math.Distance.Between(this.player.x, this.player.y, food.sprite.x, food.sprite.y) < reach);
    if (!near) {
      return false;
    }
    if (!this.carry.canTake(this.player.id)) {
      this.hud.say(this, TOASTS.heavy);
      return true;
    }
    const item: CarriedFood = { id: near.def.id, kind: near.def.kind, farm: near.def.farm };
    this.carry.take(item, this.player.id);
    near.sprite.destroy();
    this.foods = this.foods.filter((food) => food !== near);
    if (this.level.objective.kind === "stealVariety") {
      if (this.carry.greedRuined(item.farm)) {
        this.fail(TOASTS.greedFail);
        return true;
      }
      if (this.carry.tooGreedy(item.farm)) {
        this.alert += 1;
        this.farmers.forEach((farmer) => {
          farmer.alert = this.alert;
        });
        this.hud.say(this, TOASTS.greedWarn);
      }
    }
    return true;
  }

  private onHole(): boolean {
    const { tx, ty } = this.grid.worldToTile(this.player.x, this.player.y);
    const ch = this.grid.tile(tx, ty);
    if (ch === "+" || ch === "D" || ch === "H") {
      return true;
    }
    const hole = this.grid.tileCenter(this.level.hole.x, this.level.hole.y);
    return Phaser.Math.Distance.Between(this.player.x, this.player.y, hole.x, hole.y) < this.grid.tileSize * 1.1;
  }

  private tryDeposit(): boolean {
    if (!this.onHole() || this.carry.bag.length === 0) {
      return false;
    }
    this.carry.deposit();
    this.hud.say(this, TOASTS.deposited);
    return true;
  }

  private tryTalk(): void {
    const reach = this.grid.tileSize * 1.2;
    const npc = this.npcs.find((n) => {
      const p = this.grid.tileCenter(n.x, n.y);
      return Phaser.Math.Distance.Between(this.player.x, this.player.y, p.x, p.y) < reach;
    });
    if (!npc) {
      return;
    }
    if (npc.id === "mrsFox") {
      this.hud.say(this, MEET_LINES.mrsFox, 4200);
      return;
    }
    if (npc.id === "badger" || npc.id === "mole" || npc.id === "rabbit" || npc.id === "weasel") {
      if (this.level.objective.kind === "inviteFamilies") {
        const save = getSave();
        if (!save.feastInvited.includes(npc.id)) {
          patchSave({ feastInvited: [...save.feastInvited, npc.id] });
          this.hud.say(this, INVITE_LINES[npc.id], 4200);
        }
        return;
      }
      const save = getSave();
      if (!save.found[npc.id]) {
        unlockCharacters([npc.id]);
        patchSave({ found: { ...save.found, [npc.id]: true } });
        this.hud.say(this, MEET_LINES[npc.id], 4600);
        this.refreshPartyHud();
      } else {
        this.hud.say(this, MEET_LINES[npc.id], 3000);
      }
    }
  }

  private handleSwitch(): void {
    const left = Phaser.Input.Keyboard.JustDown(this.keys.lb);
    const right = Phaser.Input.Keyboard.JustDown(this.keys.rb);
    if (left || right) {
      const next = cycleParty(this.player.id, this.level.allowed, right ? 1 : -1);
      this.trySwitch(next);
    }
  }

  private trySwitch(id: CharacterId | null): void {
    if (!id || this.level.forceCharacter) {
      return;
    }
    if (!this.level.allowed.includes(id) || !playableNow(this.level.allowed).includes(id)) {
      return;
    }
    const stats = statsOf(id);
    if (!this.grid.bodyFits(this.player.x, this.player.y, stats)) {
      this.hud.say(this, TOASTS.switchDenied);
      return;
    }
    if (this.carry.bag.length > stats.carry) {
      this.hud.say(this, TOASTS.heavy);
      return;
    }
    this.player.apply(id);
    this.refreshPartyHud();
    this.hud.say(this, abilityInk(id), 2400);
  }

  private updateFarmers(dt: number): void {
    const lookout = this.player.stats.lookout;
    for (const farmer of this.farmers) {
      farmer.update(dt, this.grid.tileSize, lookout);
      const vis = visibilityOf(
        this.player.x,
        this.player.y,
        this.sneaking,
        this.player.id,
        this.grid,
        farmer.cone(),
      );
      if (vis >= spottedThreshold(this.alert)) {
        this.spotted();
        return;
      }
      if (this.player.stats.hear > 0) {
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, farmer.x, farmer.y);
        if (dist < this.player.stats.hear && dist > farmer.cone().length * 0.35) {
          farmer.sprite.setTint(0xf0e0a0);
        } else {
          farmer.sprite.clearTint();
        }
      }
    }
  }

  private spotted(): void {
    for (const item of this.carry.dropAll()) {
      const def = this.level.foods.find((food) => food.id === item.id);
      if (def && !this.foods.some((food) => food.def.id === def.id)) {
        this.spawnFood(def);
      }
    }
    const hole = this.snapOpen(this.level.hole.x, this.level.hole.y);
    const c = this.grid.tileCenter(hole.tx, hole.ty);
    this.player.setPos(c.x, c.y);
    this.hud.say(this, TOASTS.spotted);
  }

  private maybeUnlockSmall(): void {
    if (this.chapterId !== "shovels") {
      return;
    }
    const { tx, ty } = this.grid.worldToTile(this.player.x, this.player.y);
    const nearSqueeze = ["s", "w", "m"].some((ch) => {
      return (
        this.grid.tile(tx + 1, ty) === ch ||
        this.grid.tile(tx - 1, ty) === ch ||
        this.grid.tile(tx, ty + 1) === ch ||
        this.grid.tile(tx, ty - 1) === ch
      );
    });
    if ((nearSqueeze || this.collapseY >= 5) && !getSave().unlocked.includes("smallFox")) {
      unlockCharacters(["smallFox"]);
      this.refreshPartyHud();
      this.hud.say(this, TOASTS.unlocked("The Smallest Fox"), 3600);
    }
  }

  private advanceCollapse(): void {
    if (this.collapseY < 0 || this.finished) {
      return;
    }
    this.collapseY += 1;
    for (let tx = 0; tx < this.grid.width; tx += 1) {
      const ch = this.grid.tile(tx, this.collapseY);
      if (ch !== "R" && ch !== " " && !isDeath(ch)) {
        this.grid.setTile(tx, this.collapseY, "^");
        this.restamp(tx, this.collapseY, "^");
      }
    }
    if (this.collapseY === 5 && !getSave().unlocked.includes("smallFox")) {
      unlockCharacters(["smallFox"]);
      this.refreshPartyHud();
      this.hud.say(this, "The hill pinched. Only a small fox could wriggle on.", 4000);
    }
  }

  private maybeCollapseNoise(): void {
    if (this.level.ambient !== "interior") {
      this.hud.setNoise(this.noise.value, false);
      return;
    }
    this.hud.setNoise(this.noise.value, true);
    if (Math.random() < this.noise.collapseChance() * 0.02) {
      const { tx, ty } = this.grid.worldToTile(this.player.x, this.player.y);
      const nx = tx + (Math.random() > 0.5 ? 1 : -1);
      const ny = ty;
      if (this.grid.tile(nx, ny) === "." || this.grid.tile(nx, ny) === "_") {
        this.grid.setTile(nx, ny, "B");
        this.restamp(nx, ny, "B");
        this.stunned = 0.45;
        this.hud.say(this, TOASTS.collapse);
      }
    }
  }

  private drawRoute(): void {
    this.route.clear();
    if (!this.player.stats.planRoute) {
      return;
    }
    const target = this.routeTarget();
    if (!target) {
      return;
    }
    this.route.lineStyle(2, 0x2b2118, 0.28);
    const steps = 8;
    for (let i = 1; i <= steps; i += 1) {
      const t = i / steps;
      const x = Phaser.Math.Linear(this.player.x, target.x, t);
      const y = Phaser.Math.Linear(this.player.y, target.y, t);
      this.route.fillStyle(0x2b2118, 0.25);
      this.route.fillCircle(x, y, 2.2);
    }
  }

  private routeTarget(): { x: number; y: number } | null {
    const obj = this.level.objective;
    if (obj.kind === "stealVariety") {
      const farms: FarmId[] = ["boggis", "bunce", "bean"];
      const missing = farms.find((farm) => this.carry.deposited.filter((item) => item.farm === farm).length + this.carry.bag.filter((item) => item.farm === farm).length < obj.needEachFarm);
      if (missing) {
        const food = this.foods.find((bit) => bit.def.farm === missing);
        return food ? { x: food.sprite.x, y: food.sprite.y } : null;
      }
      return this.grid.tileCenter(this.level.hole.x, this.level.hole.y);
    }
    if (obj.kind === "reachDen") {
      const den = this.grid.findTiles("D")[0];
      return den ? this.grid.tileCenter(den.tx, den.ty) : null;
    }
    if (obj.kind === "meetAnimals") {
      const save = getSave();
      const npc = this.npcs.find((n) => n.id !== "mrsFox" && n.id !== "family" && !save.found[n.id as "badger"]);
      return npc ? this.grid.tileCenter(npc.x, npc.y) : null;
    }
    if (obj.kind === "depositFood") {
      return this.grid.tileCenter(this.level.hole.x, this.level.hole.y);
    }
    if (obj.kind === "inviteFamilies") {
      const invited = getSave().feastInvited;
      const npc = this.npcs.find((n) => n.id !== "mrsFox" && n.id !== "family" && !invited.includes(n.id as "badger"));
      if (npc) {
        return this.grid.tileCenter(npc.x, npc.y);
      }
      const hall = this.grid.findTiles("H")[0];
      return hall ? this.grid.tileCenter(hall.tx, hall.ty) : null;
    }
    return null;
  }

  private syncCarryIcon(): void {
    const top = this.carry.bag[this.carry.bag.length - 1];
    if (!top) {
      this.carriedIcon.setVisible(false);
      return;
    }
    this.carriedIcon.setVisible(true).setTexture(`food-${top.kind}`).setPosition(this.player.x + 12, this.player.y - 22);
  }

  private refreshPartyHud(): void {
    this.hud.refreshParty(this, this.level.allowed, this.player.id);
  }

  private refreshObjective(): void {
    const obj = this.level.objective;
    if (obj.kind === "stealVariety") {
      const b = this.carry.deposited.filter((i) => i.farm === "boggis").length;
      const u = this.carry.deposited.filter((i) => i.farm === "bunce").length;
      const e = this.carry.deposited.filter((i) => i.farm === "bean").length;
      this.hud.setObjective(
        `Home ${this.carry.bag.length} · Boggis ${b}  Bunce ${u}  Bean ${e}  (no more than ${STEAL_RULE.perFarmMax} from one farm)`,
      );
    } else if (obj.kind === "depositFood") {
      this.hud.setObjective(`Taken home ${this.carry.deposited.length} / ${obj.needTotal}. Carry ${this.carry.bag.length}.`);
    } else if (obj.kind === "meetAnimals") {
      const f = getSave().found;
      this.hud.setObjective(
        `Found: ${f.badger ? "Badger " : ""}${f.mole ? "Mole " : ""}${f.rabbit ? "Rabbit " : ""}${f.weasel ? "Weasel" : ""}`.trim() ||
          this.level.ink,
      );
    } else if (obj.kind === "inviteFamilies") {
      this.hud.setObjective(`Invited ${getSave().feastInvited.length} / 4 families.`);
    } else if (obj.kind === "reachDen") {
      this.hud.setObjective(this.level.ink);
    }
  }

  private checkWin(): void {
    const obj = this.level.objective;
    if (obj.kind === "stealVariety") {
      if (this.carry.varietyReady(obj.needEachFarm, obj.needTotal) && this.onHole()) {
        this.win();
      }
    } else if (obj.kind === "reachDen") {
      const { tx, ty } = this.grid.worldToTile(this.player.x, this.player.y);
      if (this.grid.tile(tx, ty) === "D") {
        this.win();
      }
    } else if (obj.kind === "meetAnimals") {
      const f = getSave().found;
      if (f.badger && f.mole && f.rabbit && f.weasel) {
        this.win();
      }
    } else if (obj.kind === "depositFood") {
      if (this.carry.deposited.length >= obj.needTotal) {
        this.win();
      }
    } else if (obj.kind === "inviteFamilies") {
      const { tx, ty } = this.grid.worldToTile(this.player.x, this.player.y);
      if (getSave().feastInvited.length >= obj.inviteNeed && (this.grid.tile(tx, ty) === "H" || this.grid.tile(tx, ty) === "T")) {
        this.win();
      }
    }
  }

  protected win(): void {
    if (this.finished) {
      return;
    }
    this.finished = true;
    const next = finishChapter(this.chapterId);
    this.time.delayedCall(500, () => {
      this.scene.start(next.scene, "cutsceneId" in next ? { cutsceneId: next.cutsceneId } : undefined);
    });
  }

  private fail(message: string): void {
    if (this.finished) {
      return;
    }
    this.hud.say(this, message, 2400);
    this.time.delayedCall(900, () => {
      this.scene.restart();
    });
    this.finished = true;
  }

}
