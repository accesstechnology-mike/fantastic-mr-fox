import type { CharacterId, FarmId, FarmYard, FoodDef, LevelDef, LevelObjective, PatrolDef, WorldLabel } from "../types";
import { CHARACTERS, FOX_PARTY } from "./characters";
import { FARMER_MODE, RAID_NEED, STEAL_RULE } from "./story";
import { fillRect, makeRows, normalizeRows, put, stampPatch, strokeRect } from "./buildMap";

const BOGGIS_YARD: FarmYard = { farm: "boggis", x: 4, y: 5, w: 16, h: 11 };
const BUNCE_YARD: FarmYard = { farm: "bunce", x: 28, y: 6, w: 14, h: 10 };
const BEAN_YARD: FarmYard = { farm: "bean", x: 50, y: 4, w: 18, h: 13 };
const WOOD_YARDS: FarmYard[] = [BOGGIS_YARD, BUNCE_YARD, BEAN_YARD];
const WOOD_HOLE = { x: 36, y: 34 };
const WOOD_SPAWN = { x: 36, y: 33 };

function foodKindsAt(foods: FoodDef[], farm: FarmId): string {
  const kinds = [...new Set(foods.filter((food) => food.farm === farm).map((food) => food.kind))];
  if (kinds.length === 0) {
    throw new Error(`Cannot label ${farm}: that farm has no food on this map`);
  }
  return kinds.join(" · ");
}

function farmLabels(foods: FoodDef[], yards: FarmYard[], hole: { x: number; y: number }): WorldLabel[] {
  return [
    ...yards.map((yard) => ({
      x: yard.x + Math.floor(yard.w / 2),
      y: yard.y + yard.h,
      title: `${CHARACTERS[yard.farm].name}'s farm`,
      subtitle: foodKindsAt(foods, yard.farm),
    })),
    {
      x: hole.x,
      y: hole.y + 2,
      title: `${CHARACTERS.mrFox.name}'s hole`,
      subtitle: "send supper down here",
    },
  ];
}

const emptyMarks = { labels: [] as WorldLabel[], yards: [] as FarmYard[] };

const stealGoal: LevelObjective = {
  kind: "stealVariety",
  stolenPerFarmMax: STEAL_RULE.perFarmMax,
  needEachFarm: STEAL_RULE.needEachFarm,
  needTotal: STEAL_RULE.needTotal,
  depositAt: "hole",
  inviteNeed: 0,
  foxEscapes: 0,
};

const reachDen: LevelObjective = {
  kind: "reachDen",
  stolenPerFarmMax: 0,
  needEachFarm: 0,
  needTotal: 0,
  depositAt: "den",
  inviteNeed: 0,
  foxEscapes: 0,
};

const meetAnimals: LevelObjective = {
  kind: "meetAnimals",
  stolenPerFarmMax: 0,
  needEachFarm: 0,
  needTotal: 0,
  depositAt: "den",
  inviteNeed: 0,
  foxEscapes: 0,
};

function deposit(need: number): LevelObjective {
  return {
    kind: "depositFood",
    stolenPerFarmMax: 0,
    needEachFarm: 0,
    needTotal: need,
    depositAt: "hole",
    inviteNeed: 0,
    foxEscapes: 0,
  };
}

const inviteAll: LevelObjective = {
  kind: "inviteFamilies",
  stolenPerFarmMax: 0,
  needEachFarm: 0,
  needTotal: 0,
  depositAt: "dining",
  inviteNeed: 4,
  foxEscapes: 0,
};

const farmerWatch: LevelObjective = {
  kind: "farmerWatch",
  stolenPerFarmMax: 0,
  needEachFarm: 0,
  needTotal: 0,
  depositAt: "hole",
  inviteNeed: 0,
  foxEscapes: FARMER_MODE.foxEscapesToEnd,
};

function foxAllowed(extra: CharacterId[] = []): CharacterId[] {
  return [...FOX_PARTY.filter((id) => id !== "boggis"), ...extra];
}

function buildWoodRows(): string[] {
  const width = 72;
  const height = 40;
  const rows = makeRows(width, height, ".");
  fillRect(rows, 0, 0, width, 3, "#");
  fillRect(rows, 0, 0, 2, height, "#");
  fillRect(rows, width - 2, 0, 2, height, "#");
  fillRect(rows, 0, height - 2, width, 2, "#");

  const trees = [
    [8, 20],
    [12, 24],
    [18, 22],
    [22, 28],
    [26, 21],
    [40, 23],
    [46, 27],
    [50, 20],
    [58, 24],
    [64, 22],
    [33, 18],
    [6, 32],
    [14, 34],
    [60, 33],
    [67, 30],
  ];
  for (const [x, y] of trees) {
    stampPatch(rows, x, y, 2, "#");
  }

  const grasses = [
    [20, 18],
    [24, 16],
    [36, 20],
    [44, 17],
    [48, 19],
    [10, 28],
    [54, 28],
    [30, 30],
    [38, 32],
  ];
  for (const [x, y] of grasses) {
    stampPatch(rows, x, y, 2, ",");
  }

  strokeRect(rows, BOGGIS_YARD.x, BOGGIS_YARD.y, BOGGIS_YARD.w, BOGGIS_YARD.h, "R");
  fillRect(rows, 5, 6, 14, 9, "_");
  strokeRect(rows, 6, 7, 5, 4, "R");
  fillRect(rows, 7, 8, 3, 2, "_");
  put(rows, 8, 10, ".");
  strokeRect(rows, 12, 7, 6, 5, "R");
  fillRect(rows, 13, 8, 4, 3, "_");

  strokeRect(rows, BUNCE_YARD.x, BUNCE_YARD.y, BUNCE_YARD.w, BUNCE_YARD.h, "R");
  fillRect(rows, 29, 7, 12, 8, "_");
  strokeRect(rows, 30, 8, 5, 4, "R");
  fillRect(rows, 31, 9, 3, 2, "_");
  strokeRect(rows, 36, 8, 5, 5, "R");
  fillRect(rows, 37, 9, 3, 3, "_");

  strokeRect(rows, BEAN_YARD.x, BEAN_YARD.y, BEAN_YARD.w, BEAN_YARD.h, "R");
  fillRect(rows, 51, 5, 16, 11, "_");
  strokeRect(rows, 52, 6, 6, 6, "R");
  fillRect(rows, 53, 7, 4, 4, "_");
  strokeRect(rows, 60, 6, 6, 5, "R");
  fillRect(rows, 61, 7, 4, 3, "_");
  strokeRect(rows, 60, 12, 5, 4, "R");
  fillRect(rows, 61, 13, 3, 2, "_");

  stampPatch(rows, 36, 34, 4, "#", ["+"]);
  fillRect(rows, 33, 32, 7, 5, ",");
  fillRect(rows, 34, 33, 5, 3, ".");
  put(rows, 36, 34, "+");

  for (const yard of WOOD_YARDS) {
    const gx = yard.x + Math.floor(yard.w / 2);
    const gy = yard.y + yard.h - 1;
    fillRect(rows, gx - 1, gy, 3, 1, ".");
    fillRect(rows, gx - 1, gy + 1, 3, 12, ",");
  }
  put(rows, 8, 10, ".");
  put(rows, 14, 11, ".");
  put(rows, 32, 11, ".");
  put(rows, 38, 12, ".");
  put(rows, 54, 11, ".");
  put(rows, 62, 10, ".");
  put(rows, 62, 15, ".");
  return rows;
}

const woodFoods: FoodDef[] = [
  { id: "ch1", kind: "chicken", farm: "boggis", x: 8, y: 8 },
  { id: "ch2", kind: "chicken", farm: "boggis", x: 14, y: 9 },
  { id: "ch3", kind: "chicken", farm: "boggis", x: 15, y: 12 },
  { id: "ch4", kind: "chicken", farm: "boggis", x: 7, y: 13 },
  { id: "ch5", kind: "chicken", farm: "boggis", x: 10, y: 11 },
  { id: "du1", kind: "duck", farm: "bunce", x: 31, y: 10 },
  { id: "du2", kind: "duck", farm: "bunce", x: 38, y: 10 },
  { id: "go1", kind: "goose", farm: "bunce", x: 32, y: 13 },
  { id: "go2", kind: "goose", farm: "bunce", x: 39, y: 13 },
  { id: "tu1", kind: "turkey", farm: "bean", x: 54, y: 8 },
  { id: "tu2", kind: "turkey", farm: "bean", x: 62, y: 8 },
  { id: "tu3", kind: "turkey", farm: "bean", x: 55, y: 12 },
  { id: "ci1", kind: "cider", farm: "bean", x: 62, y: 14 },
  { id: "ci2", kind: "cider", farm: "bean", x: 63, y: 13 },
];

const woodPatrols: PatrolDef[] = [
  {
    id: "boggis-yard",
    farmer: "boggis",
    speed: 62,
    waypoints: [
      { x: 6, y: 14, waitMs: 700 },
      { x: 17, y: 14, waitMs: 400 },
      { x: 17, y: 6, waitMs: 500 },
      { x: 6, y: 6, waitMs: 600 },
    ],
  },
  {
    id: "bunce-yard",
    farmer: "bunce",
    speed: 70,
    waypoints: [
      { x: 29, y: 14, waitMs: 500 },
      { x: 40, y: 14, waitMs: 400 },
      { x: 40, y: 7, waitMs: 500 },
      { x: 29, y: 7, waitMs: 500 },
    ],
  },
  {
    id: "bean-long",
    farmer: "bean",
    speed: 78,
    waypoints: [
      { x: 51, y: 15, waitMs: 400 },
      { x: 66, y: 15, waitMs: 300 },
      { x: 66, y: 5, waitMs: 400 },
      { x: 51, y: 5, waitMs: 350 },
      { x: 58, y: 18, waitMs: 800 },
    ],
  },
];

export const woodLevel: LevelDef = {
  id: "wood",
  title: "A Night Among Three Farms",
  ink: "Take a little from each. Greed at one door wakes the guns.",
  ambient: "night",
  tileSize: 26,
  rows: buildWoodRows(),
  spawn: WOOD_SPAWN,
  hole: WOOD_HOLE,
  patrols: woodPatrols,
  foods: woodFoods,
  npcs: [],
  cubs: [],
  labels: farmLabels(woodFoods, WOOD_YARDS, WOOD_HOLE),
  yards: WOOD_YARDS,
  collapseY: -1,
  objective: stealGoal,
  allowed: ["mrFox"],
  darkness: 0.35,
};

const siegeRows = normalizeRows(`
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
^^^^^%%%%%%%%%%%^^^^%%%%%%%%%%%^^^^%%%%%%%%%%%^^^^
^^^^%%%.....%%%%%%%.....%%%%%%%.....%%%%%%%^^^^^^^
R%%%.........%.....................%.........%%%R
R%%..........%........+............%..........%%R
R%...........%%...................%%...........%R
R%%%%%........%%%%%%%%%%%%%%%%%%%%%........%%%%%R
RRR%%%........%%%RRRRRRRRRRRRR%%%........%%%RRRR
RR%%%%........%%%R...........R%%%........%%%%RRR
R%%%%%ssss....%%%R...........R%%%....wwww%%%%%R
R%%%%%..........%%...........%%..........%%%%%R
R%%%%%%.........%%....DDD....%%.........%%%%%%R
R%%%%%%%........%%....DDD....%%........%%%%%%%R
RR%%%%%%%.......%%....DDD....%%.......%%%%%%%RR
RRR%%%%%%%......%%%%%%%%%%%%%.......%%%%%%%RRR
RRRR%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%RRRR
RRRRRR%%%%%%%%%RRRRRRRRRRRRRR%%%%%%%%%RRRRRRRR
RRRR%%%%%................................%%%%%RR
RRR%%%%.............%RRRR%...............%%%%RRR
RR%%%%..............%RRRR%................%%%%RR
R%%%%.....%%%%%%....%RRRR%....%%%%%%.......%%%%R
R%%%......%RRRR%....%%%%%%....%RRRR%........%%%R
R%%%......%RRRR%..............%RRRR%........%%%R
R%%%%.....%%%%%%..............%%%%%%.......%%%%R
R%%%%%....................................%%%%%R
RR%%%%%..............................B...%%%%%RR
RRR%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%RRR
RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
`);

export const siegeLevel: LevelDef = {
  id: "siege",
  title: "The Hill Comes Down",
  ink: "The surface is death. Dig. When the earth pinches, send the smallest.",
  ambient: "tunnel",
  tileSize: 24,
  rows: siegeRows,
  spawn: { x: 24, y: 5 },
  hole: { x: 24, y: 5 },
  patrols: [],
  foods: [],
  npcs: [{ id: "mrsFox", x: 23, y: 13, label: "Mrs Fox" }],
  cubs: [
    { x: 22, y: 13 },
    { x: 24, y: 13 },
    { x: 25, y: 14 },
    { x: 21, y: 14 },
  ],
  labels: [
    { x: 24, y: 7, title: "Dig down", subtitle: "hold Space — the grass above kills" },
    { x: 24, y: 13, title: "The den", subtitle: "click Mrs Fox or a cub to play as them" },
  ],
  yards: [],
  collapseY: 1,
  objective: reachDen,
  allowed: ["mrFox", "mrsFox", "smallFox"],
  darkness: 0.55,
};

const starveRows = normalizeRows(`
RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
R%%%%%%%%%%%%%%%%%%%%%%%%^^^^^%%%%%%%%%%%%%%%%%%%%%%%R
R%%......................^^^^^.....................%%R
R%%.....%%%%%%%%%%%%.....^^^^^.....%%%%%%%%%%%%....%%R
R%%.....%%RRRRRR%%.......%%%%%.......%%RRRRRR%%....%%R
R%%.....%%R....R%%.....................%%R....R%%....%%R
R%%..sss%%R.D..R%%.........DDD.........%%R.D..R%%..ww%%R
R%%.....%%R....R%%.........DDD.........%%R....R%%....%%R
R%%.....%%RR++RR%%.........DDD.........%%RR++RR%%....%%R
R%%.....%%%%%%%%%%%%.......+++.......%%%%%%%%%%%%....%%R
R%%..................................................%%R
R%%.........mmm.........................www..........%%R
R%%.........m%m.........................w%w..........%%R
R%%%%%......m%m........%%%%%%%%%........w%w......%%%%%R
R%%%%.......mmm........%RRRRRRR%........www.......%%%%R
R%%%...................%R.....R%...................%%%R
R%%%.....%%%%%%........%R..H..R%........%%%%%%.....%%%R
R%%%.....%%RR%%........%R.....R%........%%RR%%.....%%%R
R%%%.....%%R.%%........%%+++++%%........%%.R%%.....%%%R
R%%%..mmm%%R.%%.........................%%.R%%..www%%%R
R%%%.....%%RR%%........%%%%%%%%%........%%RR%%.....%%%R
R%%%.....%%%%%%.........................%%%%%%.....%%%R
R%%%%.............................................%%%%R
R%%%%%....B.................................B....%%%%%R
RR%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%RR
RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
`);

export const starvationLevel: LevelDef = {
  id: "starvation",
  title: "Hollow Neighbours",
  ink: "Find Badger, Mole, Rabbit, and Weasel. A plan needs a party.",
  ambient: "tunnel",
  tileSize: 24,
  rows: starveRows,
  spawn: { x: 26, y: 7 },
  hole: { x: 26, y: 8 },
  patrols: [],
  foods: [],
  npcs: [
    { id: "mrsFox", x: 26, y: 6, label: "Mrs Fox" },
    { id: "badger", x: 11, y: 6, label: "Badger" },
    { id: "rabbit", x: 42, y: 6, label: "Rabbit" },
    { id: "mole", x: 10, y: 18, label: "Mole" },
    { id: "weasel", x: 43, y: 18, label: "Weasel" },
  ],
  cubs: [
    { x: 25, y: 7 },
    { x: 27, y: 7 },
    { x: 24, y: 8 },
    { x: 28, y: 8 },
  ],
  ...emptyMarks,
  collapseY: -1,
  objective: meetAnimals,
  allowed: foxAllowed(),
  darkness: 0.62,
};

const chickenRows = normalizeRows(`
RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
R______________________________________R
R__#####________#####________#####_____R
R__#___#________#___#________#___#_____R
R__#___#___ss___#___#________#___#_____R
R__###.#________###.#________###.#_____R
R......................................R
R____,,,,____________________,,,,______R
R......................................R
R__#####________#####B_B#####__________R
R__#___#________#_________#____________R
R__#___#___ww___#_________#____mmm_____R
R__###.#________#####.#####____________R
R......................................R
R%%%%%%%%%%%%%%%.....+.....%%%%%%%%%%%%R
RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
`);

export const chickenLevel: LevelDef = {
  id: "chicken-house",
  title: "Chicken House Number One",
  ink: "The farmers wait at the hole. Noise still topples a roost.",
  ambient: "interior",
  tileSize: 26,
  rows: chickenRows,
  spawn: { x: 20, y: 14 },
  hole: { x: 20, y: 14 },
  patrols: [],
  foods: [
    { id: "c1", kind: "chicken", farm: "boggis", x: 5, y: 3 },
    { id: "c2", kind: "chicken", farm: "boggis", x: 6, y: 4 },
    { id: "c3", kind: "chicken", farm: "boggis", x: 16, y: 3 },
    { id: "c4", kind: "chicken", farm: "boggis", x: 17, y: 4 },
    { id: "c5", kind: "chicken", farm: "boggis", x: 28, y: 3 },
    { id: "c6", kind: "chicken", farm: "boggis", x: 29, y: 4 },
    { id: "c7", kind: "chicken", farm: "boggis", x: 5, y: 11 },
    { id: "c8", kind: "chicken", farm: "boggis", x: 6, y: 11 },
  ],
  npcs: [],
  cubs: [],
  ...emptyMarks,
  collapseY: -1,
  objective: deposit(RAID_NEED.chickenHouse),
  allowed: foxAllowed(),
  darkness: 0.28,
};

const storeRows = normalizeRows(`
RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
R________________________________________R
R__HH____HH____HH______####______HH______R
R______________________#__#______________R
R____,,,,__________ss__#__#___ww_________R
R______________________##.#______________R
R__#####________#####____________________R
R__#___#________#___#______B___B_________R
R__#___#________#___#____________________R
R__###.#________###.#_____######_________R
R.........................#____#_________R
R____~~~~_________________#____#____mmm__R
R.........................###.##_________R
R%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%R
R%%%%%%%%%%%%%%%.....+.....%%%%%%%%%%%%%%R
RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
`);

export const storeLevel: LevelDef = {
  id: "storehouse",
  title: "Bunce's Storehouse",
  ink: "Hooks rattle. Carry the hanging supper home, not the whole shop.",
  ambient: "interior",
  tileSize: 26,
  rows: storeRows,
  spawn: { x: 21, y: 14 },
  hole: { x: 21, y: 14 },
  patrols: [],
  foods: [
    { id: "d1", kind: "duck", farm: "bunce", x: 4, y: 2 },
    { id: "d2", kind: "duck", farm: "bunce", x: 9, y: 2 },
    { id: "g1", kind: "goose", farm: "bunce", x: 14, y: 2 },
    { id: "h1", kind: "ham", farm: "bunce", x: 30, y: 2 },
    { id: "h2", kind: "ham", farm: "bunce", x: 6, y: 7 },
    { id: "d3", kind: "duck", farm: "bunce", x: 16, y: 7 },
    { id: "g2", kind: "goose", farm: "bunce", x: 28, y: 10 },
  ],
  npcs: [],
  cubs: [],
  ...emptyMarks,
  collapseY: -1,
  objective: deposit(RAID_NEED.storehouse),
  allowed: foxAllowed(),
  darkness: 0.4,
};

const cellarRows = normalizeRows(`
RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
R~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~R
R~~####~~~~####~~~~####~~~~####~~~~~~R
R~~#__#~~~~#__#~~~~#__#~~~~#__#~~~~~~R
R~~#__#~~~~#__#~~~~#__#~~~~#__#~~~~~~R
R~~##.#~~~~##.#~~~~##.#~~~~##.#~~~~~~R
R~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~R
R~~~~ss~~~~~~~~~~ww~~~~~~~~~~mmm~~~~~R
R~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~R
R~~####~~~~BBBB~~~~####~~~~~~~~~~~~~~R
R~~#__#~~~~~~~~~~~~#__#~~~~~~~~~~~~~~R
R~~#__#~~~~%%%%~~~~#__#~~~~~~~~~~~~~~R
R~~##.#~~~~%++%~~~~##.#~~~~~~~~~~~~~~R
R~~~~~~~~~~%++%~~~~~~~~~~~~~~~~~~~~~~R
R%%%%%%%%%%++++%%%%%%%%%%%%%%%%%%%%%%R
RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
`);

export const cellarLevel: LevelDef = {
  id: "cellar",
  title: "Bean's Secret Cider Cellar",
  ink: "The floor is cider-slick. A jug is heavy. The barrels will not keep a secret if you run.",
  ambient: "interior",
  tileSize: 26,
  rows: cellarRows,
  spawn: { x: 12, y: 13 },
  hole: { x: 12, y: 12 },
  patrols: [],
  foods: [
    { id: "cd1", kind: "cider", farm: "bean", x: 5, y: 3 },
    { id: "cd2", kind: "cider", farm: "bean", x: 12, y: 3 },
    { id: "cd3", kind: "cider", farm: "bean", x: 19, y: 3 },
    { id: "cd4", kind: "cider", farm: "bean", x: 26, y: 3 },
    { id: "cd5", kind: "cider", farm: "bean", x: 5, y: 10 },
    { id: "cd6", kind: "cider", farm: "bean", x: 21, y: 10 },
  ],
  npcs: [],
  cubs: [],
  ...emptyMarks,
  collapseY: -1,
  objective: deposit(RAID_NEED.cellar),
  allowed: foxAllowed(),
  darkness: 0.48,
};

const feastRows = normalizeRows(`
RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
R................................................R
R...######........................######.........R
R...#....#........................#....#.........R
R...#....#........................#....#.........R
R...##++##........................##++##.........R
R................................................R
R................HHHHHHHHHH......................R
R................HTTTTTTTTH......................R
R................HTTTTTTTTH......................R
R................HHHH++HHHH......................R
R................................................R
R...######........................######.........R
R...#....#........................#....#.........R
R...#....#........................#....#.........R
R...##++##........................##++##.........R
R................................................R
R%%%%%%%%%%%%%%%%+++++%%%%%%%%%%%%%%%%%%%%%%%%%%%R
RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
`);

export const feastLevel: LevelDef = {
  id: "feast",
  title: "Call Them to Table",
  ink: "You are the Smallest Fox. Knock at every door, then bring them to the carved hall.",
  ambient: "feast",
  tileSize: 24,
  rows: feastRows,
  spawn: { x: 24, y: 10 },
  hole: { x: 24, y: 10 },
  patrols: [],
  foods: [],
  npcs: [
    { id: "badger", x: 6, y: 3, label: "Badger's family" },
    { id: "rabbit", x: 40, y: 3, label: "Rabbit's family" },
    { id: "mole", x: 6, y: 13, label: "Mole's family" },
    { id: "weasel", x: 40, y: 13, label: "Weasel's family" },
  ],
  cubs: [
    { x: 22, y: 8 },
    { x: 26, y: 8 },
    { x: 23, y: 9 },
    { x: 25, y: 9 },
  ],
  ...emptyMarks,
  collapseY: -1,
  objective: inviteAll,
  allowed: ["smallFox"],
  forceCharacter: "smallFox",
  darkness: 0.22,
};

export const farmerLevel: LevelDef = {
  id: "farmer-mode",
  title: "The Lanterns Lose",
  ink: "You have the guns and the light. They have the hill. It will not be fair.",
  ambient: "night",
  tileSize: 26,
  rows: buildWoodRows(),
  spawn: { x: 36, y: 30 },
  hole: WOOD_HOLE,
  patrols: [],
  foods: woodFoods,
  npcs: [],
  cubs: [],
  labels: farmLabels(woodFoods, WOOD_YARDS, WOOD_HOLE),
  yards: WOOD_YARDS,
  collapseY: -1,
  objective: farmerWatch,
  allowed: ["boggis", "bunce", "bean"],
  darkness: 0.4,
};

export const LEVELS: Record<string, LevelDef> = {
  wood: woodLevel,
  siege: siegeLevel,
  starvation: starvationLevel,
  "chicken-house": chickenLevel,
  storehouse: storeLevel,
  cellar: cellarLevel,
  feast: feastLevel,
  "farmer-mode": farmerLevel,
};

export function levelById(id: string): LevelDef {
  const found = LEVELS[id];
  if (!found) {
    throw new Error(`Missing level data: ${id}`);
  }
  return found;
}

export function tileAt(rows: string[], x: number, y: number): string {
  return rows[y]?.[x] ?? " ";
}

export function assertAllLevels(): void {
  for (const level of Object.values(LEVELS)) {
    if (level.rows.length === 0 || !level.rows[0]) {
      throw new Error(`Level ${level.id} has no rows`);
    }
    const width = level.rows[0].length;
    for (const [index, row] of level.rows.entries()) {
      if (row.length !== width) {
        throw new Error(`Level ${level.id} row ${index} width ${row.length} != ${width}`);
      }
    }
    const points = [
      level.spawn,
      level.hole,
      ...level.foods.map((food) => ({ x: food.x, y: food.y, id: food.id })),
      ...level.npcs.map((npc) => ({ x: npc.x, y: npc.y, id: npc.id })),
      ...level.cubs,
    ];
    for (const point of points) {
      if (point.x < 0 || point.y < 0 || point.x >= width || point.y >= level.rows.length) {
        throw new Error(`Level ${level.id} point is outside the map`);
      }
    }
    for (const label of level.labels) {
      if (label.x < 0 || label.y < 0 || label.x >= width || label.y >= level.rows.length) {
        throw new Error(`Level ${level.id} label "${label.title}" is outside the map`);
      }
    }
  }
}
