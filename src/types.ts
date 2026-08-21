export type CharacterId =
  | "mrFox"
  | "mrsFox"
  | "smallFox"
  | "badger"
  | "mole"
  | "rabbit"
  | "weasel"
  | "boggis"
  | "bunce"
  | "bean";

export type FoxPartyId = Exclude<CharacterId, "boggis" | "bunce" | "bean">;
export type FarmerId = "boggis" | "bunce" | "bean";
export type SqueezeKind = "none" | "tight" | "slim" | "tiny";
export type FoodKind = "chicken" | "duck" | "goose" | "turkey" | "cider" | "ham";
export type FarmId = "boggis" | "bunce" | "bean";
export type TileCh =
  | " "
  | "#"
  | "."
  | ","
  | "="
  | "+"
  | "^"
  | "%"
  | "R"
  | "s"
  | "m"
  | "w"
  | "D"
  | "_"
  | "~"
  | "B"
  | "T"
  | "H";

export type SceneKey =
  | "Boot"
  | "Menu"
  | "Story"
  | "Wood"
  | "Tunnels"
  | "ChickenHouse"
  | "Storehouse"
  | "Cellar"
  | "Feast"
  | "FarmerMode";

export type ChapterKind = "cutscene" | "play";

export interface CharacterStats {
  id: CharacterId;
  name: string;
  title: string;
  role: string;
  speed: number;
  sneakSpeed: number;
  stealth: number;
  carry: number;
  dig: number;
  darkVision: number;
  squeeze: SqueezeKind;
  hear: number;
  quiet: number;
  lookout: boolean;
  planRoute: boolean;
  coneLength: number;
  coneAngle: number;
  bodyW: number;
  bodyH: number;
  farmer: boolean;
  ink: number;
  wash: number;
}

export interface CutscenePanel {
  art: string;
  caption: string;
  panX: number;
  panY: number;
  holdMs: number;
}

export interface CutsceneScript {
  id: string;
  title: string;
  panels: CutscenePanel[];
}

export interface ChapterDef {
  id: string;
  title: string;
  kind: ChapterKind;
  scene: SceneKey;
  cutsceneId?: string;
  next: string | null;
  unlocks: CharacterId[];
}

export interface SaveData {
  version: 1;
  chapterId: string;
  unlocked: CharacterId[];
  seenCutscenes: string[];
  farmerModeUnlocked: boolean;
  raids: {
    chickenHouse: boolean;
    storehouse: boolean;
    cellar: boolean;
  };
  found: {
    badger: boolean;
    mole: boolean;
    rabbit: boolean;
    weasel: boolean;
  };
  feastInvited: Array<"badger" | "mole" | "rabbit" | "weasel">;
  siegeComplete: boolean;
  woodComplete: boolean;
  gameComplete: boolean;
}

export interface PatrolDef {
  id: string;
  farmer: FarmerId;
  waypoints: Array<{ x: number; y: number; waitMs: number }>;
  speed: number;
}

export interface FoodDef {
  id: string;
  kind: FoodKind;
  farm: FarmId;
  x: number;
  y: number;
}

export interface NpcDef {
  id: "badger" | "mole" | "rabbit" | "weasel" | "mrsFox" | "family";
  x: number;
  y: number;
  label: string;
}

export interface LevelObjective {
  kind:
    | "stealVariety"
    | "reachDen"
    | "meetAnimals"
    | "depositFood"
    | "inviteFamilies"
    | "farmerWatch";
  stolenPerFarmMax: number;
  needEachFarm: number;
  needTotal: number;
  depositAt: "hole" | "den" | "dining";
  inviteNeed: number;
  foxEscapes: number;
}

export interface LevelDef {
  id: string;
  title: string;
  ink: string;
  ambient: "night" | "tunnel" | "interior" | "feast";
  tileSize: number;
  rows: string[];
  spawn: { x: number; y: number };
  hole: { x: number; y: number };
  patrols: PatrolDef[];
  foods: FoodDef[];
  npcs: NpcDef[];
  cubs: Array<{ x: number; y: number }>;
  collapseY: number;
  objective: LevelObjective;
  allowed: CharacterId[];
  forceCharacter?: CharacterId;
  darkness: number;
}

export const SAVE_KEY = "fantastic-mr-fox-save";
