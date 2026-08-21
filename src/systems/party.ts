import { CHARACTERS, FARMERS, FOX_PARTY, SWITCH_SLOTS } from "../data/characters";
import type { CharacterId, CharacterStats, SqueezeKind } from "../types";
import { getSave } from "./save";

export function isUnlocked(id: CharacterId): boolean {
  return getSave().unlocked.includes(id);
}

export function unlockedIn(ids: CharacterId[]): CharacterId[] {
  return ids.filter((id) => isUnlocked(id));
}

export function playableNow(allowed: CharacterId[]): CharacterId[] {
  return unlockedIn(allowed);
}

export function statsOf(id: CharacterId): CharacterStats {
  const stats = CHARACTERS[id];
  if (!stats) {
    throw new Error(`Missing character stats: ${id}`);
  }
  return stats;
}

export function slotCharacter(index: number): CharacterId | null {
  const id = SWITCH_SLOTS[index];
  return id && isUnlocked(id) ? id : null;
}

export function cycleParty(
  current: CharacterId,
  allowed: CharacterId[],
  direction: 1 | -1,
): CharacterId {
  const pool = playableNow(allowed);
  if (pool.length === 0) {
    return current;
  }
  const here = pool.indexOf(current);
  const start = here === -1 ? 0 : here;
  return pool[(start + direction + pool.length) % pool.length];
}

export function canEnter(tile: string, squeeze: SqueezeKind): boolean {
  if (tile === "s") {
    return squeeze === "tight" || squeeze === "slim" || squeeze === "tiny";
  }
  if (tile === "w") {
    return squeeze === "slim" || squeeze === "tiny" || squeeze === "tight";
  }
  if (tile === "m") {
    return squeeze === "tiny";
  }
  return true;
}

export function partyKind(id: CharacterId): "fox" | "farmer" {
  return (FARMERS as readonly CharacterId[]).includes(id) ? "farmer" : "fox";
}

export function defaultFox(): CharacterId {
  const unlocked = unlockedIn(FOX_PARTY);
  return unlocked[0] ?? "mrFox";
}
