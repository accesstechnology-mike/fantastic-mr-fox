import { tunnelsChapterId, tunnelsLevelId } from "../systems/flow";
import { LevelScene } from "./LevelScene";

export class TunnelsScene extends LevelScene {
  constructor() {
    super("Tunnels", "siege", "shovels");
  }

  create(): void {
    this.levelId = tunnelsLevelId();
    this.chapterId = tunnelsChapterId();
    super.create();
  }
}
