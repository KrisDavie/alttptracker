import { createSlice } from "@reduxjs/toolkit";

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
  },
});

export const { setSettings, setWildSmallKeys, toggleWildBigKeys } = settingsSlice.actions;
export default settingsSlice.reducer;
