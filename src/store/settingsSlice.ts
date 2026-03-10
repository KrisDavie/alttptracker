import { createSlice } from "@reduxjs/toolkit";

export interface StatusColors {
  available: string;
  possible: string;
  ool: string;
  information: string;
  unavailable: string;
  checked: string;
  selected: string;
}

export const DEFAULT_STATUS_COLORS: StatusColors = {
  available: "#22c55e",
  possible: "#eab308",
  ool: "#7e22ce",
  information: "#06b6d4",
  unavailable: "#ef4444",
  checked: "rgba(107, 114, 128, 0.7)",
  selected: "#3b82f6",
};

export const DEFAULT_STATUS_TEXT_COLORS: StatusColors = {
  available: "#4ade80",
  possible: "#facc15",
  ool: "#c084fc",
  information: "#22d3ee",
  unavailable: "#f87171",
  checked: "#6b7280",
  selected: "#3b82f6",
};

export const defaultUserSequenceBreaks = {
  // All false by default, users can toggle these on to allow the logic to consider them as "possible but not guaranteed" options
  canNavigateDarkRooms: true,
};

// Type allows boolean values for all sequence break keys
export type UserSequenceBreaks = { [K in keyof typeof defaultUserSequenceBreaks]: boolean };

export interface SettingsState {
  // Mode Settings
  logicMode: "noglitches" | "overworldglitches" | "hybridglitches" | "nologic";
  worldState: "open" | "standard" | "inverted" | "inverted_1" | "standverted";
  wildSmallKeys: "inDungeon" | "wild" | "universal";
  wildBigKeys: boolean;
  wildMaps: boolean;
  wildCompasses: boolean;
  pottery: "none" | "keys" | "cave" | "cavekeys" | "reduced" | "clustered" | "nonempty" | "dungeon" | "lottery";
  enemyDrop: "none" | "keys" | "underworld";
  entranceMode: "none" | "dungeonssimple" | "dungeonsfull" | "lite" | "lean" | "simple" | "restricted" | "full" | "district" | "swapped" | "crossed" | "insanity";
  bossShuffle: "none" | "simple" | "full" | "random";
  enemyShuffle: "none" | "shuffled" | "random";
  goal: "ganon" | "fast_ganon" | "dungeons" | "pedestal" | "triforce_hunt";
  swords: "randomized" | "assured" | "vanilla" | "swordless";
  itemPool: "normal" | "hard" | "expert";
  activatedFlute: boolean;
  bonkShuffle: boolean;

  // OW Stuff
  owLayout: "vanilla" | "grid" | "wild" 
  owCrossed: "none" | "grouped" | "polar" | "unrestricted" 
  owMixed: boolean 
  owParallel: boolean
  owTerrain: boolean
  owKeepSimilar: boolean
  owWhirlpool: boolean
  owFluteShuffle: "vanilla" | "balanced" | "random"

  // UI settings
  autotracking: boolean;
  mapMode: "off" | "normal" | "compact" | "vertical";
  includeDungeonItemsInCounter?: boolean;
  connectionLinesMode: "none" | "caves" | "dungeons" | "all";
  connectionLineColor: string;

  // Player sequence break settings
  sequenceBreaks: UserSequenceBreaks;

  // Custom colors
  customColors?: Partial<StatusColors>;
  customTextColors?: Partial<StatusColors>;
}

const initialState: SettingsState = {
  logicMode: "noglitches",
  worldState: "open",
  wildSmallKeys: "inDungeon",
  wildBigKeys: false,
  wildMaps: false,
  wildCompasses: false,
  pottery: "none",
  enemyDrop: "none",
  entranceMode: "none",
  bossShuffle: "none",
  enemyShuffle: "none",
  goal: "fast_ganon",
  swords: "randomized",
  itemPool: "normal",
  activatedFlute: false,
  bonkShuffle: false,

  // OW Stuff
  owLayout: "vanilla",
  owCrossed: "none",
  owMixed: false,
  owParallel: false,
  owTerrain: false,
  owKeepSimilar: true,
  owWhirlpool: false,
  owFluteShuffle: "vanilla",

  // UI settings
  autotracking: true,
  includeDungeonItemsInCounter: false,
  mapMode: "normal",
  connectionLinesMode: "all",
  connectionLineColor: "#ff00f9ff",

  // Sequence breaks
  sequenceBreaks: defaultUserSequenceBreaks,
};

export const settingsSlice = createSlice({
  name: "trackerSettings",
  initialState,
  reducers: {
    setSettings: (state, action: { payload: Partial<SettingsState> }) => {
      const newState = { ...state, ...action.payload };
      return newState;

    },
    setWildSmallKeys: (state, action: { payload: "inDungeon" | "wild" | "universal" }) => {
      state.wildSmallKeys = action.payload;
    },
    toggleWildBigKeys: (state) => {
      state.wildBigKeys = !state.wildBigKeys;
    },
    setMapMode: (state, action: { payload: "off" | "normal" | "compact" | "vertical" }) => {
      state.mapMode = action.payload;
    },
    setSequenceBreaks: (state, action: { payload: Partial<UserSequenceBreaks> }) => {
      state.sequenceBreaks = { ...state.sequenceBreaks, ...action.payload };
    },
  },
});

export const { setSettings, setWildSmallKeys, toggleWildBigKeys, setSequenceBreaks } = settingsSlice.actions;
export default settingsSlice.reducer;
