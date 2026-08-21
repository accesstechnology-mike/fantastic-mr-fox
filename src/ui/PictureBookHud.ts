import Phaser from "phaser";
import { portraitTexture } from "../art/appearance";
import { SWITCH_SLOTS } from "../data/characters";
import { INK, LETTERBOX, PAPER } from "../data/palette";
import type { CharacterId } from "../types";
import { isUnlocked } from "../systems/party";

export class PictureBookHud {
  private readonly root: Phaser.GameObjects.Container;
  private readonly title: Phaser.GameObjects.Text;
  private readonly ink: Phaser.GameObjects.Text;
  private readonly hint: Phaser.GameObjects.Text;
  private readonly toast: Phaser.GameObjects.Text;
  private readonly party: Phaser.GameObjects.Container;
  private readonly noise: Phaser.GameObjects.Text;
  private toastUntil = 0;
  private onPick: ((id: CharacterId) => void) | null = null;

  constructor(scene: Phaser.Scene) {
    this.root = scene.add.container(0, 0).setScrollFactor(0).setDepth(80);
    const top = scene.add.rectangle(512, 30, 1024, 60, PAPER, 0.94).setStrokeStyle(2, INK, 0.4);
    const bottom = scene.add.rectangle(512, 548, 1024, 56, PAPER, 0.94).setStrokeStyle(2, INK, 0.4);
    this.title = scene.add
      .text(20, 8, "", {
        fontFamily: "Libre Baskerville, serif",
        fontSize: "20px",
        color: "#2b2118",
        fontStyle: "italic",
      })
      .setOrigin(0, 0);
    this.ink = scene.add
      .text(20, 534, "", {
        fontFamily: "Caveat, cursive",
        fontSize: "22px",
        color: "#2b2118",
        wordWrap: { width: 700 },
      })
      .setOrigin(0, 0.5);
    this.hint = scene.add
      .text(20, 560, "", {
        fontFamily: "Caveat, cursive",
        fontSize: "18px",
        color: "#4a3b2a",
      })
      .setOrigin(0, 0.5);
    this.toast = scene.add
      .text(512, 92, "", {
        fontFamily: "Caveat, cursive",
        fontSize: "26px",
        color: "#2b2118",
        backgroundColor: "#f4e6c4cc",
        padding: { x: 12, y: 6 },
        align: "center",
        wordWrap: { width: 740 },
      })
      .setOrigin(0.5, 0)
      .setAlpha(0);
    this.noise = scene.add
      .text(1004, 12, "", {
        fontFamily: "Caveat, cursive",
        fontSize: "18px",
        color: "#2b2118",
      })
      .setOrigin(1, 0);
    this.party = scene.add.container(628, 6);
    this.root.add([top, bottom, this.title, this.ink, this.hint, this.toast, this.noise, this.party]);
    scene.add.rectangle(512, 2, 1024, 6, LETTERBOX, 0.25).setScrollFactor(0).setDepth(79);
    scene.add.rectangle(512, 574, 1024, 6, LETTERBOX, 0.25).setScrollFactor(0).setDepth(79);
  }

  setPicker(handler: (id: CharacterId) => void): void {
    this.onPick = handler;
  }

  setChapter(title: string, ink: string): void {
    this.title.setText(title);
    this.ink.setText(ink);
  }

  setObjective(text: string): void {
    this.ink.setText(text);
  }

  setHint(text: string): void {
    this.hint.setText(text);
  }

  setNoise(value: number, show: boolean): void {
    this.noise.setText(show ? `Noise ${Math.round(value)}` : "");
  }

  say(scene: Phaser.Scene, text: string, ms = 3200): void {
    this.toast.setText(text).setAlpha(1);
    this.toastUntil = scene.time.now + ms;
  }

  refreshParty(scene: Phaser.Scene, allowed: CharacterId[], current: CharacterId): void {
    this.party.removeAll(true);
    allowed.forEach((id, index) => {
      const unlocked = isUnlocked(id);
      const slot = SWITCH_SLOTS.indexOf(id);
      const x = index * 54;
      const img = scene.add.image(x, 16, portraitTexture(id)).setScale(0.48);
      img.setAlpha(unlocked ? (id === current ? 1 : 0.78) : 0.22);
      const key = slot >= 0 ? String(slot + 1) : "";
      const caption = scene.add
        .text(x, 36, unlocked ? key : "", {
          fontFamily: "Libre Baskerville, serif",
          fontSize: "11px",
          color: "#2b2118",
        })
        .setOrigin(0.5, 0);
      if (id === current) {
        const ring = scene.add.rectangle(x, 16, 34, 34).setStrokeStyle(2, INK, 0.85);
        this.party.add(ring);
      }
      if (unlocked && this.onPick) {
        img.setInteractive({ useHandCursor: true });
        img.on("pointerdown", () => this.onPick?.(id));
        caption.setInteractive({ useHandCursor: true }).on("pointerdown", () => this.onPick?.(id));
      }
      this.party.add([img, caption]);
    });
  }

  update(scene: Phaser.Scene): void {
    if (this.toastUntil && scene.time.now > this.toastUntil) {
      this.toast.setAlpha(0);
      this.toastUntil = 0;
    }
  }
}
