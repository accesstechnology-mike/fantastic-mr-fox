import type { ChapterDef, CharacterId, CutsceneScript } from "../types";

export const NEW_GAME_UNLOCKS: CharacterId[] = ["mrFox"];

export const TAIL_SHOT_CUTSCENE = "tail-shot";

export const CHAPTERS: ChapterDef[] = [
  {
    id: "intro",
    title: "The Three Farmers",
    kind: "cutscene",
    scene: "Story",
    cutsceneId: "intro",
    next: "wood",
    unlocks: [],
  },
  {
    id: "wood",
    title: "Mr Fox",
    kind: "play",
    scene: "Wood",
    next: "shooting",
    unlocks: [],
  },
  {
    id: "shooting",
    title: "The Shooting",
    kind: "cutscene",
    scene: "Story",
    cutsceneId: TAIL_SHOT_CUTSCENE,
    next: "shovels-open",
    unlocks: ["mrsFox"],
  },
  {
    id: "shovels-open",
    title: "The Terrible Shovels",
    kind: "cutscene",
    scene: "Story",
    cutsceneId: "shovels",
    next: "shovels",
    unlocks: [],
  },
  {
    id: "shovels",
    title: "The Terrible Shovels",
    kind: "play",
    scene: "Tunnels",
    next: "starvation",
    unlocks: ["smallFox"],
  },
  {
    id: "starvation",
    title: "Down in the Dark",
    kind: "play",
    scene: "Tunnels",
    next: "plan",
    unlocks: [],
  },
  {
    id: "plan",
    title: "A Most Excellent Plan",
    kind: "cutscene",
    scene: "Story",
    cutsceneId: "plan",
    next: "chicken-open",
    unlocks: [],
  },
  {
    id: "chicken-open",
    title: "Chicken House Number One",
    kind: "cutscene",
    scene: "Story",
    cutsceneId: "chicken-house",
    next: "chicken-house",
    unlocks: [],
  },
  {
    id: "chicken-house",
    title: "Among the Chickens",
    kind: "play",
    scene: "ChickenHouse",
    next: "store-open",
    unlocks: [],
  },
  {
    id: "store-open",
    title: "Bunce's Storehouse",
    kind: "cutscene",
    scene: "Story",
    cutsceneId: "storehouse",
    next: "storehouse",
    unlocks: [],
  },
  {
    id: "storehouse",
    title: "Ducks, Geese, and Worse",
    kind: "play",
    scene: "Storehouse",
    next: "cellar-open",
    unlocks: [],
  },
  {
    id: "cellar-open",
    title: "Bean's Secret Cider Cellar",
    kind: "cutscene",
    scene: "Story",
    cutsceneId: "cider-cellar",
    next: "cellar",
    unlocks: [],
  },
  {
    id: "cellar",
    title: "The Cider Below",
    kind: "play",
    scene: "Cellar",
    next: "feast-open",
    unlocks: [],
  },
  {
    id: "feast-open",
    title: "Fetch Them All",
    kind: "cutscene",
    scene: "Story",
    cutsceneId: "feast-brief",
    next: "feast",
    unlocks: [],
  },
  {
    id: "feast",
    title: "The Smallest Fox",
    kind: "play",
    scene: "Feast",
    next: "banquet",
    unlocks: [],
  },
  {
    id: "banquet",
    title: "The Great Feast",
    kind: "cutscene",
    scene: "Story",
    cutsceneId: "feast",
    next: "ending",
    unlocks: [],
  },
  {
    id: "ending",
    title: "Still Waiting",
    kind: "cutscene",
    scene: "Story",
    cutsceneId: "farmers-waiting",
    next: null,
    unlocks: ["boggis", "bunce", "bean"],
  },
];

export const CUTSCENES: Record<string, CutsceneScript> = {
  intro: {
    id: "intro",
    title: "The Three Farmers",
    panels: [
      {
        art: "panel-farms",
        caption:
          "On a hill lived three farmers, and none of them was the sort you would ask in for tea.",
        panX: 40,
        panY: 0,
        holdMs: 4200,
      },
      {
        art: "panel-boggis",
        caption:
          "Boggis was fat as a prize pig and kept more chickens than a Sunday could hold.",
        panX: -20,
        panY: 10,
        holdMs: 4000,
      },
      {
        art: "panel-bunce",
        caption:
          "Bunce was short and pot-bellied, with a yard full of ducks and geese and a face like sour apples.",
        panX: 24,
        panY: -8,
        holdMs: 4000,
      },
      {
        art: "panel-bean",
        caption:
          "Bean was thin as a rake. He kept turkeys, and he kept cider, and he kept his mouth in a hard line.",
        panX: 0,
        panY: 16,
        holdMs: 4000,
      },
      {
        art: "panel-fox-hill",
        caption:
          "Under the hill lived Mr Fox, who liked a proper supper and never, if he could help it, took too much from one plate.",
        panX: 30,
        panY: 8,
        holdMs: 4600,
      },
    ],
  },
  "tail-shot": {
    id: "tail-shot",
    title: "The Shooting",
    panels: [
      {
        art: "panel-ambush",
        caption:
          "They waited at the hole with guns like fence-posts, and the night held its breath.",
        panX: 18,
        panY: 0,
        holdMs: 4000,
      },
      {
        art: "panel-shot",
        caption:
          "Mr Fox came up for the evening's marketing. There was a crack that split the dark in two.",
        panX: -16,
        panY: 12,
        holdMs: 3800,
      },
      {
        art: "panel-tail",
        caption:
          "A handsome tail stayed behind on the grass. Mr Fox did not stay with it.",
        panX: 10,
        panY: -10,
        holdMs: 4000,
      },
      {
        art: "panel-pulled",
        caption:
          "Down in the den, Mrs Fox and the four Small Foxes seized his coat and hauled him home by the scruff of luck.",
        panX: 0,
        panY: 14,
        holdMs: 4600,
      },
    ],
  },
  shovels: {
    id: "shovels",
    title: "The Terrible Shovels",
    panels: [
      {
        art: "panel-spades",
        caption:
          "First came the spades, biting the hill as if it had insulted them.",
        panX: 20,
        panY: 0,
        holdMs: 3600,
      },
      {
        art: "panel-machines",
        caption:
          "Then came the mechanical shovels, great iron mouths that ate trees, earth, and the very shape of home.",
        panX: -28,
        panY: 8,
        holdMs: 4800,
      },
    ],
  },
  plan: {
    id: "plan",
    title: "A Most Excellent Plan",
    panels: [
      {
        art: "panel-starving",
        caption:
          "They had found Badger, and Mole, and Rabbit, and Weasel, all as hollow as winter pockets.",
        panX: 12,
        panY: 0,
        holdMs: 4000,
      },
      {
        art: "panel-plan",
        caption:
          "Mr Fox flicked the dust from his whiskers. 'They are sitting on our front door,' he said. 'So we shall use the cellars.'",
        panX: -8,
        panY: 10,
        holdMs: 4800,
      },
      {
        art: "panel-dig-farms",
        caption:
          "'Boggis, Bunce, and Bean will guard an empty hole. We shall dine beneath their floors.'",
        panX: 22,
        panY: -6,
        holdMs: 4400,
      },
    ],
  },
  "chicken-house": {
    id: "chicken-house",
    title: "Chicken House Number One",
    panels: [
      {
        art: "panel-chicken-door",
        caption:
          "The tunnel kissed the floorboards of Chicken House Number One. Above, plump shadows muttered in their sleep.",
        panX: 16,
        panY: 0,
        holdMs: 4200,
      },
      {
        art: "panel-chickens",
        caption:
          "Mr Fox whispered, 'Quiet as moths. We take what we need — and we take it home.'",
        panX: -12,
        panY: 8,
        holdMs: 4000,
      },
    ],
  },
  storehouse: {
    id: "storehouse",
    title: "Bunce's Storehouse",
    panels: [
      {
        art: "panel-store-door",
        caption:
          "Bunce's storehouse smelled of gravy and grudges. Ducks and geese hung like pale lanterns.",
        panX: 18,
        panY: -6,
        holdMs: 4200,
      },
      {
        art: "panel-hams",
        caption:
          "Badger's nose led them to the smoked things. 'Do not rattle the hooks,' he muttered, which is hard advice for a hungry badger.",
        panX: -20,
        panY: 10,
        holdMs: 4600,
      },
    ],
  },
  "cider-cellar": {
    id: "cider-cellar",
    title: "Bean's Secret Cider Cellar",
    panels: [
      {
        art: "panel-cellar-door",
        caption:
          "Bean's secret cellar lay under the turkey sheds, cool as a well and twice as tempting.",
        panX: 14,
        panY: 8,
        holdMs: 4200,
      },
      {
        art: "panel-cider",
        caption:
          "Barrels slept in rows. One good jug would make a feast remember itself for years.",
        panX: -16,
        panY: -8,
        holdMs: 4000,
      },
    ],
  },
  "feast-brief": {
    id: "feast-brief",
    title: "Fetch Them All",
    panels: [
      {
        art: "panel-smallest",
        caption:
          "Mr Fox looked down at the Smallest Fox. 'You are the right size for good news. Run and bring every family.'",
        panX: 10,
        panY: 0,
        holdMs: 4400,
      },
    ],
  },
  feast: {
    id: "feast",
    title: "The Great Feast",
    panels: [
      {
        art: "panel-dining",
        caption:
          "They had carved a dining hall in the belly of the hill, with seats for foxes, badgers, moles, rabbits, and weasels.",
        panX: 24,
        panY: 0,
        holdMs: 4400,
      },
      {
        art: "panel-feast",
        caption:
          "There was chicken, and duck, and goose, and turkey, and cider that made the lanterns look kinder.",
        panX: -14,
        panY: 12,
        holdMs: 4200,
      },
      {
        art: "panel-toast",
        caption:
          "Mr Fox stood — a little shorter now, at the back — and wished them all a home no shovel could find.",
        panX: 8,
        panY: -8,
        holdMs: 4600,
      },
    ],
  },
  "farmers-waiting": {
    id: "farmers-waiting",
    title: "Still Waiting",
    panels: [
      {
        art: "panel-waiting",
        caption:
          "Up above, Boggis, Bunce, and Bean sat by a hole that led nowhere, guns across their knees.",
        panX: 20,
        panY: 0,
        holdMs: 4400,
      },
      {
        art: "panel-rain",
        caption:
          "The hill was a ruin and the supper was gone, but they would not admit a fox had out-thought them.",
        panX: -18,
        panY: 10,
        holdMs: 4400,
      },
      {
        art: "panel-credits",
        caption:
          "They are waiting still. If you like, you may put on a farmer's boots and see how little the lantern knows.",
        panX: 0,
        panY: 0,
        holdMs: 5000,
      },
    ],
  },
};

export function chapterById(id: string): ChapterDef {
  const found = CHAPTERS.find((chapter) => chapter.id === id);
  if (!found) {
    throw new Error(`Missing chapter data: ${id}`);
  }
  return found;
}

export function cutsceneById(id: string): CutsceneScript {
  const found = CUTSCENES[id];
  if (!found) {
    throw new Error(`Missing cutscene data: ${id}`);
  }
  return found;
}

export const STEAL_RULE = {
  perFarmMax: 2,
  needEachFarm: 1,
  needTotal: 3,
  greedFailAt: 4,
} as const;

export const RAID_NEED = {
  chickenHouse: 3,
  storehouse: 3,
  cellar: 2,
} as const;

export const FEAST_FAMILIES = ["badger", "mole", "rabbit", "weasel"] as const;

export const FARMER_MODE = {
  foxEscapesToEnd: 3,
  foxSpeed: 170,
  holeSafeMs: 420,
} as const;

export const REQUIRED_CUTSCENES = [
  TAIL_SHOT_CUTSCENE,
  "shovels",
  "chicken-house",
  "storehouse",
  "cider-cellar",
  "feast",
  "farmers-waiting",
] as const;

export function assertStoryGraph(): void {
  const ids = new Set(CHAPTERS.map((chapter) => chapter.id));
  for (const chapter of CHAPTERS) {
    if (chapter.next && !ids.has(chapter.next)) {
      throw new Error(`Chapter ${chapter.id} points at missing next ${chapter.next}`);
    }
    if (chapter.kind === "cutscene") {
      if (!chapter.cutsceneId) {
        throw new Error(`Cutscene chapter missing script: ${chapter.id}`);
      }
      cutsceneById(chapter.cutsceneId);
    }
  }
  for (const id of REQUIRED_CUTSCENES) {
    cutsceneById(id);
  }
}
