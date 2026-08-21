import { chapterById } from "../data/story";
import type { SceneKey } from "../types";
import { getSave, markCutsceneSeen, patchSave, unlockCharacters } from "./save";

export interface SceneJump {
  scene: SceneKey;
  cutsceneId?: string;
}

export function jumpForChapter(chapterId: string): SceneJump {
  const chapter = chapterById(chapterId);
  if (chapter.kind === "cutscene") {
    if (!chapter.cutsceneId) {
      throw new Error(`Cutscene chapter missing script: ${chapterId}`);
    }
    return { scene: "Story", cutsceneId: chapter.cutsceneId };
  }
  return { scene: chapter.scene };
}

export function beginChapter(chapterId: string): SceneJump {
  patchSave({ chapterId });
  return jumpForChapter(chapterId);
}

export function finishChapter(chapterId: string): SceneJump | { scene: "Menu" } {
  const chapter = chapterById(chapterId);
  unlockCharacters(chapter.unlocks);
  const save = getSave();

  if (chapterId === "wood") {
    patchSave({ woodComplete: true });
  }
  if (chapterId === "shovels") {
    patchSave({ siegeComplete: true });
  }
  if (chapterId === "chicken-house") {
    patchSave({ raids: { ...save.raids, chickenHouse: true } });
  }
  if (chapterId === "storehouse") {
    patchSave({ raids: { ...save.raids, storehouse: true } });
  }
  if (chapterId === "cellar") {
    patchSave({ raids: { ...save.raids, cellar: true } });
  }
  if (chapterId === "ending") {
    patchSave({
      farmerModeUnlocked: true,
      gameComplete: true,
      chapterId: "ending",
    });
    unlockCharacters(["boggis", "bunce", "bean"]);
    return { scene: "Menu" };
  }

  if (!chapter.next) {
    return { scene: "Menu" };
  }
  return beginChapter(chapter.next);
}

export function noteCutscene(id: string): void {
  markCutsceneSeen(id);
}

export function tunnelsLevelId(): "siege" | "starvation" {
  return getSave().siegeComplete ? "starvation" : "siege";
}

export function tunnelsChapterId(): "shovels" | "starvation" {
  return getSave().siegeComplete ? "starvation" : "shovels";
}
