import Phaser from "phaser";
import { generateAllTextures } from "../art/generateTextures";
import { assertAllLevels } from "../data/levels";
import { PAPER } from "../data/palette";
import { assertStoryGraph } from "../data/story";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  create(): void {
    this.cameras.main.setBackgroundColor(PAPER);
    const label = this.add
      .text(512, 288, "Mixing ink and water...", {
        fontFamily: "Caveat, cursive",
        fontSize: "36px",
        color: "#2b2118",
      })
      .setOrigin(0.5);
    assertStoryGraph();
    assertAllLevels();
    generateAllTextures(this);
    this.time.delayedCall(200, () => {
      label.destroy();
      this.scene.start("Menu");
    });
  }
}
