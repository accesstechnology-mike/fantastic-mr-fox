import { NEW_GAME_UNLOCKS } from "../data/story";
import type { CharacterId, SaveData } from "../types";
import { SAVE_KEY } from "../types";

export function blankSave(): SaveData {
  return {
    version: 1,
    chapterId: "intro",
    unlocked: [...NEW_GAME_UNLOCKS],
    seenCutscenes: [],
    farmerModeUnlocked: false,
    raids: {
      chickenHouse: false,
      storehouse: false,
      cellar: false,
    },
    found: {
      badger: false,
      mole: false,
      rabbit: false,
      weasel: false,
    },
    feastInvited: [],
    siegeComplete: false,
    woodComplete: false,
    gameComplete: false,
  };
}

function isSaveData(value: unknown): value is SaveData {
  if (!value || typeof value !== "object") {
    return false;
  }
  const data = value as SaveData;
  return data.version === 1 && typeof data.chapterId === "string" && Array.isArray(data.unlocked);
}

export function loadSave(): SaveData | null {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isSaveData(parsed)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeSave(data: SaveData): SaveData {
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  return data;
}

export function hasSave(): boolean {
  return loadSave() !== null;
}

export function startNewGame(): SaveData {
  return writeSave(blankSave());
}

export function getSave(): SaveData {
  return loadSave() ?? startNewGame();
}

export function patchSave(partial: Partial<SaveData>): SaveData {
  return writeSave({ ...getSave(), ...partial });
}

export function unlockCharacters(ids: CharacterId[]): SaveData {
  const save = getSave();
  const unlocked = [...save.unlocked];
  for (const id of ids) {
    if (!unlocked.includes(id)) {
      unlocked.push(id);
    }
  }
  return patchSave({ unlocked });
}

export function markCutsceneSeen(id: string): SaveData {
  const save = getSave();
  if (save.seenCutscenes.includes(id)) {
    return save;
  }
  return patchSave({ seenCutscenes: [...save.seenCutscenes, id] });
}

export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY);
}
