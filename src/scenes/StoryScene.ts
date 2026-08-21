import Phaser from "phaser";
import { INK, PAPER } from "../data/palette";
import { CHAPTERS, cutsceneById } from "../data/story";
import { finishChapter, noteCutscene } from "../systems/flow";
import type { CutsceneScript } from "../types";

export class StoryScene extends Phaser.Scene {
  private script!: CutsceneScript;
  private chapterId = "";
  private index = 0;
  private left = false;
  private image!: Phaser.GameObjects.Image;
  private caption!: Phaser.GameObjects.Text;
  private title!: Phaser.GameObjects.Text;
  private folio!: Phaser.GameObjects.Text;

  constructor() {
    super("Story");
  }

  init(data: { cutsceneId?: string }): void {
    const id = data.cutsceneId;
    if (!id) {
      throw new Error("Story scene needs a cutscene id from chapter data");
    }
    this.script = cutsceneById(id);
    const chapter = CHAPTERS.find((item) => item.cutsceneId === id);
    if (!chapter) {
      throw new Error(`No chapter points at cutscene ${id}`);
    }
    this.chapterId = chapter.id;
    this.index = 0;
    this.left = false;
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#ead9b2");
    this.add.image(512, 288, "paper-bg").setDisplaySize(1024, 576).setAlpha(0.45);
    this.add.rectangle(512, 288, 980, 540, PAPER, 0.42).setStrokeStyle(2, INK, 0.55);
    this.image = this.add.image(512, 248, this.script.panels[0].art).setDepth(2);
    this.image.setDisplaySize(900, 400);
    this.title = this.add
      .text(512, 28, this.script.title, {
        fontFamily: "Libre Baskerville, serif",
        fontSize: "26px",
        color: "#2b2118",
        fontStyle: "italic",
      })
      .setOrigin(0.5)
      .setDepth(6);
    this.caption = this.add
      .text(512, 478, "", {
        fontFamily: "Caveat, cursive",
        fontSize: "24px",
        color: "#2b2118",
        align: "center",
        wordWrap: { width: 860 },
      })
      .setOrigin(0.5, 0)
      .setDepth(6);
    this.folio = this.add
      .text(980, 548, "", {
        fontFamily: "Libre Baskerville, serif",
        fontSize: "14px",
        color: "#4a3b2a",
      })
      .setOrigin(1, 0.5)
      .setDepth(6);
    this.add
      .text(44, 548, "Click or Space turns the page · S skips the chapter", {
        fontFamily: "Caveat, cursive",
        fontSize: "18px",
        color: "#4a3b2a",
      })
      .setOrigin(0, 0.5)
      .setDepth(6);

    this.showPanel(0);
    this.input.keyboard?.on("keydown-SPACE", () => this.advance());
    this.input.keyboard?.on("keydown-S", () => this.leave());
    this.input.keyboard?.on("keydown-ESC", () => this.leave());
    this.input.on("pointerdown", () => this.advance());
  }

  private showPanel(index: number): void {
    const panel = this.script.panels[index];
    if (!panel) {
      this.leave();
      return;
    }
    this.image.setTexture(panel.art);
    this.image.setAlpha(0);
    this.image.setPosition(512 - panel.panX * 0.25, 248 - panel.panY * 0.2);
    this.caption.setText(panel.caption);
    this.title.setText(this.script.title);
    this.folio.setText(`${index + 1} / ${this.script.panels.length}`);
    this.tweens.add({
      targets: this.image,
      alpha: 1,
      x: 512 + panel.panX * 0.2,
      y: 248 + panel.panY * 0.15,
      duration: Math.min(panel.holdMs, 1800),
      ease: "Sine.easeInOut",
    });
    this.time.delayedCall(panel.holdMs + 200, () => {
      if (this.index === index) {
        this.advance();
      }
    });
  }

  private advance(): void {
    this.index += 1;
    if (this.index >= this.script.panels.length) {
      this.leave();
      return;
    }
    this.showPanel(this.index);
  }

  private leave(): void {
    if (this.left) {
      return;
    }
    this.left = true;
    noteCutscene(this.script.id);
    const next = finishChapter(this.chapterId);
    this.scene.start(next.scene, "cutsceneId" in next && next.cutsceneId ? { cutsceneId: next.cutsceneId } : undefined);
  }
}
