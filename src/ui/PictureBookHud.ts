import Phaser from "phaser";
import { INK, LETTERBOX, PAPER } from "../data/palette";
import type { CharacterId } from "../types";
import { isUnlocked } from "../systems/party";

export class PictureBookHud {
  private readonly root: Phaser.GameObjects.Container;
  private readonly title: Phaser.GameObjects.Text;
  private readonly ink: Phaser.GameObjects.Text;
  private readonly toast: Phaser.GameObjects.Text;
  private readonly party: Phaser.GameObjects.Container;
  private readonly noise: Phaser.GameObjects.Text;
  private toastUntil = 0;

  constructor(scene: Phaser.Scene) {
    this.root = scene.add.container(0, 0).setScrollFactor(0).setDepth(80);
    const top = scene.add.rectangle(512, 28, 1024, 56, PAPER, 0.92).setStrokeStyle(2, INK, 0.35);
    const bottom = scene.add.rectangle(512, 552, 1024, 52, PAPER, 0.92).setStrokeStyle(2, INK, 0.35);
    this.title = scene.add
      .text(24, 10, "", {
        fontFamily: "Libre Baskerville, serif",
        fontSize: "22px",
        color: "#2b2118",
        fontStyle: "italic",
      })
      .setOrigin(0, 0);
    this.ink = scene.add
      .text(24, 538, "", {
        fontFamily: "Caveat, cursive",
        fontSize: "22px",
        color: "#2b2118",
        wordWrap: { width: 780 },
      })
      .setOrigin(0, 0.5);
    this.toast = scene.add
      .text(512, 88, "", {
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
      .text(1000, 14, "", {
        fontFamily: "Caveat, cursive",
        fontSize: "20px",
        color: "#2b2118",
      })
      .setOrigin(1, 0);
    this.party = scene.add.container(760, 8);
    this.root.add([top, bottom, this.title, this.ink, this.toast, this.noise, this.party]);
    scene.add.rectangle(512, 2, 1024, 6, LETTERBOX, 0.35).setScrollFactor(0).setDepth(79);
    scene.add.rectangle(512, 574, 1024, 6, LETTERBOX, 0.35).setScrollFactor(0).setDepth(79);
  }

  setChapter(title: string, ink: string): void {
    this.title.setText(title);
    this.ink.setText(ink);
  }

  setObjective(text: string): void {
    this.ink.setText(text);
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
      const img = scene.add.image(index * 28, 10, `portrait-${id}`).setScale(0.45);
      img.setAlpha(unlocked ? (id === current ? 1 : 0.7) : 0.18);
      if (id === current) {
        const ring = scene.add.rectangle(index * 28, 10, 26, 26).setStrokeStyle(2, INK, 0.8);
        this.party.add(ring);
      }
      this.party.add(img);
    });
  }

  update(scene: Phaser.Scene): void {
    if (this.toastUntil && scene.time.now > this.toastUntil) {
      this.toast.setAlpha(0);
      this.toastUntil = 0;
    }
  }
}
