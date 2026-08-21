import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { CellarScene } from "./scenes/CellarScene";
import { ChickenHouseScene } from "./scenes/ChickenHouseScene";
import { FarmerModeScene } from "./scenes/FarmerModeScene";
import { FeastScene } from "./scenes/FeastScene";
import { MenuScene } from "./scenes/MenuScene";
import { StorehouseScene } from "./scenes/StorehouseScene";
import { StoryScene } from "./scenes/StoryScene";
import { TunnelsScene } from "./scenes/TunnelsScene";
import { WoodScene } from "./scenes/WoodScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#ead9b2",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1024,
    height: 576,
  },
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
  scene: [
    BootScene,
    MenuScene,
    StoryScene,
    WoodScene,
    TunnelsScene,
    ChickenHouseScene,
    StorehouseScene,
    CellarScene,
    FeastScene,
    FarmerModeScene,
  ],
};

export const game = new Phaser.Game(config);
