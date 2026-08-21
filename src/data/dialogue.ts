import type { CharacterId } from "../types";

export const TOASTS = {
  spotted: "A lantern pinned you to the grass. The bag is empty again.",
  greedWarn: "Not all from one farm, Mr Fox. The others will notice.",
  greedFail: "Too much from one yard. The guns woke early.",
  surface: "The hill opened like a mouth. Keep below the iron.",
  unlocked: (name: string) => `${name} is with you now.`,
  switchDenied: "That body will not fit. Stay as you are.",
  heavy: "Pockets full. Carry it home, then come back.",
  deposited: "Down the hole it went, toward a better table.",
  collapse: "A beam coughed and the dark came closer.",
  caughtFox: "Luck, not wisdom. One fox in the lantern — the rest still feast.",
  foxGone: "A flash of rust, then only the hole.",
} as const;

export const MEET_LINES: Record<"badger" | "mole" | "rabbit" | "weasel" | "mrsFox", string> = {
  mrsFox: "Mrs Fox kept the cubs in the dark and her voice very steady. 'We follow you. We always have.'",
  badger: "Badger sat like a stone that had learned to starve. 'If you have a plan, Fox, it had better involve dinner.'",
  mole: "Mole's eyes were little lamps. 'I can see the way. The way is smaller than you.'",
  rabbit: "Rabbit's ears stood like two warnings. 'I heard their boots an hour ago. I can hear them still.'",
  weasel: "Weasel smiled with too many teeth. 'I can go where the air is thin. I make no more noise than a thought.'",
};

export const INVITE_LINES: Record<"badger" | "mole" | "rabbit" | "weasel", string> = {
  badger: "The Smallest Fox bowed — a little. 'Supper is carved. Bring every badger who can still walk.'",
  mole: "'There is a hall,' said the Smallest Fox, 'and it is dark enough even for you.'",
  rabbit: "'Come quickly. The table is long and the farmers are still sitting on a mistake.'",
  weasel: "'If you like cider and company, follow the smallest pair of feet.'",
};

export const CONTROL_INK = [
  "Arrows or WASD to move. Hold Shift to sneak.",
  "E to take, talk, or send food down the hole. Space to dig.",
  "Click a face, or 1–9 / [ ] / Tab, to play someone you have met.",
].join(" ");

export function abilityInk(id: CharacterId): string {
  const lines: Record<CharacterId, string> = {
    mrFox: "Mr Fox marks the sensible path and carries a proper armful.",
    mrsFox: "Mrs Fox makes every lantern cone tell the truth.",
    smallFox: "The Smallest Fox slips through the tight places.",
    badger: "Badger tears earth and rubble as if they owed him money.",
    mole: "Mole treats the dark as furniture and the pin-holes as halls.",
    rabbit: "Rabbit hears a patrol before the grass does.",
    weasel: "Weasel is a quiet ribbon through slim gaps.",
    boggis: "Boggis brings a wide, well-fed lantern.",
    bunce: "Bunce hurries on short legs and a shorter temper.",
    bean: "Bean's light is a rake. It reaches far and misses much.",
  };
  return lines[id];
}
