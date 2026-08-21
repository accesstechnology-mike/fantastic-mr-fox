import Phaser from "phaser";
import { CONTROL_INK } from "../data/dialogue";
import { INK, PAPER } from "../data/palette";
import { beginChapter } from "../systems/flow";
import { getSave, hasSave, startNewGame } from "../systems/save";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  create(): void {
    this.cameras.main.setBackgroundColor(PAPER);
    this.add.image(512, 288, "paper-bg").setDisplaySize(1024, 576).setAlpha(0.55);
    this.add
      .text(512, 88, "Fantastic Mr Fox", {
        fontFamily: "Libre Baskerville, serif",
        fontSize: "52px",
        color: "#2b2118",
        fontStyle: "italic",
      })
      .setOrigin(0.5);
    this.add
      .text(512, 148, "A picture-book raid, after Roald Dahl — not the film.", {
        fontFamily: "Caveat, cursive",
        fontSize: "26px",
        color: "#4a3b2a",
      })
      .setOrigin(0.5);

    const save = hasSave() ? getSave() : null;
    this.button(512, 240, "New Game", () => {
      startNewGame();
      this.go("intro");
    });
    if (save) {
      this.button(512, 310, "Continue", () => {
        this.go(save.chapterId);
      });
    }
    if (save?.farmerModeUnlocked) {
      this.button(512, 380, "Farmer Mode", () => {
        this.scene.start("FarmerMode");
      });
    }

    this.add
      .text(512, 500, CONTROL_INK, {
        fontFamily: "Caveat, cursive",
        fontSize: "22px",
        color: "#2b2118",
        align: "center",
        wordWrap: { width: 820 },
      })
      .setOrigin(0.5);
  }

  private button(x: number, y: number, label: string, onClick: () => void): void {
    const box = this.add.rectangle(x, y, 280, 48, PAPER, 0.96).setStrokeStyle(2, INK, 0.7).setInteractive({ useHandCursor: true });
    const text = this.add
      .text(x, y, label, {
        fontFamily: "Libre Baskerville, serif",
        fontSize: "22px",
        color: "#2b2118",
      })
      .setOrigin(0.5);
    box.on("pointerover", () => box.setStrokeStyle(3, INK, 1));
    box.on("pointerout", () => box.setStrokeStyle(2, INK, 0.7));
    box.on("pointerdown", onClick);
    text.setInteractive({ useHandCursor: true }).on("pointerdown", onClick);
  }

  private go(chapterId: string): void {
    const jump = beginChapter(chapterId);
    this.scene.start(jump.scene, jump.cutsceneId ? { cutsceneId: jump.cutsceneId } : undefined);
  }
}
