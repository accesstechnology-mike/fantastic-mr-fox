import { TAIL_SHOT_CUTSCENE } from "../data/story";
import type { CharacterId } from "../types";
import { getSave } from "../systems/save";

export function mrFoxLostTail(): boolean {
  const save = getSave();
  return save.seenCutscenes.includes(TAIL_SHOT_CUTSCENE) || save.siegeComplete || save.gameComplete;
}

export function characterTexture(id: CharacterId): string {
  if (id === "mrFox" && mrFoxLostTail()) {
    return "char-mrFox-notail";
  }
  return `char-${id}`;
}

export function portraitTexture(id: CharacterId): string {
  if (id === "mrFox" && mrFoxLostTail()) {
    return "portrait-mrFox-notail";
  }
  return `portrait-${id}`;
}
