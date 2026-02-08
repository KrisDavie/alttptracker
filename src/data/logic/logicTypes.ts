import type { DungeonsState } from "@/store/dungeonsSlice";
import type { EntrancesState } from "@/store/entrancesSlice";
import type { ItemsState } from "@/store/itemsSlice";
import type { SettingsState } from "@/store/settingsSlice";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type LogicRequirement = string | { allOf?: LogicRequirement[] } | { anyOf?: LogicRequirement[] } | {};

export type LogicStatus = "unavailable" | "possible" | "ool" |  "available" | "information";

export type CrystalSwitchState = "blue" | "orange" | "unknown";

export interface LogicState {
  always?: LogicRequirement;
  logical?: LogicRequirement;
  required?: LogicRequirement;
  scout?: LogicRequirement;
}

export interface WorldLogic {
  Open?: LogicState | LogicRequirement;
  Inverted?: LogicState | LogicRequirement;
  Standard?: LogicState | LogicRequirement;
  Entrance?: string[];
}

export interface ExitLogic {
  [exitName: string]: {
      to: string;
      type: string;
      requirements: WorldLogic;
    }
}

export interface RegionLogic {
  type: string
  locations: { [locationName: string]: {
    requirements: WorldLogic;
    type?: string;
  } }
  entrances: string[]
  exits: ExitLogic
}


export interface RegionReachability {
  status: LogicStatus;
  bunnyState: boolean;
  crystalStates?: Set<CrystalSwitchState>; 
}

export interface DungeonTraversalResult {
  regionStatuses: Map<string, LogicStatus>; // Internal region statuses
  exitStatuses: Map<string, LogicStatus>; // Dungeon -> Overworld exits
  bigKeyGatedRegions?: Set<string>; // Regions only reachable through a bigkey exit
}

export interface GameState {
  items: ItemsState;
  settings: SettingsState;
  dungeons: DungeonsState;
  entrances: EntrancesState;
  checks?: Record<string, { checked: boolean }>;
}


export type LogicData = Record<string, LogicState>;
export type WorldLogicData = Record<string, WorldLogic>;
export type DungeonLogicData = Record<string, LogicData>;

